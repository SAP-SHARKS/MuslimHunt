import React from 'react';
import { Rocket, Users, BookOpen, HelpCircle, ArrowRight, ExternalLink } from 'lucide-react';

interface LaunchGuideProps {
    onBack: () => void;
}

const LaunchGuide: React.FC<LaunchGuideProps> = ({ onBack }) => {
    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-50 to-white border-b border-gray-100 py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-500 text-xs font-bold uppercase tracking-wider mb-6">
                        <Rocket className="w-3 h-3" />
                        Launch Guide
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 mb-6">
                        Muslim Hunt Launch Guide
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
                        Interested in sharing something you made? DO IT!
                        We've got everything you need to know about launching on Muslim Hunt right here.
                    </p>
                    <div className="mt-8">
                        <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-full transition-colors shadow-sm shadow-red-200">
                            Launch cheat sheet
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-8 space-y-20">

                    {/* How to launch */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">How to launch</h2>
                        <p className="text-gray-600 mb-10 text-lg">
                            This complete guide will answer common questions, dispel myths, and share best practices for your launch. We'll also help you understand what "success" means here. Download the baby and let's get started.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="group cursor-pointer">
                                <div className="aspect-video bg-gray-50 rounded-xl border border-gray-100 mb-4 overflow-hidden relative">
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100/50 group-hover:bg-gray-100/30 transition-colors">
                                        <Rocket className="w-12 h-12 text-primary" />
                                    </div>
                                </div>
                                <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">Getting started</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">The mechanics of the site, how the platform works, and how to prep everything you need to know before you hunt.</p>
                            </div>

                            <div className="group cursor-pointer">
                                <div className="aspect-video bg-gray-50 rounded-xl border border-gray-100 mb-4 overflow-hidden relative">
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100/50 group-hover:bg-gray-100/30 transition-colors">
                                        <Rocket className="w-12 h-12 text-blue-500" />
                                    </div>
                                </div>
                                <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">Launching a product</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">Set up the background images, text that you have to make it essential you pass the "Is it huntable?" test, and other tips for the big moment.</p>
                            </div>

                            <div className="group cursor-pointer">
                                <div className="aspect-video bg-gray-50 rounded-xl border border-gray-100 mb-4 overflow-hidden relative">
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100/50 group-hover:bg-gray-100/30 transition-colors">
                                        <Users className="w-12 h-12 text-purple-500" />
                                    </div>
                                </div>
                                <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">Growing a community</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">Learn how to leverage your launch to acquire users, get feedback and grow your goals post-launch day.</p>
                            </div>

                            <div className="group cursor-pointer">
                                <div className="aspect-video bg-gray-50 rounded-xl border border-gray-100 mb-4 overflow-hidden relative">
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100/50 group-hover:bg-gray-100/30 transition-colors">
                                        <BookOpen className="w-12 h-12 text-orange-500" />
                                    </div>
                                </div>
                                <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">Definitions</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">A glossary for navigating Product Hunt and common terminology.</p>
                            </div>
                        </div>
                    </section>

                    {/* Case studies */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Case studies</h2>
                        <p className="text-gray-600 mb-10">Read how others have charted success with Muslim Hunt launches.</p>

                        <div className="space-y-8">
                            {[
                                { color: 'bg-emerald-100', icon: '🕋', title: 'Notion', desc: 'Used launches to propel growth and community feedback.' },
                                { color: 'bg-blue-100', icon: '🔹', title: 'Framer', desc: 'Turning a side project into a venture-backed company.' },
                                { color: 'bg-purple-100', icon: '⚛️', title: 'Loom', desc: 'How they found their first 1000 users via our platform.' }
                            ].map((study, i) => (
                                <div key={i} className="flex gap-6 items-start group cursor-pointer">
                                    <div className={`w-32 h-20 ${study.color} rounded-lg flex items-center justify-center text-3xl shrink-0 group-hover:scale-105 transition-transform`}>
                                        {study.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{study.title}</h3>
                                        <p className="text-gray-500 text-sm leading-relaxed">{study.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Common questions */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-8">Common questions</h2>
                        <p className="text-sm text-gray-500 uppercase font-bold tracking-wider mb-6">Look at this - More, get quick answers to all your guide questions.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                            {[
                                { q: 'Is Muslim Hunt free?', a: 'Yes! It takes less than a minute to sign up.' },
                                { q: 'What is Muslim Hunt?', a: 'Muslim Hunt is a curation of the best new products, every day. It\'s a place for product-loving enthusiasts to share and geek out about the latest mobile apps, websites, hardware projects, and tech creations.' },
                                { q: 'Can I create a company account on Muslim Hunt?', a: 'No. Company accounts are not allowed. Only personal accounts.' },
                                { q: 'What if someone else already hunted my product?', a: 'If someone else has already hunted your product, you can claim it as a Maker.' },
                                { q: 'Why should I use Muslim Hunt?', a: 'Launch on Muslim Hunt to find your first users, get feedback, and grow your startup.' },
                                { q: 'How does Muslim Hunt work?', a: 'It\'s a community-curated list of products. Users submit products, and the community votes on them.' },
                                { q: 'Best day to launch on Muslim Hunt?', a: 'Tuesday, Wednesday, and Thursday are typically the highest traffic days.' },
                                { q: 'When to launch on Muslim Hunt?', a: '12:01 AM PST is the best time to launch to maximize exposure for the day.' }
                            ].map((qa, i) => (
                                <div key={i}>
                                    <h4 className="font-bold text-gray-900 mb-2">{qa.q}</h4>
                                    <p className="text-sm text-gray-500 leading-relaxed mb-2">{qa.a}</p>
                                    <a href="#" className="text-red-500 text-xs font-bold hover:underline">See more</a>
                                </div>
                            ))}
                        </div>
                    </section>

                </div>

                {/* Sidebar */}
                <div className="lg:col-span-4 space-y-10">
                    <div>
                        <h3 className="font-bold text-gray-900 mb-4">Links</h3>
                        <ul className="space-y-3">
                            {[
                                { icon: '🚀', label: 'My launch on Muslim Hunt' },
                                { icon: '🔍', label: 'How can I do you need one?' }, // Replicated from screenshot somewhat nonsensical text? Assuming typo in screenshot "How do you need one?"
                                { icon: '📦', label: 'Setting pack' },
                                { icon: '📅', label: 'Content checklist' },
                                { icon: '🎬', label: 'Maker stories & studios' }
                            ].map((link, i) => (
                                <li key={i}>
                                    <a href="#" className="flex items-center gap-3 text-sm text-gray-600 hover:text-primary transition-colors group">
                                        <span className="shrink-0 w-5 text-center">{link.icon}</span>
                                        <span className="font-medium">{link.label}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-gray-900 mb-4">Other maker resources</h3>
                        <ul className="space-y-3">
                            <li>
                                <a href="#" className="flex items-center gap-3 text-sm text-gray-600 hover:text-primary transition-colors">
                                    <span className="shrink-0 w-5 text-center">👋</span>
                                    <span className="font-medium">Maker community (Coming Soon)</span>
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
