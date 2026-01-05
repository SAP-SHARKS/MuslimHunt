
import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar.tsx';
import ProductCard from './components/ProductCard.tsx';
import ProductDetail from './components/ProductDetail.tsx';
import ProductDirectory from './components/ProductDirectory.tsx';
import SubmitForm from './components/SubmitForm.tsx';
import PostSubmit from './components/PostSubmit.tsx';
import Auth from './components/Auth.tsx';
import Welcome from './components/Welcome.tsx';
import UserProfile from './components/UserProfile.tsx';
import NewThreadForm from './components/NewThreadForm.tsx';
import ForumHome from './components/ForumHome.tsx';
import ForumSidebar from './components/ForumSidebar.tsx';
import RecentComments from './components/RecentComments.tsx';
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
import { searchProducts, slugify, findProductBySlug } from './utils/searchUtils.ts';

const ADMIN_EMAILS = ['admin@muslimhunt.com', 'moderator@muslimhunt.com', 'zeirislam@gmail.com'];

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
        window.dispatchEvent(new PopStateEvent('popstate'));
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

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.HOME);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<NavMenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [activeTag, setActiveTag] = useState<string>('');
  const [activeParentTopic, setActiveParentTopic] = useState<string>('');
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

  const fetchNotifications = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setNotifications(data as Notification[]);
      }
    } catch (err) {
      console.error('Failed to fetch notifications');
    }
  };

  const handleStreakLogic = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('streak_count, last_login_date')
        .eq('id', userId)
        .single();
      
      if (error || !profile) return;

      const now = new Date();
      const lastLogin = profile.last_login_date ? new Date(profile.last_login_date) : null;
      let newStreak = profile.streak_count || 0;

      if (!lastLogin) {
        newStreak = 1;
      } else {
        const lastLoginDay = new Date(lastLogin).setHours(0, 0, 0, 0);
        const today = new Date().setHours(0, 0, 0, 0);
        const diffDays = Math.round((today - lastLoginDay) / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          newStreak += 1;
        } else if (diffDays > 1) {
          newStreak = 1;
        }
      }

      if (!lastLogin || new Date(lastLogin).toDateString() !== now.toDateString()) {
        await supabase
          .from('profiles')
          .update({ streak_count: newStreak, last_login_date: now.toISOString() })
          .eq('id', userId);

        if (newStreak === 2 || newStreak === 5) {
          await supabase.from('notifications').insert([{
            user_id: userId,
            type: 'streak',
            message: `You have been awarded a Gone streaking ${newStreak} badge!`,
            is_read: false
          }]);
        }
      }
    } catch (err) {
      console.error('Streak logic error:', err);
    }
  };

  const handleUpvote = async (id: string) => {
    if (!user) { setIsAuthModalOpen(true); return; }
    const voteKey = `${user.id}_${id}`;
    if (votes.has(voteKey)) return;
    
    setVotes(prev => new Set(prev).add(voteKey));
    setProducts(curr => curr.map(p => p.id === id ? { ...p, upvotes_count: (p.upvotes_count || 0) + 1 } : p));

    // Social trigger: notify maker
    const product = products.find(p => p.id === id);
    if (product && product.user_id !== user.id) {
      await supabase.from('notifications').insert([{
        user_id: product.user_id,
        type: 'upvote',
        message: `${user.username} upvoted your product "${product.name}"!`,
        is_read: false,
        avatar_url: user.avatar_url,
        target_id: id
      }]);
    }
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({ ...prev, [sectionId]: true }));
  };

  const handleNewProduct = async (newProduct: Product) => {
    if (newProduct.is_approved) {
      setProducts(prev => [newProduct, ...prev]);
    } else {
      // Admin Trigger
      const { data: admins } = await supabase.from('profiles').select('id').eq('is_admin', true);
      if (admins) {
        const notifs = admins.map(admin => ({
          user_id: admin.id,
          type: 'submission',
          message: `New product submitted: "${newProduct.name}" is pending review.`,
          is_read: false,
          target_id: newProduct.id
        }));
        await supabase.from('notifications').insert(notifs);
      }
    }
    updateView(View.HOME, '/');
    fetchProducts(); 
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchNavigation();
  }, []);

  useEffect(() => {
    // 2.5-second Safety Valve
    const safetyValve = setTimeout(() => {
      if (isAuthLoading) {
        console.warn('Auth state did not resolve in 2.5s. Force rendering.');
        setIsAuthLoading(false);
      }
    }, 2500);

    const initSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const m = session.user.user_metadata || {};
          const isAdmin = ADMIN_EMAILS.includes(session.user.email!);
          const userId = session.user.id;

          setUser({ 
            id: userId, 
            email: session.user.email!, 
            username: m.full_name || session.user.email!.split('@')[0], 
            avatar_url: m.avatar_url || `https://i.pravatar.cc/150?u=${userId}`,
            is_admin: isAdmin
          });

          await Promise.allSettled([
            fetchNotifications(userId),
            handleStreakLogic(userId)
          ]);

          const channel = supabase
            .channel(`notifs_user_${userId}`)
            .on(
              'postgres_changes',
              { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` },
              (payload) => {
                setNotifications(prev => [payload.new as Notification, ...prev]);
              }
            )
            .on(
              'postgres_changes',
              { event: 'UPDATE', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` },
              (payload) => {
                const updated = payload.new as Notification;
                setNotifications(prev => prev.map(n => n.id === updated.id ? updated : n));
              }
            )
            .subscribe();

          return () => { supabase.removeChannel(channel); };
        }
      } catch (err) {
        console.error('Session initialization failed');
      } finally {
        clearTimeout(safetyValve);
        setIsAuthLoading(false);
      }
    };

    initSession();

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
          await Promise.allSettled([
            fetchNotifications(session.user.id),
            handleStreakLogic(session.user.id)
          ]);
        }
      } else {
        setUser(null);
        setNotifications([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const syncStateFromUrl = () => {
    if (categories.length === 0 && products.length === 0) return;
    
    try {
      const path = window.location.pathname;
      const searchParams = new URLSearchParams(window.location.search);
      const segments = path.split('/').filter(Boolean);

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
      else if (path === '/admin') setView(View.ADMIN_PANEL);
      else if (path === '/products' || segments[0] === 'products') {
        if (segments[0] === 'products' && segments[1]) {
          const prod = products.find(p => slugify(p.name) === segments[1]);
          if (prod) {
            setSelectedProduct(prod);
            setView(View.DETAIL);
            return;
          }
        }
        const topic = searchParams.get('topic') || '';
        const parent = searchParams.get('parentTopic') || '';
        setActiveTag(topic);
        setActiveParentTopic(parent);
        setView(View.DIRECTORY);
      }
      else if (path.startsWith('/categories/')) {
        const slug = path.split('/categories/')[1]?.split('?')[0]?.replace(/\/$/, '');
        if (slug) {
          const catName = categories.find(c => slugify(c.name) === slug)?.name || slug;
          setActiveCategory(catName);
          setView(View.CATEGORY_DETAIL);
        } else setView(View.CATEGORIES);
      } else if (path === '/' || path === '') setView(View.HOME);
    } catch (err) {
      setView(View.HOME);
    }
  };

  useEffect(() => {
    if (!isAuthLoading) {
      syncStateFromUrl();
      window.addEventListener('popstate', syncStateFromUrl);
      return () => window.removeEventListener('popstate', syncStateFromUrl);
    }
  }, [isAuthLoading, categories, products]);

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
      else if (newView === View.ADMIN_PANEL) path = '/admin';
      else if (newView === View.DIRECTORY) path = '/products';
      else if (newView === View.CATEGORY_DETAIL && activeCategory) {
        path = `/categories/${slugify(activeCategory)}`;
      }
      else if (newView === View.HOME) path = '/';
    }
    
    const currentFullPath = window.location.pathname + window.location.search;
    if (currentFullPath !== path) safeHistory.push(path);
  };

  const handleCategorySelect = (cat: string) => {
    if (!cat) return;
    setActiveCategory(cat);
    updateView(View.CATEGORY_DETAIL, `/categories/${slugify(cat)}`);
  };

  const handleTagSelect = (tag: string, parent?: string) => {
    const params = new URLSearchParams();
    if (tag) params.set('topic', slugify(tag));
    if (parent) params.set('parentTopic', slugify(parent));
    
    const queryString = params.toString();
    const newPath = `/products${queryString ? `?${queryString}` : ''}`;
    updateView(View.DIRECTORY, newPath);
  };

  const markNotificationAsRead = async (id: string) => {
    try {
      await supabase.from('notifications').update({ is_read: true }).eq('id', id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (e) {
      console.warn('Failed to mark read');
    }
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

  const isForumView = [View.FORUM_HOME, View.RECENT_COMMENTS, View.NEW_THREAD].includes(view);

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdfcf0]">
        <Loader2 className="w-10 h-10 text-emerald-800 animate-spin mb-4" />
        <p className="text-emerald-900 font-serif italic">Bismillah... Loading Muslim Hunt</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen selection:bg-emerald-100 selection:text-emerald-900 ${isForumView ? 'bg-white lg:bg-[#F9F9F1]' : 'bg-[#fdfcf0]/30'}`}>
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
          menuItems={menuItems}
          categories={categories}
          onCategorySelect={handleCategorySelect}
        />
      )}
      
      <Auth isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onSuccess={() => updateView(View.HOME)} />

      <main className="pb-10">
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
                            onClick={(prod) => { setSelectedProduct(prod); updateView(View.DETAIL, `/products/${slugify(prod.name)}`); }} 
                            onCommentClick={(prod) => { setSelectedProduct(prod); setShouldScrollToComments(true); updateView(View.DETAIL, `/products/${slugify(prod.name)}`); }} 
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
        )}

        {view === View.DIRECTORY && (
          <ProductDirectory 
            products={products} 
            activeTag={activeTag} 
            activeParentTopic={activeParentTopic}
            onTagSelect={handleTagSelect} 
            onProductClick={(p) => { setSelectedProduct(p); updateView(View.DETAIL, `/products/${slugify(p.name)}`); }} 
          />
        )}

        {isForumView && (
          <div className={`max-w-7xl mx-auto ${view === View.NEW_THREAD ? 'px-0 lg:px-8' : 'px-4 sm:px-8'} py-6 lg:py-12 flex flex-col lg:flex-row lg:gap-12 gap-0`}>
            <div className="hidden lg:block">
              <ForumSidebar 
                currentView={view} 
                setView={updateView} 
                user={user} 
                onSignIn={() => setIsAuthModalOpen(true)} 
              />
            </div>
            <div className="flex-1 min-w-0">
              {view === View.FORUM_HOME && <ForumHome setView={updateView} user={user} onSignIn={() => setIsAuthModalOpen(true)} />}
              {view === View.RECENT_COMMENTS && <RecentComments setView={updateView} user={user} onViewProfile={() => {}} onSignIn={() => setIsAuthModalOpen(true)} />}
              {view === View.NEW_THREAD && <NewThreadForm onCancel={() => updateView(View.FORUM_HOME)} onSubmit={updateView} setView={updateView} />}
            </div>
          </div>
        )}

        {view === View.CATEGORIES && <Categories categories={categories} onBack={() => updateView(View.HOME)} onCategorySelect={handleCategorySelect} />}
        {view === View.SUBMISSION && <SubmitForm initialUrl={pendingUrl} user={user} categories={categories} onCancel={() => updateView(View.POST_SUBMIT)} onSuccess={handleNewProduct} />}
        {view === View.CATEGORY_DETAIL && (
          <CategoryDetail 
            category={activeCategory} products={products} categories={categories}
            onBack={() => updateView(View.CATEGORIES)} onProductClick={(p) => { setSelectedProduct(p); updateView(View.DETAIL, `/products/${slugify(p.name)}`); }} 
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
        {view === View.NOTIFICATIONS && <NotificationsPage notifications={notifications} onBack={() => updateView(View.HOME)} onMarkAsRead={markNotificationAsRead} />}
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
