import React from 'react';

const MyProductsSkeleton: React.FC = () => {
    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="h-10 bg-gray-100 rounded w-64 mb-8 animate-pulse" />

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sidebar Skeleton */}
                    <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
                        <div>
                            <div className="h-4 bg-gray-100 rounded w-20 mb-4 px-3 animate-pulse" />
                            <div className="space-y-4">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="flex justify-between px-3">
                                        <div className="h-4 bg-gray-50 rounded w-24 animate-pulse" />
                                        <div className="h-4 bg-gray-50 rounded w-8 animate-pulse" />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <div className="h-4 bg-gray-100 rounded w-24 mb-4 px-3 animate-pulse" />
                            <div className="space-y-4">
                                <div className="h-4 bg-gray-50 rounded w-full animate-pulse mx-3" />
                                <div className="h-4 bg-gray-50 rounded w-full animate-pulse mx-3" />
                            </div>
                        </div>
                    </aside>

                    {/* Main Content Skeleton */}
                    <main className="flex-1 min-w-0">
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="w-16 h-16 bg-gray-100 rounded-full mb-6 animate-pulse" />
                            <div className="h-6 bg-gray-100 rounded w-64 mb-4 animate-pulse" />
                            <div className="h-4 bg-gray-50 rounded w-96 mb-8 animate-pulse" />
                            <div className="h-12 bg-gray-100 rounded-full w-40 animate-pulse" />
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default MyProductsSkeleton;
