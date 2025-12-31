
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import { ShieldCheck, CheckCircle, XCircle, ExternalLink, Loader2, Search, ArrowLeft, MessageSquare } from 'lucide-react';
import SafeImage from './SafeImage.tsx';

interface AdminPanelProps {
  onBack: () => void;
  onRefresh: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onBack, onRefresh }) => {
  const [pendingProducts, setPendingProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState<string | null>(null);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
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
  }, []);

  const handleApprove = async (id: string) => {
    setActioningId(id);
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_approved: true })
        .eq('id', id);
      
      if (error) throw error;
      
      setPendingProducts(prev => prev.filter(p => p.id !== id));
      onRefresh(); // Refresh parent feed
    } catch (err) {
      alert('Approval failed. Please try again.');
    } finally {
      setActioningId(null);
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm('Are you sure you want to reject this launch? This will permanently delete the record.')) return;
    
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

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-3 hover:bg-white rounded-full transition-all border border-transparent hover:border-gray-100 shadow-sm group"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-emerald-800" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-emerald-800 mb-1">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Moderator Queue</span>
            </div>
            <h1 className="text-4xl font-serif font-bold text-emerald-900">Review Launches</h1>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-serif font-bold text-emerald-800 leading-none">{pendingProducts.length}</p>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">Items pending review</p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="w-10 h-10 text-emerald-800 animate-spin" />
          <p className="text-gray-400 font-medium italic">Fetching moderation queue...</p>
        </div>
      ) : pendingProducts.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-200 rounded-[3rem] p-32 text-center">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-800 opacity-30">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-gray-400">Queue Clear!</h2>
          <p className="text-gray-500 font-medium mt-2">All products have been reviewed. Bismillah!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {pendingProducts.map((p) => (
            <div key={p.id} className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm flex flex-col lg:row-auto lg:flex-row items-center gap-8 group hover:border-emerald-100 transition-all">
              <div className="w-24 h-24 rounded-2xl overflow-hidden border border-emerald-50 shrink-0 bg-gray-50">
                <SafeImage src={p.logo_url} alt={p.name} seed={p.name} className="w-full h-full" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-md">{p.category}</span>
                  <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Submitted {new Date(p.created_at).toLocaleDateString()}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{p.name}</h3>
                <p className="text-gray-500 font-medium text-sm line-clamp-2 leading-relaxed mb-4">{p.description}</p>
                <div className="flex items-center gap-4">
                  <a 
                    href={p.url} target="_blank" rel="noopener noreferrer" 
                    className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 hover:underline"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Launch URL
                  </a>
                  <button className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 hover:text-emerald-800 transition-colors">
                    <MessageSquare className="w-3.5 h-3.5" /> View First Comment
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button 
                  onClick={() => handleReject(p.id)}
                  disabled={actioningId === p.id}
                  className="px-6 py-4 bg-red-50 text-red-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-100 transition-all flex items-center gap-2 active:scale-95"
                >
                  <XCircle className="w-4 h-4" /> Reject
                </button>
                <button 
                  onClick={() => handleApprove(p.id)}
                  disabled={actioningId === p.id}
                  className="px-10 py-4 bg-emerald-800 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-900 transition-all shadow-xl shadow-emerald-900/20 flex items-center gap-2 active:scale-95"
                >
                  {actioningId === p.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  Approve Launch
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
