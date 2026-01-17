import React, { useState, useEffect } from 'react';
import { Rocket, Users, BookOpen, HelpCircle, ArrowRight, ExternalLink, ChevronDown } from 'lucide-react';
import { View } from '../types';
import { supabase } from '../lib/supabase';

interface LaunchGuideProps {
    onBack: () => void;
    onNavigate?: (view: View, path?: string) => void;
}

interface ExpandableAnswer {
    q: string;
    shortA: string;
    fullA: string;
}

interface LaunchGuideLink {
    id: string;
    icon: string;
    label: string;
    url: string;
    display_order: number;
}

const LaunchGuide: React.FC<LaunchGuideProps> = ({ onBack, onNavigate }) => {
    const [expandedQuestions, setExpandedQuestions] = useState<Record<number, boolean>>({});
    const [launchLinks, setLaunchLinks] = useState<LaunchGuideLink[]>([]);

    const toggleQuestion = (index: number) => {
        setExpandedQuestions(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    // Fetch launch guide links from Supabase
    useEffect(() => {
        const fetchLaunchLinks = async () => {
            const { data, error } = await supabase
                .from('launch_guide_links')
                .select('*')
                .eq('is_active', true)
                .order('display_order', { ascending: true });

            if (error) {
                console.error('Error fetching launch links:', error);
                // Fallback to default links if fetch fails
                setLaunchLinks([
                    { id: '1', icon: '🔍', label: 'Hunters: Do you need one?', url: 'https://muslim-hunt.vercel.app/launch/before-launch#hunters:-do-you-need-one?', display_order: 1 },
                    { id: '2', icon: '📦', label: 'Setting pack', url: 'https://muslim-hunt.vercel.app/launch/before-launch#setting-goals', display_order: 2 },
                    { id: '3', icon: '📅', label: 'Content checklist', url: '#', display_order: 3 },
                    { id: '4', icon: '🎬', label: 'Maker stories & studios', url: '#', display_order: 4 }
                ]);
            } else if (data) {
                setLaunchLinks(data);
            }
        };

        fetchLaunchLinks();
    }, []);

    const commonQuestions: ExpandableAnswer[] = [
        {
            q: 'Is Muslim Hunt free?',
            shortA: 'Yes! It takes less than a minute to sign up.',
            fullA: 'Yes! It takes less than a minute to sign up. Muslim Hunt is completely free for makers and users. You can create a personal account, submit products, participate in discussions, and access all community features at no cost.'
        },
        {
            q: 'What is Muslim Hunt?',
            shortA: 'Muslim Hunt is a curation of the best new products, every day.',
            fullA: 'Muslim Hunt is a curation of the best new products, every day. It\'s a place for product-loving enthusiasts to share and geek out about the latest mobile apps, websites, hardware projects, and tech creations. The Muslim Hunt community is made up of makers, technophiles, product people, entrepreneurs, investors, creators, early adopters, and folks who just love new ideas. On the Muslim Hunt platform, makers in the community share what they\'ve built. Products are submitted, or hunted, by community members daily. Others in the community can upvote, comment, and share those products as they compete on the homepage leaderboard for top spots, including Product of the Day.'
        },
        {
            q: 'Can I create a company account on Muslim Hunt?',
            shortA: 'No. Company accounts are not allowed. Only personal accounts.',
            fullA: 'No. Company accounts are not allowed. Only personal accounts. Muslim Hunt is built around individual makers and their personal journeys. Even if you\'re representing a company, you should create a personal account and associate your products with it. This helps maintain authenticity and trust within the community.'
        },
        {
            q: 'What if someone else already hunted my product?',
            shortA: 'If someone else has already hunted your product, you can claim it as a Maker.',
            fullA: 'If someone else has already hunted your product, you can claim it as a Maker. Visit the product page, click on the "Claim as Maker" button, and follow the verification process. Once verified, you\'ll be listed as the maker and can engage with the community, respond to comments, and update product information.'
        },
        {
            q: 'Why should I use Muslim Hunt?',
            shortA: 'Launch on Muslim Hunt to find your first users, get feedback, and grow your startup.',
            fullA: 'Launch on Muslim Hunt to find your first users, get feedback, and grow your startup. Muslim Hunt provides immediate exposure to thousands of early adopters who are actively looking for new products. You\'ll receive valuable feedback, build your brand within the tech community, drive traffic to your product, and potentially attract investors and media attention. Many successful startups credit their Muslim Hunt launch as a pivotal moment in their growth journey.'
        },
        {
            q: 'How does Muslim Hunt work?',
            shortA: 'It\'s a community-curated list of products.',
            fullA: 'It\'s a community-curated list of products. Users submit products, and the community votes on them. Each day, products compete for upvotes and engagement. The products with the most upvotes rise to the top of the daily leaderboard. Top-ranked products earn badges like "Product of the Day," "Product of the Week," and "Product of the Month." The community can also comment, ask questions, and share products across social media.'
        },
        {
            q: 'Best day to launch on Muslim Hunt?',
            shortA: 'Tuesday, Wednesday, and Thursday are typically the highest traffic days.',
            fullA: 'The best day to launch is the day on which you\'re most prepared. There are pros and cons to launching on each day. Tuesday, Wednesday, and Thursday typically see the highest traffic and engagement. However, weekends can have less competition. Ultimately, choose a day when you can dedicate time to engage with the community, respond to comments, and promote your launch across your channels.'
        },
        {
            q: 'When to launch on Muslim Hunt?',
            shortA: '12:01 AM PST is the best time to launch.',
            fullA: '12:01 am Pacific Time is the best time to launch for makers that are planning ahead and don\'t have limitations or other opportunities. Launching at the start of the day gives you maximum exposure throughout the entire 24-hour period. This timing allows you to be among the first products users see when they visit Muslim Hunt, potentially securing early upvotes that boost your visibility for the rest of the day.'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50/50 to-white font-sans text-gray-900">
            {/* Header */}
            <div className="bg-gradient-to-br from-primary-light/30 via-white to-primary-light/20 border-b border-gray-100 py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-light text-primary text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] mb-4 sm:mb-6">
                        <Rocket className="w-3 h-3" />
                        Launch Guide
                    </div>
                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-primary mb-4 sm:mb-6">
                        Muslim Hunt Launch Guide
                    </h1>
                    <p className="text-base sm:text-xl text-gray-600 max-w-2xl leading-relaxed font-medium">
                        Interested in sharing something you made? DO IT!
                        We've got everything you need to know about launching on Muslim Hunt right here.
                    </p>
                    <div className="mt-6 sm:mt-8">
                        <button className="bg-primary hover:bg-primary-dark text-white font-black py-3 sm:py-4 px-6 sm:px-8 rounded-xl sm:rounded-2xl transition-all shadow-lg shadow-emerald-900/10 active:scale-95 text-sm sm:text-base">
                            Launch cheat sheet
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12">
                {/* Main Content */}
                <div className="lg:col-span-8 space-y-16 sm:space-y-20">

                    {/* How to launch */}
                    <section>
                        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary mb-2 sm:mb-4">How to launch</h2>
                        <p className="text-gray-600 mb-8 sm:mb-10 text-base sm:text-lg leading-relaxed">
                            This complete guide will answer common questions, dispel myths, and share best practices for your launch. We'll also help you understand what "success" means here. Download the baby and let's get started.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                            {[
                                { icon: Rocket, color: 'text-primary', bg: 'bg-primary-light', title: 'Getting started', desc: 'The mechanics of the site, how the platform works, and how to prep everything you need to know before you hunt.' },
                                { icon: Rocket, color: 'text-blue-600', bg: 'bg-blue-50', title: 'Launching a product', desc: 'Set up the background images, text that you have to make it essential you pass the "Is it huntable?" test, and other tips for the big moment.' },
                                { icon: Users, color: 'text-purple-600', bg: 'bg-purple-50', title: 'Growing a community', desc: 'Learn how to leverage your launch to acquire users, get feedback and grow your goals post-launch day.' },
                                { icon: BookOpen, color: 'text-orange-600', bg: 'bg-orange-50', title: 'Definitions', desc: 'A glossary for navigating Product Hunt and common terminology.' }
                            ].map((item, i) => (
                                <div key={i} className="group cursor-pointer">
                                    <div className={`aspect-video ${item.bg} rounded-xl sm:rounded-2xl border border-gray-100 mb-3 sm:mb-4 overflow-hidden relative transition-all group-hover:shadow-lg group-hover:border-gray-200`}>
                                        <div className="absolute inset-0 flex items-center justify-center transition-all">
                                            <item.icon className={`w-10 sm:w-12 h-10 sm:h-12 ${item.color}`} />
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-base sm:text-lg mb-1.5 sm:mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                                    <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Case studies */}
                    <section>
                        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary mb-2 sm:mb-4">Case studies</h2>
                        <p className="text-gray-600 mb-8 sm:mb-10 text-base sm:text-lg">Read how others have charted success with Muslim Hunt launches.</p>

                        <div className="space-y-6 sm:space-y-8">
                            {[
                                { color: 'bg-gradient-to-br from-emerald-100 to-emerald-50', icon: '🕋', title: 'Notion', desc: 'Used launches to propel growth and community feedback.' },
                                { color: 'bg-gradient-to-br from-blue-100 to-blue-50', icon: '🔹', title: 'Framer', desc: 'Turning a side project into a venture-backed company.' },
                                { color: 'bg-gradient-to-br from-purple-100 to-purple-50', icon: '⚛️', title: 'Loom', desc: 'How they found their first 1000 users via our platform.' }
                            ].map((study, i) => (
                                <div key={i} className="flex gap-4 sm:gap-6 items-start group cursor-pointer p-4 sm:p-6 rounded-xl sm:rounded-2xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100">
                                    <div className={`w-24 sm:w-32 h-16 sm:h-20 ${study.color} rounded-lg sm:rounded-xl flex items-center justify-center text-2xl sm:text-3xl shrink-0 group-hover:scale-105 transition-transform shadow-sm`}>
                                        {study.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-base sm:text-lg mb-1 group-hover:text-primary transition-colors">{study.title}</h3>
                                        <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">{study.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Common questions */}
                    <section>
                        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary mb-2 sm:mb-4">Common questions</h2>
                        <p className="text-[10px] sm:text-xs text-gray-500 uppercase font-black tracking-[0.15em] sm:tracking-[0.2em] mb-6 sm:mb-8">Look at this - More, get quick answers to all your guide questions.</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 sm:gap-x-12 gap-y-8 sm:gap-y-10">
                            {commonQuestions.map((qa, i) => (
                                <div key={i} className="group">
                                    <h4 className="font-bold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">{qa.q}</h4>
                                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-2 sm:mb-3">
                                        {expandedQuestions[i] ? qa.fullA : qa.shortA}
                                    </p>
                                    <button
                                        onClick={() => toggleQuestion(i)}
                                        className="text-primary text-[11px] sm:text-xs font-black hover:underline uppercase tracking-wider transition-all inline-flex items-center gap-1 group-hover:gap-2"
                                    >
                                        {expandedQuestions[i] ? 'See less' : 'See more'}
                                        <ChevronDown className={`w-3 h-3 transition-transform ${expandedQuestions[i] ? 'rotate-180' : ''}`} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>

                </div>

                {/* Sidebar */}
                <div className="lg:col-span-4 space-y-8 sm:space-y-10">
                    <div className="bg-white rounded-2xl sm:rounded-[2rem] border border-gray-100 p-5 sm:p-6 shadow-sm sticky top-24">
                        <h3 className="font-black text-gray-900 mb-4 sm:mb-6 text-sm sm:text-base uppercase tracking-wider">Links</h3>
                        <ul className="space-y-2 sm:space-y-3">
                            <li>
                                <button
                                    onClick={() => onNavigate?.(View.HOW_IT_WORKS, '/launch/how-muslim-hunt-works')}
                                    className="w-full flex items-center gap-3 text-xs sm:text-sm text-gray-600 hover:text-primary transition-colors group py-2 px-3 rounded-lg hover:bg-primary-light/30 text-left"
                                >
                                    <span className="shrink-0 w-5 text-center text-base">🚀</span>
                                    <span className="font-bold">My launch on Muslim Hunt</span>
                                </button>
                            </li>
                            {launchLinks.map((link) => (
                                <li key={link.id}>
                                    <a
                                        href={link.url}
                                        className="flex items-center gap-3 text-xs sm:text-sm text-gray-600 hover:text-primary transition-colors group py-2 px-3 rounded-lg hover:bg-primary-light/30"
                                        target={link.url.startsWith('http') ? '_blank' : '_self'}
                                        rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                                    >
                                        <span className="shrink-0 w-5 text-center text-base">{link.icon}</span>
                                        <span className="font-bold">{link.label}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-gradient-to-br from-primary-light/20 to-white rounded-2xl sm:rounded-[2rem] border border-primary-light p-5 sm:p-6">
                        <h3 className="font-black text-gray-900 mb-4 sm:mb-6 text-sm sm:text-base uppercase tracking-wider">Other maker resources</h3>
                        <ul className="space-y-2 sm:space-y-3">
                            <li>
                                <a href="#" className="flex items-center gap-3 text-xs sm:text-sm text-gray-600 hover:text-primary transition-colors py-2 px-3 rounded-lg hover:bg-white/50">
                                    <span className="shrink-0 w-5 text-center text-base">👋</span>
                                    <span className="font-bold">Maker community <span className="text-[10px] text-gray-400">(Coming Soon)</span></span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LaunchGuide;
