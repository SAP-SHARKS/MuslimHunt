
import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  X, Wand2, Loader2, Heart, ShieldCheck, ArrowRight, AlertCircle, Info,
  Calendar, Link as LinkIcon, User as UserIcon, Plus,
  CheckCircle2, DollarSign, Tag, Clock, Rocket, Sparkles, Image as ImageIcon,
  Check, ChevronRight, Search, ChevronDown, MessageSquare, Ticket, Twitter, Upload
} from 'lucide-react';
import { HALAL_STATUSES } from '../constants';
import { geminiService } from '../services/geminiService';
import { supabase } from '../lib/supabase';
import { User, Category, Product } from '../types';

interface SubmitFormProps {
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

const SubmitForm: React.FC<SubmitFormProps> = ({ initialUrl = '', user, categories, onCancel, onSuccess }) => {
  const [activeStep, setActiveStep] = useState<Step>(Step.MAIN_INFO);
  const [isDone, setIsDone] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    url: initialUrl,
    tagline: '',
    description: '',
    firstComment: '',
    makerTwitter: '',
    category: '',
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
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialUrl) setFormData(prev => ({ ...prev, url: initialUrl }));
  }, [initialUrl]);

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
      const category = await geminiService.getCategorySuggestion(formData.description);
      if (tagline) setFormData(prev => ({ ...prev, tagline, category }));
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError({ message: 'Please upload an image file (PNG or JPG)' });
      return;
    }

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      setError({ message: 'File size must be less than 2MB' });
      return;
    }

    setIsUploadingLogo(true);
    setError(null);

    try {
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `product-logos/${fileName}`;

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('assets')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, logo_url: publicUrl }));
      setLogoPreview(publicUrl);
    } catch (err: any) {
      console.error('Logo upload failed:', err);
      setError({ message: err.message || 'Failed to upload logo. Please try again.' });
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleSubmit = async () => {
    if (!user) { 
      setError({ message: 'You must be signed in to submit.' }); 
      return; 
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // PGRST200 fix: payload aligned with DB schema (user_id instead of founder_id)
      const payload = {
        name: formData.name, 
        url: formData.url, 
        tagline: formData.tagline, 
        description: formData.description,
        category: formData.category, 
        halal_status: formData.halal_status, 
        sadaqah_info: formData.sadaqah_info,
        logo_url: formData.logo_url, 
        user_id: user.id, // Changed from founder_id
        created_at: new Date(formData.launchDate).toISOString(),
        upvotes_count: 0,
        is_approved: false,
        metadata: {
          first_comment: formData.firstComment,
          maker_twitter: formData.makerTwitter,
          pricing: formData.pricing,
          promo: {
            offer: formData.promoOffer,
            code: formData.promoCode,
            expiry: formData.promoExpiry
          },
          submitted_at: new Date().toISOString()
        }
      };

      const { data, error: insertError } = await supabase
        .from('products')
        .insert([payload])
        .select();

      if (insertError) {
        if (insertError.code === 'PGRST002') {
          setError({ 
            message: 'Schema Cache Error (PGRST002): The database schema has recently changed. Please try again in a few moments or refresh the page.',
            isSchemaError: true
          });
          return;
        }
        throw insertError;
      }
      
      setIsDone(true);
      setTimeout(() => {
        if (data?.[0]) onSuccess(data[0] as Product);
      }, 4000);
    } catch (err: any) {
      setError({ message: err.message || 'Bismillah, something went wrong with the submission.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const groupedCategories = useMemo(() => {
    const groups: Record<string, Category[]> = {};
    categories.forEach(cat => {
      if (!groups[cat.parent_category]) groups[cat.parent_category] = [];
      groups[cat.parent_category].push(cat);
    });
    return groups;
  }, [categories]);

  if (isDone) {
    return (
      <div className="max-w-2xl mx-auto py-16 sm:py-32 px-4 text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="w-16 sm:w-24 h-16 sm:h-24 bg-primary-light rounded-2xl sm:rounded-[3rem] flex items-center justify-center text-primary mx-auto mb-6 sm:mb-8 shadow-inner border border-primary-light/50">
          <ShieldCheck className="w-8 sm:w-12 h-8 sm:h-12" />
        </div>
        <h2 className="text-2xl sm:text-4xl font-serif font-bold text-primary mb-3 sm:mb-4 tracking-tight">Bismillah! Your product is now under review.</h2>
        <p className="text-base sm:text-xl text-gray-500 font-medium leading-relaxed max-w-lg mx-auto mb-8 sm:mb-10">
          It will appear on the feed once approved by community moderators. We appreciate your contribution to the Ummah tech landscape.
        </p>
        <div className="flex items-center justify-center gap-2 text-primary font-black uppercase tracking-widest text-[9px] sm:text-[10px]">
          <Loader2 className="w-3 sm:w-4 h-3 sm:h-4 animate-spin" />
          Returning to home feed...
        </div>
      </div>
    );
  }

  const renderStepContent = () => {
    switch (activeStep) {
      case Step.MAIN_INFO:
        return (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-primary mb-1 sm:mb-2">Main Info</h3>
              <p className="text-gray-400 text-xs sm:text-sm font-medium italic">Tell us the core details of your launch.</p>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] sm:text-[11px] font-black text-gray-400 uppercase tracking-[0.15em] sm:tracking-[0.2em] px-1">Name of launch</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g., QuranFlow" className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-primary rounded-xl sm:rounded-2xl outline-none transition-all text-base sm:text-lg font-bold shadow-inner" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <label className="text-[10px] sm:text-[11px] font-black text-gray-400 uppercase tracking-[0.15em] sm:tracking-[0.2em]">Tagline</label>
                  <button type="button" onClick={handleGeminiOptimize} disabled={isOptimizing || !formData.description} className="text-[9px] sm:text-[10px] flex items-center gap-1.5 text-primary hover:text-primary disabled:opacity-50 font-black uppercase tracking-widest transition-all">
                    {isOptimizing ? <Loader2 className="w-3 sm:w-3.5 h-3 sm:h-3.5 animate-spin" /> : <Wand2 className="w-3 sm:w-3.5 h-3 sm:h-3.5" />} AI Help
                  </button>
                </div>
                <input required value={formData.tagline} onChange={e => setFormData({...formData, tagline: e.target.value})} placeholder="Catchy one-liner" className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-primary rounded-xl sm:rounded-2xl outline-none transition-all text-base sm:text-lg font-bold shadow-inner" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] sm:text-[11px] font-black text-gray-400 uppercase tracking-[0.15em] sm:tracking-[0.2em] px-1 flex items-center gap-2"><LinkIcon className="w-3 sm:w-3.5 h-3 sm:h-3.5" /> Links (URL)</label>
                <input required type="url" value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} placeholder="https://yourproduct.com" className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-primary rounded-xl sm:rounded-2xl outline-none transition-all text-base sm:text-lg font-bold shadow-inner" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] sm:text-[11px] font-black text-gray-400 uppercase tracking-[0.15em] sm:tracking-[0.2em] px-1">Description</label>
                <textarea required rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="What does your product do?" className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-primary rounded-2xl sm:rounded-3xl outline-none transition-all resize-none text-base sm:text-lg font-medium leading-relaxed shadow-inner" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] sm:text-[11px] font-black text-gray-400 uppercase tracking-[0.15em] sm:tracking-[0.2em] px-1 flex items-center gap-2"><MessageSquare className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-primary" /> First Comment</label>
                <textarea rows={3} value={formData.firstComment} onChange={e => setFormData({...formData, firstComment: e.target.value})} placeholder="Explain why you built this to the community..." className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-primary rounded-2xl sm:rounded-3xl outline-none transition-all resize-none text-sm sm:text-base font-medium shadow-inner" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] sm:text-[11px] font-black text-gray-400 uppercase tracking-[0.15em] sm:tracking-[0.2em] px-1 flex items-center gap-2"><Calendar className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-primary" /> Launch Date</label>
                  <div className="relative">
                    <input required type="date" value={formData.launchDate} onChange={e => setFormData({...formData, launchDate: e.target.value})} className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-primary rounded-xl sm:rounded-2xl outline-none transition-all text-base sm:text-lg font-bold shadow-inner appearance-none" />
                    <Calendar className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-primary pointer-events-none opacity-30" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] sm:text-[11px] font-black text-gray-400 uppercase tracking-[0.15em] sm:tracking-[0.2em] px-1">Category</label>
                  <div className="relative">
                    <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-primary rounded-xl sm:rounded-2xl outline-none transition-all text-base sm:text-lg font-bold appearance-none cursor-pointer shadow-inner">
                      {(Object.entries(groupedCategories) as [string, Category[]][]).map(([group, items]) => (
                        <optgroup key={group} label={group} className="font-black uppercase tracking-widest text-[10px] bg-white text-primary py-2">
                          {items.map(cat => <option key={cat.id} value={cat.name} className="font-bold normal-case text-base text-gray-900">{cat.name}</option>)}
                        </optgroup>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-primary pointer-events-none opacity-30" />
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-6 sm:pt-8">
              <button type="button" onClick={() => setActiveStep(Step.MEDIA)} className="w-full sm:w-auto px-6 sm:px-10 py-4 sm:py-5 bg-primary text-white rounded-xl sm:rounded-2xl font-black text-base sm:text-lg hover:bg-primary-dark transition-all flex items-center justify-center sm:justify-start gap-2 shadow-lg active:scale-[0.98] shadow-emerald-900/10">
                <span className="hidden sm:inline">Next step: Images and media</span>
                <span className="sm:hidden">Next: Images</span>
                <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5" />
              </button>
            </div>
          </div>
        );
      case Step.MEDIA:
        return (
          <div className="space-y-6 sm:space-y-10 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-primary mb-1 sm:mb-2">Images and Media</h3>
              <p className="text-gray-400 text-xs sm:text-sm font-medium italic">Give your product a visual identity.</p>
            </div>
            <div
              className={`bg-gray-50 p-6 sm:p-10 rounded-2xl sm:rounded-[2.5rem] border-2 border-dashed flex flex-col items-center justify-center gap-3 sm:gap-4 text-center transition-colors cursor-pointer ${logoPreview || formData.logo_url ? 'border-primary bg-primary-light/20' : 'border-gray-200 hover:border-primary-light'}`}
              onClick={() => logoInputRef.current?.click()}
            >
              <input
                ref={logoInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleLogoUpload}
                className="hidden"
              />
              {isUploadingLogo ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-12 h-12 text-primary animate-spin" />
                  <p className="text-sm font-bold text-primary">Uploading...</p>
                </div>
              ) : logoPreview || formData.logo_url ? (
                <>
                  <div className="w-24 sm:w-32 h-24 sm:h-32 rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border-2 border-white">
                    <img src={logoPreview || formData.logo_url} alt="Logo preview" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-base sm:text-lg font-bold text-primary flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5" /> Logo uploaded
                    </p>
                    <p className="text-xs sm:text-sm text-gray-400 font-medium">Click to change</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-24 sm:w-32 h-24 sm:h-32 bg-white rounded-2xl sm:rounded-3xl flex items-center justify-center text-gray-300 shadow-sm border border-gray-100">
                    <ImageIcon className="w-8 sm:w-12 h-8 sm:h-12" />
                  </div>
                  <div>
                    <p className="text-base sm:text-lg font-bold text-gray-900">Upload product logo</p>
                    <p className="text-xs sm:text-sm text-gray-400 font-medium">PNG or JPG, max 2MB.</p>
                  </div>
                  <button type="button" className="px-4 sm:px-6 py-2 bg-white border border-gray-200 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black text-gray-500 hover:text-primary transition-all flex items-center gap-2">
                    <Upload className="w-4 h-4" /> Choose File
                  </button>
                </>
              )}
            </div>
            <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button type="button" onClick={() => setActiveStep(Step.MAIN_INFO)} className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-gray-100 rounded-xl sm:rounded-2xl font-bold text-gray-400 hover:bg-gray-50 transition-all active:scale-[0.98] order-2 sm:order-1">Back</button>
              <button type="button" onClick={() => setActiveStep(Step.MAKERS)} className="px-6 sm:px-10 py-4 sm:py-5 bg-primary text-white rounded-xl sm:rounded-2xl font-black text-base sm:text-lg hover:bg-primary-dark transition-all flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] order-1 sm:order-2">
                <span className="hidden sm:inline">Next step: Makers</span>
                <span className="sm:hidden">Next: Makers</span>
                <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5" />
              </button>
            </div>
          </div>
        );
      case Step.MAKERS:
        return (
          <div className="space-y-6 sm:space-y-10 animate-in fade-in slide-in-from-right-4 duration-300">
            <div><h3 className="text-2xl sm:text-3xl font-serif font-bold text-primary mb-1 sm:mb-2">Makers</h3><p className="text-gray-400 text-xs sm:text-sm font-medium italic">Credit the people who built this.</p></div>

            <div className="space-y-4 sm:space-y-6">
              <div className="bg-gray-50 p-5 sm:p-10 rounded-2xl sm:rounded-[2.5rem] space-y-4 sm:space-y-8 border border-gray-100">
                <p className="text-base sm:text-lg font-bold text-gray-900 text-center">Did you work on this product?</p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <button type="button" onClick={() => setFormData({...formData, isMaker: true})} className={`flex-1 py-4 sm:py-5 px-4 sm:px-8 rounded-xl sm:rounded-2xl border-2 transition-all font-black text-center text-xs sm:text-sm uppercase ${formData.isMaker ? 'bg-primary border-primary text-white shadow-xl shadow-emerald-900/10' : 'bg-white border-gray-100 text-gray-400 hover:border-primary-light'}`}>I worked on this</button>
                  <button type="button" onClick={() => setFormData({...formData, isMaker: false})} className={`flex-1 py-4 sm:py-5 px-4 sm:px-8 rounded-xl sm:rounded-2xl border-2 transition-all font-black text-center text-xs sm:text-sm uppercase ${!formData.isMaker ? 'bg-primary border-primary text-white shadow-xl shadow-emerald-900/10' : 'bg-white border-gray-100 text-gray-400 hover:border-primary-light'}`}>I didn't work on this</button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] sm:text-[11px] font-black text-gray-400 uppercase tracking-[0.15em] sm:tracking-[0.2em] px-1 flex items-center gap-2"><Twitter className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-primary" /> Maker Twitter Handle</label>
                <div className="relative">
                  <span className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 text-gray-400 font-bold">@</span>
                  <input value={formData.makerTwitter} onChange={e => setFormData({...formData, makerTwitter: e.target.value})} placeholder="username" className="w-full pl-10 sm:pl-12 pr-4 sm:pr-6 py-3 sm:py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-primary rounded-xl sm:rounded-2xl outline-none transition-all text-base sm:text-lg font-bold shadow-inner" />
                </div>
              </div>
            </div>

            <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button type="button" onClick={() => setActiveStep(Step.MEDIA)} className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-gray-100 rounded-xl sm:rounded-2xl font-bold text-gray-400 hover:bg-gray-50 transition-all active:scale-[0.98] order-2 sm:order-1">Back</button>
              <button type="button" onClick={() => setActiveStep(Step.EXTRAS)} className="px-6 sm:px-10 py-4 sm:py-5 bg-primary text-white rounded-xl sm:rounded-2xl font-black text-base sm:text-lg hover:bg-primary-dark transition-all flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] order-1 sm:order-2">
                <span className="hidden sm:inline">Next step: Extras</span>
                <span className="sm:hidden">Next: Extras</span>
                <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5" />
              </button>
            </div>
          </div>
        );
      case Step.EXTRAS:
        return (
          <div className="space-y-6 sm:space-y-10 animate-in fade-in slide-in-from-right-4 duration-300">
            <div><h3 className="text-2xl sm:text-3xl font-serif font-bold text-primary mb-1 sm:mb-2">Extras</h3><p className="text-gray-400 text-xs sm:text-sm font-medium italic">Configure pricing and special offers.</p></div>
            <div className="space-y-4 sm:space-y-6">
              <label className="text-[10px] sm:text-[11px] font-black text-gray-400 uppercase tracking-[0.15em] sm:tracking-[0.2em] px-1 flex items-center gap-2"><DollarSign className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-primary" /> Pricing</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {['Free', 'Paid', 'Paid (with trial)'].map((p) => (
                  <button key={p} type="button" onClick={() => setFormData({...formData, pricing: p})} className={`py-4 sm:py-5 px-4 sm:px-6 rounded-xl sm:rounded-2xl border-2 transition-all font-black text-center text-[10px] sm:text-xs uppercase ${formData.pricing === p ? 'bg-primary border-primary text-white shadow-xl shadow-emerald-900/10' : 'bg-white border-gray-100 text-gray-400 hover:border-primary-light'}`}>{p}</button>
                ))}
              </div>
            </div>

            <div className="p-5 sm:p-8 bg-gray-50 rounded-2xl sm:rounded-[2.5rem] border border-gray-100 space-y-4 sm:space-y-6">
              <div className="flex items-center gap-2 sm:gap-3 text-gray-900 font-black uppercase tracking-widest text-[10px] sm:text-xs"><Ticket className="w-4 sm:w-5 h-4 sm:h-5 text-primary" /> Community Offer</div>
              <div className="space-y-3 sm:space-y-4">
                <div className="space-y-2">
                  <label className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">What is the offer?</label>
                  <input value={formData.promoOffer} onChange={e => setFormData({...formData, promoOffer: e.target.value})} placeholder="e.g. 20% off for the first month" className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white border border-gray-100 focus:border-primary rounded-xl sm:rounded-2xl outline-none font-bold text-xs sm:text-sm" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Code</label>
                    <input value={formData.promoCode} onChange={e => setFormData({...formData, promoCode: e.target.value})} placeholder="MUSLIMHUNT20" className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white border border-gray-100 focus:border-primary rounded-xl sm:rounded-2xl outline-none font-bold text-xs sm:text-sm uppercase" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Expiration Date</label>
                    <input type="date" value={formData.promoExpiry} onChange={e => setFormData({...formData, promoExpiry: e.target.value})} className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white border border-gray-100 focus:border-primary rounded-xl sm:rounded-2xl outline-none font-bold text-xs sm:text-sm" />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-10 bg-white border border-primary-light rounded-2xl sm:rounded-[3rem] space-y-4 sm:space-y-8">
              <div className="flex items-center gap-2 sm:gap-3 text-primary font-black uppercase tracking-widest text-[10px] sm:text-xs"><ShieldCheck className="w-4 sm:w-5 h-4 sm:h-5 text-primary" /> Halal Trust</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
                <div className="space-y-2"><label className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Verification Status</label>
                  <select value={formData.halal_status} onChange={e => setFormData({...formData, halal_status: e.target.value as any})} className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border border-gray-100 focus:bg-white focus:border-primary rounded-xl sm:rounded-2xl outline-none font-bold text-sm sm:text-base appearance-none cursor-pointer shadow-inner">
                    {HALAL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="space-y-2"><label className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest px-1 flex items-center gap-1.5"><Heart className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-red-500 fill-red-500" /> Sadaqah Component</label>
                  <input value={formData.sadaqah_info} onChange={e => setFormData({...formData, sadaqah_info: e.target.value})} placeholder="e.g. 5% of profits to charity" className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border border-gray-100 focus:bg-white focus:border-primary rounded-xl sm:rounded-2xl outline-none font-bold text-sm sm:text-base shadow-inner" />
                </div>
              </div>
            </div>
            <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button type="button" onClick={() => setActiveStep(Step.MAKERS)} className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-gray-100 rounded-xl sm:rounded-2xl font-bold text-gray-400 hover:bg-gray-50 transition-all active:scale-[0.98] order-2 sm:order-1">Back</button>
              <button type="button" onClick={() => setActiveStep(Step.CHECKLIST)} className="px-6 sm:px-10 py-4 sm:py-5 bg-primary text-white rounded-xl sm:rounded-2xl font-black text-base sm:text-lg hover:bg-primary-dark transition-all flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] shadow-emerald-900/10 order-1 sm:order-2">
                <span className="hidden sm:inline">Next step: Launch checklist</span>
                <span className="sm:hidden">Next: Checklist</span>
                <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5" />
              </button>
            </div>
          </div>
        );
      case Step.CHECKLIST:
        const checklistItems = [
          { step: Step.MAIN_INFO, label: 'Main info provided', isComplete: !!(formData.name && formData.tagline && formData.url && formData.description) },
          { step: Step.MEDIA, label: 'Visual identity set', isComplete: !!(logoPreview || formData.logo_url) },
          { step: Step.MAKERS, label: 'Maker info added', isComplete: true },
          { step: Step.EXTRAS, label: 'Extras configured', isComplete: true }
        ];
        return (
          <div className="space-y-6 sm:space-y-10 animate-in fade-in slide-in-from-right-4 duration-300">
            <div><h3 className="text-2xl sm:text-3xl font-serif font-bold text-primary mb-1 sm:mb-2">Launch Checklist</h3><p className="text-gray-400 text-xs sm:text-sm font-medium italic">Final review before going live.</p></div>
            <div className="space-y-3 sm:space-y-4">
              {checklistItems.map((item, idx) => (
                <div key={idx} className={`p-4 sm:p-6 rounded-xl sm:rounded-[2rem] border flex items-center justify-between shadow-sm gap-3 ${item.isComplete ? 'bg-primary-light border-primary-light' : 'bg-amber-50 border-amber-200'}`}>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className={`w-7 sm:w-8 h-7 sm:h-8 rounded-full flex items-center justify-center shadow-sm shrink-0 ${item.isComplete ? 'bg-white text-primary' : 'bg-amber-100 text-amber-600'}`}>
                      {item.isComplete ? <Check className="w-4 sm:w-5 h-4 sm:h-5" /> : <AlertCircle className="w-4 sm:w-5 h-4 sm:h-5" />}
                    </div>
                    <div>
                      <p className={`font-bold text-sm sm:text-base ${item.isComplete ? 'text-gray-900' : 'text-amber-800'}`}>{item.label}</p>
                      <p className="text-[9px] sm:text-[10px] text-gray-400 font-black uppercase tracking-widest">{item.step}</p>
                    </div>
                  </div>
                  <button onClick={() => setActiveStep(item.step as Step)} className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest hover:underline shrink-0 ${item.isComplete ? 'text-primary' : 'text-amber-600'}`}>
                    {item.isComplete ? 'Review' : 'Complete'}
                  </button>
                </div>
              ))}
            </div>
            <div className="pt-8 sm:pt-12">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary-dark text-white font-black py-5 sm:py-7 rounded-xl sm:rounded-[2.5rem] shadow-2xl transition-all active:scale-[0.98] text-lg sm:text-2xl flex items-center justify-center gap-3 sm:gap-4 disabled:opacity-70 shadow-emerald-900/30"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-6 sm:w-8 h-6 sm:h-8 animate-spin" />
                    <span className="hidden sm:inline">Propagating...</span>
                    <span className="sm:hidden">Submitting...</span>
                  </>
                ) : (
                  <>
                    <Rocket className="w-6 sm:w-8 h-6 sm:h-8" />
                    <span className="hidden sm:inline">Confirm and Launch</span>
                    <span className="sm:hidden">Launch</span>
                  </>
                )}
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-6 sm:py-12 px-4 animate-in fade-in duration-500">
      {/* Header - Responsive */}
      <div className="flex items-start sm:items-center justify-between mb-6 sm:mb-12 gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 sm:w-12 h-10 sm:h-12 bg-primary-dark rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-xl shrink-0">
            <span className="font-serif text-xl sm:text-2xl font-bold">M</span>
          </div>
          <div>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-primary tracking-tight">Launch your product</h2>
            <p className="text-gray-500 mt-0.5 sm:mt-1 text-sm sm:text-base font-medium italic hidden sm:block">Bismillah! Contributing to the Ummah tech landscape.</p>
          </div>
        </div>
        <button onClick={onCancel} className="p-2 sm:p-3 hover:bg-gray-100 rounded-full transition-all active:scale-95 shrink-0">
          <X className="w-5 sm:w-7 h-5 sm:h-7 text-gray-400" />
        </button>
      </div>
      {/* Main Card - Responsive */}
      <div className="bg-white border border-gray-100 shadow-2xl rounded-2xl sm:rounded-[3.5rem] overflow-hidden flex flex-col lg:flex-row min-h-[600px] lg:min-h-[800px]">
        {/* Step Navigation - Horizontal scroll on mobile, vertical on desktop */}
        <aside className="w-full lg:w-80 bg-gray-50/50 border-b lg:border-b-0 lg:border-r border-gray-100 p-4 sm:p-6 lg:p-10 lg:pt-14">
          <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0">
            {Object.values(Step).map((step) => {
              const isActive = activeStep === step;
              return (
                <button
                  key={step}
                  onClick={() => !isSubmitting && setActiveStep(step as Step)}
                  className={`whitespace-nowrap lg:whitespace-normal lg:w-full text-left px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-[10px] sm:text-[12px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] transition-all group flex items-center justify-between shrink-0 ${isActive ? 'bg-white text-primary shadow-md border border-gray-100' : 'text-gray-400 hover:text-primary hover:bg-white/50'}`}
                >
                  {step}{isActive && <ChevronRight className="w-3 sm:w-4 h-3 sm:h-4 text-primary ml-2 lg:ml-0" />}
                </button>
              );
            })}
          </div>
        </aside>
        {/* Form Content - Responsive padding */}
        <main className="flex-1 p-5 sm:p-8 lg:p-20 overflow-y-auto custom-scrollbar">
          {error && (
            <div className={`mb-10 p-6 rounded-3xl flex items-center gap-4 shadow-sm animate-in slide-in-from-top-4 ${error.isSchemaError ? 'bg-amber-50 border border-amber-200 text-amber-800' : 'bg-red-50 border border-red-100 text-red-600'}`}>
              <AlertCircle className="w-6 h-6 shrink-0" />
              <div className="flex-1">
                <p className="text-xs font-black uppercase tracking-widest mb-1">{error.isSchemaError ? 'Cache Alert' : 'Submission Error'}</p>
                <p className="text-sm font-bold">{error.message}</p>
                {error.isSchemaError && (
                  <button 
                    onClick={handleSubmit} 
                    className="mt-3 text-[10px] font-black uppercase tracking-widest bg-amber-800 text-white px-4 py-2 rounded-lg hover:bg-amber-900 transition-colors"
                  >
                    Retry Submission
                  </button>
                )}
              </div>
            </div>
          )}
          {renderStepContent()}
        </main>
      </div>
    </div>
  );
};

export default SubmitForm;
