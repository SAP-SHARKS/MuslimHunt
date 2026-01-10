import React from 'react';

const LaunchGuideSkeleton: React.FC = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Header Skeleton */}
            <div className="bg-gray-50 border-b border-gray-100 py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="h-4 w-32 bg-gray-200 rounded mb-4 animate-pulse"></div>
                    <div className="h-10 w-96 bg-gray-200 rounded mb-4 animate-pulse"></div>
                    <div className="h-5 w-3/4 max-w-2xl bg-gray-200 rounded animate-pulse"></div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Content Skeleton */}
                <div className="lg:col-span-2 space-y-12">
                    {/* Section 1 */}
                    <div>
                        <div className="h-8 w-48 bg-gray-200 rounded mb-6 animate-pulse"></div>
                        <div className="h-5 w-full max-w-2xl bg-gray-200 rounded mb-8 animate-pulse"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="border border-gray-100 rounded-xl p-6">
                                    <div className="h-8 w-8 bg-gray-200 rounded mb-4 animate-pulse"></div>
                                    <div className="h-6 w-3/4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                                    <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section 2 */}
                    <div>
                        <div className="h-8 w-48 bg-gray-200 rounded mb-6 animate-pulse"></div>
                        <div className="h-5 w-3/4 bg-gray-200 rounded mb-6 animate-pulse"></div>
                        <div className="h-40 w-full bg-gray-100 rounded-xl animate-pulse"></div>
                    </div>
                </div>

                {/* Sidebar Skeleton */}
                <div className="space-y-8">
                    <div className="bg-gray-50 rounded-xl p-6 h-64 animate-pulse"></div>
                    <div className="bg-gray-50 rounded-xl p-6 h-48 animate-pulse"></div>
                </div>
            </div>
        </div>
    );
};

export default LaunchGuideSkeleton;
