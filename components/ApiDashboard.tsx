import React from 'react';

const ApiDashboard: React.FC = () => {
    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-bold text-gray-900 mb-6 font-sans">My Applications</h1>

                <p className="text-gray-900 text-base leading-relaxed mb-8 font-sans">
                    Did you know Product Hunt has an API? Several awesome folks have used it to <a href="#" className="text-[#ff6154] hover:underline">build things</a> and you can too. Take a look at the <a href="#" className="text-[#ff6154] hover:underline">API docs</a> and to get started, add your first application:
                </p>

                <button className="px-6 py-3 bg-[#ff6154] text-white text-sm font-bold rounded-full hover:bg-[#ff6154]/90 transition-colors shadow-sm">
                    Add an application
                </button>
            </div>
        </div>
    );
};

export default ApiDashboard;
