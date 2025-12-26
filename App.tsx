import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import SubmitForm from './components/SubmitForm';
import Auth from './components/Auth';
import UserProfile from './components/UserProfile';
import NewThreadForm from './components/NewThreadForm';
import ForumHome from './components/ForumHome';
import RecentComments from './components/RecentComments';
import Sponsor from './components/Sponsor';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import { Product, User, View, Comment, Profile } from './types';
import { INITIAL_PRODUCTS } from './constants';
import { Sparkles, MessageSquare, TrendingUp, Users, ArrowRight, Triangle, Plus, Hash, Layout } from 'lucide-react';
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

export const TrendingSidebar: React.FC<{ user: User | null; setView: (v: View) => void }> = ({ user, setView }) => (
  <aside className="hidden xl:block w-80 shrink-0">
    <div className="sticky top-24 space-y-8">
      <section className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8 border-b border-gray-50 pb-4">
          <h3 
            className="text-[11px] font-black text-gray-900 uppercase tracking-[0.2em] cursor-pointer hover:text-emerald-800 transition-colors"
            onClick={() => setView(View.FORUM_HOME)}
          >
            Trending Forum Threads
          </h3>
          <TrendingUp className="w-4 h-4 text-emerald-800 opacity-50" />
        </div>
        
        <div className="space-y-7">
          {[
            { 
              tag: "p/producthunt",
              title: "What are your favorite Halal-certified apps for 2025?", 
              comments: 24, 
              upvotes: 156, 
              online: 8,
              icon: Layout
            },
            { 
              tag: "p/vibecoding",
              title: "Which tech stack is best for Halal e-commerce?", 
              comments: 18, 
              upvotes: 92, 
              online: 12,
              icon: Hash
            },
            { 
              tag: "p/general",
              title: "Seeking Beta Testers for a new prayer app", 
              comments: 42, 
              upvotes: 310, 
              online: 15,
              icon: Users
            }
          ].map((thread, i) => (
            <div key={i} className="group cursor-pointer" onClick={() => setView(View.FORUM_HOME)}>
              <div className="flex flex-col gap-1.5">
                {/* Forum Tag Line */}
                <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-emerald-800 transition-colors">
                  <thread.icon className="w-3 h-3 opacity-60" />
                  <span>{thread.tag}</span>
                </div>
                
                {/* Thread Title */}
                <h4 className="text-[13px] font-bold text-gray-900 group-hover:text-emerald-800 transition-colors leading-snug tracking-tight">
                  {thread.title}
                </h4>

                {/* Interaction Stat Line - High Density */}
                <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                  <div className="flex items-center gap-1">
                    <Triangle className="w-2.5 h-2.5 fill-gray-400 group-hover:fill-emerald-800 transition-colors" />
                    {thread.upvotes}
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-2.5 h-2.5" />
                    {thread.comments}
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1.5 text-emerald-600/70 font-black">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {thread.online} online
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 space-y-4 pt-8 border-t border-gray-50">
          <button 
            onClick={() => setView(View.FORUM_HOME)}
            className="w-full flex items-center justify-center gap-2 py-2 text-[10px] font-black text-gray-400 hover:text-emerald-800 transition-colors uppercase tracking-[0.2em]"
          >
            View all discussions <ArrowRight className="w-3.5 h-3.5" />
          </button>
          
          <button 
            onClick={() => user ? setView(View.NEW_THREAD) : setView(View.LOGIN)}
            className="w-full flex items-center justify-center gap-2 bg-emerald-50 border border-emerald-100 py-4 rounded-2xl text-xs font-black text-emerald-800 uppercase tracking-widest hover:bg-emerald-800 hover:text-white transition-all shadow-sm active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" /> Start new thread
          </button>
        </div>
      </section>

      <section className="bg-[#042119] rounded-[2.5rem] p-10 text-white shadow-2xl shadow-emerald-900/20 overflow-hidden relative group">
        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
          <Sparkles className="w-32 h-32 rotate-12" />
        </div>
        <div className="relative z-10">
          <h3 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.25em] mb-4">The Weekly Dispatch</h3>
          <p className="text-lg font-bold text-white mb-8 leading-relaxed">
            Curated Halal tech products delivered every Friday.
          </p>
          <div className="space-y-4">
            <input 
              type="email" 
              placeholder="Your email address"
              className="w-full px-5 py-4 bg-emerald-900/50 border border-emerald-800 rounded-2xl outline-none focus:bg-emerald-900 focus:border-emerald-700 transition-all text-sm placeholder:text-emerald-700 font-medium"
            />
            <button className="w-full bg-emerald-700 hover:bg-emerald-600 text-white py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl transition-all active:scale-[0.98]">
              Join the list
            </button>
          </div>
          <p className="mt-6 text-[10px] text-emerald-800 font-black text-center uppercase tracking-tighter italic">
            Trusted by 12,000+ Founders
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

  // Native History API Routing logic
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/p/new') {
        setView(View.NEW_THREAD);
      } else if (path === '/forums') {
        setView(View.FORUM_HOME);
      } else if (path === '/forums/comments') {
        setView(View.RECENT_COMMENTS);
      } else if (path === '/sponsor') {
        setView(View.SPONSOR);
      } else if (path === '/newsletters') {
        setView(View.NEWSLETTER);
      } else if (path === '/') {
        setView(View.HOME);
      }
    };

    window.addEventListener('popstate', handlePopState);
    handlePopState(); // Initial sync on load

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const updateView = (newView: View) => {
    setView(newView);
    let path = '/';
    if (newView === View.NEW_THREAD) path = '/p/new';
    else if (newView === View.FORUM_HOME) path = '/forums';
    else if (newView === View.RECENT_COMMENTS) path = '/forums/comments';
    else if (newView === View.SPONSOR) path = '/sponsor';
    else if (newView === View.NEWSLETTER) path = '/newsletters';
    
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
  };

  // Initial Auth Check
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

  // Fetch Products and Comments from Supabase
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        let { data: dbProducts } = await supabase.from('products').select('*');
        const baseProducts = (dbProducts && dbProducts.length > 0) ? dbProducts : INITIAL_PRODUCTS;

        let { data: dbComments } = await supabase
          .from('comments')
          .select('*')
          .order('created_at', { ascending: false });

        const commentsMap = (dbComments || []).reduce((acc: any, comment: any) => {
          if (!acc[comment.product_id]) acc[comment.product_id] = [];
          acc[comment.product_id].push(comment);
          return acc;
        }, {});

        const productsWithComments = baseProducts.map(p => ({
          ...p,
          comments: [
            ...(commentsMap[p.id] || []),
            ...(INITIAL_PRODUCTS.find(ip => ip.id === p.id)?.comments || [])
          ].filter((c, index, self) => index === self.findIndex((t) => t.id === c.id))
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        }));

        setProducts(productsWithComments);

        const savedVotes = localStorage.getItem('mh_votes_v5');
        const savedCVotes = localStorage.getItem('mh_cvotes_v5');
        if (savedVotes) setVotes(new Set(JSON.parse(savedVotes)));
        if (savedCVotes) setCommentVotes(new Set(JSON.parse(savedCVotes)));

      } catch (err) {
        console.error("Error fetching data:", err);
        setProducts(INITIAL_PRODUCTS);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('mh_votes_v5', JSON.stringify(Array.from(votes)));
      localStorage.setItem('mh_cvotes_v5', JSON.stringify(Array.from(commentVotes)));
    }
  }, [votes, commentVotes, isLoading]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    updateView(View.HOME);
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
    updateView(View.HOME);
  };

  const handleAddComment = async (text: string) => {
    if (!user || !selectedProduct) return;
    
    const newComment: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      product_id: selectedProduct.id,
      user_id: user.id,
      username: user.username,
      avatar_url: user.avatar_url,
      text,
      created_at: new Date().toISOString(),
      upvotes_count: 0
    };

    setProducts(curr => curr.map(p => {
      if (p.id === selectedProduct.id) {
        const updatedComments = [newComment, ...(p.comments || [])];
        const updatedProduct = { ...p, comments: updatedComments };
        if (selectedProduct?.id === p.id) setSelectedProduct(updatedProduct);
        return updatedProduct;
      }
      return p;
    }));
  };

  const filteredProducts = useMemo(() => searchProducts(products, searchQuery), [products, searchQuery]);

  // High-Fidelity Historical Grouping Logic
  const groupedProducts = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const yesterdayStart = todayStart - 86400000;
    const lastWeekStart = todayStart - 7 * 86400000;
    const lastMonthStart = todayStart - 30 * 86400000;

    const grouped = {
      today: [] as Product[],
      yesterday: [] as Product[],
      lastWeek: [] as Product[],
      lastMonth: [] as Product[]
    };

    filteredProducts.forEach(p => {
      const time = new Date(p.created_at).getTime();
      if (time >= todayStart) grouped.today.push(p);
      else if (time >= yesterdayStart) grouped.yesterday.push(p);
      else if (time >= lastWeekStart) grouped.lastWeek.push(p);
      else if (time >= lastMonthStart) grouped.lastMonth.push(p);
    });

    // Sort each group by upvotes
    const sortFn = (a: Product, b: Product) => b.upvotes_count - a.upvotes_count;
    grouped.today.sort(sortFn);
    grouped.yesterday.sort(sortFn);
    grouped.lastWeek.sort(sortFn);
    grouped.lastMonth.sort(sortFn);

    return grouped;
  }, [filteredProducts]);

  const feedSections = [
    { id: 'today', title: "Top Products Launching Today", data: groupedProducts.today, buttonText: "See all of today's products" },
    { id: 'yesterday', title: "Yesterday's Top Products", data: groupedProducts.yesterday, buttonText: "See all of yesterday's top products" },
    { id: 'lastWeek', title: "Last Week's Top Products", data: groupedProducts.lastWeek, buttonText: "See all of last week's top products" },
    { id: 'lastMonth', title: "Last Month's Top Products", data: groupedProducts.lastMonth, buttonText: "See all of last month's top products" }
  ];

  const showSidebar = view === View.HOME;

  return (
    <div className="min-h-screen bg-[#fdfcf0]/30 selection:bg-emerald-100 selection:text-emerald-900">
      <ConnectionDebug />
      <Navbar 
        user={user} 
        currentView={view} 
        setView={updateView} 
        onLogout={handleLogout}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onViewProfile={() => user && handleViewProfile(user.id)}
      />

      <main className="pb-20">
        {view === View.HOME && (
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 flex flex-col lg:flex-row gap-12">
            <div className="flex-1">
              <header className="mb-12">
                <div className="flex items-center gap-2 text-emerald-800 mb-2">
                  <Sparkles className="w-4 h-4 fill-emerald-800" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Curation for the Ummah</span>
                </div>
                <h1 className="text-4xl font-serif font-bold text-emerald-900">The Discovery Feed</h1>
              </header>

              <div className="space-y-16">
                {feedSections.map((section) => {
                  if (section.data.length === 0) return null;
                  
                  const isExpanded = expandedSections[section.id];
                  const displayData = isExpanded ? section.data : section.data.slice(0, 5);
                  const showButton = !isExpanded && section.data.length > 5;

                  return (
                    <section key={section.id} className="relative">
                      <div className="flex items-center justify-between mb-6 border-b border-emerald-50 pb-4">
                        <h2 className="text-2xl font-serif font-bold text-emerald-900">{section.title}</h2>
                        {!isExpanded && section.data.length > 5 && (
                          <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{section.data.length} Total</span>
                        )}
                      </div>
                      
                      <div className="space-y-1 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                        {displayData.map((p, i) => (
                          <ProductCard 
                            key={p.id} 
                            product={p} 
                            rank={i + 1}
                            onUpvote={handleUpvote} 
                            hasUpvoted={votes.has(`${user?.id}_${p.id}`)}
                            onClick={(prod) => { setSelectedProduct(prod); updateView(View.DETAIL); }}
                            onCommentClick={(prod) => { setSelectedProduct(prod); setShouldScrollToComments(true); updateView(View.DETAIL); }}
                            searchQuery={searchQuery}
                          />
                        ))}
                      </div>

                      {showButton && (
                        <div className="mt-8 flex justify-center">
                          <button 
                            onClick={() => setExpandedSections(prev => ({ ...prev, [section.id]: true }))}
                            className="group flex items-center gap-4 px-10 py-4 bg-white border border-gray-100 rounded-2xl text-[11px] font-black uppercase tracking-widest text-emerald-800 hover:bg-emerald-50 hover:border-emerald-200 transition-all shadow-sm active:scale-[0.98]"
                          >
                            {section.buttonText}
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      )}
                    </section>
                  );
                })}
              </div>
            </div>
            {showSidebar && <TrendingSidebar user={user} setView={updateView} />}
          </div>
        )}

        {view === View.DETAIL && selectedProduct && (
          <ProductDetail 
            product={selectedProduct} 
            user={user}
            onBack={() => updateView(View.HOME)}
            onUpvote={handleUpvote}
            onCommentUpvote={handleCommentUpvote}
            hasUpvoted={votes.has(`${user?.id}_${selectedProduct.id}`)}
            commentVotes={commentVotes}
            onAddComment={handleAddComment}
            onViewProfile={handleViewProfile}
            scrollToComments={shouldScrollToComments}
          />
        )}

        {view === View.SUBMIT && (
          <SubmitForm 
            onCancel={() => updateView(View.HOME)} 
            onSubmit={handleNewProduct} 
          />
        )}

        {view === View.LOGIN && (
          <div className="py-20 flex items-center justify-center">
            <Auth onSuccess={() => updateView(View.HOME)} />
          </div>
        )}

        {view === View.PROFILE && selectedProfile && (
          <UserProfile 
            profile={selectedProfile}
            currentUser={user}
            products={products}
            votes={votes}
            onBack={() => updateView(View.HOME)}
            onProductClick={(p) => { setSelectedProduct(p); updateView(View.DETAIL); }}
            onCommentClick={(p) => { setSelectedProduct(p); setShouldScrollToComments(true); updateView(View.DETAIL); }}
            onUpvote={handleUpvote}
          />
        )}

        {view === View.NEW_THREAD && (
          <NewThreadForm 
            onCancel={() => updateView(View.HOME)}
            onSubmit={(data) => { console.log("New Thread:", data); updateView(View.FORUM_HOME); }}
            setView={updateView}
          />
        )}

        {view === View.FORUM_HOME && <ForumHome setView={updateView} user={user} />}
        {view === View.RECENT_COMMENTS && <RecentComments setView={updateView} user={user} onViewProfile={handleViewProfile} />}
        {view === View.SPONSOR && <Sponsor />}
        {view === View.NEWSLETTER && <Newsletter onSponsorClick={() => updateView(View.SPONSOR)} />}
      </main>
      <Footer />
    </div>
  );
};

export default App;