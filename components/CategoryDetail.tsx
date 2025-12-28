import React, { useEffect, useState, useRef } from 'react';
import { Sparkles, ChevronRight, Star, Monitor, Smartphone, Triangle, Users, ChevronLeft } from 'lucide-react';
import { Product } from '../types.ts';
import CategorySidebar from './CategorySidebar.tsx';

// Alias for specific use case within the component
const AndroidIcon = Smartphone;

interface CategoryDetailProps {
  onBack: () => void;
  onProductClick: (p: Product) => void;
  onUpvote: (id: string) => void;
  hasUpvoted: (id: string) => boolean;
  onCategorySelect: (category: string) => void;
}

const POSTS_PER_PAGE = 10;

// High-fidelity mock data for AI Notetakers
const MOCK_AI_NOTETAKERS: Product[] = Array.from({ length: 25 }).map((_, i) => ({
  id: `n${i + 1}`,
  name: i === 0 ? 'Fathom' : i === 1 ? 'Notion AI' : i === 2 ? 'tl;dv' : i === 3 ? 'Fireflies.ai' : `AI Notetaker ${i + 1}`,
  tagline: i === 0 ? 'The free AI Notetaker for Zoom, MS Teams, and Google Meet.' : 
           i === 1 ? 'Write faster, think bigger, and augment your creativity.' : 
           i === 2 ? 'AI Meeting Recorder for Google Meet and Zoom.' : 
           i === 3 ? 'Automate your meeting notes and insights.' :
           `Revolutionizing meeting efficiency with advanced transcription.`,
  description: 'A professional AI tool designed to handle meeting transcription and summarization with high accuracy.',
  logo_url: i === 0 ? 'https://ph-files.imgix.net/70b77764-28b3-4674-89c8-77119024c084.png?auto=format&w=80' : 
            i === 1 ? 'https://ph-files.imgix.net/1359c3d4-b788-4f81-9b7e-9669530b127f.png?auto=format&w=80' : 
            i === 2 ? 'https://ph-files.imgix.net/d77291a2-6323-4556-912b-3c3588972e2d.png?auto=format&w=80' : 
            i === 3 ? 'https://ph-files.imgix.net/9595861b-9364-42da-9104-e74f67606b2d.png?auto=format&w=80' :
            `https://api.dicebear.com/7.x/initials/svg?seed=AI${i}&backgroundColor=064e3b`,
  created_at: new Date().toISOString(),
  url: '#',
  founder_id: `maker_${i}`,
  category: 'Productivity',
  upvotes_count: 2500 - (i * 45),
  halal_status: 'Certified',
  comments: []
}));

