import React, { useState, useEffect } from 'react';
import { Upload, X, Wand2, Loader2, Heart, ShieldCheck, ArrowRight } from 'lucide-react';
import { CATEGORIES, HALAL_STATUSES } from '../constants';
import { geminiService } from '../services/geminiService';
import { supabase } from '../lib/supabase';
import { User } from '../types';

interface SubmitFormProps {
  initialUrl?: string;
  user: User | null;
  onCancel: () => void;
  onSuccess: () => void;
}

const SubmitForm: React.FC<SubmitFormProps> = ({ initialUrl = '', user, onCancel, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    url: initialUrl,
    tagline: '',
    description: '',
    category: CATEGORIES[0],
    halal_status: HALAL_STATUSES[1], // Default to Self-Certified
    sadaqah_info: '',
    logo_url: `https://picsum.photos/seed/${Math.random()}/200/200`
  });
  
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialUrl) {
      setFormData(prev => ({ ...prev, url: initialUrl }));
    }
  }, [initialUrl]);

  const handleGeminiOptimize = async () => {
    if (!formData.description) return;
    setIsOptimizing(true);
    const tagline = await geminiService.optimizeTagline(formData.name, formData.description);
    const category = await geminiService.getCategorySuggestion(formData.description);
    if (tagline) {
      setFormData(prev => ({ ...prev, tagline, category }));
    }
    setIsOptimizing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('You must be signed in to submit a product.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const { error: insertError } = await supabase
        .from('products')
        .insert([{
          ...formData,
          founder_id: user.id,
          created_at: new Date().toISOString(),
          upvotes_count: 1 // Start with 1 upvote from the founder
        }]);

      if (insertError) throw insertError;
      
      onSuccess();
    } catch (err: any) {
      console.error('[Muslim Hunt] Submission failed:', err);
      setError(err.message || 'Something went wrong during submission. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h2 className="text-4xl font-serif font-bold text-emerald-900 tracking-tight">Tell us more about the product</h2>
          <p className="text-gray-500 mt-2 text-lg font-medium">Join the ecosystem of Halal-conscious builders.</p>
        </div>
        <button 
          onClick={onCancel} 
          className="p-3 hover:bg-gray-100 rounded-full transition-all active:scale-95"
        >
          <X className="w-6 h-6 text-gray-400" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10 bg-white p-10 sm:p-14 rounded-[3rem] border border-gray-100 shadow-2xl shadow-emerald-900/5">
        {error && (
          <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-bold flex items-center gap-3">
            <X className="w-5 h-5" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-3">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Product Name</label>
            <input 
              required
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="e.g., QuranFlow"
              className="w-full px-6 py-5 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-emerald-800 rounded-2xl outline-none transition-all text-lg font-bold"
            />
          </div>
          <div className="space-y-3">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Website URL</label>
            <input 
              required
              type="url"
              value={formData.url}
              onChange={e => setFormData({...formData, url: e.target.value})}
              placeholder="https://yourproduct.com"
              className="w-full px-6 py-5 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-emerald-800 rounded-2xl outline-none transition-all text-lg font-bold"
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Description</label>
          <textarea 
            required
            rows={5}
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
            placeholder="What does your product do? Who is it for? Be specific about the Halal focus and Ummah impact."
            className="w-full px-6 py-5 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-emerald-800 rounded-3xl outline-none transition-all resize-none text-lg font-medium leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Tagline</label>
              <button 
                type="button"
                onClick={handleGeminiOptimize}
                disabled={isOptimizing || !formData.description}
                className="text-[10px] flex items-center gap-1.5 text-emerald-800 hover:text-emerald-900 disabled:opacity-50 font-black uppercase tracking-widest transition-all"
              >
                {isOptimizing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
                Gemini Optimize
              </button>
            </div>
            <input 
              required
              value={formData.tagline}
              onChange={e => setFormData({...formData, tagline: e.target.value})}
              placeholder="1-sentence catchy tagline"
              className="w-full px-6 py-5 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-emerald-800 rounded-2xl outline-none transition-all text-lg font-bold"
            />
          </div>
          <div className="space-y-3">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Category</label>
            <div className="relative">
              <select 
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                className="w-full px-6 py-5 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-emerald-800 rounded-2xl outline-none transition-all text-lg font-bold appearance-none cursor-pointer"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <ArrowRight className="w-5 h-5 rotate-90" />
              </div>
            </div>
          </div>
        </div>

        {/* Halal Trust Section */}
        <div className="p-8 sm:p-10 bg-emerald-50/50 rounded-[2.5rem] border border-emerald-100/50 space-y-8">
          <div className="flex items-center gap-3 text-emerald-900 font-black uppercase tracking-[0.15em] text-sm">
            <ShieldCheck className="w-6 h-6 text-emerald-800" />
            Halal Trust & Community Impact
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Halal Verification Status</label>
              <select 
                value={formData.halal_status}
                onChange={e => setFormData({...formData, halal_status: e.target.value as any})}
                className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl outline-none focus:border-emerald-800 transition-all font-bold text-gray-700 shadow-sm appearance-none"
              >
                {HALAL_STATUSES.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                Sadaqah Component (Optional)
              </label>
              <input 
                value={formData.sadaqah_info}
                onChange={e => setFormData({...formData, sadaqah_info: e.target.value})}
                placeholder="e.g. 5% profits to Gaza"
                className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl outline-none focus:border-emerald-800 transition-all font-bold text-gray-700 shadow-sm"
              />
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row gap-4">
          <button 
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-[#064e3b] hover:bg-[#043d2f] text-white font-black py-6 rounded-[2rem] shadow-2xl shadow-emerald-900/20 transition-all active:scale-[0.98] text-2xl flex items-center justify-center gap-3 disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-7 h-7 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                Submit for Review
                <ArrowRight className="w-7 h-7" />
              </>
            )}
          </button>
        </div>
        
        <p className="text-center text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">
          Muslim Hunt • Ecosystem Discovery • Shariah Compliant
        </p>
      </form>
    </div>
  );
};

export default SubmitForm;