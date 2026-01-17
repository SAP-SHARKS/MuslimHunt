
import React, { useState, useRef, useEffect } from 'react';
import {
  Search, LogOut, ChevronDown, ChevronRight, BookOpen, Users, Megaphone, Sparkles, X,
  MessageSquare, Code, Cpu, CheckSquare, Palette, DollarSign, Bot, ArrowRight, Star,
  Rocket, Mail, Plus, Bell, User as UserIcon, Flame,
  Triangle, Menu, Layout, Hash, ShieldCheck, Calendar, Trophy, Settings
} from 'lucide-react';
import { User, View, Notification, NavMenuItem, Category } from '../types';
import { formatTimeAgo } from '../utils/dateUtils';
import NotificationBell from './NotificationBell.tsx';
import RichDropdown from './RichDropdown';

const ICON_MAP: Record<string, any> = {
  Rocket, MessageSquare, Mail, BookOpen, Star, Code, Cpu, CheckSquare, Palette, Users, DollarSign, Megaphone, Layout, Triangle, Bot, Sparkles, Trophy, Hash
};

// Mobile-specific nested data
const BEST_PRODUCTS_MOBILE = [
  { label: 'Trending Categories', view: View.CATEGORIES, icon: Sparkles },
  { label: 'Engineering & Development', view: View.CATEGORIES, icon: Code },
  { label: 'LLMs', view: View.CATEGORIES, icon: Bot },
  { label: 'Productivity', view: View.CATEGORIES, icon: CheckSquare },
  { label: 'Marketing & Sales', view: View.CATEGORIES, icon: Megaphone },
  { label: 'Design & Creative', view: View.CATEGORIES, icon: Palette },
  { label: 'Social & Community', view: View.CATEGORIES, icon: Users },
  { label: 'Finance', view: View.CATEGORIES, icon: DollarSign },
  { label: 'AI Agents', view: View.CATEGORIES, icon: Bot },
  { label: 'Other Categories', view: View.CATEGORIES, icon: Hash },
];

const LAUNCHES_MOBILE = [
  { label: 'Launch archive', sub: 'Most-loved launches by the community', view: View.LAUNCH_ARCHIVE },
  { label: 'Launch Guide', sub: 'Checklists and pro tips for launching', view: View.LAUNCH_GUIDE },
];

const NEWS_MOBILE = [
  { label: 'Newsletter', sub: 'The best of Muslim Hunt, every day', view: View.NEWSLETTER, icon: Mail },
  { label: 'Stories', sub: 'Tech news, interviews, and tips from makers', view: View.STORIES, icon: BookOpen },
  { label: 'Changelog', sub: 'New Muslim Hunt features and releases', view: View.NEWSLETTER, icon: Rocket },
];

const FORUMS_MOBILE = [
  { label: 'Forums', sub: 'Ask questions, find support, and connect', view: View.FORUM_HOME, icon: MessageSquare },
  { label: 'Streaks', sub: 'The most active community members', view: View.FORUM_HOME, icon: Trophy },
  { label: 'Events', sub: 'Meet others online and in-person', view: View.FORUM_HOME, icon: Calendar },
];

// RichDropdown component is now imported from separate file

interface NavbarProps {
  user: User | null;
  currentView: View;
  setView: (view: View, path?: string) => void;
  onLogout: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onViewProfile: () => void;
  onSignInClick: () => void;
  notifications: Notification[];
  menuItems: NavMenuItem[];
  categories?: Category[];
  onCategorySelect?: (category: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({
  user, currentView, setView, onLogout, searchQuery, onSearchChange, onViewProfile, onSignInClick, notifications, menuItems
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [expandedAccordion, setExpandedAccordion] = useState<string | null>(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [showSubmitDropdown, setShowSubmitDropdown] = useState(false);

  const userDropdownRef = useRef<HTMLDivElement>(null);
  const notificationDropdownRef = useRef<HTMLDivElement>(null);
  const submitDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) setShowUserDropdown(false);
      if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target as Node)) setShowNotificationDropdown(false);
      if (submitDropdownRef.current && !submitDropdownRef.current.contains(event.target as Node)) setShowSubmitDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setExpandedAccordion(null);
  };

