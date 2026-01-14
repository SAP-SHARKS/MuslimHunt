
import React from 'react';
import { ChevronUp, MessageSquare, Triangle } from 'lucide-react';
import { Product } from '../types';
import { highlightSearchTerm, slugify } from '../utils/searchUtils';
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
  const productSlug = slugify(product.name);

  // Mock tags for professional aesthetic
  const tags = [product.category, 'Web', 'Free'];

  return (
    <a
      href={`/products/${productSlug}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start justify-between p-6 bg-white border-b border-gray-100 last:border-0 hover:bg-primary-light/10 transition-all cursor-pointer no-underline block"
      onClick={(e) => {
        // Default anchor behavior handles new tab
      }}
    >
      <div className="flex items-start gap-5 flex-1 min-w-0">
        {/* Logo Container */}
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden border border-primary-light/50 shadow-sm group-hover:shadow-md transition-all shrink-0 mt-1">
          <SafeImage
            src={product.logo_url}
            alt={product.name}
            seed={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info Area */}
        <div className="min-w-0 flex-1 pt-0.5">
          <h3
            className="text-[16px] font-bold text-gray-900 group-hover:text-primary transition-colors leading-snug tracking-tight mb-1"
            dangerouslySetInnerHTML={{ __html: highlightedName }}
          />
          <p
            className="text-gray-500 text-[13px] line-clamp-2 sm:line-clamp-1 mb-3 font-medium tracking-tight leading-relaxed"
            dangerouslySetInnerHTML={{ __html: highlightedTagline }}
          />

          {/* Tags List (Links) */}
          <div className="flex items-center gap-2 overflow-hidden flex-wrap">
            {/* Main Category */}
            <a
              href={`/topics/${slugify(product.category)}`}
              onClick={(e) => e.stopPropagation()}
              className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter hover:text-primary hover:underline transition-colors block"
            >
              {product.category}
            </a>

            {/* Additional Tags */}
            {['Web', 'Free'].map((tag) => (
              <React.Fragment key={tag}>
                <span className="text-[8px] text-gray-300">•</span>
                <a
                  href={`/topics/${slugify(tag)}`}
                  onClick={(e) => e.stopPropagation()}
                  className="text-[10px] font-bold text-accent uppercase tracking-tighter hover:text-accent-hover hover:underline transition-colors block"
                >
                  {tag}
                </a>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons (Right Side) - Vertical Stack */}
      <div className="flex items-center gap-3 shrink-0 ml-4 pt-1">
        {/* Comment Button (Vertical) */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onCommentClick(product);
          }}
          className="flex flex-col items-center justify-center w-[50px] h-[64px] border border-gray-100 rounded-xl hover:border-primary-light hover:bg-white text-gray-400 hover:text-primary transition-all active:scale-95 bg-transparent"
        >
          <MessageSquare className="w-5 h-5 mb-1.5" />
          <span className="text-[12px] font-bold tracking-tight text-gray-900">{commentCount}</span>
        </button>

        {/* Upvote Button (Vertical) */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onUpvote(product.id);
          }}
          className={`flex flex-col items-center justify-center w-[50px] h-[64px] border rounded-xl transition-all shrink-0 active:scale-95 ${hasUpvoted
              ? 'bg-white border-primary text-primary shadow-sm'
              : 'bg-white border-gray-200 text-gray-500 hover:border-primary hover:text-primary'
            }`}
        >
          <Triangle className={`w-4 h-4 mb-1.5 ${hasUpvoted ? 'fill-primary' : ''}`} />
          <span className="text-[12px] font-bold tracking-tight">{product.upvotes_count}</span>
        </button>
      </div>
    </a>
  );
};

export default ProductCard;
