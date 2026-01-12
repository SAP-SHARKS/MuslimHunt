import React from 'react';
import { View } from '../types';
import { Search } from 'lucide-react';

interface HelpArticleProps {
    setView: (view: View, path?: string) => void;
}

const HelpArticle: React.FC<HelpArticleProps> = ({ setView }) => {
    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            {/* Header - Emerald Branding instead of PH Orange */}
            <div className="bg-emerald-600 text-white pt-8 pb-16 px-4">
                <div className="max-w-5xl mx-auto">
                    {/* Top Nav */}
                    <div className="flex items-center justify-between text-sm font-medium mb-12">
                        <div
                            className="cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => setView(View.HELP_CENTER, '/help')}
                        >
                            Muslim Hunt Help Center
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="cursor-pointer hover:opacity-80">Go to Muslim Hunt</span>
                            <div className="px-3 py-1 bg-white/10 rounded-md border border-white/20">
                                🌐 English
                            </div>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="relative max-w-2xl mx-auto mb-12">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search for articles..."
                            className="w-full bg-white/10 border border-white/20 rounded-lg py-3 pl-12 pr-4 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all font-medium"
                        />
                    </div>
                </div>
            </div>

            {/* Content Container - Overlapping Header */}
            <div className="max-w-4xl mx-auto px-4 -mt-8 mb-24 relative z-10">
                <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8 overflow-x-auto whitespace-nowrap">
                    <span className="hover:text-emerald-600 cursor-pointer" onClick={() => setView(View.HELP_CENTER, '/help')}>All Collections</span>
                    <span>›</span>
                    <span className="hover:text-emerald-600 cursor-pointer">Muslim Hunt</span>
                    <span>›</span>
                    <span className="text-gray-900 font-medium">Muslim Hunt Forum Guidelines</span>
                </nav>

                <article className="bg-white rounded-xl">
                    <header className="mb-8">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
                            Muslim Hunt Forum Guidelines
                        </h1>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden">
                                <img src="https://ui-avatars.com/api/?name=Muslim+Hunt&background=004D40&color=fff" alt="Author" className="w-full h-full object-cover" />
                            </div>
                            <div className="text-sm">
                                <p className="font-bold text-gray-900">Written by Muslim Hunt Team</p>
                                <p className="text-gray-500">Updated over a week ago</p>
                            </div>
                        </div>
                    </header>

                    <div className="prose prose-emerald max-w-none text-gray-800 leading-relaxed space-y-6">
                        <p>
                            Forums on Muslim Hunt give you the opportunity to ask questions, get feedback, and connect with other Makers and halal tech enthusiasts. It's a place to speak directly with others building or following along with the newest innovation in the Ummah. These guidelines will help to explain how best to join in and meaningfully contribute to this community.
                        </p>

                        <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4 border-b border-gray-100 pb-2">Forum Topics</h3>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Each forum post is required to have a topic associated with it.</li>
                            <li>Choose the most appropriate topic for your post to help others find and contribute to it.</li>
                            <li>If your post doesn't fit into a specific topic, use the General topic.</li>
                        </ul>

                        <h4 className="font-bold mt-4">Topics:</h4>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>General</strong> - Share and discuss tech, products, business, startups, or product recommendations.</li>
                            <li><strong>AMA</strong> - Official ask-me-anything conversations with notable guests in the Islamic Tech space.</li>
                            <li><strong>Introduce yourself</strong> - Say hello to the Muslim Hunt community.</li>
                            <li><strong>Self-Promotion</strong> - Show off what you're working on (Halal/Shariah-compliant projects).</li>
                        </ul>

                        <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4 border-b border-gray-100 pb-2">What Makes A Good Forum Post</h3>

                        <h5 className="font-bold mt-4">Community-Focused</h5>
                        <ul className="list-disc pl-5 space-y-2 mb-4">
                            <li>Start conversations that would interest and benefit the Muslim Hunt community.</li>
                            <li>Share insights, experiences, or questions that others in tech would find valuable.</li>
                            <li>Create opportunities for meaningful dialogue and knowledge sharing in a respectful manner.</li>
                        </ul>

                        <h5 className="font-bold mt-4">Well-Structured</h5>
                        <ul className="list-disc pl-5 space-y-2 mb-4">
                            <li>Present your topic or question clearly.</li>
                            <li>Include relevant context and background information to help others engage meaningfully.</li>
                            <li>If asking questions, be specific about what you're looking to learn or understand.</li>
                        </ul>

                        <h5 className="font-bold mt-4">Engaging</h5>
                        <ul className="list-disc pl-5 space-y-2 mb-4">
                            <li>Foster meaningful conversation by asking open-ended questions.</li>
                            <li>Share your own perspective while inviting others to contribute their views.</li>
                            <li>Actively participate in the discussion you've started (Adab of conversation).</li>
                        </ul>

                        <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4 border-b border-gray-100 pb-2">What To Avoid</h3>

                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Low-Effort Content</strong>: Posts that exist purely to farm engagement or increase visibility without value.</li>
                            <li><strong>Haram or Inappropriate Content</strong>: Any content that violates Islamic principles or our community guidelines (e.g., gambling, alcohol, interest-based finance promotion).</li>
                            <li><strong>Spam</strong>: Excessive self-promotion or link dropping without context.</li>
                            <li><strong>Hostility</strong>: Disrespectful language towards other community members. We uphold high standards of Akhlaq (character).</li>
                        </ul>

                        <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4 border-b border-gray-100 pb-2">Moderation Process</h3>
                        <p>Our team is committed to maintaining high-quality forums that benefit the entire Muslim Hunt community. This includes:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Reviewing and potentially removing posts that don't align with these guidelines.</li>
                            <li>Providing guidance to help users better align their posts with our standards.</li>
                            <li>Taking action on repeated violations, which may include restricting contributing privileges.</li>
                        </ul>

                        <p className="mt-8 italic text-gray-500">
                            We want our forums to be valuable for everyone, which means maintaining these standards consistently. If you have questions regarding these guidelines, please reach out to us at <a href="mailto:hello@muslimhunt.com" className="text-emerald-600 hover:underline">hello@muslimhunt.com</a>.
                        </p>
                    </div>

                    {/* Feedback Section */}
                    <div className="bg-gray-50 rounded-xl p-8 mt-12 text-center">
                        <p className="font-medium text-gray-700 mb-6">Did this answer your question?</p>
                        <div className="flex justify-center gap-4 text-3xl">
                            <button className="hover:scale-110 transition-transform">😞</button>
                            <button className="hover:scale-110 transition-transform">😐</button>
                            <button className="hover:scale-110 transition-transform">😃</button>
                        </div>
                    </div>
                </article>
            </div>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-100 py-12 text-center">
                <div className="flex items-center justify-center gap-6 mb-4">
                    <a href="#" className="text-gray-400 hover:text-emerald-600 font-medium text-sm">Valid Company</a>
                    <a href="#" className="text-gray-400 hover:text-emerald-600 font-medium text-sm">Muslim Hunt</a>
                </div>
                <p className="text-xs text-gray-300">© 2026 Muslim Hunt</p>
            </footer>
        </div>
    );
};

export default HelpArticle;
