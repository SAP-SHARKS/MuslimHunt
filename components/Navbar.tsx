
import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, LogOut, ChevronDown, ChevronRight, BookOpen, Users, Megaphone, Sparkles, X, 
  MessageSquare, Code, Cpu, CheckSquare, Palette, DollarSign, Bot, ArrowRight, Star,
  Rocket, Mail, Plus, Bell, User as UserIcon, Flame, CheckCircle2,
  Triangle, Menu, Layout, Hash, ShieldCheck, Calendar, Trophy
} from 'lucide-react';
import { User, View, Notification, NavMenuItem, Category } from '../types';
import { formatTimeAgo } from '../utils/dateUtils';
import NotificationBell from './NotificationBell.tsx';

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
  { label: 'Launch archive', view: View.HOME },
  { label: 'Most-loved launches by the community', view: View.HOME },
  { label: 'Launch Guide', view: View.POST_SUBMIT },
  { label: 'Checklists/pro tips for launching', view: View.POST_SUBMIT },
];

const NEWS_MOBILE = [
  { label: 'Newsletter', sub: 'The best of Muslim Hunt, every day', view: View.NEWSLETTER, icon: Mail },
  { label: 'Stories', sub: 'Tech news, interviews, and tips from makers', view: View.NEWSLETTER, icon: BookOpen },
  { label: 'Changelog', sub: 'New Muslim Hunt features and releases', view: View.NEWSLETTER, icon: Rocket },
];

const FORUMS_MOBILE = [
  { label: 'Forums', sub: 'Ask questions, find support, and connect', view: View.FORUM_HOME, icon: MessageSquare },
  { label: 'Streaks', sub: 'The most active community members', view: View.FORUM_HOME, icon: Trophy },
  { label: 'Events', sub: 'Meet others online and in-person', view: View.FORUM_HOME, icon: Calendar },
];

interface DropdownItem {
  label: string;
  subtext?: string;
  icon: any;
  colorClass?: string;
  bgClass?: string;
  onClick?: () => void;
}

