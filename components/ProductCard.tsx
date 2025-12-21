
import React from 'react';
import { ChevronUp } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onUpvote: (productId: string) => void;
  hasUpvoted: boolean;
  onClick: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onUpvote, hasUpvoted, onClick }) => {
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
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-800 transition-colors">
              {product.name}
            </h3>
            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full font-medium uppercase tracking-wider">
              {product.category}
            </span>
          </div>
          <p className="text-gray-600 text-sm line-clamp-1">
            {product.tagline}
          </p>
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onUpvote(product.id);
        }}
        className={`flex flex-col items-center justify-center w-14 h-14 rounded-lg border-2 transition-all ${
          hasUpvoted 
            ? 'bg-emerald-800 border-emerald-800 text-white' 
            : 'bg-white border-gray-200 text-gray-500 hover:border-emerald-800 hover:text-emerald-800'
        }`}
      >
        <ChevronUp className={`w-5 h-5 ${hasUpvoted ? 'animate-bounce' : ''}`} />
        <span className="text-xs font-bold leading-none mt-1">{product.upvotes_count}</span>
      </button>
    </div>
  );
};

export default ProductCard;
