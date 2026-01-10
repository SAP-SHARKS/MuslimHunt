import React from 'react';

const NotificationsSkeleton: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            <div className="flex items-center gap-4 mb-8">
                <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
            </div>

            <div className="space-y-6">
                {[1, 2, 3].map(i => (
                    <div key={i} className="flex gap-4 p-4 border border-gray-100 rounded-2xl">
                        <div className="w-12 h-12 bg-gray-200 rounded-xl animate-pulse shrink-0"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-3 w-1/4 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NotificationsSkeleton;
