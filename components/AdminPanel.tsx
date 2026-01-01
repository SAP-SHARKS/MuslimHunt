
import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { Product, User } from '../types';
import { 
  ShieldCheck, Check, X, Eye, Loader2, Search, ArrowLeft, 
  Trash2, ExternalLink, RefreshCw, Filter, CheckCircle2, 
  AlertCircle, Hash, LogOut, Lock, Mail, KeyRound,
  ShieldAlert, UserCheck, ArrowRight, Shield, MessageSquare, AlertTriangle
} from 'lucide-react';
import SafeImage from './SafeImage.tsx';

interface AdminPanelProps {
  user: User | null;
  onBack: () => void;
  onRefresh: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ user: initialUser, onBack, onRefresh }) => {
  const [pendingProducts, setPendingProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  // Auth & Login Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  
  // Rejection Modal State
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionNote, setRejectionNote] = useState('');
  const [productToReject, setProductToReject] = useState<any | null>(null);
  
  // Strict Authorization Config
  const AUTHORIZED_ADMIN_EMAIL = 'zeirislam@gmail.com';

  // State to track if the current session is verified as a valid admin
  const [verifying, setVerifying] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  const verifyAdminAccess = async (currentUser: any) => {
    if (!currentUser) {
      setIsAuthorized(null);
      setVerifying(false);
      return;
    }

    setVerifying(true);
    try {
      if (currentUser.email !== AUTHORIZED_ADMIN_EMAIL) {
        throw new Error("Strictly for Admins only.");
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', currentUser.id)
        .single();

      if (error || !profile?.is_admin) {
        throw new Error("Strictly for Admins only.");
      }

      setIsAuthorized(true);
    } catch (err: any) {
      console.warn('[Admin] Access Denied:', err.message);
      setIsAuthorized(false);
      setLoginError(err.message);
      await supabase.auth.signOut();
    } finally {
      setVerifying(false);
    }
  };

  useEffect(() => {
    const checkCurrentSession = async () => {
      const { data: { user: sessionUser } } = await supabase.auth.getUser();
      if (sessionUser) {
        await verifyAdminAccess(sessionUser);
      } else {
        setVerifying(false);
      }
    };
    checkCurrentSession();
  }, []);

  const fetchQueue = async () => {
    if (!isAuthorized) return;
    setLoading(true);
    try {
      console.log('[Admin] Fetching pending queue...');
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
      
      if (error) {
        console.error('[Admin] Queue fetch error:', error);
        throw error;
      }
      setPendingProducts(data || []);
    } catch (err) {
      console.error('[Admin] Failed to fetch queue:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthorized) {
      fetchQueue();
    }
  }, [isAuthorized]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      if (data.user) {
        await verifyAdminAccess(data.user);
      }
    } catch (err: any) {
      setLoginError(err.message || 'Invalid credentials.');
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
    console.log(`[Admin] Initiating approval for: ${product.name} (ID: ${product.id})`);
    setProcessingId(product.id);
    
    // Optimistic UI update
    const previousState = [...pendingProducts];
    setPendingProducts(prev => prev.filter(p => p.id !== product.id));

    try {
      // 1. Update product status
      const { data: updateData, error: updateError } = await supabase
        .from('products')
        .update({ is_approved: true })
        .eq('id', product.id)
        .select();
      
      if (updateError) {
        console.error('[Admin] Supabase update error:', updateError);
        throw updateError;
      }
      console.log('[Admin] Product approved in database:', updateData);

      // 2. Insert notification for user
      const { error: notifError } = await supabase
        .from('notifications')
        .insert([{
          user_id: product.founder_id,
          type: 'approval',
          message: `Your product "${product.name}" is now live on Muslim Hunt!`,
          is_read: false,
          avatar_url: 'https://muslimhunt.com/logo.png' 
        }]);
      
      if (notifError) {
        console.warn('[Admin] Notification insert failed (product approved anyway):', notifError);
      }

      console.log('[Admin] Approval workflow complete.');
      
      // Notify parent to refresh the main public feed
      onRefresh(); 
      // Refresh local admin queue to stay in sync
      await fetchQueue();
    } catch (err: any) {
      console.error('[Admin] Full approval logic failure:', err);
      // Revert optimistic update
      setPendingProducts(previousState);
      alert(`Approval failed: ${err.message || 'Check console for details.'}`);
    } finally {
      setProcessingId(null);
    }
  };

  const initiateReject = (product: any) => {
    setProductToReject(product);
    setRejectionNote('');
    setIsRejectModalOpen(true);
  };

  const confirmRejection = async () => {
    if (!productToReject) return;
    
    const productId = productToReject.id;
    const founderId = productToReject.founder_id;
    const productName = productToReject.name;

    console.log(`[Admin] Initiating rejection for: ${productName} (ID: ${productId})`);
    setProcessingId(productId);
    setIsRejectModalOpen(false);
    
    // Optimistic UI update
    const previousState = [...pendingProducts];
    setPendingProducts(prev => prev.filter(p => p.id !== productId));

    try {
      // 1. Send personalized rejection notification FIRST (while record exists)
      const reason = rejectionNote.trim() || 'Submission did not meet community guidelines.';
      console.log('[Admin] Sending rejection notification...');
      const { error: notifError } = await supabase
        .from('notifications')
        .insert([{
          user_id: founderId,
          type: 'rejection',
          message: `Your submission "${productName}" was removed. Reason: ${reason}`,
          is_read: false,
          avatar_url: 'https://muslimhunt.com/logo.png'
        }]);
      
      if (notifError) {
        console.warn('[Admin] Notification failed but proceeding with deletion:', notifError);
      }

      // 2. Delete the product submission
      console.log('[Admin] Deleting product record...');
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
      
      if (deleteError) {
        console.error('[Admin] Supabase delete error:', deleteError);
        throw deleteError;
      }

      console.log('[Admin] Rejection workflow complete.');
      
      // Refresh local admin queue
      await fetchQueue();
      // Notify parent (unlikely to affect public feed since it wasn't approved, but good for state)
      onRefresh(); 
    } catch (err: any) {
      console.error('[Admin] Full rejection logic failure:', err);
      // Revert optimistic update
      setPendingProducts(previousState);
      alert(`Rejection failed: ${err.message || 'Check console for details.'}`);
    } finally {
      setProcessingId(null);
      setProductToReject(null);
    }
  };

  const filteredQueue = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return pendingProducts.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.founder?.username?.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
    );
  }, [pendingProducts, searchQuery]);

  if (verifying) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="relative mb-6">
          <Loader2 className="w-12 h-12 text-emerald-800 animate-spin" />
          <Shield className="absolute inset-0 m-auto w-5 h-5 text-emerald-800" />
        </div>
        <p className="text-gray-400 font-black uppercase tracking-[0.3em] text-[10px]">Verifying Admin Privileges...</p>
      </div>
    );
  }

  if (isAuthorized === false) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-white animate-in fade-in duration-500">
        <div className="max-w-md w-full text-center">
          <div className="w-24 h-24 bg-red-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 text-red-600 border border-red-100 shadow-inner">
            <ShieldAlert className="w-12 h-12" />
          </div>
          <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4 tracking-tight">Access Restricted</h2>
          <p className="text-gray-500 font-medium mb-10 leading-relaxed">
            {loginError || "Strictly for Admins only. Unauthorized access attempts are monitored."}
          </p>
          <button 
            onClick={() => setIsAuthorized(null)} 
            className="w-full px-10 py-5 bg-emerald-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-800 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  if (isAuthorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-20 bg-[#042119] bg-[radial-gradient(circle_at_top_left,rgba(6,78,59,0.4),transparent)]">
        <div className="w-full max-w-md bg-white rounded-[3.5rem] p-10 sm:p-14 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] border border-emerald-900/10 animate-in fade-in zoom-in-95 duration-700 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-50 rounded-full -mr-20 -mt-20 opacity-40 blur-3xl" />
          
          <div className="flex flex-col items-center mb-12 text-center relative z-10">
            <div className="w-24 h-24 bg-emerald-900 rounded-[2.5rem] flex items-center justify-center text-white mb-8 shadow-2xl shadow-emerald-900/40 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
              <KeyRound className="w-12 h-12" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-emerald-900 mb-2">Muslim Hunt Admin</h1>
            <p className="text-gray-400 font-medium text-sm leading-relaxed">Secure portal for platform moderators.</p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-5 relative z-10">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-emerald-800/40 uppercase tracking-[0.2em] px-1">Identity</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-800/30 group-focus-within:text-emerald-800 transition-colors" />
                <input 
                  type="email" placeholder="zeirislam@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} required
                  className="w-full pl-12 pr-6 py-4 bg-emerald-50/30 border border-transparent focus:bg-white focus:border-emerald-800 rounded-2xl outline-none font-bold text-gray-900 transition-all shadow-inner placeholder:text-gray-300"
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] font-black text-emerald-800/40 uppercase tracking-[0.2em] px-1">Security Key</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-800/30 group-focus-within:text-emerald-800 transition-colors" />
                <input 
                  type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required
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
              type="submit" disabled={loginLoading}
              className="w-full bg-emerald-900 hover:bg-emerald-800 text-white font-black py-5 rounded-[1.5rem] transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 mt-4 group shadow-xl shadow-emerald-900/20"
            >
              {loginLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>Sign In to Dashboard <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>

          <button onClick={onBack} className="w-full mt-10 py-2 text-[10px] font-black text-gray-400 hover:text-emerald-800 uppercase tracking-[0.3em] transition-colors flex items-center justify-center gap-2 group">
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> Exit to Public Site
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-8 animate-in fade-in duration-500">
      {/* Rejection Note Modal */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsRejectModalOpen(false)} />
          <div className="relative bg-white rounded-[2.5rem] shadow-2xl border border-red-50 max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 sm:p-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 shadow-inner">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-serif font-bold text-gray-900 leading-none mb-1">Reject Submission</h3>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{productToReject?.name}</p>
                </div>
              </div>
              
              <div className="space-y-4 mb-8">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-red-600" /> Rejection Note
                </label>
                <textarea 
                  value={rejectionNote}
                  onChange={(e) => setRejectionNote(e.target.value)}
                  placeholder="Explain to the maker why this submission is being removed..."
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-red-600 rounded-3xl outline-none transition-all resize-none text-base font-medium shadow-inner h-40"
                />
                <p className="text-[10px] text-gray-400 italic">This feedback helps the community maintain our quality standards.</p>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setIsRejectModalOpen(false)}
                  className="flex-1 py-4 px-6 border border-gray-100 rounded-2xl font-black text-xs uppercase tracking-widest text-gray-400 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmRejection}
                  disabled={processingId !== null}
                  className="flex-1 py-4 px-6 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-600/20 disabled:opacity-50"
                >
                  Confirm Removal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Premium Green Box Dashboard Container */}
      <div className="max-w-7xl mx-auto bg-gradient-to-br from-emerald-50/40 via-white to-white border-4 border-emerald-100/50 rounded-[3.5rem] p-8 md:p-12 shadow-[0_32px_64px_-12px_rgba(6,78,59,0.1)]">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-emerald-800">
              <div className="bg-emerald-100 p-2 rounded-xl">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Authorized Session • {AUTHORIZED_ADMIN_EMAIL}</span>
            </div>
            <h1 className="text-5xl font-serif font-bold text-emerald-900 tracking-tight leading-none">Submission Review</h1>
            <p className="text-gray-400 font-medium italic">Vetting community uploads for quality and compliance.</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-white border border-gray-100 rounded-[2rem] px-10 py-5 shadow-sm text-center min-w-[180px] border-b-4 border-b-emerald-800">
              <span className="block text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1 text-left">Pending Queue</span>
              <span className="text-4xl font-serif font-bold text-emerald-900 leading-none">{pendingProducts.length}</span>
            </div>
            <div className="flex flex-col gap-2">
              <button 
                onClick={fetchQueue}
                className="p-4 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-emerald-800 transition-all shadow-sm active:scale-90 group"
                title="Refresh Sync"
              >
                <RefreshCw className={`w-6 h-6 ${loading ? 'animate-spin text-emerald-800' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
              </button>
              <button 
                onClick={handleAdminLogout}
                className="p-4 bg-white border border-gray-100 rounded-2xl text-gray-300 hover:text-red-600 hover:bg-red-50 hover:border-red-100 transition-all shadow-sm active:scale-90 group"
                title="Sign Out"
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
              type="text" placeholder="Search pending products..."
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 pr-8 py-5 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-800 rounded-[2rem] outline-none transition-all font-bold text-gray-900 shadow-inner"
            />
          </div>
          <button className="h-[72px] px-10 bg-gray-50 text-gray-500 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200">
            <Filter className="w-4 h-4" /> Filter Options
          </button>
        </div>

        <div className="bg-white border-x border-b border-gray-100 rounded-b-[3rem] overflow-hidden shadow-2xl shadow-emerald-900/5">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-gray-50/50 border-y border-gray-100">
                  <th className="px-12 py-7 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Product</th>
                  <th className="px-12 py-7 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Maker</th>
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
                      <p className="text-gray-400 font-black uppercase tracking-[0.3em] text-[10px]">Accessing Database...</p>
                    </td>
                  </tr>
                ) : filteredQueue.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-12 py-48 text-center">
                      <UserCheck className="w-16 h-16 text-emerald-50 opacity-50 mx-auto mb-6" />
                      <h2 className="text-3xl font-serif font-bold text-emerald-900 mb-3 tracking-tight">Queue All Clear</h2>
                      <p className="text-gray-400 font-medium italic">All pending submissions have been processed.</p>
                    </td>
                  </tr>
                ) : (
                  filteredQueue.map((p) => (
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
                          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Reviewing</span>
                        </div>
                      </td>
                      <td className="px-12 py-10 text-right">
                        <div className="flex items-center justify-end gap-4">
                          <a 
                            href={p.url || p.website_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-4 text-emerald-700/60 hover:text-emerald-800 hover:bg-emerald-50 rounded-2xl transition-all border border-emerald-100/50 active:scale-95"
                          >
                            <Eye className="w-6 h-6" />
                          </a>
                          <button 
                            onClick={() => initiateReject(p)}
                            disabled={processingId === p.id}
                            className="p-4 text-red-400/60 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all active:scale-95"
                          >
                            <Trash2 className="w-6 h-6" />
                          </button>
                          <button 
                            onClick={() => handleApprove(p)}
                            disabled={processingId === p.id}
                            className="pl-8 pr-6 py-4 bg-emerald-800/90 hover:bg-emerald-900 text-white rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.2em] transition-all shadow-lg active:scale-95 flex items-center gap-4 border border-emerald-700 shadow-emerald-900/10"
                          >
                            {processingId === p.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                            Approve Launch
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
      </div>

      <div className="mt-12 text-center">
        <button onClick={onBack} className="text-gray-400 hover:text-emerald-800 transition-colors font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2 mx-auto group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to feed
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;
