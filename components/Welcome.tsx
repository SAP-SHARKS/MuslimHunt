import React, { useState, useEffect } from 'react';
import { User, Check, Mail, Info, Loader2, Sparkles, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase.ts';
import WelcomeSkeleton from './WelcomeSkeleton.tsx';

interface WelcomeProps {
  onComplete: (data: any) => void;
  userEmail: string;
  userId: string;
}

const Welcome: React.FC<WelcomeProps> = ({ onComplete, userEmail, userId }) => {
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

  useEffect(() => {
    const fetchExistingProfile = async () => {
      if (!userId) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (data) {
          setFormData(prev => ({
            ...prev,
            fullName: data.full_name || prev.fullName,
            username: data.username || prev.username,
            headline: data.headline || prev.headline,
            linkedinUrl: data.linkedin_url || prev.linkedinUrl,
            twitterUrl: data.twitter_url || prev.twitterUrl,
            preferences: {
              ...prev.preferences,
              ...data.newsletter_preferences
            }
          }));
        }
      } catch (error) {
        console.log('[Welcome] No existing profile found or error fetching:', error);
      }
    };

    fetchExistingProfile();
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Prepare data for Supabase profiles table
      const profileUpdates = {
        id: userId,
        username: formData.username,
        full_name: formData.fullName,
        headline: formData.headline,
        linkedin_url: formData.linkedinUrl,
        twitter_url: formData.twitterUrl,
        newsletter_leaderboard: formData.preferences.leaderboard,
        newsletter_roundup: formData.preferences.roundup,
        newsletter_frontier: formData.preferences.frontier,
        newsletter_preferences: formData.preferences, // Store full JSON for flexibility
        email: userEmail,
        updated_at: new Date().toISOString(),
      };

      // 2. Upsert into Supabase
      const { error } = await supabase
        .from('profiles')
        .upsert(profileUpdates, { onConflict: 'id' });

      if (error) {
        throw error;
      }

      // 3. Complete
      onComplete(formData);
    } catch (error) {
      console.error('[Welcome] Error updating profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
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

  if (loading) return <WelcomeSkeleton />;

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-700">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-primary-light rounded-[2rem] flex items-center justify-center text-primary mx-auto mb-6 shadow-inner border border-primary-light/50">
            <Sparkles className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-serif font-bold text-primary tracking-tight mb-3">Welcome to Muslim Hunt</h1>
          <p className="text-lg text-gray-500 font-medium">Let's set up your profile to get you started.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Section 1: Profile Details */}
          <section className="bg-white border border-gray-100 rounded-[2.5rem] p-8 sm:p-10 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-primary-light rounded-xl flex items-center justify-center text-primary">
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
                  className="w-full px-5 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-primary rounded-2xl outline-none transition-all text-sm font-bold"
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
                    className="w-full pl-10 pr-5 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-primary rounded-2xl outline-none transition-all text-sm font-bold"
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
                  className="w-full px-5 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-primary rounded-2xl outline-none transition-all text-sm font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">X (Twitter) URL</label>
                <input
                  type="url"
                  value={formData.twitterUrl}
                  onChange={e => setFormData({ ...formData, twitterUrl: e.target.value })}
                  placeholder="x.com/..."
                  className="w-full px-5 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-primary rounded-2xl outline-none transition-all text-sm font-bold"
                />
              </div>
            </div>
          </section>

          {/* Section 2: Professional Headline */}
          <section className="bg-white border border-gray-100 rounded-[2.5rem] p-8 sm:p-10 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-primary-light rounded-xl flex items-center justify-center text-primary">
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
                className="w-full px-5 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-primary rounded-2xl outline-none transition-all text-sm font-bold resize-none"
              />
            </div>
          </section>

          {/* Section 3: Newsletter Preferences */}
          <section className="bg-white border border-gray-100 rounded-[2.5rem] p-8 sm:p-10 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-primary-light rounded-xl flex items-center justify-center text-primary">
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
                  className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl cursor-pointer hover:bg-primary-light/50 transition-colors group"
                >
                  <div>
                    <p className="text-sm font-bold text-gray-900">{news.title}</p>
                    <p className="text-xs font-medium text-gray-500">{news.desc}</p>
                  </div>
                  <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${formData.preferences[news.id as keyof typeof formData.preferences]
                    ? 'bg-primary border-primary text-white'
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
                <Loader2 className="w-6 h-6 animate-spin" />
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
