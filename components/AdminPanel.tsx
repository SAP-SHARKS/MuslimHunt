import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { Product, User } from '../types';
import { 
  ShieldCheck, Check, X, Eye, Loader2, Search, ArrowLeft, 
  Trash2, ExternalLink, RefreshCw, Filter, CheckCircle2, 
  AlertCircle, Hash, LogOut, Lock, Mail, KeyRound,
  ShieldAlert, UserCheck, ArrowRight, Shield
} from 'lucide-react';
import SafeImage from './SafeImage.tsx';

interface AdminPanelProps {
  user: User | null;
  onBack: () => void;
  onRefresh: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ user: initialUser, onBack, onRefresh }) => {
  const [pendingProducts, setPendingProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  
  const AUTHORIZED_ADMIN_EMAIL = 'zeirislam@gmail.com';
  const [verifying, setVerifying] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  const verifyAdminClearance = async (currentUser: any) => {
    if (!currentUser) {
      setIsAuthorized(null);
      setVerifying(false);
      return;
    }

    try {
      if (currentUser.email !== AUTHORIZED_ADMIN_EMAIL) {
        throw new Error("Unauthorized identity.");
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', currentUser.id)
        .single();

      if (error || !profile?.is_admin) {
        throw new Error("Missing admin privileges.");
      }

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
      const { data: { user: sessionUser } } = await supabase.auth.getUser();
      if (sessionUser) {
        await verifyAdminClearance(sessionUser);
      } else {
        setVerifying(false);
      }
    };
    initAuth();
  }, []);

  const fetchPending = async () => {
    if (!isAuthorized) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`*, profiles:user_id (username, avatar_url)`)
        .eq('is_approved', false)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      setPendingProducts(data || []);
    } catch (err) {
      console.error('[Admin] Fetch failed:', err);
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
    setLoginError(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data.user) await verifyAdminClearance(data.user);
    } catch (err: any) {
      setLoginError('Invalid credentials or unauthorized access.');
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

      await supabase.from('notifications').insert([{
        user_id: product.user_id,
        message: `Your product "${product.name}" has been approved!`,
        type: 'approval'
      }]);
      
      setPendingProducts(prev => prev.filter(p => p.id !== product.id));
      onRefresh();
    } catch (err) {
      alert('Approval failed.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm('Permanently delete this submission?')) return;
    setProcessingId(id);
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      setPendingProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert('Deletion failed.');
    } finally {
      setProcessingId(null);
    }
  };

  const filteredProducts = useMemo(() => {
    return pendingProducts.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [pendingProducts, searchQuery]);

  if (verifying) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Loader2 className="w-10 h-10 text-emerald-800 animate-spin" />
    </div>
  );

  if (isAuthorized === false) return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6 text-center">
      <div>
        <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
        <button onClick={handleAdminLogout} className="bg-emerald-900 text-white px-6 py-2 rounded-lg">Exit</button>
      </div>
    </div>
  );

  if (isAuthorized === null) return (
    <div className="min-h-screen flex items-center justify-center bg-[#042119] p-4">
      <div className="bg-white p-10 rounded-[2rem] w-full max-w-md shadow-2xl">
        <h1 className="text-2xl font-bold text-center mb-6 text-emerald-900">Admin Portal</h1>
        <form onSubmit={handleAdminLogin} className="space-y-4">
          <input type="email" placeholder="Admin Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-4 bg-gray-50 rounded-xl outline-none border focus:border-emerald-800" required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-4 bg-gray-50 rounded-xl outline-none border focus:border-emerald-800" required />
          {loginError && <p className="text-red-500 text-xs">{loginError}</p>}
          <button type="submit" disabled={loginLoading} className="w-full bg-emerald-900 text-white py-4 rounded-xl font-bold">
            {loginLoading ? 'Entering...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-serif font-bold text-emerald-900">Moderation Queue</h1>
        <button onClick={handleAdminLogout} className="text-red-500 flex items-center gap-2 font-bold"><LogOut size={18}/> Logout</button>
      </div>

      <div className="mb-6 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input type="text" placeholder="Search pending products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-white border rounded-2xl outline-none focus:ring-2 ring-emerald-800/20" />
      </div>

      <div className="bg-white border rounded-[2rem] overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-6 text-xs font-black uppercase tracking-widest text-gray-400">Product</th>
              <th className="p-6 text-xs font-black uppercase tracking-widest text-gray-400">Category</th>
              <th className="p-6 text-xs font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredProducts.map(p => (
              <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden border bg-white">
                      <SafeImage src={p.logo_url} alt={p.name} seed={p.name} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{p.name}</p>
                      <p className="text-xs text-gray-400 truncate max-w-[200px]">{p.tagline}</p>
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-800 rounded-lg text-[10px] font-bold uppercase">{p.category}</span>
                </td>
                <td className="p-6 text-right space-x-2">
                  <button onClick={() => handleReject(p.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 size={20}/></button>
                  <button onClick={() => handleApprove(p)} disabled={processingId === p.id} className="bg-emerald-900 text-white px-6 py-2 rounded-xl text-xs font-bold uppercase">Approve</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredProducts.length === 0 && <div className="p-20 text-center text-gray-400 italic">No pending products.</div>}
      </div>
    </div>
  );
};

export default AdminPanel;
