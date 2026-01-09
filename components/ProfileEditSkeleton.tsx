
import React from 'react';

const ProfileEditSkeleton: React.FC = () => {
    return (
        <div className="bg-white min-h-screen animate-pulse">
            {/* Top Navigation Bar Skeleton */}
            <div className="border-b border-gray-200">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="flex items-center gap-8 h-12">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-4 w-24 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto py-10 px-4">
                {/* Header Skeleton */}
                <div className="flex justify-between items-end mb-10">
                    <div className="h-8 w-40 bg-gray-200 rounded"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                </div>

                <div className="flex flex-col-reverse md:flex-row gap-12">
                    {/* Left Column: Form Skeleton */}
                    <div className="flex-1 space-y-8">
                        {/* Name */}
                        <div>
                            <div className="h-4 w-16 bg-gray-200 rounded mb-2"></div>
                            <div className="h-10 w-full bg-gray-200 rounded-lg"></div>
                        </div>

                        {/* Username */}
                        <div>
                            <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
                            <div className="h-10 w-full bg-gray-200 rounded-lg"></div>
                        </div>

                        {/* Headline */}
                        <div>
                            <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
                            <div className="h-10 w-full bg-gray-200 rounded-lg"></div>
                        </div>

                        {/* About */}
                        <div>
                            <div className="h-4 w-16 bg-gray-200 rounded mb-2"></div>
                            <div className="h-32 w-full bg-gray-200 rounded-lg"></div>
                        </div>

                        {/* Additional Links */}
                        <div>
                            <div className="h-6 w-32 bg-gray-200 rounded mb-6"></div>
                            <div className="space-y-4 mb-4">
                                <div className="h-10 w-full bg-gray-200 rounded-lg"></div>
                                <div className="h-10 w-full bg-gray-200 rounded-lg"></div>
                            </div>
                            <div className="h-4 w-20 bg-gray-200 rounded"></div>
                        </div>

                        {/* Button */}
                        <div className="pt-4">
                            <div className="h-12 w-24 bg-gray-200 rounded-lg"></div>
                        </div>
                    </div>

                    {/* Right Column: Avatar Skeleton */}
                    <div className="md:w-64 shrink-0 flex flex-col items-center">
                        <div className="w-32 h-32 rounded-full bg-gray-200 mb-4"></div>
                        <div className="h-8 w-40 bg-gray-200 rounded-full mb-2"></div>
                        <div className="h-3 w-48 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileEditSkeleton;
