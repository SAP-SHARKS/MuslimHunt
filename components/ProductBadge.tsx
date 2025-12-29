import React from 'react';
import { Trophy, Star, Award } from 'lucide-react';
import { Badge } from '../types';

interface ProductBadgeProps {
  badge: Badge;
}

const ProductBadge: React.FC<ProductBadgeProps> = ({ badge }) => {
  const colors = {
    purple: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-600',
      border: 'border-indigo-100',
      icon: Trophy
    },
    gold: {
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      border: 'border-amber-100',
      icon: Award
    },
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      border: 'border-emerald-100',
      icon: Star
    }
  };

  const style = colors[badge.color] || colors.purple;
  const Icon = style.icon;

  // PH-style Hexagon clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)
  const hexagonStyle = {
    clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
  };

  return (
    <div className="relative group/badge flex items-center">
      {/* Badge Icon */}
      <div 
        className={`w-9 h-10 flex items-center justify-center ${style.bg} ${style.text} cursor-help transition-all group-hover/badge:scale-110 shadow-sm border border-transparent`}
        style={hexagonStyle}
      >
        {badge.type === 'ranking' && badge.value ? (
          <span className="text-[13px] font-black tracking-tighter leading-none pt-0.5">{badge.value}</span>
        ) : (
          <Icon className="w-4 h-4" />
        )}
      </div>

      {/* Hover Tooltip */}
      <div className="absolute bottom-full right-0 mb-3 w-64 bg-white border border-gray-100 shadow-xl rounded-xl p-4 z-[60] text-left opacity-0 pointer-events-none group-hover/badge:opacity-100 group-hover/badge:pointer-events-auto transition-all translate-y-2 group-hover/badge:translate-y-0 duration-200">
        <div className="flex items-start gap-3">
          {/* Large Badge in Tooltip */}
          <div 
            className={`w-12 h-14 shrink-0 flex items-center justify-center ${style.bg} ${style.text}`}
            style={hexagonStyle}
          >
            {badge.type === 'ranking' && badge.value ? (
              <span className="text-lg font-black">{badge.value}</span>
            ) : (
              <Icon className="w-6 h-6" />
            )}
          </div>
          <div className="flex-1">
            <p className="text-[13px] font-black text-gray-900 leading-tight mb-1">{badge.label}</p>
            <p className="text-[12px] text-gray-500 font-medium leading-relaxed">{badge.description}</p>
          </div>
        </div>
        
        {/* Tooltip Pointer */}
        <div className="absolute -bottom-1.5 right-4 w-3 h-3 bg-white border-r border-b border-gray-100 rotate-45 shadow-[2px_2px_2px_rgba(0,0,0,0.02)]"></div>
      </div>
    </div>
  );
};

export default ProductBadge;