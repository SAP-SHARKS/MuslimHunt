import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Sparkles, ChevronRight, Star, Triangle, Users, ChevronLeft, ArrowRight, Loader2, Monitor, Smartphone, Globe } from 'lucide-react';
import { Product } from '../types.ts';
import CategorySidebar from './CategorySidebar.tsx';
import SafeImage from './SafeImage.tsx';
import { CATEGORY_SECTIONS } from '../constants.tsx';
import ProductBadge from './ProductBadge.tsx';

interface CategoryDetailProps {
  category: string;
  products: Product[];
  onBack: () => void;
  onProductClick: (p: Product) => void;
  onUpvote: (id: string) => void;
  hasUpvoted: (id: string) => boolean;
  onCategorySelect: (category: string) => void;
}

const ITEMS_PER_PAGE = 10;

// Mock "Used by" proofing icons
const PROOF_ICONS = [
  'https://i.pravatar.cc/150?u=1',
  'https://i.pravatar.cc/150?u=2',
  'https://i.pravatar.cc/150?u=3',
  'https://i.pravatar.cc/150?u=4'
];

const LogoIcon: React.FC<{ logo: { name: string, src: string, className: string } }> = ({ logo }) => {
  return (
    <div className={`absolute bg-white rounded-2xl shadow-xl p-2 border border-gray-100 transition-all duration-300 hover:scale-110 hover:z-[50] cursor-pointer group/logo ${logo.className}`}>
      <SafeImage 
        src={logo.src} 
        alt={logo.name} 
        className="w-full h-full object-contain rounded-lg transition-transform duration-300 group-hover/logo:scale-105"
      />
    </div>
  );
};

