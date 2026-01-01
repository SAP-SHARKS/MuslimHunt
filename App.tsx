
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
import ForumDetail from './components/ForumDetail.tsx';
import RecentComments from './components/RecentComments.tsx';
import NotificationsPage from './components/NotificationsPage.tsx';
import Sponsor from './components/Sponsor.tsx';
import Newsletter from './components/Newsletter.tsx';
import Categories from './components/Categories.tsx';
import CategoryDetail from './components/CategoryDetail.tsx';
import AdminPanel from './components/AdminPanel.tsx';
import Footer from './components/Footer.tsx';
import { Product, User, View, Comment, Profile, Notification, NavMenuItem, Category, Forum, Thread } from './types.ts';
import { Sparkles, MessageSquare, TrendingUp, Users, ArrowRight, Triangle, Plus, Hash, Layout, ChevronRight, ShieldCheck } from 'lucide-react';
import { supabase } from './lib/supabase.ts';
import { searchProducts } from './utils/searchUtils.ts';

const ADMIN_EMAILS = ['zeirislam@gmail.com'];

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
        console.warn('[Muslim Hunt] Navigation suppressed', e);
      }
    }
  },
  replace: (path: string) => {
    if (safeHistory.isSupported()) {
      try {
        const relativePath = path.startsWith('/') ? path : `/${path}`;
        window.history.replaceState({}, '', relativePath);
      } catch (e) {
        console.warn('[Muslim Hunt] ReplaceState suppressed', e);
      }
    }
  }
};

const slugify = (text: string) => text.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

