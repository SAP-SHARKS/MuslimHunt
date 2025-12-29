import React, { useState, useEffect } from 'react';
import { X, Wand2, Loader2, Heart, ShieldCheck, ArrowRight, AlertCircle, Info } from 'lucide-react';
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
  const [error, setError] = useState<{ message: string; isSchemaError?: boolean } | null>(null);

  useEffect(() => {
    if (initialUrl) {
      setFormData(prev => ({ ...prev, url: initialUrl }));
    }
  }, [initialUrl]);

  const handleGeminiOptimize = async () => {
    if (!formData.description) return;
    setIsOptimizing(true);
    try {
      const tagline = await geminiService.optimizeTagline(formData.name, formData.description);
      const category = await geminiService.getCategorySuggestion(formData.description);
      if (tagline) {
        setFormData(prev => ({ ...prev, tagline, category }));
      }
    } catch (err) {
      console.error("Optimization failed", err);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError({ message: 'You must be signed in to submit a product.' });
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Ensure key names exactly match Supabase column names
      const payload = {
        name: formData.name,
        url: formData.url,
        tagline: formData.tagline,
        description: formData.description,
        category: formData.category,
        halal_status: formData.halal_status,
        sadaqah_info: formData.sadaqah_info, // Explicitly mapped
        logo_url: formData.logo_url,
        founder_id: user.id,
        created_at: new Date().toISOString(),
        upvotes_count: 1
      };

      const { error: insertError } = await supabase
        .from('products')
        .insert([payload]);

      if (insertError) {
        const msg = insertError.message.toLowerCase();
        const isSchemaError = msg.includes('column') || msg.includes('schema cache') || insertError.code === '42703';
        throw { ...insertError, isSchemaError };
      }
      
      onSuccess();
    } catch (err: any) {
      console.error('[Muslim Hunt] Submission failed:', err);
      setError({ 
        message: err.message || 'Something went wrong during submission. Please try again.',
        isSchemaError: err.isSchemaError
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h2 className="text-4xl font-serif font-bold text-emerald-900 tracking-tight">Product Details</h2>
          <p className="text-gray-500 mt-2 text-lg font-medium italic">Bismillah! Let's get your product in front of the Ummah.</p>
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
          <div className={`p-6 rounded-2xl border flex flex-col gap-3 animate-in slide-in-from-top-2 ${error.isSchemaError ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-red-50 border-red-100 text-red-600'}`}>
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span className="font-bold">Submission Error</span>
            </div>
            <p className="text-sm font-medium leading-relaxed">
              {error.message}
            </p>
            {error.isSchemaError && (
              <div className="mt-2 p-4 bg-white/60 rounded-xl border border-amber-100 text-xs font-mono space-y-2">
                <p className="font-bold">Developer Hint:</p>
                <p>The Supabase API cache might be out of sync. Please run this SQL in your Supabase dashboard:</p>
                <code className="block bg-gray-900 text-amber-400 p-2 rounded">NOTIFY pgrst, 'reload schema';</code>
              </div>
            )}
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
            placeholder="What does your product do? Be specific about the Halal focus and Ummah impact."
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
                Gemini AI Optimize
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
            Halal Verification & Impact
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Verification Status</label>
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
                Sadaqah Component
              </label>
              <input 
                name="sadaqah_info"
                value={formData.sadaqah_info}
                onChange={e => setFormData({...formData, sadaqah_info: e.target.value})}
                placeholder="e.g. 2.5% profits to Islamic Relief"
                className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl outline-none focus:border-emerald-800 transition-all font-bold text-gray-700 shadow-sm"
              />
            </div>
          </div>
        </div>

        <div className="pt-6">
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#064e3b] hover:bg-[#043d2f] text-white font-black py-6 rounded-[2rem] shadow-2xl shadow-emerald-900/20 transition-all active:scale-[0.98] text-2xl flex items-center justify-center gap-3 disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-7 h-7 animate-spin" />
                Launching...
              </>
            ) : (
              <>
                Confirm Launch
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