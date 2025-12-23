
import React from 'react';
import { ChevronUp, MessageSquare } from 'lucide-react';
import { Product } from '../types';
import { highlightSearchTerm } from '../utils/searchUtils';

interface ProductCardProps {
  product: Product;
  onUpvote: (productId: string) => void;
  hasUpvoted: boolean;
  onClick: (product: Product) => void;
  onCommentClick: (product: Product) => void;
  searchQuery?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onUpvote, 
  hasUpvoted, 
  onClick, 
  onCommentClick,
  searchQuery = '' 
}) => {
  const highlightedName = highlightSearchTerm(product.name, searchQuery);
  const highlightedTagline = highlightSearchTerm(product.tagline, searchQuery);
  const commentCount = product.comments?.length || 0;

  return (
    <div 
      className="group flex items-center justify-between p-4 bg-white border border-transparent hover:border-emerald-100 hover:bg-emerald-50/30 rounded-xl transition-all cursor-pointer"
      onClick={() => onClick(product)}
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="w-14 h-14 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-100">
          <img src={product.logo_url} alt={product.name} className="w-full h-full object-cover" />
        </div>
        
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 
              className="text-lg font-bold text-gray-900 group-hover:text-emerald-800 transition-colors"
              dangerouslySetInnerHTML={{ __html: highlightedName }}
            />
            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full font-medium uppercase tracking-wider">
              {product.category}
            </span>
          </div>
          <p 
            className="text-gray-600 text-sm line-clamp-1"
            dangerouslySetInnerHTML={{ __html: highlightedTagline }}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCommentClick(product);
          }}
          className="flex flex-col items-center justify-center min-w-[3.5rem] h-14 rounded-lg border border-transparent hover:border-gray-200 hover:bg-white text-gray-400 hover:text-emerald-800 transition-all"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-1">{commentCount}</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onUpvote(product.id);
          }}
          className={`flex flex-col items-center justify-center w-14 h-14 rounded-lg border-2 transition-all shrink-0 ${
            hasUpvoted 
              ? 'bg-emerald-800 border-emerald-800 text-white' 
              : 'bg-white border-gray-200 text-gray-500 hover:border-emerald-800 hover:text-emerald-800 shadow-sm'
          }`}
        >
          <ChevronUp className={`w-5 h-5 ${hasUpvoted ? 'animate-bounce' : ''}`} />
          <span className="text-xs font-bold leading-none mt-1">{product.upvotes_count}</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
