
import React from 'react';
import { MessageSquare, Triangle } from 'lucide-react';
import { Product } from '../types';
import SafeImage from './SafeImage.tsx';
import { formatCompactNumber } from '../utils/searchUtils';

interface ProductCardProps {
  product: Product;
  onUpvote: (productId: string) => void;
  hasUpvoted: boolean;
  onClick: (product: Product) => void;
  onCommentClick: (product: Product) => void;
  rank?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onUpvote, 
  hasUpvoted, 
  onClick, 
  onCommentClick,
  rank
}) => {
  const commentCount = product.comments?.length || 0;
  const metadata = [product.category.toUpperCase(), 'WEB', 'FREE'];

  return (
    <div 
      className="group flex items-center justify-between p-4 lg:p-5 bg-white border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-all cursor-pointer"
      onClick={() => onClick(product)}
    >
      <div className="flex items-center gap-4 lg:gap-6 flex-1 min-w-0">
        {/* Sequential Rank Number */}
        {rank !== undefined && (
          <div className="hidden lg:block w-6 shrink-0 text-[18px] font-serif italic text-gray-300 group-hover:text-emerald-800/30 transition-colors">
            {rank}.
          </div>
        )}

        {/* 64x64px Rounded-XL Logo */}
        <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-xl overflow-hidden shrink-0 shadow-sm border border-gray-100">
          <SafeImage 
            src={product.logo_url} 
            alt={product.name} 
            seed={product.name}
            className="w-full h-full" 
          />
        </div>
        
        {/* Title Area */}
        <div className="min-w-0 flex-1">
          <h3 className="text-[16px] lg:text-[17px] font-bold text-gray-900 group-hover:text-emerald-900 transition-colors leading-tight">
            {product.name}
          </h3>
          <p className="text-gray-500 text-[13px] lg:text-[14px] line-clamp-1 mb-1 font-normal tracking-tight">
            {product.tagline}
          </p>
          
          {/* Metadata Tags */}
          <div className="flex items-center gap-2">
            {metadata.map((tag, i) => (
              <React.Fragment key={i}>
                <span className="text-[10px] font-bold text-gray-400 tracking-wider">
                  {tag}
                </span>
                {i < metadata.length - 1 && (
                  <span className="text-[8px] text-gray-300">•</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons (Right) */}
      <div className="flex items-center gap-2 lg:gap-3 shrink-0 ml-4">
        {/* Ghost Style Comment Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCommentClick(product);
          }}
          className="flex flex-col items-center justify-center min-w-[3.5rem] h-12 rounded-xl text-gray-400 hover:text-emerald-800 transition-all active:scale-95"
        >
          <MessageSquare className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] font-bold">{formatCompactNumber(commentCount)}</span>
        </button>

        {/* Bordered Triangle Upvote Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onUpvote(product.id);
          }}
          className={`flex flex-col items-center justify-center min-w-[4rem] h-14 rounded-xl border-2 transition-all shrink-0 active:scale-95 ${
            hasUpvoted 
              ? 'bg-emerald-800 border-emerald-800 text-white shadow-md' 
              : 'bg-white border-gray-100 text-gray-400 hover:border-emerald-700 hover:text-emerald-800'
          }`}
        >
          <Triangle className={`w-3.5 h-3.5 mb-0.5 ${hasUpvoted ? 'fill-white' : ''}`} />
          <span className="text-[11px] font-black">{formatCompactNumber(product.upvotes_count)}</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
