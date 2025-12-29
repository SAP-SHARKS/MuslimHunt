import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Mail, Loader2, Sparkles, ArrowRight, X, Facebook, Twitter } from 'lucide-react';

interface AuthProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const Auth: React.FC<AuthProps> = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Supabase handles both Sign In and Sign Up with OTP by default 
    // if 'Allow new users to sign up' is enabled in the dashboard.
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ 
        type: 'success', 
        text: 'Bismillah! Check your email for the verification link. If you are new, an account has been prepared for you.' 
      });
    }
    setLoading(false);
  };

  const signInWithSocial = async (provider: 'google' | 'facebook' | 'twitter') => {
    setLoading(true);
    setMessage(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) {
      setMessage({ type: 'error', text: error.message });
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      
      {/* Modal Container */}
      <div className="relative bg-white rounded-[2.5rem] shadow-2xl border border-emerald-50 max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-gray-400 hover:text-emerald-800 hover:bg-emerald-50 rounded-full transition-all active:scale-95 z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-8 sm:p-12">
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-emerald-50 rounded-[1.5rem] flex items-center justify-center mb-6 text-emerald-800 shadow-inner">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-serif font-bold text-emerald-900 mb-3 text-center tracking-tight">Join our community</h2>
            <p className="text-gray-500 text-center font-medium leading-relaxed max-w-xs">
              Sign up to discover and share the latest products in the Muslim tech ecosystem.
            </p>
          </div>

          <div className="space-y-3 mb-8">
            <button 
              onClick={() => signInWithSocial('google')}
              disabled={loading}
              className="w-full flex items-center justify-center gap-4 py-4 bg-white border border-gray-100 rounded-2xl text-sm font-black text-gray-700 hover:bg-gray-50 hover:border-gray-200 transition-all shadow-sm active:scale-[0.98] group"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign up with Google
            </button>
            <button 
              onClick={() => signInWithSocial('facebook')}
              disabled={loading}
              className="w-full flex items-center justify-center gap-4 py-4 bg-[#1877F2] text-white rounded-2xl text-sm font-black hover:bg-[#166fe5] transition-all shadow-md active:scale-[0.98] group"
            >
              <Facebook className="w-5 h-5 fill-white group-hover:scale-110 transition-transform" />
              Sign up with Facebook
            </button>
            <button 
              onClick={() => signInWithSocial('twitter')}
              disabled={loading}
              className="w-full flex items-center justify-center gap-4 py-4 bg-black text-white rounded-2xl text-sm font-black hover:opacity-90 transition-all shadow-md active:scale-[0.98] group"
            >
              <Twitter className="w-5 h-5 fill-white group-hover:scale-110 transition-transform" />
              Sign up with X
            </button>
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest"><span className="bg-white px-3 text-gray-300">Or use magic link</span></div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-800 rounded-2xl outline-none transition-all text-md font-medium"
                type="email"
                placeholder="yourname@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <button
              className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-black py-4 px-6 rounded-2xl transition-all shadow-lg active:scale-[0.98] text-md flex items-center justify-center gap-2 group"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Continue with Email
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {message && (
            <div className={`mt-6 p-4 rounded-xl text-center font-bold text-[13px] w-full animate-in slide-in-from-top-2 ${
              message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'bg-red-50 text-red-800 border border-red-100'
            }`}>
              {message.text}
            </div>
          )}

          <p className="mt-10 text-[10px] text-gray-400 text-center uppercase tracking-[0.2em] font-black">
            Secure • Halal • Community
          </p>
        </div>
      </div>
    </div>
  );
}

export default Auth;