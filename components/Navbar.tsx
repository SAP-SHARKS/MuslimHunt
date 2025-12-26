
import React, { useState } from 'react';
import { 
  Search, Plus, LogOut, ChevronDown, BookOpen, Users, Megaphone, Sparkles, X, 
  MessageSquare, Code, Cpu, CheckSquare, Palette, DollarSign, Bot, ArrowRight, Star,
  Rocket, Compass, Mail, FileText, Flame, Calendar, Menu
} from 'lucide-react';
import { User, View } from '../types';

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
        <div className="absolute top-full left-0 w-80 bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-2xl py-2 z-[100] animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
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

  const categories = [
    { label: 'Engineering & Development', icon: Code },
    { label: 'LLMs', icon: Cpu },
    { label: 'Productivity', icon: CheckSquare },
    { label: 'Marketing & Sales', icon: Megaphone },
    { label: 'Design & Creative', icon: Palette },
    { label: 'Social & Community', icon: Users },
    { label: 'Finance', icon: DollarSign },
    { label: 'AI Agents', icon: Bot },
  ];

  const trending = [
    'Vibe Coding Tools',
    'AI Dictation Apps',
    'AI notetakers',
    'Code Review Tools',
    'No-code Platforms',
    'Figma Plugins',
    'Static site generators'
  ];

  return (
    <div className="relative group h-full flex items-center" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      <button className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-emerald-800 py-4 transition-colors">
        Best Products
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 w-[580px] bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-b-2xl overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Featured Top Bar: Orbit Awards - Full Width */}
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
            {/* Left Column: Categories */}
            <div className="flex-[1.2] p-5">
              <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 px-2">Categories</h3>
              <div className="grid grid-cols-1 gap-0.5">
                {categories.map((cat, i) => (
                  <button 
                    key={i}
                    onClick={() => { setView(View.HOME); setIsOpen(false); }}
                    className="flex items-center gap-3 w-full px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 hover:text-emerald-800 rounded-xl transition-all text-left group/item"
                  >
                    <cat.icon className="w-4 h-4 text-gray-400 group-hover/item:text-emerald-800 transition-all shrink-0" />
                    {cat.label}
                  </button>
                ))}
                <button 
                  onClick={() => { setView(View.HOME); setIsOpen(false); }}
                  className="flex items-center gap-2 w-full px-3 py-2.5 text-xs font-black text-emerald-800 hover:bg-emerald-50 rounded-xl transition-all text-left mt-2 uppercase tracking-widest"
                >
                  Other Categories
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right Column: Trending Categories */}
            <div className="flex-1 p-5 bg-gray-50/20 flex flex-col">
              <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 px-2">Trending Categories</h3>
              <div className="space-y-0.5">
                {trending.map((item, i) => (
                  <button 
                    key={i}
                    onClick={() => { setView(View.HOME); setIsOpen(false); }}
                    className="block w-full px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-emerald-800 hover:bg-white rounded-lg transition-all text-left"
                  >
                    {item}
                  </button>
                ))}
              </div>
              
              {/* Promotional Card at bottom right */}
              <div className="mt-auto pt-6">
                <div className="p-4 bg-emerald-900 rounded-2xl text-white relative overflow-hidden group/ad shadow-lg shadow-emerald-900/10">
                  <div className="relative z-10">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-400 mb-2">UMMAH SPOTLIGHT</p>
                    <p className="text-[11px] font-bold leading-snug">Discover 50+ New Halal Startups this month.</p>
                  </div>
                  <div className="absolute -bottom-2 -right-2 opacity-10 group-hover/ad:scale-110 group-hover/ad:rotate-6 transition-transform">
                    <Rocket className="w-12 h-12" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Fixed: Added Navbar component definition and default export to resolve the "no default export" error.
interface NavbarProps {
  user: User | null;
  currentView: View;
  setView: (view: View) => void;
  onLogout: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onViewProfile: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  user, 
  currentView, 
  setView, 
  onLogout,
  searchQuery,
  onSearchChange,
  onViewProfile
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const communityItems: DropdownItem[] = [
    { label: 'Discussions', subtext: 'Ask questions & share stories', icon: MessageSquare, colorClass: 'text-blue-600', bgClass: 'bg-blue-50', onClick: () => setView(View.FORUM_HOME) },
    { label: 'Newsletter', subtext: 'The best products in your inbox', icon: Mail, colorClass: 'text-emerald-600', bgClass: 'bg-emerald-50', onClick: () => setView(View.NEWSLETTER) },
    { label: 'Recent Comments', subtext: 'Live community interactions', icon: MessageSquare, colorClass: 'text-purple-600', bgClass: 'bg-purple-50', onClick: () => setView(View.RECENT_COMMENTS) },
  ];

