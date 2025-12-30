
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Sparkles, ChevronRight, Star, Triangle, Users, ChevronLeft, ArrowRight, Loader2, Monitor, Smartphone, Globe } from 'lucide-react';
import { Product, Category } from '../types.ts';
import CategorySidebar from './CategorySidebar.tsx';
import SafeImage from './SafeImage.tsx';
import ProductBadge from './ProductBadge.tsx';

interface CategoryDetailProps {
  category: string;
  products: Product[];
  categories: Category[];
  onBack: () => void;
  onProductClick: (p: Product) => void;
  onUpvote: (id: string) => void;
  hasUpvoted: (id: string) => boolean;
  onCategorySelect: (category: string) => void;
}

const ITEMS_PER_PAGE = 10;
const PROOF_ICONS = ['https://i.pravatar.cc/150?u=1', 'https://i.pravatar.cc/150?u=2', 'https://i.pravatar.cc/150?u=3'];

const CategoryDetail: React.FC<CategoryDetailProps> = ({ 
  category, products, categories, onBack, onProductClick, onUpvote, hasUpvoted, onCategorySelect 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const listTopRef = useRef<HTMLDivElement>(null);

  const normalizedCategory = useMemo(() => category?.toLowerCase() || '', [category]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [category]);

  const categoryProducts = useMemo(() => {
    return products
      .filter(p => p.category?.toLowerCase() === normalizedCategory)
      .sort((a, b) => (b.upvotes_count || 0) - (a.upvotes_count || 0));
  }, [products, normalizedCategory]);

  const totalPages = Math.ceil(categoryProducts.length / ITEMS_PER_PAGE);
  const displayedProducts = useMemo(() => categoryProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE), [categoryProducts, currentPage]);

  const parentCategoryName = useMemo(() => {
    return categories.find(c => c.name.toLowerCase() === normalizedCategory)?.parent_category || "Categories";
  }, [categories, normalizedCategory]);

  if (!category || (categoryProducts.length === 0 && products.length > 0)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 bg-white">
        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-6"><Loader2 className="w-8 h-8 text-emerald-800 animate-spin" /></div>
        <h2 className="text-2xl font-serif font-bold text-emerald-900 mb-2 tracking-tight">Checking for {category}...</h2>
        <button onClick={onBack} className="text-emerald-800 font-bold hover:underline flex items-center gap-2"><ChevronLeft className="w-4 h-4" /> Return to Directory</button>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8">
        <nav className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-10 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <button onClick={onBack} className="hover:text-emerald-800 transition-colors">Home</button>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <button onClick={onBack} className="hover:text-emerald-800">Product categories</button>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <span className="text-gray-400 cursor-default">{parentCategoryName}</span>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <span className="text-emerald-800 capitalize">{category}</span>
        </nav>

        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-12 mb-16 relative">
          <div className="flex-1 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full mb-6">
              <Sparkles className="w-4 h-4 fill-emerald-800" /><span className="text-[10px] font-black uppercase tracking-[0.2em]">Ranked Directory</span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-serif font-bold text-emerald-900 tracking-tight leading-tight mb-6 text-center lg:text-left capitalize">The best {category} to use in 2025</h1>
            <p className="text-lg text-gray-500 font-medium max-w-2xl mb-8 leading-relaxed text-center lg:text-left">Top-rated tools vetted by the Muslim Hunt community.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
             <div ref={listTopRef} className="space-y-4">
                {displayedProducts.map((p, i) => (
                  <div key={p.id} onClick={() => onProductClick(p)} className="group bg-white border border-gray-100 rounded-[2.5rem] p-6 hover:border-emerald-200 transition-all cursor-pointer shadow-sm flex items-center gap-6">
                    <div className="w-10 shrink-0 text-4xl font-serif italic text-gray-100 group-hover:text-emerald-800/30 transition-colors pt-1">{(currentPage - 1) * ITEMS_PER_PAGE + i + 1}.</div>
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border border-emerald-100/50 bg-white shrink-0"><SafeImage src={p.logo_url} alt={p.name} seed={p.name} className="w-full h-full" /></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1"><h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-800 transition-colors tracking-tight leading-none truncate">{p.name}</h3></div>
                      <p className="text-gray-500 text-sm font-medium leading-snug line-clamp-1">{p.tagline}</p>
                    </div>
                  </div>
                ))}
             </div>
             {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-black transition-all ${currentPage === i + 1 ? 'bg-emerald-800 text-white' : 'text-gray-400 hover:text-emerald-800'}`}>{i + 1}</button>
                  ))}
                </div>
              )}
          </div>
          <CategorySidebar activeCategory={category} categories={categories} onCategorySelect={onCategorySelect} />
        </div>
      </div>
    </div>
  );
};

export default CategoryDetail;
