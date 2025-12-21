
import React, { useState } from 'react';
import { Search, Plus, LogOut, ChevronDown, BookOpen, Users, Megaphone, Globe, Sparkles } from 'lucide-react';
import { User, View } from '../types';

interface NavbarProps {
  user: User | null;
  currentView: View;
  setView: (view: View) => void;
  onLogout: () => void;
}

const NavDropdown: React.FC<{ label: string; items: { label: string; icon?: any }[] }> = ({ label, items }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative group" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      <button className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-emerald-800 py-4 transition-colors">
        {label}
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 w-56 bg-white border border-gray-100 shadow-xl rounded-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {items.map((item, i) => (
            <button key={i} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-emerald-50 hover:text-emerald-800 transition-colors text-left">
              {item.icon && <item.icon className="w-4 h-4 opacity-70" />}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const Navbar: React.FC<NavbarProps> = ({ user, currentView, setView, onLogout }) => {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 h-16">
        {/* Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer shrink-0" 
          onClick={() => setView(View.HOME)}
        >
          <div className="w-9 h-9 bg-emerald-800 rounded-lg flex items-center justify-center text-white shadow-md">
            <span className="font-serif text-xl font-bold">M</span>
          </div>
          <h1 className="hidden lg:block font-serif text-xl font-bold text-emerald-900 tracking-tight">
            Muslim Hunt
          </h1>
        </div>

        {/* Dropdowns */}
        <div className="hidden md:flex items-center gap-6">
          <NavDropdown 
            label="Best Products" 
            items={[
              { label: 'Halal Tech', icon: Globe },
              { label: 'EdTech', icon: BookOpen },
              { label: 'FinTech', icon: Sparkles },
            ]} 
          />
          <NavDropdown 
            label="Community" 
            items={[
              { label: 'Halaqas', icon: Users },
              { label: 'Events', icon: Globe },
              { label: 'Maker Discussions', icon: Users },
            ]} 
          />
          <NavDropdown 
            label="News" 
            items={[
              { label: 'Weekly Newsletter', icon: BookOpen },
              { label: 'Founder Stories', icon: Sparkles },
            ]} 
          />
          <button className="text-sm font-medium text-gray-600 hover:text-emerald-800">Advertise</button>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-sm hidden lg:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/10 focus:border-emerald-700 transition-all text-sm"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => user ? setView(View.SUBMIT) : setView(View.LOGIN)}
            className="flex items-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Launch</span>
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-800 overflow-hidden cursor-pointer">
                <img src={user.avatar_url} alt={user.username} className="w-full h-full object-cover" />
              </div>
              <button onClick={onLogout} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setView(View.LOGIN)}
              className="text-emerald-800 font-bold text-sm px-4 py-2 hover:bg-emerald-50 rounded-lg transition-colors"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
