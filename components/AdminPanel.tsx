
import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { Product, User } from '../types';
import { 
  ShieldCheck, Check, X, Eye, Loader2, Search, ArrowLeft, 
  Trash2, ExternalLink, RefreshCw, Filter, CheckCircle2, 
  AlertCircle, ChevronRight, Hash
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

  // Security Gate
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
      console.error('Moderation error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, [isAdmin]);

  const handleApprove = async (product: any) => {
    setProcessingId(product.id);
    
    // Optimistic Update: Remove from UI immediately
    const previousState = [...pendingProducts];
    setPendingProducts(prev => prev.filter(p => p.id !== product.id));

    try {
      // 1. Mark as approved
      const { error: updateError } = await supabase
        .from('products')
        .update({ is_approved: true })
        .eq('id', product.id);
      
      if (updateError) throw updateError;

      // 2. Send notification to the maker
      await supabase
        .from('notifications')
        .insert([{
          user_id: product.founder_id,
          type: 'approval',
          message: `Mabrook! Your product "${product.name}" has been approved and is now live.`,
          is_read: false,
          avatar_url: 'https://muslimhunt.com/logo.png' 
        }]);
      
      // Trigger main feed refresh
      onRefresh(); 
    } catch (err) {
      console.error('Approval failed:', err);
      setPendingProducts(previousState); // Rollback on error
      alert('Approval failed. Please try again.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this submission? This action cannot be undone.')) return;
    
    setProcessingId(id);
    const previousState = [...pendingProducts];
    setPendingProducts(prev => prev.filter(p => p.id !== id));

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (err) {
      console.error('Rejection failed:', err);
      setPendingProducts(previousState); // Rollback on error
      alert('Rejection failed.');
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

  if (!isAdmin) {
    return (
      <div className="max-w-4xl mx-auto py-40 px-4 text-center">
        <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-red-600 border border-red-100 shadow-inner">
          <AlertCircle className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4 tracking-tight">Admin Moderation Only</h2>
        <p className="text-gray-500 font-medium mb-8 max-w-sm mx-auto">This dashboard is restricted to community moderators. Please return to the main feed.</p>
        <button onClick={onBack} className="px-10 py-4 bg-emerald-800 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-900 transition-all shadow-xl shadow-emerald-900/10 active:scale-95 flex items-center gap-3 mx-auto">
          <ArrowLeft className="w-4 h-4" /> Return to Feed
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-8 animate-in fade-in duration-500">
      {/* Premium Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-emerald-800">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Review Queue</span>
          </div>
          <h1 className="text-5xl font-serif font-bold text-emerald-900 tracking-tight">Moderation Dashboard</h1>
          <p className="text-gray-400 font-medium italic">Vetting the next generation of Halal-conscious tech.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-white border border-gray-100 rounded-[1.5rem] px-8 py-4 shadow-sm text-center min-w-[160px]">
            <span className="block text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Items Pending</span>
            <span className="text-3xl font-serif font-bold text-emerald-800 leading-none">{pendingProducts.length}</span>
          </div>
          <button 
            onClick={fetchPending}
            className="p-5 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-emerald-800 hover:border-emerald-200 transition-all shadow-sm active:scale-90"
            title="Refresh List"
          >
            <RefreshCw className={`w-6 h-6 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Advanced Filter Bar */}
      <div className="bg-white border border-gray-100 rounded-t-[2.5rem] p-6 sm:p-8 flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
          <input 
            type="text"
            placeholder="Filter by product name, maker, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 py-5 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-800 rounded-[1.5rem] outline-none transition-all font-bold text-gray-900 shadow-inner"
          />
        </div>
        <button className="h-[64px] px-8 bg-gray-50 text-gray-500 rounded-[1.5rem] font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200">
          <Filter className="w-4 h-4" /> Filter Options
        </button>
      </div>

      {/* Premium Table Content */}
      <div className="bg-white border-x border-b border-gray-100 rounded-b-[2.5rem] overflow-hidden shadow-2xl shadow-emerald-900/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-gray-50/50 border-y border-gray-100">
                <th className="px-10 py-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Product Details</th>
                <th className="px-10 py-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Submitter</th>
                <th className="px-10 py-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Category</th>
                <th className="px-10 py-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-10 py-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading && pendingProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-10 py-40 text-center">
                    <Loader2 className="w-12 h-12 text-emerald-800 animate-spin mx-auto mb-6" />
                    <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Accessing Database...</p>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-10 py-40 text-center">
                    <div className="w-20 h-20 bg-emerald-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-emerald-800">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h2 className="text-3xl font-serif font-bold text-emerald-900 mb-2">Mabrook! All Clear</h2>
                    <p className="text-gray-400 font-medium">No products are currently awaiting moderation.</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="group hover:bg-emerald-50/10 transition-colors">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-100 shadow-sm shrink-0 bg-gray-50">
                          <SafeImage src={p.logo_url} alt={p.name} seed={p.name} className="w-full h-full" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-base font-black text-gray-900 group-hover:text-emerald-800 transition-colors leading-none mb-2 truncate">
                            {p.name}
                          </p>
                          <div className="flex items-center gap-2 text-[11px] text-gray-400 font-bold truncate max-w-[240px]">
                            <Hash className="w-3 h-3 text-emerald-800 opacity-40" />
                            {p.tagline}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-100 bg-gray-50">
                          <img 
                            src={p.founder?.avatar_url || `https://i.pravatar.cc/150?u=${p.founder_id}`} 
                            className="w-full h-full object-cover" 
                            alt="Submitter"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[13px] font-bold text-gray-900 leading-none mb-1">
                            @{p.founder?.username || 'user'}
                          </span>
                          <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Maker</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className="px-3.5 py-1.5 bg-emerald-50 text-emerald-800 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-100/50">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-2 text-amber-600 bg-amber-50/50 w-fit px-3 py-1.5 rounded-lg border border-amber-100/50">
                        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Pending</span>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-300">
                        <a 
                          href={p.url || p.website_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-3.5 text-gray-400 hover:text-emerald-800 hover:bg-emerald-50 rounded-xl transition-all border border-transparent hover:border-emerald-100"
                          title="Preview Landing Page"
                        >
                          <Eye className="w-5 h-5" />
                        </a>
                        <button 
                          onClick={() => handleReject(p.id)}
                          disabled={processingId === p.id}
                          className="p-3.5 text-red-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
                          title="Reject and Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleApprove(p)}
                          disabled={processingId === p.id}
                          className="pl-6 pr-5 py-3.5 bg-emerald-800 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-emerald-900 transition-all shadow-xl shadow-emerald-900/10 active:scale-95 flex items-center gap-3 border border-emerald-700"
                        >
                          {processingId === p.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Check className="w-4 h-4" />
                          )}
                          Approve
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

      {/* Footer Meta */}
      <div className="mt-10 flex flex-col sm:row items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-2 text-[10px] font-black text-gray-300 uppercase tracking-widest">
          <ShieldCheck className="w-4 h-4" />
          Secure Moderator Session
        </div>
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-emerald-800 transition-colors font-black uppercase tracking-widest text-[10px] group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Live Feed
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;
