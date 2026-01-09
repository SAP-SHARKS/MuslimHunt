import React from 'react';

const UserProfileSkeleton: React.FC = () => {
    return (
        <div className="min-h-screen bg-white font-sans text-[#4b587c]">
            {/* Header Section Skeleton */}
            <div className="max-w-5xl mx-auto px-4 pt-12 pb-4">
                <div className="flex flex-col md:flex-row items-start gap-8">

                    {/* Avatar Skeleton */}
                    <div className="shrink-0">
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gray-100 animate-pulse border border-gray-50" />
                    </div>

                    {/* User Info Skeleton */}
                    <div className="flex-1 min-w-0 w-full pt-2">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                            <div className="w-full">
                                {/* Name & Headline */}
                                <div className="h-8 bg-gray-100 rounded-lg w-64 animate-pulse mb-3" />
                                <div className="h-4 bg-gray-50 rounded-lg w-48 animate-pulse mb-6" />

                                {/* Stats Row */}
                                <div className="flex flex-wrap items-center gap-4 mb-6">
                                    <div className="h-3 bg-gray-50 rounded w-20 animate-pulse" />
                                    <div className="h-3 bg-gray-50 rounded w-20 animate-pulse" />
                                    <div className="h-3 bg-gray-50 rounded w-20 animate-pulse" />
                                </div>

                                {/* Socials Placeholder */}
                                <div className="flex gap-4">
                                    <div className="w-5 h-5 bg-gray-100 rounded-full animate-pulse" />
                                    <div className="w-5 h-5 bg-gray-100 rounded-full animate-pulse" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs Navigation Skeleton */}
            <div className="pl-4 md:pl-0 mt-8">
                <div className="max-w-5xl mx-auto">
                    <div className="flex items-center gap-8 border-b border-gray-100 pb-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-4 bg-gray-100 rounded w-16 animate-pulse" />
                        ))}
                    </div>
                </div>
            </div>

            {/* Tab Content Skeleton */}
            <div className="max-w-5xl mx-auto px-4 py-8 space-y-12">
                {/* About Section */}
                <div className="space-y-4">
                    <div className="h-6 bg-gray-100 rounded w-24 animate-pulse mb-4" />
                    <div className="space-y-2 max-w-3xl">
                        <div className="h-4 bg-gray-50 rounded w-full animate-pulse" />
                        <div className="h-4 bg-gray-50 rounded w-5/6 animate-pulse" />
                        <div className="h-4 bg-gray-50 rounded w-4/6 animate-pulse" />
                    </div>
                </div>

                {/* Badges Section */}
                <div className="space-y-4">
                    <div className="h-6 bg-gray-100 rounded w-24 animate-pulse mb-4" />
                    <div className="flex gap-4">
                        <div className="w-48 h-20 bg-gray-50 rounded-xl animate-pulse border border-gray-100" />
                        <div className="w-48 h-20 bg-gray-50 rounded-xl animate-pulse border border-gray-100" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfileSkeleton;
