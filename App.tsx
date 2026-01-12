
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
import ProfileEdit from './components/ProfileEdit.tsx';
import ProfileEditSkeleton from './components/ProfileEditSkeleton.tsx';
import UserProfileSkeleton from './components/UserProfileSkeleton.tsx';
import MyProducts from './components/MyProducts.tsx';
import MyProductsSkeleton from './components/MyProductsSkeleton.tsx';
import LaunchGuide from './components/LaunchGuide.tsx';
import LaunchGuideSkeleton from './components/LaunchGuideSkeleton.tsx';
import HelpCenter from './components/HelpCenter.tsx';
import HelpCenterSkeleton from './components/HelpCenterSkeleton.tsx';
import Settings from './components/Settings.tsx';
import SettingsSkeleton from './components/SettingsSkeleton.tsx';
import ApiDashboard from './components/ApiDashboard.tsx';
import ApiDashboardSkeleton from './components/ApiDashboardSkeleton.tsx';
import NewThreadForm from './components/NewThreadForm.tsx';
import ForumHome from './components/ForumHome.tsx';
import ForumSidebar from './components/ForumSidebar.tsx';
import ForumCategory from './components/ForumCategory.tsx';
import ForumCategorySkeleton from './components/ForumCategorySkeleton.tsx';
import ThreadDetail from './components/ThreadDetail.tsx';
import ThreadDetailSkeleton from './components/ThreadDetailSkeleton.tsx';
import RecentComments from './components/RecentComments.tsx';
import NotificationsPage from './components/NotificationsPage.tsx';
import NotificationsSkeleton from './components/NotificationsSkeleton.tsx';
import Sponsor from './components/Sponsor.tsx';
import Newsletter from './components/Newsletter.tsx';
import Categories from './components/Categories.tsx';
import CategoryDetail from './components/CategoryDetail.tsx';
import AdminPanel from './components/AdminPanel.tsx';
import Footer from './components/Footer.tsx';
import { Product, User, View, Comment, Profile, Notification, NavMenuItem, Category, ForumCategory as IForumCategory } from './types.ts';
import { Sparkles, MessageSquare, TrendingUp, Users, ArrowRight, Triangle, Plus, Hash, Layout, ChevronRight, ShieldCheck, Loader2 } from 'lucide-react';
import { supabase } from './lib/supabase.ts';
import { searchProducts, slugify, findProductBySlug } from './utils/searchUtils.ts';
import ProductCardSkeleton from './components/ProductCardSkeleton.tsx';

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
        // Dispatch event for local router sync
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
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isLoadingMyProducts, setIsLoadingMyProducts] = useState(false);
  const [isLoadingSettings, setIsLoadingSettings] = useState(false);
  const [isLoadingProfileEdit, setIsLoadingProfileEdit] = useState(false);
  const [isLoadingApiDashboard, setIsLoadingApiDashboard] = useState(false);
  const [isLoadingLaunchGuide, setIsLoadingLaunchGuide] = useState(false);
  const [isLoadingHelpCenter, setIsLoadingHelpCenter] = useState(false);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [forumCategories, setForumCategories] = useState<IForumCategory[]>([]);
  const [activeForumCategorySlug, setActiveForumCategorySlug] = useState<string>('');
  const [activeThreadSlug, setActiveThreadSlug] = useState<string>('');
  const [menuItems, setMenuItems] = useState<NavMenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [profileActiveTab, setProfileActiveTab] = useState('About');
  const [myProductsFilter, setMyProductsFilter] = useState('all');
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
    setIsLoadingProducts(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, comments(*)')
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error('[Muslim Hunt] Error fetching products:', err);
    } finally {
      setTimeout(() => setIsLoadingProducts(false), 500);
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

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({ ...prev, [sectionId]: true }));
  };

  const handleNewProduct = (newProduct: Product) => {
    if (newProduct.is_approved) {
      setProducts(prev => [newProduct, ...prev]);
    }
    updateView(View.HOME, '/');
    fetchProducts();
  };


  const fetchForumCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('forum_categories')
        .select('*')
        .order('id', { ascending: true });

      if (!error && data) {
        setForumCategories(data);
      }
    } catch (err) {
      console.error('[Muslim Hunt] Error fetching forum categories:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchForumCategories();
    fetchNavigation();
  }, []);

  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

  const fetchProfile = async (username: string) => {
    const start = performance.now();
    setIsLoadingProfile(true);
    setSelectedProfile(null); // Reset previous profile to avoid staleness
    try {
      // Dev Admin Bypass check for public profile
      if (username === 'DevAdmin') {
        const localData = localStorage.getItem('dev_profile_data');
        if (localData) {
          setSelectedProfile(JSON.parse(localData));
          return;
        }
      }

      // Try to find user by username from profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();

      if (data) setSelectedProfile(data as Profile);
      else {
        // Fallback: try to find in loaded products (not reliable but helpful if permissions issue)
        const found = products.find(p => p.user_id && (p as any).maker_username === username); // Assuming join? No.
        if (!found) console.error('Profile not found', error);
      }
    } catch (e) {
      console.error('Error fetching profile', e);
    } finally {
      const end = performance.now();
      console.log(`[Profile Load] Fetch took ${Math.round(end - start)}ms`);
      setIsLoadingProfile(false);
    }
  };

  const handleThreadSubmit = async (data: { category_id: number; title: string; body: string }) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    try {
      // 1. Generate slug
      let slug = slugify(data.title);
      // Append random str to avoid collision
      slug = `${slug}-${Math.random().toString(36).substring(2, 7)}`;

      // 2. Insert into Supabase
      const { data: insertedData, error } = await supabase
        .from('threads')
        .insert({
          title: data.title,
          body: data.body,
          category_id: data.category_id,
          slug: slug,
          author_id: user.id
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // 3. Navigate to the new thread
      if (insertedData) {
        // Find category slug for navigation
        const category = forumCategories.find(c => c.id === data.category_id);
        const categorySlug = category ? category.slug : 'general'; // fallback

        setActiveForumCategorySlug(categorySlug);
        setActiveThreadSlug(slug);
        updateView(View.FORUM_THREAD, `/p/${categorySlug}/${slug}`);
      }

    } catch (err) {
      console.error('Error creating thread:', err);
      alert('Failed to create thread. Please try again.');
    }
  };

  const syncStateFromUrl = async () => {
    if (categories.length === 0 && products.length === 0) return;

    try {
      const path = window.location.pathname;
      const searchParams = new URLSearchParams(window.location.search);
      const segments = path.split('/').filter(Boolean);

      if (path === '/p/new') setView(View.NEW_THREAD);
      else if (path.startsWith('/p/')) {
        if (segments.length === 2) {
          // Category View: /p/general
          const slug = segments[1];
          setActiveForumCategorySlug(slug);
          setView(View.FORUM_CATEGORY);
        } else if (segments.length === 3) {
          // Thread View: /p/general/my-thread
          const catSlug = segments[1];
          const threadSlug = segments[2];
          setActiveForumCategorySlug(catSlug);
          setActiveThreadSlug(threadSlug);
          setView(View.FORUM_THREAD);
        }
      }
      else if (path === '/posts/new') setView(View.POST_SUBMIT);
      else if (path === '/posts/new/submission') setView(View.SUBMISSION);
      else if (path === '/notifications') {
        setIsLoadingNotifications(true);
        setTimeout(() => setIsLoadingNotifications(false), 800);
        setView(View.NOTIFICATIONS);
      }
      else if (path === '/forums') setView(View.FORUM_HOME);
      else if (path === '/forums/comments') setView(View.RECENT_COMMENTS);
      else if (path === '/sponsor') setView(View.SPONSOR);
      else if (path === '/newsletters') setView(View.NEWSLETTER);
      else if (path === '/categories') setView(View.CATEGORIES);
      else if (path === '/my/welcome') setView(View.WELCOME);
      else if (path === '/my/details/edit') {
        setIsLoadingProfileEdit(true);
        setTimeout(() => setIsLoadingProfileEdit(false), 800);
        setView(View.PROFILE_EDIT);
      }
      else if (path === '/my/products') {
        setIsLoadingMyProducts(true);
        // Simulate loading time as per request
        setTimeout(() => setIsLoadingMyProducts(false), 800);
        const filter = searchParams.get('filter') || 'all';
        setMyProductsFilter(filter);
        setView(View.MY_PRODUCTS);
      }
      else if (path === '/launch') {
        setIsLoadingLaunchGuide(true);
        setTimeout(() => setIsLoadingLaunchGuide(false), 800);
        setView(View.LAUNCH_GUIDE);
      }
      else if (path === '/help') {
        setIsLoadingHelpCenter(true);
        setTimeout(() => setIsLoadingHelpCenter(false), 800);
        setView(View.HELP_CENTER);
      }
      else if (path === '/admin') setView(View.ADMIN_PANEL);
      else if (path === '/my/settings/edit') {
        setIsLoadingSettings(true);
        setTimeout(() => setIsLoadingSettings(false), 800);
        setView(View.SETTINGS);
      }
      else if (path === '/my/subscriptions/products') {
        setIsLoadingSettings(true);
        setTimeout(() => setIsLoadingSettings(false), 800);
        setView(View.FOLLOWED_PRODUCTS);
      }
      else if (path === '/my/verification') {
        setIsLoadingSettings(true);
        setTimeout(() => setIsLoadingSettings(false), 800);
        setView(View.VERIFICATION);
      }
      else if (path === '/v2/oauth/applications') {
        setIsLoadingApiDashboard(true);
        setTimeout(() => setIsLoadingApiDashboard(false), 800);
        setView(View.API_DASHBOARD);
      }
      else if (path.startsWith('/@')) {
        const username = decodeURIComponent(path.substring(2)); // Remove /@ and decode
        await fetchProfile(username);
        setView(View.PROFILE);
      }
      else if (path === '/products' || segments[0] === 'products') {
        if (segments[0] === 'products' && segments[1]) {
          // Dynamic Product Detail Routing
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
      else if (path.startsWith('/topics/')) {
        const slug = path.split('/topics/')[1]?.split('?')[0];
        if (slug) {
          setActiveTag(slug);
          setView(View.DIRECTORY);
        } else {
          setView(View.HOME);
        }
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
    const initSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
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
      }
      setIsAuthLoading(false);
    };

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
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
      } else setUser(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Simulate Notifications & Streaks
  useEffect(() => {
    if (user) {
      // Simple streak logic using local storage simulation
      const today = new Date().toDateString();
      const lastLogin = localStorage.getItem('last_login_date');
      let streak = parseInt(localStorage.getItem('user_streak') || '0');

      if (lastLogin !== today) {
        streak++; // increment streak for "today"
        localStorage.setItem('last_login_date', today);
        localStorage.setItem('user_streak', streak.toString());
      }

      const mockNotifications: Notification[] = [];

      // Streak Notification if streak > 0
      if (streak > 1) {
        mockNotifications.push({
          id: 'streak-1',
          type: 'streak',
          message: `You maintained a streak of ${streak} days!`,
          created_at: new Date().toISOString(),
          is_read: false,
          streak_days: streak
        });
      }

      // Mock Admin Approval if admin
      if (user.is_admin) {
        mockNotifications.push({
          id: 'admin-1',
          type: 'approval',
          message: 'New product "Halal AI" is waiting for your approval.',
          created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          is_read: false
        });
      }

      // Mock Maker Notification
      mockNotifications.push({
        id: 'maker-1',
        type: 'upvote',
        message: 'Someone just upvoted your product "Quran App".',
        created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        is_read: true,
        avatar_url: 'https://i.pravatar.cc/150?u=voter'
      });

      // Add 5 day streak example if needed for demo
      if (streak < 5) {
        mockNotifications.push({
          id: 'streak-demo',
          type: 'streak',
          message: `You maintained a streak of 5 days!`,
          created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          is_read: false,
          streak_days: 5
        });
      }

      setNotifications(mockNotifications);
    }
  }, [user]);

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
      else if (newView === View.NOTIFICATIONS) {
        path = '/notifications';
        setIsLoadingNotifications(true);
        setTimeout(() => setIsLoadingNotifications(false), 800);
      }
      else if (newView === View.FORUM_HOME) path = '/forums';
      else if (newView === View.RECENT_COMMENTS) path = '/forums/comments';
      else if (newView === View.SPONSOR) path = '/sponsor';
      else if (newView === View.NEWSLETTER) path = '/newsletters';
      else if (newView === View.CATEGORIES) path = '/categories';
      else if (newView === View.WELCOME) path = '/my/welcome';
      else if (newView === View.WELCOME) path = '/my/welcome';
      else if (newView === View.PROFILE_EDIT) {
        path = '/my/details/edit';
        setIsLoadingProfileEdit(true);
        setTimeout(() => setIsLoadingProfileEdit(false), 800);
      }
      else if (newView === View.MY_PRODUCTS) {
        path = '/my/products';
        // if customPath has query params, we rely on them appearing in the path? 
        // actually customPath is passed as full string in handleTabClick so it's fine.
        // BUT if wait, updateView logic re-constructs path if customPath is not falsy?
        // Wait, line 417 says `let path = customPath || '/';`
        // So if we pass `/my/products?filter=xyz`, specific logic below might override it if we are not careful.
        // The block is `if (!customPath) { ... }`. 
        // So if customPath IS provided, we skip the block.
        // However, we still need to handle side effects like `setIsLoading`.

        // Refactoring to ensure side effects run even with customPath for known views
        if (customPath && customPath.startsWith('/my/products')) {
          setIsLoadingMyProducts(true);
          setTimeout(() => setIsLoadingMyProducts(false), 800);
          // extracting filter from customPath for local state sync?
          // Since we use window.location in syncStateFromUrl, and customPath is pushed to history...
          // Wait, safeHistory.push happens at the end.
          // We need to update state immediately if we want instant feedback?
          // syncStateFromUrl parses window.location.
          // If we push state, popstate event is dispatched (custom logic in safeHistory.push).
          // But existing logic relies on `syncStateFromUrl` being called on popstate or manually?
          // safeHistory.push dispatches 'popstate'.
          // `syncStateFromUrl` listens to 'popstate'.
          // So if we push path, state should sync.
        } else if (!customPath) {
          path = '/my/products';
          setIsLoadingMyProducts(true);
          setTimeout(() => setIsLoadingMyProducts(false), 800);
        }
      }
      else if (newView === View.LAUNCH_GUIDE) {
        path = '/launch';
        setIsLoadingLaunchGuide(true);
        setTimeout(() => setIsLoadingLaunchGuide(false), 800);
      }
      else if (newView === View.HELP_CENTER) {
        path = '/help';
        setIsLoadingHelpCenter(true);
        setTimeout(() => setIsLoadingHelpCenter(false), 800);
      }
      else if (newView === View.ADMIN_PANEL) path = '/admin';
      else if (newView === View.SETTINGS) {
        path = '/my/settings/edit';
        setIsLoadingSettings(true);
        setTimeout(() => setIsLoadingSettings(false), 800);
      }
      else if (newView === View.FOLLOWED_PRODUCTS) {
        path = '/my/subscriptions/products';
        setIsLoadingSettings(true);
        setTimeout(() => setIsLoadingSettings(false), 800);
      }
      else if (newView === View.VERIFICATION) {
        path = '/my/verification';
        setIsLoadingSettings(true);
        setTimeout(() => setIsLoadingSettings(false), 800);
      }
      else if (newView === View.API_DASHBOARD) {
        path = '/v2/oauth/applications';
        setIsLoadingApiDashboard(true);
        setTimeout(() => setIsLoadingApiDashboard(false), 800);
      }
      else if (newView === View.DIRECTORY) path = '/products';
      else if (newView === View.CATEGORY_DETAIL && activeCategory) {
        path = `/categories/${slugify(activeCategory)}`;
      }
      else if (newView === View.PROFILE && user) path = `/@${user.username}`;
      else if (newView === View.FORUM_CATEGORY && activeForumCategorySlug) path = `/p/${activeForumCategorySlug}`;
      else if (newView === View.FORUM_THREAD && activeThreadSlug) path = `/p/${activeForumCategorySlug}/${activeThreadSlug}`;
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

  const handleUpvote = (id: string) => {
    if (!user) { setIsAuthModalOpen(true); return; }
    const voteKey = `${user.id}_${id}`;
    if (votes.has(voteKey)) return;
    setVotes(prev => new Set(prev).add(voteKey));
    setProducts(curr => curr.map(p => p.id === id ? { ...p, upvotes_count: (p.upvotes_count || 0) + 1 } : p));
  };

  const filteredProducts = useMemo(() => {
    let result = searchProducts(products, searchQuery);
    if (activeTag) {
      result = result.filter(p => slugify(p.category) === activeTag);
    }
    return result;
  }, [products, searchQuery, activeTag]);

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

  // Real-time Comment Subscription (Global)
  useEffect(() => {
    const channel = supabase
      .channel('global_comments')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'comments' },
        (payload) => {
          const newComment = payload.new as Comment;
          // We can reuse the handleCommentAdded logic to update the product state
          // This ensures the feed count updates instantly for ANY user
          handleCommentAdded(newComment.product_id, newComment);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleCommentAdded = (productId: string, newComment: Comment) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const updatedComments = p.comments ? [newComment, ...p.comments] : [newComment];
        return { ...p, comments: updatedComments };
      }
      return p;
    }));
  };

  // Real-time Comment Subscription (Global)
  useEffect(() => {
    const channel = supabase
      .channel('global_comments')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'comments' },
        (payload) => {
          const newComment = payload.new as Comment;
          handleCommentAdded(newComment.product_id, newComment);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const isForumView = [View.FORUM_HOME, View.RECENT_COMMENTS, View.NEW_THREAD, View.FORUM_CATEGORY, View.FORUM_THREAD].includes(view);

  const handleDevLogin = () => {
    setUser({
      id: '00000000-0000-0000-0000-000000000000',
      email: 'admin@muslimhunt.com',
      username: 'DevAdmin',
      avatar_url: 'https://i.pravatar.cc/150?u=dev-admin',
      is_admin: true,
      bio: 'Development Admin Account',
      headline: 'Building the Future of Halal Tech'
    });
    setIsAuthModalOpen(false);
  };

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
          onViewProfile={() => user && updateView(View.PROFILE, '/@' + user.username)}
          onSignInClick={() => setIsAuthModalOpen(true)}
          notifications={notifications}
          menuItems={menuItems}
          categories={categories}
          onCategorySelect={handleCategorySelect}
        />
      )}

      <Auth
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => updateView(View.HOME)}
        onDevLogin={handleDevLogin}
      />

      <main className="pb-10">
        {view === View.HOME && (
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 flex flex-col lg:flex-row gap-12">
            <div className="flex-1">
              <header className="mb-6">
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

                {/* Dedicated Loading State when isLoadingProducts is true */}
                {isLoadingProducts && (
                  <section>
                    <h2 className="text-2xl font-serif font-bold text-emerald-900 mb-6 border-b border-emerald-50 pb-4">Top Products Launching Today</h2>
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden mb-6">
                      {[1, 2, 3, 4, 5].map(i => <ProductCardSkeleton key={i} />)}
                    </div>
                  </section>
                )}
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
              {view === View.FORUM_CATEGORY && (
                <ForumCategory
                  categorySlug={activeForumCategorySlug}
                  categories={forumCategories}
                  setView={updateView}
                  user={user}
                  onSignIn={() => setIsAuthModalOpen(true)}
                />
              )}
              {view === View.FORUM_THREAD && (
                <ThreadDetail
                  threadSlug={activeThreadSlug}
                  categorySlug={activeForumCategorySlug}
                  setView={updateView}
                  user={user}
                  onSignIn={() => setIsAuthModalOpen(true)}
                />
              )}
              {view === View.RECENT_COMMENTS && <RecentComments setView={updateView} user={user} onViewProfile={() => { }} onSignIn={() => setIsAuthModalOpen(true)} />}
              {view === View.NEW_THREAD && <NewThreadForm onCancel={() => updateView(View.FORUM_HOME)} onSubmit={handleThreadSubmit} setView={updateView} />}
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
            product={selectedProduct} user={user} onBack={() => { updateView(View.HOME); fetchProducts(); }}
            onUpvote={handleUpvote} hasUpvoted={votes.has(`${user?.id}_${selectedProduct.id}`)}
            commentVotes={commentVotes} onCommentUpvote={() => { }} onAddComment={() => { }} onViewProfile={() => { }} scrollToComments={shouldScrollToComments}
            onCommentAdded={(newComment) => handleCommentAdded(selectedProduct.id, newComment)}
          />
        )}
        {view === View.NOTIFICATIONS && (
          isLoadingNotifications ? <NotificationsSkeleton /> : <NotificationsPage notifications={notifications} onBack={() => updateView(View.HOME)} onMarkAsRead={() => { }} />
        )}
        {view === View.POST_SUBMIT && <PostSubmit onCancel={() => updateView(View.HOME)} onNext={(url) => { setPendingUrl(url); updateView(View.SUBMISSION); }} />}
        {view === View.WELCOME && user && <Welcome userEmail={user.email} userId={user.id} onComplete={() => updateView(View.HOME)} />}
        {view === View.ADMIN_PANEL && <AdminPanel user={user} onBack={() => updateView(View.HOME)} onRefresh={fetchProducts} />}
        {view === View.NEWSLETTER && <Newsletter onSponsorClick={() => setView(View.SPONSOR)} />}
        {view === View.SPONSOR && <Sponsor />}

        {view === View.PROFILE && (
          isLoadingProfile || !selectedProfile ? (
            <UserProfileSkeleton />
          ) : (
            <UserProfile
              profile={selectedProfile}
              currentUser={user}
              products={products}
              votes={votes}
              onBack={() => updateView(View.HOME)}
              onProductClick={(p) => { setSelectedProduct(p); updateView(View.DETAIL, `/products/${slugify(p.name)}`); }}
              onCommentClick={(p) => { setSelectedProduct(p); setShouldScrollToComments(true); updateView(View.DETAIL, `/products/${slugify(p.name)}`); }}
              onUpvote={handleUpvote}
              onEditProfile={() => updateView(View.PROFILE_EDIT, '/my/details/edit')}
            />
          )
        )}

        {view === View.PROFILE_EDIT && user && (
          isLoadingProfileEdit ? (
            <ProfileEditSkeleton />
          ) : (
            <ProfileEdit
              user={user}
              onBack={() => updateView(View.HOME)}
              onViewProfile={() => updateView(View.PROFILE, '/@' + (user.username || user.email?.split('@')[0]))}
              onNavigate={updateView}
            />
          )
        )}

        {view === View.MY_PRODUCTS && (
          isLoadingMyProducts ? (
            <MyProductsSkeleton />
          ) : (
            <MyProducts
              onNewPost={() => updateView(View.POST_SUBMIT)}
              activeFilter={myProductsFilter}
              onNavigate={updateView}
            />
          )
        )}

        {(view === View.SETTINGS || view === View.FOLLOWED_PRODUCTS || view === View.VERIFICATION) && (
          isLoadingSettings ? (
            <SettingsSkeleton />
          ) : (
            <Settings onNavigate={updateView} currentView={view} />
          )
        )}

        {view === View.API_DASHBOARD && (
          isLoadingApiDashboard ? (
            <ApiDashboardSkeleton />
          ) : (
            <ApiDashboard />
          )
        )}

        {view === View.LAUNCH_GUIDE && (
          isLoadingLaunchGuide ? (
            <LaunchGuideSkeleton />
          ) : (
            <LaunchGuide onBack={() => updateView(View.HOME)} />
          )
        )}

        {view === View.HELP_CENTER && (
          isLoadingHelpCenter ? (
            <HelpCenterSkeleton />
          ) : (
            <HelpCenter onBack={() => updateView(View.HOME)} />
          )
        )}
      </main>

      {/* Mobile-Only Forum Action Section */}
      <div className="block lg:hidden px-4 mb-10">
        <button
          onClick={() => user ? updateView(View.NEW_THREAD) : setIsAuthModalOpen(true)}
          className="flex items-center justify-center w-full py-4 border border-gray-200 rounded-full bg-white text-gray-700 font-bold shadow-sm active:scale-95 transition-all gap-2"
        >
          <Plus className="w-5 h-5 text-gray-400" />
          Start new thread
        </button>
      </div>

      <Footer setView={updateView} />
    </div>
  );
};

export default App;
