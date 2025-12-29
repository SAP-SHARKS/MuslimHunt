import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar.tsx';
import ProductCard from './components/ProductCard.tsx';
import ProductDetail from './components/ProductDetail.tsx';
import SubmitForm from './components/SubmitForm.tsx';
import PostSubmit from './components/PostSubmit.tsx';
import Auth from './components/Auth.tsx';
import Welcome from './components/Welcome.tsx';
import UserProfile from './components/UserProfile.tsx';
import NewThreadForm from './components/NewThreadForm.tsx';
import ForumHome from './components/ForumHome.tsx';
import RecentComments from './components/RecentComments.tsx';
import NotificationsPage from './components/NotificationsPage.tsx';
import Sponsor from './components/Sponsor.tsx';
import Newsletter from './components/Newsletter.tsx';
import Categories from './components/Categories.tsx';
import CategoryDetail from './components/CategoryDetail.tsx';
import Footer from './components/Footer.tsx';
import { Product, User, View, Comment, Profile, Notification } from './types.ts';
import { INITIAL_PRODUCTS, CATEGORY_SECTIONS } from './constants.tsx';
import { Sparkles, MessageSquare, TrendingUp, Users, ArrowRight, Triangle, Plus, Hash, Layout, ChevronRight } from 'lucide-react';
import { supabase } from './lib/supabase.ts';
import { searchProducts } from './utils/searchUtils.ts';

const safeHistory = {
  isSupported: () => {
    try {
      if (!window.history || !window.history.pushState) return false;
      const isBlob = window.location.protocol === 'blob:';
      const isSandbox = window.location.hostname.includes('scf.usercontent.goog') || 
                        window.location.hostname.includes('ai.studio');
      return !isBlob && !isSandbox;
    } catch (e) {
      return false;
    }
  },
  push: (path: string) => {
    if (safeHistory.isSupported()) {
      try {
        const relativePath = path.startsWith('/') ? path : `/${path}`;
        window.history.pushState({}, '', relativePath);
      } catch (e) {
        console.warn('[Muslim Hunt] Navigation suppressed (Security Restriction)', e);
      }
    }
  },
  replace: (path: string) => {
    if (safeHistory.isSupported()) {
      try {
        const relativePath = path.startsWith('/') ? path : `/${path}`;
        window.history.replaceState({}, '', relativePath);
      } catch (e) {
        console.warn('[Muslim Hunt] ReplaceState suppressed (Security Restriction)', e);
      }
    }
  }
};

const slugify = (text: string) => text.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

