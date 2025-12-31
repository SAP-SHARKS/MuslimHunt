import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, LogOut, ChevronDown, ChevronRight, BookOpen, Users, Megaphone, Sparkles, X, 
  MessageSquare, Code, Cpu, CheckSquare, Palette, DollarSign, Bot, ArrowRight, ArrowUpRight, Star,
  Rocket, Compass, Mail, FileText, Flame, Calendar, Plus, Bell, Settings, User as UserIcon,
  Triangle, Clock, Menu, Zap, Layout, Trophy, Hash,
  Activity, Wind, Brain, Moon, Dumbbell, Hotel, Map, Chrome, Figma, Slack, Wallet, ShoppingBag, CreditCard, Baby
} from 'lucide-react';
import { User, View, Notification, NavMenuItem, Category } from '../types';
import { formatTimeAgo } from '../utils/dateUtils';

const ICON_MAP: Record<string, any> = {
  Rocket, Compass, MessageSquare, Flame, Calendar, Mail, BookOpen, FileText, Menu, X, Star, Zap, Code, Cpu, CheckSquare, Palette, Users, DollarSign, Megaphone, Layout, Triangle, Bot, Sparkles, Trophy, Hash,
  Activity, Wind, Brain, Moon, Dumbbell, Hotel, Map, Chrome, Figma, Slack, Wallet, ShoppingBag, CreditCard, Baby
};

