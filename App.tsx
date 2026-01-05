
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
import ForumSidebar from './components/ForumSidebar.tsx';
import RecentComments from './components/RecentComments.tsx';
import ForumSearchPage from './components/ForumSearchPage.tsx';
import NotificationsPage from './components/NotificationsPage.tsx';
import Sponsor from './components/Sponsor.tsx';
import Newsletter from './components/Newsletter.tsx';
import Categories from './components/Categories.tsx';
import CategoryDetail from './components/CategoryDetail.tsx';
import AdminPanel from './components/AdminPanel.tsx';
import Footer from './components/Footer.tsx';
import { Product, User, View, Comment, Profile, Notification, NavMenuItem, Category } from './types.ts';
import { Sparkles, MessageSquare, TrendingUp, Users, ArrowRight, Triangle, Plus, Hash, Layout, ChevronRight, ShieldCheck, Loader2 } from 'lucide-react';
import { supabase } from './lib/supabase.ts';
import { searchProducts } from './utils/searchUtils.ts';

// Hardcoded admins for demo, in production this should be a DB role
const ADMIN_EMAILS = ['admin@muslimhunt.com', 'moderator@muslimhunt.com'];

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

const unslugify = (slug: string, categories: Category[]) => {
  const match = categories.find(c => slugify(c.name) === slug);
  if (match) return match.name;
  return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export const TrendingSidebar: React.FC<{ user: User | null; setView: (v: View) => void; onSignIn: () => void }> = ({ user, setView, onSignIn }) => {
  const isAdmin = user?.is_admin || ADMIN_EMAILS.includes(user?.email || '');
  
  return (
    <aside className="hidden xl:block w-80 shrink-0">
      <div className="sticky top-24 space-y-8">
        {isAdmin && (
          <section className="bg-emerald-900 rounded-[2rem] p-8 text-white shadow-xl shadow-emerald-900/10 mb-8 border border-emerald-800">
             <div className="flex items-center gap-2 mb-4 text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Moderator Access</span>
             </div>
             <h3 className="text-xl font-bold mb-4">Review Queue</h3>
             <button onClick={() => setView(View.ADMIN_PANEL)} className="w-full py-3 bg-white text-emerald-900 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-50 transition-all shadow-sm active:scale-[0.98]">
               Open Admin Panel
             </button>
          </section>
        )}

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
};

// Internal constant to handle the auth callback state
const VIEW_AUTH_CALLBACK = 'auth_callback' as any;

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.HOME);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<NavMenuItem[]>([]);
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

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_approved', true) 
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error('[Muslim Hunt] Error fetching products:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('product_categories')
        .select('*')
        .order('display_order', { ascending: true })
        .order('name', { ascending: true });
      
      if (!error && data) {
        setCategories(data as Category[]);
      }
    } catch (err) {
      console.error('[Muslim Hunt] Error fetching categories:', err);
    }
  };

  const handleNewProduct = (newProduct: Product) => {
    if (newProduct.is_approved) {
      setProducts(prev => [newProduct, ...prev]);
    }
    updateView(View.HOME, '/');
    fetchProducts(); 
  };

  const fetchNavigation = async () => {
    try {
      const { data, error } = await supabase
        .from('navigation_menu')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      
      if (!error && data) {
        setMenuItems(data as NavMenuItem[]);
      }
    } catch (err) {
      console.error('[Muslim Hunt] Navigation fetch failed:', err);
    }
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({ ...prev, [sectionId]: true }));
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchNavigation();
  }, []);

  useEffect(() => {
    if (categories.length === 0) return;

    const handlePopState = () => {
      try {
        const path = window.location.pathname;
        if (path === '/auth/callback') setView(VIEW_AUTH_CALLBACK);
        else if (path === '/p/new') setView(View.NEW_THREAD);
        else if (path === '/posts/new') setView(View.POST_SUBMIT);
        else if (path === '/posts/new/submission') setView(View.SUBMISSION);
        else if (path === '/notifications') setView(View.NOTIFICATIONS);
        else if (path === '/forums') setView(View.FORUM_HOME);
        else if (path === '/forums/comments') setView(View.RECENT_COMMENTS);
        else if (path === '/forums/search') setView(View.FORUM_SEARCH);
        else if (path === '/sponsor') setView(View.SPONSOR);
        else if (path === '/newsletters') setView(View.NEWSLETTER);
        else if (path === '/categories') setView(View.CATEGORIES);
        else if (path === '/my/welcome') setView(View.WELCOME);
        else if (path === '/admin') setView(View.ADMIN_PANEL);
        else if (path === '/login') {
          setIsAuthModalOpen(true);
          setView(View.HOME);
          safeHistory.replace('/');
        }
        else if (path.startsWith('/categories/')) {
          const slug = path.split('/categories/')[1]?.split('?')[0]?.replace(/\/$/, '');
          if (slug) {
            const catName = unslugify(slug, categories);
            setActiveCategory(catName);
            setView(View.CATEGORY_DETAIL);
          } else setView(View.CATEGORIES);
        } else if (path === '/' || path === '') setView(View.HOME);
      } catch (err) {
        setView(View.HOME);
      }
    };
    window.addEventListener('popstate', handlePopState);
    handlePopState(); 
    return () => window.removeEventListener('popstate', handlePopState);
  }, [categories]);

  // PKCE Code Exchange Effect
  useEffect(() => {
    if (view === VIEW_AUTH_CALLBACK) {
      const exchangeCode = async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        if (code) {
          try {
            const { error } = await supabase.auth.exchangeCodeForSession(code);
            if (error) throw error;
            // Successfully logged in via fresh PKCE exchange
            updateView(View.WELCOME, '/my/welcome');
          } catch (err) {
            console.error('PKCE exchange failed:', err);
            updateView(View.HOME, '/?error=auth_failed');
          }
        } else {
          updateView(View.HOME);
        }
      };
      exchangeCode();
    }
  }, [view]);

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
      else if (newView === View.FORUM_SEARCH) path = '/forums/search';
      else if (newView === View.SPONSOR) path = '/sponsor';
      else if (newView === View.NEWSLETTER) path = '/newsletters';
      else if (newView === View.CATEGORIES) path = '/categories';
      else if (newView === View.WELCOME) path = '/my/welcome';
      else if (newView === View.ADMIN_PANEL) path = '/admin';
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

  const handleCreateThread = async (threadData: { category_id: number; title: string; body: string }) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('threads')
        .insert([{
          title: threadData.title,
          body: threadData.body,
          category_id: threadData.category_id,
          author_id: user.id
        }]);

      if (error) throw error;
      updateView(View.FORUM_HOME);
    } catch (err) {
      console.error('Error creating thread:', err);
      alert('Bismillah, there was an error posting your thread. Please try again.');
    }
  };

  useEffect(() => {
    setNotifications([
      { id: 'n1', type: 'upvote', message: 'Samin Chowdhury upvoted QuranFlow', created_at: new Date().toISOString(), is_read: false, avatar_url: 'https://i.pravatar.cc/150?u=samin' },
      { id: 'n2', type: 'comment', message: 'Ahmed replied to your discussion in p/general', created_at: new Date(Date.now() - 3600000).toISOString(), is_read: false, avatar_url: 'https://i.pravatar.cc/150?u=u_1' }
    ]);

    // SESSION HEARTBEAT: Proactively check for current user on load
    const initAuth = async () => {
      const { data: { user: sessionUser } } = await supabase.auth.getUser();
      if (sessionUser) {
        const m = sessionUser.user_metadata || {};
        const isAdmin = ADMIN_EMAILS.includes(sessionUser.email!);
        setUser({ 
          id: sessionUser.id, 
          email: sessionUser.email!, 
          username: m.full_name || sessionUser.email!.split('@')[0], 
          avatar_url: m.avatar_url || `https://i.pravatar.cc/150?u=${sessionUser.id}`,
          is_admin: isAdmin
        });
      }
      setIsAuthReady(true);
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const m = session.user.user_metadata || {};
        const isAdmin = ADMIN_EMAILS.includes(session.user.email!);
        setUser({ 
          id: session.user.id, 
          email: session.user.email!, 
          username: m.full_name || session.user.email!.split('@')[0], 
          avatar_url: m.avatar_url || `https://i.pravatar.cc/150?u=${session.user.id}`,
          is_admin: isAdmin
        });
        if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
          setIsAuthModalOpen(false);
        }
      } else {
        setUser(null);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleUpvote = (id: string) => {
    if (!user) { setIsAuthModalOpen(true); return; }
    const voteKey = `${user.id}_${id}`;
    if (votes.has(voteKey)) return;
    setVotes(prev => new Set(prev).add(voteKey));
    setProducts(curr => curr.map(p => p.id === id ? { ...p, upvotes_count: (p.upvotes_count || 0) + 1 } : p));
  };

  const filteredProducts = useMemo(() => searchProducts(products, searchQuery), [products, searchQuery]);

  const groupedProducts = useMemo(() => {
    const now = new Date().getTime();
    const oneDay = 24 * 60 * 60 * 1000;
    const grouped = { today: [] as Product[], yesterday: [] as Product[], lastWeek: [] as Product[], lastMonth: [] as Product[] };
    filteredProducts.forEach(p => {
      const diff = now - new Date(p.created_at).getTime();
      if (diff < oneDay) grouped.today.push(p);
      else if (diff < 2 * oneDay) grouped.yesterday.push(p);
      else if (diff < 7 * oneDay) grouped.lastWeek.push(p);
      else grouped.lastMonth.push(p);
    });
    const sortFn = (a: Product, b: Product) => {
      const vd = (b.upvotes_count || 0) - (a.upvotes_count || 0);
      return vd !== 0 ? vd : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    };
    Object.values(grouped).forEach(g => g.sort(sortFn));
    return grouped;
  }, [filteredProducts]);

  const isForumView = [View.FORUM_HOME, View.RECENT_COMMENTS, View.NEW_THREAD, View.FORUM_SEARCH].includes(view);

  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 text-emerald-800 animate-spin" />
      </div>
    );
  }

  // Handle Callback loading view
  if (view === VIEW_AUTH_CALLBACK) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
        <div className="w-20 h-20 bg-emerald-50 rounded-[2rem] flex items-center justify-center text-emerald-800 animate-pulse">
           <Sparkles className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-serif font-bold text-emerald-900 tracking-tight">Bismillah, establishing secure session...</h2>
        <div className="flex items-center gap-2 text-gray-400 font-black uppercase tracking-widest text-[10px]">
           <Loader2 className="w-3 h-3 animate-spin" />
           Communicating with Auth Gateway
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen selection:bg-emerald-100 selection:text-emerald-900 ${isForumView ? 'bg-[#F9F9F1]' : 'bg-[#fdfcf0]/30'}`}>
      {view !== View.WELCOME && view !== View.POST_SUBMIT && view !== View.SUBMISSION && (
        <Navbar 
          user={user} 
          currentView={view} 
          setView={updateView} 
          onLogout={async () => { 
            await supabase.auth.signOut(); 
            // HARD RELOAD: Forces a fresh start by reloading the page and clearing all memory states
            window.location.href = '/'; 
          }} 
          searchQuery={searchQuery} 
          onSearchChange={setSearchQuery} 
          onViewProfile={() => user && setView(View.PROFILE)} 
          onSignInClick={() => setIsAuthModalOpen(true)}
          notifications={notifications}
          menuItems={menuItems}
          categories={categories}
          onCategorySelect={handleCategorySelect}
        />
      )}
      
      <Auth isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onSuccess={() => updateView(View.HOME)} />

      <main className="pb-10">
        {view === View.HOME && (
          <>
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
                    { id: 'lastMonth', title: "Older Products", buttonLabel: "older products", data: groupedProducts.lastMonth }
                  ].map((section) => (
                    section.data.length > 0 && (
                      <section key={section.id}>
                        <h2 className="text-2xl font-serif font-bold text-emerald-900 mb-6 border-b border-emerald-50 pb-4">{section.title}</h2>
                        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden mb-6">
                          {(expandedSections[section.id] ? section.data : section.data.slice(0, 5)).map((p, i) => (
                            <ProductCard 
                              key={p.id} product={p} rank={i + 1} onUpvote={handleUpvote} 
                              hasUpvoted={votes.has(`${user?.id}_${p.id}`)} 
                              onClick={(prod) => { setSelectedProduct(prod); updateView(View.DETAIL); }} 
                              onCommentClick={(prod) => { setSelectedProduct(prod); setShouldScrollToComments(true); updateView(View.DETAIL); }} 
                              searchQuery={searchQuery} 
                            />
                          ))}
                        </div>
                        {!expandedSections[section.id] && section.data.length > 5 && (
                          <button onClick={() => toggleSection(section.id)} className="w-full py-4 bg-white border border-gray-100 rounded-2xl text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] hover:text-emerald-800 transition-all flex items-center justify-center gap-2">
                            See all of {section.buttonLabel} <ArrowRight className="w-4 h-4" />
                          </button>
                        )}
                      </section>
                    )
                  ))}
                </div>
              </div>
              <TrendingSidebar user={user} setView={updateView} onSignIn={() => setIsAuthModalOpen(true)} />
            </div>

            {/* MOBILE-ONLY START NEW THREAD BUTTON */}
            <div className="block lg:hidden px-4 mb-10">
              <button 
                onClick={() => user ? updateView(View.NEW_THREAD) : setIsAuthModalOpen(true)}
                className="flex items-center justify-center w-full py-4 border border-gray-200 rounded-full bg-white text-gray-700 font-bold shadow-sm active:scale-95 transition-all gap-2"
              >
                <Plus className="w-5 h-5 text-gray-400" />
                Start new thread
              </button>
            </div>
          </>
        )}

        {isForumView && (
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 flex flex-col lg:flex-row gap-12">
            <ForumSidebar 
              currentView={view} 
              setView={updateView} 
              user={user} 
              onSignIn={() => setIsAuthModalOpen(true)} 
            />
            <div className="flex-1 min-w-0">
              {view === View.FORUM_HOME && <ForumHome setView={updateView} user={user} onSignIn={() => setIsAuthModalOpen(true)} />}
              {view === View.RECENT_COMMENTS && <RecentComments setView={updateView} user={user} onViewProfile={() => {}} onSignIn={() => setIsAuthModalOpen(true)} />}
              {view === View.FORUM_SEARCH && <ForumSearchPage setView={updateView} />}
              {view === View.NEW_THREAD && <NewThreadForm onCancel={() => updateView(View.FORUM_HOME)} onSubmit={handleCreateThread} setView={updateView} />}
            </div>
          </div>
        )}

        {view === View.CATEGORIES && <Categories categories={categories} onBack={() => updateView(View.HOME)} onCategorySelect={handleCategorySelect} />}
        {view === View.SUBMISSION && <SubmitForm initialUrl={pendingUrl} user={user} categories={categories} onCancel={() => updateView(View.POST_SUBMIT)} onSuccess={handleNewProduct} />}
        {view === View.CATEGORY_DETAIL && (
          <CategoryDetail 
            category={activeCategory} products={products} categories={categories}
            onBack={() => updateView(View.CATEGORIES)} onProductClick={(p) => { setSelectedProduct(p); updateView(View.DETAIL); }} 
            onUpvote={handleUpvote} hasUpvoted={(id) => votes.has(`${user?.id}_${id}`)} onCategorySelect={handleCategorySelect} 
          />
        )}
        {view === View.DETAIL && selectedProduct && (
          <ProductDetail 
            product={selectedProduct} user={user} onBack={() => updateView(View.HOME)} 
            onUpvote={handleUpvote} hasUpvoted={votes.has(`${user?.id}_${selectedProduct.id}`)} 
            commentVotes={commentVotes} onCommentUpvote={() => {}} onAddComment={() => {}} onViewProfile={() => {}} scrollToComments={shouldScrollToComments} 
          />
        )}
        {view === View.NOTIFICATIONS && <NotificationsPage notifications={notifications} onBack={() => updateView(View.HOME)} onMarkAsRead={() => {}} />}
        {view === View.POST_SUBMIT && <PostSubmit onCancel={() => updateView(View.HOME)} onNext={(url) => { setPendingUrl(url); updateView(View.SUBMISSION); }} />}
        {view === View.WELCOME && user && <Welcome userEmail={user.email} onComplete={() => updateView(View.HOME)} />}
        {view === View.ADMIN_PANEL && <AdminPanel user={user} onBack={() => updateView(View.HOME)} onRefresh={fetchProducts} />}
        {view === View.NEWSLETTER && <Newsletter onSponsorClick={() => setView(View.SPONSOR)} />}
        {view === View.SPONSOR && <Sponsor />}
      </main>
      <Footer setView={updateView} />
    </div>
  );
};

export default App;