const CategoryDetail: React.FC<CategoryDetailProps> = ({ 
  category, 
  products, 
  onBack, 
  onProductClick, 
  onUpvote, 
  hasUpvoted, 
  onCategorySelect 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const listTopRef = useRef<HTMLDivElement>(null);

  const normalizedCategory = useMemo(() => category?.toLowerCase() || '', [category]);

  // Handle URL sync and Page Reset on category switch
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pageParam = parseInt(params.get('page') || '1', 10);
    setCurrentPage(pageParam);
    
    // Smooth scroll to top when category changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [category]);

  const categoryProducts = useMemo(() => {
    if (!normalizedCategory) return [];
    return products
      .filter(p => p.category?.toLowerCase() === normalizedCategory)
      .sort((a, b) => (b.upvotes_count || 0) - (a.upvotes_count || 0));
  }, [products, normalizedCategory]);

  const totalPages = Math.ceil(categoryProducts.length / ITEMS_PER_PAGE);
  
  const displayedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return categoryProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [categoryProducts, currentPage]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    const params = new URLSearchParams(window.location.search);
    params.set('page', page.toString());
    const newPath = window.location.pathname + '?' + params.toString();
    
    try {
      window.history.pushState({}, '', newPath);
    } catch (e) {
      console.warn('[Muslim Hunt] Paging history push suppressed', e);
    }

    if (listTopRef.current) {
      const offset = 100;
      const top = listTopRef.current.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const clusterLogos = useMemo(() => {
    const sourceLogos = categoryProducts.slice(0, 6).map(p => ({ name: p.name, src: p.logo_url }));
    const positions = [
      'top-0 right-12 w-20 h-20 rotate-[-12deg] z-10',
      'top-8 right-0 w-16 h-16 rotate-[12deg] z-20',
      'bottom-4 left-0 w-20 h-20 rotate-[8deg] z-10',
      'bottom-0 right-8 w-18 h-18 rotate-[-8deg] z-30',
      'top-1/2 right-16 -translate-y-1/2 w-16 h-16 rotate-[15deg] z-40',
      'top-12 right-32 w-14 h-14 rotate-[-5deg] z-20'
    ];
    return sourceLogos.map((logo, i) => ({
      name: logo.name,
      src: logo.src,
      className: positions[i] || positions[0]
    }));
  }, [categoryProducts]);

  const parentCategory = useMemo(() => {
    for (const section of CATEGORY_SECTIONS) {
      if (section.items.some(item => item.name.toLowerCase() === normalizedCategory)) {
        return section.title;
      }
    }
    return "Product categories";
  }, [normalizedCategory]);

  if (!category || categoryProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 bg-white">
        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
          <Loader2 className="w-8 h-8 text-emerald-800 animate-spin" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-emerald-900 mb-2 tracking-tight">Vetting {category || 'Category'}...</h2>
        <button onClick={onBack} className="text-emerald-800 font-bold hover:underline flex items-center gap-2">
          <ChevronLeft className="w-4 h-4" /> Return to Directory
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-10 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <button onClick={onBack} className="hover:text-emerald-800 transition-colors">Home</button>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <button onClick={onBack} className="hover:text-emerald-800 cursor-pointer">Product categories</button>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <span className="text-gray-400 cursor-default">{parentCategory}</span>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <span className="text-emerald-800 capitalize">{category}</span>
        </nav>

        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-12 mb-16 relative">
          <div className="flex-1 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full mb-6">
              <Sparkles className="w-4 h-4 fill-emerald-800" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Ranked Directory</span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-serif font-bold text-emerald-900 tracking-tight leading-tight mb-6 text-center lg:text-left capitalize">
              The best {category} <br className="hidden sm:block" /> to use in 2025
            </h1>
            <p className="text-lg text-gray-500 font-medium max-w-2xl mb-8 leading-relaxed text-center lg:text-left">
              Discover the top-rated tools in the {category} landscape, vetted and ranked by the Muslim Hunt community for efficiency and ethical standards.
            </p>
            
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2">Quick jump:</span>
              {['Spirituality', 'Productivity', 'Finance'].map(tag => (
                <button 
                  key={tag} 
                  onClick={() => onCategorySelect(tag)}
                  className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-full text-xs font-bold text-gray-600 hover:bg-emerald-50 hover:text-emerald-800 transition-all active:scale-95"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Logo Cluster */}
          <div className="hidden lg:block relative w-72 h-64 shrink-0 mt-8">
            {clusterLogos.map((logo) => (
              <LogoIcon key={logo.name} logo={logo} />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main List Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-blue-50/70 border border-blue-100 rounded-[2rem] p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <Sparkles className="w-12 h-12 text-blue-800" />
              </div>
              <div className="flex items-center gap-2 mb-4">
                <div className="px-2 py-0.5 bg-blue-800 text-white rounded text-[9px] font-black uppercase tracking-tighter shadow-sm">AI Analysis</div>
                <h2 className="text-sm font-black text-blue-900 uppercase tracking-widest">Community Insights</h2>
              </div>
              <p className="text-blue-900/80 text-[15px] leading-relaxed font-medium">
                Our community is currently highlighting high-performance {category} solutions that prioritize privacy, ethical data handling, and local-first processing in 2025.
              </p>
            </div>

            <div ref={listTopRef} className="scroll-mt-24">
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Top reviewed {category}</h2>
              
              <div className="space-y-4">
                {displayedProducts.map((p, i) => {
                  const rank = ((currentPage - 1) * ITEMS_PER_PAGE) + i + 1;
                  const rating = (4.5 + Math.random() * 0.5).toFixed(1);
                  const reviewCount = Math.floor(Math.random() * 5000) + 100;
                  const usedByCount = Math.floor(Math.random() * 2000) + 500;

                  return (
                    <div 
                      key={p.id}
                      onClick={() => onProductClick(p)}
                      className="group bg-white border border-gray-100 rounded-[2rem] p-6 hover:border-emerald-200 hover:bg-gray-50/40 transition-all cursor-pointer shadow-sm relative"
                    >
                      <div className="flex items-start gap-6">
                        {/* RANKING NUMBER */}
                        <div className="w-10 shrink-0 text-4xl font-serif italic text-gray-100 group-hover:text-emerald-800/30 transition-colors pt-1">
                          {rank}.
                        </div>

                        {/* APP ICON */}
                        <div className="w-16 h-16 rounded-2xl overflow-hidden border border-emerald-100/50 bg-white shrink-0 shadow-sm group-hover:shadow-md transition-all">
                          <SafeImage src={p.logo_url} alt={p.name} seed={p.name} className="w-full h-full" />
                        </div>

                        {/* CONTENT AREA */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-800 transition-colors tracking-tight leading-none">{p.name}</h3>
                            <div className="flex items-center gap-1.5 text-yellow-500">
                              <Star className="w-3.5 h-3.5 fill-current" />
                              <span className="text-xs font-black text-gray-900">{rating}</span>
                              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest hidden sm:inline">({(reviewCount / 1000).toFixed(1)}k reviews)</span>
                            </div>
                          </div>
                          <p className="text-gray-500 text-sm font-medium mb-3 leading-snug line-clamp-1">{p.tagline}</p>
                          
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-y-3 pt-3 border-t border-gray-50 mt-1">
                            <div className="flex items-center gap-2">
                              <div className="flex -space-x-2 overflow-hidden">
                                {PROOF_ICONS.map((src, idx) => (
                                  <div key={idx} className="inline-block h-5 w-5 rounded-full ring-2 ring-white overflow-hidden bg-white">
                                    <img src={src} alt="user" className="w-full h-full object-cover" />
                                  </div>
                                ))}
                              </div>
                              <div className="text-[11px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                                <span>Used by <span className="text-emerald-800">{usedByCount.toLocaleString()}</span> makers</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <div className="px-2 py-0.5 bg-gray-100 text-gray-400 rounded text-[9px] font-black uppercase tracking-tighter flex items-center gap-1"><Monitor className="w-2.5 h-2.5" />mac</div>
                              <div className="px-2 py-0.5 bg-gray-100 text-gray-400 rounded text-[9px] font-black uppercase tracking-tighter flex items-center gap-1"><Smartphone className="w-2.5 h-2.5" />ios</div>
                              <div className="px-2 py-0.5 bg-gray-100 text-gray-400 rounded text-[9px] font-black uppercase tracking-tighter flex items-center gap-1"><Globe className="w-2.5 h-2.5" />web</div>
                            </div>
                          </div>
                        </div>

                        {/* REFACTORED BADGE SYSTEM - REPLACES UPVOTE TRIANGLE */}
                        <div className="flex gap-1.5 ml-auto shrink-0 pt-1">
                          {p.badges && p.badges.length > 0 ? (
                            p.badges.map((badge, idx) => (
                              <ProductBadge key={idx} badge={badge} />
                            ))
                          ) : (
                            <button 
                              onClick={(e) => { e.stopPropagation(); onUpvote(p.id); }}
                              className={`flex flex-col items-center justify-center min-w-[3.5rem] h-14 rounded-xl border-2 transition-all active:scale-95 shadow-sm ${
                                hasUpvoted(p.id) ? 'bg-emerald-800 border-emerald-800 text-white shadow-lg' : 'bg-white border-gray-100 text-gray-400 hover:border-emerald-800 hover:text-emerald-800'
                              }`}
                            >
                              <Triangle className={`w-3.5 h-3.5 mb-0.5 ${hasUpvoted(p.id) ? 'fill-white' : ''}`} />
                              <span className="text-[11px] font-black">{p.upvotes_count}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                  <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="p-3 text-gray-400 hover:text-emerald-800 disabled:opacity-20 transition-all rounded-xl hover:bg-emerald-50"><ChevronLeft className="w-5 h-5" /></button>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button key={i} onClick={() => handlePageChange(i + 1)} className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-black transition-all ${currentPage === i + 1 ? 'bg-emerald-800 text-white shadow-lg shadow-emerald-900/20 scale-110 z-10' : 'text-gray-400 hover:text-emerald-800 hover:bg-emerald-50'}`}>{i + 1}</button>
                  ))}
                  <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-3 text-gray-400 hover:text-emerald-800 disabled:opacity-20 transition-all rounded-xl hover:bg-emerald-50"><ChevronRight className="w-5 h-5" /></button>
                </div>
              )}
            </div>
          </div>
          <CategorySidebar activeCategory={category} onCategorySelect={onCategorySelect} />
        </div>
      </div>
    </div>
  );
};

export default CategoryDetail;