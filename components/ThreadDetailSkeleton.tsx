import React from 'react';

const ThreadDetailSkeleton: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 animate-in fade-in duration-500">
            <div className="flex items-center gap-2 mb-8">
                <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse" />
                <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
            </div>

            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden p-8 mb-8">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gray-100 animate-pulse" />
                    <div className="space-y-2">
                        <div className="h-5 w-48 bg-gray-100 rounded animate-pulse" />
                        <div className="h-3 w-32 bg-gray-100 rounded animate-pulse" />
                    </div>
                </div>

                <div className="space-y-4 mb-8">
                    <div className="h-8 w-3/4 bg-gray-100 rounded animate-pulse" />
                    <div className="space-y-2">
                        <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
                        <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
                        <div className="h-4 w-2/3 bg-gray-100 rounded animate-pulse" />
                    </div>
                </div>
            </div>

            <div className="flex gap-4">
                <div className="w-full h-32 bg-gray-50 rounded-xl animate-pulse" />
            </div>
        </div>
    );
};

export default ThreadDetailSkeleton;
