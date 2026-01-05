
import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { Product, User } from '../types';
import { 
  ShieldCheck, Check, X, Eye, Loader2, Search, ArrowLeft, 
  Trash2, RefreshCw, Filter, CheckCircle2, 
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

  const fetchPending = async () => {
    if (!isAuthorized) return;
    setLoading(true);
    try {
      // PGRST200 fix: Use explicit relationship naming profiles:user_id
      const { data, error } = await supabase
        .from('products')
        .select('*, profiles:user_id(username, avatar_url)')
        .eq('is_approved', false)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      setPendingProducts(data || []);
    } catch (err) {
      console.error('[Admin] Failed to fetch queue:', err);
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
    setProcessingId(product.id);
    try {
      // Step 1: Make the product LIVE
      const { error: updateError } = await supabase
        .from('products')
        .update({ is_approved: true })
        .eq('id', product.id);
      
      if (updateError) throw updateError;

      // Step 2: Trigger approval notification
      await supabase.from('notifications').insert([{
        user_id: product.user_id,
        type: 'approval',
        message: `Mabrook! Your product "${product.name}" is now live.`,
        is_read: false,
        target_id: product.id
      }]);
      
      setPendingProducts(prev => prev.filter(p => p.id !== product.id));
      onRefresh(); 
      
    } catch (err: any) {
      alert(`Failed to approve: ${err.message}`);
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
    const userId = productToReject.user_id;
    const productName = productToReject.name;

    setProcessingId(productId);
    setIsRejectModalOpen(false);
    
    try {
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
      
      if (deleteError) throw deleteError;

      const reason = rejectionNote.trim() || 'Submission did not meet community guidelines.';
      try {
        await supabase
          .from('notifications')
          .insert([{
            user_id: userId,
            type: 'rejection',
            message: `Your submission "${productName}" was removed. Reason: ${reason}`,
            is_read: false
          }]);
      } catch (e) {
        console.warn('Rejection notification could not be sent.');
      }
      
      setPendingProducts(prev => prev.filter(p => p.id !== productId));
      onRefresh(); 
    } catch (err) {
      console.error('[Admin] Rejection failed:', err);
    } finally {
      setProcessingId(null);
      setProductToReject(null);
    }
  };

  const filteredQueue = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return pendingProducts.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.profiles?.username?.toLowerCase().includes(query)
    );
  }, [pendingProducts, searchQuery]);

  if (verifying) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
  if (isAuthorized === false) return <div className="min-h-screen flex items-center justify-center text-red-600 font-bold">Access Denied</div>;
  if (isAuthorized === null) return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#042119]">
      <div className="w-full max-w-md bg-white rounded-[3rem] p-10 shadow-2xl">
         <h1 className="text-2xl font-bold text-center mb-8 text-emerald-900">Admin Dashboard</h1>
         <form onSubmit={handleAdminLogin} className="space-y-4">
           <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-4 border rounded-xl" />
           <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-4 border rounded-xl" />
           <button type="submit" disabled={loginLoading} className="w-full p-4 bg-emerald-800 text-white rounded-xl font-bold">
             {loginLoading ? 'Verifying...' : 'Sign In'}
           </button>
         </form>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-8">
      {isRejectModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-xl font-bold mb-4">Reject Submission</h2>
            <textarea value={rejectionNote} onChange={e => setRejectionNote(e.target.value)} className="w-full p-4 border rounded-xl h-32 mb-4" placeholder="Rejection reason..." />
            <div className="flex gap-4">
              <button onClick={() => setIsRejectModalOpen(false)} className="flex-1 p-3 border rounded-xl font-bold">Cancel</button>
              <button onClick={confirmRejection} className="flex-1 p-3 bg-red-600 text-white rounded-xl font-bold">Confirm</button>
            </div>
          </div>
        </div>
      )}

      <header className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-bold text-emerald-900 font-serif">Review Queue</h1>
          <p className="text-gray-400 font-medium italic mt-2">Managing community submissions.</p>
        </div>
        <button onClick={handleAdminLogout} className="px-6 py-2 border rounded-xl font-bold flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors">
          <LogOut size={18} /> Sign Out
        </button>
      </header>

      <div className="bg-white border rounded-[2rem] overflow-hidden shadow-xl">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-8 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Product</th>
              <th className="px-8 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Maker</th>
              <th className="px-8 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest text-right">Moderation</th>
            </tr>
          </thead>
          <tbody>
            {filteredQueue.map((p) => (
              <tr key={p.id} className="border-b last:border-0 hover:bg-emerald-50/10 transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg overflow-hidden border bg-white shadow-sm shrink-0">
                      <SafeImage src={p.logo_url} alt={p.name} seed={p.name} className="w-full h-full" />
                    </div>
                    <span className="font-bold text-gray-900">{p.name}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="text-sm font-bold text-gray-600">@{p.profiles?.username}</span>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <button onClick={() => initiateReject(p)} className="p-3 text-gray-300 hover:text-red-600 transition-colors"><Trash2 size={20} /></button>
                    <button onClick={() => handleApprove(p)} disabled={processingId === p.id} className="px-6 py-2.5 bg-emerald-800 text-white rounded-xl font-bold shadow-lg shadow-emerald-900/20 active:scale-95 transition-all">
                      {processingId === p.id ? <Loader2 size={18} className="animate-spin" /> : 'Approve'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredQueue.length === 0 && (
              <tr>
                <td colSpan={3} className="px-8 py-20 text-center text-gray-400 italic">No products currently in queue.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;
