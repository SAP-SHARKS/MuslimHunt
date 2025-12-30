
import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, LogOut, ChevronDown, ChevronRight, BookOpen, Users, Megaphone, Sparkles, X, 
  MessageSquare, Code, Cpu, CheckSquare, Palette, DollarSign, Bot, ArrowRight, Star,
  Rocket, Compass, Mail, FileText, Flame, Calendar, Plus, Bell, Settings, User as UserIcon,
  Triangle, Clock, Menu, Zap, Layout
} from 'lucide-react';
import { User, View, Notification, NavMenuItem } from '../types';
import { formatTimeAgo } from '../utils/dateUtils';

const ICON_MAP: Record<string, any> = {
  Rocket, Compass, MessageSquare, Flame, Calendar, Mail, BookOpen, FileText, Menu, X, Star, Zap, Code, Cpu, CheckSquare, Palette, Users, DollarSign, Megaphone
};

interface DropdownItem {
  label: string;
  subtext: string;
  icon: any;
  colorClass: string;
  bgClass: string;
  onClick?: () => void;
}

const RichDropdown: React.FC<{ label: string; items: DropdownItem[] }> = ({ label, items }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative group h-full flex items-center" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      <button className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-emerald-800 py-4 transition-colors">
        {label}
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 w-80 bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.1) ] rounded-2xl py-2 z-[100] animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
          {items.map((item, i) => (
            <button 
              key={i} 
              onClick={item.onClick}
              className="w-full flex items-start gap-4 px-5 py-4 hover:bg-gray-50 transition-all text-left group/item"
            >
              <div className={`w-10 h-10 ${item.bgClass} rounded-xl flex items-center justify-center ${item.colorClass} shrink-0 group-hover/item:scale-110 transition-transform shadow-sm`}>
                <item.icon className="w-5 h-5" />
              </div>
              <div className="flex flex-col pt-0.5">
                <p className="text-sm font-bold text-gray-900 group-hover/item:text-emerald-800 transition-colors">{item.label}</p>
                <p className="text-[11px] text-gray-500 font-medium leading-tight mt-1">{item.subtext}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const BestProductsDropdown: React.FC<{ setView: (view: View) => void }> = ({ setView }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('Trending');

  const mainSections = [
    { id: 'Trending', label: 'Trending Categories', icon: Flame, isLink: true },
    { id: 'Engineering', label: 'Engineering & Development', icon: Code },
    { id: 'LLMs', label: 'LLMs', icon: Cpu },
    { id: 'Productivity', label: 'Productivity', icon: CheckSquare },
    { id: 'Marketing', label: 'Marketing & Sales', icon: Megaphone },
    { id: 'Design', label: 'Design & Creative', icon: Palette },
    { id: 'Social', label: 'Social & Community', icon: Users },
    { id: 'Finance', label: 'Finance', icon: DollarSign },
  ];

  const categoryContent: Record<string, string[]> = {
    Trending: [
      'Vibe Coding Tools',
      'AI Dictation Apps',
      'AI notetakers',
      'Code Review Tools',
      'No-code Platforms',
      'Figma Plugins',
      'Static site generators'
    ],
    Engineering: ['AI Coding Agents', 'Code Editors', 'API Hubs', 'Vercel Rewrites', 'Rust Frameworks'],
    LLMs: ['GPT-4o Wrappers', 'Claude Artifacts', 'Local Llama', 'Prompt Engineering'],
    Productivity: ['Task Management', 'Focus Timers', 'Calendar Sync', 'CRM for Makers'],
    Marketing: ['SEO Automators', 'Cold Email Tools', 'Social Scheduler', 'Ad Attribution'],
    Design: ['UI Kits', 'Icon Sets', 'SVG Generators', 'Color Palette Tools'],
    Social: ['Community Forums', 'Streaks & Gamification', 'Chat Widgets', 'User Moderation'],
    Finance: ['Zakat Calculators', 'Halal Stock Filters', 'Islamic Banking', 'Expense Tracking']
  };

  return (
    <div className="relative group h-full flex items-center" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      <button className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-emerald-800 py-4 transition-colors">
        Best Products
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 w-[620px] bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.1) ] rounded-b-2xl overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="bg-gray-50/50 border-b border-gray-100 p-2">
            <button className="flex items-center gap-4 w-full hover:bg-white p-3 rounded-xl transition-all group/award text-left">
              <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-red-600 shadow-sm group-hover/award:scale-105 transition-transform shrink-0">
                <Star className="w-5 h-5 fill-red-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-black uppercase tracking-[0.15em] bg-red-100 text-red-700 px-2 py-0.5 rounded">ORBIT AWARDS</span>
                </div>
                <p className="text-[12px] text-gray-900 font-bold leading-tight">Awards powered by what reviewers actually say</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover/award:translate-x-1 group-hover/award:text-emerald-800 transition-all shrink-0" />
            </button>
          </div>

          <div className="flex divide-x divide-gray-100">
            <div className="flex-[1.1] p-5">
              <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 px-2">Browse</h3>
              <div className="grid grid-cols-1 gap-0.5">
                {mainSections.map((section) => (
                  <button 
                    key={section.id}
                    onMouseEnter={() => setActiveCategory(section.id)}
                    onClick={() => {
                      if (section.id === 'Trending') {
                        setView(View.CATEGORIES);
                        setIsOpen(false);
                      } else {
                        setView(View.HOME);
                        setIsOpen(false);
                      }
                    }}
                    className={`flex items-center gap-3 w-full px-3 py-2 text-sm font-semibold rounded-xl transition-all text-left group/item ${
                      activeCategory === section.id 
                        ? 'bg-gray-100 text-emerald-800' 
                        : 'text-gray-900 hover:bg-gray-50 hover:text-emerald-800'
                    }`}
                  >
                    <section.icon className={`w-4 h-4 transition-all shrink-0 ${
                      activeCategory === section.id ? 'text-emerald-800 scale-110' : 'text-gray-400 group-hover/item:text-emerald-800'
                    }`} />
                    {section.label}
                  </button>
                ))}
                <button 
                  onClick={() => { setView(View.CATEGORIES); setIsOpen(false); }}
                  className="flex items-center justify-between w-full px-3 py-3 text-xs font-black text-emerald-800 hover:bg-emerald-50 rounded-xl transition-all text-left mt-2 uppercase tracking-widest border border-transparent hover:border-emerald-100"
                >
                  Other Categories
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex-1 p-6 bg-gray-50/20 flex flex-col">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">
                  {activeCategory === 'Trending' ? 'Popular Now' : activeCategory}
                </h3>
                {activeCategory !== 'Trending' && (
                  <button 
                    onClick={() => { setView(View.CATEGORIES); setIsOpen(false); }}
                    className="text-[9px] font-black text-emerald-800 uppercase tracking-widest hover:underline"
                  >
                    View All
                  </button>
                )}
              </div>
              
              <div className="space-y-1">
                {categoryContent[activeCategory]?.map((link, i) => (
                  <button 
                    key={i}
                    onClick={() => { setView(View.HOME); setIsOpen(false); }}
                    className="block w-full px-3 py-2 text-xs font-bold text-gray-600 hover:text-emerald-800 hover:bg-white rounded-lg transition-all text-left truncate"
                  >
                    {link}
                  </button>
                ))}
              </div>
              
              <div className="mt-auto pt-8">
                <button 
                  onClick={() => { setView(View.CATEGORIES); setIsOpen(false); }}
                  className="w-full p-4 bg-emerald-900 rounded-2xl text-white relative overflow-hidden group/ad shadow-lg shadow-emerald-900/10 text-left active:scale-[0.98] transition-all"
                >
                  <div className="relative z-10">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-400 mb-1">PROMOTION</p>
                    <p className="text-[11px] font-bold leading-tight">Explore the full {activeCategory.toLowerCase()} directory →</p>
                  </div>
                  <div className="absolute -bottom-2 -right-2 opacity-10 group-hover/ad:scale-125 group-hover/ad:rotate-12 transition-transform">
                    <Sparkles className="w-12 h-12" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface NavbarProps {
  user: User | null;
  currentView: View;
  setView: (view: View) => void;
  onLogout: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onViewProfile: () => void;
  onSignInClick: () => void;
  notifications: Notification[];
  menuItems: NavMenuItem[];
}

const Navbar: React.FC<NavbarProps> = ({ 
  user, 
  currentView, 
  setView, 
  onLogout,
  searchQuery,
  onSearchChange,
  onViewProfile,
  onSignInClick,
  notifications,
  menuItems
}) => {
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showSubmitDropdown, setShowSubmitDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const submitDropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const notificationDropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (submitDropdownRef.current && !submitDropdownRef.current.contains(event.target as Node)) {
        setShowSubmitDropdown(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
      if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target as Node)) {
        setShowNotificationDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-[100] bg-white border-b border-gray-100 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 h-16">
        <div className="flex items-center gap-4">
          {/* Mobile Hamburger Icon - POSITIONED AT TOP-LEFT FOR MD- */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-all active:scale-90"
            aria-label="Toggle Mobile Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer shrink-0" 
            onClick={() => { setView(View.HOME); setIsMobileMenuOpen(false); }}
          >
            <div className="w-9 h-9 bg-emerald-800 rounded-lg flex items-center justify-center text-white shadow-md">
              <span className="font-serif text-xl font-bold">M</span>
            </div>
            <h1 className="hidden lg:block font-serif text-xl font-bold text-emerald-900 tracking-tight text-nowrap">
              Muslim Hunt
            </h1>
          </div>
        </div>

        {/* Desktop Navigation Links - MAPPED FROM SUPABASE */}
        <div className="hidden md:flex items-center gap-6 h-full">
          <BestProductsDropdown setView={setView} />
          
          {menuItems.map((menu) => (
            <React.Fragment key={menu.id}>
              {menu.sub_items && menu.sub_items.length > 0 ? (
                <RichDropdown 
                  label={menu.label} 
                  items={menu.sub_items.map(sub => ({
                    label: sub.label,
                    subtext: sub.subtext,
                    icon: ICON_MAP[sub.icon] || Star,
                    bgClass: sub.bgClass,
                    colorClass: sub.colorClass,
                    onClick: () => setView(sub.view)
                  }))} 
                />
              ) : (
                <button 
                  onClick={() => menu.view && setView(menu.view)}
                  className={`text-sm font-medium transition-colors py-4 px-1 flex items-center h-full ${
                    menu.view === currentView ? 'text-emerald-800 border-b-2 border-emerald-800' : 'text-gray-600 hover:text-emerald-800'
                  }`}
                >
                  {menu.label}
                </button>
              )}
            </React.Fragment>
          ))}

          <button 
            onClick={() => setView(View.SPONSOR)}
            className={`text-sm font-medium transition-colors py-4 px-1 flex items-center h-full ${
              currentView === View.SPONSOR ? 'text-emerald-800' : 'text-gray-600 hover:text-emerald-800'
            }`}
          >
            Advertise
          </button>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-sm hidden lg:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/10 focus:border-emerald-700 transition-all text-sm font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowMobileSearch(true)}
            className="lg:hidden p-2 text-gray-600 hover:text-emerald-800 transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="relative" ref={notificationDropdownRef}>
                <button 
                  onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
                  className={`p-2 transition-colors relative ${showNotificationDropdown ? 'text-emerald-800' : 'text-gray-400 hover:text-emerald-800'}`}
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#ff6154] rounded-full border-2 border-white" />
                  )}
                </button>
                
                {showNotificationDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-100 shadow-2xl rounded-2xl p-6 z-[110] animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center justify-between mb-4 border-b border-gray-50 pb-3">
                      <h4 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">Recent Notifications</h4>
                      {unreadCount > 0 && <span className="w-2 h-2 bg-[#ff6154] rounded-full" />}
                    </div>
                    <div className="space-y-4 mb-6">
                      {notifications.length === 0 ? (
                        <p className="text-[13px] text-gray-400 italic text-center py-4">No unread notifications! Enjoy your day</p>
                      ) : (
                        notifications.slice(0, 2).map((n) => (
                          <div key={n.id} className="flex gap-3 group/notif cursor-pointer">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 text-emerald-800 border border-emerald-100 shadow-sm group-hover/notif:scale-105 transition-transform">
                              {n.type === 'upvote' ? <Triangle className="w-4 h-4 fill-emerald-800" /> : <MessageSquare className="w-4 h-4" />}
                            </div>
                            <div className="min-w-0">
                              <p className="text-[13px] font-medium text-gray-900 leading-snug line-clamp-2">{n.message}</p>
                              <p className="text-[10px] font-black text-gray-300 uppercase tracking-tighter mt-1">{formatTimeAgo(n.created_at)}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <button 
                      onClick={() => { setView(View.NOTIFICATIONS); setShowNotificationDropdown(false); }}
                      className="w-full py-3 bg-white border border-gray-100 rounded-xl text-xs font-black text-gray-400 hover:text-emerald-800 hover:border-emerald-800 transition-all uppercase tracking-widest shadow-sm active:scale-[0.98]"
                    >
                      View all
                    </button>
                  </div>
                )}
              </div>

              <div className="relative" ref={submitDropdownRef}>
                <button 
                  onClick={() => setShowSubmitDropdown(!showSubmitDropdown)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all active:scale-95 border-2 ${
                    showSubmitDropdown 
                    ? 'bg-[#ff6154] border-[#ff6154] text-white' 
                    : 'border-emerald-800 text-emerald-800 hover:bg-emerald-50'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  Submit
                </button>
                {showSubmitDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-100 shadow-2xl rounded-xl py-2 z-[110] animate-in fade-in slide-in-from-top-2">
                    <button 
                      onClick={() => { setView(View.POST_SUBMIT); setShowSubmitDropdown(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                        <Rocket className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">Launch a product</p>
                        <p className="text-[10px] text-gray-400">Introduce your creation</p>
                      </div>
                    </button>
                    <button 
                      onClick={() => { setView(View.NEW_THREAD); setShowSubmitDropdown(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left group border-t border-gray-50"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">Start a thread</p>
                        <p className="text-[10px] text-gray-400">Ask the community</p>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              <div className="relative" ref={userDropdownRef}>
                <button 
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="w-9 h-9 rounded-full overflow-hidden border-2 border-emerald-800 p-0.5 hover:ring-2 hover:ring-emerald-200 transition-all active:scale-95"
                >
                  <img src={user.avatar_url} alt={user.username} className="w-full h-full object-cover rounded-full" />
                </button>
                {showUserDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-100 shadow-2xl rounded-xl py-2 z-[110] animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-gray-50">
                      <p className="text-xs font-black text-emerald-900 truncate">{user.username}</p>
                      <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
                    </div>
                    <button 
                      onClick={() => { onViewProfile(); setShowUserDropdown(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-sm font-bold text-gray-700"
                    >
                      <UserIcon className="w-4 h-4 text-gray-400" />
                      Profile
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-sm font-bold text-gray-700">
                      <Settings className="w-4 h-4 text-gray-400" />
                      Settings
                    </button>
                    <button 
                      onClick={() => { onLogout(); setShowUserDropdown(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-sm font-bold text-red-600 border-t border-gray-50"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setView(View.NEWSLETTER)}
                className="hidden lg:block border border-gray-200 text-gray-900 px-4 py-2 rounded-lg text-sm font-bold hover:border-gray-400 transition-all active:scale-95"
              >
                Subscribe
              </button>
              <button 
                onClick={onSignInClick}
                className="text-emerald-800 font-bold text-sm px-4 py-2 hover:bg-emerald-50 rounded-lg transition-colors"
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay - SLIDES DOWN FROM NAVBAR */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-2xl z-[120] animate-in slide-in-from-top-4 duration-300 overflow-y-auto max-h-[80vh]">
          <div className="p-6 space-y-8">
            {/* Mobile Categories Link */}
            <button 
              onClick={() => { setView(View.CATEGORIES); setIsMobileMenuOpen(false); }}
              className="w-full flex items-center justify-between group p-2"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-800">
                  <Layout className="w-6 h-6" />
                </div>
                <span className="text-xl font-black text-gray-900">Explore Categories</span>
              </div>
              <ArrowRight className="w-6 h-6 text-gray-300 group-hover:text-emerald-800 transition-colors" />
            </button>

            {/* Dynamic Mobile Menu Items - MAPPED FROM DATABASE */}
            {menuItems.map((menu) => (
              <div key={menu.id} className="space-y-4">
                <div className="flex items-center gap-3 px-2">
                  {menu.icon && ICON_MAP[menu.icon] && React.createElement(ICON_MAP[menu.icon], { className: "w-4 h-4 text-emerald-800" })}
                  <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">{menu.label}</h3>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {menu.sub_items && menu.sub_items.length > 0 ? menu.sub_items.map((sub, idx) => (
                    <button
                      key={idx}
                      onClick={() => { setView(sub.view); setIsMobileMenuOpen(false); }}
                      className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-all text-left group"
                    >
                      <div className={`w-10 h-10 ${sub.bgClass} ${sub.colorClass} rounded-xl flex items-center justify-center shrink-0 shadow-sm group-active:scale-95 transition-transform`}>
                        {sub.icon && ICON_MAP[sub.icon] && React.createElement(ICON_MAP[sub.icon], { className: "w-5 h-5" })}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-900">{sub.label}</p>
                        <p className="text-[11px] text-gray-500 font-medium leading-tight">{sub.subtext}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300" />
                    </button>
                  )) : (
                    <button
                      onClick={() => { menu.view && setView(menu.view); setIsMobileMenuOpen(false); }}
                      className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-all text-left"
                    >
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                           {menu.icon && ICON_MAP[menu.icon] ? React.createElement(ICON_MAP[menu.icon], { className: "w-5 h-5" }) : <Star className="w-5 h-5" />}
                         </div>
                         <span className="text-lg font-bold text-gray-900">{menu.label}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300" />
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button 
              onClick={() => { setView(View.SPONSOR); setIsMobileMenuOpen(false); }}
              className="w-full flex items-center gap-4 p-4 bg-emerald-900 text-white rounded-2xl shadow-xl shadow-emerald-900/10 active:scale-95 transition-all"
            >
              <Megaphone className="w-6 h-6 text-emerald-400" />
              <span className="text-lg font-black uppercase tracking-widest">Advertise with us</span>
            </button>
          </div>
        </div>
      )}

      {/* Mobile Search Modal */}
      {showMobileSearch && (
        <div className="fixed inset-0 z-[150] bg-black/50 lg:hidden" onClick={() => setShowMobileSearch(false)}>
          <div className="bg-white p-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                autoFocus
                className="flex-1 py-3 bg-transparent border-none outline-none text-lg"
              />
              <button
                onClick={() => setShowMobileSearch(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
