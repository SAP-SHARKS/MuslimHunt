import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Sparkles, ChevronRight, Star, Triangle, Users, ChevronLeft, ArrowRight, Loader2 } from 'lucide-react';
import { Product } from '../types.ts';
import CategorySidebar from './CategorySidebar.tsx';

interface CategoryDetailProps {
  category: string;
  products: Product[];
  onBack: () => void;
  onProductClick: (p: Product) => void;
  onUpvote: (id: string) => void;
  hasUpvoted: (id: string) => boolean;
  onCategorySelect: (category: string) => void;
}

const POSTS_PER_PAGE = 10;

/**
 * CORE BRAND ASSETS
 */
const NICHE_LOGOS: Record<string, { name: string, src: string }[]> = {
  'ai notetakers': [
    { name: 'Notion', src: 'https://logo.clearbit.com/notion.so' },
    { name: 'Fathom', src: 'https://logo.clearbit.com/fathom.video' },
    { name: 'Granola', src: 'https://logo.clearbit.com/granola.ai' },
    { name: 'Fireflies.ai', src: 'https://logo.clearbit.com/fireflies.ai' },
    { name: 'tl;dv', src: 'https://logo.clearbit.com/tldv.io' },
    { name: 'Grain', src: 'https://logo.clearbit.com/grain.com' }
  ],
  'ai meeting notetakers': [
    { name: 'Notion', src: 'https://logo.clearbit.com/notion.so' },
    { name: 'Fathom', src: 'https://logo.clearbit.com/fathom.video' },
    { name: 'Granola', src: 'https://logo.clearbit.com/granola.ai' },
    { name: 'Fireflies.ai', src: 'https://logo.clearbit.com/fireflies.ai' },
    { name: 'tl;dv', src: 'https://logo.clearbit.com/tldv.io' },
    { name: 'Grain', src: 'https://logo.clearbit.com/grain.com' }
  ]
};

const PARENT_MAP: Record<string, string> = {
  'ai notetakers': 'Productivity',
  'ai meeting notetakers': 'Productivity',
  'app switcher': 'Productivity',
  'compliance software': 'Productivity',
  'email clients': 'Productivity',
  'knowledge base': 'Productivity',
  'ai coding agents': 'Engineering',
  'vibe coding tools': 'Engineering',
  'ai headshot generators': 'Design',
  'zakat calculators': 'Finance',
};

// Mock "Used by" proofing icons
const PROOF_ICONS = [
  'https://logo.clearbit.com/cursor.com',
  'https://logo.clearbit.com/vercel.com',
  'https://logo.clearbit.com/linear.app',
  'https://logo.clearbit.com/slack.com'
];

