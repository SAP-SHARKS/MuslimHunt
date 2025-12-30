import React, { useState, useEffect } from 'react';
import { X, Wand2, Loader2, Heart, ShieldCheck, ArrowRight, AlertCircle, Info, Database } from 'lucide-react';
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
      console.error("Gemini optimization failed", err);
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
      // Data Integrity: Every submission is stamped with a precise current timestamp
      const payload = {
        name: formData.name,
        url: formData.url,
        tagline: formData.tagline,
        description: formData.description,
        category: formData.category,
        halal_status: formData.halal_status,
        sadaqah_info: formData.sadaqah_info,
        logo_url: formData.logo_url,
        founder_id: user.id, 
        created_at: new Date().toISOString(), // Mandatory automatic stamping
        upvotes_count: 0
      };

      const { error: insertError } = await supabase
        .from('products')
        .insert([payload]);

      if (insertError) {
        const msg = insertError.message.toLowerCase();
        const isSchemaError = 
          msg.includes('column') || 
          msg.includes('schema cache') || 
          insertError.code === '42703' || 
          insertError.code === 'PGRST204';
        
        throw { ...insertError, isSchemaError };
      }
      
      onSuccess();
    } catch (err: any) {
      console.error('[Muslim Hunt] Submission failed:', err);
      setError({ 
        message: err.message || 'Submission failed. Please check your connection.',
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
          <h2 className="text-4xl font-serif font-bold text-emerald-900 tracking-tight">Launch your product</h2>
          <p className="text-gray-500 mt-2 text-lg font-medium italic">Bismillah! Sharing your contribution with the global Ummah.</p>
        </div>
        <button 
          onClick={onCancel} 
          className="p-3 hover:bg-gray-100 rounded-full transition-all active:scale-95"
        >
          <X className="w-6 h-6 text-gray-400" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10 bg-white p-10 sm:p-14 rounded-[3.5rem] border border-gray-100 shadow-2xl shadow-emerald-900/5">
        {error && (
          <div className={`p-6 rounded-3xl border flex flex-col gap-4 animate-in slide-in-from-top-4 ${error.isSchemaError ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-red-50 border-red-100 text-red-600'}`}>
            <div className="flex items-center gap-3">
              <AlertCircle className={`w-6 h-6 shrink-0 ${error.isSchemaError ? 'text-amber-600' : 'text-red-500'}`} />
              <span className="font-black uppercase tracking-widest text-sm">Submission Error</span>
            </div>
            <p className="text-sm font-bold leading-relaxed px-1">
              {error.message}
            </p>
            {error.isSchemaError && (
              <div className="mt-2 p-5 bg-white/70 rounded-2xl border border-amber-100 space-y-4">
                <div className="flex items-center gap-2 text-amber-800">
                  <Database className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">PostgREST Schema Out of Sync</span>
                </div>
                <p className="text-[12px] font-medium leading-relaxed">
                  The API hasn't recognized your new database columns yet. To fix this permanently, run the trigger script in <b>supabase_schema.sql</b>. For an immediate fix, run this manual command in your SQL Editor:
                </p>
                <div className="relative group/code">
                  <code className="block bg-gray-900 text-amber-400 p-4 rounded-xl border border-gray-800 shadow-inner font-mono text-xs overflow-x-auto">
                    NOTIFY pgrst, 'reload schema';
                  </code>
                </div>
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
              className="w-full px-6 py-5 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-emerald-800 rounded-2xl outline-none transition-all text-lg font-bold shadow-inner"
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
              className="w-full px-6 py-5 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-emerald-800 rounded-2xl outline-none transition-all text-lg font-bold shadow-inner"
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
            className="w-full px-6 py-5 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-emerald-800 rounded-3xl outline-none transition-all resize-none text-lg font-medium leading-relaxed shadow-inner"
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
              className="w-full px-6 py-5 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-emerald-800 rounded-2xl outline-none transition-all text-lg font-bold shadow-inner"
            />
          </div>
          <div className="space-y-3">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Category</label>
            <div className="relative">
              <select 
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                className="w-full px-6 py-5 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-emerald-800 rounded-2xl outline-none transition-all text-lg font-bold appearance-none cursor-pointer shadow-inner"
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
        <div className="p-8 sm:p-12 bg-emerald-50/50 rounded-[3rem] border border-emerald-100/50 space-y-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
            <ShieldCheck className="w-64 h-64" />
          </div>
          
          <div className="flex items-center gap-3 text-emerald-900 font-black uppercase tracking-[0.15em] text-sm relative z-10">
            <ShieldCheck className="w-6 h-6 text-emerald-800" />
            Verification & Impact Profile
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Verification Status</label>
              <select 
                value={formData.halal_status}
                onChange={e => setFormData({...formData, halal_status: e.target.value as any})}
                className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl outline-none focus:border-emerald-800 transition-all font-bold text-gray-700 shadow-sm appearance-none"
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
                placeholder="e.g. 2.5% profits to Gaza"
                className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl outline-none focus:border-emerald-800 transition-all font-bold text-gray-700 shadow-sm"
              />
            </div>
          </div>
        </div>

        <div className="pt-6">
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#064e3b] hover:bg-[#043d2f] text-white font-black py-7 rounded-[2.5rem] shadow-2xl shadow-emerald-900/30 transition-all active:scale-[0.98] text-2xl flex items-center justify-center gap-4 disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-7 h-7 animate-spin" />
                Propagating to API...
              </>
            ) : (
              <>
                Confirm and Launch
                <ArrowRight className="w-7 h-7" />
              </>
            )}
          </button>
        </div>
        
        <p className="text-center text-[10px] font-black text-gray-300 uppercase tracking-[0.4em]">
          Muslim Hunt • Ecosystem Discovery • Shariah Compliant
        </p>
      </form>
    </div>
  );
};

export default SubmitForm;