const RichDropdown: React.FC<{ label: string; items: DropdownItem[] }> = ({ label, items }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative group h-full flex items-center" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      <button className="flex items-center gap-1.5 text-[13px] font-bold text-gray-600 hover:text-emerald-900 py-4 transition-colors">
        {label}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className={`absolute top-full left-0 ${label === "Best Products" ? 'w-[520px]' : 'w-80'} bg-white border border-gray-100 shadow-[0_25px_60px_rgba(0,0,0,0.12)] rounded-[1.5rem] py-0 z-[100] animate-in fade-in slide-in-from-top-2 duration-300 overflow-hidden`}>
          <div className="py-4">{items.map((item, i) => (
            <button key={i} onClick={item.onClick} className="w-full flex items-start gap-4 px-5 py-3.5 hover:bg-gray-50 transition-all text-left group/item">
              <div className={`w-9 h-9 ${item.bgClass || 'bg-gray-50'} rounded-xl flex items-center justify-center ${item.colorClass || 'text-gray-400'} shrink-0 group-hover/item:scale-105 transition-transform shadow-sm`}><item.icon className="w-4 h-4" /></div>
              <div className="flex flex-col pt-0.5 min-w-0 text-left"><p className="text-[13px] font-bold text-gray-900 group-hover/item:text-emerald-800 transition-colors leading-none">{item.label}</p>{item.subtext && <p className="text-[10px] text-gray-500 font-medium leading-relaxed mt-1.5 line-clamp-1">{item.subtext}</p>}</div>
            </button>
          ))}</div>
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

  const handleNavigate = (view: View) => {
    setView(view);
    closeDrawer();
    setShowSubmitDropdown(false);
    setShowNotificationDropdown(false);
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
                className="p-1 -ml-1 text-gray-600 hover:text-emerald-900 transition-all active:scale-90"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
              
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavigate(View.HOME)}>
                <div className="w-8 h-8 bg-emerald-800 rounded-lg flex items-center justify-center text-white shadow-md">
                  <span className="font-serif text-lg font-bold">M</span>
                </div>
                <h1 className="font-serif text-lg font-bold text-emerald-900 tracking-tight">Muslim Hunt</h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleNavigate(View.NEWSLETTER)}
                className="px-3 py-1 text-sm font-bold text-emerald-800 border border-emerald-800 rounded-xl hover:bg-emerald-50 transition-all whitespace-nowrap"
              >
                Subscribe
              </button>
              
              {!user ? (
                <button 
                  onClick={onSignInClick} 
                  className="px-3 py-1 bg-emerald-800 text-white font-bold text-sm rounded-xl hover:bg-emerald-900 transition-all active:scale-95 shadow-sm whitespace-nowrap"
                >
                  Sign In
                </button>
              ) : (
                <div 
                  className="w-8 h-8 rounded-full overflow-hidden border border-emerald-800 p-0.5 cursor-pointer" 
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
              <div className="w-9 h-9 bg-emerald-800 rounded-lg flex items-center justify-center text-white shadow-md"><span className="font-serif text-xl font-bold">M</span></div>
              <h1 className="font-serif text-xl font-bold text-emerald-900 tracking-tight text-nowrap">Muslim Hunt</h1>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center lg:ml-12 gap-7 h-full">
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
                    className={`text-[13px] font-bold transition-colors py-4 px-1 flex items-center h-full relative ${(menu.view || (menu as any).view_name) === currentView ? 'text-emerald-900 font-black' : 'text-gray-600 hover:text-emerald-900'}`}>
                    {menu.label}{(menu.view || (menu as any).view_name) === currentView && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-900 rounded-full" />}
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
                  className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-emerald-800 transition-colors px-2 py-2 group"
                >
                  <Plus className={`w-4 h-4 transition-transform duration-200 ${showSubmitDropdown ? 'rotate-45 text-emerald-800' : 'group-hover:text-emerald-800'}`} />
                  <span>Submit</span>
                </button>
                
                {showSubmitDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-100 shadow-[0_15px_45px_rgba(0,0,0,0.1)] rounded-2xl py-2 z-[110] animate-in fade-in slide-in-from-top-2">
                    <button 
                      onClick={() => handleNavigate(View.POST_SUBMIT)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-emerald-50 transition-colors group/item"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700 group-hover/item:scale-105 transition-transform">
                        <Rocket className="w-4 h-4" />
                      </div>
                      <span className="text-[13px] font-bold text-gray-700 group-hover/item:text-emerald-900">Launch a product</span>
                    </button>
                    <button 
                      onClick={() => handleNavigate(View.NEW_THREAD)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-emerald-50 transition-colors group/item"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700 group-hover/item:scale-105 transition-transform">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <span className="text-[13px] font-bold text-gray-700 group-hover/item:text-emerald-900">Start a thread</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Subscribe Button: For Logged Out Users */
              <button 
                onClick={() => setView(View.NEWSLETTER)}
                className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-emerald-800 transition-colors px-2 py-2"
              >
                <Mail className="w-4 h-4" />
                <span>Subscribe</span>
              </button>
            )}

            {!user && (
              <button onClick={onSignInClick} className="text-emerald-900 font-black text-[13px] px-5 py-2.5 hover:bg-emerald-50 rounded-2xl transition-all active:scale-95 border border-emerald-100 shadow-sm">Sign In</button>
            )}

            {user && (
              <div className="flex items-center gap-4">
                <div className="relative flex items-center" ref={notificationDropdownRef}>
                  <NotificationBell userId={user.id} isOpen={showNotificationDropdown} onClick={() => setShowNotificationDropdown(!showNotificationDropdown)} />
                  {showNotificationDropdown && (
                    <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-100 shadow-2xl rounded-2xl py-6 z-[110] animate-in fade-in slide-in-from-top-2">
                      <div className="flex items-center justify-between mb-4 border-b border-gray-50 pb-3 px-6">
                        <h4 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">Recent Notifications</h4>
                        <Bell className="w-3 h-3 text-emerald-800 opacity-50" />
                      </div>
                      <div className="space-y-1 mb-4 overflow-y-auto max-h-[350px]">
                        {notifications.length === 0 ? (
                          <p className="text-[13px] text-gray-400 italic text-center py-8">No unread notifications!</p>
                        ) : (
                          notifications.slice(0, 2).map((n) => (
                            <div key={n.id} onClick={() => handleNavigate(View.NOTIFICATIONS)} className={`flex gap-3 px-6 py-4 transition-all hover:bg-emerald-50/50 cursor-pointer ${!n.is_read ? 'bg-emerald-50/20' : ''}`}>
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border shadow-sm ${n.is_read ? 'bg-gray-50 border-gray-100 text-gray-400' : 'bg-emerald-50 border-emerald-100 text-emerald-900'}`}>
                                {n.type === 'streak' ? <Flame className="w-4 h-4 text-orange-500 fill-orange-500" /> : 
                                 n.type === 'approval' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> :
                                 n.type === 'upvote' ? <Triangle className="w-4 h-4 fill-current" /> : 
                                 <MessageSquare className="w-4 h-4" />}
                              </div>
                              <div className="min-w-0">
                                <p className={`text-[13px] leading-snug ${n.is_read ? 'text-gray-500 font-medium' : 'text-gray-900 font-bold'}`}>{n.message}</p>
                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-tighter mt-1">{formatTimeAgo(n.created_at)}</p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      <div className="px-6">
                        <button onClick={() => handleNavigate(View.NOTIFICATIONS)} className="w-full py-3 bg-white border border-gray-100 rounded-xl text-xs font-black text-emerald-800 hover:bg-emerald-50 transition-all uppercase tracking-widest shadow-sm">View full history</button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="relative flex items-center" ref={userDropdownRef}>
                  <button onClick={() => setShowUserDropdown(!showUserDropdown)} className="w-9 h-9 rounded-full overflow-hidden border-2 border-emerald-800 p-0.5 hover:ring-2 hover:ring-emerald-200 transition-all active:scale-95 shadow-sm"><img src={user.avatar_url} alt={user.username} className="w-full h-full object-cover rounded-full" /></button>
                  {showUserDropdown && (
                    <div className="absolute top-full right-0 mt-2 w-52 bg-white border border-gray-100 shadow-2xl rounded-xl py-2 z-[110] animate-in fade-in slide-in-from-top-2">
                      <div className="px-4 py-2 mb-1 border-b border-gray-50">
                        <p className="text-[10px] font-black text-emerald-800 uppercase tracking-tighter truncate">{user.username}</p>
                      </div>
                      {user.is_admin && (
                        <button onClick={() => { setView(View.ADMIN_PANEL); setShowUserDropdown(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-emerald-50 text-sm font-bold text-emerald-900">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" /> Admin Panel
                        </button>
                      )}
                      <button onClick={() => { onViewProfile(); setShowUserDropdown(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-sm font-bold text-gray-700"><UserIcon className="w-4 h-4 text-gray-400" /> Profile</button>
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
              <div className="w-8 h-8 bg-emerald-800 rounded-lg flex items-center justify-center text-white shadow-md">
                <span className="font-serif text-lg font-bold">M</span>
              </div>
              <span className="font-serif font-bold text-emerald-900 text-lg">Muslim Hunt</span>
            </div>
            <button onClick={closeDrawer} className="p-2 text-gray-400 hover:text-emerald-800 transition-colors">
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
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-emerald-800 transition-all text-sm font-medium" 
              />
            </div>

            <div className="space-y-1">
              <div>
                <button 
                  onClick={() => toggleAccordion('best_products')}
                  className={`w-full flex items-center justify-between p-4 rounded-xl font-bold text-[16px] transition-all ${expandedAccordion === 'best_products' ? 'bg-emerald-50 text-emerald-900' : 'text-gray-700 hover:bg-gray-100/50'}`}
                >
                  <div className="flex items-center gap-3">
                    <Star className={`w-5 h-5 ${expandedAccordion === 'best_products' ? 'text-emerald-800' : 'text-gray-400'}`} />
                    Best Products
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${expandedAccordion === 'best_products' ? 'rotate-180' : ''}`} />
                </button>
                {expandedAccordion === 'best_products' && (
                  <div className="ml-4 mt-1 space-y-1 py-2 animate-in slide-in-from-top-2 duration-300">
                    {BEST_PRODUCTS_MOBILE.map((item, idx) => (
                      <button key={idx} onClick={() => handleNavigate(item.view)} className="w-full flex items-center gap-3 p-3 text-[14px] font-bold text-gray-600 hover:text-emerald-800 rounded-lg text-left">
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
                  className={`w-full flex items-center justify-between p-4 rounded-xl font-bold text-[16px] transition-all ${expandedAccordion === 'launches' ? 'bg-emerald-50 text-emerald-900' : 'text-gray-700 hover:bg-gray-100/50'}`}
                >
                  <div className="flex items-center gap-3">
                    <Rocket className={`w-5 h-5 ${expandedAccordion === 'launches' ? 'text-emerald-800' : 'text-gray-400'}`} />
                    Launches
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${expandedAccordion === 'launches' ? 'rotate-180' : ''}`} />
                </button>
                {expandedAccordion === 'launches' && (
                  <div className="ml-4 mt-1 space-y-1 py-2 animate-in slide-in-from-top-2 duration-300">
                    {LAUNCHES_MOBILE.map((item, idx) => (
                      <button key={idx} onClick={() => handleNavigate(item.view)} className="w-full flex items-center gap-3 p-3 text-[14px] font-bold text-gray-600 hover:text-emerald-800 rounded-lg text-left">
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <button 
                  onClick={() => toggleAccordion('news')}
                  className={`w-full flex items-center justify-between p-4 rounded-xl font-bold text-[16px] transition-all ${expandedAccordion === 'news' ? 'bg-emerald-50 text-emerald-900' : 'text-gray-700 hover:bg-gray-100/50'}`}
                >
                  <div className="flex items-center gap-3">
                    <Mail className={`w-5 h-5 ${expandedAccordion === 'news' ? 'text-emerald-800' : 'text-gray-400'}`} />
                    News
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${expandedAccordion === 'news' ? 'rotate-180' : ''}`} />
                </button>
                {expandedAccordion === 'news' && (
                  <div className="ml-4 mt-1 space-y-1 py-2 animate-in slide-in-from-top-2 duration-300">
                    {NEWS_MOBILE.map((item, idx) => (
                      <button key={idx} onClick={() => handleNavigate(item.view)} className="w-full flex flex-col p-3 hover:bg-emerald-50 rounded-lg text-left">
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
                  className={`w-full flex items-center justify-between p-4 rounded-xl font-bold text-[16px] transition-all ${expandedAccordion === 'forums' ? 'bg-emerald-50 text-emerald-900' : 'text-gray-700 hover:bg-gray-100/50'}`}
                >
                  <div className="flex items-center gap-3">
                    <MessageSquare className={`w-5 h-5 ${expandedAccordion === 'forums' ? 'text-emerald-800' : 'text-gray-400'}`} />
                    Forums
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${expandedAccordion === 'forums' ? 'rotate-180' : ''}`} />
                </button>
                {expandedAccordion === 'forums' && (
                  <div className="ml-4 mt-1 space-y-1 py-2 animate-in slide-in-from-top-2 duration-300">
                    {FORUMS_MOBILE.map((item, idx) => (
                      <button key={idx} onClick={() => handleNavigate(item.view)} className="w-full flex flex-col p-3 hover:bg-emerald-50 rounded-lg text-left">
                        <p className="text-[14px] font-bold text-gray-900">{item.label}</p>
                        <p className="text-[11px] text-gray-500 font-medium">{item.sub}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button onClick={() => handleNavigate(View.SPONSOR)} className={`w-full flex items-center gap-3 p-4 rounded-xl font-bold text-[16px] transition-all ${currentView === View.SPONSOR ? 'bg-emerald-50 text-emerald-900' : 'text-gray-700 hover:bg-gray-100/50'}`}>
                <Megaphone className={`w-5 h-5 ${currentView === View.SPONSOR ? 'text-emerald-800' : 'text-gray-400'}`} />
                Advertise
              </button>

              <div className="pt-4 border-t border-gray-100 mt-4">
                {user ? (
                  <button onClick={() => handleNavigate(View.PROFILE)} className="w-full flex items-center justify-between p-4 rounded-xl font-bold text-[16px] text-gray-700 hover:bg-gray-100/50 transition-all">
                    <div className="flex items-center gap-3">
                      <UserIcon className="w-5 h-5 text-gray-400" />
                      My Profile
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  </button>
                ) : (
                  <button onClick={() => { onSignInClick(); closeDrawer(); }} className="w-full flex items-center justify-between p-4 rounded-xl font-bold text-[16px] text-emerald-800 hover:bg-emerald-50 transition-all">
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