  const handleNavigate = (view: View, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setView(view);
    closeDrawer();
    setShowSubmitDropdown(false);
  };

  const toggleAccordion = (section: string) => {
    setExpandedAccordion(expandedAccordion === section ? null : section);
  };

  const mainNavItems = menuItems.filter(item => ["Best Products", "Launches", "News", "Forums", "Advertise"].includes(item.label));

  return (
    <>
      <nav className="sticky top-0 z-[100] bg-white border-b border-gray-100 px-4 sm:px-8 h-16 flex items-center">
        <div className="max-w-7xl mx-auto flex items-center justify-between w-full">

          {/* Mobile Header Layout (< 1024px) */}
          <div className="lg:hidden flex items-center justify-between w-full bg-white">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="p-1 -ml-1 text-gray-600 hover:text-primary transition-all active:scale-90"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>

              <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavigate(View.HOME)}>
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-md">
                  <span className="font-serif text-lg font-bold">M</span>
                </div>
                <h1 className="font-serif text-lg font-bold text-primary tracking-tight">Muslim Hunt</h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {user && (
                <div className="relative" ref={submitDropdownRef}>
                  <button
                    onClick={() => setShowSubmitDropdown(!showSubmitDropdown)}
                    className="flex items-center gap-1 px-3 py-1 text-sm font-bold text-primary border border-primary rounded-xl hover:bg-primary-light transition-all whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4" />
                    Submit
                  </button>

                  {showSubmitDropdown && (
                    <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-100 shadow-[0_15px_45px_rgba(0,0,0,0.1)] rounded-2xl py-2 z-[110] animate-in fade-in slide-in-from-top-2">
                      <button
                        onClick={(e) => handleNavigate(View.POST_SUBMIT, e)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-primary-light transition-colors group/item"
                      >
                        <div className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center text-primary group-hover/item:scale-105 transition-transform">
                          <Rocket className="w-4 h-4" />
                        </div>
                        <span className="text-[13px] font-bold text-gray-700 group-hover/item:text-primary">Launch a product</span>
                      </button>
                      <button
                        onClick={(e) => handleNavigate(View.NEW_THREAD, e)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-primary-light transition-colors group/item"
                      >
                        <div className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center text-primary group-hover/item:scale-105 transition-transform">
                          <MessageSquare className="w-4 h-4" />
                        </div>
                        <span className="text-[13px] font-bold text-gray-700 group-hover/item:text-primary">Start a thread</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {!user ? (
                <button
                  onClick={onSignInClick}
                  className="px-3 py-1 bg-primary text-white font-bold text-sm rounded-xl hover:bg-primary-hover transition-all active:scale-95 shadow-sm whitespace-nowrap"
                >
                  Sign In
                </button>
              ) : (
                <div
                  className="w-8 h-8 rounded-full overflow-hidden border border-primary p-0.5 cursor-pointer"
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                >
                  <img src={user.avatar_url} className="w-full h-full object-cover rounded-full" alt="User profile" />
                </div>
              )}
            </div>
          </div>

          {/* Desktop Logo (> 1024px) */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => setView(View.HOME)}>
              <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center text-white shadow-md"><span className="font-serif text-xl font-bold">M</span></div>
              <h1 className="font-serif text-xl font-bold text-primary tracking-tight text-nowrap">Muslim Hunt</h1>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center lg:ml-12 gap-7 h-full nav-menu">
            {mainNavItems.map((menu) => (
              <React.Fragment key={menu.id}>
                {menu.sub_items && menu.sub_items.length > 0 ? (
                  <RichDropdown label={menu.label} items={menu.sub_items.map(sub => ({
                    label: sub.label, subtext: sub.subtext, icon: ICON_MAP[sub.icon] || Star,
                    bgClass: sub.bgClass, colorClass: sub.colorClass,
                    onClick: () => { setView(sub.view); }
                  }))} />
                ) : (
                  <button onClick={() => { const tv = (menu.view || (menu as any).view_name); if (tv) { setView(tv as View); } }}
                    className={`nav-link text-[13px] font-bold transition-colors py-4 px-1 flex items-center h-full relative ${(menu.view || (menu as any).view_name) === currentView ? 'active text-primary font-black' : 'text-gray-600 hover:text-primary'}`}>
                    {menu.label}{(menu.view || (menu as any).view_name) === currentView && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-hover rounded-full" />}
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden lg:block flex-1 max-w-sm mx-8">
            <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/10 focus:border-emerald-700 transition-all text-sm font-medium" />
            </div>
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              /* Submit Dropdown: Only for Logged In Users */
              <div className="relative" ref={submitDropdownRef}>
                <button
                  onClick={() => setShowSubmitDropdown(!showSubmitDropdown)}
                  className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-primary transition-colors px-2 py-2 group"
                >
                  <Plus className={`w-4 h-4 transition-transform duration-200 ${showSubmitDropdown ? 'rotate-45 text-primary' : 'group-hover:text-primary'}`} />
                  <span>Submit</span>
                </button>

                {showSubmitDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-100 shadow-[0_15px_45px_rgba(0,0,0,0.1)] rounded-2xl py-2 z-[110] animate-in fade-in slide-in-from-top-2">
                    <button
                      onClick={(e) => handleNavigate(View.POST_SUBMIT, e)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-primary-light transition-colors group/item"
                    >
                      <div className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center text-primary group-hover/item:scale-105 transition-transform">
                        <Rocket className="w-4 h-4" />
                      </div>
                      <span className="text-[13px] font-bold text-gray-700 group-hover/item:text-primary">Launch a product</span>
                    </button>
                    <button
                      onClick={(e) => handleNavigate(View.NEW_THREAD, e)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-primary-light transition-colors group/item"
                    >
                      <div className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center text-primary group-hover/item:scale-105 transition-transform">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <span className="text-[13px] font-bold text-gray-700 group-hover/item:text-primary">Start a thread</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Subscribe Button: For Logged Out Users */
              <button
                onClick={() => setView(View.NEWSLETTER)}
                className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-primary transition-colors px-2 py-2"
              >
                <Mail className="w-4 h-4" />
                <span>Subscribe</span>
              </button>
            )}

            {!user && (
              <button onClick={onSignInClick} className="text-primary font-black text-[13px] px-5 py-2.5 hover:bg-primary-light rounded-2xl transition-all active:scale-95 border border-primary-light shadow-sm">Sign In</button>
            )}

            {user && (
              <div className="flex items-center gap-4">
                <div className="relative flex items-center" ref={notificationDropdownRef}>
                  <NotificationBell userId={user.id} isOpen={showNotificationDropdown} onClick={() => setShowNotificationDropdown(!showNotificationDropdown)} />
                  {showNotificationDropdown && (
                    <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-100 shadow-2xl rounded-2xl p-6 z-[110] animate-in fade-in slide-in-from-top-2">
                      <div className="flex items-center justify-between mb-4 border-b border-gray-50 pb-3">
                        <h4 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">Recent Notifications</h4>
                        <Bell className="w-3 h-3 text-primary opacity-50" />
                      </div>
                      <div className="space-y-4 mb-6">
                        {notifications.length === 0 ? (
                          <p className="text-[13px] text-gray-400 italic text-center py-4">No unread notifications!</p>
                        ) : (
                          notifications.slice(0, 3).map((n) => (
                            <div key={n.id} className="flex gap-3 group/notif cursor-pointer">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border shadow-sm ${n.is_read ? 'bg-gray-50 border-gray-100 text-gray-400' : 'bg-primary-light border-primary-light text-primary'}`}>
                                {n.type === 'upvote' ? <Triangle className="w-4 h-4 fill-current" /> : n.type === 'approval' ? <ShieldCheck className="w-4 h-4" /> : n.type === 'streak' ? <Flame className="w-4 h-4 fill-amber-500 text-amber-500" /> : <MessageSquare className="w-4 h-4" />}
                              </div>
                              <div className="min-w-0">
                                <p className={`text-[13px] leading-snug line-clamp-2 ${n.is_read ? 'text-gray-500 font-medium' : 'text-gray-900 font-bold'}`}>{n.message}</p>
                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-tighter mt-1">{formatTimeAgo(n.created_at)}</p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      <button onClick={() => { setView(View.NOTIFICATIONS); setShowNotificationDropdown(false); }} className="w-full py-3 bg-white border border-gray-100 rounded-xl text-xs font-black text-primary hover:bg-primary-light transition-all uppercase tracking-widest shadow-sm">View full history</button>
                    </div>
                  )}
                </div>

                <div className="relative flex items-center" ref={userDropdownRef}>
                  <button onClick={() => setShowUserDropdown(!showUserDropdown)} className="w-9 h-9 rounded-full overflow-hidden border-2 border-primary p-0.5 hover:ring-2 hover:ring-emerald-200 transition-all active:scale-95 shadow-sm"><img src={user.avatar_url} alt={user.username} className="w-full h-full object-cover rounded-full" /></button>
                  {showUserDropdown && (
                    <div className="absolute top-full right-0 mt-2 w-52 bg-white border border-gray-100 shadow-2xl rounded-xl py-2 z-[110] animate-in fade-in slide-in-from-top-2">
                      <button onClick={() => { setView(View.PROFILE, '/@' + user.username); setShowUserDropdown(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-sm font-bold text-gray-700"><UserIcon className="w-4 h-4 text-gray-400" /> Profile</button>
                      <button onClick={() => { setView(View.MY_PRODUCTS, '/my/products'); setShowUserDropdown(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-sm font-bold text-gray-700"><Menu className="w-4 h-4 text-gray-400" /> My products</button>
                      <button onClick={() => { setView(View.SETTINGS, '/my/settings/edit'); setShowUserDropdown(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-sm font-bold text-gray-700"><Settings className="w-4 h-4 text-gray-400" /> Settings</button>
                      <button onClick={() => { setView(View.API_DASHBOARD, '/v2/oauth/applications'); setShowUserDropdown(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-sm font-bold text-gray-700"><Code className="w-4 h-4 text-gray-400" /> API dashboard</button>
                      <button onClick={() => { onLogout(); setShowUserDropdown(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-sm font-bold text-red-600 border-t border-gray-50"><LogOut className="w-4 h-4" /> Logout</button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer (Overlay) */}
      <div className={`fixed inset-0 z-[200] lg:hidden transition-all duration-300 ${isDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={closeDrawer} />

        <div className={`absolute top-0 left-0 bottom-0 w-[85%] max-w-sm bg-[#F9F9F1] shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-6 flex items-center justify-between bg-white border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-md">
                <span className="font-serif text-lg font-bold">M</span>
              </div>
              <span className="font-serif font-bold text-primary text-lg">Muslim Hunt</span>
            </div>
            <button onClick={closeDrawer} className="p-2 text-gray-400 hover:text-primary transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search community..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-primary transition-all text-sm font-medium"
              />
            </div>

            <div className="space-y-1">
              <div>
                <button
                  onClick={() => toggleAccordion('best_products')}
                  className={`w-full flex items-center justify-between p-4 rounded-xl font-bold text-[16px] transition-all ${expandedAccordion === 'best_products' ? 'bg-primary-light text-primary' : 'text-gray-700 hover:bg-gray-100/50'}`}
                >
                  <div className="flex items-center gap-3">
                    <Star className={`w-5 h-5 ${expandedAccordion === 'best_products' ? 'text-primary' : 'text-gray-400'}`} />
                    Best Products
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${expandedAccordion === 'best_products' ? 'rotate-180' : ''}`} />
                </button>
                {expandedAccordion === 'best_products' && (
                  <div className="ml-4 mt-1 space-y-1 py-2 animate-in slide-in-from-top-2 duration-300">
                    {BEST_PRODUCTS_MOBILE.map((item, idx) => (
                      <button key={idx} onClick={() => handleNavigate(item.view)} className="w-full flex items-center gap-3 p-3 text-[14px] font-bold text-gray-600 hover:text-primary rounded-lg text-left">
                        <item.icon className="w-4 h-4 opacity-50" />
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <button
                  onClick={() => toggleAccordion('launches')}
                  className={`w-full flex items-center justify-between p-4 rounded-xl font-bold text-[16px] transition-all ${expandedAccordion === 'launches' ? 'bg-primary-light text-primary' : 'text-gray-700 hover:bg-gray-100/50'}`}
                >
                  <div className="flex items-center gap-3">
                    <Rocket className={`w-5 h-5 ${expandedAccordion === 'launches' ? 'text-primary' : 'text-gray-400'}`} />
                    Launches
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${expandedAccordion === 'launches' ? 'rotate-180' : ''}`} />
                </button>
                {expandedAccordion === 'launches' && (
                  <div className="ml-4 mt-1 space-y-1 py-2 animate-in slide-in-from-top-2 duration-300">
                    {LAUNCHES_MOBILE.map((item, idx) => (
                      <button key={idx} onClick={() => handleNavigate(item.view)} className="w-full flex flex-col p-3 hover:bg-primary-light rounded-lg text-left">
                        <p className="text-[14px] font-bold text-gray-900">{item.label}</p>
                        {item.sub && <p className="text-[12px] text-gray-500 font-medium">{item.sub}</p>}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <button
                  onClick={() => toggleAccordion('news')}
                  className={`w-full flex items-center justify-between p-4 rounded-xl font-bold text-[16px] transition-all ${expandedAccordion === 'news' ? 'bg-primary-light text-primary' : 'text-gray-700 hover:bg-gray-100/50'}`}
                >
                  <div className="flex items-center gap-3">
                    <Mail className={`w-5 h-5 ${expandedAccordion === 'news' ? 'text-primary' : 'text-gray-400'}`} />
                    News
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${expandedAccordion === 'news' ? 'rotate-180' : ''}`} />
                </button>
                {expandedAccordion === 'news' && (
                  <div className="ml-4 mt-1 space-y-1 py-2 animate-in slide-in-from-top-2 duration-300">
                    {NEWS_MOBILE.map((item, idx) => (
                      <button key={idx} onClick={() => handleNavigate(item.view)} className="w-full flex flex-col p-3 hover:bg-primary-light rounded-lg text-left">
                        <p className="text-[14px] font-bold text-gray-900">{item.label}</p>
                        <p className="text-[11px] text-gray-500 font-medium">{item.sub}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <button
                  onClick={() => toggleAccordion('forums')}
                  className={`w-full flex items-center justify-between p-4 rounded-xl font-bold text-[16px] transition-all ${expandedAccordion === 'forums' ? 'bg-primary-light text-primary' : 'text-gray-700 hover:bg-gray-100/50'}`}
                >
                  <div className="flex items-center gap-3">
                    <MessageSquare className={`w-5 h-5 ${expandedAccordion === 'forums' ? 'text-primary' : 'text-gray-400'}`} />
                    Forums
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${expandedAccordion === 'forums' ? 'rotate-180' : ''}`} />
                </button>
                {expandedAccordion === 'forums' && (
                  <div className="ml-4 mt-1 space-y-1 py-2 animate-in slide-in-from-top-2 duration-300">
                    {FORUMS_MOBILE.map((item, idx) => (
                      <button key={idx} onClick={() => handleNavigate(item.view)} className="w-full flex flex-col p-3 hover:bg-primary-light rounded-lg text-left">
                        <p className="text-[14px] font-bold text-gray-900">{item.label}</p>
                        <p className="text-[11px] text-gray-500 font-medium">{item.sub}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button onClick={() => handleNavigate(View.SPONSOR)} className={`w-full flex items-center gap-3 p-4 rounded-xl font-bold text-[16px] transition-all ${currentView === View.SPONSOR ? 'bg-primary-light text-primary' : 'text-gray-700 hover:bg-gray-100/50'}`}>
                <Megaphone className={`w-5 h-5 ${currentView === View.SPONSOR ? 'text-primary' : 'text-gray-400'}`} />
                Advertise
              </button>

              <div className="pt-4 border-t border-gray-100 mt-4">
                {user ? (
                  <>
                    <button onClick={() => { handleNavigate(View.PROFILE_EDIT); setView(View.PROFILE, '/@' + user.username); }} className="w-full flex items-center justify-between p-4 rounded-xl font-bold text-[16px] text-gray-700 hover:bg-gray-100/50 transition-all">
                      <div className="flex items-center gap-3">
                        <UserIcon className="w-5 h-5 text-gray-400" />
                        My Profile
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300" />
                    </button>
                    <button onClick={() => handleNavigate(View.MY_PRODUCTS)} className="w-full flex items-center justify-between p-4 rounded-xl font-bold text-[16px] text-gray-700 hover:bg-gray-100/50 transition-all">
                      <div className="flex items-center gap-3">
                        <Menu className="w-5 h-5 text-gray-400" />
                        My Products
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300" />
                    </button>
                    <button onClick={() => handleNavigate(View.SETTINGS)} className="w-full flex items-center justify-between p-4 rounded-xl font-bold text-[16px] text-gray-700 hover:bg-gray-100/50 transition-all">
                      <div className="flex items-center gap-3">
                        <Settings className="w-5 h-5 text-gray-400" />
                        Settings
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300" />
                    </button>
                    <button onClick={() => handleNavigate(View.API_DASHBOARD)} className="w-full flex items-center justify-between p-4 rounded-xl font-bold text-[16px] text-gray-700 hover:bg-gray-100/50 transition-all">
                      <div className="flex items-center gap-3">
                        <Code className="w-5 h-5 text-gray-400" />
                        API Dashboard
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300" />
                    </button>
                    <button onClick={() => { onLogout(); closeDrawer(); }} className="w-full flex items-center justify-between p-4 rounded-xl font-bold text-[16px] text-red-600 hover:bg-red-50 transition-all border-t border-gray-100 mt-2">
                      <div className="flex items-center gap-3">
                        <LogOut className="w-5 h-5" />
                        Logout
                      </div>
                    </button>
                  </>
                ) : (
                  <button onClick={() => { onSignInClick(); closeDrawer(); }} className="w-full flex items-center justify-between p-4 rounded-xl font-bold text-[16px] text-primary hover:bg-primary-light transition-all">
                    <div className="flex items-center gap-3">
                      <UserIcon className="w-5 h-5" />
                      Sign In
                    </div>
                    <ChevronRight className="w-4 h-4 text-emerald-200" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 space-y-3 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
            <button
              onClick={() => handleNavigate(View.POST_SUBMIT)}
              className="w-full py-4 bg-[#004D40] text-white rounded-2xl font-black text-[14px] uppercase tracking-widest shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> LAUNCH PRODUCT
            </button>
            <button
              onClick={() => handleNavigate(View.NEWSLETTER)}
              className="w-full py-4 bg-white border-2 border-[#004D40] text-[#004D40] rounded-2xl font-black text-[14px] uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4" /> SUBSCRIBE
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
