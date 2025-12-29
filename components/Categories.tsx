import React, { useEffect, useState, useMemo } from 'react';
import { ArrowLeft, Search, Sparkles, ChevronRight, Hash, Zap, Code, Palette, DollarSign, Megaphone, CheckSquare, Users, BookOpen } from 'lucide-react';
import { CATEGORY_SECTIONS } from '../constants.tsx';

// Mapping icons to string IDs for easy lookup from constants
const ICON_MAP: Record<string, any> = {
  CheckSquare, Code, Palette, DollarSign, Megaphone, BookOpen
};

interface CategoriesProps {
  onBack: () => void;
  onCategorySelect: (category: string) => void;
}

const Categories: React.FC<CategoriesProps> = ({ onBack, onCategorySelect }) => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredSections = useMemo(() => {
    if (!searchTerm.trim()) return CATEGORY_SECTIONS;
    
    return CATEGORY_SECTIONS.map(section => ({
      ...section,
      items: section.items.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })).filter(section => section.items.length > 0 || section.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-emerald-800 transition-colors mb-12 group font-black uppercase tracking-widest text-[10px]"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to discovery feed
        </button>

        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full mb-6">
            <Sparkles className="w-3.5 h-3.5 fill-emerald-800" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Full Directory</span>
          </div>
          <h1 className="text-5xl sm:text-7xl font-serif font-bold text-emerald-900 tracking-tighter mb-6">
            Product Categories
          </h1>
          <p className="text-lg text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Explore 200+ specialized categories of the global Ummah tech landscape.
          </p>
        </div>

        <div className="sticky top-[4.1rem] z-40 bg-white/80 backdrop-blur-md py-4 mb-16 border-b border-gray-50">
          <div className="max-w-xl mx-auto mb-6">
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-800 transition-colors" />
              <input 
                type="text" 
                placeholder="Search 200+ categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-md font-medium outline-none focus:bg-white focus:border-emerald-800 focus:ring-4 focus:ring-emerald-900/5 transition-all shadow-sm"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORY_SECTIONS.map((section) => {
              const Icon = ICON_MAP[section.icon] || Hash;
              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-full text-xs font-black text-gray-500 uppercase tracking-widest hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-200 transition-all whitespace-nowrap active:scale-95"
                >
                  <Icon className="w-3.5 h-3.5" />
                  {section.title}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-32 pb-32">
          {filteredSections.map((section) => {
            const Icon = ICON_MAP[section.icon] || Hash;
            return (
              <section key={section.id} id={section.id} className="scroll-mt-20">
                <div className="flex items-center gap-3 mb-10 border-b border-gray-100 pb-6">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-800 rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h2 className="text-3xl font-serif font-bold text-emerald-900">{section.title}</h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {section.items.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => onCategorySelect(item.name)}
                      className="flex flex-col p-6 bg-white border border-gray-100 rounded-2xl hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-900/5 transition-all text-left group"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-base font-bold text-gray-900 group-hover:text-emerald-800 transition-colors">
                          {item.name}
                        </h3>
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-emerald-800 group-hover:translate-x-1 transition-all" />
                      </div>
                      <p className="text-[13px] text-gray-500 leading-snug font-medium line-clamp-2">
                        {item.description}
                      </p>
                    </button>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Categories;