  const resourcesItems: DropdownItem[] = [
    { label: 'Sponsor', subtext: 'Reach the global Ummah', icon: Megaphone, colorClass: 'text-red-600', bgClass: 'bg-red-50', onClick: () => setView(View.SPONSOR) },
    { label: 'Guidelines', subtext: 'Community standards', icon: BookOpen, colorClass: 'text-yellow-600', bgClass: 'bg-yellow-50' },
  ];

  return (
    <nav className="sticky top-0 z-[100] bg-white/80 backdrop-blur-md border-b border-emerald-50 h-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-full flex items-center justify-between gap-8">
        {/* Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer group shrink-0" 
          onClick={() => setView(View.HOME)}
        >
          <div className="w-10 h-10 bg-emerald-800 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-900/20 group-hover:scale-110 transition-transform">
            <Sparkles className="w-6 h-6" />
          </div>
          <span className="text-xl font-serif font-bold text-emerald-900 tracking-tight hidden sm:block">Muslim Hunt</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6 h-full">
          <BestProductsDropdown setView={setView} />
          <RichDropdown label="Community" items={communityItems} />
          <RichDropdown label="Resources" items={resourcesItems} />
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md relative group hidden md:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-emerald-800 transition-colors" />
          <input 
            type="text" 
            placeholder="Search products, makers, or topics..." 
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-800 rounded-2xl outline-none transition-all text-sm font-medium placeholder:text-gray-400"
          />
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {user ? (
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setView(View.SUBMIT)}
                className="w-10 h-10 bg-emerald-50 text-emerald-800 rounded-xl flex items-center justify-center hover:bg-emerald-800 hover:text-white transition-all shadow-sm"
              >
                <Plus className="w-6 h-6" />
              </button>
              <div className="h-8 w-[1px] bg-gray-100 hidden sm:block" />
              <div className="relative group/user">
                <button 
                  onClick={onViewProfile}
                  className="w-10 h-10 rounded-xl overflow-hidden border-2 border-emerald-50 shadow-sm hover:border-emerald-800 transition-all active:scale-95"
                >
                  <img src={user.avatar_url} alt={user.username} className="w-full h-full object-cover" />
                </button>
                <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-100 shadow-xl rounded-2xl py-2 opacity-0 invisible group-hover/user:opacity-100 group-hover/user:visible transition-all z-[110]">
                  <button onClick={onViewProfile} className="w-full px-4 py-2 text-left text-sm font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                    <Users className="w-4 h-4" /> Profile
                  </button>
                  <button onClick={onLogout} className="w-full px-4 py-2 text-left text-sm font-bold text-red-600 hover:bg-red-50 flex items-center gap-2">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setView(View.LOGIN)}
                className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:text-emerald-800 transition-colors"
              >
                Log in
              </button>
              <button 
                onClick={() => setView(View.LOGIN)}
                className="px-6 py-2.5 bg-emerald-800 text-white rounded-xl text-sm font-black uppercase tracking-widest hover:bg-emerald-900 transition-all shadow-lg shadow-emerald-900/10"
              >
                Join
              </button>
            </div>
          )}
          
          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden p-2 text-gray-400 hover:text-emerald-800 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-2xl z-[100] p-6 animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 rounded-xl outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => { setView(View.HOME); setIsMobileMenuOpen(false); }} className="p-4 bg-gray-50 rounded-2xl text-left">
                <Sparkles className="w-6 h-6 text-emerald-800 mb-2" />
                <p className="font-bold text-gray-900 text-sm">Products</p>
              </button>
              <button onClick={() => { setView(View.FORUM_HOME); setIsMobileMenuOpen(false); }} className="p-4 bg-gray-50 rounded-2xl text-left">
                <MessageSquare className="w-6 h-6 text-blue-600 mb-2" />
                <p className="font-bold text-gray-900 text-sm">Forum</p>
              </button>
            </div>
            <div className="space-y-2">
              <button onClick={() => { setView(View.NEWSLETTER); setIsMobileMenuOpen(false); }} className="w-full p-4 hover:bg-gray-50 rounded-2xl text-left flex items-center gap-4">
                <Mail className="w-5 h-5 text-emerald-600" />
                <p className="font-bold text-gray-900">Newsletter</p>
              </button>
              <button onClick={() => { setView(View.SPONSOR); setIsMobileMenuOpen(false); }} className="w-full p-4 hover:bg-gray-50 rounded-2xl text-left flex items-center gap-4">
                <Megaphone className="w-5 h-5 text-red-600" />
                <p className="font-bold text-gray-900">Sponsor</p>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
