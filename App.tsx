
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
import { Product, User, View, Comment, Profile, Notification, NavMenuItem } from './types.ts';
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
  const [products, setProducts] = useState<Product[]>([]);
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

  // Fix: Defined updateView to manage state and history sync
  const updateView = (newView: View, path: string) => {
    setView(newView);
    safeHistory.push(path);
  };

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error('[Muslim Hunt] Error fetching products:', err);
      setProducts(INITIAL_PRODUCTS);
    }
  };

  const handleNewProduct = (newProduct: Product) => {
    // Immediate UI update by prepending the new product
    setProducts(prev => [newProduct, ...prev]);
    // Fix: Use updateView instead of missing function
    updateView(View.HOME, '/');
    // Refresh from database to ensure everything is in sync
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
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: true
    }));
  };

  useEffect(() => {
    fetchProducts();
    fetchNavigation();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          username: session.user.email!.split('@')[0],
          avatar_url: `https://i.pravatar.cc/150?u=${session.user.id}`
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      try {
        const path = window.location.pathname;
        if (path === '/p/new') setView(View.NEW_THREAD);
        else if (path === '/notifications') setView(View.NOTIFICATIONS);
        else if (path === '/') setView(View.HOME);
        else if (path.startsWith('/c/')) {
          const slug = path.replace('/c/', '');
          setActiveCategory(unslugify(slug));
          setView(View.CATEGORY_DETAIL);
        }
      } catch (e) {}
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const filteredProducts = useMemo(() => {
    return searchProducts(products, searchQuery);
  }, [products, searchQuery]);

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar 
        user={user}
        currentView={view}
        setView={(v) => updateView(v, v === View.HOME ? '/' : `/${v}`)}
        onLogout={() => supabase.auth.signOut()}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onViewProfile={() => setView(View.PROFILE)}
        onSignInClick={() => setIsAuthModalOpen(true)}
        notifications={notifications}
        menuItems={menuItems}
      />

      <main className="max-w-7xl mx-auto py-8">
        {view === View.HOME && (
          <div className="flex gap-12 px-4 sm:px-8">
            <div className="flex-1 space-y-8">
              <div className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-sm">
                {filteredProducts.map((p, i) => (
                  <ProductCard 
                    key={p.id}
                    product={p}
                    onUpvote={() => {}}
                    hasUpvoted={votes.has(`${user?.id}_${p.id}`)}
                    onClick={(prod) => { setSelectedProduct(prod); setView(View.DETAIL); }}
                    onCommentClick={(prod) => { setSelectedProduct(prod); setView(View.DETAIL); setShouldScrollToComments(true); }}
                    rank={i + 1}
                    searchQuery={searchQuery}
                  />
                ))}
              </div>
            </div>
            <TrendingSidebar user={user} setView={setView} onSignIn={() => setIsAuthModalOpen(true)} />
          </div>
        )}

        {view === View.DETAIL && selectedProduct && (
          <ProductDetail 
            product={selectedProduct}
            user={user}
            onBack={() => setView(View.HOME)}
            onUpvote={() => {}}
            onCommentUpvote={() => {}}
            hasUpvoted={votes.has(`${user?.id}_${selectedProduct.id}`)}
            commentVotes={commentVotes}
            onAddComment={() => {}}
            onViewProfile={() => setView(View.PROFILE)}
            scrollToComments={shouldScrollToComments}
          />
        )}

        {view === View.POST_SUBMIT && (
          <PostSubmit onCancel={() => setView(View.HOME)} onNext={(url) => { setPendingUrl(url); setView(View.SUBMISSION); }} />
        )}

        {view === View.SUBMISSION && (
          <SubmitForm 
            initialUrl={pendingUrl}
            user={user}
            onCancel={() => setView(View.HOME)}
            onSuccess={handleNewProduct}
          />
        )}

        {view === View.CATEGORY_DETAIL && activeCategory && (
          <CategoryDetail 
            category={activeCategory}
            products={products}
            onBack={() => setView(View.CATEGORIES)}
            onProductClick={(p) => { setSelectedProduct(p); setView(View.DETAIL); }}
            onUpvote={() => {}}
            hasUpvoted={() => false}
            onCategorySelect={(cat) => setActiveCategory(cat)}
          />
        )}

        {view === View.CATEGORIES && (
          <Categories onBack={() => setView(View.HOME)} onCategorySelect={(cat) => { setActiveCategory(cat); setView(View.CATEGORY_DETAIL); }} />
        )}

        {view === View.FORUM_HOME && (
          <ForumHome setView={setView} user={user} onSignIn={() => setIsAuthModalOpen(true)} />
        )}
        
        {view === View.NOTIFICATIONS && (
          <NotificationsPage notifications={notifications} onBack={() => setView(View.HOME)} onMarkAsRead={() => {}} />
        )}
      </main>

      <Footer setView={setView} />

      <Auth isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
};

// Fix: Exporting App as default to resolve index.tsx error
export default App;
