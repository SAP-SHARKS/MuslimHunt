import React from 'react';
import { Loader2 } from 'lucide-react';

const HelpCenterSkeleton: React.FC = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Header Skeleton */}
            <div className="bg-gray-50 py-24 px-4 border-b border-gray-100 flex flex-col items-center justify-center">
                <div className="h-4 w-48 bg-gray-200 rounded mb-6 animate-pulse"></div>
                <div className="h-10 w-3/4 max-w-2xl bg-gray-200 rounded mb-8 animate-pulse"></div>
                <div className="h-12 w-full max-w-xl bg-gray-200 rounded-lg animate-pulse"></div>
            </div>

            {/* Grid Skeleton */}
            <div className="max-w-6xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className="border border-gray-200 rounded-xl p-8 flex flex-col items-center text-center h-64 justify-center">
                            <div className="w-12 h-12 bg-gray-200 rounded-full mb-6 animate-pulse"></div>
                            <div className="h-6 w-32 bg-gray-200 rounded mb-3 animate-pulse"></div>
                            <div className="flex items-center gap-2 mt-4">
                                <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse"></div>
                                <div className="w-20 h-3 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HelpCenterSkeleton;
