import React from 'react';

const ProductCardSkeleton: React.FC = () => {
    return (
        <div className="flex items-start justify-between p-6 bg-white border-b border-gray-50 last:border-0">
            <div className="flex items-start gap-5 flex-1 min-w-0">
                {/* Logo Container */}
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-gray-100 shadow-sm animate-pulse mt-1" />

                {/* Info Area */}
                <div className="min-w-0 flex-1 pt-0.5 space-y-3">
                    <div className="h-5 bg-gray-100 rounded w-3/4 animate-pulse" />
                    <div className="h-3 bg-gray-50 rounded w-1/2 animate-pulse" />

                    {/* Tags List */}
                    <div className="flex items-center gap-2">
                        <div className="h-3 bg-gray-50 rounded w-12 animate-pulse" />
                        <div className="h-3 bg-gray-50 rounded w-16 animate-pulse" />
                        <div className="h-3 bg-gray-50 rounded w-10 animate-pulse" />
                    </div>
                </div>
            </div>

            {/* Action Buttons (Right Side) - Vertical Stack */}
            <div className="flex items-center gap-3 shrink-0 ml-4 pt-1">
                {/* Comment Button */}
                <div className="w-[50px] h-[64px] rounded-xl bg-gray-50 animate-pulse" />

                {/* Upvote Button */}
                <div className="w-[50px] h-[64px] rounded-xl bg-gray-100 animate-pulse" />
            </div>
        </div>
    );
};

export default ProductCardSkeleton;
