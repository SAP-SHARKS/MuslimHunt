
import React, { useMemo } from 'react';
import { 
  Smartphone, Monitor, Palette, Briefcase, Music, 
  Gamepad2, Code, ShieldCheck, Heart, Users, Star, 
  Hash, ChevronRight, ChevronDown, Award
} from 'lucide-react';
import { Product } from '../types';
import SafeImage from './SafeImage.tsx';
import { slugify } from '../utils/searchUtils';

interface ProductDirectoryProps {
  products: Product[];
  activeTag: string;
  onTagSelect: (tag: string) => void;
  onProductClick: (product: Product) => void;
}

const LAUNCH_TAGS = [
  { name: 'Android', icon: Smartphone, subtags: ['Google Play', 'Mobile Apps'] },
  { name: 'Apple', icon: Smartphone, subtags: ['iOS', 'macOS', 'SwiftUI'] },
  { name: 'Art', icon: Palette, subtags: ['Digital Art', 'Photography'] },
  { name: 'Business', icon: Briefcase, subtags: ['Finance', 'CRM'] },
  { name: 'Education', icon: Hash, subtags: ['Learning', 'Coding'] },
  { name: 'Games', icon: Gamepad2, subtags: ['Indie', 'Mobile Games'] },
  { name: 'Productivity', icon: Code, subtags: ['Tasks', 'Calendar'] }
];

const ProductDirectory: React.FC<ProductDirectoryProps> = ({ 
  products, 
  activeTag, 
  onTagSelect, 
  onProductClick 
}) => {
  const currentMonth = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date());
  const currentYear = new Date().getFullYear();

  const filteredProducts = useMemo(() => {
    if (!activeTag) return products;
    return products.filter(p => 
      slugify(p.category) === activeTag || 
      slugify(p.name).includes(activeTag) ||
      slugify(p.tagline).includes(activeTag)
    );
  }, [products, activeTag]);

  const activeTagName = useMemo(() => {
    if (!activeTag) return 'All';
    const found = LAUNCH_TAGS.flatMap(t => [t.name, ...t.subtags]).find(n => slugify(n) === activeTag);
    return found || activeTag;
  }, [activeTag]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 flex flex-col lg:grid lg:grid-cols-[240px_1fr] gap-12 items-start">
      
      {/* Sidebar: Desktop Only */}
      <aside className="hidden lg:block w-full sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar">
        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-6 px-3">
          Launch tags
        </h3>
        <nav className="space-y-1">
          {LAUNCH_TAGS.map((tag) => {
            const isMainActive = slugify(tag.name) === activeTag;
            const hasActiveSub = tag.subtags.some(s => slugify(s) === activeTag);
            
            return (
              <div key={tag.name} className="space-y-0.5">
                <button
                  onClick={() => onTagSelect(tag.name)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[13px] font-bold transition-all ${
                    isMainActive || hasActiveSub
                      ? 'bg-emerald-50 text-emerald-900' 
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <tag.icon size={16} className={isMainActive || hasActiveSub ? 'text-emerald-800' : 'text-gray-300'} />
                    {tag.name}
                  </div>
                  {(isMainActive || hasActiveSub) && <ChevronDown size={14} className="text-emerald-800" />}
                </button>
                
                {(isMainActive || hasActiveSub) && (
                  <div className="ml-9 space-y-0.5 pt-0.5 pb-2">
                    {tag.subtags.map(sub => (
                      <button
                        key={sub}
                        onClick={() => onTagSelect(sub)}
                        className={`w-full text-left py-1 text-[12px] font-medium transition-colors ${
                          slugify(sub) === activeTag 
                            ? 'text-emerald-800 font-bold' 
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="w-full space-y-8">
        <header className="border-b border-gray-100 pb-8">
          <div className="flex items-center gap-3 text-emerald-800 mb-2">
            <Award size={16} className="fill-emerald-800" />
            <span className="text-[10px] font-black uppercase tracking-widest">Featured Directory</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-serif font-bold text-emerald-900 mb-2 tracking-tight capitalize">
            Best {activeTagName} products of {currentMonth} {currentYear}
          </h1>
          <p className="text-gray-400 text-sm font-medium">
            Discovering {filteredProducts.length} {activeTagName} tools vetted for the community.
          </p>
        </header>

        {/* Product List */}
        <div className="space-y-4">
          {filteredProducts.length === 0 ? (
            <div className="py-24 text-center bg-white border border-dashed border-gray-100 rounded-[3rem]">
              <Hash className="w-12 h-12 text-gray-100 mx-auto mb-4" />
              <p className="text-gray-500 font-bold text-lg">No products found for "{activeTagName}".</p>
              <button onClick={() => onTagSelect('')} className="mt-4 text-emerald-800 font-black text-xs uppercase tracking-widest hover:underline">
                View all launches
              </button>
            </div>
          ) : (
            filteredProducts.map((p, i) => (
              <div 
                key={p.id}
                onClick={() => onProductClick(p)}
                className="group flex items-center justify-between p-6 bg-white border border-gray-100 rounded-[2rem] hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-900/5 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-6">
                  {/* Rank */}
                  <span className="w-8 text-[22px] font-serif italic text-gray-200 group-hover:text-emerald-800/20 transition-colors">
                    {i + 1}.
                  </span>
                  
                  {/* Large Logo (64x64) */}
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border border-emerald-50 shrink-0 shadow-sm">
                    <SafeImage src={p.logo_url} alt={p.name} seed={p.name} className="w-full h-full" />
                  </div>
                  
                  <div className="min-w-0">
                    <h3 className="text-[18px] font-bold text-gray-900 group-hover:text-emerald-800 transition-colors tracking-tight leading-snug">
                      {p.name}
                    </h3>
                    <p className="text-gray-500 text-[14px] line-clamp-1 font-medium tracking-tight mb-2">
                      {p.tagline}
                    </p>
                    <div className="flex items-center gap-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                      <div className="flex items-center gap-1.5">
                        <Users size={12} className="text-emerald-800 opacity-40" />
                        <span>{p.upvotes_count || 0} followers</span>
                      </div>
                      <span className="text-gray-200">•</span>
                      <div className="flex items-center gap-1.5">
                        <Star size={12} className="text-amber-400 fill-amber-400" />
                        <span>4.8 rating</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <button 
                    onClick={(e) => { e.stopPropagation(); }}
                    className="px-8 py-3 bg-white border border-gray-200 rounded-2xl text-[13px] font-black text-gray-700 hover:border-emerald-800 hover:text-emerald-800 hover:bg-emerald-50 transition-all active:scale-95 shadow-sm"
                  >
                    Follow
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDirectory;