const CLUSTER_LOGOS = [
  { name: 'Notion', src: 'https://ph-files.imgix.net/1359c3d4-b788-4f81-9b7e-9669530b127f.png?auto=format&w=80', className: 'top-0 left-0 w-20 h-20 rotate-[-10deg] z-10' },
  { name: 'Fathom', src: 'https://ph-files.imgix.net/70b77764-28b3-4674-89c8-77119024c084.png?auto=format&w=80', className: 'top-4 right-0 w-16 h-16 rotate-[12deg] z-20' },
  { name: 'Granola', src: 'https://ph-files.imgix.net/37b120f2-7f2a-43f1-9307-e819b168697c.png?auto=format&w=80', className: 'bottom-0 left-4 w-18 h-18 rotate-[5deg] z-10' },
  { name: 'Fireflies', src: 'https://ph-files.imgix.net/9595861b-9364-42da-9104-e74f67606b2d.png?auto=format&w=80', className: 'bottom-4 right-4 w-20 h-20 rotate-[-8deg] z-30' },
  { name: 'tl;dv', src: 'https://ph-files.imgix.net/d77291a2-6323-4556-912b-3c3588972e2d.png?auto=format&w=80', className: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rotate-[15deg] z-40' },
  { name: 'Grain', src: 'https://ph-files.imgix.net/3e104192-36c5-47e1-8f5f-f3f26017b203.png?auto=format&w=80', className: 'top-12 left-24 w-16 h-16 rotate-[-5deg] z-20 shadow-2xl' },
];

const LogoIcon: React.FC<{ logo: typeof CLUSTER_LOGOS[0] }> = ({ logo }) => {
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

const CategoryDetail: React.FC<CategoryDetailProps> = ({ onBack, onProductClick, onUpvote, hasUpvoted, onCategorySelect }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const listTopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const page = parseInt(params.get('page') || '1', 10);
    setCurrentPage(page);
    window.scrollTo(0, 0);
  }, []);

  const totalPages = Math.ceil(MOCK_AI_NOTETAKERS.length / POSTS_PER_PAGE);
  const displayedProducts = MOCK_AI_NOTETAKERS.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const url = new URL(window.location.href);
    url.searchParams.set('page', page.toString());
    window.history.pushState({}, '', url.toString());
    
    if (listTopRef.current) {
      listTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-10">
          <button onClick={onBack} className="hover:text-emerald-800 transition-colors">Home</button>
          <ChevronRight className="w-3 h-3" />
          <span className="hover:text-emerald-800 cursor-pointer">Product categories</span>
          <ChevronRight className="w-3 h-3" />
          <span className="hover:text-emerald-800 cursor-pointer">Productivity</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-emerald-800">AI notetakers</span>
        </nav>

        {/* Header Section */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-12 mb-16 relative">
          <div className="flex-1">
            <h1 className="text-5xl sm:text-6xl font-serif font-bold text-emerald-900 tracking-tight leading-tight mb-6 text-center lg:text-left">
              The best AI notetakers <br/> to use in 2025
            </h1>
            <p className="text-lg text-gray-500 font-medium max-w-2xl mb-8 leading-relaxed text-center lg:text-left">
              Discover the top-rated AI assistants that record, transcribe, and summarize your meetings automatically.
            </p>
            
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2">Explore related:</span>
              {['Presentation Software', 'Spreadsheets', 'Virtual office platforms'].map(tag => (
                <button key={tag} className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-full text-xs font-bold text-gray-600 hover:bg-emerald-50 hover:text-emerald-800 transition-all">
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden lg:block relative w-72 h-64 shrink-0 mt-8">
            {CLUSTER_LOGOS.map((logo) => (
              <LogoIcon key={logo.name} logo={logo} />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* AI Summary Block */}
            <div className="bg-blue-50/70 border border-blue-100 rounded-[2rem] p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <Sparkles className="w-12 h-12 text-blue-800" />
              </div>
              <div className="flex items-center gap-2 mb-4">
                <div className="px-2 py-0.5 bg-blue-800 text-white rounded text-[9px] font-black uppercase tracking-tighter shadow-sm">AI Analysis</div>
                <h2 className="text-sm font-black text-blue-900 uppercase tracking-widest">Summarized with AI</h2>
              </div>
              <p className="text-blue-900/80 text-[15px] leading-relaxed font-medium">
                Fathom, tl;dv, and Grain dominate for automated recording, crisp transcripts, and shareable summaries. Fathom is preferred for its seamless CRM integration, while Notion AI offers the best post-meeting analysis within your existing workspace.
              </p>
            </div>

            <div ref={listTopRef} className="scroll-mt-24">
              <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Top reviewed AI notetakers</h2>
              
              {/* Ranked List */}
              <div className="space-y-4">
                {displayedProducts.map((p, i) => {
                  const rank = ((currentPage - 1) * POSTS_PER_PAGE) + i + 1;
                  return (
                    <div 
                      key={p.id}
                      onClick={() => onProductClick(p)}
                      className="group bg-white border border-gray-100 rounded-[2rem] p-6 hover:border-emerald-200 hover:bg-gray-50/40 transition-all cursor-pointer"
                    >
                      <div className="flex items-start gap-6">
                        <div className="w-8 shrink-0 text-2xl font-serif italic text-gray-200 group-hover:text-emerald-800/30 pt-1 transition-colors">
                          {rank}.
                        </div>
                        <div className="w-16 h-16 rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 shrink-0 shadow-sm group-hover:shadow-md transition-all">
                          <img src={p.logo_url} className="w-full h-full object-cover" />
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
                          <p className="text-gray-500 text-[13px] font-medium mb-4 leading-snug line-clamp-1">{p.tagline}</p>
                          
                          <div className="flex flex-wrap items-center justify-between gap-y-3 pt-3 border-t border-gray-50 mt-1">
                            <div className="flex items-center gap-2">
                              <Users className="w-3.5 h-3.5 text-gray-400" />
                              <div className="text-[11px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                                <span className="hidden sm:inline">Used by 1,240+:</span>
                                <span className="text-gray-900">Screen Studio, Fireflies...</span>
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

              {/* Pagination Controls */}
              <div className="mt-12 flex items-center justify-center gap-2">
                <button 
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-2 text-gray-400 hover:text-emerald-800 disabled:opacity-20 transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`w-10 h-10 rounded-xl text-sm font-black transition-all ${
                      currentPage === i + 1 
                        ? 'bg-emerald-800 text-white shadow-lg' 
                        : 'text-gray-400 hover:text-emerald-800 hover:bg-emerald-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button 
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 text-gray-400 hover:text-emerald-800 disabled:opacity-20 transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <CategorySidebar 
            activeCategory="AI notetakers"
            onCategorySelect={onCategorySelect}
          />
        </div>
      </div>
    </div>
  );
};

export default CategoryDetail;