const unslugify = (slug: string) => {
  for (const section of CATEGORY_SECTIONS) {
    for (const item of section.items) {
      if (slugify(item.name) === slug) return item.name;
    }
  }
  return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export const TrendingSidebar: React.FC<{ user: User | null; setView: (v: View) => void; onSignIn: () => void }> = ({ user, setView, onSignIn }) => (
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
            { tag: "p/producthunt", title: "What are your favorite Halal apps for 2025?", comments: 24, upvotes: 156, online: 8, icon: Layout },
            { tag: "p/vibecoding", title: "Which tech stack is best for Halal e-commerce?", comments: 18, upvotes: 92, online: 12, icon: Hash },
            { tag: "p/general", title: "Seeking Beta Testers for a new prayer app", comments: 42, upvotes: 310, online: 15, icon: Users }
          ].map((thread, i) => (
            <div key={i} className="group cursor-pointer" onClick={() => setView(View.FORUM_HOME)}>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-emerald-800 transition-colors">
                  <thread.icon className="w-3 h-3 opacity-60" />
                  <span>{thread.tag}</span>
                </div>
                <h4 className="text-[13px] font-bold text-gray-900 group-hover:text-emerald-800 transition-colors leading-snug tracking-tight">{thread.title}</h4>
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
          <button onClick={() => setView(View.FORUM_HOME)} className="w-full flex items-center justify-center gap-2 py-2 text-[10px] font-black text-gray-400 hover:text-emerald-800 transition-colors uppercase tracking-[0.2em]">
            View all discussions <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => user ? setView(View.NEW_THREAD) : onSignIn()} className="w-full flex items-center justify-center gap-2 bg-emerald-50 border border-emerald-100 py-4 rounded-2xl text-xs font-black text-emerald-800 uppercase tracking-widest hover:bg-emerald-800 hover:text-white transition-all shadow-sm active:scale-[0.98]">
            <Plus className="w-4 h-4" /> Start new thread
          </button>
        </div>
      </section>
    </div>
  </aside>
);

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.HOME);
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [votes, setVotes] = useState<Set<string>>(new Set());
  const [commentVotes, setCommentVotes] = useState<Set<string>>(new Set());
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [shouldScrollToComments, setShouldScrollToComments] = useState(false);
  const [pendingUrl, setPendingUrl] = useState('');
  
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    today: false, yesterday: false, lastWeek: false, lastMonth: false
  });

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: true
    }));
  };

  useEffect(() => {
    const handlePopState = () => {
      try {
        const path = window.location.pathname;
        if (path === '/p/new') setView(View.NEW_THREAD);
        else if (path === '/posts/new') setView(View.POST_SUBMIT);
        else if (path === '/posts/new/submission') setView(View.SUBMISSION);
        else if (path === '/notifications') setView(View.NOTIFICATIONS);
        else if (path === '/forums') setView(View.FORUM_HOME);
        else if (path === '/forums/comments') setView(View.RECENT_COMMENTS);
        else if (path === '/sponsor') setView(View.SPONSOR);
        else if (path === '/newsletters') setView(View.NEWSLETTER);
        else if (path === '/categories') setView(View.CATEGORIES);
        else if (path === '/my/welcome') setView(View.WELCOME);
        else if (path === '/login') {
          setIsAuthModalOpen(true);
          setView(View.HOME);
          safeHistory.replace('/');
        }
        else if (path.startsWith('/categories/')) {
          const slug = path.split('/categories/')[1]?.split('?')[0]?.replace(/\/$/, '');
          if (slug) {
            const catName = unslugify(slug);
            setActiveCategory(catName);
            setView(View.CATEGORY_DETAIL);
          } else setView(View.CATEGORIES);
        } else if (path === '/' || path === '') setView(View.HOME);
        else {
          setView(View.HOME);
          safeHistory.replace('/');
        }
      } catch (err) {
        console.error('[Muslim Hunt] Routing failure:', err);
        setView(View.HOME);
      }
    };
    window.addEventListener('popstate', handlePopState);
    handlePopState(); 
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const updateView = (newView: View, customPath?: string) => {
    setView(newView);
    let path = customPath || '/';
    if (!customPath) {
      if (newView === View.NEW_THREAD) path = '/p/new';
      else if (newView === View.POST_SUBMIT) path = '/posts/new';
      else if (newView === View.SUBMISSION) path = '/posts/new/submission';
      else if (newView === View.NOTIFICATIONS) path = '/notifications';
      else if (newView === View.FORUM_HOME) path = '/forums';
      else if (newView === View.RECENT_COMMENTS) path = '/forums/comments';
      else if (newView === View.SPONSOR) path = '/sponsor';
      else if (newView === View.NEWSLETTER) path = '/newsletters';
      else if (newView === View.CATEGORIES) path = '/categories';
      else if (newView === View.WELCOME) path = '/my/welcome';
      else if (newView === View.CATEGORY_DETAIL && activeCategory) {
        path = `/categories/${slugify(activeCategory)}`;
      }
      else if (newView === View.HOME) path = '/';
    }
    if (window.location.pathname + window.location.search !== path) safeHistory.push(path);
  };

  const handleCategorySelect = (cat: string) => {
    if (!cat) return;
    setActiveCategory(cat);
    updateView(View.CATEGORY_DETAIL, `/categories/${slugify(cat)}`);
  };

  useEffect(() => {
    // Mock initial notifications
    setNotifications([
      { id: 'n1', type: 'upvote', message: 'Samin Chowdhury upvoted QuranFlow', created_at: new Date().toISOString(), is_read: false, avatar_url: 'https://i.pravatar.cc/150?u=samin' },
      { id: 'n2', type: 'comment', message: 'Ahmed replied to your discussion in p/general', created_at: new Date(Date.now() - 3600000).toISOString(), is_read: false, avatar_url: 'https://i.pravatar.cc/150?u=u_1' }
    ]);

    // Initial session fetch
    supabase.auth.getSession()
      .then(({ data }) => {
        const session = data?.session;
        if (session?.user) {
          const m = session.user.user_metadata || {};
          const email = session.user.email || '';
          setUser({ 
            id: session.user.id, 
            email, 
            username: m.full_name || email.split('@')[0] || 'Member', 
            avatar_url: m.avatar_url || `https://i.pravatar.cc/150?u=${session.user.id}` 
          });
        }
      })
      .catch(err => console.error('[Muslim Hunt] Supabase session error:', err));

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const m = session.user.user_metadata || {};
        const email = session.user.email || '';
        setUser({ 
          id: session.user.id, 
          email, 
          username: m.full_name || email.split('@')[0] || 'Member', 
          avatar_url: m.avatar_url || `https://i.pravatar.cc/150?u=${session.user.id}` 
        });
        
        if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
          setIsAuthModalOpen(false);
          if (window.location.pathname === '/login') {
            updateView(View.HOME);
          }
        }
      } else {
        setUser(null);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleUpvote = (id: string) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    const voteKey = `${user.id}_${id}`;
    if (votes.has(voteKey)) return;

    setVotes(prev => new Set(prev).add(voteKey));
    setProducts(curr => curr.map(p => 
      p.id === id ? { ...p, upvotes_count: p.upvotes_count + 1 } : p
    ));
    if (selectedProduct?.id === id) {
      setSelectedProduct(prev => prev ? { ...prev, upvotes_count: prev.upvotes_count + 1 } : null);
    }
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const filteredProducts = useMemo(() => searchProducts(products, searchQuery), [products, searchQuery]);

  const groupedProducts = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const yesterdayStart = todayStart - 86400000;
    const lastWeekStart = todayStart - 7 * 86400000;
    const lastMonthStart = todayStart - 30 * 86400000;
    const grouped = { today: [] as Product[], yesterday: [] as Product[], lastWeek: [] as Product[], lastMonth: [] as Product[] };
    filteredProducts.forEach(p => {
      const time = new Date(p.created_at).getTime();
      if (time >= todayStart) grouped.today.push(p);
      else if (time >= yesterdayStart) grouped.yesterday.push(p);
      else if (time >= lastWeekStart) grouped.lastWeek.push(p);
      else if (time >= lastMonthStart) grouped.lastMonth.push(p);
    });
    const sortFn = (a: Product, b: Product) => b.upvotes_count - a.upvotes_count;
    grouped.today.sort(sortFn); grouped.yesterday.sort(sortFn); grouped.lastWeek.sort(sortFn); grouped.lastMonth.sort(sortFn);
    return grouped;
  }, [filteredProducts]);

  return (
    <div className="min-h-screen bg-[#fdfcf0]/30 selection:bg-emerald-100 selection:text-emerald-900">
      {view !== View.WELCOME && view !== View.POST_SUBMIT && view !== View.SUBMISSION && (
        <Navbar 
          user={user} 
          currentView={view} 
          setView={updateView} 
          onLogout={async () => { await supabase.auth.signOut(); updateView(View.HOME); }} 
          searchQuery={searchQuery} 
          onSearchChange={setSearchQuery} 
          onViewProfile={() => user && setView(View.PROFILE)} 
          onSignInClick={() => setIsAuthModalOpen(true)}
          notifications={notifications}
        />
      )}
      
      {/* Auth Modal */}
      <Auth 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onSuccess={() => { setIsAuthModalOpen(false); updateView(View.HOME); }} 
      />

      <main className={(view === View.NEWSLETTER || view === View.CATEGORIES || view === View.CATEGORY_DETAIL || view === View.WELCOME || view === View.POST_SUBMIT || view === View.NOTIFICATIONS || view === View.SUBMISSION) ? "" : "pb-10"}>
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
                {[
                  { id: 'today', title: "Top Products Launching Today", buttonLabel: "today's products", data: groupedProducts.today },
                  { id: 'yesterday', title: "Yesterday's Top Products", buttonLabel: "yesterday's products", data: groupedProducts.yesterday },
                  { id: 'lastWeek', title: "Last Week's Top Products", buttonLabel: "last week's products", data: groupedProducts.lastWeek },
                  { id: 'lastMonth', title: "Last Month's Top Products", buttonLabel: "last month's products", data: groupedProducts.lastMonth }
                ].map((section) => {
                  if (section.data.length === 0) return null;
                  const isExpanded = expandedSections[section.id];
                  const displayItems = isExpanded ? section.data : section.data.slice(0, 5);

                  return (
                    <section key={section.id}>
                      <div className="flex items-center justify-between mb-6 border-b border-emerald-50 pb-4">
                        <h2 className="text-2xl font-serif font-bold text-emerald-900">{section.title}</h2>
                      </div>
                      <div className="space-y-1 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden mb-6">
                        {displayItems.map((p, i) => (
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

                      {!isExpanded && section.data.length > 5 && (
                        <button 
                          onClick={() => toggleSection(section.id)}
                          className="w-full py-4 bg-white border border-gray-100 rounded-2xl text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] hover:text-emerald-800 hover:border-emerald-100 hover:bg-emerald-50/30 transition-all flex items-center justify-center gap-2 shadow-sm active:scale-[0.99]"
                        >
                          See all of {section.buttonLabel}
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      )}
                    </section>
                  );
                })}
              </div>
            </div>
            <TrendingSidebar user={user} setView={updateView} onSignIn={() => setIsAuthModalOpen(true)} />
          </div>
        )}
        {view === View.NOTIFICATIONS && (
          <NotificationsPage 
            notifications={notifications} 
            onBack={() => updateView(View.HOME)} 
            onMarkAsRead={handleMarkAsRead} 
          />
        )}
        {view === View.POST_SUBMIT && (
          <PostSubmit 
            onCancel={() => updateView(View.HOME)} 
            onNext={(url) => { 
              setPendingUrl(url);
              updateView(View.SUBMISSION, '/posts/new/submission');
            }} 
          />
        )}
        {view === View.SUBMISSION && (
          <SubmitForm 
            initialUrl={pendingUrl}
            user={user}
            onCancel={() => updateView(View.POST_SUBMIT, '/posts/new')} 
            onSuccess={() => {
              // Smooth transition back to home feed after success
              updateView(View.HOME, '/');
            }} 
          />
        )}
        {view === View.WELCOME && user && (
          <Welcome 
            userEmail={user.email} 
            onComplete={(data) => {
              console.log('Onboarding complete:', data);
              setUser(prev => prev ? { ...prev, username: data.username, headline: data.headline } : null);
              updateView(View.HOME);
            }} 
          />
        )}
        {view === View.FORUM_HOME && (
          <ForumHome 
            setView={updateView} 
            user={user} 
            onSignIn={() => setIsAuthModalOpen(true)} 
          />
        )}
        {view === View.RECENT_COMMENTS && (
          <RecentComments 
            setView={updateView} 
            user={user} 
            onViewProfile={() => updateView(View.PROFILE)} 
            onSignIn={() => setIsAuthModalOpen(true)} 
          />
        )}
        {view === View.NEW_THREAD && (
          <NewThreadForm 
            onCancel={() => updateView(View.FORUM_HOME)} 
            onSubmit={(data) => { console.log('Thread submitted:', data); updateView(View.FORUM_HOME); }} 
            setView={updateView} 
          />
        )}
        {view === View.CATEGORY_DETAIL && (
          <CategoryDetail 
            category={activeCategory} 
            products={products} 
            onBack={() => updateView(View.CATEGORIES)} 
            onProductClick={(p) => { setSelectedProduct(p); updateView(View.DETAIL); }} 
            onUpvote={handleUpvote} 
            hasUpvoted={(id) => votes.has(`${user?.id}_${id}`)} 
            onCategorySelect={handleCategorySelect} 
          />
        )}
        {view === View.CATEGORIES && <Categories onBack={() => updateView(View.HOME)} onCategorySelect={handleCategorySelect} />}
        {view === View.DETAIL && selectedProduct && (
          <ProductDetail 
            product={selectedProduct} 
            user={user} 
            onBack={() => updateView(View.HOME)} 
            onUpvote={handleUpvote} 
            onCommentUpvote={(pid, cid) => {}} 
            hasUpvoted={votes.has(`${user?.id}_${selectedProduct.id}`)} 
            commentVotes={commentVotes} 
            onAddComment={(t) => {}} 
            onViewProfile={() => {}} 
            scrollToComments={shouldScrollToComments} 
          />
        )}
        {view === View.NEWSLETTER && <Newsletter onSponsorClick={() => setView(View.SPONSOR)} />}
        {view === View.SPONSOR && <Sponsor />}
      </main>
      {view !== View.WELCOME && view !== View.POST_SUBMIT && view !== View.SUBMISSION && <Footer setView={updateView} />}
    </div>
  );
};

export default App;