const unslugify = (slug: string, source: any[]) => {
  const match = source.find(item => slugify(item.name || item.slug) === slug);
  if (match) return match.name || match.slug;
  return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export const TrendingSidebar: React.FC<{ user: User | null; forums: Forum[]; setView: (v: View, p?: string) => void; onSignIn: () => void }> = ({ user, forums, setView, onSignIn }) => {
  const isAdmin = user?.is_admin;
  
  return (
    <aside className="hidden xl:block w-80 shrink-0">
      <div className="sticky top-24 space-y-8">
        {isAdmin && (
          <section className="bg-emerald-900 rounded-[2rem] p-8 text-white shadow-xl shadow-emerald-900/10 border border-emerald-800">
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
              Popular Discussions
            </h3>
            <TrendingUp className="w-4 h-4 text-emerald-800 opacity-50" />
          </div>
          
          <div className="space-y-7">
            {forums.slice(0, 3).map((forum) => (
              <div key={forum.id} className="group cursor-pointer" onClick={() => setView(View.FORUM_DETAIL, `/forums/${forum.slug}`)}>
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-emerald-800 transition-colors">
                    <Hash className="w-3 h-3 opacity-60" />
                    <span>p/{forum.slug}</span>
                  </div>
                  <h4 className="text-[13px] font-bold text-gray-900 group-hover:text-emerald-800 transition-colors leading-snug tracking-tight">{forum.description}</h4>
                  <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                    <div className="flex items-center gap-1.5 text-emerald-600/70 font-black">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Community active
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 space-y-4 pt-8 border-t border-gray-50">
            <button onClick={() => setView(View.FORUM_HOME)} className="w-full flex items-center justify-center gap-2 py-2 text-[10px] font-black text-gray-400 hover:text-emerald-800 transition-colors uppercase tracking-[0.2em]">
              View all forums <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => user ? setView(View.NEW_THREAD) : onSignIn()} className="w-full flex items-center justify-center gap-2 bg-emerald-50 border border-emerald-100 py-4 rounded-2xl text-xs font-black text-emerald-800 uppercase tracking-widest hover:bg-emerald-800 hover:text-white transition-all shadow-sm active:scale-[0.98]">
              <Plus className="w-4 h-4" /> Start discussion
            </button>
          </div>
        </section>
      </div>
    </aside>
  );
};

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.HOME);
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [forums, setForums] = useState<Forum[]>([]);
  const [menuItems, setMenuItems] = useState<NavMenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [activeForumSlug, setActiveForumSlug] = useState<string>('');
  const [votes, setVotes] = useState<Set<string>>(new Set());
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
      const { data, error } = await supabase.from('products').select('*').eq('is_approved', true).order('created_at', { ascending: false });
      if (!error) setProducts(data || []);
    } catch (err) { console.error('[App] Error fetching products:', err); }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase.from('product_categories').select('*').order('display_order', { ascending: true });
      if (!error) setCategories(data as Category[]);
    } catch (err) { console.error('[App] Error fetching categories:', err); }
  };

  const fetchForums = async () => {
    try {
      const { data, error } = await supabase.from('forums').select('*').order('display_order', { ascending: true });
      if (!error) setForums(data as Forum[]);
    } catch (err) { console.error('[App] Error fetching forums:', err); }
  };

  const fetchNavigation = async () => {
    try {
      const { data, error } = await supabase.from('navigation_menu').select('*').eq('is_active', true).order('display_order');
      if (!error) setMenuItems(data as NavMenuItem[]);
    } catch (err) { console.error('[App] Navigation fetch failed:', err); }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchForums();
    fetchNavigation();
  }, []);

  useEffect(() => {
    if (categories.length === 0 && forums.length === 0) return;

    const handlePopState = () => {
      try {
        const path = window.location.pathname;
        if (path === '/p/new') setView(View.NEW_THREAD);
        else if (path === '/posts/new') setView(View.POST_SUBMIT);
        else if (path === '/notifications') setView(View.NOTIFICATIONS);
        else if (path === '/forums') setView(View.FORUM_HOME);
        else if (path === '/forums/comments') setView(View.RECENT_COMMENTS);
        else if (path === '/categories') setView(View.CATEGORIES);
        else if (path === '/admin') setView(View.ADMIN_PANEL);
        else if (path.startsWith('/forums/')) {
          const slug = path.split('/forums/')[1]?.split('?')[0];
          if (slug) {
            setActiveForumSlug(slug);
            setView(View.FORUM_DETAIL);
          }
        }
        else if (path.startsWith('/categories/')) {
          const slug = path.split('/categories/')[1]?.split('?')[0];
          if (slug) {
            setActiveCategory(unslugify(slug, categories));
            setView(View.CATEGORY_DETAIL);
          }
        } else if (path === '/' || path === '') setView(View.HOME);
      } catch (err) { setView(View.HOME); }
    };
    window.addEventListener('popstate', handlePopState);
    handlePopState(); 
    return () => window.removeEventListener('popstate', handlePopState);
  }, [categories, forums]);

  const updateView = (newView: View, customPath?: string) => {
    setView(newView);
    let path = customPath || '/';
    if (!customPath) {
      if (newView === View.NEW_THREAD) path = '/p/new';
      else if (newView === View.NOTIFICATIONS) path = '/notifications';
      else if (newView === View.FORUM_HOME) path = '/forums';
      else if (newView === View.FORUM_DETAIL && activeForumSlug) path = `/forums/${activeForumSlug}`;
      else if (newView === View.CATEGORIES) path = '/categories';
      else if (newView === View.HOME) path = '/';
    }
    if (window.location.pathname !== path) safeHistory.push(path);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const session = data?.session;
      if (session?.user) {
        const m = session.user.user_metadata || {};
        setUser({ 
          id: session.user.id, 
          email: session.user.email!, 
          username: m.full_name || session.user.email!.split('@')[0], 
          avatar_url: m.avatar_url || `https://i.pravatar.cc/150?u=${session.user.id}`,
          is_admin: ADMIN_EMAILS.includes(session.user.email!)
        });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const m = session.user.user_metadata || {};
        setUser({ 
          id: session.user.id, 
          email: session.user.email!, 
          username: m.full_name || session.user.email!.split('@')[0], 
          avatar_url: m.avatar_url || `https://i.pravatar.cc/150?u=${session.user.id}`,
          is_admin: ADMIN_EMAILS.includes(session.user.email!)
        });
        if (event === 'SIGNED_IN') setIsAuthModalOpen(false);
      } else setUser(null);
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
    return grouped;
  }, [filteredProducts]);

  return (
    <div className="min-h-screen bg-[#fdfcf0]/30 selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar 
        user={user} currentView={view} setView={updateView} 
        onLogout={async () => { await supabase.auth.signOut(); updateView(View.HOME); }} 
        searchQuery={searchQuery} onSearchChange={setSearchQuery} 
        onViewProfile={() => user && setView(View.PROFILE)} onSignInClick={() => setIsAuthModalOpen(true)}
        notifications={notifications} menuItems={menuItems}
      />
      
      <Auth isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

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
                {/* FIX: Cast entries to explicit type to resolve TS unknown error on data.length and data.slice */}
                {(Object.entries(groupedProducts) as [string, Product[]][]).map(([id, data]) => data.length > 0 && (
                  <section key={id}>
                    <h2 className="text-2xl font-serif font-bold text-emerald-900 mb-6 border-b border-emerald-50 pb-4 capitalize">{id}</h2>
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden mb-6">
                      {/* FIX: data is now typed as Product[] from the cast above */}
                      {data.slice(0, 5).map((p, i) => (
                        <ProductCard 
                          key={p.id} product={p} rank={i + 1} onUpvote={handleUpvote} 
                          hasUpvoted={votes.has(`${user?.id}_${p.id}`)} 
                          onClick={(prod) => { setSelectedProduct(prod); updateView(View.DETAIL); }} 
                          onCommentClick={(prod) => { setSelectedProduct(prod); setShouldScrollToComments(true); updateView(View.DETAIL); }} 
                          searchQuery={searchQuery} 
                        />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </div>
            <TrendingSidebar user={user} forums={forums} setView={updateView} onSignIn={() => setIsAuthModalOpen(true)} />
          </div>
        )}
        {view === View.CATEGORIES && <Categories categories={categories} onBack={() => updateView(View.HOME)} onCategorySelect={(c) => { setActiveCategory(c); updateView(View.CATEGORY_DETAIL); }} />}
        {view === View.FORUM_HOME && <ForumHome setView={updateView} user={user} onSignIn={() => setIsAuthModalOpen(true)} forums={forums} />}
        {view === View.FORUM_DETAIL && <ForumDetail setView={updateView} user={user} forumSlug={activeForumSlug} forums={forums} />}
        {view === View.NEW_THREAD && <NewThreadForm onCancel={() => updateView(View.FORUM_HOME)} onSubmit={() => { fetchForums(); updateView(View.FORUM_HOME); }} setView={updateView} user={user} forums={forums} />}
        {view === View.DETAIL && selectedProduct && <ProductDetail product={selectedProduct} user={user} onBack={() => updateView(View.HOME)} onUpvote={handleUpvote} hasUpvoted={votes.has(`${user?.id}_${selectedProduct.id}`)} commentVotes={new Set()} onCommentUpvote={() => {}} onAddComment={() => {}} onViewProfile={() => {}} scrollToComments={shouldScrollToComments} />}
      </main>
      <Footer setView={updateView} />
    </div>
  );
};

export default App;
