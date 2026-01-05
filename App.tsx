
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

const ADMIN_EMAILS = ['admin@muslimhunt.com', 'moderator@muslimhunt.com'];

const safeHistory = {
  isSupported: () => {
    try {
      if (!window.history || !window.history.pushState) return false;
      return window.location.protocol !== 'blob:' && !window.location.hostname.includes('scf.usercontent.goog');
    } catch (e) { return false; }
  },
  push: (path: string) => {
    if (safeHistory.isSupported()) {
      try { window.history.pushState({}, '', path.startsWith('/') ? path : `/${path}`); } catch (e) {}
    }
  },
  replace: (path: string) => {
    if (safeHistory.isSupported()) {
      try { window.history.replaceState({}, '', path.startsWith('/') ? path : `/${path}`); } catch (e) {}
    }
  }
};

export const TrendingSidebar: React.FC<{ user: User | null; setView: (v: View) => void; onSignIn: () => void }> = ({ user, setView, onSignIn }) => {
  const isAdmin = user?.is_admin || ADMIN_EMAILS.includes(user?.email || '');
  
  return (
    <aside className="hidden lg:block w-[300px] shrink-0">
      <div className="sticky top-24 space-y-10">
        {isAdmin && (
          <section className="bg-emerald-900 rounded-2xl p-6 text-white shadow-xl">
             <div className="flex items-center gap-2 mb-3 text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Moderator</span>
             </div>
             <h3 className="text-lg font-bold mb-4 leading-tight">Review Queue</h3>
             <button onClick={() => setView(View.ADMIN_PANEL)} className="w-full py-2.5 bg-white text-emerald-900 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-50 transition-all">
               Open Admin Panel
             </button>
          </section>
        )}

        <section>
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-100">
            <h3 className="text-[13px] font-semibold text-gray-900 uppercase tracking-tight">Trending Forum Threads</h3>
          </div>
          
          <div className="space-y-6">
            {[
              { tag: "p/general", title: "Favorite Halal apps for 2025?", comments: 24, upvotes: 156, icon: Hash },
              { tag: "p/vibecoding", title: "Which tech stack for Halal e-commerce?", comments: 18, upvotes: 92, icon: Layout },
              { tag: "p/community", title: "Seeking Beta Testers for prayer app", comments: 42, upvotes: 310, icon: Users }
            ].map((thread, i) => (
              <div key={i} className="group cursor-pointer" onClick={() => setView(View.FORUM_HOME)}>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase">
                    <thread.icon className="w-3 h-3 opacity-60" />
                    <span>{thread.tag}</span>
                  </div>
                  <h4 className="text-[13px] font-bold text-gray-900 group-hover:text-emerald-800 leading-snug">{thread.title}</h4>
                  <div className="flex items-center gap-3 text-[10px] font-medium text-gray-400">
                    <div className="flex items-center gap-1">
                      <Triangle className="w-2.5 h-2.5 fill-gray-300" />
                      {thread.upvotes}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-2.5 h-2.5" />
                      {thread.comments}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-50">
            <button onClick={() => setView(View.FORUM_HOME)} className="w-full flex items-center justify-between text-[11px] font-bold text-emerald-800 uppercase tracking-wide group">
              View all discussions <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
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
  const [menuItems, setMenuItems] = useState<NavMenuItem[]>([]);
  const [votes, setVotes] = useState<Set<string>>(new Set());
  const [commentVotes, setCommentVotes] = useState<Set<string>>(new Set());
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [shouldScrollToComments, setShouldScrollToComments] = useState(false);
  const [appLoading, setAppLoading] = useState(true);

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').eq('is_approved', true).order('created_at', { ascending: false });
    const allProducts = data || [];
    setProducts(allProducts);
    
    // Determine view and selected product from URL after products load
    const path = window.location.pathname;
    if (path.startsWith('/products/')) {
      const slug = path.split('/products/')[1].replace(/\/$/, '');
      const prod = findProductBySlug(allProducts, slug);
      if (prod) {
        setSelectedProduct(prod);
        setView(View.DETAIL);
      }
    } else if (path === '/p/new') {
      setView(View.NEW_THREAD);
    } else {
      setView(View.HOME);
    }
  };

  const fetchCategories = async () => {
    const { data } = await supabase.from('product_categories').select('*').order('display_order');
    setCategories(data || []);
  };

  useEffect(() => {
    // Initial Auth and Data check
    const initApp = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const m = session.user.user_metadata || {};
          const isAdmin = ADMIN_EMAILS.includes(session.user.email!);
          setUser({ 
            id: session.user.id, 
            email: session.user.email!, 
            username: m.full_name || session.user.email!.split('@')[0], 
            avatar_url: m.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${session.user.id}`,
            is_admin: isAdmin
          });
        }
        await Promise.all([fetchProducts(), fetchCategories()]);
      } finally {
        setAppLoading(false);
      }
    };

    initApp();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const m = session.user.user_metadata || {};
        const isAdmin = ADMIN_EMAILS.includes(session.user.email!);
        setUser({ 
          id: session.user.id, 
          email: session.user.email!, 
          username: m.full_name || session.user.email!.split('@')[0], 
          avatar_url: m.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${session.user.id}`,
          is_admin: isAdmin
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/') {
        setView(View.HOME);
      } else if (path.startsWith('/products/')) {
        const slug = path.split('/products/')[1].replace(/\/$/, '');
        const prod = findProductBySlug(products, slug);
        if (prod) {
          setSelectedProduct(prod);
          setView(View.DETAIL);
        }
      } else if (path === '/p/new') {
        setView(View.NEW_THREAD);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [products]);

  const updateView = (newView: View, customPath?: string) => {
    setView(newView);
    let path = customPath || '/';
    if (!customPath) {
      if (newView === View.HOME) path = '/';
      else if (newView === View.NEW_THREAD) path = '/p/new';
    }
    safeHistory.push(path);
  };

  const handleProductClick = (prod: Product, scrollToCommentsView = false) => {
    setSelectedProduct(prod);
    setShouldScrollToComments(scrollToCommentsView);
    setView(View.DETAIL);
    safeHistory.push(`/products/${slugify(prod.name)}`);
  };

  const handleUpvote = (id: string) => {
    if (!user) { setIsAuthModalOpen(true); return; }
    const voteKey = `${user.id}_${id}`;
    if (votes.has(voteKey)) return;
    setVotes(prev => new Set(prev).add(voteKey));
    setProducts(curr => curr.map(p => p.id === id ? { ...p, upvotes_count: (p.upvotes_count || 0) + 1 } : p));
  };

  const groupedProducts = useMemo(() => {
    const now = new Date().getTime();
    const oneDay = 86400000;
    const filtered = searchProducts(products, searchQuery);
    const grouped = { today: [] as Product[], yesterday: [] as Product[], older: [] as Product[] };
    filtered.forEach(p => {
      const diff = now - new Date(p.created_at).getTime();
      if (diff < oneDay) grouped.today.push(p);
      else if (diff < 2 * oneDay) grouped.yesterday.push(p);
      else grouped.older.push(p);
    });
    return grouped;
  }, [products, searchQuery]);

  if (appLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="w-12 h-12 bg-emerald-800 rounded-xl flex items-center justify-center text-white mb-4 animate-pulse">
          <span className="font-serif text-2xl font-bold">M</span>
        </div>
        <Loader2 className="w-6 h-6 text-emerald-800 animate-spin" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-white selection:bg-emerald-100 selection:text-emerald-900`}>
      <Navbar 
        user={user} currentView={view} setView={updateView} 
        onLogout={async () => { await supabase.auth.signOut(); setUser(null); updateView(View.HOME); }} 
        searchQuery={searchQuery} onSearchChange={setSearchQuery} 
        onViewProfile={() => {}} onSignInClick={() => setIsAuthModalOpen(true)}
        notifications={notifications} menuItems={menuItems}
      />
      
      <Auth isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      <main className="max-w-[1100px] mx-auto px-4 lg:px-6 py-8">
        {view === View.HOME && (
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="flex-1 min-w-0">
              <div className="space-y-12">
                {[
                  { id: 'today', title: "Top Products Launching Today", data: groupedProducts.today },
                  { id: 'yesterday', title: "Yesterday", data: groupedProducts.yesterday },
                  { id: 'older', title: "Older", data: groupedProducts.older }
                ].map((section) => (
                  section.data.length > 0 && (
                    <section key={section.id}>
                      <h2 className="text-[20px] font-semibold text-gray-900 mb-5">{section.title}</h2>
                      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-6">
                        {section.data.map((p, i) => (
                          <ProductCard 
                            key={p.id} product={p} rank={i + 1} onUpvote={handleUpvote} 
                            hasUpvoted={votes.has(`${user?.id}_${p.id}`)} 
                            onClick={(prod) => handleProductClick(prod)} 
                            onCommentClick={(prod) => handleProductClick(prod, true)} 
                          />
                        ))}
                      </div>
                    </section>
                  )
                ))}
              </div>
            </div>
            <TrendingSidebar user={user} setView={updateView} onSignIn={() => setIsAuthModalOpen(true)} />
          </div>
        )}

        {view === View.DETAIL && selectedProduct && (
          <ProductDetail 
            product={selectedProduct} user={user} onBack={() => updateView(View.HOME)} 
            onUpvote={handleUpvote} hasUpvoted={votes.has(`${user?.id}_${selectedProduct.id}`)} 
            commentVotes={commentVotes} onCommentUpvote={() => {}} onAddComment={() => {}} onViewProfile={() => {}} 
            scrollToComments={shouldScrollToComments} 
          />
        )}
      </main>

      <Footer setView={updateView} />
    </div>
  );
};

export default App;
