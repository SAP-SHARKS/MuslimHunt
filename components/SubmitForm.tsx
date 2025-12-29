import React, { useState, useEffect } from 'react';
import { Upload, X, Wand2, Loader2, Heart, ShieldCheck } from 'lucide-react';
import { CATEGORIES, HALAL_STATUSES } from '../constants';
import { geminiService } from '../services/geminiService';

interface SubmitFormProps {
  initialUrl?: string;
  onCancel: () => void;
  onSubmit: (data: any) => void;
}

const SubmitForm: React.FC<SubmitFormProps> = ({ initialUrl = '', onCancel, onSubmit }) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-4xl font-serif font-bold text-emerald-900">Tell us more about the product</h2>
          <p className="text-gray-500 mt-2 text-lg">Join the ecosystem of Halal-conscious builders.</p>
        </div>
        <button onClick={onCancel} className="p-3 hover:bg-gray-100 rounded-full transition-colors">
          <X className="w-6 h-6 text-gray-400" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Product Name</label>
            <input 
              required
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="e.g., QuranFlow"
              className="w-full px-5 py-3.5 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-800 rounded-xl outline-none transition-all text-lg font-medium"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Website URL</label>
            <input 
              required
              type="url"
              value={formData.url}
              onChange={e => setFormData({...formData, url: e.target.value})}
              placeholder="https://yourproduct.com"
              className="w-full px-5 py-3.5 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-800 rounded-xl outline-none transition-all text-lg font-medium"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Description</label>
          <textarea 
            required
            rows={4}
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
            placeholder="What does your product do? Who is it for? Be specific about the Halal focus."
            className="w-full px-5 py-3.5 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-800 rounded-xl outline-none transition-all resize-none text-lg font-medium"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-gray-700">Tagline</label>
              <button 
                type="button"
                onClick={handleGeminiOptimize}
                disabled={isOptimizing || !formData.description}
                className="text-xs flex items-center gap-1.5 text-emerald-800 hover:text-emerald-900 disabled:opacity-50 font-bold uppercase tracking-wider"
              >
                {isOptimizing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                AI Help
              </button>
            </div>
            <input 
              required
              value={formData.tagline}
              onChange={e => setFormData({...formData, tagline: e.target.value})}
              placeholder="1-sentence catchy tagline"
              className="w-full px-5 py-3.5 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-800 rounded-xl outline-none transition-all text-lg font-medium"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Category</label>
            <select 
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
              className="w-full px-5 py-3.5 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-800 rounded-xl outline-none transition-all text-lg font-medium appearance-none"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Halal Trust Section */}
        <div className="p-6 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-6">
          <div className="flex items-center gap-2 text-emerald-900 font-bold">
            <ShieldCheck className="w-5 h-5" />
            Halal Trust & Community Impact
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Halal Verification Status</label>
              <select 
                value={formData.halal_status}
                onChange={e => setFormData({...formData, halal_status: e.target.value as any})}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg outline-none focus:border-emerald-800 transition-all font-medium"
              >
                {HALAL_STATUSES.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-red-400" />
                Sadaqah Component (Optional)
              </label>
              <input 
                value={formData.sadaqah_info}
                onChange={e => setFormData({...formData, sadaqah_info: e.target.value})}
                placeholder="e.g. 5% profits to Gaza"
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg outline-none focus:border-emerald-800 transition-all font-medium"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 flex gap-4">
          <button 
            type="submit"
            className="flex-1 bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-5 rounded-2xl shadow-xl transition-all active:scale-[0.98] text-xl"
          >
            Submit for Review
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubmitForm;