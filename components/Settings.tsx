
import React, { useState } from 'react';
import { CheckCircle, Github, Linkedin, X, Apple, Facebook, Twitter } from 'lucide-react';

const Settings: React.FC = () => {
    const [activeTab, setActiveTab] = useState('Settings');
    const [email, setEmail] = useState('support@sapsharks.com');
    const [unsubscribeAll, setUnsubscribeAll] = useState(false);
    const [autoFollow, setAutoFollow] = useState(true);
    const [hideProfile, setHideProfile] = useState(false);

    const tabs = [
        { name: 'Settings', href: '#' },
        { name: 'My details', href: '#' },
        { name: 'Followed products', href: '#' },
        { name: 'Verification', href: '#' },
    ];

    return (
        <div className="min-h-screen bg-white font-sans text-[#4b587c]">
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
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }
`}
                            >
                                {tab.name}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content */}
                <div className="max-w-3xl">
                    {/* Verify Account Section */}
                    <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-8 mb-16">
                        <div className="flex items-center gap-2 mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Verify your account</h2>
                            <CheckCircle className="w-5 h-5 text-green-500 fill-current" />
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
                                    <h3 className="text-base font-bold text-gray-900 mb-1">Verify your work email</h3>
                                    <p className="text-sm text-gray-500 mb-4">Submit your work email address. (Recommended)</p>

                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-4">
                                        <p className="text-sm text-gray-600 mb-1">It looks like you already have a work email on your account:</p>
                                        <p className="text-sm font-bold text-gray-900">{email}</p>
                                    </div>

                                    <div className="flex gap-3">
                                        <button className="px-4 py-2 bg-[#ff6154] text-white text-sm font-medium rounded hover:bg-[#ff6154]/90 transition-colors shadow-sm">
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
                                    <h3 className="text-base font-bold text-gray-900 mb-1">GitHub profile</h3>
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
                                    <h3 className="text-base font-bold text-gray-900 mb-1">LinkedIn profile</h3>
                                    <p className="text-sm text-gray-500 mb-4">Submit your LinkedIn profile URL. (Recommended)</p>
                                    <div className="flex gap-2 max-w-md">
                                        <input
                                            type="text"
                                            placeholder="https://linkedin.com/in/username"
                                            className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#ff6154] focus:border-[#ff6154]"
                                        />
                                        <button className="px-5 py-2 border border-gray-200 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
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

                                <button disabled className="w-full py-3 border border-gray-200 rounded-lg text-gray-300 font-medium text-sm text-center mb-12 cursor-not-allowed bg-gray-50">
                                    Request verification
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Connected Accounts Section */}
                    <div className="mb-16">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Connected accounts</h2>
                        <p className="text-sm text-gray-500 mb-2">You're connected with:</p>
                        <p className="text-sm font-medium text-gray-900 mb-8">Google</p>

                        <p className="text-sm text-gray-500 mb-4">Connect additional providers:</p>
                        <div className="space-y-3 max-w-xs">
                            {['Facebook', 'Twitter', 'Apple', 'Linkedin', 'Github'].map(provider => (
                                <div key={provider} className="flex justify-between items-center text-sm group cursor-pointer">
                                    <span className="text-gray-700 font-medium">{provider}</span>
                                    <button className="px-3 py-1 border border-gray-200 rounded text-xs font-medium text-gray-500 hover:bg-gray-50 group-hover:border-gray-300 transition-colors">Connect</button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Notification Settings */}
                    <div className="mb-16">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Notification settings</h2>

                        <div className="mb-8">
                            <label className="block text-sm font-bold text-gray-900 mb-2">Email</label>
                            <p className="text-sm text-gray-500 mb-3">Receive notifications to this email address.</p>
                            <input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full max-w-md border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#ff6154] focus:border-[#ff6154] mb-4"
                            />
                            <button className="px-6 py-2 bg-[#ff6154] text-white text-sm font-bold rounded-full hover:bg-[#ff6154]/90 transition-colors shadow-sm">
                                Save email
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h3 className="flex items-center gap-2 text-base font-bold text-gray-900 mb-1">
                                    <span className="text-lg">📮</span> Newsletters
                                </h3>
                                <p className="text-xs text-gray-500">The products, launches and news that matters for your inbox.</p>
                            </div>

                            <div>
                                <h3 className="flex items-center gap-2 text-base font-bold text-gray-900 mb-1">
                                    <span className="text-lg">🔔</span> Notifications
                                </h3>
                                <p className="text-xs text-gray-500">Get notified on your activity, and products you follow.</p>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-gray-100">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900">Unsubscribe from all notifications</h4>
                                    <p className="text-xs text-gray-500 mt-1">Unsubscribe from all newsletters and notifications. You'll still receive account messages (eg. password resets, invoices, and confirmed orders).</p>
                                </div>
                                <button
                                    onClick={() => setUnsubscribeAll(!unsubscribeAll)}
                                    className={`w - 11 h - 6 rounded - full transition - colors relative ${unsubscribeAll ? 'bg-[#ff6154]' : 'bg-gray-200'} `}
                                >
                                    <span className={`absolute top - 1 w - 4 h - 4 bg - white rounded - full transition - transform ${unsubscribeAll ? 'left-6' : 'left-1'} `} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900">Auto follow when commenting</h4>
                                    <p className="text-xs text-gray-500 mt-1">When you comment on the forum, you will automatically follow the product or author. If you don't want to follow in specific cases, you can uncheck the box "Follow discussion"</p>
                                </div>
                                <button
                                    onClick={() => setAutoFollow(!autoFollow)}
                                    className={`w - 11 h - 6 rounded - full transition - colors relative ${autoFollow ? 'bg-[#ff6154]' : 'bg-gray-200'} `}
                                >
                                    <span className={`absolute top - 1 w - 4 h - 4 bg - white rounded - full transition - transform ${autoFollow ? 'left-6' : 'left-1'} `} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Privacy */}
                    <div className="mb-16">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Privacy</h2>

                        <div className="flex items-start gap-3 mb-8">
                            <input
                                type="checkbox"
                                checked={hideProfile}
                                onChange={(e) => setHideProfile(e.target.checked)}
                                className="mt-1 w-4 h-4 text-[#ff6154] border-gray-300 rounded focus:ring-[#ff6154]"
                            />
                            <div>
                                <label className="text-sm font-bold text-gray-900 block mb-1">Hide my profile from search engines</label>
                                <p className="text-xs text-gray-500">This will prevent your profile from being crawled and indexed by search engines.</p>
                            </div>
                        </div>

                        <div className="mb-8">
                            <h4 className="text-sm text-gray-900 mb-2">Data</h4>
                            <p className="text-xs text-gray-500 mb-4">
                                If you would like access to your personal data please <a href="#" className="text-[#ff6154] hover:underline">email us</a>. Please view our <a href="#" className="text-[#ff6154] hover:underline">Private Policy</a> and <a href="#" className="text-[#ff6154] hover:underline">Terms of Service</a>.
                            </p>
                            <button className="px-6 py-2 bg-[#ff6154] text-white text-sm font-bold rounded-full hover:bg-[#ff6154]/90 transition-colors shadow-sm">
                                Save changes
                            </button>
                        </div>

                        <div className="pt-8 border-t border-gray-100">
                            <h4 className="text-sm italic text-gray-900 mb-4 font-serif">"Wait! Do you have to leave? Can't we talk?"</h4>
                            <button className="px-4 py-2 border border-gray-200 rounded text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-red-600 transition-colors mb-8">
                                Deactivate Account
                            </button>

                            <h4 className="text-sm italic text-gray-900 mb-4 font-serif">"Would you like to erase your account for all scum and time?"</h4>
                            <button className="px-4 py-2 border border-gray-200 rounded text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-red-600 transition-colors">
                                Delete Account
                            </button>
                        </div>
                    </div>

                </div>
            </div>


        </div>
    );
};

export default Settings;

