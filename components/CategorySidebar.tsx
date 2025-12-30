
import React, { useMemo } from 'react';
import { MessageSquare, Sparkles, ArrowUpRight, Clock, ChevronRight } from 'lucide-react';
import { Category } from '../types.ts';

interface CategorySidebarProps {
  activeCategory?: string;
  categories: Category[];
  onCategorySelect?: (category: string) => void;
}

const CategorySidebar: React.FC<CategorySidebarProps> = ({ activeCategory = "", categories, onCategorySelect }) => {
  const currentCategoryData = useMemo(() => {
    return categories.find(c => c.name.toLowerCase() === activeCategory.toLowerCase());
  }, [activeCategory, categories]);

  const siblingLinks = useMemo(() => {
    if (!currentCategoryData) return [];
    return categories
      .filter(c => c.parent_category === currentCategoryData.parent_category)
      .map(c => c.name);
  }, [currentCategoryData, categories]);

  return (
    <aside className="hidden lg:block space-y-10 sticky top-24 h-fit pb-12 overflow-y-auto max-h-[calc(100vh-6rem)] custom-scrollbar">
      <section>
        <div className="flex items-center justify-between mb-6 border-b border-gray-50 pb-4">
          <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">FORUM DISCUSSIONS<MessageSquare className="w-3.5 h-3.5 opacity-50" /></h3>
        </div>
        <div className="space-y-6">
          <div className="group cursor-pointer">
            <h4 className="text-sm font-bold text-gray-900 group-hover:text-emerald-800 transition-colors leading-relaxed mb-2 tracking-tight">Favorite {activeCategory} tools for the Ummah?</h4>
            <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]"><span>1.2K VIEWS</span><span className="text-gray-200">•</span><span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 2D AGO</span></div>
          </div>
        </div>
      </section>

      <section className="bg-[#052e16] rounded-[2rem] p-8 text-white relative overflow-hidden group shadow-2xl">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform pointer-events-none"><Sparkles className="w-24 h-24 text-emerald-400 rotate-12" /></div>
        <div className="relative z-10">
          <div className="inline-block px-2.5 py-1 bg-emerald-400 text-[#052e16] rounded-md text-[9px] font-black uppercase tracking-widest mb-6">PRO INSIGHT</div>
          <h4 className="text-lg font-bold leading-relaxed mb-8 text-emerald-50">Early adoption of {activeCategory} is trending in the ecosystem.</h4>
          <button className="flex items-center gap-2 text-xs font-black text-emerald-400 hover:text-white transition-colors group/link uppercase tracking-widest">Explore the Directory<ArrowUpRight className="w-4 h-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" /></button>
        </div>
      </section>
      
      <section className="pt-4">
        <h3 className="text-sm font-bold text-gray-900 mb-6 tracking-tight">More in {currentCategoryData?.parent_category || 'This Section'}</h3>
        <div className="flex flex-col space-y-3.5">
          {siblingLinks.map((link) => (
            <button key={link} onClick={() => onCategorySelect?.(link)} className={`text-sm text-left transition-all duration-200 hover:underline decoration-1 underline-offset-4 ${activeCategory.toLowerCase() === link.toLowerCase() ? 'text-emerald-800 font-bold' : 'text-gray-500 hover:text-emerald-800 font-medium'}`}>{link}</button>
          ))}
        </div>
      </section>
    </aside>
  );
};

export default CategorySidebar;
