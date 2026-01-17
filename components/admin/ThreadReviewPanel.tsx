import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../lib/supabase';
import {
  Search,
  Filter,
  RefreshCw,
  CheckCircle2,
  Trash2,
  Eye,
  Loader2,
  MessageSquareMore,
  Hash,
  AlertTriangle,
  MessageSquare,
  UserCheck,
  ExternalLink,
} from 'lucide-react';

interface Thread {
  id: string;
  title: string;
  body: string;
  slug: string;
  category_id: number;
  author_id: string;
  created_at: string;
  is_approved: boolean;
  profiles?: {
    username: string;
    avatar_url: string;
    headline?: string;
  };
  forum_categories?: {
    name: string;
    slug: string;
  };
}

export const ThreadReviewPanel: React.FC = () => {
  const [pendingThreads, setPendingThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Rejection Modal State
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionNote, setRejectionNote] = useState('');
  const [threadToReject, setThreadToReject] = useState<Thread | null>(null);

  // Preview Modal State
  const [previewThread, setPreviewThread] = useState<Thread | null>(null);

  const fetchPendingThreads = async () => {
    setLoading(true);
    try {
      // Debug: Log current session info
      const { data: { session } } = await supabase.auth.getSession();
      console.log('[ThreadReview] Current user email:', session?.user?.email);
      console.log('[ThreadReview] JWT email claim:', session?.user?.email);

      const { data, error } = await supabase
        .from('threads')
        .select(`
          *,
          profiles:author_id (username, avatar_url, headline),
          forum_categories:category_id (name, slug)
        `)
        .eq('is_approved', false)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('[ThreadReview] Failed to fetch pending threads:', error);
        console.error('[ThreadReview] Error details:', error.message, error.details, error.hint);
        throw error;
      }

      console.log('[ThreadReview] Fetched threads:', data?.length || 0);
      setPendingThreads(data || []);
    } catch (err) {
      console.error('[ThreadReview] Failed to fetch pending threads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingThreads();
  }, []);

  const handleApprove = async (thread: Thread) => {
    setProcessingId(thread.id);
    try {
      const { error } = await supabase
        .from('threads')
        .update({ is_approved: true })
        .eq('id', thread.id);

      if (error) throw error;

      // Notify the author
      try {
        await supabase.from('notifications').insert([{
          user_id: thread.author_id,
          type: 'thread_approved',
          message: `Your thread "${thread.title}" has been approved and is now live!`,
          is_read: false,
        }]);
      } catch (notifyErr) {
        console.warn('Thread notification failed:', notifyErr);
      }

      setPendingThreads(prev => prev.filter(t => t.id !== thread.id));
    } catch (err: any) {
      console.error('[ThreadReview] Approval failed:', err);
      alert(`Failed to approve thread: ${err.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  const initiateReject = (thread: Thread) => {
    setThreadToReject(thread);
    setRejectionNote('');
    setIsRejectModalOpen(true);
  };

  const confirmRejection = async () => {
    if (!threadToReject) return;

    setProcessingId(threadToReject.id);
    setIsRejectModalOpen(false);

    try {
      const { error } = await supabase
        .from('threads')
        .delete()
        .eq('id', threadToReject.id);

      if (error) throw error;

      // Notify the author about rejection
      const reason = rejectionNote.trim() || 'Thread did not meet community guidelines.';
      try {
        await supabase.from('notifications').insert([{
          user_id: threadToReject.author_id,
          type: 'thread_rejected',
          message: `Your thread "${threadToReject.title}" was removed. Reason: ${reason}`,
          is_read: false,
        }]);
      } catch (notifyErr) {
        console.warn('Rejection notification failed:', notifyErr);
      }

      setPendingThreads(prev => prev.filter(t => t.id !== threadToReject.id));
    } catch (err: any) {
      console.error('[ThreadReview] Rejection failed:', err);
      alert(`Failed to reject thread: ${err.message}`);
    } finally {
      setProcessingId(null);
      setThreadToReject(null);
    }
  };

  const filteredThreads = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return pendingThreads.filter(t =>
      t.title.toLowerCase().includes(query) ||
      t.profiles?.username?.toLowerCase().includes(query) ||
      t.forum_categories?.name?.toLowerCase().includes(query)
    );
  }, [pendingThreads, searchQuery]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  return (
    <div className="p-6 lg:p-8 animate-in fade-in duration-500">
      {/* Rejection Modal */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsRejectModalOpen(false)}
          />
          <div className="relative bg-white rounded-[2rem] shadow-2xl border border-red-50 max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 shadow-inner">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Reject Thread</h3>
                  <p className="text-sm text-gray-500 truncate max-w-[280px]">{threadToReject?.title}</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-red-600" /> Rejection Reason
                </label>
                <textarea
                  value={rejectionNote}
                  onChange={(e) => setRejectionNote(e.target.value)}
                  placeholder="Explain why this thread is being removed..."
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-red-500 rounded-xl outline-none transition-all resize-none text-sm h-32"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsRejectModalOpen(false)}
                  className="flex-1 py-3 px-4 border border-gray-200 rounded-xl font-bold text-sm text-gray-500 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRejection}
                  disabled={processingId !== null}
                  className="flex-1 py-3 px-4 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-all disabled:opacity-50"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewThread && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setPreviewThread(null)}
          />
          <div className="relative bg-white rounded-[2rem] shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 overflow-y-auto max-h-[80vh]">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 text-sm text-primary mb-2">
                    <Hash className="w-4 h-4" />
                    {previewThread.forum_categories?.name || 'General'}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{previewThread.title}</h2>
                </div>
                <button
                  onClick={() => setPreviewThread(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <span className="text-gray-400 text-xl">&times;</span>
                </button>
              </div>

              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <img
                  src={previewThread.profiles?.avatar_url || `https://i.pravatar.cc/150?u=${previewThread.author_id}`}
                  className="w-10 h-10 rounded-full border border-gray-100"
                  alt="Author"
                />
                <div>
                  <p className="font-bold text-gray-900">@{previewThread.profiles?.username || 'anonymous'}</p>
                  <p className="text-xs text-gray-500">{formatDate(previewThread.created_at)}</p>
                </div>
              </div>

              <div
                className="prose prose-sm max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: previewThread.body }}
              />

              <div className="mt-8 pt-4 border-t border-gray-100 flex gap-3">
                <button
                  onClick={() => { setPreviewThread(null); handleApprove(previewThread); }}
                  className="flex-1 py-3 px-4 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary-dark transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" /> Approve
                </button>
                <button
                  onClick={() => { setPreviewThread(null); initiateReject(previewThread); }}
                  className="flex-1 py-3 px-4 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" /> Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-br from-orange-50/40 via-white to-white border border-orange-100 rounded-[2rem] p-6 lg:p-8 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-orange-600">
              <div className="bg-orange-100 p-2 rounded-xl">
                <MessageSquareMore className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Forum Moderation</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">Thread Review</h1>
            <p className="text-gray-500">Review and approve new forum discussions.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white border border-gray-200 rounded-2xl px-6 py-4 text-center min-w-[140px] border-b-4 border-b-orange-500">
              <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Pending</span>
              <span className="text-3xl font-bold text-orange-600">{pendingThreads.length}</span>
            </div>
            <button
              onClick={fetchPendingThreads}
              className="p-3 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-orange-600 transition-all active:scale-95"
              title="Refresh"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search threads by title, author, or forum..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-orange-200 rounded-xl outline-none transition-all text-sm"
          />
        </div>
        <button className="px-5 py-3 bg-gray-50 text-gray-500 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-gray-100 transition-all">
          <Filter className="w-4 h-4" /> Filter
        </button>
      </div>

      {/* Thread List */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-16 text-center">
            <Loader2 className="w-10 h-10 text-orange-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-400 font-bold text-sm">Loading pending threads...</p>
          </div>
        ) : filteredThreads.length === 0 ? (
          <div className="p-16 text-center">
            <UserCheck className="w-16 h-16 text-orange-100 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">All Caught Up!</h2>
            <p className="text-gray-500">No pending threads to review.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredThreads.map((thread) => (
              <div
                key={thread.id}
                className="p-5 hover:bg-orange-50/30 transition-colors"
              >
                <div className="flex items-start gap-4">
                  {/* Author Avatar */}
                  <img
                    src={thread.profiles?.avatar_url || `https://i.pravatar.cc/150?u=${thread.author_id}`}
                    className="w-12 h-12 rounded-xl border border-gray-100 shadow-sm shrink-0"
                    alt="Author"
                  />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-lg">
                        #{thread.forum_categories?.name || 'General'}
                      </span>
                      <span className="text-xs text-gray-400">{formatDate(thread.created_at)}</span>
                    </div>

                    <h3 className="text-base font-bold text-gray-900 mb-1 truncate">{thread.title}</h3>

                    <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                      {stripHtml(thread.body).substring(0, 150)}...
                    </p>

                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span className="font-medium">by @{thread.profiles?.username || 'anonymous'}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setPreviewThread(thread)}
                      className="p-2.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all"
                      title="Preview"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => initiateReject(thread)}
                      disabled={processingId === thread.id}
                      className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all disabled:opacity-50"
                      title="Reject"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleApprove(thread)}
                      disabled={processingId === thread.id}
                      className="px-4 py-2.5 bg-primary text-white rounded-xl font-bold text-xs hover:bg-primary-dark transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                      {processingId === thread.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4" />
                      )}
                      Approve
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ThreadReviewPanel;
