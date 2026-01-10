import React from 'react';
import { Search, BookOpen, Monitor, LifeBuoy, Ghost, FileText, Smartphone, Trophy, Megaphone } from 'lucide-react';

interface HelpCenterProps {
    onBack: () => void;
}

const HelpCenter: React.FC<HelpCenterProps> = ({ onBack }) => {
    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            {/* Header */}
            <div className="bg-emerald-600 text-white py-24 px-4 flex flex-col items-center justify-center text-center">
                <div className="max-w-4xl mx-auto space-y-8 w-full">
                    <div className="flex items-center justify-between w-full absolute top-6 left-0 px-8">
                        <span className="font-bold text-sm opacity-90">Muslim Hunt Help Center</span>
                        <div className="flex items-center gap-2 text-sm font-medium cursor-pointer hover:opacity-80">
                            <span>🌐 English</span>
                        </div>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold">Advice and answers from the Muslim Hunt Team</h1>

                    <div className="relative max-w-2xl mx-auto w-full">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search for articles..."
                            className="w-full bg-white/20 border border-white/30 rounded-lg py-3 pl-12 pr-4 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all font-medium"
                        />
                    </div>
                </div>
            </div>

            {/* Categories Grid */}
            <div className="max-w-5xl mx-auto px-4 py-16 -mt-10 relative z-10">
                <div className="space-y-4">
                    {[
                        {
                            id: 'posting',
                            icon: BookOpen,
                            title: 'Posting',
                            author: 'Jake',
                            count: 31
                        },
                        {
                            id: 'browsing',
                            icon: Monitor,
                            title: 'Browsing',
                            author: 'Jake',
                            count: 6
                        },
                        {
                            id: 'support',
                            icon: LifeBuoy,
                            title: 'Support',
                            author: 'Jake',
                            count: 10
                        },
                        {
                            id: 'muslimhunt',
                            icon: Ghost,
                            title: 'Muslim Hunt',
                            author: 'Jake',
                            count: 17
                        },
                        {
                            id: 'productpages',
                            icon: FileText,
                            title: 'Product Pages',
                            author: 'Jake',
                            count: 5
                        },
                        {
                            id: 'mobile',
                            icon: Smartphone,
                            title: 'Mobile',
                            author: 'Jake',
                            count: 7
                        },
                        {
                            id: 'awards',
                            icon: Trophy,
                            title: 'Golden Kitty Awards',
                            desc: 'Everything you need to know about this year\'s edition of the Golden Kitty Awards.',
                            author: 'Jake',
                            count: 2
                        },
                        {
                            id: 'advertising',
                            icon: Megaphone,
                            title: 'Advertising',
                            author: 'Jake',
                            count: 2
                        }
                    ].map((item) => (
                        <div key={item.id} className="bg-white rounded-lg border border-gray-100 p-6 flex items-start gap-6 hover:shadow-md transition-shadow cursor-pointer">
                            <div className="shrink-0 pt-1">
                                <item.icon className="w-8 h-8 text-emerald-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-900 mb-1">{item.title}</h3>
                                {item.desc && <p className="text-gray-500 text-sm mb-3 leading-relaxed">{item.desc}</p>}
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="w-5 h-5 rounded-full bg-gray-200 overflow-hidden">
                                        <img src={`https://i.pravatar.cc/150?u=${item.author}`} alt={item.author} className="w-full h-full object-cover" />
                                    </div>
                                    <span className="text-xs text-gray-400">
                                        By {item.author} • {item.count} articles
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <footer className="py-12 text-center text-gray-400 text-sm">
                <div className="mb-4 font-medium">Muslim Hunt Help Center</div>
                <div className="flex items-center justify-center gap-4 opacity-60">
                    <span>✖</span>
                    <span>in</span>
                </div>
                <div className="mt-4 text-emerald-600 hover:underline cursor-pointer">
                    Contact us: hello@muslimhunt.com
                </div>
            </footer>
        </div>
    );
};

export default HelpCenter;
