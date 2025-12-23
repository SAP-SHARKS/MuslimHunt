
import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import SubmitForm from './components/SubmitForm';
import Auth from './components/Auth';
import UserProfile from './components/UserProfile';
import { Product, User, View, Comment, Profile } from './types';
import { INITIAL_PRODUCTS } from './constants';
import { Sparkles, X, Search, Loader2 } from 'lucide-react';
import { supabase } from './lib/supabase';
import { searchProducts } from './utils/searchUtils';

function ConnectionDebug() {
  const url = (import.meta as any)?.env?.VITE_SUPA_URL;
  const key = (import.meta as any)?.env?.VITE_SUPA_KEY;
  const geminiKey = process.env.API_KEY;
  
  return (
    <div style={{ 
      background: url && key ? '#e6fffa' : '#ffeeee', 
      padding: '10px', 
      border: `1px solid ${url && key ? '#38b2ac' : 'red'}`, 
      position: 'fixed', 
      top: 0, 
      right: 0, 
      zIndex: 9999, 
      fontSize: '10px', 
      color: url && key ? '#234e52' : '#880000', 
      borderRadius: '0 0 0 12px',
      pointerEvents: 'none'
    }}>
      Supa: {url ? '✅' : '❌'} | Gemini: {geminiKey ? '✅' : '❌'}
    </div>
  );
}

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.HOME);
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [votes, setVotes] = useState<Set<string>>(new Set());
  const [commentVotes, setCommentVotes] = useState<Set<string>>(new Set());
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [shouldScrollToComments, setShouldScrollToComments] = useState(false);

  // Auth State Listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          username: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'Member',
          avatar_url: session.user.user_metadata.avatar_url || `https://i.pravatar.cc/150?u=${session.user.id}`
        });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          username: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'Member',
          avatar_url: session.user.user_metadata.avatar_url || `https://i.pravatar.cc/150?u=${session.user.id}`
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load Persistence (Mocking Supabase for now)
  useEffect(() => {
    const savedProducts = localStorage.getItem('mh_products_v5');
    const savedVotes = localStorage.getItem('mh_votes_v5');
    const savedCVotes = localStorage.getItem('mh_cvotes_v5');

    if (savedProducts) setProducts(JSON.parse(savedProducts));
    else setProducts(INITIAL_PRODUCTS);

    if (savedVotes) setVotes(new Set(JSON.parse(savedVotes)));
    if (savedCVotes) setCommentVotes(new Set(JSON.parse(savedCVotes)));
    
    setIsLoading(false);
  }, []);

  // Sync Persistence
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('mh_products_v5', JSON.stringify(products));
      localStorage.setItem('mh_votes_v5', JSON.stringify(Array.from(votes)));
      localStorage.setItem('mh_cvotes_v5', JSON.stringify(Array.from(commentVotes)));
    }
  }, [products, votes, commentVotes, isLoading]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setView(View.HOME);
  };

  const handleViewProfile = async (userId: string) => {
    setIsLoading(true);
    try {
      // Restore dynamic profile clicking logic: Fetch clicked user's data from Supabase
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (profile) {
        setSelectedProfile({
          id: profile.id,
          username: profile.username,
          avatar_url: profile.avatar_url,
          bio: profile.bio || 'Product Maker & Community Contributor',
          headline: profile.headline || 'Halal Tech Explorer',
          twitter_url: profile.twitter_url,
          website_url: profile.website_url
        });
      } else {
        // Fallback for missing profile records
        setSelectedProfile({
          id: userId,
          username: 'Community Member',
          avatar_url: `https://i.pravatar.cc/150?u=${userId}`,
          bio: 'Part of the growing Muslim Hunt ecosystem.',
          headline: 'User'
        });
      }
      setView(View.PROFILE);
    } catch (err) {
      console.error("Error loading user profile:", err);
      alert("Could not load user profile details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpvote = (productId: string) => {
    if (!user) {
      setView(View.LOGIN);
      return;
    }

    const voteKey = `${user.id}_${productId}`;
    setVotes(prev => {
      const next = new Set(prev);
      if (next.has(voteKey)) {
        next.delete(voteKey);
        setProducts(curr => curr.map(p => p.id === productId ? { ...p, upvotes_count: p.upvotes_count - 1 } : p));
      } else {
        next.add(voteKey);
        setProducts(curr => curr.map(p => p.id === productId ? { ...p, upvotes_count: p.upvotes_count + 1 } : p));
      }
      return next;
    });
  };

  const handleCommentUpvote = (productId: string, commentId: string) => {
    if (!user) {
      setView(View.LOGIN);
      return;
    }

    const voteKey = `${user.id}_${commentId}`;
    setCommentVotes(prev => {
      const next = new Set(prev);
      const isUpvoting = !next.has(voteKey);
      
      if (isUpvoting) next.add(voteKey); else next.delete(voteKey);
      
      setProducts(curr => curr.map(p => {
        if (p.id === productId) {
          const updatedComments = (p.comments || []).map(c => 
            c.id === commentId ? { ...c, upvotes_count: isUpvoting ? (c.upvotes_count || 0) + 1 : Math.max(0, (c.upvotes_count || 0) - 1) } : c
          );
          const updatedProduct = { ...p, comments: updatedComments };
          if (selectedProduct?.id === productId) setSelectedProduct(updatedProduct);
          return updatedProduct;
        }
        return p;
      }));

      return next;
    });
  };

  const handleNewProduct = (formData: any) => {
    const newProduct: Product = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      founder_id: user?.id || 'anonymous',
      upvotes_count: 0,
      comments: []
    };
    setProducts([newProduct, ...products]);
    setView(View.HOME);
  };

  const handleAddComment = (text: string) => {
    if (!user || !selectedProduct) return;
    
    const newComment: Comment = {
      id: 'c_' + Math.random().toString(36).substr(2, 9),
      user_id: user.id,
      product_id: selectedProduct.id,
      username: user.username,
      avatar_url: user.avatar_url,
      text,
      created_at: new Date().toISOString(),
      is_maker: selectedProduct.founder_id === user.id,
      upvotes_count: 0
    };

    setProducts(prev => prev.map(p => {
      if (p.id === selectedProduct.id) {
        const updated = { ...p, comments: [newComment, ...(p.comments || [])] };
        setSelectedProduct(updated);
        return updated;
      }
      return p;
    }));
  };

  const handleProductClick = (product: Product, andScrollToComments: boolean = false) => {
    setSelectedProduct(product);
    setShouldScrollToComments(andScrollToComments);
    setView(View.DETAIL);
  };

  const groupedProducts = useMemo(() => {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    const filteredProducts = searchProducts(products, searchQuery);
    const sorted = [...filteredProducts].sort((a, b) => b.upvotes_count - a.upvotes_count);
    
    return {
      today: sorted.filter(p => new Date(p.created_at).toDateString() === today),
      yesterday: sorted.filter(p => new Date(p.created_at).toDateString() === yesterday),
      past: sorted.filter(p => {
        const d = new Date(p.created_at).toDateString();
        return d !== today && d !== yesterday;
      })
    };
  }, [products, searchQuery]);

  const renderContent = () => {
    if (view === View.LOGIN) return <div className="flex flex-col items-center justify-center min-h-[80vh]"><Auth onSuccess={() => setView(View.HOME)} /></div>;
    if (view === View.SUBMIT) return <SubmitForm onCancel={() => setView(View.HOME)} onSubmit={handleNewProduct} />;

    if (view === View.PROFILE && selectedProfile) {
      return (
        <UserProfile
          profile={selectedProfile}
          currentUser={user}
          products={products}
          votes={votes}
          onBack={() => setView(View.HOME)}
          onProductClick={(prod) => handleProductClick(prod)}
          onCommentClick={(prod) => handleProductClick(prod, true)}
          onUpvote={handleUpvote}
        />
      );
    }

    if (view === View.DETAIL && selectedProduct) {
      return (
        <ProductDetail 
          product={selectedProduct} 
          user={user}
          onBack={() => {
            setView(View.HOME);
            setShouldScrollToComments(false);
          }}
          onUpvote={handleUpvote}
          onCommentUpvote={handleCommentUpvote}
          hasUpvoted={votes.has(`${user?.id}_${selectedProduct.id}`)}
          commentVotes={commentVotes}
          onAddComment={handleAddComment}
          onViewProfile={handleViewProfile}
          scrollToComments={shouldScrollToComments}
        />
      );
    }

    // Default: Home View with full main section mapping
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <header className="mb-12 text-center md:text-left md:flex md:items-center md:justify-between border-b border-emerald-50 pb-12 overflow-hidden">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 text-emerald-800 font-black mb-4">
              <Sparkles className="w-5 h-5" />
              <span className="text-xs tracking-[0.2em] uppercase">Halal Trust Layer</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-emerald-900 leading-[1.05] tracking-tight whitespace-nowrap lg:whitespace-normal">
              Discovery for the <br /><span className="text-emerald-700 italic">Modern Ummah.</span>
            </h1>
          </div>
        </header>

        <main className="space-y-16">
          {[
            { title: 'Freshly Launched', data: groupedProducts.today, color: 'emerald' },
            { title: 'Trending Yesterday', data: groupedProducts.yesterday, color: 'gray' },
            { title: 'The Archives', data: groupedProducts.past, color: 'gray' }
          ].map(section => section.data.length > 0 && (
            <section key={section.title}>
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xs font-black text-${section.color}-800/40 uppercase tracking-[0.3em]`}>{section.title}</h2>
                <div className={`h-[1px] flex-1 bg-${section.color}-50 ml-6`}></div>
              </div>
              <div className="space-y-3 bg-white rounded-[2.5rem] border border-gray-100 p-3 shadow-sm">
                {section.data.map(p => (
                  <ProductCard 
                    key={p.id} 
                    product={p} 
                    onUpvote={handleUpvote} 
                    hasUpvoted={votes.has(`${user?.id}_${p.id}`)}
                    onClick={handleProductClick}
                    onCommentClick={(prod) => handleProductClick(prod, true)}
                    searchQuery={searchQuery}
                  />
                ))}
              </div>
            </section>
          ))}
        </main>
      </div>
    );
  };

  return (
    <div className="min-h-screen pb-20 bg-cream">
      <ConnectionDebug />
      <Navbar 
        user={user} 
        currentView={view} 
        setView={setView} 
        onLogout={handleLogout} 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onViewProfile={() => user && handleViewProfile(user.id)}
      />
      <div className="pt-4">{renderContent()}</div>
    </div>
  );
};

export default App;
