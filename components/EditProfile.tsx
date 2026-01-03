
import React, { useState } from 'react';
import { User as UserIcon, Settings, ShieldCheck, CheckCircle2, Loader2, Camera, X } from 'lucide-react';
import { User } from '../types';
import { supabase } from '../lib/supabase';

interface EditProfileProps {
  user: User;
  onSave: (updatedUser: Partial<User>) => void;
  onCancel: () => void;
}

const EditProfile: React.FC<EditProfileProps> = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    username: user.username || '',
    headline: user.headline || '',
    bio: user.bio || '',
    website_url: user.website_url || '',
    twitter_url: user.twitter_url || ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const tabs = [
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

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      onSave(formData);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update profile.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-serif font-bold text-emerald-900">Account Settings</h1>
        <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <X className="w-6 h-6 text-gray-400" />
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Settings Sidebar */}
        <aside className="w-full lg:w-64 shrink-0 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                tab.id === 'details' 
                  ? 'bg-emerald-50 text-emerald-800' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </aside>

        {/* Main Form */}
        <main className="flex-1 bg-white border border-gray-100 rounded-[2.5rem] p-8 sm:p-12 shadow-sm">
          <div className="flex flex-col items-center mb-10">
            <div className="relative group">
              <div className="w-24 h-24 rounded-[2rem] overflow-hidden border-4 border-emerald-50 shadow-md">
                <img src={user.avatar_url} alt={user.username} className="w-full h-full object-cover" />
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-emerald-800 text-white rounded-lg flex items-center justify-center shadow-lg hover:bg-emerald-900 transition-all">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <p className="mt-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Profile Photo</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest px-1">Username</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 font-bold">@</span>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                    className="w-full pl-10 pr-5 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-800 rounded-2xl outline-none font-bold text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest px-1">Headline</label>
                <input
                  type="text"
                  value={formData.headline}
                  onChange={e => setFormData({ ...formData, headline: e.target.value })}
                  placeholder="What are you working on?"
                  className="w-full px-5 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-800 rounded-2xl outline-none font-bold text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest px-1">Bio (About)</label>
              <textarea
                rows={4}
                value={formData.bio}
                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell the community about yourself..."
                className="w-full px-5 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-800 rounded-2xl outline-none font-medium text-sm resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest px-1">Website</label>
                <input
                  type="url"
                  value={formData.website_url}
                  onChange={e => setFormData({ ...formData, website_url: e.target.value })}
                  placeholder="https://yourwebsite.com"
                  className="w-full px-5 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-800 rounded-2xl outline-none font-bold text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest px-1">Twitter URL</label>
                <input
                  type="url"
                  value={formData.twitter_url}
                  onChange={e => setFormData({ ...formData, twitter_url: e.target.value })}
                  placeholder="https://x.com/username"
                  className="w-full px-5 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-800 rounded-2xl outline-none font-bold text-sm"
                />
              </div>
            </div>

            {message && (
              <div className={`p-4 rounded-xl text-center text-sm font-bold ${
                message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'bg-red-50 text-red-800 border border-red-100'
              }`}>
                {message.text}
              </div>
            )}

            <div className="pt-8 flex items-center justify-end gap-4 border-t border-gray-50">
              <button type="button" onClick={onCancel} className="px-6 py-3 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">Cancel</button>
              <button
                type="submit"
                disabled={loading}
                className="px-10 py-3.5 bg-emerald-800 text-white rounded-xl font-black text-sm uppercase tracking-widest hover:bg-emerald-900 transition-all shadow-lg active:scale-95 flex items-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Details'}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default EditProfile;
