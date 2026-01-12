import React, { useEffect, useState } from 'react';
import { ArrowLeft, MessageSquare, Share2, ThumbsUp, Clock, Triangle } from 'lucide-react';
import { View, User, Comment, Thread } from '../types';
import { supabase } from '../lib/supabase';
import ThreadDetailSkeleton from './ThreadDetailSkeleton';

interface ThreadDetailProps {
    threadSlug: string;
    categorySlug: string;
    setView: (view: View, path?: string) => void;
    user: User | null;
    onSignIn: () => void;
    initialData?: Thread | null;
}

const ThreadDetail: React.FC<ThreadDetailProps> = ({ threadSlug, categorySlug, setView, user, onSignIn, initialData }) => {
    const [loading, setLoading] = useState(!initialData);
    const [thread, setThread] = useState<Thread | null>(initialData || null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentText, setCommentText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchThread = async () => {
            // If we have initialData and it matches the slug, we can skip loading state initially
            // But we should still verify/update from server in background
            if (!initialData) setLoading(true);

            try {
                const { data, error } = await supabase
                    .from('threads')
                    .select(`
            *,
            profiles:author_id (
              username,
              avatar_url,
              headline
            )
          `)
                    .eq('slug', threadSlug)
                    .single();

                if (error) {
                    // If error (like RLS) but we have initialData, stick with initialData
                    if (initialData) return;
                    throw error;
                }

                if (data) {
                    setThread(data as any);
                }
            } catch (err) {
                console.error('Error fetching thread:', err);
                // Keep showing initialData if available on error
            } finally {
                setLoading(false);
            }
        };

        if (threadSlug) fetchThread();
    }, [threadSlug]); // Removing initialData from dependency to avoid loop if it changes

    if (loading) return <ThreadDetailSkeleton />;
    if (!thread) return <div className="p-8 text-center text-gray-500">Thread not found</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 animate-in fade-in duration-500">
            {/* Back to Category */}
            <button
                onClick={() => setView(View.FORUM_CATEGORY, `/p/${categorySlug}`)}
                className="flex items-center gap-2 mb-8 text-gray-400 hover:text-emerald-800 transition-colors font-bold text-sm"
            >
                <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                    <ArrowLeft size={16} />
                </div>
                Back to p/{categorySlug}
            </button>

            {/* Thread Content */}
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden p-6 sm:p-10 mb-8">
                <header className="flex items-start justify-between gap-4 mb-8">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 shrink-0">
                            {thread.profiles?.avatar_url ? (
                                <img src={thread.profiles.avatar_url} alt={thread.profiles.username} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-emerald-100 flex items-center justify-center text-sm font-bold text-emerald-800">
                                    {thread.profiles?.username?.[0] || 'A'}
                                </div>
                            )}
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight mb-2">
                                {thread.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 font-medium">
                                <span className="text-emerald-800 font-bold">@{thread.profiles?.username}</span>
                                <span>•</span>
                                <span>{new Date(thread.created_at).toLocaleDateString()}</span>
                                {(thread.is_approved === false) && (
                                    <span className="flex items-center gap-1 text-orange-600 font-bold bg-orange-50 px-2 py-0.5 rounded-full text-xs border border-orange-100">
                                        <Clock size={12} /> Pending Review
                                    </span>
                                )}
                                {thread.profiles?.headline && (
                                    <>
                                        <span>•</span>
                                        <span className="truncate max-w-[200px]">{thread.profiles.headline}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                        <button className="flex flex-col items-center justify-center min-w-[3.5rem] h-14 rounded-xl border-2 border-gray-100 bg-white text-gray-400 hover:border-emerald-800 hover:text-emerald-800 transition-all active:scale-95 shadow-sm">
                            <Triangle className="w-5 h-5 mb-0.5 transform group-hover:-translate-y-0.5 transition-transform" />
                            <span className="text-[12px] font-black">{thread.upvotes || 0}</span>
                        </button>
                    </div>
                </header>

                <div className="prose prose-emerald max-w-none text-gray-800 leading-relaxed font-medium">
                    <div dangerouslySetInnerHTML={{ __html: thread.body }} />
                </div>

                <div className="flex items-center gap-4 mt-8 pt-8 border-t border-gray-50">
                    <button className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors">
                        <MessageSquare size={16} /> {comments.length} Comments
                    </button>
                    <button className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors">
                        <Share2 size={16} /> Share
                    </button>
                    <button className="ml-auto flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-red-500 transition-colors">
                        <Flag size={16} /> Report
                    </button>
                </div>
            </div>

            {/* Comment Section (Placeholder for now until comments schema confirmed for threads) */}
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 sm:p-10">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Discussion</h3>

                {user ? (
                    <div className="flex gap-4 mb-8">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 shrink-0">
                            <img src={user.avatar_url} alt={user.username} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                            <textarea
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="What are your thoughts?"
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:bg-white focus:border-[#004D40] transition-all min-h-[100px] resize-y font-medium text-gray-900"
                            />
                            <div className="flex justify-end mt-2">
                                <button
                                    disabled={!commentText.trim() || isSubmitting}
                                    className="px-6 py-2 bg-[#004D40] text-white rounded-xl font-bold text-sm hover:bg-[#003d33] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Comment
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-gray-50 rounded-2xl p-8 text-center mb-8">
                        <p className="text-gray-500 font-bold mb-4">Log in to join the discussion</p>
                        <button onClick={onSignIn} className="px-6 py-2 bg-[#004D40] text-white rounded-xl font-bold text-sm hover:bg-[#003d33] transition-all">
                            Sign In
                        </button>
                    </div>
                )}

                {/* Empty State for comments */}
                {comments.length === 0 && (
                    <div className="text-center py-10">
                        <p className="text-gray-400 font-medium">Be the first to comment.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ThreadDetail;
