import React, { useState } from 'react';
import { Rocket, ArrowRight, Link as LinkIcon, Info, Sparkles, ShieldCheck } from 'lucide-react';

interface PostSubmitProps {
  onCancel: () => void;
  onNext: (url: string) => void;
}

const PostSubmit: React.FC<PostSubmitProps> = ({ onCancel, onNext }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) {
      setError('Please enter a product URL');
      return;
    }
    try {
      new URL(url);
      onNext(url);
    } catch (e) {
      setError('Please enter a valid URL (including https://)');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row animate-in fade-in duration-500">
      {/* Left Column: Illustrative/Marketing */}
      <div className="lg:w-[45%] bg-emerald-900 p-12 lg:p-24 flex flex-col justify-center relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <Rocket className="w-64 h-64 text-emerald-400 rotate-12" />
        </div>
        
        <div className="relative z-10">
          <div className="w-16 h-16 bg-emerald-800 rounded-2xl flex items-center justify-center text-white mb-8 shadow-xl">
            <Sparkles className="w-8 h-8" />
          </div>
          <h1 className="text-4xl lg:text-6xl font-serif font-bold text-white leading-[1.1] mb-8 tracking-tight">
            The best new products, <br/><span className="text-emerald-400">every day.</span>
          </h1>
          <div className="space-y-6">
            <div className="flex items-start gap-4 text-emerald-100">
              <div className="w-6 h-6 rounded-full bg-emerald-800 flex items-center justify-center shrink-0 mt-1">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <p className="text-lg font-medium leading-relaxed">Showcase your product to the global Muslim tech community.</p>
            </div>
            <div className="flex items-start gap-4 text-emerald-100">
              <div className="w-6 h-6 rounded-full bg-emerald-800 flex items-center justify-center shrink-0 mt-1">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <p className="text-lg font-medium leading-relaxed">Connect with early adopters and makers building Halal-conscious tools.</p>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-12 border-t border-emerald-800 relative z-10">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-300">Shariah-Compliant Discovery</span>
          </div>
        </div>
      </div>

      {/* Right Column: URL Form */}
      <div className="flex-1 p-8 lg:p-24 flex flex-col justify-center">
        <div className="max-w-md w-full mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-3">Launch a product</h2>
            <p className="text-gray-500 font-medium leading-relaxed">Give us a link to the product you want to submit.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Link to the product</label>
              <div className="relative group">
                <div className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${url ? 'text-emerald-800' : 'text-gray-400'}`}>
                  <LinkIcon className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => { setUrl(e.target.value); setError(''); }}
                  placeholder="https://yourproduct.com"
                  className={`w-full pl-14 pr-6 py-5 bg-gray-50 border-2 transition-all rounded-[1.5rem] outline-none text-lg font-bold ${
                    error ? 'border-red-100 bg-red-50/30' : 'border-transparent focus:bg-white focus:border-emerald-800'
                  }`}
                  autoFocus
                />
              </div>
              {error && <p className="text-red-500 text-xs font-bold px-1 mt-2">{error}</p>}
            </div>

            <div className="flex flex-col gap-6">
              <button
                type="submit"
                className="w-full py-5 bg-[#ff6154] hover:bg-[#e6574a] text-white rounded-[1.5rem] font-black text-xl transition-all shadow-xl shadow-red-900/10 active:scale-[0.98] flex items-center justify-center gap-3"
              >
                Get started
                <ArrowRight className="w-6 h-6" />
              </button>

              <button
                type="button"
                onClick={onCancel}
                className="text-sm font-black text-gray-400 hover:text-gray-600 uppercase tracking-widest transition-colors"
              >
                Cancel and return
              </button>
            </div>
          </form>

          <div className="mt-16 p-6 bg-gray-50 rounded-2xl border border-gray-100 flex items-start gap-4">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-emerald-800 shadow-sm shrink-0">
              <Info className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-black text-gray-900 uppercase tracking-tight mb-1">Maker Community Rule</p>
              <p className="text-[13px] text-gray-500 font-medium leading-relaxed">
                We prefer products that are live and ready for users. Landing pages for future products are best shared in the <span className="text-emerald-800 font-bold">Forums</span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostSubmit;