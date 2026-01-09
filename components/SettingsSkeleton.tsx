import React from 'react';

const SettingsSkeleton: React.FC = () => {
    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Tabs Skeleton */}
                <div className="border-b border-gray-200 mb-8 flex space-x-8 pb-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
                    ))}
                </div>

                {/* Content Skeleton */}
                <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-8 max-w-3xl">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="h-8 w-48 bg-gray-100 rounded animate-pulse" />
                    </div>

                    <div className="space-y-2 mb-8">
                        <div className="h-4 w-full bg-gray-50 rounded animate-pulse" />
                        <div className="h-4 w-3/4 bg-gray-50 rounded animate-pulse" />
                    </div>

                    <div className="space-y-10">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex gap-4">
                                <div className="w-6 h-6 rounded-full bg-gray-100 animate-pulse flex-shrink-0" />
                                <div className="flex-1 space-y-3">
                                    <div className="h-5 w-40 bg-gray-100 rounded animate-pulse" />
                                    <div className="h-4 w-64 bg-gray-50 rounded animate-pulse" />
                                    <div className="h-10 w-32 bg-gray-50 rounded animate-pulse" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsSkeleton;
