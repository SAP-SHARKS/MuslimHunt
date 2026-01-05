
import React, { useState } from 'react';
/* Added ArrowRight to imports and cleaned up unused LinkedIn/Twitter icons */
import { User, Check, Mail, Info, Loader2, Sparkles, ArrowRight } from 'lucide-react';

interface WelcomeProps {
  onComplete: (data: any) => void;
  userEmail: string;
}

const Welcome: React.FC<WelcomeProps> = ({ onComplete, userEmail }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    username: userEmail.split('@')[0] || '',
    linkedinUrl: '',
    twitterUrl: '',
    headline: '',
    preferences: {
      leaderboard: true,
      roundup: true,
      frontier: false
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // onboardingData is passed to onComplete which handles the actual Supabase saving
    await onComplete(formData);
    // Loading is kept true while parent redirects or if error occurs
    setLoading(false);
  };

  const togglePreference = (key: keyof typeof formData.preferences) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: !prev.preferences[key]
      }
    }));
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-700">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-emerald-50 rounded-[2rem] flex items-center justify-center text-emerald-800 mx-auto mb-6 shadow-inner border border-emerald-100/50">
            <Sparkles className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-serif font-bold text-emerald-900 tracking-tight mb-3">Welcome to Muslim Hunt</h1>
          <p className="text-lg text-gray-500 font-medium">Let's set up your profile to get you started.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Section 1: Profile Details */}
          <section className="bg-white border border-gray-100 rounded-[2.5rem] p-8 sm:p-10 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-800">
                <User className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Profile Details</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Full Name</label>
                <input
                  required
                  type="text"
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Ahmed Ali"
                  className="w-full px-5 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-800 rounded-2xl outline-none transition-all text-sm font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Username</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">@</span>
                  <input
                    required
                    type="text"
                    value={formData.username}
                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                    className="w-full pl-10 pr-5 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-800 rounded-2xl outline-none transition-all text-sm font-bold"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">LinkedIn URL</label>
                <input
                  type="url"
                  value={formData.linkedinUrl}
                  onChange={e => setFormData({ ...formData, linkedinUrl: e.target.value })}
                  placeholder="linkedin.com/in/..."
                  className="w-full px-5 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-800 rounded-2xl outline-none transition-all text-sm font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">X (Twitter) URL</label>
                <input
                  type="url"
                  value={formData.twitterUrl}
                  onChange={e => setFormData({ ...formData, twitterUrl: e.target.value })}
                  placeholder="x.com/..."
                  className="w-full px-5 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-800 rounded-2xl outline-none transition-all text-sm font-bold"
                />
              </div>
            </div>
          </section>

          {/* Section 2: Professional Headline */}
          <section className="bg-white border border-gray-100 rounded-[2.5rem] p-8 sm:p-10 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-800">
                <Info className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Professional Headline</h2>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">What do you do?</label>
              <textarea
                required
                rows={3}
                value={formData.headline}
                onChange={e => setFormData({ ...formData, headline: e.target.value })}
                placeholder="e.g. Co-founder and storyteller. Building a social app for the Ummah."
                className="w-full px-5 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-800 rounded-2xl outline-none transition-all text-sm font-bold resize-none"
              />
            </div>
          </section>

          {/* Section 3: Newsletter Preferences */}
          <section className="bg-white border border-gray-100 rounded-[2.5rem] p-8 sm:p-10 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-800">
                <Mail className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Newsletter Preferences</h2>
            </div>
            
            <div className="space-y-4">
              {[
                { id: 'leaderboard', title: 'The Leaderboard', desc: 'Weekly top products and launches.' },
                { id: 'roundup', title: 'The Roundup', desc: 'Daily news from the tech ecosystem.' },
                { id: 'frontier', title: 'The Frontier', desc: 'Deep dives into AI and technical shifts.' }
              ].map(news => (
                <div 
                  key={news.id}
                  onClick={() => togglePreference(news.id as any)}
                  className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl cursor-pointer hover:bg-emerald-50/50 transition-colors group"
                >
                  <div>
                    <p className="text-sm font-bold text-gray-900">{news.title}</p>
                    <p className="text-xs font-medium text-gray-500">{news.desc}</p>
                  </div>
                  <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                    formData.preferences[news.id as keyof typeof formData.preferences]
                      ? 'bg-emerald-800 border-emerald-800 text-white'
                      : 'border-gray-200 group-hover:border-emerald-300'
                  }`}>
                    {formData.preferences[news.id as keyof typeof formData.preferences] && <Check className="w-4 h-4" />}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Footer Action */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#ff6154] hover:bg-[#e6574a] text-white font-black py-5 rounded-[2rem] shadow-xl shadow-red-900/10 transition-all active:scale-[0.98] text-xl flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  Complete
                  <ArrowRight className="w-6 h-6" />
                </>
              )}
            </button>
            <p className="mt-6 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">
              Secured by Supabase & Muslim Hunt
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Welcome;
