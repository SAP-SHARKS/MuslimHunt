
import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, Wand2, Loader2, Heart, ShieldCheck, ArrowRight, AlertCircle, Info, 
  Calendar, Link as LinkIcon, User as UserIcon, Plus, 
  CheckCircle2, DollarSign, Tag, Clock, Rocket, Sparkles, Image as ImageIcon,
  Check, ChevronRight, Search, ChevronDown, MessageSquare, Ticket, AlertTriangle
} from 'lucide-react';
import { HALAL_STATUSES } from '../constants';
import { geminiService } from '../services/geminiService';
import { supabase } from '../lib/supabase';
import { User, Category, Product } from '../types';

interface SubmissionFlowProps {
  initialUrl?: string;
  user: User | null;
  categories: Category[];
  onCancel: () => void;
  onSuccess: (product: Product) => void;
}

enum Step {
  MAIN_INFO = 'Main info',
  MEDIA = 'Images and media',
  MAKERS = 'Makers',
  EXTRAS = 'Extras',
  CHECKLIST = 'Launch checklist'
}

const SubmissionFlow: React.FC<SubmissionFlowProps> = ({ initialUrl = '', user, categories, onCancel, onSuccess }) => {
  const [activeStep, setActiveStep] = useState<Step>(Step.MAIN_INFO);
  const [isDone, setIsDone] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    url: initialUrl,
    tagline: '',
    description: '',
    category: '',
    scheduledDate: new Date().toISOString().split('T')[0],
    halal_status: HALAL_STATUSES[1],
    logo_url: `https://picsum.photos/seed/${Math.random()}/200/200`,
    isMaker: true,
    pricing: 'Free',
    promoOffer: '',
    promoCode: '',
    promoExpiry: '',
    firstComment: ''
  });

  useEffect(() => {
    if (!formData.category && categories.length > 0) {
      const defaultCat = categories.find(c => c.name === 'Productivity') || categories[0];
      setFormData(prev => ({ ...prev, category: defaultCat.name }));
    }
  }, [categories, formData.category]);

  const handleGeminiOptimize = async () => {
    if (!formData.description) return;
    setIsOptimizing(true);
    try {
      const tagline = await geminiService.optimizeTagline(formData.name, formData.description);
      const categorySuggestion = await geminiService.getCategorySuggestion(formData.description);
      setFormData(prev => ({ ...prev, tagline, category: categorySuggestion }));
    } finally {
      setIsOptimizing(false);
    }
  };

  const checklistStatus = {
    name: !!formData.name.trim(),
    tagline: !!formData.tagline.trim(),
    description: !!formData.description.trim(),
    url: !!formData.url.trim() && formData.url.startsWith('http'),
    category: !!formData.category,
    thumbnail: !!formData.logo_url
  };

  const canLaunch = Object.values(checklistStatus).every(status => status);

  const handleSubmit = async () => {
    if (!user) { setError('You must be signed in to submit.'); return; }
    if (!canLaunch) { setError('Please complete all required fields in the checklist.'); return; }
    
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
        logo_url: formData.logo_url,
        founder_id: user.id,
        created_at: new Date(formData.scheduledDate).toISOString(),
        is_approved: false,
        upvotes_count: 0,
        metadata: {
          pricing: formData.pricing,
          first_comment: formData.firstComment,
          promo: {
            offer: formData.promoOffer,
            code: formData.promoCode,
            expiry: formData.promoExpiry
          }
        }
      };

      const { data, error: insertError } = await supabase.from('products').insert([payload]).select();
      if (insertError) throw insertError;
      
      setIsDone(true);
      setTimeout(() => onSuccess(data[0] as Product), 4000);
    } catch (err: any) {
      setError(err.message || 'Submission failed. Please check your inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const groupedCategories = useMemo(() => {
    const groups: { parent: string; items: Category[] }[] = [];
    categories.forEach(cat => {
      let group = groups.find(g => g.parent === cat.parent_category);
      if (!group) {
        group = { parent: cat.parent_category, items: [] };
        groups.push(group);
      }
      group.items.push(cat);
    });
    return groups;
  }, [categories]);

  if (isDone) {
    return (
      <div className="max-w-2xl mx-auto py-32 px-4 text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="w-24 h-24 bg-emerald-50 rounded-[3rem] flex items-center justify-center text-emerald-800 mx-auto mb-8 shadow-inner border border-emerald-100/50">
          <ShieldCheck className="w-12 h-12" />
        </div>
        <h2 className="text-4xl font-serif font-bold text-emerald-900 mb-4 tracking-tight">Bismillah! Submitted.</h2>
        <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-lg mx-auto mb-10">
          Your product is now under review by the Admin. You will see it on the feed once approved.
        </p>
        <div className="flex items-center justify-center gap-2 text-emerald-800 font-black uppercase tracking-widest text-[10px]">
          <Loader2 className="w-4 h-4 animate-spin" />
          Returning to home...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-900 rounded-2xl flex items-center justify-center text-white shadow-xl">
            <Rocket className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-4xl font-serif font-bold text-emerald-900 tracking-tight">Launch your product</h2>
            <p className="text-gray-500 text-sm font-medium italic">Building for the global Muslim community.</p>
          </div>
        </div>
        <button onClick={onCancel} className="p-3 hover:bg-gray-100 rounded-full transition-all active:scale-95">
          <X className="w-7 h-7 text-gray-400" />
        </button>
      </div>

      <div className="bg-white border border-gray-100 shadow-2xl rounded-[3.5rem] overflow-hidden flex flex-col md:flex-row min-h-[750px]">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-80 bg-gray-50/50 border-r border-gray-50 p-10 space-y-2">
          {Object.values(Step).map((step) => {
            const isActive = activeStep === step;
            return (
              <button 
                key={step} 
                onClick={() => setActiveStep(step as Step)}
                className={`w-full text-left px-6 py-4 rounded-2xl text-[12px] font-black uppercase tracking-[0.2em] transition-all group flex items-center justify-between ${
                  isActive ? 'bg-white text-emerald-800 shadow-md border border-gray-100' : 'text-gray-400 hover:text-emerald-800 hover:bg-white/50'
                }`}
              >
                {step}{isActive && <ChevronRight className="w-4 h-4 text-emerald-800" />}
              </button>
            );
          })}
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-10 md:p-16 overflow-y-auto">
          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <p className="text-sm font-bold">{error}</p>
            </div>
          )}

          {activeStep === Step.MAIN_INFO && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Product Name</label>
                  <input 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. QuranFlow"
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
                      {isOptimizing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />} AI Assist
                    </button>
                  </div>
                  <input 
                    value={formData.tagline}
                    onChange={e => setFormData({...formData, tagline: e.target.value})}
                    placeholder="Catchy one-liner"
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-emerald-800 rounded-2xl outline-none transition-all text-lg font-bold shadow-inner"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Links</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                    <input 
                      value={formData.url}
                      onChange={e => setFormData({...formData, url: e.target.value})}
                      placeholder="https://..."
                      className="w-full pl-14 pr-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-emerald-800 rounded-2xl outline-none transition-all text-lg font-bold shadow-inner"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Description</label>
                  <textarea 
                    rows={4}
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    placeholder="What does your product do and why did you build it?"
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-emerald-800 rounded-3xl outline-none transition-all resize-none text-base font-medium shadow-inner"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Category</label>
                    <div className="relative">
                      <select 
                        value={formData.category}
                        onChange={e => setFormData({...formData, category: e.target.value})}
                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-emerald-800 rounded-2xl outline-none transition-all text-sm font-bold appearance-none cursor-pointer"
                      >
                        {groupedCategories.map(group => (
                          <optgroup key={group.parent} label={group.parent} className="font-black text-[10px] uppercase">
                            {group.items.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                          </optgroup>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Launch Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                      <input 
                        type="date"
                        value={formData.scheduledDate}
                        onChange={e => setFormData({...formData, scheduledDate: e.target.value})}
                        className="w-full pl-14 pr-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-emerald-800 rounded-2xl outline-none transition-all text-sm font-bold shadow-inner"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-4">
                <button onClick={() => setActiveStep(Step.MEDIA)} className="px-10 py-5 bg-emerald-800 text-white rounded-2xl font-black text-lg hover:bg-emerald-900 transition-all flex items-center gap-2 shadow-lg active:scale-95">
                  Continue <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {activeStep === Step.MEDIA && (
            <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="bg-gray-50 p-16 rounded-[3rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-6 text-center hover:border-emerald-200 transition-colors">
                <div className="w-32 h-32 bg-white rounded-3xl flex items-center justify-center text-gray-200 shadow-inner border border-gray-100">
                  <ImageIcon className="w-16 h-16" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Upload product logo</h3>
                  <p className="text-sm text-gray-400 font-medium">Recommended: 240x240 PNG or SVG.</p>
                </div>
                <button className="px-8 py-3 bg-white border border-gray-200 rounded-xl text-xs font-black text-gray-500 hover:text-emerald-800 transition-all">Select Image</button>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setActiveStep(Step.MAIN_INFO)} className="px-8 py-4 text-gray-400 font-bold hover:text-gray-600">Back</button>
                <button onClick={() => setActiveStep(Step.MAKERS)} className="px-10 py-5 bg-emerald-800 text-white rounded-2xl font-black text-lg hover:bg-emerald-900 transition-all flex items-center gap-2 shadow-lg">Next: Makers <ArrowRight className="w-5 h-5" /></button>
              </div>
            </div>
          )}

          {activeStep === Step.MAKERS && (
            <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="p-10 bg-gray-50 rounded-[3rem] space-y-8 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 text-center">Are you the maker of this product?</h3>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setFormData({...formData, isMaker: true})}
                    className={`flex-1 py-6 px-8 rounded-2xl border-2 transition-all font-black uppercase text-sm ${formData.isMaker ? 'bg-emerald-800 border-emerald-800 text-white shadow-xl' : 'bg-white border-gray-100 text-gray-400 hover:border-emerald-200'}`}
                  >
                    I'm the maker
                  </button>
                  <button 
                    onClick={() => setFormData({...formData, isMaker: false})}
                    className={`flex-1 py-6 px-8 rounded-2xl border-2 transition-all font-black uppercase text-sm ${!formData.isMaker ? 'bg-emerald-800 border-emerald-800 text-white shadow-xl' : 'bg-white border-gray-100 text-gray-400 hover:border-emerald-200'}`}
                  >
                    I'm just a fan
                  </button>
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setActiveStep(Step.MEDIA)} className="px-8 py-4 text-gray-400 font-bold hover:text-gray-600">Back</button>
                <button onClick={() => setActiveStep(Step.EXTRAS)} className="px-10 py-5 bg-emerald-800 text-white rounded-2xl font-black text-lg hover:bg-emerald-900 transition-all flex items-center gap-2 shadow-lg">Next: Extras <ArrowRight className="w-5 h-5" /></button>
              </div>
            </div>
          )}

          {activeStep === Step.EXTRAS && (
            <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-800" /> Pricing Structure
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {['Free', 'Paid', 'Paid (with trial)'].map(p => (
                      <button 
                        key={p} 
                        onClick={() => setFormData({...formData, pricing: p})}
                        className={`py-5 px-6 rounded-2xl border-2 transition-all font-black uppercase text-xs ${formData.pricing === p ? 'bg-emerald-800 border-emerald-800 text-white shadow-lg' : 'bg-gray-50 border-transparent text-gray-400 hover:bg-white hover:border-emerald-200'}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-8 bg-gray-50 rounded-[3rem] border border-gray-100 space-y-6">
                  <h4 className="flex items-center gap-3 text-gray-900 font-black uppercase tracking-widest text-xs">
                    <Ticket className="w-5 h-5 text-emerald-800" /> Community Offer (Optional)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Offer Title</label>
                      <input 
                        value={formData.promoOffer}
                        onChange={e => setFormData({...formData, promoOffer: e.target.value})}
                        placeholder="e.g. 20% off forever"
                        className="w-full px-4 py-3 bg-white border border-gray-100 focus:border-emerald-800 rounded-xl outline-none font-bold text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Promo Code</label>
                      <input 
                        value={formData.promoCode}
                        onChange={e => setFormData({...formData, promoCode: e.target.value})}
                        placeholder="MUSLIMHUNT20"
                        className="w-full px-4 py-3 bg-white border border-gray-100 focus:border-emerald-800 rounded-xl outline-none font-black text-sm uppercase"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-emerald-800" /> First Comment
                  </label>
                  <textarea 
                    rows={3}
                    value={formData.firstComment}
                    onChange={e => setFormData({...formData, firstComment: e.target.value})}
                    placeholder="Tell the community why you're launching this today..."
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-emerald-800 rounded-3xl outline-none transition-all resize-none text-base font-medium shadow-inner"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setActiveStep(Step.MAKERS)} className="px-8 py-4 text-gray-400 font-bold hover:text-gray-600">Back</button>
                <button onClick={() => setActiveStep(Step.CHECKLIST)} className="px-10 py-5 bg-emerald-800 text-white rounded-2xl font-black text-lg hover:bg-emerald-900 transition-all flex items-center gap-2 shadow-lg">Next: Checklist <ArrowRight className="w-5 h-5" /></button>
              </div>
            </div>
          )}

          {activeStep === Step.CHECKLIST && (
            <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <h3 className="text-3xl font-serif font-bold text-emerald-900 mb-2">Final Review</h3>
                <p className="text-gray-400 text-sm font-medium italic">Make sure everything is perfect before launching.</p>
              </div>

              <div className="space-y-4">
                {[
                  { id: 'name', label: 'Product Name', status: checklistStatus.name },
                  { id: 'tagline', label: 'Catchy Tagline', status: checklistStatus.tagline },
                  { id: 'description', label: 'Clear Description', status: checklistStatus.description },
                  { id: 'url', label: 'Valid Product URL', status: checklistStatus.url },
                  { id: 'category', label: 'Primary Category', status: checklistStatus.category },
                  { id: 'thumbnail', label: 'Product Thumbnail', status: checklistStatus.thumbnail }
                ].map(item => (
                  <div key={item.id} className="p-5 bg-gray-50 rounded-[1.5rem] border border-gray-100 flex items-center justify-between">
                    <span className="font-bold text-gray-700">{item.label}</span>
                    {item.status ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    ) : (
                      <div className="flex items-center gap-2 text-red-500 font-black uppercase text-[10px]">
                        Missing <AlertTriangle className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-8">
                <button 
                  onClick={handleSubmit}
                  disabled={isSubmitting || !canLaunch}
                  className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-black py-6 rounded-[2.5rem] shadow-2xl transition-all active:scale-95 text-xl flex items-center justify-center gap-4 disabled:opacity-50 disabled:grayscale"
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-8 h-8 animate-spin" /> Propagating...</>
                  ) : (
                    <><Rocket className="w-8 h-8" /> Confirm and Launch</>
                  )}
                </button>
                {!canLaunch && (
                  <p className="mt-4 text-center text-red-500 text-xs font-bold uppercase tracking-widest">
                    Complete all required fields to launch
                  </p>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SubmissionFlow;
