
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, User, Mail, Globe, Twitter, Info, Loader2, 
  Sparkles, ShieldCheck, Check, AlertCircle, Camera 
} from 'lucide-react';
import { supabase } from '../lib/supabase.ts';
import { User as UserType } from '../types.ts';

interface EditProfileProps {
  user: UserType;
  onSave: (updatedUser: Partial<UserType>) => void;
  onCancel: () => void;
  onViewProfile: () => void;
}

const EditProfile: React.FC<EditProfileProps> = ({ user, onSave, onCancel, onViewProfile }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const [formData, setFormData] = useState({
    username: user.username || '',
    headline: user.headline || '',
    bio: user.bio || '',
    website_url: user.website_url || '',
    twitter_url: user.twitter_url || '',
    avatar_url: user.avatar_url || ''
  });

  const handleSave = async (e: React.FormEvent) => {
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
          twitter_url: formData.twitter_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Bismillah! Profile updated successfully.' });
      onSave(formData);
      
      // Auto-redirect or clear message after a few seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setMessage({ type: 'error', text: err.message || 'Failed to update profile. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-10">
        <button 
          onClick={onCancel}
          className="flex items-center gap-2 text-gray-400 hover:text-emerald-800 transition-colors group font-black uppercase tracking-widest text-[10px]"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Cancel Editing
        </button>
        <button 
          onClick={onViewProfile}
          className="text-[10px] font-black text-emerald-800 uppercase tracking-widest hover:underline"
        >
          View Public Profile
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-[3rem] shadow-xl overflow-hidden">
        <div className="bg-emerald-900 p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
            <Sparkles className="w-32 h-32 text-emerald-400" />
          </div>
          
          <div className="relative inline-block group">
            <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-emerald-800 shadow-2xl bg-white mb-4">
              <img 
                src={formData.avatar_url || `https://i.pravatar.cc/150?u=${user.id}`} 
                alt={formData.username} 
                className="w-full h-full object-cover"
              />
            </div>
            <button className="absolute bottom-2 right-2 p-2.5 bg-white text-emerald-900 rounded-xl shadow-lg border border-emerald-50 hover:bg-emerald-50 transition-all active:scale-90">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          
          <h1 className="text-3xl font-serif font-bold text-white mb-1">Edit Account Details</h1>
          <p className="text-emerald-200/60 font-medium text-sm">Update your public presence in the Ummah ecosystem.</p>
        </div>

        <form onSubmit={handleSave} className="p-10 sm:p-14 space-y-8">
          {message && (
            <div className={`p-5 rounded-2xl flex items-center gap-4 animate-in slide-in-from-top-2 ${
              message.type === 'success' 
                ? 'bg-emerald-50 border border-emerald-100 text-emerald-800' 
                : 'bg-red-50 border border-red-100 text-red-600'
            }`}>
              {message.type === 'success' ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              <p className="text-sm font-bold">{message.text}</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Community Username</label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-800/30 font-bold">@</span>
                <input
                  required
                  type="text"
                  value={formData.username}
                  onChange={e => setFormData({ ...formData, username: e.target.value })}
                  className="w-full pl-10 pr-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-emerald-800 rounded-2xl outline-none font-bold text-gray-900 transition-all shadow-inner"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Professional Headline</label>
              <input
                type="text"
                value={formData.headline}
                onChange={e => setFormData({ ...formData, headline: e.target.value })}
                placeholder="e.g. Maker of Halal Apps"
                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-emerald-800 rounded-2xl outline-none font-bold text-gray-900 transition-all shadow-inner"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Short Bio</label>
            <textarea
              rows={4}
              value={formData.bio}
              onChange={e => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell the community about yourself and what you're building..."
              className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-emerald-800 rounded-3xl outline-none font-medium text-gray-700 transition-all shadow-inner resize-none leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4 border-t border-gray-50">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1 flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-emerald-800" /> Website URL
              </label>
              <input
                type="url"
                value={formData.website_url}
                onChange={e => setFormData({ ...formData, website_url: e.target.value })}
                placeholder="https://..."
                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-emerald-800 rounded-2xl outline-none font-bold text-gray-900 transition-all shadow-inner"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1 flex items-center gap-2">
                <Twitter className="w-3.5 h-3.5 text-emerald-800" /> Twitter (X)
              </label>
              <input
                type="text"
                value={formData.twitter_url}
                onChange={e => setFormData({ ...formData, twitter_url: e.target.value })}
                placeholder="@username"
                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-emerald-800 rounded-2xl outline-none font-bold text-gray-900 transition-all shadow-inner"
              />
            </div>
          </div>

          <div className="pt-10">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-black py-5 rounded-[2rem] shadow-xl shadow-emerald-900/20 transition-all active:scale-[0.98] text-xl flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  Save Changes
                  <ShieldCheck className="w-6 h-6" />
                </>
              )}
            </button>
            <p className="mt-6 text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
              Your data is secured by Supabase & Muslim Hunt
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
