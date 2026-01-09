import React from 'react';

const ApiDashboardSkeleton: React.FC = () => {
    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="h-10 w-64 bg-gray-100 rounded mb-6 animate-pulse" />

                <div className="space-y-2 mb-8">
                    <div className="h-5 w-full bg-gray-50 rounded animate-pulse" />
                    <div className="h-5 w-2/3 bg-gray-50 rounded animate-pulse" />
                </div>

                <div className="h-12 w-48 bg-gray-100 rounded-full animate-pulse" />
            </div>
        </div>
    );
};

export default ApiDashboardSkeleton;
