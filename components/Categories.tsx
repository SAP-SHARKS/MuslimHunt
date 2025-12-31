import React, { useEffect, useState, useMemo } from 'react';
import { 
  ArrowLeft, Search, Sparkles, ChevronRight, Hash, Code, Palette, DollarSign, Megaphone, CheckSquare, BookOpen,
  Activity, Wind, Brain, Moon, Dumbbell, Hotel, Map, Chrome, Figma, Slack, Wallet, ShoppingBag, CreditCard, Baby
} from 'lucide-react';
import { Category } from '../types.ts';

const ICON_MAP: Record<string, any> = {
  CheckSquare, Code, Palette, DollarSign, Megaphone, BookOpen,
  Activity, Wind, Brain, Moon, Dumbbell, Hotel, Map, Chrome, Figma, Slack, Wallet, ShoppingBag, CreditCard, Baby
};

interface CategoriesProps {
  categories: Category[];
  onBack: () => void;
  onCategorySelect: (category: string) => void;
}

const Categories: React.FC<CategoriesProps> = ({ categories, onBack, onCategorySelect }) => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const groupedCategories = useMemo(() => {
    const filtered = categories.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.parent_category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const groups: Record<string, Category[]> = {};
    filtered.forEach(cat => {
      if (!groups[cat.parent_category]) groups[cat.parent_category] = [];
      groups[cat.parent_category].push(cat);
    });
    return groups;
  }, [categories, searchTerm]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({ top: el.offsetTop - 100, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-emerald-800 transition-colors mb-12 group font-black uppercase tracking-widest text-[10px]">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to discovery feed
        </button>

        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full mb-6">
            <Sparkles className="w-3.5 h-3.5 fill-emerald-800" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Full Directory</span>
          </div>
          <h1 className="text-5xl sm:text-7xl font-serif font-bold text-emerald-900 tracking-tighter mb-6">Product Categories</h1>
          <p className="text-lg text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">Explore specialized categories of the global Ummah tech landscape.</p>
        </div>

        <div className="sticky top-[4.1rem] z-40 bg-white/80 backdrop-blur-md py-4 mb-16 border-b border-gray-50">
          <div className="max-w-xl mx-auto mb-6">
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-800 transition-colors" />
              <input 
                type="text" placeholder="Search categories (e.g. crypto, wallet, travel, productivity)..." value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-md font-medium outline-none focus:bg-white focus:border-emerald-800 focus:ring-4 focus:ring-emerald-900/5 transition-all shadow-sm"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {Object.keys(groupedCategories).map((group) => (
              <button key={group} onClick={() => scrollToSection(group)} className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-full text-xs font-black text-gray-500 uppercase tracking-widest hover:bg-emerald-50 hover:text-emerald-800 transition-all whitespace-nowrap">
                {group}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-32 pb-32">
          {/* Explicitly cast to [string, Category[]][] to ensure 'items' is inferred correctly */}
          {(Object.entries(groupedCategories) as [string, Category[]][]).map(([group, items]) => (
            <section key={group} id={group} className="scroll-mt-20">
              <div className="flex items-center gap-3 mb-10 border-b border-gray-100 pb-6">
                <h2 className="text-3xl font-serif font-bold text-emerald-900">{group}</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => {
                  const Icon = ICON_MAP[item.icon_name] || Hash;
                  return (
                    <button key={item.id} onClick={() => onCategorySelect(item.name)} className="flex flex-col p-6 bg-white border border-gray-100 rounded-2xl hover:border-emerald-200 hover:shadow-xl transition-all text-left group">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-emerald-50 text-emerald-800 rounded-lg"><Icon className="w-5 h-5" /></div>
                          <h3 className="text-base font-bold text-gray-900 group-hover:text-emerald-800 transition-colors">{item.name}</h3>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-emerald-800 transition-all" />
                      </div>
                      <p className="text-[13px] text-gray-500 leading-snug font-medium line-clamp-2">{item.description}</p>
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;