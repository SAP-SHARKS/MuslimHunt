
import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { Product, User } from '../types';
import { 
  ShieldCheck, Check, X, Eye, Loader2, Search, ArrowLeft, 
  Trash2, RefreshCw, Filter, CheckCircle2, 
  AlertCircle, Hash, LogOut, Lock, Mail, KeyRound,
  AlertTriangle
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
  
  // Auth & Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  
  // Rejection Modal State
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectingProduct, setRejectingProduct] = useState<any>(null);
  const [rejectionNote, setRejectionNote] = useState('');

  const AUTHORIZED_ADMIN_EMAIL = 'zeirislam@gmail.com';
  const [verifying, setVerifying] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  // Admin Verification Logic
  const verifyAdminClearance = async (currentUser: any) => {
    if (!currentUser) {
      setIsAuthorized(null);
      setVerifying(false);
      return;
    }
    try {
      if (currentUser.email !== AUTHORIZED_ADMIN_EMAIL) throw new Error("Unauthorized");
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', currentUser.id)
        .single();

      if (error || !profile?.is_admin) throw new Error("No Privileges");
      setIsAuthorized(true);
    } catch (err) {
      setIsAuthorized(false);
      await supabase.auth.signOut();
    } finally {
      setVerifying(false);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) await verifyAdminClearance(user);
      else setVerifying(false);
    };
    initAuth();
  }, []);

  const fetchPending = async () => {
    if (!isAuthorized) return;
    setLoading(true);
    console.log("[Admin] Syncing moderation queue...");
    
    try {
      // Specifically filter for unapproved products
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          profiles:user_id (
            username,
            avatar_url
          )
        `)
        .eq('is_approved', false)
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('[Admin] Supabase fetch error:', error.message);
        throw error;
      }
      console.log('Fetched pending products (Admin Queue):', data);
      setPendingProducts(data || []);
    } catch (err) {
      console.error('[Admin] Critical sync failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthorized) fetchPending();
  }, [isAuthorized]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error && data.user) await verifyAdminClearance(data.user);
    else {
      setLoginError("Invalid credentials.");
      setLoginLoading(false);
    }
  };

  const handleApprove = async (product: any) => {
    setProcessingId(product.id);
    try {
      // 1. Update the product status in Supabase
      const { error: updateError } = await supabase
        .from('products')
        .update({ is_approved: true }) // Set to true to publish
        .eq('id', product.id);
      
      if (updateError) {
        // Explicit logging for debugging potential RLS issues
        console.error('[Admin] Update Call Failed:', updateError);
        throw updateError;
      }

      // 2. Notify the submitter using the correct user_id from schema
      const { error: notifyError } = await supabase.from('notifications').insert([{
        user_id: product.user_id, 
        type: 'approval',
        message: `Mabrook! Your product "${product.name}" has been approved and is now live.`,
        is_read: false,
        avatar_url: 'https://anzqsjvvguiqcenfdevh.supabase.co/storage/v1/object/public/assets/logo.png'
      }]);

      if (notifyError) {
        // Specifically logging the error message to identify if it is a 'foreign key violation' or 'missing column'
        console.warn('[Admin] Product approved, but notification failed:', notifyError.message);
        // We don't throw here so the UI still updates for the admin
      }
      
      // 3. Update local UI state
      setPendingProducts(prev => prev.filter(p => p.id !== product.id));
      
      // Ensure onRefresh is only called if product update was successful
      onRefresh(); 
      
    } catch (err: any) {
      console.error('[Admin] Approval Process Failed:', err.message);
      alert('Failed to approve product. See console for details.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectConfirm = async () => {
    if (!rejectingProduct || !rejectionNote.trim()) return;
    setProcessingId(rejectingProduct.id);
    try {
      // 1. Notify the user BEFORE deleting the record to preserve user_id mapping
      const { error: notifyError } = await supabase.from('notifications').insert([{
        user_id: rejectingProduct.user_id,
        type: 'rejection',
        message: `Your product "${rejectingProduct.name}" was rejected. Reason: ${rejectionNote}`,
        is_read: false
      }]);

      if (notifyError) {
        console.warn('[Admin] Rejection notification failed:', notifyError.message);
      }

      // 2. Remove the product record
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', rejectingProduct.id);
      
      if (deleteError) throw deleteError;

      setPendingProducts(prev => prev.filter(p => p.id !== rejectingProduct.id));
      setIsRejectModalOpen(false);
      setRejectionNote('');
      setRejectingProduct(null);
      
      // Ensure state consistency
      onRefresh();
    } catch (err: any) {
      console.error('[Admin] Rejection failed:', err.message);
      alert("Removal failed.");
    } finally {
      setProcessingId(null);
    }
  };

  const filteredProducts = useMemo(() => {
    return pendingProducts.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.profiles?.username || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [pendingProducts, searchQuery]);

  if (verifying) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="w-10 h-10 animate-spin text-emerald-800 mb-4" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Verifying Clearance...</p>
    </div>
  );

  if (isAuthorized === null) return (
    <div className="min-h-screen flex items-center justify-center bg-[#042119] p-4">
      <div className="bg-white p-10 sm:p-14 rounded-[3.5rem] w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-500 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 opacity-40 blur-2xl" />
        <div className="flex flex-col items-center mb-10 text-center relative z-10">
          <div className="w-20 h-20 bg-emerald-900 rounded-[2rem] flex items-center justify-center text-white mb-6 shadow-2xl">
            <KeyRound className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-emerald-900">Staff Portal</h1>
          <p className="text-gray-400 font-medium text-sm">Authorized personnel only.</p>
        </div>
        <form onSubmit={handleAdminLogin} className="space-y-4 relative z-10">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Identity</label>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-4 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-800 rounded-2xl outline-none transition-all font-bold" required />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Passkey</label>
            <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-4 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-800 rounded-2xl outline-none transition-all font-bold" required />
          </div>
          {loginError && <p className="text-red-500 text-xs font-bold text-center">{loginError}</p>}
          <button type="submit" disabled={loginLoading} className="w-full bg-emerald-900 hover:bg-emerald-800 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3">
            {loginLoading ? <Loader2 className="animate-spin" size={20} /> : 'Authenticate'}
          </button>
        </form>
        <button onClick={onBack} className="w-full mt-8 text-[10px] font-black text-gray-400 hover:text-emerald-800 transition-colors uppercase tracking-[0.2em]">Exit to Public Site</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto bg-emerald-50/30 border-4 border-emerald-100/50 rounded-[4rem] p-8 md:p-14 shadow-[0_32px_64px_-12px_rgba(6,78,59,0.1)] animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-emerald-800">
              <ShieldCheck className="w-6 h-6" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Internal Review System</span>
            </div>
            <h1 className="text-5xl font-serif font-bold text-emerald-900 tracking-tight">Admin Panel</h1>
            <p className="text-emerald-800/60 font-medium italic">Vetting community submissions for quality and compliance.</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-white border border-emerald-100 rounded-[2.5rem] px-10 py-6 shadow-sm text-center min-w-[200px] border-b-4 border-b-emerald-800">
              <span className="block text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1 text-left">Pending</span>
              <span className="text-5xl font-serif font-bold text-emerald-900 leading-none">{pendingProducts.length}</span>
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={fetchPending} className="p-4 bg-white border border-emerald-100 rounded-2xl text-emerald-800/70 hover:text-emerald-800 transition-all shadow-sm active:scale-90 group" title="Refresh Sync">
                <RefreshCw className={`w-6 h-6 ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
              </button>
              <button onClick={() => { supabase.auth.signOut(); onBack(); }} className="p-4 bg-white border border-emerald-100 rounded-2xl text-red-400 hover:text-red-600 transition-all shadow-sm active:scale-90 group" title="Sign Out">
                <LogOut className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white border border-emerald-100 rounded-[3rem] overflow-hidden shadow-2xl shadow-emerald-900/5">
          <div className="p-6 border-b border-emerald-50">
            <div className="relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
              <input 
                type="text" placeholder="Search by name, category, or maker..." 
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-16 pr-8 py-5 bg-emerald-50/30 border-transparent focus:bg-white focus:border-emerald-800 rounded-[2rem] outline-none transition-all font-bold text-emerald-900"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-emerald-50/50">
                  <th className="px-10 py-6 text-xs font-black uppercase text-emerald-800/40 tracking-[0.2em]">Submission</th>
                  <th className="px-10 py-6 text-xs font-black uppercase text-emerald-800/40 tracking-[0.2em]">Maker</th>
                  <th className="px-10 py-6 text-xs font-black uppercase text-emerald-800/40 tracking-[0.2em]">Category</th>
                  <th className="px-10 py-6 text-xs font-black uppercase text-emerald-800/40 tracking-[0.2em] text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-50">
                {loading && pendingProducts.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-10 py-32 text-center">
                      <Loader2 className="w-12 h-12 animate-spin text-emerald-800 mx-auto mb-4" />
                      <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Accessing Database...</p>
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-10 py-32 text-center">
                      <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-300">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <h2 className="text-2xl font-serif font-bold text-emerald-900 mb-2">Queue All Clear</h2>
                      <p className="text-gray-400 font-medium italic">No pending submissions matching your search.</p>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map(p => (
                    <tr key={p.id} className="group hover:bg-emerald-50/20 transition-colors">
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-6">
                          <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-emerald-100 shadow-md bg-white shrink-0 group-hover:scale-105 transition-transform duration-500">
                            <SafeImage src={p.logo_url} alt={p.name} seed={p.name} className="w-full h-full" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-lg font-black text-emerald-900 leading-none mb-1.5">{p.name}</p>
                            <div className="flex items-center gap-2 text-xs text-gray-400 font-bold truncate max-w-[200px]">
                              <Hash className="w-3.5 h-3.5 text-emerald-800 opacity-30" />
                              {p.tagline}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden border border-emerald-100">
                            <img 
                              src={p.profiles?.avatar_url || `https://i.pravatar.cc/150?u=${p.user_id}`} 
                              alt="Submitter" 
                              className="w-full h-full object-cover" 
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[13px] font-bold text-gray-900 leading-none">@{p.profiles?.username || 'user'}</p>
                            <p className="text-[10px] font-black text-gray-400 uppercase mt-1">Submitter</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <span className="px-4 py-2 bg-emerald-50 text-emerald-800 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                          {p.category}
                        </span>
                      </td>
                      <td className="px-10 py-8 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <a 
                            href={p.url || p.website_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-3 text-emerald-800/70 hover:text-emerald-900 hover:bg-emerald-50 rounded-xl transition-all active:scale-95"
                          >
                            <Eye size={22}/>
                          </a>
                          <button 
                            onClick={() => { setRejectingProduct(p); setIsRejectModalOpen(true); }} 
                            className="p-3 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all active:scale-95"
                          >
                            <Trash2 size={22}/>
                          </button>
                          <button 
                            onClick={() => handleApprove(p)} 
                            disabled={processingId === p.id}
                            className="bg-emerald-800 text-white pl-8 pr-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-emerald-900/10 hover:bg-emerald-900 transition-all active:scale-95 flex items-center gap-4 disabled:opacity-50"
                          >
                            {processingId === p.id ? <Loader2 className="animate-spin" size={18}/> : <CheckCircle2 size={18} />}
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

      {isRejectModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[3.5rem] w-full max-w-lg p-10 sm:p-12 shadow-2xl border border-emerald-50 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 shadow-inner">
                <AlertTriangle size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-serif font-bold text-gray-900">Reason for Rejection</h2>
                <p className="text-gray-400 text-sm font-medium italic">Submitter will be notified.</p>
              </div>
            </div>
            
            <p className="text-gray-500 mb-4 text-sm font-medium leading-relaxed">
              Why is the submission <span className="font-bold text-emerald-900">"{rejectingProduct?.name}"</span> being removed from the review queue?
            </p>
            
            <textarea 
              value={rejectionNote} 
              onChange={(e) => setRejectionNote(e.target.value)} 
              className="w-full h-40 p-6 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-red-600 rounded-[2rem] outline-none transition-all font-medium text-gray-700 shadow-inner resize-none mb-8 placeholder:text-gray-300"
              placeholder="e.g. Broken link, non-halal content, or missing information..."
            />
            
            <div className="flex gap-4">
              <button 
                onClick={() => { setIsRejectModalOpen(false); setRejectionNote(''); }} 
                className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95"
              >
                Cancel
              </button>
              <button 
                onClick={handleRejectConfirm} 
                disabled={processingId !== null || !rejectionNote.trim()}
                className="flex-1 py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-red-600/20 active:scale-95 disabled:opacity-50"
              >
                {processingId === rejectingProduct?.id ? <Loader2 className="animate-spin mx-auto" size={16}/> : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-12 text-center">
        <button onClick={onBack} className="text-gray-400 hover:text-emerald-800 transition-colors font-black uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-2 mx-auto group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to discovery feed
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;
