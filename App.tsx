
import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import SubmitForm from './components/SubmitForm';
import Auth from './components/Auth';
import UserProfile from './components/UserProfile';
import NewThreadForm from './components/NewThreadForm';
import { Product, User, View, Comment, Profile } from './types';
import { INITIAL_PRODUCTS } from './constants';
import { Sparkles, MessageSquare, TrendingUp, Users, ArrowRight, Triangle, Plus } from 'lucide-react';
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

const TrendingSidebar: React.FC<{ user: User | null; setView: (v: View) => void }> = ({ user, setView }) => (
  <aside className="hidden lg:block w-80 shrink-0">
    <div className="sticky top-24 space-y-8">
      <section className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Trending Discussions</h3>
          <TrendingUp className="w-3.5 h-3.5 text-emerald-800" />
        </div>
        
        <div className="space-y-6">
          {[
            { 
              title: "Building in Public: My journey from 0 to 100 users", 
              comments: 24, 
              upvotes: 156, 
              online: 8,
              icon: "🚀"
            },
            { 
              title: "Which tech stack is best for Halal e-commerce?", 
              comments: 18, 
              upvotes: 92, 
              online: 12,
              icon: "💻"
            },
            { 
              title: "Seeking Beta Testers for a new prayer app", 
              comments: 42, 
              upvotes: 310, 
              online: 15,
              icon: "🙏"
            },
            { 
              title: "The future of Ethical AI in the Muslim world", 
              comments: 31, 
              upvotes: 204, 
              online: 5,
              icon: "🤖"
            }
          ].map((thread, i) => (
            <div key={i} className="group cursor-pointer">
              <div className="flex items-start gap-3">
                <span className="text-lg leading-none pt-0.5">{thread.icon}</span>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-gray-900 group-hover:text-emerald-800 transition-colors leading-snug mb-2">
                    {thread.title}
                  </h4>
                  <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                    <div className="flex items-center gap-1">
                      <Triangle className="w-2.5 h-2.5 fill-gray-400" />
                      {thread.upvotes}
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-2.5 h-2.5" />
                      {thread.comments}
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      {thread.online} online
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 space-y-4 pt-6 border-t border-gray-50">
          <button className="w-full text-center text-sm font-bold text-gray-500 hover:text-emerald-800 transition-colors">
            View all
          </button>
          
          <button 
            onClick={() => user ? setView(View.NEW_THREAD) : setView(View.LOGIN)}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-100 py-3 rounded-xl text-xs font-black text-gray-700 uppercase tracking-widest hover:border-emerald-800 hover:text-emerald-800 hover:bg-emerald-50 transition-all shadow-sm active:scale-95"
          >
            <Plus className="w-4 h-4" /> Start new thread
          </button>
        </div>
      </section>

      <section className="bg-emerald-800 rounded-[2rem] p-8 text-white shadow-xl shadow-emerald-900/10 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Sparkles className="w-24 h-24 rotate-12" />
        </div>
        <div className="relative z-10">
          <h3 className="text-xs font-black text-emerald-300 uppercase tracking-[0.2em] mb-4">Weekly Newsletter</h3>
          <p className="text-base font-bold text-white mb-6 leading-relaxed">
            Get the best Muslim tech products delivered to your inbox every Friday.
          </p>
          <div className="space-y-3">
            <input 
              type="email" 
              placeholder="Email address"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl outline-none focus:bg-white/20 transition-all text-sm placeholder:text-emerald-200/50"
            />
            <button className="w-full bg-white text-emerald-900 py-3.5 rounded-xl text-sm font-black shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all active:scale-[0.98]">
              Subscribe Now
            </button>
          </div>
          <p className="mt-4 text-[10px] text-emerald-200/50 font-medium text-center italic">
            No spam, just pure Halal tech goodness.
          </p>
        </div>
      </section>
    </div>
  </aside>
);

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
  
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    today: false,
    yesterday: false,
    lastWeek: false,
    lastMonth: false
  });

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
    const now = Date.now();
    const todayStr = new Date().toDateString();
    const yesterdayStr = new Date(now - 86400000).toDateString();
    const lastWeekLimit = now - 7 * 24 * 60 * 60 * 1000;
    const lastMonthLimit = now - 30 * 24 * 60 * 60 * 1000;
    
    const filteredProducts = searchProducts(products, searchQuery);
    const sorted = [...filteredProducts].sort((a, b) => b.upvotes_count - a.upvotes_count);
    
    return {
      today: sorted.filter(p => new Date(p.created_at).toDateString() === todayStr),
      yesterday: sorted.filter(p => new Date(p.created_at).toDateString() === yesterdayStr),
      lastWeek: sorted.filter(p => {
        const d = new Date(p.created_at);
        const dateStr = d.toDateString();
        const time = d.getTime();
        return dateStr !== todayStr && dateStr !== yesterdayStr && time > lastWeekLimit;
      }),
      lastMonth: sorted.filter(p => {
        const d = new Date(p.created_at);
        const dateStr = d.toDateString();
        const time = d.getTime();
        return dateStr !== todayStr && dateStr !== yesterdayStr && time <= lastWeekLimit && time > lastMonthLimit;
      })
    };
  }, [products, searchQuery]);

  const renderContent = () => {
    if (view === View.LOGIN) return <div className="flex flex-col items-center justify-center min-h-[80vh]"><Auth onSuccess={() => setView(View.HOME)} /></div>;
    if (view === View.SUBMIT) return <SubmitForm onCancel={() => setView(View.HOME)} onSubmit={handleNewProduct} />;
    if (view === View.NEW_THREAD) return <NewThreadForm onCancel={() => setView(View.HOME)} onSubmit={(data) => { console.log('Thread created:', data); setView(View.HOME); }} />;

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

    return (
      <div className="max-w-7xl mx-auto py-8 px-4 flex flex-col lg:flex-row gap-12">
        <div className="flex-1">
          <header className="mb-12 border-b border-emerald-50 pb-8">
            <div className="flex items-center gap-2 text-emerald-800 font-black mb-4">
              <Sparkles className="w-5 h-5" />
              <span className="text-xs tracking-[0.2em] uppercase">Halal Trust Layer</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-emerald-900 leading-tight">
              Top Products Launching <br /><span className="text-emerald-700 italic">Today.</span>
            </h1>
          </header>

          <main className="space-y-16">
            {[
              { id: 'today', title: 'Top Products Launching Today', data: groupedProducts.today, color: 'emerald' },
              { id: 'yesterday', title: "Yesterday's Top Products", data: groupedProducts.yesterday, color: 'gray' },
              { id: 'lastWeek', title: "Last Week's Top Products", data: groupedProducts.lastWeek, color: 'gray' },
              { id: 'lastMonth', title: "Last Month's Top Products", data: groupedProducts.lastMonth, color: 'gray' }
            ].map(section => {
              const isExpanded = expandedSections[section.id];
              const displayData = isExpanded ? section.data : section.data.slice(0, 5);
              const hasMore = section.data.length > 5 && !isExpanded;
              
              const buttonTextMap: Record<string, string> = {
                today: "See all of today's products",
                yesterday: "See all of yesterday's top products",
                lastWeek: "See all of last week's top products",
                lastMonth: "See all of last month's top products"
              };

              return section.data.length > 0 && (
                <section key={section.title}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className={`text-xs font-black text-${section.color}-800/40 uppercase tracking-[0.3em]`}>{section.title}</h2>
                    <div className={`h-[1px] flex-1 bg-${section.color}-50 ml-6`}></div>
                  </div>
                  <div className="space-y-1 bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
                    {displayData.map((p, idx) => (
                      <ProductCard 
                        key={p.id} 
                        product={p} 
                        onUpvote={handleUpvote} 
                        hasUpvoted={votes.has(`${user?.id}_${p.id}`)}
                        onClick={handleProductClick}
                        onCommentClick={(prod) => handleProductClick(prod, true)}
                        searchQuery={searchQuery}
                        rank={idx + 1}
                      />
                    ))}
                  </div>
                  {hasMore && (
                    <button 
                      onClick={() => setExpandedSections(prev => ({ ...prev, [section.id]: true }))}
                      className="w-full py-4 mt-4 border border-gray-100 rounded-full text-sm font-bold text-gray-500 hover:bg-white hover:shadow-sm transition-all bg-white/50"
                    >
                      {buttonTextMap[section.id]}
                    </button>
                  )}
                </section>
              );
            })}
          </main>
        </div>
        
        <TrendingSidebar user={user} setView={setView} />
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
