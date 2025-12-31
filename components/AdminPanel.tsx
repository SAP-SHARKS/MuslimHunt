
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Product, User } from '../types';
import { 
  ShieldCheck, Check, X, Eye, Loader2, Search, ArrowLeft, 
  MessageSquare, User as UserIcon, AlertTriangle, ExternalLink,
  RefreshCw
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
  const [actioningId, setActioningId] = useState<string | null>(null);

  // Security Guard
  const isAdmin = user?.is_admin === true;

  const fetchPending = async () => {
    if (!isAdmin) return;
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
      console.error('Error fetching pending products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, [isAdmin]);

  const handleApprove = async (product: any) => {
    setActioningId(product.id);
    try {
      // 1. Update product status
      const { error: updateError } = await supabase
        .from('products')
        .update({ is_approved: true })
        .eq('id', product.id);
      
      if (updateError) throw updateError;

      // 2. Add notification for the submitter
      const { error: notifError } = await supabase
        .from('notifications')
        .insert([{
          user_id: product.founder_id,
          type: 'approval',
          message: `Mabrook! Your product "${product.name}" has been approved and is now live.`,
          is_read: false,
          avatar_url: 'https://muslimhunt.com/logo.png' 
        }]);
      
      if (notifError) console.warn('Failed to send notification', notifError);
      
      // Local UI update for instant feedback
      setPendingProducts(prev => prev.filter(p => p.id !== product.id));
      onRefresh(); // Refresh the main app's products list
    } catch (err) {
      alert('Approval failed. Bismillah, please try again.');
    } finally {
      setActioningId(null);
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm('Are you sure you want to reject this launch? This will permanently delete the submission.')) return;
    
    setActioningId(id);
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setPendingProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert('Rejection failed.');
    } finally {
      setActioningId(null);
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-4xl mx-auto py-32 px-4 text-center animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-red-600 border border-red-100 shadow-inner">
          <AlertTriangle className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4 tracking-tight">Access Restricted</h2>
        <p className="text-gray-500 font-medium mb-8 max-w-sm mx-auto leading-relaxed">
          You do not have the required administrative permissions to view the moderator panel.
        </p>
        <button 
          onClick={onBack}
          className="px-10 py-4 bg-emerald-800 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-900 transition-all shadow-xl shadow-emerald-900/10 active:scale-95 flex items-center gap-3 mx-auto"
        >
          <ArrowLeft className="w-4 h-4" /> Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-3 hover:bg-white rounded-full transition-all border border-transparent hover:border-gray-100 shadow-sm group"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-emerald-800" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-emerald-800 mb-1">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-[0.25em]">Moderator Center</span>
            </div>
            <h1 className="text-4xl font-serif font-bold text-emerald-900 tracking-tight">Review Queue</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={fetchPending}
            className="p-4 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-emerald-800 hover:border-emerald-200 transition-all active:scale-90 shadow-sm"
            title="Refresh Queue"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <div className="bg-white border border-gray-100 rounded-2xl px-8 py-3 text-right shadow-sm">
            <p className="text-2xl font-serif font-bold text-emerald-800 leading-none">{pendingProducts.length}</p>
            <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mt-1">Pending Approval</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 space-y-4">
          <Loader2 className="w-12 h-12 text-emerald-800 animate-spin" />
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] animate-pulse">Bismillah, loading moderator queue...</p>
        </div>
      ) : pendingProducts.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-100 rounded-[3.5rem] p-32 text-center shadow-inner group transition-all">
          <div className="w-24 h-24 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 text-emerald-800 group-hover:scale-110 transition-transform duration-500">
            <Check className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-emerald-900 mb-3 tracking-tight">Mabrook! All clear.</h2>
          <p className="text-gray-400 font-medium max-w-xs mx-auto leading-relaxed">
            There are no products currently awaiting moderation. The Ummah is up to date!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingProducts.map((p) => (
            <div key={p.id} className="bg-white border border-gray-100 rounded-[2.5rem] p-6 sm:p-10 flex flex-col lg:flex-row items-center gap-8 group hover:border-emerald-200 hover:shadow-2xl hover:shadow-emerald-900/5 transition-all animate-in slide-in-from-bottom-4 duration-300">
              
              {/* Product Visual */}
              <div className="w-24 h-24 rounded-[2rem] overflow-hidden border-2 border-emerald-50 shrink-0 bg-gray-50 shadow-sm group-hover:scale-105 transition-transform duration-500">
                <SafeImage src={p.logo_url} alt={p.name} seed={p.name} className="w-full h-full" />
              </div>
              
              {/* Product Text */}
              <div className="flex-1 min-w-0 text-center lg:text-left">
                <div className="flex flex-wrap justify-center lg:justify-start items-center gap-3 mb-3">
                  <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-md">
                    {p.category}
                  </span>
                  <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest border-l pl-3 border-gray-100">
                    {new Date(p.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2 truncate tracking-tight">{p.name}</h3>
                <p className="text-gray-500 font-medium text-base line-clamp-2 mb-6 max-w-2xl leading-relaxed">{p.tagline}</p>
                
                {/* Maker Profile Info */}
                <div className="flex items-center justify-center lg:justify-start gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-100 shadow-sm">
                    <img src={p.founder?.avatar_url || `https://i.pravatar.cc/150?u=${p.founder_id}`} alt="Founder" className="w-full h-full object-cover" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-tighter leading-none mb-1">Submitted By</p>
                    <p className="text-[13px] font-bold text-emerald-800 leading-none group-hover:underline">@{p.founder?.username || 'unknown_maker'}</p>
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center gap-3 shrink-0 pt-4 lg:pt-0">
                <a 
                  href={p.url || p.website_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-5 bg-gray-50 text-gray-400 hover:text-emerald-800 hover:bg-emerald-50 rounded-2xl transition-all active:scale-90 border border-transparent hover:border-emerald-100"
                  title="Preview Landing Page"
                >
                  <Eye className="w-6 h-6" />
                </a>
                
                <button 
                  onClick={() => handleReject(p.id)}
                  disabled={actioningId === p.id}
                  className="px-8 py-5 bg-red-50 text-red-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-100 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50 border border-red-100/50"
                  title="Reject Submission"
                >
                  <X className="w-5 h-5" /> 
                  <span className="hidden sm:inline">Reject</span>
                </button>
                
                <button 
                  onClick={() => handleApprove(p)}
                  disabled={actioningId === p.id}
                  className="px-12 py-5 bg-emerald-800 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-900 transition-all shadow-xl active:scale-95 flex items-center gap-2 disabled:opacity-50 shadow-emerald-900/10 border border-emerald-700"
                  title="Approve Submission"
                >
                  {actioningId === p.id ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Check className="w-5 h-5" />
                  )}
                  <span className="hidden sm:inline">Approve Launch</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
