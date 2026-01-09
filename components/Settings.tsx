import React, { useState } from 'react';
import { CheckCircle, Github, Linkedin, X, Apple, Facebook, Twitter } from 'lucide-react';

const Settings: React.FC = () => {
    const [activeTab, setActiveTab] = useState('Settings');

    const tabs = [
        { name: 'Settings', href: '#' },
        { name: 'My details', href: '#' },
        { name: 'Followed products', href: '#' },
        { name: 'Verification', href: '#' },
    ];

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Tabs */}
                <div className="border-b border-gray-200 mb-8">
                    <nav className="-mb-px flex space-x-8">
                        {tabs.map((tab) => (
                            <button
                                key={tab.name}
                                onClick={() => setActiveTab(tab.name)}
                                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${activeTab === tab.name
                                        ? 'border-[#ff6154] text-[#ff6154]' // Product Hunt primary color
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
                            >
                                {tab.name}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content - Hardcoded to match the screenshot "Verify your account" content for now as requested */}
                <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-8 max-w-3xl">
                    <div className="flex items-center gap-2 mb-4">
                        <h2 className="text-2xl font-bold text-gray-900">Verify your account</h2>
                        <CheckCircle className="w-6 h-6 text-green-500 fill-current" />
                    </div>

                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                        Getting verified helps us preserve the authenticity and trust of the community. Your contributions (e.g. votes and comments) will carry more weight and visibility.
                    </p>
                    <p className="text-gray-600 mb-8 text-sm leading-relaxed">
                        We want verified users to be interesting and respected members of the community, help us understand how you fit in.
                    </p>

                    <div className="space-y-10">
                        {/* Work Email */}
                        <div className="flex gap-4">
                            <div className="mt-1 w-6 h-6 rounded-full border-2 border-gray-100 flex items-center justify-center flex-shrink-0 bg-gray-50"></div>
                            <div className="flex-1">
                                <h3 className="text-base font-semibold text-gray-900 mb-1">Verify your work email</h3>
                                <p className="text-sm text-gray-500 mb-4">Submit your work email address. (Recommended)</p>

                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-4">
                                    <p className="text-sm text-gray-600 mb-3">It looks like you already have a work email on your account:</p>
                                    <p className="text-sm font-bold text-gray-900">support@sapsharks.com</p>
                                </div>

                                <div className="flex gap-3">
                                    <button className="px-4 py-2 bg-[#ff6154] text-white text-sm font-medium rounded hover:bg-[#ff6154]/90 transition-colors">
                                        Use this email
                                    </button>
                                    <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded hover:bg-gray-50 transition-colors">
                                        Use another email
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* GitHub */}
                        <div className="flex gap-4">
                            <div className="mt-1 w-6 h-6 rounded-full border-2 border-gray-100 flex items-center justify-center flex-shrink-0 bg-gray-50"></div>
                            <div className="flex-1">
                                <h3 className="text-base font-semibold text-gray-900 mb-1">GitHub profile</h3>
                                <p className="text-sm text-gray-500 mb-4">Login with your GitHub profile. (Recommended)</p>
                                <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                    <Github className="w-4 h-4" />
                                    Login with GitHub
                                </button>
                            </div>
                        </div>

                        {/* LinkedIn */}
                        <div className="flex gap-4">
                            <div className="mt-1 w-6 h-6 rounded-full border-2 border-gray-100 flex items-center justify-center flex-shrink-0 bg-gray-50"></div>
                            <div className="flex-1">
                                <h3 className="text-base font-semibold text-gray-900 mb-1">LinkedIn profile</h3>
                                <p className="text-sm text-gray-500 mb-4">Submit your LinkedIn profile URL. (Recommended)</p>
                                <div className="flex gap-2 max-w-md">
                                    <input
                                        type="text"
                                        placeholder="https://linkedin.com/in/username"
                                        className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#ff6154] focus:border-[#ff6154]"
                                    />
                                    <button className="px-4 py-2 border border-gray-200 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                        Add
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Connect Accounts */}
                        <div className="mt-12">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Connect accounts</h3>
                            <p className="text-sm text-gray-500 mb-6">Connecting accounts strengthens your verification request.</p>

                            <div className="flex gap-2 mb-8">
                                <button className="p-2 border border-gray-200 rounded hover:bg-gray-50"><X className="w-5 h-5 text-gray-600" /></button>
                                <button className="p-2 border border-gray-200 rounded hover:bg-gray-50"><Apple className="w-5 h-5 text-gray-600" /></button>
                                <button className="p-2 border border-gray-200 rounded hover:bg-gray-50"><Linkedin className="w-5 h-5 text-gray-600" /></button>
                            </div>

                            <button disabled className="w-full py-3 border border-gray-200 rounded-lg text-gray-300 font-medium text-sm text-center mb-12 cursor-not-allowed">
                                Request verification
                            </button>
                        </div>

                        {/* Connected Accounts */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Connected accounts</h3>
                            <p className="text-sm text-gray-900 mb-4">You're connected with:</p>
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
                                {/* Google Icon placeholder since lucide doesn't have Google */}
                                <span className="font-medium">Google</span>
                            </div>

                            <p className="text-sm text-gray-900 mb-4">Connect additional providers:</p>
                            <div className="space-y-4 max-w-sm">
                                {['Facebook', 'Twitter', 'Apple', 'Linkedin', 'Github'].map(provider => (
                                    <div key={provider} className="flex justify-between items-center text-sm">
                                        <span className="text-gray-700">{provider}</span>
                                        <button className="px-3 py-1 border border-gray-200 rounded text-xs font-medium text-gray-600 hover:bg-gray-50">Connect</button>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