const LogoIcon: React.FC<{ logo: { name: string, src: string, className: string } }> = ({ logo }) => {
  const [imgSrc, setImgSrc] = useState(logo.src);
  const fallbackUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(logo.name)}&backgroundColor=064e3b&fontFamily=serif&fontWeight=700`;

  return (
    <div className={`absolute bg-white rounded-2xl shadow-xl p-2 border border-gray-100 transition-all duration-300 hover:scale-110 hover:z-[50] cursor-pointer group/logo ${logo.className}`}>
      <img 
        src={imgSrc} 
        alt={logo.name} 
        className="w-full h-full object-contain rounded-lg transition-transform duration-300 group-hover/logo:scale-105"
        onError={() => setImgSrc(fallbackUrl)}
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

  // Handle URL sync for pagination
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pageParam = parseInt(params.get('page') || '1', 10);
    setCurrentPage(pageParam);
  }, [category]);

  const categoryProducts = useMemo(() => {
    if (!normalizedCategory) return [];
    return products
      .filter(p => p.category?.toLowerCase() === normalizedCategory)
      .sort((a, b) => (b.upvotes_count || 0) - (a.upvotes_count || 0));
  }, [products, normalizedCategory]);

  const totalPages = Math.ceil(categoryProducts.length / POSTS_PER_PAGE);
  const displayedProducts = useMemo(() => {
    const start = (currentPage - 1) * POSTS_PER_PAGE;
    return categoryProducts.slice(start, start + POSTS_PER_PAGE);
  }, [categoryProducts, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const params = new URLSearchParams(window.location.search);
    params.set('page', page.toString());
    const newPath = window.location.pathname + '?' + params.toString();
    window.history.pushState({}, '', newPath);

    if (listTopRef.current) {
      listTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const clusterLogos = useMemo(() => {
    const nicheLogos = NICHE_LOGOS[normalizedCategory];
    const sourceLogos = nicheLogos || categoryProducts.slice(0, 6).map(p => ({ name: p.name, src: p.logo_url }));
    
    const positions = [
      'top-0 right-10 w-16 h-16 rotate-[-12deg] z-10',
      'top-4 right-0 w-14 h-14 rotate-[12deg] z-20',
      'bottom-0 left-4 w-18 h-18 rotate-[8deg] z-10',
      'bottom-4 right-4 w-16 h-16 rotate-[-8deg] z-30',
      'top-1/2 right-12 -translate-y-1/2 w-14 h-14 rotate-[15deg] z-40',
      'top-10 right-28 w-14 h-14 rotate-[-5deg] z-20'
    ];

    return sourceLogos.slice(0, 6).map((logo, i) => ({
      name: logo.name,
      src: logo.src,
      className: positions[i] || positions[0]
    }));
  }, [categoryProducts, normalizedCategory]);

  const parentCategory = PARENT_MAP[normalizedCategory] || "Software";

  if (!category) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 bg-white">
        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
          <Loader2 className="w-8 h-8 text-emerald-800 animate-spin" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-emerald-900 mb-2 tracking-tight">Loading Directory...</h2>
        <button onClick={onBack} className="text-emerald-800 font-bold hover:underline flex items-center gap-2">
          <ChevronLeft className="w-4 h-4" /> Return to Home
        </button>
      </div>
    );
  }

  const isNotetakers = normalizedCategory.includes('notetaker');

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8">
        <nav className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-10">
          <button onClick={onBack} className="hover:text-emerald-800 transition-colors">Home</button>
          <ChevronRight className="w-3 h-3" />
          <span onClick={onBack} className="hover:text-emerald-800 cursor-pointer">Product categories</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-400 cursor-default">{parentCategory}</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-emerald-800 capitalize">{category}</span>
        </nav>

        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-12 mb-16 relative">
          <div className="flex-1">
            <h1 className="text-5xl sm:text-6xl font-serif font-bold text-emerald-900 tracking-tight leading-tight mb-6 text-center lg:text-left capitalize">
              The best {category} <br/> to use in 2025
            </h1>
            <p className="text-lg text-gray-500 font-medium max-w-2xl mb-8 leading-relaxed text-center lg:text-left">
              Discover the top-rated tools in the {category} landscape, vetted and ranked by the Muslim Hunt community for efficiency and ethical standards.
            </p>
            
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2">Explore related:</span>
              {['Presentation Software', 'Spreadsheets', 'Virtual office'].map(tag => (
                <button 
                  key={tag} 
                  onClick={() => onCategorySelect(tag)}
                  className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-full text-xs font-bold text-gray-600 hover:bg-emerald-50 hover:text-emerald-800 transition-all"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden lg:block relative w-48 h-48 shrink-0 mt-8">
            {clusterLogos.map((logo) => (
              <LogoIcon key={logo.name} logo={logo} />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-blue-50/70 border border-blue-100 rounded-[2rem] p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <Sparkles className="w-12 h-12 text-blue-800" />
              </div>
              <div className="flex items-center gap-2 mb-4">
                <div className="px-2 py-0.5 bg-blue-800 text-white rounded text-[9px] font-black uppercase tracking-tighter shadow-sm">AI Analysis</div>
                <h2 className="text-sm font-black text-blue-900 uppercase tracking-widest">Summarized with AI</h2>
              </div>
              <p className="text-blue-900/80 text-[15px] leading-relaxed font-medium">
                {isNotetakers 
                  ? "Fathom, tl;dv, and Grain dominate for automated recording, crisp transcripts, and shareable summaries. Our community highlights Otter for its real-time dictation speed, while Fireflies excels in multi-language support and CRM integration."
                  : `Our community is currently vetting ${category} solutions. Key trends we're seeing include better privacy protections and automated cross-platform syncing.`}
              </p>
            </div>

            <div ref={listTopRef} className="scroll-mt-24">
              <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Top reviewed {category}</h2>
              
              <div className="space-y-4">
                {displayedProducts.map((p, i) => {
                  const rank = ((currentPage - 1) * POSTS_PER_PAGE) + i + 1;
                  return (
                    <div 
                      key={p.id}
                      onClick={() => onProductClick(p)}
                      className="group bg-white border border-gray-100 rounded-[2rem] p-6 hover:border-emerald-200 hover:bg-gray-50/40 transition-all cursor-pointer shadow-sm"
                    >
                      <div className="flex items-start gap-6">
                        <div className="w-8 shrink-0 text-3xl font-serif italic text-gray-200 group-hover:text-emerald-800 transition-colors pt-1">
                          {rank}.
                        </div>
                        <div className="w-16 h-16 rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 shrink-0 shadow-sm group-hover:shadow-md transition-all">
                          <img src={p.logo_url} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-800 transition-colors tracking-tight">{p.name}</h3>
                            <div className="flex items-center gap-1.5 text-yellow-500">
                              <Star className="w-3.5 h-3.5 fill-current" />
                              <span className="text-xs font-black text-gray-900">4.8</span>
                              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">(2.4k reviews)</span>
                            </div>
                          </div>
                          <p className="text-gray-500 text-[13px] font-medium mb-3 leading-snug line-clamp-1">{p.tagline}</p>
                          
                          {/* SOCIAL PROOF & PLATFORMS */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-y-3 pt-3 border-t border-gray-50 mt-1">
                            <div className="flex items-center gap-2">
                              <div className="flex -space-x-1.5 overflow-hidden">
                                {PROOF_ICONS.slice(0, 3).map((src, idx) => (
                                  <img key={idx} className="inline-block h-4 w-4 rounded-full ring-2 ring-white" src={src} alt="" />
                                ))}
                              </div>
                              <div className="text-[11px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                                <span className="hidden sm:inline">Used by {Math.floor(Math.random() * 500) + 100}:</span>
                                <span className="text-gray-900">Cursor, Vercel, Linear</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                              {['mac', 'ios', 'android'].map(platform => (
                                <div key={platform} className="px-1.5 py-0.5 bg-gray-100 text-gray-400 rounded text-[9px] font-black uppercase tracking-tighter">
                                  {platform}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <button 
                          onClick={(e) => { e.stopPropagation(); onUpvote(p.id); }}
                          className={`flex flex-col items-center justify-center min-w-[3.5rem] h-14 rounded-xl border-2 transition-all active:scale-95 shadow-sm ${
                            hasUpvoted(p.id) ? 'bg-emerald-800 border-emerald-800 text-white' : 'bg-white border-gray-100 text-gray-400 hover:border-emerald-800 hover:text-emerald-800'
                          }`}
                        >
                          <Triangle className={`w-3.5 h-3.5 mb-0.5 ${hasUpvoted(p.id) ? 'fill-white' : ''}`} />
                          <span className="text-[11px] font-black">{p.upvotes_count}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* PAGINATION FOOTER */}
              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                  <button 
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 text-gray-400 hover:text-emerald-800 disabled:opacity-20 transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <a
                      key={i}
                      href={`?page=${i + 1}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(i + 1);
                      }}
                      className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-black transition-all ${
                        currentPage === i + 1 
                          ? 'bg-emerald-800 text-white shadow-lg shadow-emerald-900/20' 
                          : 'text-gray-400 hover:text-emerald-800 hover:bg-emerald-50'
                      }`}
                    >
                      {i + 1}
                    </a>
                  ))}

                  <button 
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 text-gray-400 hover:text-emerald-800 disabled:opacity-20 transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <CategorySidebar 
            activeCategory={category}
            onCategorySelect={onCategorySelect}
          />
        </div>
      </div>
    </div>
  );
};

export default CategoryDetail;