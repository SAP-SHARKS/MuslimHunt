import React from 'react';
import { Loader2 } from 'lucide-react';

const WelcomeSkeleton: React.FC = () => {
    return (
        <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-700">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-12">
                    <div className="w-20 h-20 bg-emerald-50 rounded-[2rem] flex items-center justify-center text-emerald-800 mx-auto mb-6 shadow-inner border border-emerald-100/50">
                        <div className="w-10 h-10 rounded-full bg-emerald-200/50 animate-pulse" />
                    </div>
                    <div className="h-10 w-64 bg-emerald-50/50 rounded-xl mx-auto mb-3 animate-pulse" />
                    <div className="h-6 w-48 bg-emerald-50/30 rounded-lg mx-auto animate-pulse" />
                </div>

                <div className="space-y-12">
                    {/* Section 1: Profile Details Skeleton */}
                    <section className="bg-white border border-gray-100 rounded-[2.5rem] p-8 sm:p-10 shadow-sm relative overflow-hidden">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-emerald-50 rounded-xl animate-pulse" />
                            <div className="h-6 w-32 bg-gray-100 rounded-lg animate-pulse" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="space-y-2">
                                    <div className="h-4 w-20 bg-gray-100 rounded animate-pulse" />
                                    <div className="h-14 w-full bg-gray-50 rounded-2xl animate-pulse" />
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Section 2: Headline Skeleton */}
                    <section className="bg-white border border-gray-100 rounded-[2.5rem] p-8 sm:p-10 shadow-sm relative overflow-hidden">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-emerald-50 rounded-xl animate-pulse" />
                            <div className="h-6 w-48 bg-gray-100 rounded-lg animate-pulse" />
                        </div>
                        <div className="space-y-2">
                            <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
                            <div className="h-24 w-full bg-gray-50 rounded-2xl animate-pulse" />
                        </div>
                    </section>

                    {/* Section 3: Newsletter Skeleton */}
                    <section className="bg-white border border-gray-100 rounded-[2.5rem] p-8 sm:p-10 shadow-sm">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-emerald-50 rounded-xl animate-pulse" />
                            <div className="h-6 w-40 bg-gray-100 rounded-lg animate-pulse" />
                        </div>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-20 w-full bg-gray-50 rounded-2xl animate-pulse" />
                            ))}
                        </div>
                    </section>

                    {/* Footer Action Skeleton */}
                    <div className="pt-6">
                        <div className="w-full h-16 bg-gray-100 rounded-[2rem] animate-pulse" />
                        <div className="mt-6 flex justify-center">
                            <div className="h-4 w-48 bg-gray-50 rounded animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WelcomeSkeleton;
