import React, { useState } from 'react';
import { Trophy, Star, Award } from 'lucide-react';
import { Badge } from '../types';

interface ProductBadgeProps {
  badge: Badge;
}

const ProductBadge: React.FC<ProductBadgeProps> = ({ badge }) => {
  const [isHovered, setIsHovered] = useState(false);

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

  // Hexagon shape using clip-path
  const hexagonStyle = {
    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
  };

  return (
    <div 
      className="relative flex items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className={`w-9 h-10 flex items-center justify-center ${style.bg} ${style.text} cursor-help transition-all hover:scale-110 shadow-sm border border-transparent`}
        style={hexagonStyle}
      >
        {badge.type === 'ranking' && badge.value ? (
          <span className="text-xs font-black tracking-tighter">{badge.value}</span>
        ) : (
          <Icon className="w-4 h-4" />
        )}
      </div>

      {isHovered && (
        <div className="absolute bottom-full right-0 mb-4 w-64 bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-2xl p-4 z-[100] animate-in fade-in zoom-in-95 duration-200 pointer-events-none">
          <div className="flex items-start gap-3">
            <div 
              className={`w-10 h-11 shrink-0 flex items-center justify-center ${style.bg} ${style.text}`}
              style={hexagonStyle}
            >
              {badge.type === 'ranking' && badge.value ? (
                <span className="text-sm font-black">{badge.value}</span>
              ) : (
                <Icon className="w-5 h-5" />
              )}
            </div>
            <div>
              <p className="text-sm font-black text-gray-900 leading-tight mb-1">{badge.label}</p>
              <p className="text-[12px] text-gray-500 font-medium leading-relaxed">{badge.description}</p>
            </div>
          </div>
          {/* Tooltip Triangle */}
          <div className="absolute -bottom-1.5 right-3 w-3 h-3 bg-white border-r border-b border-gray-100 rotate-45 shadow-[2px_2px_2px_rgba(0,0,0,0.02)]"></div>
        </div>
      )}
    </div>
  );
};

export default ProductBadge;