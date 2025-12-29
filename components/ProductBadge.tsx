import React from 'react';
import { Trophy, Star, Award, Medal, Calendar, Wheat } from 'lucide-react';
import { Badge } from '../types';

interface ProductBadgeProps {
  badge: Badge;
}

const ProductBadge: React.FC<ProductBadgeProps> = ({ badge }) => {
  const isRanking = badge.type === 'ranking';
  const isCalendar = badge.type === 'calendar';
  const isSquare = badge.type === 'square';
  const isTrophy = badge.type === 'trophy';

  // Shape Styles
  const hexagonClip = 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)';
  const pentagonClip = 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)';

  const getBadgeStyle = () => {
    if (isRanking) return { bg: 'bg-amber-50', text: 'text-amber-600', clip: hexagonClip, icon: Wheat };
    if (isCalendar) return { bg: 'bg-indigo-50', text: 'text-indigo-400', clip: hexagonClip, icon: Calendar };
    if (isSquare) return { bg: 'bg-amber-400', text: 'text-white', clip: 'none', icon: null };
    if (isTrophy) return { bg: 'bg-blue-600', text: 'text-white', clip: pentagonClip, icon: Trophy };
    return { bg: 'bg-gray-50', text: 'text-gray-400', clip: hexagonClip, icon: Star };
  };

  const style = getBadgeStyle();
  const Icon = style.icon;

  return (
    <div className="relative group/badge flex items-center">
      {/* Visual Badge Shape */}
      <div 
        className={`relative w-9 h-10 flex items-center justify-center transition-transform hover:scale-110 cursor-help shadow-sm border border-transparent ${style.bg} ${style.text} ${isSquare ? 'rounded-lg w-10 h-10' : ''}`}
        style={style.clip !== 'none' ? { clipPath: style.clip } : {}}
      >
        {isRanking && Icon && (
          <div className="absolute inset-0 flex items-center justify-center opacity-40">
            <Icon className="w-8 h-8 rotate-180" />
          </div>
        )}
        
        {isCalendar && Icon && (
          <div className="absolute top-1 left-1/2 -translate-x-1/2 opacity-30">
            <Icon className="w-4 h-4" />
          </div>
        )}

        <span className={`relative z-10 ${isSquare ? 'text-lg font-black' : 'text-[13px] font-black pt-0.5'} tracking-tighter`}>
          {badge.value || (isTrophy ? <Trophy className="w-4 h-4" /> : '')}
        </span>
      </div>

      {/* Interactive Tooltip */}
      <div className="absolute bottom-full right-0 mb-3 w-72 bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-2xl p-4 z-[100] text-left opacity-0 pointer-events-none group-hover/badge:opacity-100 group-hover/badge:pointer-events-auto transition-all translate-y-2 group-hover/badge:translate-y-0 duration-300">
        <div className="flex items-start gap-4">
          {/* Large Version of the Badge */}
          <div 
            className={`w-14 h-16 shrink-0 flex items-center justify-center shadow-md ${style.bg} ${style.text} ${isSquare ? 'rounded-xl w-14 h-14' : ''}`}
            style={style.clip !== 'none' ? { clipPath: style.clip } : {}}
          >
             <span className={`font-black ${isSquare ? 'text-2xl' : 'text-xl'}`}>
              {badge.value || (isTrophy ? <Trophy className="w-6 h-6" /> : '')}
            </span>
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-black text-gray-900 leading-tight mb-1">{badge.label}</p>
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