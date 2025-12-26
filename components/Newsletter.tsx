import React, { useState } from 'react';
import { Mail, CheckCircle2, ArrowRight } from 'lucide-react';
import { View } from '../types';

interface NewsletterProps {
  onSponsorClick: () => void;
}

const Newsletter: React.FC<NewsletterProps> = ({ onSponsorClick }) => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
    }
  };

  return (
    <div className="bg-white min-h-[80vh] flex items-center justify-center py-20 px-4">
      <div className="max-w-2xl w-full text-center space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
        {/* Hero Icon */}
        <div className="flex justify-center">
          <div className="w-28 h-28 bg-emerald-50 rounded-[3rem] flex items-center justify-center text-6xl shadow-inner border border-emerald-100/50">
            📬
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-emerald-900 tracking-tight">
            The best products in your inbox
          </h1>
          <p className="text-lg sm:text-xl text-gray-500 font-medium leading-relaxed max-w-xl mx-auto">
            Muslim Hunt has been curating viral products and superb tech stories for the Ummah. 
            Sign up and you'll always have something cool to share with your friends.
          </p>
        </div>

        {/* Signup Form */}
        {!isSubscribed ? (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Your email..."
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-6 py-4 bg-gray-50 border border-gray-100 focus:bg-white focus:border-emerald-800 rounded-2xl outline-none transition-all text-lg font-medium shadow-sm"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-emerald-800 text-white rounded-2xl font-black text-lg hover:bg-emerald-900 transition-all shadow-xl shadow-emerald-900/10 active:scale-95 whitespace-nowrap"
            >
              Sign me up
            </button>
          </form>
        ) : (
          <div className="p-8 bg-emerald-50 rounded-[2rem] border border-emerald-100 flex flex-col items-center gap-4 animate-in zoom-in-95 duration-300">
            <CheckCircle2 className="w-12 h-12 text-emerald-600" />
            <div className="text-center">
              <h3 className="text-xl font-bold text-emerald-900">You're on the list!</h3>
              <p className="text-emerald-700 font-medium">Welcome to the Muslim Hunt family. Expect magic soon.</p>
            </div>
          </div>
        )}

        {/* Social Proof / Footer Link */}
        <div className="pt-10 border-t border-gray-50">
          <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-4">
            Join 12,000+ builders and creators
          </p>
          <button 
            onClick={onSponsorClick}
            className="group inline-flex items-center gap-2 text-sm font-black text-emerald-800 hover:text-emerald-900 transition-colors uppercase tracking-widest"
          >
            Want to sponsor a newsletter? Find out more
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;