
import React from 'react';
import { ChevronUp, MessageSquare, Triangle } from 'lucide-react';
import { Product } from '../types';
import { highlightSearchTerm } from '../utils/searchUtils';
import SafeImage from './SafeImage.tsx';

interface ProductCardProps {
  product: Product;
  onUpvote: (productId: string) => void;
  hasUpvoted: boolean;
  onClick: (product: Product) => void;
  onCommentClick: (product: Product) => void;
  searchQuery?: string;
  rank?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onUpvote, 
  hasUpvoted, 
  onClick, 
  onCommentClick,
  searchQuery = '',
  rank
}) => {
  const highlightedName = highlightSearchTerm(product.name, searchQuery);
  const highlightedTagline = highlightSearchTerm(product.tagline, searchQuery);
  const commentCount = product.comments?.length || 0;

  // Mock tags for professional aesthetic
  const tags = [product.category, 'Web', 'Free'];
  
  // Access profile information from the relational join
  const makerUsername = (product as any).profiles?.username;

  return (
    <div 
      className="group flex items-center justify-between p-5 bg-white border-b border-gray-50 last:border-0 hover:bg-emerald-50/20 transition-all cursor-pointer"
      onClick={() => onClick(product)}
    >
      <div className="flex items-center gap-5 flex-1 min-w-0">
        {/* Ranking Number */}
        {rank !== undefined && (
          <div className="hidden sm:flex w-6 shrink-0 text-lg font-serif italic text-gray-300 group-hover:text-emerald-800/30 transition-colors">
            {rank}.
          </div>
        )}

        {/* Logo Container with High-Fidelity Border */}
        <div className="w-16 h-16 rounded-xl overflow-hidden border border-emerald-100/50 shadow-sm group-hover:shadow-md transition-all">
          <SafeImage 
            src={product.logo_url} 
            alt={product.name} 
            seed={product.name}
            className="w-full h-full" 
          />
        </div>
        
        {/* Info Area */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 
              className="text-[17px] font-bold text-gray-900 group-hover:text-emerald-800 transition-colors leading-snug tracking-tight"
              dangerouslySetInnerHTML={{ __html: highlightedName }}
            />
            {makerUsername && (
              <span className="text-[10px] text-gray-400 font-medium">by @{makerUsername}</span>
            )}
          </div>
          <p 
            className="text-gray-500 text-[13px] line-clamp-1 mb-2 font-medium tracking-tight"
            dangerouslySetInnerHTML={{ __html: highlightedTagline }}
          />
          
          {/* Tags List */}
          <div className="flex items-center gap-2 overflow-hidden">
            {tags.map((tag, i) => (
              <React.Fragment key={tag}>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter whitespace-nowrap">
                  {tag}
                </span>
                {i < tags.length - 1 && (
                  <span className="text-[8px] text-gray-300">•</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons (Right Side) */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0 ml-4">
        {/* Comment Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCommentClick(product);
          }}
          className="flex flex-col items-center justify-center min-w-[3rem] h-14 rounded-xl border border-transparent hover:border-emerald-100 hover:bg-white text-gray-400 hover:text-emerald-800 transition-all active:scale-95"
        >
          <MessageSquare className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] font-black tracking-tighter">{commentCount}</span>
        </button>

        {/* Upvote Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onUpvote(product.id);
          }}
          className={`flex flex-col items-center justify-center min-w-[3.5rem] h-14 rounded-xl border-2 transition-all shrink-0 active:scale-95 ${
            hasUpvoted 
              ? 'bg-emerald-800 border-emerald-800 text-white shadow-lg shadow-emerald-900/20' 
              : 'bg-white border-gray-100 text-gray-400 hover:border-emerald-800 hover:text-emerald-800 hover:shadow-sm'
          }`}
        >
          <Triangle className={`w-3.5 h-3.5 mb-0.5 ${hasUpvoted ? 'fill-white' : ''}`} />
          <span className="text-[11px] font-black tracking-tighter">{product.upvotes_count}</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
