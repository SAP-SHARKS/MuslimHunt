import React from 'react';

const HelpArticleSkeleton: React.FC = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Header Skeleton */}
            <div className="bg-gray-50 h-[300px] w-full animate-pulse flex flex-col items-center justify-center p-8">
                <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
                <div className="h-10 w-3/4 max-w-2xl bg-gray-200 rounded-lg mb-6"></div>
                <div className="h-4 w-48 bg-gray-200 rounded"></div>
            </div>

            {/* Content Skeleton */}
            <div className="max-w-3xl mx-auto px-4 py-12 space-y-8 animate-pulse">
                <div className="space-y-4">
                    <div className="h-4 w-full bg-gray-100 rounded"></div>
                    <div className="h-4 w-full bg-gray-100 rounded"></div>
                    <div className="h-4 w-2/3 bg-gray-100 rounded"></div>
                </div>

                <div className="h-px bg-gray-100 w-full my-8"></div>

                <div className="space-y-6">
                    <div className="h-6 w-1/3 bg-gray-200 rounded"></div>
                    <div className="space-y-3 pl-4">
                        <div className="h-4 w-full bg-gray-100 rounded"></div>
                        <div className="h-4 w-full bg-gray-100 rounded"></div>
                        <div className="h-4 w-5/6 bg-gray-100 rounded"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpArticleSkeleton;
