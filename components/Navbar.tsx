import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, LogOut, ChevronDown, ChevronRight, BookOpen, Users, Megaphone, Sparkles, X, 
  MessageSquare, Code, Cpu, CheckSquare, Palette, DollarSign, Bot, ArrowRight, ArrowUpRight, Star,
  Rocket, Compass, Mail, FileText, Flame, Calendar, Plus, Bell, Settings, User as UserIcon,
  Triangle, Clock, Menu, Zap, Layout, Trophy, Hash,
  Activity, Wind, Brain, Moon, Dumbbell, Hotel, Map, Chrome, Figma, Slack, Wallet, ShoppingBag, CreditCard, Baby,
  CheckCircle
} from 'lucide-react';
import { User, View, Notification, NavMenuItem, Category } from '../types';
import { formatTimeAgo } from '../utils/dateUtils';
import NotificationBell from './NotificationBell.tsx';

const ICON_MAP: Record<string, any> = {
  Rocket, Compass, MessageSquare, Flame, Calendar, Mail, BookOpen, FileText, Menu, X, Star, Zap, Code, Cpu, CheckSquare, Palette, Users, DollarSign, Megaphone, Layout, Triangle, Bot, Sparkles, Trophy, Hash,
  Activity, Wind, Brain, Moon, Dumbbell, Hotel, Map, Chrome, Figma, Slack, Wallet, ShoppingBag, CreditCard, Baby
};

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
  const [activeHoverCategory, setActiveHoverCategory] = useState<string>(items[0]?.label || 'Trending');
  const isBestProducts = label === "Best Products";

  useEffect(() => {
    if (isOpen && items.length > 0) {
      setActiveHoverCategory(items[0].label);
    }
  }, [isOpen, items]);

  return (
    <div className="relative group h-full flex items-center" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      <button className="flex items-center gap-1.5 text-[13px] font-bold text-gray-600 hover:text-emerald-900 py-4 transition-colors">
        {label}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className={`absolute top-full left-0 ${isBestProducts ? 'w-[520px]' : 'w-80'} bg-white border border-gray-100 shadow-[0_25px_60px_rgba(0,0,0,0.12)] rounded-[1.5rem] py-0 z-[100] animate-in fade-in slide-in-from-top-2 duration-300 overflow-hidden`}>
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
  user, currentView, setView, onLogout, searchQuery, onSearchChange, onViewProfile, onSignInClick, notifications, menuItems, categories = [], onCategorySelect
}) => {
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showSubmitDropdown, setShowSubmitDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const submitDropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const notificationDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (submitDropdownRef.current && !submitDropdownRef.current.contains(event.target as Node)) setShowSubmitDropdown(false);
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) setShowUserDropdown(false);
      if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target as Node)) setShowNotificationDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const mainNavItems = menuItems.filter(item => ["Best Products", "Launches", "News", "Forums", "Advertise"].includes(item.label));

  return (
    <nav className="sticky top-0 z-[100] bg-white border-b border-gray-100 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 h-16">
        <div className="flex items-center gap-4">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 -ml-2 text-gray-600 hover:text-emerald-900 hover:bg-emerald-50 rounded-lg transition-all active:scale-90" aria-label="Toggle Navigation">
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => { setView(View.HOME); setIsMobileMenuOpen(false); }}>
            <div className="w-9 h-9 bg-emerald-800 rounded-lg flex items-center justify-center text-white shadow-md"><span className="font-serif text-xl font-bold">M</span></div>
            <h1 className="hidden lg:block font-serif text-xl font-bold text-emerald-900 tracking-tight text-nowrap">Muslim Hunt</h1>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-7 h-full">
          {mainNavItems.map((menu) => (
            <React.Fragment key={menu.id}>
              {menu.sub_items && menu.sub_items.length > 0 ? (
                <RichDropdown label={menu.label} items={menu.sub_items.map(sub => ({
                  label: sub.label, subtext: sub.subtext, icon: ICON_MAP[sub.icon] || Star,
                  bgClass: sub.bgClass, colorClass: sub.colorClass,
                  onClick: () => { setView(sub.view); setIsMobileMenuOpen(false); }
                }))} />
              ) : (
                <button onClick={() => { const tv = (menu.view || (menu as any).view_name); if (tv) { setView(tv as View); setIsMobileMenuOpen(false); } }}
                  className={`text-[13px] font-bold transition-colors py-4 px-1 flex items-center h-full relative ${(menu.view || (menu as any).view_name) === currentView ? 'text-emerald-900 font-black' : 'text-gray-600 hover:text-emerald-900'}`}>
                  {menu.label}{(menu.view || (menu as any).view_name) === currentView && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-900 rounded-full" />}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="flex-1 max-w-sm hidden lg:block">
          <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/10 focus:border-emerald-700 transition-all text-sm font-medium" />
          </div>
        </div>

        {/* Right Section: Flex with gap-4 and items-center */}
        <div className="flex items-center gap-4">
          <button onClick={() => setShowMobileSearch(true)} className="lg:hidden p-2 text-gray-600 hover:text-emerald-900 transition-colors"><Search className="w-5 h-5" /></button>
          
          {!user && (
            <button onClick={onSignInClick} className="text-emerald-900 font-black text-[13px] px-5 py-2.5 hover:bg-emerald-50 rounded-2xl transition-all active:scale-95 border border-emerald-100 shadow-sm">Sign In</button>
          )}

          {user && (
            <div className="flex items-center gap-4">
              <div className="relative" ref={submitDropdownRef}>
                <button onClick={() => setShowSubmitDropdown(!showSubmitDropdown)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border-2 active:scale-95 ${showSubmitDropdown ? 'bg-[#ff6154] border-[#ff6154] text-white' : 'border-emerald-800 text-emerald-800 hover:bg-emerald-50'}`}><Plus className="w-4 h-4" /> <span className="hidden sm:inline">Submit</span></button>
                {showSubmitDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-100 shadow-2xl rounded-xl py-2 z-[110] animate-in fade-in slide-in-from-top-2">
                    <button onClick={() => { setView(View.POST_SUBMIT); setShowSubmitDropdown(false); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left group"><Rocket className="w-4 h-4 text-orange-600" /><p className="text-sm font-bold text-gray-900">Launch a product</p></button>
                  </div>
                )}
              </div>

              {/* Notification Bell next to Profile Avatar */}
              <div className="relative flex items-center" ref={notificationDropdownRef}>
                <NotificationBell 
                  userId={user.id} 
                  isOpen={showNotificationDropdown}
                  onClick={() => setShowNotificationDropdown(!showNotificationDropdown)} 
                />
                
                {showNotificationDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-100 shadow-2xl rounded-2xl p-6 z-[110] animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center justify-between mb-4 border-b border-gray-50 pb-3">
                      <h4 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">Recent Notifications</h4>
                      <Bell className="w-3 h-3 text-emerald-800 opacity-50" />
                    </div>
                    <div className="space-y-4 mb-6">
                      {notifications.length === 0 ? (
                        <p className="text-[13px] text-gray-400 italic text-center py-4">No unread notifications!</p>
                      ) : (
                        notifications.slice(0, 3).map((n) => (
                          <div key={n.id} className="flex gap-3 group/notif cursor-pointer">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border shadow-sm ${n.is_read ? 'bg-gray-50 border-gray-100 text-gray-400' : 'bg-emerald-50 border-emerald-100 text-emerald-900'}`}>
                              {n.type === 'upvote' ? <Triangle className="w-4 h-4 fill-current" /> : n.type === 'approval' ? <CheckCircle className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                            </div>
                            <div className="min-w-0">
                              <p className={`text-[13px] leading-snug line-clamp-2 ${n.is_read ? 'text-gray-500 font-medium' : 'text-gray-900 font-bold'}`}>{n.message}</p>
                              <p className="text-[10px] font-black text-gray-300 uppercase tracking-tighter mt-1">{formatTimeAgo(n.created_at)}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <button onClick={() => { setView(View.NOTIFICATIONS); setShowNotificationDropdown(false); }} className="w-full py-3 bg-white border border-gray-100 rounded-xl text-xs font-black text-emerald-800 hover:bg-emerald-50 transition-all uppercase tracking-widest shadow-sm">View full history</button>
                  </div>
                )}
              </div>

              {/* User Dropdown */}
              <div className="relative flex items-center" ref={userDropdownRef}>
                <button onClick={() => setShowUserDropdown(!showUserDropdown)} className="w-9 h-9 rounded-full overflow-hidden border-2 border-emerald-800 p-0.5 hover:ring-2 hover:ring-emerald-200 transition-all active:scale-95"><img src={user.avatar_url} alt={user.username} className="w-full h-full object-cover rounded-full" /></button>
                {showUserDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-100 shadow-2xl rounded-xl py-2 z-[110] animate-in fade-in slide-in-from-top-2">
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
  );
};

export default Navbar;
