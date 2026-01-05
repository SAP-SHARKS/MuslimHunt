
import React, { useState } from 'react';
import { 
  User as UserIcon, Settings, ShieldCheck, CheckCircle2, 
  Camera, ArrowLeft, Loader2, Link as LinkIcon, 
  Globe, Twitter, Linkedin, ExternalLink 
} from 'lucide-react';
import { User } from '../types';
import { supabase } from '../lib/supabase';

interface EditProfileProps {
  user: User;
  onSave: (updated: Partial<User>) => void;
  onCancel: () => void;
  onViewProfile: () => void;
}

const EditProfile: React.FC<EditProfileProps> = ({ user, onSave, onCancel, onViewProfile }) => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('My details');
  const [formData, setFormData] = useState({
    full_name: user.full_name || '',
    username: user.username || '',
    headline: user.headline || '',
    bio: user.bio || '',
    website_url: user.website_url || '',
    twitter_url: user.twitter_url || '',
    linkedin_url: user.linkedin_url || '',
  });

  const sidebarItems = [
    { name: 'Settings', icon: Settings },
    { name: 'My details', icon: UserIcon },
    { name: 'Followed products', icon: CheckCircle2 },
    { name: 'Verification', icon: ShieldCheck }
  ];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          username: formData.username.replace('@', ''),
          headline: formData.headline,
          bio: formData.bio,
          website_url: formData.website_url,
          twitter_url: formData.twitter_url,
          linkedin_url: formData.linkedin_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;
      onSave(formData);
    } catch (err) {
      console.error('Update failed:', err);
      alert('Bismillah, there was an error saving your changes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-4">
          <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full transition-all active:scale-90">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </button>
          <h1 className="text-3xl font-serif font-bold text-gray-900 tracking-tight">Profile Settings</h1>
        </div>
        <button 
          onClick={onViewProfile}
          className="text-[11px] font-black text-emerald-800 uppercase tracking-[0.2em] flex items-center gap-2 hover:underline"
        >
          View my profile <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar Nav */}
        <aside className="w-full lg:w-64 shrink-0">
          <nav className="flex flex-col gap-1">
            {sidebarItems.map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`flex items-center gap-3 px-6 py-4 rounded-xl font-bold text-sm transition-all text-left ${
                  activeTab === item.name 
                    ? 'bg-white text-emerald-800 shadow-md border border-gray-100' 
                    : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Form Area */}
        <main className="flex-1">
          {activeTab === 'My details' ? (
            <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-sm p-10 sm:p-14 animate-in slide-in-from-right-4 duration-500">
              <div className="flex flex-col items-center sm:items-start sm:flex-row gap-10 mb-12">
                <div className="relative group cursor-pointer">
                  <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-emerald-50 shadow-inner">
                    <img src={user.avatar_url} alt={user.username} className="w-full h-full object-cover group-hover:opacity-80 transition-opacity" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-800 shadow-xl">
                      <Camera className="w-5 h-5" />
                    </div>
                  </div>
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Photo</h2>
                  <p className="text-gray-400 font-medium mb-6 leading-relaxed">
                    Upload a high-quality circular photo. This will be your face across the global Ummah community.
                  </p>
                  <button className="px-6 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-black uppercase tracking-widest text-emerald-800 hover:bg-white hover:border-emerald-800 transition-all">
                    Upload new avatar
                  </button>
                </div>
              </div>

              <form onSubmit={handleSave} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Full Name</label>
                    <input 
                      type="text" value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                      placeholder="Ahmed Ali" className="w-full px-6 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-800 rounded-2xl outline-none font-bold text-gray-900 transition-all shadow-inner" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Username</label>
                    <div className="relative group">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 font-bold">@</span>
                      <input 
                        type="text" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})}
                        className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-800 rounded-2xl outline-none font-bold text-gray-900 transition-all shadow-inner" 
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Professional Headline</label>
                  <input 
                    type="text" value={formData.headline} onChange={(e) => setFormData({...formData, headline: e.target.value})}
                    placeholder="Building ethical tools for the world..."
                    className="w-full px-6 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-800 rounded-2xl outline-none font-bold text-gray-900 transition-all shadow-inner" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">About (Bio)</label>
                  <textarea 
                    rows={4} value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    placeholder="Tell the community about your mission..."
                    className="w-full px-6 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-800 rounded-3xl outline-none font-medium text-gray-900 transition-all shadow-inner resize-none leading-relaxed" 
                  />
                </div>

                <div className="pt-10 border-t border-gray-50 flex items-center justify-between">
                  <p className="text-[11px] font-black text-gray-300 uppercase tracking-widest">End-to-End Encrypted Persistence</p>
                  <button 
                    type="submit" disabled={loading}
                    className="px-10 py-4 bg-[#ff6154] hover:bg-[#e6574a] text-white font-black rounded-2xl transition-all shadow-xl shadow-red-900/10 active:scale-[0.98] flex items-center gap-3"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-white border border-gray-100 rounded-[2.5rem] p-20 text-center animate-in slide-in-from-right-4">
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-800">
                <Settings className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-emerald-900 mb-2">Module under optimization</h2>
              <p className="text-gray-400 font-medium">Bismillah! This section of your dashboard is being polished for launch.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default EditProfile;
