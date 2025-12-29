import React from 'react';
import { Trophy, Star, Award, Medal } from 'lucide-react';
import { Badge } from '../types';

interface ProductBadgeProps {
  badge: Badge;
}

const ProductBadge: React.FC<ProductBadgeProps> = ({ badge }) => {
  const colors = {
    purple: {
      bg: 'bg-[#f0f0ff]',
      text: 'text-[#6b63ff]',
      border: 'border-[#e0e0ff]',
      icon: Trophy
    },
    gold: {
      bg: 'bg-[#fff9e6]',
      text: 'text-[#d4a017]',
      border: 'border-[#fff0c0]',
      icon: Award
    },
    emerald: {
      bg: 'bg-[#ecfdf5]',
      text: 'text-[#10b981]',
      border: 'border-[#d1fae5]',
      icon: Star
    },
    blue: {
      bg: 'bg-[#eff6ff]',
      text: 'text-[#3b82f6]',
      border: 'border-[#dbeafe]',
      icon: Medal
    }
  };

  const style = colors[badge.color] || colors.purple;
  const Icon = style.icon;

  // Exact PH Hexagon clip-path
  const hexagonStyle = {
    clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
  };

  return (
    <div className="relative group/badge flex items-center">
      {/* Interactive Hexagon Badge */}
      <div 
        className={`w-9 h-10 flex items-center justify-center ${style.bg} ${style.text} cursor-help transition-transform hover:scale-110 shadow-sm border border-transparent`}
        style={hexagonStyle}
      >
        {badge.type === 'ranking' && badge.value ? (
          <span className="text-[13px] font-black tracking-tighter leading-none pt-0.5">{badge.value}</span>
        ) : (
          <Icon className="w-4 h-4" />
        )}
      </div>

      {/* High-Fidelity Tooltip */}
      <div className="absolute bottom-full right-0 mb-3 w-72 bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-2xl p-4 z-[100] text-left opacity-0 pointer-events-none group-hover/badge:opacity-100 group-hover/badge:pointer-events-auto transition-all translate-y-2 group-hover/badge:translate-y-0 duration-300">
        <div className="flex items-start gap-4">
          {/* Large Icon Preview */}
          <div 
            className={`w-14 h-16 shrink-0 flex items-center justify-center ${style.bg} ${style.text} shadow-sm`}
            style={hexagonStyle}
          >
            {badge.type === 'ranking' && badge.value ? (
              <span className="text-xl font-black">{badge.value}</span>
            ) : (
              <Icon className="w-7 h-7" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-black text-gray-900 leading-tight mb-1">{badge.label}</p>
            <p className="text-[12px] text-gray-500 font-medium leading-relaxed">{badge.description}</p>
          </div>
        </div>
        
        {/* Tooltip Pointer Triangle */}
        <div className="absolute -bottom-1.5 right-4 w-3 h-3 bg-white border-r border-b border-gray-100 rotate-45 shadow-[2px_2px_2px_rgba(0,0,0,0.02)]"></div>
      </div>
    </div>
  );
};

export default ProductBadge;