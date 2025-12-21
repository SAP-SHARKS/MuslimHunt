
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Mail, Loader2, Sparkles, ArrowRight } from 'lucide-react';

interface AuthProps {
  onSuccess?: () => void;
}

const Auth: React.FC<AuthProps> = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: 'Check your email for the login link! Bismillah.' });
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-[2.5rem] shadow-2xl shadow-emerald-900/5 border border-emerald-50 max-w-md w-full mx-auto">
      <div className="w-20 h-20 bg-emerald-50 rounded-[2rem] flex items-center justify-center mb-8 text-emerald-800">
        <Sparkles className="w-10 h-10" />
      </div>
      
      <h2 className="text-3xl font-serif font-bold text-emerald-900 mb-3 text-center">Join Muslim Hunt</h2>
      <p className="text-gray-500 mb-8 text-center font-medium">
        Enter your email to receive a magic login link. No password required.
      </p>

      <form onSubmit={handleLogin} className="w-full space-y-4">
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-800 rounded-2xl outline-none transition-all text-lg font-medium"
            type="email"
            placeholder="yourname@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <button
          className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-black py-4 px-6 rounded-2xl transition-all shadow-lg active:scale-[0.98] text-lg flex items-center justify-center gap-2 group"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>
              Send Magic Link
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      {message && (
        <div className={`mt-6 p-4 rounded-xl text-center font-bold text-sm w-full ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'bg-red-50 text-red-800 border border-red-100'
        }`}>
          {message.text}
        </div>
      )}

      <p className="mt-8 text-xs text-gray-400 text-center uppercase tracking-widest font-black">
        Secure • Halal • Community
      </p>
    </div>
  );
}

export default Auth;
