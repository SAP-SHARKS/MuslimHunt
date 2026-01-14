import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User, Profile, View } from '../types';
import { Loader2, Plus, X, Upload } from 'lucide-react';

interface ProfileEditProps {
    user: User;
    onBack: () => void;
    onViewProfile: () => void;
    onNavigate: (view: View, path?: string) => void;
}

const ProfileEdit: React.FC<ProfileEditProps> = ({ user, onBack, onViewProfile, onNavigate }) => {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Form State
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [headline, setHeadline] = useState('');
    const [bio, setBio] = useState('');
    const [websiteUrl, setWebsiteUrl] = useState('');
    const [twitterUrl, setTwitterUrl] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');

    useEffect(() => {
        fetchProfile();
    }, [user.id]);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            // Dev Admin Bypass check
            if (user.id === '00000000-0000-0000-0000-000000000000') {
                const localData = localStorage.getItem('dev_profile_data');
                if (localData) {
                    const parsed = JSON.parse(localData);
                    setProfile(parsed);
                    setName(parsed.name || user.username || '');
                    setUsername(parsed.username || '');
                    setHeadline(parsed.headline || '');
                    setBio(parsed.bio || '');
                    setWebsiteUrl(parsed.website_url || '');
                    setTwitterUrl(parsed.twitter_url || '');
                    setAvatarUrl(parsed.avatar_url || user.avatar_url || '');
                    setLoading(false);
                    return;
                }
            }

            // Fetch from profiles table
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (data) {
                setProfile(data as Profile);
                setName(user.username || '');
                setUsername(data.username || '');
                setHeadline(data.headline || '');
                setBio(data.bio || '');
                setWebsiteUrl(data.website_url || '');
                setTwitterUrl(data.twitter_url || '');
                setAvatarUrl(data.avatar_url || user.avatar_url || '');
            } else if (error && error.code === 'PGRST116') {
                // Profile doesn't exist yet, verify if we can create one or just pre-fill from user
                setUsername(user.username || '');
                setAvatarUrl(user.avatar_url || '');
                // For 'Name' we can use user.email or user.username as fallback
                setName(user.username || '');
            }
        } catch (err) {
            console.error('Error fetching profile:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);

        try {
            // Dev Admin Bypass Save
            if (user.id === '00000000-0000-0000-0000-000000000000') {
                const mockProfile = {
                    id: user.id,
                    username,
                    headline,
                    bio,
                    website_url: websiteUrl,
                    twitter_url: twitterUrl,
                    avatar_url: avatarUrl,
                    name: name, // Store name locally
                    updated_at: new Date().toISOString(),
                };
                localStorage.setItem('dev_profile_data', JSON.stringify(mockProfile));
                setMessage({ type: 'success', text: 'Profile updated successfully! (Dev Local Storage)' });
                setSaving(false);

                // Refresh profile to reflect changes
                fetchProfile();
                return;
            }

            // 1. Update profiles table
            const updates = {
                id: user.id,
                username,
                headline,
                bio,
                website_url: websiteUrl,
                twitter_url: twitterUrl,
                avatar_url: avatarUrl,
                updated_at: new Date().toISOString(),
            };

            const { error } = await supabase
                .from('profiles')
                .upsert(updates);

            if (error) throw error;

            // 2. Update user metadata for consistent Name/Avatar in Navbar
            // Note: Supabase Auth updates are restricted from client usually for metadata
            const { error: authError } = await supabase.auth.updateUser({
                data: { full_name: name, avatar_url: avatarUrl }
            });

            if (authError) throw authError;

            setMessage({ type: 'success', text: 'Profile updated successfully!' });

            // Reload profile to ensure sync
            fetchProfile();

        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Error updating profile' });
        } finally {
            setSaving(false);
        }
    };

    const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            if (!event.target.files || event.target.files.length === 0) {
                return;
            }
            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const filePath = `${user.id}-${Math.random()}.${fileExt}`;

            setSaving(true); // Indicate loading

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);

            setAvatarUrl(data.publicUrl);
            setSaving(false);
        } catch (error: any) {
            alert('Error uploading avatar: ' + error.message);
            setSaving(false);
        }
    };

    const handleTabClick = (tabName: string) => {
        if (tabName === 'My details') {
            // Already here
        } else if (tabName === 'Followed products') {
            onNavigate(View.FOLLOWED_PRODUCTS, '/my/subscriptions/products');
        } else if (tabName === 'Verification') {
            onNavigate(View.VERIFICATION, '/my/verification');
        } else if (tabName === 'Settings') {
            onNavigate(View.SETTINGS, '/my/settings/edit');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-gray-300" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white font-sans text-[#4b587c]">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Tabs - Matching Settings.tsx exactly */}
                <div className="border-b border-gray-200 mb-8">
                    <nav className="-mb-px flex space-x-8">
                        {['Settings', 'My details', 'Followed products', 'Verification'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => handleTabClick(tab)}
                                className={`
                                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                                  ${tab === 'My details'
                                        ? 'border-emerald-600 text-primary'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:text-primary'
                                    }
                                `}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Header */}
                <div className="flex justify-between items-end mb-10">
                    <h1 className="text-2xl font-bold text-gray-900">My details</h1>
                    <button onClick={onViewProfile} className="text-gray-500 hover:text-gray-900 text-sm font-medium">View my profile</button>
                </div>

                <div className="flex flex-col-reverse md:flex-row gap-12">

                    {/* Left Column: Form */}
                    <div className="flex-1 space-y-8">

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-gray-300 focus:ring-0 text-gray-900 text-sm transition-colors"
                                placeholder="Your Name"
                            />
                        </div>

                        {/* Username */}
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <label className="block text-sm font-bold text-gray-900">Username</label>
                                {/* Tooltip icon could go here */}
                            </div>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-gray-300 focus:ring-0 text-gray-900 text-sm transition-colors"
                                placeholder="username"
                            />
                        </div>

                        {/* Headline */}
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">Headline</label>
                            <input
                                type="text"
                                value={headline}
                                onChange={(e) => setHeadline(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-gray-300 focus:ring-0 text-gray-900 text-sm transition-colors"
                                placeholder="Product Designer & Maker"
                            />
                        </div>

                        {/* About */}
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">About</label>
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                rows={6}
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-gray-300 focus:ring-0 text-gray-900 text-sm transition-colors resize-y min-h-[120px]"
                                placeholder="Tell the community about yourself, your goals, and your ambitions."
                            />
                        </div>

                        {/* Additional Links */}
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Additional links</h3>

                            <div className="space-y-4 mb-4">
                                <div className="flex gap-4">
                                    <input
                                        type="text"
                                        value={websiteUrl}
                                        onChange={(e) => setWebsiteUrl(e.target.value)}
                                        placeholder="Website URL"
                                        className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-sm"
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <input
                                        type="text"
                                        value={twitterUrl}
                                        onChange={(e) => setTwitterUrl(e.target.value)}
                                        placeholder="Twitter URL"
                                        className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-sm"
                                    />
                                </div>
                            </div>

                            <button className="text-blue-500 hover:text-blue-600 text-sm font-medium flex items-center gap-1">
                                <Plus className="w-4 h-4" /> Add link
                            </button>
                        </div>

                        {/* Interests */}
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Your interests</h3>
                            <p className="text-sm text-gray-500 mb-4">Select as many launch tags as you want</p>

                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Select a launch tag"
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm"
                                />
                                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="pt-4">
                            {message && (
                                <div className={`mb-4 text-sm font-medium ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                    {message.text}
                                </div>
                            )}
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-lg text-sm transition-colors shadow-sm disabled:opacity-70 flex items-center gap-2"
                            >
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
                            </button>
                        </div>

                    </div>

                    {/* Right Column: Avatar */}
                    <div className="md:w-64 shrink-0 flex flex-col items-center text-center">
                        <div className="w-32 h-32 rounded-full overflow-hidden mb-4 bg-gray-100 relative group cursor-pointer border border-gray-100">
                            {avatarUrl ? (
                                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                    <UserIcon className="w-12 h-12" />
                                </div>
                            )}
                            {/* Hidden Input for file upload */}
                            <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity text-white font-medium text-xs">
                                <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                                Change
                            </label>
                        </div>

                        {/* Upload Button */}
                        <label className="inline-block px-5 py-2 rounded-full border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer mb-2">
                            Upload new avatar
                            <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                        </label>

                        <p className="text-xs text-gray-400">Recommended size: 400x400px</p>
                    </div>

                </div>
            </div>
        </div>
    );
};

function UserIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
    );
}

export default ProfileEdit;