const CATEGORY_DRILLDOWN: Record<string, string[]> = {
  'Trending': ['ArabicHero Pro', 'Halal Habit Trackers', 'Vibe Coding Tools', 'AI Dictation Apps'],
  'Engineering': ['AI Coding Agents', 'AI Code Editors', 'Vibe Coding Tools', 'Browser Automation'],
  'LLMs': ['AI Chatbots', 'AI Infrastructure Tools', 'Prompt Engineering Tools', 'Vector Databases'],
  'Productivity': ['AI notetakers', 'Note and writing apps', 'Team collaboration software', 'Search'],
  'Marketing': ['Lead generation software', 'Marketing automation platforms', 'Ethical SEO Tools'],
  'Design': ['Video editing', 'AI Generative Media', 'Graphic design tools', '3D & Animation'],
  'Social': ['Community Platforms', 'Islamic Social Networks', 'Event Management'],
  'Finance': ['Accounting software', 'Fundraising resources', 'Shariah Investing', 'Zakat Calculators'],
  'AI Agents': ['AI Voice Agents', 'AI Agent Automation', 'Customer Support Bots']
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
          {isBestProducts ? (
            <div className="flex flex-col">
              <div className="bg-red-50 px-5 py-3.5 flex items-center justify-between group/banner cursor-pointer border-b border-red-100/40 hover:bg-red-100/50 transition-colors">
                <div className="flex items-center gap-3.5 text-left">
                  <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center border border-red-100 shadow-sm"><Trophy className="w-4.5 h-4.5 text-red-600" /></div>
                  <div><p className="text-[13px] font-black text-gray-900 leading-none">Orbit Awards</p><p className="text-[10px] text-gray-500 font-medium mt-1">Awards powered by what <br/> reviewers actually say</p></div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-red-400 group-hover/banner:translate-x-1 transition-transform" />
              </div>

              <div className="flex divide-x divide-gray-100">
                <div className="w-[55%] p-4 pt-3.5">
                  <div className="grid grid-cols-1 gap-0.5">
                    {items.map((item, i) => (
                      <button key={i} onMouseEnter={() => setActiveHoverCategory(item.label)} onClick={item.onClick} 
                        className={`w-full flex items-center gap-3 py-1.5 px-3 rounded-xl transition-all text-left group/item relative ${activeHoverCategory === item.label ? 'bg-blue-50 shadow-sm' : 'hover:bg-gray-50/50'}`}>
                        <div className={`w-8 h-8 ${item.bgClass || 'bg-gray-50'} rounded-full flex items-center justify-center ${item.colorClass || 'text-gray-400'} shrink-0 shadow-sm transition-transform group-hover/item:scale-105`}><item.icon className="w-4 h-4" /></div>
                        <div className="flex-1 min-w-0"><p className={`text-[13px] font-bold leading-none transition-colors ${activeHoverCategory === item.label ? 'text-blue-900' : 'text-gray-900 group-hover/item:text-emerald-900'}`}>{item.label}</p></div>
                        {activeHoverCategory === item.label && <ChevronRight className="w-3.5 h-3.5 text-blue-400 animate-in slide-in-from-left-1" />}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="w-[45%] p-4 pt-3.5 bg-gray-50/20 flex flex-col">
                  <div className="space-y-3 mb-auto px-1">{(CATEGORY_DRILLDOWN[activeHoverCategory] || CATEGORY_DRILLDOWN['Trending']).map((link, i) => (
                    <button key={i} className="w-full text-left group/pop flex items-center justify-between py-0.5"><p className="text-[12px] font-bold text-gray-700 group-hover/pop:text-emerald-900 transition-colors">{link}</p><ArrowUpRight className="w-3 h-3 text-gray-200 group-hover/pop:text-emerald-500 transition-colors" /></button>
                  ))}</div>
                  <div className="mt-6 bg-emerald-50 border border-emerald-100 p-4 rounded-2xl relative overflow-hidden group/promo cursor-pointer">
                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover/promo:rotate-12 group-hover/promo:scale-125 transition-all"><Sparkles className="w-8 h-8 text-emerald-800" /></div>
                    <p className="text-[7px] font-black text-emerald-800 uppercase tracking-[0.2em] mb-1">Promotion</p><p className="text-[12px] font-black text-gray-900 leading-tight">Partner with Muslim Hunt</p>
                    <button className="mt-1.5 text-[9px] font-black text-emerald-800 flex items-center gap-1 group-hover/promo:translate-x-0.5 transition-transform uppercase tracking-widest">Media Kit <ChevronRight className="w-2.5 h-2.5" /></button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-4">{items.map((item, i) => (
              <button key={i} onClick={item.onClick} className="w-full flex items-start gap-4 px-5 py-3.5 hover:bg-gray-50 transition-all text-left group/item">
                <div className={`w-9 h-9 ${item.bgClass || 'bg-gray-50'} rounded-xl flex items-center justify-center ${item.colorClass || 'text-gray-400'} shrink-0 group-hover/item:scale-105 transition-transform shadow-sm`}><item.icon className="w-4 h-4" /></div>
                <div className="flex flex-col pt-0.5 min-w-0 text-left"><p className="text-[13px] font-bold text-gray-900 group-hover/item:text-emerald-800 transition-colors leading-none">{item.label}</p>{item.subtext && <p className="text-[10px] text-gray-500 font-medium leading-relaxed mt-1.5 line-clamp-1">{item.subtext}</p>}</div>
              </button>
            ))}</div>
          )}
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
  const [mobileCategorySearch, setMobileCategorySearch] = useState('');
  
  const submitDropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const notificationDropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (submitDropdownRef.current && !submitDropdownRef.current.contains(event.target as Node)) setShowSubmitDropdown(false);
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) setShowUserDropdown(false);
      if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target as Node)) setShowNotificationDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(mobileCategorySearch.toLowerCase()) ||
    c.parent_category.toLowerCase().includes(mobileCategorySearch.toLowerCase())
  ).slice(0, 10);

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

        <div className="flex items-center gap-3">
          <button onClick={() => setShowMobileSearch(true)} className="lg:hidden p-2 text-gray-600 hover:text-emerald-900 transition-colors"><Search className="w-5 h-5" /></button>
          <button onClick={() => setView(View.NEWSLETTER)} className="hidden sm:block text-gray-600 font-bold text-[13px] px-5 py-2.5 border border-gray-200 rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95 shadow-sm">Subscribe</button>
          {user ? (
            <div className="flex items-center gap-3">
              <div className="relative" ref={notificationDropdownRef}>
                <button onClick={() => setShowNotificationDropdown(!showNotificationDropdown)} className={`p-2 transition-colors relative ${showNotificationDropdown ? 'text-emerald-900' : 'text-gray-400 hover:text-emerald-800'}`}>
                  <Bell className="w-5 h-5" />{unreadCount > 0 && <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#ff6154] rounded-full border-2 border-white shadow-sm" />}
                </button>
                {showNotificationDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-100 shadow-2xl rounded-2xl p-6 z-[110] animate-in fade-in slide-in-from-top-2">
                    <h4 className="text-[11px] font-black text-gray-900 uppercase tracking-widest mb-4 border-b border-gray-50 pb-3">Recent Notifications</h4>
                    <div className="space-y-4 mb-6">{notifications.length === 0 ? <p className="text-[13px] text-gray-400 italic text-center py-4">No unread notifications!</p> : notifications.slice(0, 2).map((n) => (
                        <div key={n.id} className="flex gap-3 group/notif cursor-pointer"><div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 text-emerald-900 border border-emerald-100 shadow-sm">{n.type === 'upvote' ? <Triangle className="w-4 h-4 fill-emerald-900" /> : <MessageSquare className="w-4 h-4" />}</div>
                          <div className="min-w-0"><p className="text-[13px] font-medium text-gray-900 leading-snug line-clamp-2">{n.message}</p><p className="text-[10px] font-black text-gray-300 uppercase tracking-tighter mt-1">{formatTimeAgo(n.created_at)}</p></div>
                        </div>
                      ))}</div>
                    <button onClick={() => { setView(View.NOTIFICATIONS); setShowNotificationDropdown(false); }} className="w-full py-3 bg-white border border-gray-100 rounded-xl text-xs font-black text-gray-400 hover:text-emerald-800 hover:border-emerald-800 transition-all uppercase tracking-widest shadow-sm">View all</button>
                  </div>
                )}
              </div>
              <div className="relative" ref={submitDropdownRef}>
                <button onClick={() => setShowSubmitDropdown(!showSubmitDropdown)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border-2 active:scale-95 ${showSubmitDropdown ? 'bg-[#ff6154] border-[#ff6154] text-white' : 'border-emerald-800 text-emerald-800 hover:bg-emerald-50'}`}><Plus className="w-4 h-4" /> Submit</button>
                {showSubmitDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-100 shadow-2xl rounded-xl py-2 z-[110] animate-in fade-in slide-in-from-top-2">
                    <button onClick={() => { setView(View.POST_SUBMIT); setShowSubmitDropdown(false); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left group"><Rocket className="w-4 h-4 text-orange-600" /><p className="text-sm font-bold text-gray-900">Launch a product</p></button>
                  </div>
                )}
              </div>
              <div className="relative" ref={userDropdownRef}>
                <button onClick={() => setShowUserDropdown(!showUserDropdown)} className="w-9 h-9 rounded-full overflow-hidden border-2 border-emerald-800 p-0.5 hover:ring-2 hover:ring-emerald-200 transition-all active:scale-95"><img src={user.avatar_url} alt={user.username} className="w-full h-full object-cover rounded-full" /></button>
                {showUserDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-100 shadow-2xl rounded-xl py-2 z-[110] animate-in fade-in slide-in-from-top-2">
                    <button onClick={() => { onViewProfile(); setShowUserDropdown(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-sm font-bold text-gray-700"><UserIcon className="w-4 h-4 text-gray-400" /> Profile</button>
                    <button onClick={() => { onLogout(); setShowUserDropdown(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-sm font-bold text-red-600 border-t border-gray-50"><LogOut className="w-4 h-4" /> Logout</button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button onClick={onSignInClick} className="text-emerald-900 font-black text-[13px] px-5 py-2.5 hover:bg-emerald-50 rounded-2xl transition-all active:scale-95 border border-emerald-100 shadow-sm">Sign In</button>
            </div>
          )}
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-2xl z-[120] animate-in slide-in-from-top-4 duration-300 overflow-y-auto max-h-[calc(100vh-64px)]">
          <div className="p-6 space-y-8">
            <div className="relative group"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search 200+ categories..." value={mobileCategorySearch} onChange={(e) => setMobileCategorySearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:bg-white focus:border-emerald-800 outline-none transition-all" />
            </div>
            {mobileCategorySearch && (
              <div className="space-y-1 animate-in fade-in slide-in-from-top-1 duration-200">
                <p className="text-[9px] font-black text-emerald-800 uppercase tracking-widest px-2 mb-2">Matching Categories</p>
                {filteredCategories.map(cat => (
                  <button key={cat.id} onClick={() => { onCategorySelect?.(cat.name); setIsMobileMenuOpen(false); setMobileCategorySearch(''); }}
                    className="w-full flex items-center justify-between p-3 hover:bg-emerald-50 rounded-xl transition-colors text-left">
                    <div className="flex items-center gap-3"><div className="w-8 h-8 bg-emerald-100/50 rounded-lg flex items-center justify-center text-emerald-800"><Hash className="w-4 h-4" /></div><span className="text-sm font-bold text-gray-900">{cat.name}</span></div>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  </button>
                ))}
              </div>
            )}
            {!mobileCategorySearch && (
              <>
                <button onClick={() => { setView(View.CATEGORIES); setIsMobileMenuOpen(false); }} className="w-full flex items-center justify-between p-4 bg-emerald-50/50 rounded-2xl text-emerald-900 border border-emerald-100 font-bold uppercase tracking-widest text-sm shadow-inner">
                  <div className="flex items-center gap-4"><Layout className="w-6 h-6" /><span className="tracking-tight">Explore All Categories</span></div><ChevronRight className="w-5 h-5 opacity-50" />
                </button>
                {mainNavItems.map((menu) => (
                  <div key={menu.id} className="space-y-4">
                    <div className="flex items-center gap-3 px-2 border-b border-gray-50 pb-2">{menu.icon && ICON_MAP[menu.icon] && React.createElement(ICON_MAP[menu.icon], { className: "w-4 h-4 text-emerald-800 opacity-60" })}<h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">{menu.label}</h3></div>
                    <div className="grid grid-cols-1 gap-2">{menu.sub_items && menu.sub_items.length > 0 ? menu.sub_items.map((sub, idx) => (
                        <button key={idx} onClick={() => { setView(sub.view); setIsMobileMenuOpen(false); }} className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-all text-left group">
                          <div className={`w-10 h-10 ${sub.bgClass || 'bg-gray-50'} ${sub.colorClass || 'text-gray-400'} rounded-xl flex items-center justify-center shrink-0 shadow-sm`}>{sub.icon && ICON_MAP[sub.icon] && React.createElement(ICON_MAP[sub.icon], { className: "w-5 h-5" })}</div>
                          <div className="flex-1 text-left"><p className="text-sm font-bold text-gray-900 group-hover:text-emerald-800">{sub.label}</p><p className="text-[11px] text-gray-500 font-medium leading-tight">{sub.subtext}</p></div><ChevronRight className="w-4 h-4 text-gray-300" />
                        </button>
                      )) : (
                        <button onClick={() => { const tv = (menu.view || (menu as any).view_name); if (tv) { setView(tv as View); setIsMobileMenuOpen(false); } }} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl text-left">
                          <div className="flex items-center gap-4"><div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">{menu.icon && ICON_MAP[menu.icon] ? React.createElement(ICON_MAP[menu.icon], { className: "w-5 h-5" }) : <Star className="w-5 h-5" />}</div><span className="text-lg font-bold text-gray-900">{menu.label}</span></div><ChevronRight className="w-4 h-4 text-gray-300" />
                        </button>
                      )}</div>
                  </div>
                ))}
              </>
            )}
            {!user && <button onClick={() => { onSignInClick(); setIsMobileMenuOpen(false); }} className="w-full py-4 bg-emerald-800 text-white rounded-2xl font-black text-lg shadow-xl shadow-emerald-900/20 active:scale-[0.98]">Join the Community</button>}
            <button onClick={() => { setView(View.SPONSOR); setIsMobileMenuOpen(false); }} className="w-full flex items-center justify-center gap-3 p-4 bg-gray-900 text-white rounded-2xl font-bold active:scale-[0.98]"><Megaphone className="w-5 h-5 text-emerald-400" />Advertise</button>
          </div>
        </div>
      )}

      {showMobileSearch && (
        <div className="fixed inset-0 z-[150] bg-black/50 lg:hidden" onClick={() => setShowMobileSearch(false)}>
          <div className="bg-white p-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3"><Search className="w-5 h-5 text-gray-400" /><input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} autoFocus className="flex-1 py-4 bg-transparent border-none outline-none text-lg font-bold text-gray-900" /><button onClick={() => setShowMobileSearch(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-6 h-6" /></button></div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;