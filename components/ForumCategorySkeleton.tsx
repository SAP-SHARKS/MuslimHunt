import React from 'react';

const ForumCategorySkeleton: React.FC = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 flex gap-8">
            {/* Sidebar Skeleton */}
            <aside className="hidden lg:block w-72 shrink-0 space-y-8">
                <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm">
                    <div className="h-4 bg-gray-100 rounded w-1/3 mb-8 animate-pulse" />
                    <div className="space-y-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex flex-col gap-2">
                                <div className="h-3 bg-gray-100 rounded w-1/4 animate-pulse" />
                                <div className="h-4 bg-gray-100 rounded w-3/4 animate-pulse" />
                                <div className="flex gap-2">
                                    <div className="h-3 bg-gray-100 rounded w-8 animate-pulse" />
                                    <div className="h-3 bg-gray-100 rounded w-8 animate-pulse" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </aside>

            {/* Main Content Skeleton */}
            <div className="flex-1 min-w-0">
                <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden min-h-[600px]">
                    {/* Header Skeleton */}
                    <div className="p-8 border-b border-gray-50 bg-[#F9F9F1]">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-gray-200 animate-pulse" />
                                <div className="space-y-2">
                                    <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
                                    <div className="h-4 bg-gray-200 rounded w-64 animate-pulse" />
                                </div>
                            </div>
                            <div className="h-10 bg-gray-200 rounded-xl w-32 animate-pulse" />
                        </div>
                    </div>

                    {/* Threads List Skeleton */}
                    <div className="divide-y divide-gray-50">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gray-100 animate-pulse" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-5 bg-gray-100 rounded w-3/4 animate-pulse" />
                                        <div className="h-4 bg-gray-100 rounded w-full animate-pulse" />
                                        <div className="flex gap-4 mt-2">
                                            <div className="h-3 bg-gray-100 rounded w-16 animate-pulse" />
                                            <div className="h-3 bg-gray-100 rounded w-16 animate-pulse" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForumCategorySkeleton;
