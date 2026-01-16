
import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  ExternalLink, ArrowLeft, MessageSquare, ShieldCheck, Send, Share2,
  Triangle, Image as ImageIcon, ChevronRight, AtSign, Loader2
} from 'lucide-react';
import { Product, Comment } from '../types';
import { formatTimeAgo } from '../utils/dateUtils';
import SafeImage from './SafeImage.tsx';
import { supabase } from '../lib/supabase.ts';

interface ProductDetailProps {
  product: Product;
  user: any;
  onBack: () => void;
  onUpvote: (id: string) => void;
  onCommentUpvote: (productId: string, commentId: string) => void;
  hasUpvoted: boolean;
  commentVotes: Set<string>;
  onAddComment: (text: string) => void;
  onViewProfile: (userId: string) => void;
  scrollToComments?: boolean;
  onCommentAdded?: (comment: Comment) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  user,
  onBack,
  onUpvote,
  onCommentUpvote,
  hasUpvoted,
  commentVotes,
  onViewProfile,
  scrollToComments = false,
  onCommentAdded
}) => {
  const [commentText, setCommentText] = useState('');
  const [localComments, setLocalComments] = useState<Comment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const discussionRef = useRef<HTMLDivElement>(null);

  // Independent Comment Fetching (Localized strictly to this component)
  const fetchComments = async () => {
    setIsLoadingComments(true);
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('product_id', product.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLocalComments(data || []);
    } catch (err) {
      console.error('[Muslim Hunt] Failed to fetch comments independently:', err);
    } finally {
      setIsLoadingComments(false);
    }
  };

  useEffect(() => {
    fetchComments();

    // Real-time Subscription for instant feedback
    const channel = supabase
      .channel(`product_comments_${product.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'comments', filter: `product_id=eq.${product.id}` },
        (payload) => {
          const newComment = payload.new as Comment;
          setLocalComments((prev) => {
            if (prev.some(c => c.id === newComment.id)) return prev;
            return [newComment, ...prev];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [product.id]);

  useEffect(() => {
    if (scrollToComments && discussionRef.current) {
      setTimeout(() => {
        discussionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  }, [scrollToComments]);

  const handleSubmitComment = async (parentId: string | null = null) => {
    if (!commentText.trim() || !user) return;

    setIsSubmitting(true);
    // Engagement Logic: Set is_maker if current user is the product owner
    const isMaker = user.id === product.user_id;

    try {
      const { error } = await supabase.from('comments').insert([{
        product_id: product.id,
        user_id: user.id,
        text: commentText,
        parent_id: parentId,
        username: user.username,
        avatar_url: user.avatar_url,
        is_maker: isMaker,
        upvotes_count: 0
      }]).select().single();

      if (error) throw error;

      if (data && onCommentAdded) {
        onCommentAdded(data as Comment);
      }

      setCommentText('');
      setReplyingTo(null);
    } catch (err) {
      console.error('[Muslim Hunt] Failed to post comment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const commentTree = useMemo(() => {
    const map = new Map<string, any>();
    const roots: any[] = [];

    localComments.forEach(c => map.set(c.id, { ...c, replies: [] }));
    localComments.forEach(c => {
      const node = map.get(c.id);
      if (c.parent_id && map.has(c.parent_id)) {
        map.get(c.parent_id).replies.push(node);
      } else {
        roots.push(node);
      }
    });

    return roots.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [localComments]);

  const CommentNode: React.FC<{ node: any; depth?: number }> = ({ node, depth = 0 }) => {
    const hasUpvotedComment = commentVotes.has(`${user?.id}_${node.id}`);
    const isReplying = replyingTo === node.id;

    return (
      <div className={`relative ${depth > 0 ? 'mt-8 ml-6 sm:ml-12' : 'mt-10 animate-in fade-in slide-in-from-bottom-2 duration-500'}`}>
        {/* High-Fidelity Threading: 1px gray vertical line */}
        {depth > 0 && (
          <div className="absolute -left-6 sm:-left-10 top-[-32px] bottom-0 w-px bg-gray-200" />
        )}

        <div className="flex gap-4 group">
          <button
            className="w-10 h-10 rounded-full overflow-hidden border border-emerald-50 shrink-0 hover:ring-2 hover:ring-emerald-800 transition-all shadow-sm bg-white"
            onClick={() => onViewProfile(node.user_id)}
          >
            <SafeImage src={node.avatar_url} alt={node.username} className="w-full h-full object-cover" />
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <button
                className={`font-bold text-[14px] hover:underline transition-colors ${node.is_maker ? 'text-primary' : 'text-gray-900'}`}
                onClick={() => onViewProfile(node.user_id)}
              >
                {node.username}
              </button>

              {/* Maker Badge */}
              {node.is_maker && (
                <span className="flex items-center gap-1 text-[9px] px-2 py-0.5 bg-emerald-600 text-white rounded font-black uppercase tracking-[0.1em] shadow-sm">
                  Maker
                </span>
              )}

              <span className="text-[11px] font-medium text-gray-400">
                {formatTimeAgo(node.created_at)}
              </span>
            </div>

            <p className="text-gray-700 text-[15px] leading-relaxed break-words font-medium mb-3">
              {node.text}
            </p>

            {/* Interaction Bar: Semi-bold links exactly like Product Hunt */}
            <div className="flex items-center gap-6 text-[11px] font-semibold text-gray-400 uppercase tracking-tight">
              <button
                onClick={() => onCommentUpvote(product.id, node.id)}
                className={`flex items-center gap-1 transition-all ${hasUpvotedComment ? 'text-primary font-bold' : 'hover:text-primary'}`}
              >
                Upvote {node.upvotes_count > 0 && `(${node.upvotes_count})`}
              </button>

              <button
                onClick={() => setReplyingTo(isReplying ? null : node.id)}
                className={`transition-colors ${isReplying ? 'text-primary font-bold' : 'hover:text-primary'}`}
              >
                Reply
              </button>

              <button className="hover:text-primary transition-colors">Share</button>
            </div>

            {/* Inline Reply Input */}
            {isReplying && user && (
              <div className="mt-4 bg-white border border-primary-light rounded-2xl p-4 shadow-lg animate-in slide-in-from-top-2 duration-200">
                <textarea
                  autoFocus
                  placeholder={`Reply to @${node.username}...`}
                  className="w-full min-h-[80px] outline-none text-sm font-medium resize-none text-gray-700 bg-transparent"
                  onChange={e => setCommentText(e.target.value)}
                />
                <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-50">
                  <div className="flex gap-2">
                    <button className="p-1.5 text-gray-400 hover:text-primary transition-colors">
                      <AtSign className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setReplyingTo(null)} className="px-3 py-1.5 text-xs font-bold text-gray-400">Cancel</button>
                    <button
                      onClick={() => handleSubmitComment(node.id)}
                      disabled={isSubmitting || !commentText.trim()}
                      className="px-6 py-2 bg-primary text-white rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-primary-dark transition-all disabled:opacity-50"
                    >
                      {isSubmitting ? 'Posting...' : 'Reply'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {node.replies && node.replies.length > 0 && (
          <div className="space-y-2">
            {node.replies.map((reply: any) => (
              <CommentNode key={reply.id} node={reply} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-8 animate-in fade-in duration-500">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors mb-6 sm:mb-10 group font-bold uppercase tracking-widest text-[10px] sm:text-xs"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="hidden sm:inline">Back to discovery feed</span>
        <span className="sm:hidden">Back</span>
      </button>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        <div className="flex-1 lg:max-w-[65%] space-y-8 sm:space-y-12">
          {/* Product Header - Stacked on mobile */}
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-8">
            <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-xl sm:rounded-[1.5rem] bg-white overflow-hidden border border-gray-100 shadow-sm shrink-0">
              <SafeImage src={product.logo_url} alt={product.name} seed={product.id} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0 w-full">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[9px] sm:text-[10px] px-2 py-0.5 bg-primary-light text-primary rounded-md font-black uppercase tracking-widest border border-primary-light/50">
                  {product.category}
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-serif font-bold text-primary mb-2 tracking-tight">{product.name}</h1>
              <p className="text-base sm:text-xl text-gray-500 font-medium leading-tight mb-4 sm:mb-6">{product.tagline}</p>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <a
                  href={product.website_url || product.url}
                  target="_blank" rel="noopener noreferrer"
                  className="px-5 sm:px-8 py-3 sm:py-3.5 bg-primary text-white rounded-xl font-black text-xs sm:text-sm uppercase tracking-widest hover:bg-primary-dark transition-all shadow-xl shadow-emerald-900/10 active:scale-[0.98] flex items-center gap-2"
                >
                  <span className="hidden sm:inline">Visit website</span>
                  <span className="sm:hidden">Visit</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                {/* Comment Count Button (Product Hunt Style) */}
                <button
                  onClick={() => discussionRef.current?.scrollIntoView({ behavior: 'smooth' })}
                  className="flex flex-col items-center justify-center min-w-[3rem] sm:min-w-[3.5rem] h-10 sm:h-12 bg-white border border-gray-200 rounded-lg sm:rounded-xl text-gray-400 hover:text-primary hover:border-primary-light transition-all shadow-sm active:scale-95 group"
                >
                  {isLoadingComments ? (
                    <Loader2 className="w-4 sm:w-5 h-4 sm:h-5 animate-spin text-primary" />
                  ) : (
                    <>
                      <MessageSquare className="w-4 sm:w-5 h-4 sm:h-5 mb-0.5 group-hover:text-primary transition-colors" />
                      <span className="text-[10px] sm:text-[11px] font-black tracking-tighter group-hover:text-primary transition-colors">
                        {localComments.length}
                      </span>
                    </>
                  )}
                </button>

                <button className="p-2.5 sm:p-3.5 bg-white border border-gray-200 rounded-lg sm:rounded-xl text-gray-400 hover:text-primary transition-all shadow-sm">
                  <Share2 className="w-4 sm:w-5 h-4 sm:h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Media Gallery (Mock) - Responsive */}
          <div className="space-y-4">
            <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
              {[1, 2].map((i) => (
                <div key={i} className="min-w-[280px] sm:min-w-[450px] aspect-video bg-gray-50 border border-gray-100 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm shrink-0">
                  <SafeImage
                    src={`https://images.unsplash.com/photo-${i === 1 ? ' photo-1584697964400-2af6a2f6204c' : 'photo-1517694712202-14dd9538aa97'}?w=900&q=80`}
                    alt="Gallery" className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="prose prose-emerald max-w-none">
            <h2 className="text-lg sm:text-xl font-serif font-bold text-gray-900 mb-3 sm:mb-4">What's new?</h2>
            <p className="text-gray-600 leading-relaxed text-base sm:text-lg whitespace-pre-wrap font-medium">
              {product.description || "Building the next generation of Halal tools for the community."}
            </p>
          </div>

          {/* Discussion Section */}
          <div ref={discussionRef} className="bg-white border border-gray-100 rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-8 lg:p-12 shadow-sm scroll-mt-20">
            <div className="flex items-center justify-between mb-8 border-b border-gray-50 pb-6">
              <h3 className="text-lg font-bold text-primary flex items-center gap-3 uppercase tracking-tight">
                <MessageSquare className="w-5 h-5 text-emerald-700" />
                Discussion
              </h3>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] bg-gray-50 px-3 py-1 rounded-full">
                {localComments.length} Comments
              </span>
            </div>

            {/*參與狀態 participação: Auth States */}
            {user ? (
              <div className="mb-12 bg-white border border-gray-100 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] focus-within:border-primary transition-all">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-gray-100">
                    <SafeImage src={user.avatar_url} alt={user.username} className="w-full h-full object-cover" />
                  </div>
                  <textarea
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    placeholder="Ask the maker a question or leave feedback..."
                    className="flex-1 py-2 outline-none text-base font-medium resize-none min-h-[100px] text-gray-700 bg-transparent"
                  />
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-4">
                  <div className="flex gap-1">
                    <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary-light rounded-lg transition-all">
                      <AtSign className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary-light rounded-lg transition-all">
                      <ImageIcon className="w-5 h-5" />
                    </button>
                  </div>
                  <button
                    onClick={() => handleSubmitComment()}
                    disabled={isSubmitting || !commentText.trim()}
                    className="px-10 py-3 bg-primary text-white rounded-xl font-black text-sm uppercase tracking-widest hover:bg-primary-dark transition-all shadow-lg shadow-emerald-900/20 active:scale-95 disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Comment
                  </button>
                </div>
              </div>
            ) : (
              /* Auth State: Placeholder exactly as requested */
              <div className="mb-12 p-10 bg-gray-50/50 rounded-3xl text-center border-2 border-dashed border-gray-100 flex flex-col items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-300 shadow-sm">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <p className="text-[12px] font-black text-gray-400 uppercase tracking-[0.3em]">SIGN IN TO JOIN THE CONVERSATION</p>
                <p className="text-gray-400 text-sm font-medium italic max-w-xs">Participate in our vibrant community and support makers building for the Ummah.</p>
              </div>
            )}

            <div className="space-y-2">
              {isLoadingComments ? (
                <div className="flex flex-col items-center py-10 gap-4">
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Loading discussion...</p>
                </div>
              ) : commentTree.length === 0 ? (
                <div className="text-center py-10 italic text-gray-400 font-medium">No comments yet. Be the first to start the discussion!</div>
              ) : (
                commentTree.map((node: any) => <CommentNode key={node.id} node={node} />)
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - Shows below content on mobile, sticky sidebar on desktop */}
        <div className="w-full lg:w-[35%] shrink-0 order-last lg:order-none">
          <div className="lg:sticky lg:top-24 space-y-4 sm:space-y-6">
            {/* Mobile: Horizontal scroll cards, Desktop: Stacked */}
            <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0">
              <div className="bg-white border border-gray-100 rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-8 shadow-sm flex flex-col items-center text-center min-w-[260px] lg:min-w-0 shrink-0 lg:shrink">
                <h4 className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-4 sm:mb-6">Support this Launch</h4>
                <button
                  onClick={() => onUpvote(product.id)}
                  className={`w-full py-4 sm:py-6 rounded-xl sm:rounded-[1.5rem] font-black text-base sm:text-lg uppercase tracking-widest transition-all active:scale-[0.98] flex flex-col items-center justify-center gap-2 border-2 ${hasUpvoted
                    ? 'bg-primary border-primary text-white shadow-xl shadow-emerald-900/20'
                    : 'bg-white border-primary text-primary hover:bg-primary-light'
                    }`}
                >
                  <Triangle className={`w-5 sm:w-6 h-5 sm:h-6 ${hasUpvoted ? 'fill-white' : ''}`} />
                  UPVOTE • {product.upvotes_count || 0}
                </button>
              </div>

              <div className="bg-primary-dark rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-8 text-white relative overflow-hidden shadow-2xl min-w-[260px] lg:min-w-0 shrink-0 lg:shrink">
                <div className="relative z-10">
                  <div className="inline-block px-2 sm:px-3 py-1 bg-emerald-400 text-[#064e3b] rounded-md text-[9px] sm:text-[10px] font-black uppercase tracking-widest mb-3 sm:mb-4">
                    PERFORMANCE
                  </div>
                  <p className="text-2xl sm:text-4xl font-serif font-bold mb-1">Top Tier</p>
                  <p className="text-emerald-300 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] mb-4 sm:mb-8">Of the Week</p>
                  <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-primary/40 rounded-xl sm:rounded-2xl border border-emerald-700/30">
                    <ShieldCheck className="w-5 sm:w-6 h-5 sm:h-6 text-primary-light" />
                    <div>
                      <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest">Status</p>
                      <p className="text-xs sm:text-sm font-bold text-emerald-50">{product.halal_status}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-8 shadow-sm min-w-[260px] lg:min-w-0 shrink-0 lg:shrink">
                <h4 className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 sm:mb-6">The Builder</h4>
                <div className="flex items-center gap-3 sm:gap-4 group cursor-pointer" onClick={() => onViewProfile(product.user_id)}>
                  <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-xl sm:rounded-2xl overflow-hidden border-2 border-emerald-50 group-hover:ring-2 group-hover:ring-emerald-800 transition-all shrink-0">
                    <SafeImage src={`https://i.pravatar.cc/150?u=${product.user_id}`} alt="Founder" className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-sm sm:text-base text-gray-900 group-hover:text-primary transition-colors truncate">View Profile</p>
                    <p className="text-[9px] sm:text-[10px] text-gray-400 font-black uppercase tracking-tighter truncate">Maker of {product.name}</p>
                  </div>
                  <ChevronRight className="ml-auto w-4 sm:w-5 h-4 sm:h-5 text-gray-300 group-hover:text-primary transition-colors hidden sm:block" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
