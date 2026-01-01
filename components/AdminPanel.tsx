
import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { Product, User } from '../types';
import { 
  ShieldCheck, Check, X, Eye, Loader2, Search, ArrowLeft, 
  Trash2, ExternalLink, RefreshCw, Filter, CheckCircle2, 
  AlertCircle, Hash, LogOut, Lock, Mail, KeyRound,
  ShieldAlert, UserCheck, ArrowRight
} from 'lucide-react';
import SafeImage from './SafeImage.tsx';

interface AdminPanelProps {
  user: User | null;
  onBack: () => void;
  onRefresh: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ user, onBack, onRefresh }) => {
  const [pendingProducts, setPendingProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  // Auth & Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  
  // Role Verification State
  const [verifying, setVerifying] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  // Hardcoded target admin (requested by user for setup)
  const TARGET_ADMIN_EMAIL = 'zeirislam@gmail.com';

  /**
   * Core Security Check: 
   * Verifies if the authenticated user has is_admin: true in the 'profiles' table.
   */
  const checkAuthorization = async (sessionUser: any) => {
    if (!sessionUser) {
      setIsAuthorized(null);
      setVerifying(false);
      return;
    }
    
    setVerifying(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', sessionUser.id)
        .single();
      
      if (error) throw error;
      
      // Secondary check: verify email matches requested admin OR generic admin flag
      if (data?.is_admin === true) {
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
        // Force logout if they try to stay in admin panel without permission
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.error('[Admin] Authorization check failed:', err);
      setIsAuthorized(false);
    } finally {
      setVerifying(false);
    }
  };

  // Initial session check
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user: sessionUser } }) => {
      checkAuthorization(sessionUser);
    });
  }, []);

  const fetchPending = async () => {
    if (!isAuthorized) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          founder:founder_id (
            username,
            avatar_url
          )
        `)
        .eq('is_approved', false)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      setPendingProducts(data || []);
    } catch (err) {
      console.error('[Admin] Moderation fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthorized) {
      fetchPending();
    }
  }, [isAuthorized]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);
    
    try {
      // Step 1: Standard Authenticate
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;

      // Step 2: Immediate check if it's the target account or an admin
      if (data.user) {
        await checkAuthorization(data.user);
      }
    } catch (err: any) {
      setLoginError(err.message || 'Strictly for Admins only. Bismillah, check your credentials.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleAdminLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthorized(null);
    setEmail('');
    setPassword('');
    onBack();
  };

  const handleApprove = async (product: any) => {
    setProcessingId(product.id);
    const previousState = [...pendingProducts];
    setPendingProducts(prev => prev.filter(p => p.id !== product.id));

    try {
      const { error: updateError } = await supabase
        .from('products')
        .update({ is_approved: true })
        .eq('id', product.id);
      
      if (updateError) throw updateError;

      // Notify the maker of approval
      await supabase
        .from('notifications')
        .insert([{
          user_id: product.founder_id,
          type: 'approval',
          message: `Mabrook! Your product "${product.name}" has been approved and is now live.`,
          is_read: false,
          avatar_url: 'https://muslimhunt.com/logo.png' 
        }]);
      
      onRefresh(); 
    } catch (err) {
      console.error('[Admin] Approval failed:', err);
      setPendingProducts(previousState);
      alert('Failed to approve product. Check your connection.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm('Warning: This will permanently delete the submission. Are you sure?')) return;
    
    setProcessingId(id);
    const previousState = [...pendingProducts];
    setPendingProducts(prev => prev.filter(p => p.id !== id));

    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
    } catch (err) {
      console.error('[Admin] Rejection failed:', err);
      setPendingProducts(previousState);
      alert('Failed to delete submission.');
    } finally {
      setProcessingId(null);
    }
  };

  const filteredProducts = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return pendingProducts.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.founder?.username?.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
    );
  }, [pendingProducts, searchQuery]);

  // View 1: Loading/Authorizing State
  if (verifying) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="relative">
          <Loader2 className="w-12 h-12 text-emerald-800 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Lock className="w-4 h-4 text-emerald-800" />
          </div>
        </div>
        <p className="mt-6 text-gray-400 font-black uppercase tracking-[0.3em] text-[10px]">Verifying Clearance...</p>
      </div>
    );
  }

  // View 2: Unauthorized (Denial Screen)
  if (isAuthorized === false) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-white animate-in fade-in duration-500">
        <div className="max-w-md w-full text-center">
          <div className="w-24 h-24 bg-red-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 text-red-600 border border-red-100 shadow-inner">
            <ShieldAlert className="w-12 h-12" />
          </div>
          <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4 tracking-tight leading-none">Access Rejected</h2>
          <p className="text-gray-500 font-medium mb-10 leading-relaxed">
            Strictly for Admins only. Your account does not have the required permissions to access this area.
          </p>
          <button 
            onClick={handleAdminLogout} 
            className="w-full px-10 py-5 bg-emerald-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-800 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
          >
            <LogOut className="w-4 h-4" /> Sign out and exit
          </button>
        </div>
      </div>
    );
  }

  // View 3: Login Portal (If not authorized and not verifying)
  if (isAuthorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-20 bg-[#042119] bg-[radial-gradient(circle_at_top_left,rgba(6,78,59,0.4),transparent)]">
        <div className="w-full max-w-md bg-white rounded-[3.5rem] p-10 sm:p-14 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] border border-emerald-900/10 animate-in fade-in zoom-in-95 duration-700 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-50 rounded-full -mr-20 -mt-20 opacity-40 blur-3xl" />
          
          <div className="flex flex-col items-center mb-12 text-center relative z-10">
            <div className="w-24 h-24 bg-emerald-900 rounded-[2.5rem] flex items-center justify-center text-white mb-8 shadow-2xl shadow-emerald-900/40 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
              <KeyRound className="w-12 h-12" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-emerald-900 mb-2 tracking-tight">Admin Login</h1>
            <p className="text-gray-400 font-medium text-sm leading-relaxed">Secure portal for Muslim Hunt community moderators.</p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-5 relative z-10">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-emerald-800/40 uppercase tracking-[0.2em] px-1">Identity</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-800/30 group-focus-within:text-emerald-800 transition-colors" />
                <input 
                  type="email" 
                  placeholder="zeirislam@gmail.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required
                  className="w-full pl-12 pr-6 py-4 bg-emerald-50/30 border border-transparent focus:bg-white focus:border-emerald-800 rounded-2xl outline-none font-bold text-gray-900 transition-all shadow-inner placeholder:text-gray-300"
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] font-black text-emerald-800/40 uppercase tracking-[0.2em] px-1">Security Key</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-800/30 group-focus-within:text-emerald-800 transition-colors" />
                <input 
                  type="password" 
                  placeholder="admin123" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required
                  className="w-full pl-12 pr-6 py-4 bg-emerald-50/30 border border-transparent focus:bg-white focus:border-emerald-800 rounded-2xl outline-none font-bold text-gray-900 transition-all shadow-inner placeholder:text-gray-300"
                />
              </div>
            </div>
            
            {loginError && (
              <div className="p-4 bg-red-50 rounded-2xl border border-red-100 flex items-center gap-3 text-red-600 text-[11px] font-black uppercase tracking-wider animate-in slide-in-from-top-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {loginError}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loginLoading}
              className="w-full bg-emerald-900 hover:bg-emerald-800 text-white font-black py-5 rounded-[1.5rem] transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 mt-4 group shadow-xl shadow-emerald-900/20"
            >
              {loginLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>Enter Moderation Dashboard <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>

          <button onClick={onBack} className="w-full mt-10 py-2 text-[10px] font-black text-gray-400 hover:text-emerald-800 uppercase tracking-[0.3em] transition-colors flex items-center justify-center gap-2 group">
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> Exit to Feed
          </button>
        </div>
      </div>
    );
  }

  // View 4: Main Admin Dashboard (Authenticated & Authorized)
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-emerald-800">
            <div className="bg-emerald-50 p-2 rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Authorized Session • {user?.email || TARGET_ADMIN_EMAIL}</span>
          </div>
          <h1 className="text-5xl font-serif font-bold text-emerald-900 tracking-tight leading-none">Moderator Queue</h1>
          <p className="text-gray-400 font-medium italic">Vetting community submissions for the Halal digital ecosystem.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-white border border-gray-100 rounded-[2rem] px-10 py-5 shadow-sm text-center min-w-[180px] border-b-4 border-b-emerald-800">
            <span className="block text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1 text-left">Queue Volume</span>
            <span className="text-4xl font-serif font-bold text-emerald-900 leading-none">{pendingProducts.length}</span>
          </div>
          <div className="flex flex-col gap-2">
            <button 
              onClick={fetchPending}
              className="p-4 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-emerald-800 hover:border-emerald-200 transition-all shadow-sm active:scale-90 group"
              title="Sync Database"
            >
              <RefreshCw className={`w-6 h-6 ${loading ? 'animate-spin text-emerald-800' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
            </button>
            <button 
              onClick={handleAdminLogout}
              className="p-4 bg-white border border-gray-100 rounded-2xl text-gray-300 hover:text-red-600 hover:bg-red-50 hover:border-red-100 transition-all shadow-sm active:scale-90 group"
              title="End Session"
            >
              <LogOut className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-t-[3rem] p-6 sm:p-10 flex flex-col md:flex-row items-center gap-6">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
          <input 
            type="text" placeholder="Filter queue by name, maker, or tag..."
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-16 pr-8 py-5 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-800 rounded-[2rem] outline-none transition-all font-bold text-gray-900 shadow-inner"
          />
        </div>
        <button className="h-[72px] px-10 bg-gray-50 text-gray-500 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200">
          <Filter className="w-4 h-4" /> Queue Metrics
        </button>
      </div>

      <div className="bg-white border-x border-b border-gray-100 rounded-b-[3rem] overflow-hidden shadow-2xl shadow-emerald-900/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-gray-50/50 border-y border-gray-100">
                <th className="px-12 py-7 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Product Info</th>
                <th className="px-12 py-7 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Submitter</th>
                <th className="px-12 py-7 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Category</th>
                <th className="px-12 py-7 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-12 py-7 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading && pendingProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-12 py-48 text-center">
                    <Loader2 className="w-12 h-12 text-emerald-800 animate-spin mx-auto mb-6" />
                    <p className="text-gray-400 font-black uppercase tracking-[0.3em] text-[10px]">Accessing Secure Records...</p>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-12 py-48 text-center">
                    <UserCheck className="w-16 h-16 text-emerald-50 opacity-50 mx-auto mb-6" />
                    <h2 className="text-3xl font-serif font-bold text-emerald-900 mb-3 tracking-tight">Queue All Clear</h2>
                    <p className="text-gray-400 font-medium italic">Mabrook! All pending submissions have been processed.</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="group hover:bg-emerald-50/10 transition-colors">
                    <td className="px-12 py-10">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden border border-gray-100 shadow-md shrink-0 bg-white group-hover:scale-105 transition-transform duration-500">
                          <SafeImage src={p.logo_url} alt={p.name} seed={p.name} className="w-full h-full" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-lg font-black text-gray-900 leading-none mb-2 truncate group-hover:text-emerald-800 transition-colors">{p.name}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-400 font-bold truncate max-w-[280px]">
                            <Hash className="w-3.5 h-3.5 text-emerald-800 opacity-30" />
                            {p.tagline}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-12 py-10">
                      <div className="flex items-center gap-4">
                        <img 
                          src={p.founder?.avatar_url || `https://i.pravatar.cc/150?u=${p.founder_id}`} 
                          className="w-10 h-10 rounded-full border border-gray-100 shadow-sm" 
                          alt="Maker"
                        />
                        <span className="text-sm font-black text-gray-900 truncate">@{p.founder?.username}</span>
                      </div>
                    </td>
                    <td className="px-12 py-10">
                      <span className="px-4 py-2 bg-emerald-50 text-emerald-800 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-100/50">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-12 py-10">
                      <div className="flex items-center gap-3 text-amber-600 bg-amber-50 px-4 py-2 rounded-xl border border-amber-100/50 w-fit">
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.4)]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Pending</span>
                      </div>
                    </td>
                    <td className="px-12 py-10 text-right">
                      <div className="flex items-center justify-end gap-4 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                        <a 
                          href={p.url || p.website_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-4 text-gray-400 hover:text-emerald-800 hover:bg-emerald-50 rounded-2xl transition-all border border-transparent hover:border-emerald-100 active:scale-95"
                        >
                          <Eye className="w-6 h-6" />
                        </a>
                        <button 
                          onClick={() => handleReject(p.id)}
                          disabled={processingId === p.id}
                          className="p-4 text-red-300 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all border border-transparent hover:border-red-100 active:scale-95"
                        >
                          <Trash2 className="w-6 h-6" />
                        </button>
                        <button 
                          onClick={() => handleApprove(p)}
                          disabled={processingId === p.id}
                          className="pl-8 pr-6 py-4 bg-emerald-900 text-white rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.2em] hover:bg-emerald-800 transition-all shadow-2xl active:scale-95 flex items-center gap-4 border border-emerald-700 shadow-emerald-900/10"
                        >
                          {processingId === p.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                          Authorize Live
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-12 flex flex-col sm:row items-center justify-between gap-6 px-4">
        <div className="flex items-center gap-3 text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">
          <ShieldCheck className="w-4 h-4 text-emerald-800" />
          Secure Moderator Session • Encrypted Access
        </div>
        <div className="flex items-center gap-8">
          <button 
            onClick={handleAdminLogout}
            className="flex items-center gap-2 text-red-400 hover:text-red-600 transition-colors font-black uppercase tracking-[0.2em] text-[10px] active:scale-95"
          >
            <LogOut className="w-4 h-4" /> Sign Out Admin
          </button>
          <button 
            onClick={onBack} 
            className="text-gray-400 hover:text-emerald-800 transition-colors font-black uppercase tracking-[0.2em] text-[10px] flex items-center gap-2 group active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Public View
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
