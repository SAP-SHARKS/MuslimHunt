
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
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionNote, setRejectionNote] = useState('');
  const [productToReject, setProductToReject] = useState<any | null>(null);
  
  const AUTHORIZED_ADMIN_EMAIL = 'zeirislam@gmail.com';
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
      if (data.user) await verifyAdminAccess(data.user);
    } catch (err: any) {
      setLoginError(err.message || 'Invalid credentials.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleAdminLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthorized(null);
    onBack();
  };

  const handleApprove = async (product: any) => {
    setProcessingId(product.id);
    try {
      const { error: updateError } = await supabase
        .from('products')
        .update({ is_approved: true })
        .eq('id', product.id);
      
      if (updateError) throw updateError;

      // Social Trigger: Approval notification
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
    setProcessingId(productToReject.id);
    setIsRejectModalOpen(false);
    try {
      await supabase.from('products').delete().eq('id', productToReject.id);
      await supabase.from('notifications').insert([{
        user_id: productToReject.user_id,
        type: 'rejection',
        message: `Your submission "${productToReject.name}" was removed. Reason: ${rejectionNote.trim() || 'Did not meet guidelines.'}`,
        is_read: false
      }]);
      setPendingProducts(prev => prev.filter(p => p.id !== productToReject.id));
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
  if (isAuthorized === false) return <div className="min-h-screen flex items-center justify-center">Access Denied</div>;
  if (isAuthorized === null) return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#042119]">
      <div className="bg-white rounded-[3rem] p-10 max-w-md w-full">
         <h1 className="text-2xl font-bold text-center mb-8">Admin Dashboard</h1>
         <form onSubmit={handleAdminLogin} className="space-y-4">
           <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-4 border rounded-xl" />
           <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-4 border rounded-xl" />
           <button type="submit" className="w-full p-4 bg-emerald-800 text-white rounded-xl font-bold">Sign In</button>
         </form>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-8">
      {isRejectModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-xl font-bold mb-4">Reject Submission</h2>
            <textarea value={rejectionNote} onChange={e => setRejectionNote(e.target.value)} className="w-full p-4 border rounded-xl h-32 mb-4" placeholder="Rejection reason..." />
            <div className="flex gap-4">
              <button onClick={() => setIsRejectModalOpen(false)} className="flex-1 p-3 border rounded-xl">Cancel</button>
              <button onClick={confirmRejection} className="flex-1 p-3 bg-red-600 text-white rounded-xl">Confirm</button>
            </div>
          </div>
        </div>
      )}

      <header className="flex justify-between items-end mb-12">
        <h1 className="text-4xl font-bold text-emerald-900 font-serif">Admin Review Queue</h1>
        <button onClick={handleAdminLogout} className="p-3 border rounded-xl flex items-center gap-2"><LogOut size={18} /> Exit</button>
      </header>

      <div className="bg-white border rounded-[2rem] overflow-hidden shadow-xl">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-8 py-4">Product</th>
              <th className="px-8 py-4">Maker</th>
              <th className="px-8 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredQueue.map(p => (
              <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg overflow-hidden border bg-white"><SafeImage src={p.logo_url} alt={p.name} className="w-full h-full" /></div>
                    <span className="font-bold text-gray-900">{p.name}</span>
                  </div>
                </td>
                <td className="px-8 py-6">@{p.profiles?.username}</td>
                <td className="px-8 py-6 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <button onClick={() => initiateReject(p)} className="p-3 text-red-400 hover:text-red-600"><Trash2 size={20} /></button>
                    <button onClick={() => handleApprove(p)} disabled={processingId === p.id} className="px-6 py-3 bg-emerald-800 text-white rounded-xl font-bold shadow-lg shadow-emerald-900/20">
                      {processingId === p.id ? <Loader2 className="animate-spin" size={18} /> : 'Approve'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;
