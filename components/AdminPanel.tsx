
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import { ShieldCheck, CheckCircle2, XCircle, ArrowLeft, Loader2, ExternalLink, MessageSquare } from 'lucide-react';
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
      
      if (!error) setPendingProducts(data || []);
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
      
      if (!error) {
        setPendingProducts(prev => prev.filter(p => p.id !== id));
        // Global refresh to update the public feed state in App.tsx
        onRefresh(); 
      }
    } finally {
      setActioningId(null);
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm('Are you sure you want to reject and delete this submission?')) return;
    setActioningId(id);
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (!error) {
        setPendingProducts(prev => prev.filter(p => p.id !== id));
      }
    } finally {
      setActioningId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 animate-in fade-in duration-500">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-emerald-800 transition-colors mb-10 group font-bold uppercase tracking-widest text-xs"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Return to feed
      </button>

      <div className="flex items-center justify-between mb-12 border-b border-emerald-50 pb-8">
        <div>
          <div className="flex items-center gap-2 text-emerald-800 mb-2">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Moderator Queue</span>
          </div>
          <h1 className="text-4xl font-serif font-bold text-emerald-900 leading-none">Review Launches</h1>
        </div>
        <div className="text-right">
          <p className="text-3xl font-black text-emerald-800 leading-none">{pendingProducts.length}</p>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Pending items</p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="w-10 h-10 text-emerald-800 animate-spin" />
          <p className="text-gray-400 font-medium italic">Fetching queue...</p>
        </div>
      ) : pendingProducts.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-200 rounded-[3rem] p-32 text-center">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-800 opacity-30">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-gray-300">Moderation clear</h2>
          <p className="text-gray-400 font-medium italic">No launches currently awaiting review.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {pendingProducts.map((p) => (
            <div key={p.id} className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm flex flex-col lg:flex-row items-start lg:items-center gap-8 group hover:border-emerald-100 transition-all">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border border-emerald-50 bg-white shrink-0 shadow-sm">
                <SafeImage src={p.logo_url} alt={p.name} seed={p.name} className="w-full h-full" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-md">{p.category}</span>
                  <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                    {p.scheduled_date ? `Scheduled: ${new Date(p.scheduled_date).toLocaleDateString()}` : `Submitted: ${new Date(p.created_at).toLocaleDateString()}`}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1 tracking-tight">{p.name}</h3>
                <p className="text-gray-500 font-medium mb-4 line-clamp-2 leading-relaxed">{p.description}</p>
                
                {p.metadata?.first_comment && (
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex gap-3 items-start">
                    <MessageSquare className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                    <p className="text-[13px] text-gray-600 italic leading-snug">"{p.metadata.first_comment}"</p>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
                <a 
                  href={p.url} target="_blank" rel="noopener noreferrer"
                  className="px-6 py-3 border border-gray-200 rounded-xl text-xs font-black text-gray-700 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                >
                  Review URL <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button 
                  onClick={() => handleReject(p.id)}
                  disabled={actioningId === p.id}
                  className="px-6 py-3 bg-red-50 text-red-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4" /> Reject
                </button>
                <button 
                  onClick={() => handleApprove(p.id)}
                  disabled={actioningId === p.id}
                  className="px-8 py-3 bg-emerald-800 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-900 transition-all shadow-xl shadow-emerald-900/20 flex items-center justify-center gap-2"
                >
                  {actioningId === p.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  Approve
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
