
import React, { useState, useRef } from 'react';
import { 
  User as UserIcon, Settings, ShieldCheck, CheckCircle2, 
  Camera, ArrowLeft, Loader2, Globe, Twitter, 
  ExternalLink, LogOut, Check, Bell, Key
} from 'lucide-react';
import { User } from '../types';
import { supabase } from '../lib/supabase';
import SafeImage from './SafeImage.tsx';

interface EditProfileProps {
  user: User;
  onSave: (updated: Partial<User>) => void;
  onCancel: () => void;
  onViewProfile: () => void;
}

const EditProfile: React.FC<EditProfileProps> = ({ user, onSave, onCancel, onViewProfile }) => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('My details');
  const [avatarLoading, setAvatarLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    full_name: user.username || '', // Assuming username is used as initial fallback for name
    username: user.username || '',
    headline: user.headline || '',
    bio: user.bio || '',
    website_url: user.website_url || '',
    twitter_url: user.twitter_url || '',
  });

  const sidebarItems = [
    { name: 'Settings', icon: Settings },
    { name: 'My details', icon: UserIcon },
    { name: 'Followed products', icon: CheckCircle2 },
    { name: 'Verification', icon: ShieldCheck }
  ];

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarLoading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      onSave({ avatar_url: publicUrl });
    } catch (err: any) {
      console.error('Upload failed:', err.message);
      alert('Avatar upload failed. Bismillah, please try again.');
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const cleanUsername = formData.username.replace('@', '').toLowerCase().trim();
      const { error } = await supabase
        .from('profiles')
        .update({
          username: cleanUsername,
          headline: formData.headline,
          bio: formData.bio,
          website_url: formData.website_url,
          twitter_url: formData.twitter_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;
      
      onSave({ ...formData, username: cleanUsername });
      alert('Changes saved successfully. Mashallah!');
      onViewProfile();
    } catch (err: any) {
      console.error('Update failed:', err.message);
      alert('Could not save changes. Check if the username is already taken.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-4">
          <button onClick={onCancel} className="p-2.5 hover:bg-white border border-transparent hover:border-gray-100 rounded-full transition-all active:scale-90">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </button>
          <h1 className="text-4xl font-serif font-bold text-gray-900 tracking-tight leading-none">Settings</h1>
        </div>
        <button 
          onClick={onViewProfile}
          className="text-[11px] font-black text-emerald-800 uppercase tracking-[0.2em] flex items-center gap-2 hover:underline"
        >
          View Public Profile <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* Sidebar Nav */}
        <aside className="w-full lg:w-72 shrink-0 space-y-1 sticky top-24">
          {sidebarItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`flex items-center justify-between w-full px-6 py-4 rounded-2xl font-bold text-sm transition-all group ${
                activeTab === item.name 
                  ? 'bg-white text-emerald-800 shadow-md border border-gray-100' 
                  : 'text-gray-400 hover:text-gray-700 hover:bg-white/50'
              }`}
            >
              <div className="flex items-center gap-4">
                <item.icon className="w-4 h-4" />
                {item.name}
              </div>
              {activeTab === item.name && <div className="w-1.5 h-1.5 rounded-full bg-emerald-800" />}
            </button>
          ))}
          
          <div className="pt-8 px-6">
            <button onClick={() => supabase.auth.signOut()} className="flex items-center gap-4 text-red-400 hover:text-red-600 transition-colors font-bold text-sm">
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 w-full lg:max-w-3xl">
          {activeTab === 'My details' ? (
            <div className="bg-white border border-gray-100 rounded-[3rem] shadow-sm p-8 sm:p-12 animate-in slide-in-from-right-4 duration-500">
              <div className="flex flex-col sm:flex-row items-center gap-10 mb-12">
                <div className="relative group shrink-0">
                  <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-emerald-50 shadow-inner bg-gray-50 relative">
                    <SafeImage src={user.avatar_url} alt={user.username} seed={user.username} className="w-full h-full object-cover" />
                    {avatarLoading && (
                      <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                        <Loader2 className="w-6 h-6 text-emerald-800 animate-spin" />
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={avatarLoading}
                    className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-800 rounded-2xl flex items-center justify-center text-white shadow-xl hover:bg-emerald-900 transition-all border-4 border-white"
                  >
                    <Camera className="w-5 h-5" />
                  </button>
                  <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                </div>
                <div className="text-center sm:text-left space-y-2">
                  <h2 className="text-2xl font-bold text-gray-900">Profile Photo</h2>
                  <p className="text-gray-400 font-medium leading-relaxed max-w-sm">
                    Upload a circular photo for the community to recognize you. GIF, PNG, JPG (Max 2MB).
                  </p>
                </div>
              </div>

              <form onSubmit={handleSave} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Full Name</label>
                    <input 
                      type="text" value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                      placeholder="Ahmed Ali" className="w-full px-6 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-800 rounded-2xl outline-none font-bold text-gray-900 transition-all shadow-inner" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Username</label>
                    <div className="relative">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 font-bold">@</span>
                      <input 
                        type="text" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})}
                        className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-800 rounded-2xl outline-none font-bold text-gray-900 transition-all shadow-inner" 
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Professional Headline</label>
                  <input 
                    type="text" value={formData.headline} onChange={(e) => setFormData({...formData, headline: e.target.value})}
                    placeholder="Building ethical tools for the world..."
                    className="w-full px-6 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-800 rounded-2xl outline-none font-bold text-gray-900 transition-all shadow-inner" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Bio</label>
                  <textarea 
                    rows={4} value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    placeholder="Tell us about your mission..."
                    className="w-full px-6 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-800 rounded-3xl outline-none font-medium text-gray-900 transition-all shadow-inner resize-none leading-relaxed" 
                  />
                </div>

                <div className="pt-10 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-800/40 font-black text-[10px] uppercase tracking-widest">
                    <ShieldCheck className="w-4 h-4" /> AES-256 Protection
                  </div>
                  <button 
                    type="submit" disabled={loading}
                    className="px-12 py-4 bg-[#ff6154] hover:bg-[#e6574a] text-white font-black rounded-2xl transition-all shadow-xl shadow-red-900/10 active:scale-[0.98] flex items-center gap-3 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-white border border-gray-100 rounded-[3rem] p-24 text-center animate-in slide-in-from-right-4">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-800 shadow-inner">
                <Bell className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-serif font-bold text-emerald-900 mb-2">Module is Locked</h2>
              <p className="text-gray-400 font-medium">Bismillah! We are currently configuring the <span className="font-black uppercase text-xs px-2 py-1 bg-emerald-50 rounded">{activeTab}</span> dashboard.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default EditProfile;
