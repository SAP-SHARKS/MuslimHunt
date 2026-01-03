
import React, { useState } from 'react';
import { User as UserIcon, Settings, ShieldCheck, CheckCircle2, Loader2, Camera, X, ArrowRight, Eye } from 'lucide-react';
import { User } from '../types';
import { supabase } from '../lib/supabase';

interface EditProfileProps {
  user: User;
  onSave: (updatedUser: Partial<User>) => void;
  onCancel: () => void;
  onViewProfile: () => void;
}

const EditProfile: React.FC<EditProfileProps> = ({ user, onSave, onCancel, onViewProfile }) => {
  const [formData, setFormData] = useState({
    username: user.username || '',
    headline: user.headline || '',
    bio: user.bio || '',
    website_url: user.website_url || '',
    twitter_url: user.twitter_url || ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const sidebarTabs = [
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'details', label: 'My details', icon: UserIcon },
    { id: 'followed', label: 'Followed products', icon: CheckCircle2 },
    { id: 'verification', label: 'Verification', icon: ShieldCheck }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: formData.username,
          headline: formData.headline,
          bio: formData.bio,
          website_url: formData.website_url,
          twitter_url: formData.twitter_url
        })
        .eq('id', user.id);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Mabrook! Your profile has been updated.' });
      onSave(formData);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update profile.' });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = () => {
    // Placeholder for Supabase Storage implementation
    alert('Bismillah! This feature is coming soon. Avatar storage integration is in progress.');
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-12 gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-emerald-900">Account Settings</h1>
          <p className="text-gray-500 mt-1">Manage your identity in the Muslim tech community.</p>
        </div>
        <button 
          onClick={onViewProfile}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl font-bold text-sm text-gray-700 hover:bg-gray-50 hover:border-emerald-800 transition-all active:scale-95 shadow-sm group"
        >
          <Eye className="w-4 h-4 text-emerald-800" />
          View my profile
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Settings Sidebar */}
        <aside className="w-full lg:w-64 shrink-0">
          <nav className="space-y-1">
            {sidebarTabs.map(tab => (
              <button
                key={tab.id}
                className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl font-bold text-[13px] uppercase tracking-widest transition-all ${
                  tab.id === 'details' 
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-100 shadow-sm' 
                    : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
          
          <div className="mt-12 pt-8 border-t border-gray-100">
            <button onClick={onCancel} className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-emerald-800 transition-colors">
              Return to Feed
            </button>
          </div>
        </aside>

        {/* Main Form */}
        <main className="flex-1 bg-white border border-gray-100 rounded-[3rem] p-8 sm:p-14 shadow-[0_32px_64px_-12px_rgba(6,78,59,0.05)]">
          <div className="flex flex-col items-center mb-12">
            <div className="relative group">
              <div className="w-28 h-28 rounded-[2.5rem] overflow-hidden border-4 border-emerald-50 shadow-lg group-hover:ring-4 group-hover:ring-emerald-100 transition-all">
                <img src={user.avatar_url} alt={user.username} className="w-full h-full object-cover" />
              </div>
              <button 
                onClick={handleAvatarUpload}
                className="absolute bottom-0 right-0 w-10 h-10 bg-emerald-800 text-white rounded-xl flex items-center justify-center shadow-2xl hover:bg-emerald-900 transition-all border-2 border-white active:scale-90"
              >
                <Camera className="w-5 h-5" />
              </button>
            </div>
            <p className="mt-6 text-[10px] font-black text-emerald-800/40 uppercase tracking-[0.3em]">Profile Photo</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest px-1">Display Username</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 font-bold">@</span>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                    className="w-full pl-10 pr-6 py-5 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-emerald-800 rounded-[1.5rem] outline-none font-bold text-lg shadow-inner transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest px-1">Short Headline</label>
                <input
                  type="text"
                  required
                  value={formData.headline}
                  onChange={e => setFormData({ ...formData, headline: e.target.value })}
                  placeholder="e.g. Building Halal SaaS tools"
                  className="w-full px-6 py-5 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-emerald-800 rounded-[1.5rem] outline-none font-bold text-lg shadow-inner transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest px-1">About (Bio)</label>
              <textarea
                rows={5}
                required
                value={formData.bio}
                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell the community about your journey as a Muslim builder..."
                className="w-full px-6 py-5 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-emerald-800 rounded-[2rem] outline-none font-medium text-lg resize-none shadow-inner transition-all leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest px-1">Personal Website</label>
                <input
                  type="url"
                  value={formData.website_url}
                  onChange={e => setFormData({ ...formData, website_url: e.target.value })}
                  placeholder="https://yourwebsite.com"
                  className="w-full px-6 py-5 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-emerald-800 rounded-[1.5rem] outline-none font-bold text-lg shadow-inner transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest px-1">X / Twitter URL</label>
                <input
                  type="url"
                  value={formData.twitter_url}
                  onChange={e => setFormData({ ...formData, twitter_url: e.target.value })}
                  placeholder="https://x.com/username"
                  className="w-full px-6 py-5 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-emerald-800 rounded-[1.5rem] outline-none font-bold text-lg shadow-inner transition-all"
                />
              </div>
            </div>

            {message && (
              <div className={`p-6 rounded-[1.5rem] text-center text-sm font-bold animate-in slide-in-from-top-2 duration-300 ${
                message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100 shadow-sm' : 'bg-red-50 text-red-800 border border-red-100'
              }`}>
                {message.text}
              </div>
            )}

            <div className="pt-10 flex items-center justify-end gap-6 border-t border-gray-50">
              <button type="button" onClick={onCancel} className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] hover:text-gray-900 transition-colors">Discard changes</button>
              <button
                type="submit"
                disabled={loading}
                className="px-14 py-5 bg-emerald-800 text-white rounded-[1.5rem] font-black text-lg uppercase tracking-widest hover:bg-emerald-900 transition-all shadow-2xl shadow-emerald-900/10 active:scale-95 flex items-center gap-3 disabled:opacity-70"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Profile'}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default EditProfile;
