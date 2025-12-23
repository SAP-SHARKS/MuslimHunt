import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import SubmitForm from './components/SubmitForm';
import Auth from './components/Auth';
import UserProfile from './components/UserProfile';
import { Product, User, View, Comment } from './types';
import { INITIAL_PRODUCTS } from './constants';
import { Sparkles, X, Search } from 'lucide-react';
import { supabase } from './lib/supabase';
import { searchProducts } from './utils/searchUtils';

function ConnectionDebug() {
  // Use optional chaining to prevent crashes if import.meta.env is not yet available
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
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
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

  // Load persistence for products/votes
  useEffect(() => {
    const savedProducts = localStorage.getItem('mh_products_v4');
    const savedVotes = localStorage.getItem('mh_votes');

    if (savedProducts) setProducts(JSON.parse(savedProducts));
    else setProducts(INITIAL_PRODUCTS);

    if (savedVotes) setVotes(new Set(JSON.parse(savedVotes)));
    
    setIsLoading(false);
  }, []);

  // Sync persistence
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('mh_products_v4', JSON.stringify(products));
      localStorage.setItem('mh_votes', JSON.stringify(Array.from(votes)));
    }
  }, [products, votes, isLoading]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setView(View.HOME);
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
      username: user.username,
      avatar_url: user.avatar_url,
      text,
      created_at: new Date().toISOString(),
      is_maker: selectedProduct.founder_id === user.id
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

  const handleViewProfile = (userId: string, username: string, email: string, avatar: string) => {
    setSelectedUser({
      id: userId,
      username,
      email,
      avatar_url: avatar
    });
    setView(View.PROFILE);
  };

  const handleProductClick = (product: Product, andScrollToComments: boolean = false) => {
    setSelectedProduct(product);
    setShouldScrollToComments(andScrollToComments);
    setView(View.DETAIL);
  };

  const groupedProducts = useMemo(() => {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    // First filter by search query
    const filteredProducts = searchProducts(products, searchQuery);
    
    // Then sort by upvotes
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
    if (view === View.LOGIN) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
          <Auth onSuccess={() => setView(View.HOME)} />
        </div>
      );
    }

    if (view === View.SUBMIT) {
      return <SubmitForm onCancel={() => setView(View.HOME)} onSubmit={handleNewProduct} />;
    }

    if (view === View.PROFILE && selectedUser) {
      return (
        <UserProfile
          profileUser={selectedUser}
          currentUser={user}
          products={products}
          votes={votes}
          onBack={() => setView(View.HOME)}
          onProductClick={(prod) => handleProductClick(prod)}
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
          hasUpvoted={votes.has(`${user?.id}_${selectedProduct.id}`)}
          onAddComment={handleAddComment}
          onViewProfile={handleViewProfile}
          scrollToComments={shouldScrollToComments}
        />
      );
    }

    const totalResults = groupedProducts.today.length + groupedProducts.yesterday.length + groupedProducts.past.length;

    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <header className="mb-12 text-center md:text-left md:flex md:items-center md:justify-between border-b border-emerald-50 pb-12">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 text-emerald-800 font-black mb-4">
              <Sparkles className="w-5 h-5" />
              <span className="text-xs tracking-[0.2em] uppercase">Halal Trust Layer</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-emerald-900 leading-[1.05] tracking-tight">
              Discovery for the <br /><span className="text-emerald-700 italic">Modern Ummah.</span>
            </h1>
          </div>
          <div className="hidden md:block max-w-[200px] text-gray-400 font-black text-[10px] leading-loose tracking-[0.2em] text-right opacity-60">
            CURATED SOFTWARE<br />BUILT BY BELIEVERS<br />FOR THE GLOBAL HUB
          </div>
        </header>

        {searchQuery && (
          <div className="max-w-4xl mx-auto mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl px-6 py-4 flex items-center justify-between shadow-sm">
              <div>
                <p className="text-emerald-900 font-bold">
                  Found {totalResults} {totalResults === 1 ? 'product' : 'products'} matching "{searchQuery}"
                </p>
              </div>
              <button
                onClick={() => setSearchQuery('')}
                className="text-emerald-800 hover:text-emerald-900 font-bold text-sm flex items-center gap-2 px-3 py-1.5 hover:bg-emerald-100 rounded-lg transition-colors"
              >
                Clear search
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <main className="space-y-16">
          {groupedProducts.today.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xs font-black text-emerald-800/40 uppercase tracking-[0.3em]">Freshly Launched</h2>
                <div className="h-[1px] flex-1 bg-emerald-50 ml-6"></div>
              </div>
              <div className="space-y-3 bg-white rounded-[2.5rem] border border-gray-100 p-3 shadow-sm">
                {groupedProducts.today.map(p => (
                  <ProductCard 
                    key={p.id} 
                    product={p} 
                    onUpvote={handleUpvote} 
                    hasUpvoted={votes.has(`${user?.id}_${p.id}`)}
                    onClick={(prod) => handleProductClick(prod)}
                    onCommentClick={(prod) => handleProductClick(prod, true)}
                    searchQuery={searchQuery}
                  />
                ))}
              </div>
            </section>
          )}

          {groupedProducts.yesterday.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xs font-black text-gray-300 uppercase tracking-[0.3em]">Trending Yesterday</h2>
                <div className="h-[1px] flex-1 bg-gray-50 ml-6"></div>
              </div>
              <div className="space-y-3 bg-white/50 rounded-[2.5rem] border border-gray-100 p-3 shadow-sm">
                {groupedProducts.yesterday.map(p => (
                  <ProductCard 
                    key={p.id} 
                    product={p} 
                    onUpvote={handleUpvote} 
                    hasUpvoted={votes.has(`${user?.id}_${p.id}`)}
                    onClick={(prod) => handleProductClick(prod)}
                    onCommentClick={(prod) => handleProductClick(prod, true)}
                    searchQuery={searchQuery}
                  />
                ))}
              </div>
            </section>
          )}

          {groupedProducts.past.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xs font-black text-gray-300 uppercase tracking-[0.3em]">The Archives</h2>
                <div className="h-[1px] flex-1 bg-gray-50 ml-6"></div>
              </div>
              <div className="space-y-3 bg-white/30 rounded-[2.5rem] border border-gray-100 p-3 shadow-sm">
                {groupedProducts.past.map(p => (
                  <ProductCard 
                    key={p.id} 
                    product={p} 
                    onUpvote={handleUpvote} 
                    hasUpvoted={votes.has(`${user?.id}_${p.id}`)}
                    onClick={(prod) => handleProductClick(prod)}
                    onCommentClick={(prod) => handleProductClick(prod, true)}
                    searchQuery={searchQuery}
                  />
                ))}
              </div>
            </section>
          )}
          
          {!products.length && !searchQuery && (
            <div className="text-center py-32 bg-white border-4 border-dashed border-emerald-50 rounded-[4rem] flex flex-col items-center justify-center">
              <Sparkles className="w-12 h-12 text-emerald-100 mb-4" />
              <p className="text-emerald-900/20 font-serif text-3xl italic">Awaiting the next great launch...</p>
            </div>
          )}

          {searchQuery && totalResults === 0 && (
            <div className="text-center py-32 bg-white border-4 border-dashed border-emerald-50 rounded-[4rem] flex flex-col items-center justify-center">
              <Search className="w-12 h-12 text-emerald-100 mb-4" />
              <p className="text-emerald-900/20 font-serif text-3xl italic mb-2">No products found</p>
              <p className="text-gray-400">Try adjusting your search terms</p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-6 px-6 py-3 bg-emerald-800 text-white rounded-xl font-bold hover:bg-emerald-900 transition-colors"
              >
                Clear Search
              </button>
            </div>
          )}
        </main>
      </div>
    );
  };

  return (
    <div className="min-h-screen pb-20 selection:bg-emerald-100 selection:text-emerald-900">
      <ConnectionDebug />
      <Navbar 
        user={user} 
        currentView={view} 
        setView={setView} 
        onLogout={handleLogout} 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onViewProfile={() => {
          if (user) {
            handleViewProfile(user.id, user.username, user.email, user.avatar_url);
          }
        }}
      />
      <div className="pt-4">
        {renderContent()}
      </div>
    </div>
  );
};

export default App;