
import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, LogOut, ChevronDown, ChevronRight, BookOpen, Users, Megaphone, Sparkles, X, 
  MessageSquare, Code, Cpu, CheckSquare, Palette, DollarSign, Bot, ArrowRight, Star,
  Rocket, Mail, Plus, Bell, User as UserIcon, Settings, Layout,
  Triangle, Menu, Hash, ShieldCheck, Calendar, Trophy
} from 'lucide-react';
import { User, View, Notification, NavMenuItem, Category } from '../types';
import { formatTimeAgo } from '../utils/dateUtils';
import NotificationBell from './NotificationBell.tsx';

const ICON_MAP: Record<string, any> = {
  Rocket, MessageSquare, Mail, BookOpen, Star, Code, Cpu, CheckSquare, Palette, Users, DollarSign, Megaphone, Layout, Triangle, Bot, Sparkles, Trophy, Hash
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
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const notificationDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target as Node)) setShowNotificationDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleNavigate = (view: View) => {
    setView(view);
    closeDrawer();
  };

  const mainNavItems = menuItems.filter(item => ["Best Products", "Launches", "News", "Forums", "Advertise"].includes(item.label));

  return (
    <>
      <nav className="sticky top-0 z-[100] bg-white border-b border-gray-100 px-4 sm:px-8 h-16 flex items-center">
        <div className="max-w-7xl mx-auto flex items-center justify-between w-full">
          
          <div className="lg:hidden flex items-center justify-between w-full bg-white">
            <div className="flex items-center gap-2">
              <button onClick={() => setIsDrawerOpen(true)} className="p-1 -ml-1 text-gray-600 hover:text-emerald-900 transition-all active:scale-90">
                <Menu className="w-6 h-6" />
              </button>
              <button className="flex items-center gap-2 cursor-pointer active:scale-95 transition-transform" onClick={() => handleNavigate(View.HOME)}>
                <div className="w-8 h-8 bg-emerald-800 rounded-lg flex items-center justify-center text-white shadow-md"><span className="font-serif text-lg font-bold">M</span></div>
                <h1 className="font-serif text-lg font-bold text-emerald-900 tracking-tight">Muslim Hunt</h1>
              </button>
            </div>
            <div className="flex items-center gap-2">
              {!user ? (
                <button onClick={onSignInClick} className="px-3 py-1 bg-emerald-800 text-white font-bold text-sm rounded-xl hover:bg-emerald-900 transition-all active:scale-95 shadow-sm whitespace-nowrap">Sign In</button>
              ) : (
                <button onClick={onViewProfile} className="w-8 h-8 rounded-full overflow-hidden border border-emerald-800 p-0.5 cursor-pointer active:scale-95 transition-all">
                  <img src={user.avatar_url} className="w-full h-full object-cover rounded-full" alt="User profile" />
                </button>
              )}
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => setView(View.HOME)}>
              <div className="w-9 h-9 bg-emerald-800 rounded-lg flex items-center justify-center text-white shadow-md"><span className="font-serif text-xl font-bold">M</span></div>
              <h1 className="font-serif text-xl font-bold text-emerald-900 tracking-tight text-nowrap">Muslim Hunt</h1>
            </div>
          </div>

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

          <div className="hidden lg:block flex-1 max-w-sm mx-8">
            <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/10 focus:border-emerald-700 transition-all text-sm font-medium" />
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <button onClick={() => setView(View.NEWSLETTER)} className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-emerald-800 transition-colors px-2 py-2"><Mail className="w-4 h-4" /><span>Subscribe</span></button>

            {!user && (
              <button onClick={onSignInClick} className="text-emerald-900 font-black text-[13px] px-5 py-2.5 hover:bg-emerald-50 rounded-2xl transition-all active:scale-95 border border-emerald-100 shadow-sm">Sign In</button>
            )}

            {user && (
              <div className="flex items-center gap-4 h-full">
                <div className="relative flex items-center" ref={notificationDropdownRef}>
                  <NotificationBell userId={user.id} isOpen={showNotificationDropdown} onClick={() => setShowNotificationDropdown(!showNotificationDropdown)} />
                  {showNotificationDropdown && (
                    <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-100 shadow-2xl rounded-2xl p-6 z-[110] animate-in fade-in slide-in-from-top-2">
                      <div className="flex items-center justify-between mb-4 border-b border-gray-50 pb-3">
                        <h4 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">Notifications</h4>
                        <Bell className="w-3 h-3 text-emerald-800 opacity-50" />
                      </div>
                      <div className="space-y-4 mb-6">
                        {notifications.length === 0 ? <p className="text-[13px] text-gray-400 italic text-center py-4">No new updates!</p> : notifications.slice(0, 3).map((n) => (
                          <div key={n.id} className="flex gap-3 group/notif cursor-pointer">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border shadow-sm ${n.is_read ? 'bg-gray-50 border-gray-100 text-gray-400' : 'bg-emerald-50 border-emerald-100 text-emerald-900'}`}>{n.type === 'upvote' ? <Triangle className="w-4 h-4 fill-current" /> : n.type === 'approval' ? <ShieldCheck className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}</div>
                            <div className="min-w-0"><p className={`text-[13px] leading-snug line-clamp-2 ${n.is_read ? 'text-gray-500 font-medium' : 'text-gray-900 font-bold'}`}>{n.message}</p><p className="text-[10px] font-black text-gray-300 uppercase tracking-tighter mt-1">{formatTimeAgo(n.created_at)}</p></div>
                          </div>
                        ))}
                      </div>
                      <button onClick={() => { setView(View.NOTIFICATIONS); setShowNotificationDropdown(false); }} className="w-full py-3 bg-white border border-gray-100 rounded-xl text-xs font-black text-emerald-800 hover:bg-emerald-50 transition-all uppercase tracking-widest shadow-sm">View History</button>
                    </div>
                  )}
                </div>

                <div className="relative group flex items-center h-full">
                  <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-emerald-800 p-0.5 shadow-sm cursor-pointer group-hover:ring-2 group-hover:ring-emerald-200 transition-all">
                    <img src={user.avatar_url} alt={user.username} className="w-full h-full object-cover rounded-full" />
                  </div>
                  <div className="absolute top-full right-0 pt-2 hidden group-hover:block z-[110] animate-in fade-in slide-in-from-top-2">
                    <div className="w-52 bg-white border border-gray-100 shadow-2xl rounded-xl py-2 overflow-hidden">
                      <button onClick={onViewProfile} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors text-left"><UserIcon className="w-4 h-4 text-gray-400" /> My Profile</button>
                      <button onClick={() => setView(View.EDIT_PROFILE)} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors text-left"><Settings className="w-4 h-4 text-gray-400" /> Settings</button>
                      <div className="h-px bg-gray-100 my-1 mx-4" />
                      <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-sm font-bold text-red-600 transition-colors text-left"><LogOut className="w-4 h-4" /> Logout</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className={`fixed inset-0 z-[200] lg:hidden transition-all duration-300 ${isDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={closeDrawer} />
        <div className={`absolute top-0 left-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-6 flex items-center justify-between border-b border-gray-100">
            <button className="flex items-center gap-2" onClick={() => handleNavigate(View.HOME)}><div className="w-8 h-8 bg-emerald-800 rounded-lg flex items-center justify-center text-white shadow-md"><span className="font-serif text-lg font-bold">M</span></div><span className="font-serif font-bold text-emerald-900 text-lg">Muslim Hunt</span></button>
            <button onClick={closeDrawer} className="p-2 text-gray-400 hover:text-emerald-800 transition-colors"><X className="w-6 h-6" /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {user ? (
              <>
                <button onClick={() => { onViewProfile(); closeDrawer(); }} className="w-full flex items-center justify-between p-4 rounded-xl font-bold text-[16px] text-gray-700 hover:bg-gray-50 transition-all"><div className="flex items-center gap-3"><UserIcon className="w-5 h-5 text-gray-400" />Profile</div><ChevronRight className="w-4 h-4 text-gray-300" /></button>
                <button onClick={() => { setView(View.EDIT_PROFILE); closeDrawer(); }} className="w-full flex items-center justify-between p-4 rounded-xl font-bold text-[16px] text-gray-700 hover:bg-gray-50 transition-all"><div className="flex items-center gap-3"><Settings className="w-5 h-5 text-gray-400" />Settings</div><ChevronRight className="w-4 h-4 text-gray-300" /></button>
              </>
            ) : (
              <button onClick={() => { onSignInClick(); closeDrawer(); }} className="w-full flex items-center justify-between p-4 rounded-xl font-bold text-[16px] text-emerald-800 hover:bg-emerald-50 transition-all"><div className="flex items-center gap-3"><UserIcon className="w-5 h-5" />Sign In</div><ChevronRight className="w-4 h-4 text-emerald-200" /></button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
