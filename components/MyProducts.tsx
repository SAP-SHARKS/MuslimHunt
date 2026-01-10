import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { View } from '../types';

interface MyProductsProps {
    onNewPost: () => void;
    activeFilter?: string;
    onNavigate: (view: any, path: string) => void;
}

const MyProducts: React.FC<MyProductsProps> = ({ onNewPost, activeFilter = 'all', onNavigate }) => {
    // Map filter values to Labels
    const getLabelFromFilter = (filter: string) => {
        switch (filter) {
            case 'inprogress': return 'In Progress';
            case 'drafts': return 'Drafts';
            case 'scheduled': return 'Scheduled';
            case 'posted': return 'Posted';
            default: return 'All';
        }
    };

    const getFilterFromLabel = (label: string) => {
        switch (label) {
            case 'In Progress': return 'inprogress';
            case 'Drafts': return 'drafts';
            case 'Scheduled': return 'scheduled';
            case 'Posted': return 'posted';
            default: return 'all';
        }
    };

    const [activeTab, setActiveTab] = useState(getLabelFromFilter(activeFilter));

    React.useEffect(() => {
        setActiveTab(getLabelFromFilter(activeFilter));
    }, [activeFilter]);

    const handleTabClick = (label: string) => {
        const filter = getFilterFromLabel(label);
        onNavigate('MY_PRODUCTS', `/my/products?filter=${filter}`);
    };

    const menuItems = [
        { label: 'All', count: 0, icon: '💯' },
        { label: 'In Progress', count: 0, icon: '🧗' },
        { label: 'Drafts', count: 0, icon: '📝' },
        { label: 'Scheduled', count: 0, icon: '⏰' },
        { label: 'Posted', count: 0, icon: '🚀' },
    ];

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">My products & launches</h1>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sidebar */}
                    <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 mb-4 px-3">Launches</h3>
                            <nav className="space-y-1">
                                {menuItems.map((item) => (
                                    <button
                                        key={item.label}
                                        onClick={() => handleTabClick(item.label)}
                                        className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === item.label
                                            ? 'text-[#ff6154] bg-[#ff6154]/5'
                                            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="w-4 h-4 flex items-center justify-center text-lg">{item.icon}</span>
                                            <span>{item.label}</span>
                                        </div>
                                        <span className="text-gray-400">({item.count})</span>
                                    </button>
                                ))}
                            </nav>
                        </div>

                        <div>
                            <h3 className="text-sm font-bold text-gray-900 mb-4 px-3">Need help?</h3>
                            <nav className="space-y-1">
                                <button className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors">
                                    Launch Guide
                                </button>
                                <button className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors">
                                    FAQ
                                </button>
                            </nav>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 min-w-0">
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <span className="text-4xl mb-6">😳</span>
                            <h3 className="text-xl font-medium text-gray-900 mb-2">Looks like you dont have any posts yet</h3>
                            <p className="text-sm text-gray-500 mb-8 max-w-md">
                                To learn more about posting a product, check out our <a href="#" className="text-[#ff6154] hover:underline">guides to a successful launch</a>
                            </p>
                            <button
                                onClick={onNewPost}
                                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-full text-white bg-[#ff6154] hover:bg-[#ff6154]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff6154] transition-colors shadow-sm"
                            >
                                Create a new post
                            </button>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default MyProducts;
