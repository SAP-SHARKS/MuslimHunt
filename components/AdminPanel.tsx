import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { Product, User } from '../types';
import { 
  ShieldCheck, Check, X, Eye, Loader2, Search, ArrowLeft, 
  Trash2, ExternalLink, RefreshCw, Filter, CheckCircle2, 
  AlertCircle, Hash, LogOut, Lock, Mail, KeyRound,
  ShieldAlert, UserCheck, ArrowRight, Shield, MessageSquare
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
  
  // Rejection Modal State
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectingProduct, setRejectingProduct] = useState<any>(null);
  const [rejectionNote, setRejectionNote] = useState('');

  // Auth States (Hardcoded as requested)
  const AUTHORIZED_ADMIN_EMAIL = 'zeirislam@gmail.com';
  const [verifying, setVerifying] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  // ... (verifyAdminClearance and useEffect for initAuth remain same as your provided code)

  const handleApprove = async (product: any) => {
    setProcessingId(product.id);
    try {
      const { error: updateError } = await supabase
        .from('products')
        .update({ is_approved: true })
        .eq('id', product.id);
      
      if (updateError) throw updateError;

      // Notify the maker
      await supabase.from('notifications').insert([{
        user_id: product.user_id || product.founder_id,
        type: 'approval',
        message: `Mabrook! Your product "${product.name}" has been approved and is now live.`,
        is_read: false
      }]);
      
      setPendingProducts(prev => prev.filter(p => p.id !== product.id));
      onRefresh(); 
    } catch (err) {
      alert('Approval failed.');
    } finally {
      setProcessingId(null);
    }
  };

  const openRejectModal = (product: any) => {
    setRejectingProduct(product);
    setShowRejectModal(true);
  };

  const handleRejectConfirm = async () => {
    if (!rejectingProduct || !rejectionNote.trim()) {
      alert("Please provide a reason for removal.");
      return;
    }
    
    setProcessingId(rejectingProduct.id);
    try {
      // 1. Send Rejection Notification
      await supabase.from('notifications').insert([{
        user_id: rejectingProduct.user_id || rejectingProduct.founder_id,
        type: 'rejection',
        message: `Your submission "${rejectingProduct.name}" was removed. Reason: ${rejectionNote}`,
        is_read: false
      }]);

      // 2. Delete the Product
      const { error } = await supabase.from('products').delete().eq('id', rejectingProduct.id);
      if (error) throw error;

      setPendingProducts(prev => prev.filter(p => p.id !== rejectingProduct.id));
      setShowRejectModal(false);
      setRejectionNote('');
    } catch (err) {
      alert('Failed to remove submission.');
    } finally {
      setProcessingId(null);
    }
  };

  // ... (Rest of UI logic for Login and Table)

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-8">
      {/* Table and Dashboard Header remains same */}
      {/* ... */}

      {/* Rejection Modal Pop-up */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex items-center gap-4 mb-6 text-red-600">
              <div className="bg-red-50 p-3 rounded-2xl">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-gray-900">Remove Submission</h2>
            </div>
            
            <p className="text-gray-500 mb-6 font-medium">
              Explain why <span className="font-bold text-gray-900">"{rejectingProduct?.name}"</span> is being rejected. This note will be sent to the submitter.
            </p>

            <textarea 
              value={rejectionNote}
              onChange={(e) => setRejectionNote(e.target.value)}
              placeholder="e.g., This product does not follow our community guidelines..."
              className="w-full h-40 p-6 bg-gray-50 border border-transparent focus:bg-white focus:border-red-500 rounded-3xl outline-none transition-all font-medium text-gray-900 shadow-inner resize-none mb-8"
            />

            <div className="flex gap-4">
              <button 
                onClick={() => setShowRejectModal(false)}
                className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleRejectConfirm}
                disabled={processingId === rejectingProduct?.id}
                className="flex-[2] py-4 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-600/20 flex items-center justify-center gap-2"
              >
                {processingId === rejectingProduct?.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Confirm Removal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Table Body - Change Reject Button to open modal */}
      {/* In your table mapping: */}
      <button 
        onClick={() => openRejectModal(p)}
        className="p-4 text-red-300 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"
      >
        <Trash2 className="w-6 h-6" />
      </button>
    </div>
  );
};

export default AdminPanel;
