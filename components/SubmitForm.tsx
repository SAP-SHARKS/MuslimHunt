
import React, { useState, useEffect } from 'react';
import { 
  X, Wand2, Loader2, Heart, ShieldCheck, ArrowRight, AlertCircle, Info, 
  Database, Calendar, Link as LinkIcon, User as UserIcon, Plus, 
  CheckCircle2, DollarSign, Tag, Clock, Rocket, Sparkles
} from 'lucide-react';
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

enum Step {
  MAIN_INFO = 'Main info',
  MAKERS = 'Makers',
  EXTRAS = 'Extras',
  CHECKLIST = 'Launch checklist'
}

const SubmitForm: React.FC<SubmitFormProps> = ({ initialUrl = '', user, onCancel, onSuccess }) => {
  const [activeStep, setActiveStep] = useState<Step>(Step.MAIN_INFO);
  const [formData, setFormData] = useState({
    name: '',
    url: initialUrl,
    tagline: '',
    description: '',
    category: CATEGORIES[0],
    launchDate: new Date().toISOString().split('T')[0],
    halal_status: HALAL_STATUSES[1],
    sadaqah_info: '',
    logo_url: `https://picsum.photos/seed/${Math.random()}/200/200`,
    isMaker: true,
    pricing: 'Free',
    promoOffer: '',
    promoCode: '',
    promoExpiry: ''
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

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!user) {
      setError({ message: 'You must be signed in to submit a product.' });
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
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
        created_at: new Date(formData.launchDate).toISOString(),
        upvotes_count: 0
      };

      const { error: insertError } = await supabase
        .from('products')
        .insert([payload]);

      if (insertError) {
        throw insertError;
      }
      
      onSuccess();
    } catch (err: any) {
      console.error('[Muslim Hunt] Submission failed:', err);
      setError({ 
        message: err.message || 'Submission failed. Please check your connection.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case Step.MAIN_INFO:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-3xl font-serif font-bold text-emerald-900 mb-6">Main Info</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Name of launch</label>
                <input 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., QuranFlow"
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-emerald-800 rounded-2xl outline-none transition-all text-lg font-bold shadow-inner"
                />
              </div>
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
                    AI Help
                  </button>
                </div>
                <input 
                  required
                  value={formData.tagline}
                  onChange={e => setFormData({...formData, tagline: e.target.value})}
                  placeholder="Short, catchy tagline"
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-emerald-800 rounded-2xl outline-none transition-all text-lg font-bold shadow-inner"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                <LinkIcon className="w-3.5 h-3.5" /> Links
              </label>
              <input 
                required
                type="url"
                value={formData.url}
                onChange={e => setFormData({...formData, url: e.target.value})}
                placeholder="https://yourproduct.com"
                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-emerald-800 rounded-2xl outline-none transition-all text-lg font-bold shadow-inner"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Description</label>
              <textarea 
                required
                rows={5}
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="What does your product do? Why is it great for the Ummah?"
                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-emerald-800 rounded-3xl outline-none transition-all resize-none text-lg font-medium leading-relaxed shadow-inner"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-emerald-800" />
                  Launch Date
                </label>
                <input 
                  required
                  type="date"
                  value={formData.launchDate}
                  onChange={e => setFormData({...formData, launchDate: e.target.value})}
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-emerald-800 rounded-2xl outline-none transition-all text-lg font-bold shadow-inner"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Category</label>
                <select 
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-emerald-800 rounded-2xl outline-none transition-all text-lg font-bold appearance-none cursor-pointer shadow-inner"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="pt-8">
              <button 
                type="button"
                onClick={() => setActiveStep(Step.MAKERS)}
                className="px-10 py-4 bg-emerald-800 text-white rounded-2xl font-black text-lg hover:bg-emerald-900 transition-all flex items-center gap-2"
              >
                Next step: Makers <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        );
      case Step.MAKERS:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-3xl font-serif font-bold text-emerald-900 mb-6">Makers</h3>
            
            <div className="bg-gray-50 p-8 rounded-3xl space-y-6">
              <p className="text-sm font-bold text-gray-700">Did you work on this product?</p>
              <div className="flex gap-4">
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, isMaker: true})}
                  className={`flex-1 py-4 px-6 rounded-2xl border-2 transition-all font-bold text-center ${formData.isMaker ? 'bg-emerald-800 border-emerald-800 text-white' : 'bg-white border-gray-100 text-gray-400 hover:border-emerald-200'}`}
                >
                  I worked on this
                </button>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, isMaker: false})}
                  className={`flex-1 py-4 px-6 rounded-2xl border-2 transition-all font-bold text-center ${!formData.isMaker ? 'bg-emerald-800 border-emerald-800 text-white' : 'bg-white border-gray-100 text-gray-400 hover:border-emerald-200'}`}
                >
                  I didn't work on this
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Add Makers</label>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    placeholder="Search by username or email..."
                    className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-emerald-800 rounded-2xl outline-none transition-all font-bold"
                  />
                </div>
                <button type="button" className="p-4 bg-white border border-gray-100 rounded-2xl hover:bg-emerald-50 text-emerald-800 transition-colors">
                  <Plus className="w-6 h-6" />
                </button>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-2xl">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-emerald-100">
                  <img src={user?.avatar_url} alt={user?.username} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{user?.username} (You)</p>
                  <p className="text-[10px] text-emerald-800 font-black uppercase tracking-widest">Hunter & Maker</p>
                </div>
                <div className="ml-auto">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
            </div>

            <div className="pt-8 flex gap-4">
              <button 
                type="button"
                onClick={() => setActiveStep(Step.MAIN_INFO)}
                className="px-8 py-4 border border-gray-100 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-all"
              >
                Back
              </button>
              <button 
                type="button"
                onClick={() => setActiveStep(Step.EXTRAS)}
                className="px-10 py-4 bg-emerald-800 text-white rounded-2xl font-black text-lg hover:bg-emerald-900 transition-all flex items-center gap-2"
              >
                Next step: Extras <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        );
      case Step.EXTRAS:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-3xl font-serif font-bold text-emerald-900 mb-6">Extras</h3>
            
            <div className="space-y-6">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                <DollarSign className="w-3.5 h-3.5 text-emerald-800" /> Pricing
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {['Free', 'Paid', 'Paid (with trial)'].map((p) => (
                  <button 
                    key={p}
                    type="button"
                    onClick={() => setFormData({...formData, pricing: p})}
                    className={`py-4 px-6 rounded-2xl border-2 transition-all font-bold text-center text-sm ${formData.pricing === p ? 'bg-emerald-800 border-emerald-800 text-white shadow-lg' : 'bg-white border-gray-100 text-gray-400 hover:border-emerald-200'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-8 bg-emerald-50 rounded-[2.5rem] space-y-6 border border-emerald-100/50">
              <div className="flex items-center gap-3 text-emerald-900 font-black uppercase tracking-widest text-xs">
                <Tag className="w-4 h-4" /> Exclusive Promo Offer
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">What is the offer?</label>
                  <input 
                    value={formData.promoOffer}
                    onChange={e => setFormData({...formData, promoOffer: e.target.value})}
                    placeholder="e.g. 20% off forever"
                    className="w-full px-5 py-3 bg-white border border-gray-100 focus:border-emerald-800 rounded-xl outline-none font-bold text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Promo code</label>
                  <input 
                    value={formData.promoCode}
                    onChange={e => setFormData({...formData, promoCode: e.target.value})}
                    placeholder="MUSLIMHUNT20"
                    className="w-full px-5 py-3 bg-white border border-gray-100 focus:border-emerald-800 rounded-xl outline-none font-bold text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Expiration Date</label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  <input 
                    type="date"
                    value={formData.promoExpiry}
                    onChange={e => setFormData({...formData, promoExpiry: e.target.value})}
                    className="w-full pl-12 pr-5 py-3 bg-white border border-gray-100 focus:border-emerald-800 rounded-xl outline-none font-bold text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Halal Status Section integrated here as an extra */}
            <div className="p-8 bg-white border border-emerald-100 rounded-[2.5rem] space-y-6">
              <div className="flex items-center gap-3 text-emerald-900 font-black uppercase tracking-widest text-xs">
                <ShieldCheck className="w-4 h-4" /> Halal Verification
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</label>
                  <select 
                    value={formData.halal_status}
                    onChange={e => setFormData({...formData, halal_status: e.target.value as any})}
                    className="w-full px-5 py-3 bg-gray-50 border border-gray-100 focus:bg-white focus:border-emerald-800 rounded-xl outline-none font-bold text-sm appearance-none"
                  >
                    {HALAL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                    <Heart className="w-3 h-3 text-red-500 fill-red-500" /> Sadaqah
                  </label>
                  <input 
                    value={formData.sadaqah_info}
                    onChange={e => setFormData({...formData, sadaqah_info: e.target.value})}
                    placeholder="e.g. 5% to Gaza"
                    className="w-full px-5 py-3 bg-gray-50 border border-gray-100 focus:bg-white focus:border-emerald-800 rounded-xl outline-none font-bold text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="pt-8 flex gap-4">
              <button 
                type="button"
                onClick={() => setActiveStep(Step.MAKERS)}
                className="px-8 py-4 border border-gray-100 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-all"
              >
                Back
              </button>
              <button 
                type="button"
                onClick={() => setActiveStep(Step.CHECKLIST)}
                className="px-10 py-4 bg-emerald-800 text-white rounded-2xl font-black text-lg hover:bg-emerald-900 transition-all flex items-center gap-2"
              >
                Next step: Launch checklist <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        );
      case Step.CHECKLIST:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-3xl font-serif font-bold text-emerald-900 mb-6">Launch Checklist</h3>
            
            <div className="space-y-4">
              <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  <div>
                    <p className="font-bold text-gray-900">Main info provided</p>
                    <p className="text-xs text-gray-500">Name, tagline, and description are set.</p>
                  </div>
                </div>
                <button onClick={() => setActiveStep(Step.MAIN_INFO)} className="text-xs font-black text-emerald-800 uppercase tracking-widest hover:underline">Edit</button>
              </div>
              <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  <div>
                    <p className="font-bold text-gray-900">Makers identified</p>
                    <p className="text-xs text-gray-500">Product contributors are mapped.</p>
                  </div>
                </div>
                <button onClick={() => setActiveStep(Step.MAKERS)} className="text-xs font-black text-emerald-800 uppercase tracking-widest hover:underline">Edit</button>
              </div>
              <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  <div>
                    <p className="font-bold text-gray-900">Extras configured</p>
                    <p className="text-xs text-gray-500">Pricing and verification are complete.</p>
                  </div>
                </div>
                <button onClick={() => setActiveStep(Step.EXTRAS)} className="text-xs font-black text-emerald-800 uppercase tracking-widest hover:underline">Edit</button>
              </div>
            </div>

            <div className="pt-12">
              <button 
                onClick={() => handleSubmit()}
                disabled={isSubmitting}
                className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-black py-7 rounded-[2.5rem] shadow-2xl shadow-emerald-900/30 transition-all active:scale-[0.98] text-2xl flex items-center justify-center gap-4 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-7 h-7 animate-spin" />
                    Propagating...
                  </>
                ) : (
                  <>
                    Confirm and Launch
                    <Rocket className="w-7 h-7" />
                  </>
                )}
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h2 className="text-4xl font-serif font-bold text-emerald-900 tracking-tight">Launch your product</h2>
          <p className="text-gray-500 mt-2 text-lg font-medium italic">Sharing your contribution with the global Ummah.</p>
        </div>
        <button 
          onClick={onCancel} 
          className="p-3 hover:bg-gray-100 rounded-full transition-all active:scale-95"
        >
          <X className="w-6 h-6 text-gray-400" />
        </button>
      </div>

      <div className="bg-white border border-gray-100 shadow-2xl shadow-emerald-900/5 rounded-[3.5rem] overflow-hidden flex flex-col md:flex-row min-h-[700px]">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-72 bg-gray-50/50 border-r border-gray-50 p-8 pt-12 space-y-2">
          {Object.values(Step).map((step) => {
            const isActive = activeStep === step;
            return (
              <button
                key={step}
                onClick={() => !isSubmitting && setActiveStep(step)}
                className={`w-full text-left px-5 py-3.5 rounded-2xl text-[13px] font-black uppercase tracking-widest transition-all ${isActive ? 'bg-white text-emerald-800 shadow-sm border border-gray-100' : 'text-gray-400 hover:text-emerald-800 hover:bg-white/50'}`}
              >
                {step}
              </button>
            );
          })}
          
          <div className="pt-12 px-5">
            <div className="p-6 bg-emerald-900 rounded-2xl text-white shadow-lg relative overflow-hidden group">
              {/* Fixed: Sparkles is now correctly imported */}
              <Sparkles className="absolute -top-2 -right-2 w-12 h-12 opacity-10 group-hover:scale-125 transition-transform" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-emerald-400">Builder Community</p>
              <p className="text-xs font-bold leading-relaxed">Reach the global Ummah and scale with purpose.</p>
            </div>
          </div>
        </aside>

        {/* Form Content Area */}
        <main className="flex-1 p-8 md:p-16 overflow-y-auto">
          {error && (
            <div className="mb-8 p-5 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span className="text-sm font-bold">{error.message}</span>
            </div>
          )}
          
          {renderStepContent()}
        </main>
      </div>
      
      <p className="text-center text-[10px] font-black text-gray-300 uppercase tracking-[0.4em] mt-12">
        Muslim Hunt • Ecosystem Discovery • Shariah Compliant
      </p>
    </div>
  );
};

export default SubmitForm;
