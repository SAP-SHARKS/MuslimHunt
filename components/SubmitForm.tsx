import React, { useState, useEffect } from 'react';
import { 
  X, Wand2, Loader2, Heart, ShieldCheck, ArrowRight, AlertCircle, Info, 
  Database, Calendar, Link as LinkIcon, User as UserIcon, Plus, 
  CheckCircle2, DollarSign, Tag, Clock, Rocket, Sparkles, Image as ImageIcon,
  Check, ChevronRight, Globe, Search
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
  MEDIA = 'Images and media',
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
            <div>
              <h3 className="text-3xl font-serif font-bold text-emerald-900 mb-2">Main Info</h3>
              <p className="text-gray-400 text-sm font-medium italic">Tell us the core details of your launch.</p>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Name of launch</label>
                <input 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., QuranFlow"
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-emerald-800 rounded-2xl outline-none transition-all text-lg font-bold shadow-inner"
                />
              </div>

              <div className="space-y-2">
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
                  placeholder="Catchy one-liner"
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-emerald-800 rounded-2xl outline-none transition-all text-lg font-bold shadow-inner"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                  <LinkIcon className="w-3.5 h-3.5" /> Links (URL)
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

              <div className="space-y-2">
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
                <div className="space-y-2">
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
                <div className="space-y-2">
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
            </div>
            
            <div className="pt-8">
              <button 
                type="button"
                onClick={() => setActiveStep(Step.MEDIA)}
                className="px-10 py-5 bg-emerald-800 text-white rounded-2xl font-black text-lg hover:bg-emerald-900 transition-all flex items-center gap-2 shadow-lg shadow-emerald-900/10 active:scale-[0.98]"
              >
                Next step: Images and media <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        );
      case Step.MEDIA:
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h3 className="text-3xl font-serif font-bold text-emerald-900 mb-2">Images and Media</h3>
              <p className="text-gray-400 text-sm font-medium italic">Give your product a visual identity.</p>
            </div>

            <div className="bg-gray-50 p-10 rounded-[2.5rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-4 text-center group hover:border-emerald-200 transition-colors">
              <div className="w-32 h-32 bg-white rounded-3xl flex items-center justify-center text-gray-300 shadow-sm border border-gray-100 group-hover:scale-105 transition-transform">
                <ImageIcon className="w-12 h-12" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">Upload product logo</p>
                <p className="text-sm text-gray-400 font-medium">PNG or JPG, max 2MB. Recommended 240x240.</p>
              </div>
              <button type="button" className="px-6 py-2 bg-white border border-gray-200 rounded-xl text-xs font-black text-gray-500 uppercase tracking-widest hover:bg-emerald-50 hover:text-emerald-800 transition-all">
                Choose File
              </button>
            </div>

            <div className="space-y-4">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Screenshots & Media</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="aspect-video bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-200">
                    <Plus className="w-6 h-6" />
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8 flex gap-4">
              <button 
                type="button"
                onClick={() => setActiveStep(Step.MAIN_INFO)}
                className="px-8 py-4 border-2 border-gray-100 rounded-2xl font-bold text-gray-400 hover:bg-gray-50 transition-all active:scale-[0.98]"
              >
                Back
              </button>
              <button 
                type="button"
                onClick={() => setActiveStep(Step.MAKERS)}
                className="px-10 py-5 bg-emerald-800 text-white rounded-2xl font-black text-lg hover:bg-emerald-900 transition-all flex items-center gap-2 shadow-lg shadow-emerald-900/10 active:scale-[0.98]"
              >
                Next step: Makers <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        );
      case Step.MAKERS:
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h3 className="text-3xl font-serif font-bold text-emerald-900 mb-2">Makers</h3>
              <p className="text-gray-400 text-sm font-medium italic">Credit the people who built this.</p>
            </div>
            
            <div className="bg-gray-50 p-10 rounded-[2.5rem] space-y-8 border border-gray-100">
              <p className="text-lg font-bold text-gray-900 text-center">Did you work on this product?</p>
              <div className="flex flex-col sm:row gap-4">
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, isMaker: true})}
                  className={`flex-1 py-5 px-8 rounded-2xl border-2 transition-all font-black text-center text-sm uppercase tracking-widest ${formData.isMaker ? 'bg-emerald-800 border-emerald-800 text-white shadow-xl shadow-emerald-900/10' : 'bg-white border-gray-100 text-gray-400 hover:border-emerald-200'}`}
                >
                  I worked on this
                </button>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, isMaker: false})}
                  className={`flex-1 py-5 px-8 rounded-2xl border-2 transition-all font-black text-center text-sm uppercase tracking-widest ${!formData.isMaker ? 'bg-emerald-800 border-emerald-800 text-white shadow-xl shadow-emerald-900/10' : 'bg-white border-gray-100 text-gray-400 hover:border-emerald-200'}`}
                >
                  I didn't work on this
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Add by username or email</label>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    placeholder="e.g. ahmedali or ahmed@gmail.com"
                    className="w-full pl-14 pr-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-emerald-800 rounded-2xl outline-none transition-all font-bold text-lg"
                  />
                </div>
                <button type="button" className="p-4 bg-white border-2 border-gray-100 rounded-2xl hover:bg-emerald-50 text-emerald-800 transition-all active:scale-[0.98]">
                  <Plus className="w-7 h-7" />
                </button>
              </div>
              
              <div className="flex items-center gap-4 p-5 bg-white border border-gray-100 rounded-2xl shadow-sm">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-50 shrink-0 shadow-inner">
                  <img src={user?.avatar_url} alt={user?.username} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-bold text-gray-900 truncate">{user?.username} (You)</p>
                  <p className="text-[10px] text-emerald-800 font-black uppercase tracking-[0.2em]">Hunter & Maker</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-800">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="pt-8 flex gap-4">
              <button 
                type="button"
                onClick={() => setActiveStep(Step.MEDIA)}
                className="px-8 py-4 border-2 border-gray-100 rounded-2xl font-bold text-gray-400 hover:bg-gray-50 transition-all active:scale-[0.98]"
              >
                Back
              </button>
              <button 
                type="button"
                onClick={() => setActiveStep(Step.EXTRAS)}
                className="px-10 py-5 bg-emerald-800 text-white rounded-2xl font-black text-lg hover:bg-emerald-900 transition-all flex items-center gap-2 shadow-lg shadow-emerald-900/10 active:scale-[0.98]"
              >
                Next step: Extras <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        );
      case Step.EXTRAS:
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h3 className="text-3xl font-serif font-bold text-emerald-900 mb-2">Extras</h3>
              <p className="text-gray-400 text-sm font-medium italic">Configure pricing and special offers.</p>
            </div>
            
            <div className="space-y-6">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-800" /> Pricing
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {['Free', 'Paid', 'Paid (with trial)'].map((p) => (
                  <button 
                    key={p}
                    type="button"
                    onClick={() => setFormData({...formData, pricing: p})}
                    className={`py-5 px-6 rounded-2xl border-2 transition-all font-black text-center text-xs uppercase tracking-widest ${formData.pricing === p ? 'bg-emerald-800 border-emerald-800 text-white shadow-xl shadow-emerald-900/10' : 'bg-white border-gray-100 text-gray-400 hover:border-emerald-200'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-10 bg-emerald-50 rounded-[3rem] space-y-8 border border-emerald-100/50">
              <div className="flex items-center gap-3 text-emerald-900 font-black uppercase tracking-widest text-xs">
                <Tag className="w-5 h-5 text-emerald-800" /> Exclusive Promo Offer
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">What is the offer?</label>
                  <input 
                    value={formData.promoOffer}
                    onChange={e => setFormData({...formData, promoOffer: e.target.value})}
                    placeholder="e.g. 20% off forever"
                    className="w-full px-6 py-4 bg-white border-2 border-transparent focus:border-emerald-800 rounded-2xl outline-none font-bold text-base shadow-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Promo code</label>
                  <input 
                    value={formData.promoCode}
                    onChange={e => setFormData({...formData, promoCode: e.target.value})}
                    placeholder="MUSLIMHUNT20"
                    className="w-full px-6 py-4 bg-white border-2 border-transparent focus:border-emerald-800 rounded-2xl outline-none font-bold text-base shadow-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Expiration Date</label>
                <div className="relative">
                  <Clock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                  <input 
                    type="date"
                    value={formData.promoExpiry}
                    onChange={e => setFormData({...formData, promoExpiry: e.target.value})}
                    className="w-full pl-14 pr-6 py-4 bg-white border-2 border-transparent focus:border-emerald-800 rounded-2xl outline-none font-bold text-base shadow-sm"
                  />
                </div>
              </div>
            </div>

            <div className="p-10 bg-white border border-emerald-100 rounded-[3rem] space-y-8">
              <div className="flex items-center gap-3 text-emerald-900 font-black uppercase tracking-widest text-xs">
                <ShieldCheck className="w-5 h-5 text-emerald-800" /> Halal Trust
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Verification Status</label>
                  <select 
                    value={formData.halal_status}
                    onChange={e => setFormData({...formData, halal_status: e.target.value as any})}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 focus:bg-white focus:border-emerald-800 rounded-2xl outline-none font-bold text-base appearance-none cursor-pointer"
                  >
                    {HALAL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1 flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-red-500 fill-red-500" /> Sadaqah Component
                  </label>
                  <input 
                    value={formData.sadaqah_info}
                    onChange={e => setFormData({...formData, sadaqah_info: e.target.value})}
                    placeholder="e.g. 5% of profits to charity"
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 focus:bg-white focus:border-emerald-800 rounded-2xl outline-none font-bold text-base"
                  />
                </div>
              </div>
            </div>

            <div className="pt-8 flex gap-4">
              <button 
                type="button"
                onClick={() => setActiveStep(Step.MAKERS)}
                className="px-8 py-4 border-2 border-gray-100 rounded-2xl font-bold text-gray-400 hover:bg-gray-50 transition-all active:scale-[0.98]"
              >
                Back
              </button>
              <button 
                type="button"
                onClick={() => setActiveStep(Step.CHECKLIST)}
                className="px-10 py-5 bg-emerald-800 text-white rounded-2xl font-black text-lg hover:bg-emerald-900 transition-all flex items-center gap-2 shadow-lg shadow-emerald-900/10 active:scale-[0.98]"
              >
                Next step: Launch checklist <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        );
      case Step.CHECKLIST:
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h3 className="text-3xl font-serif font-bold text-emerald-900 mb-2">Launch Checklist</h3>
              <p className="text-gray-400 text-sm font-medium italic">Final review before going live.</p>
            </div>
            
            <div className="space-y-4">
              {[
                { step: Step.MAIN_INFO, label: 'Main info provided', done: !!formData.name && !!formData.tagline },
                { step: Step.MEDIA, label: 'Visual identity set', done: !!formData.logo_url },
                { step: Step.MAKERS, label: 'Makers identified', done: true },
                { step: Step.EXTRAS, label: 'Extras configured', done: true }
              ].map((item, idx) => (
                <div key={idx} className="p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-emerald-600 shadow-sm">
                      <Check className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{item.label}</p>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{item.step}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveStep(item.step)} 
                    className="text-[10px] font-black text-emerald-800 uppercase tracking-widest hover:underline"
                  >
                    Review
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-12">
              <button 
                onClick={() => handleSubmit()}
                disabled={isSubmitting}
                className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-black py-7 rounded-[2.5rem] shadow-2xl shadow-emerald-900/30 transition-all active:scale-[0.98] text-2xl flex items-center justify-center gap-4 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-8 h-8 animate-spin" />
                    Propagating...
                  </>
                ) : (
                  <>
                    Confirm and Launch
                    <Rocket className="w-8 h-8" />
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
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-900 rounded-2xl flex items-center justify-center text-white shadow-xl">
            <span className="font-serif text-2xl font-bold">M</span>
          </div>
          <div>
            <h2 className="text-4xl font-serif font-bold text-emerald-900 tracking-tight">Launch your product</h2>
            <p className="text-gray-500 mt-1 text-base font-medium italic">Bismillah! Contributing to the Ummah tech landscape.</p>
          </div>
        </div>
        <button 
          onClick={onCancel} 
          className="p-3 hover:bg-gray-100 rounded-full transition-all active:scale-95"
        >
          <X className="w-7 h-7 text-gray-400" />
        </button>
      </div>

      <div className="bg-white border border-gray-100 shadow-[0_35px_100px_-15px_rgba(6,78,59,0.08)] rounded-[3.5rem] overflow-hidden flex flex-col md:flex-row min-h-[800px]">
        {/* Left Sidebar Navigation */}
        <aside className="w-full md:w-80 bg-gray-50/50 border-r border-gray-50 p-10 pt-14 space-y-2">
          {Object.values(Step).map((step) => {
            const isActive = activeStep === step;
            return (
              <button
                key={step}
                onClick={() => !isSubmitting && setActiveStep(step)}
                className={`w-full text-left px-6 py-4 rounded-2xl text-[12px] font-black uppercase tracking-[0.2em] transition-all group flex items-center justify-between ${
                  isActive 
                    ? 'bg-white text-emerald-800 shadow-md shadow-emerald-900/5 border border-gray-100' 
                    : 'text-gray-400 hover:text-emerald-800 hover:bg-white/50'
                }`}
              >
                {step}
                {isActive && <ChevronRight className="w-4 h-4 text-emerald-800" />}
              </button>
            );
          })}
          
          <div className="pt-20">
            <div className="p-8 bg-[#064e3b] rounded-[2.5rem] text-white shadow-2xl shadow-emerald-900/20 relative overflow-hidden group">
              <Sparkles className="absolute -top-4 -right-4 w-20 h-20 opacity-10 group-hover:scale-125 transition-transform" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-emerald-400">Maker Hub</p>
              <p className="text-sm font-bold leading-relaxed">Join a community of thousands building for the long-term benefit of the Ummah.</p>
            </div>
          </div>
        </aside>

        {/* Main Form Content Area */}
        <main className="flex-1 p-10 md:p-20 overflow-y-auto custom-scrollbar">
          {error && (
            <div className="mb-10 p-6 bg-red-50 border border-red-100 text-red-600 rounded-3xl flex items-center gap-4 animate-in slide-in-from-top-4">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <div className="flex-1">
                <p className="text-xs font-black uppercase tracking-widest mb-1">Submission Error</p>
                <p className="text-sm font-bold">{error.message}</p>
              </div>
            </div>
          )}
          
          {renderStepContent()}
        </main>
      </div>
      
      <div className="flex items-center justify-center gap-4 mt-16 text-[10px] font-black text-gray-300 uppercase tracking-[0.5em]">
        <span>Muslim Hunt</span>
        <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
        <span>Shariah Compliant</span>
        <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
        <span>Global Discovery</span>
      </div>
    </div>
  );
};

export default SubmitForm;