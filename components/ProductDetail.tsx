
import React, { useState, useEffect, useRef } from 'react';
import { ExternalLink, ChevronUp, ArrowLeft, Calendar, User, MessageSquare, ShieldCheck, Heart, Send, Share2, Flag, ArrowBigUp, Clock } from 'lucide-react';
import { Product, Comment } from '../types';
import { formatTimeAgo } from '../utils/dateUtils';

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
}

const ProductDetail: React.FC<ProductDetailProps> = ({ 
  product, 
  user, 
  onBack, 
  onUpvote, 
  onCommentUpvote,
  hasUpvoted, 
  commentVotes,
  onAddComment,
  onViewProfile,
  scrollToComments = false
}) => {
  const [commentText, setCommentText] = useState('');
  const discussionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollToComments && discussionRef.current) {
      const timer = setTimeout(() => {
        discussionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [scrollToComments]);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(commentText);
    setCommentText('');
  };

  const handleReportComment = (commentId: string, username: string) => {
    console.log(`[Moderation] Comment ${commentId} by ${username} reported.`);
    alert(`Thank you for keeping Muslim Hunt safe. The comment by ${username} has been reported for review.`);
  };

  const handleShareComment = (commentId: string) => {
    const shareUrl = `${window.location.origin}/comment/${commentId}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Link to comment copied to clipboard!');
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-emerald-800 transition-colors mb-10 group font-bold uppercase tracking-widest text-xs"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to feed
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-sm p-8 sm:p-12">
            <div className="flex items-start gap-8 mb-10">
              <div className="w-24 h-24 rounded-3xl bg-gray-50 overflow-hidden border-4 border-emerald-50 shrink-0">
                <img src={product.logo_url} alt={product.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs px-2 py-1 bg-emerald-50 text-emerald-800 rounded-lg font-bold uppercase tracking-wider">
                    {product.category}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                    <Calendar className="w-3 h-3" />
                    {new Date(product.created_at).toLocaleDateString()}
                  </div>
                </div>
                <h1 className="text-5xl font-serif font-bold text-emerald-900 mb-2">{product.name}</h1>
                <p className="text-xl text-gray-500 font-medium leading-snug">{product.tagline}</p>
              </div>
            </div>

            <div className="prose prose-emerald max-w-none">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About this product</h2>
              <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-wrap">{product.description}</p>
            </div>
          </div>

          <div ref={discussionRef} className="bg-white border border-gray-100 rounded-[2.5rem] shadow-sm p-8 sm:p-12 scroll-mt-20">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-emerald-900 flex items-center gap-3">
                <MessageSquare className="w-6 h-6" />
                Discussion
              </h3>
              <span className="text-gray-400 font-medium">{product.comments?.length || 0} comments</span>
            </div>

            {user ? (
              <form onSubmit={handleSubmitComment} className="mb-10 flex gap-4">
                <button 
                  type="button"
                  onClick={() => onViewProfile(user.id)}
                  className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-gray-200 active:scale-95 transition-transform cursor-pointer"
                >
                  <img src={user.avatar_url} alt={user.username} className="w-full h-full object-cover" />
                </button>
                <div className="flex-1 relative">
                  <input 
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    placeholder="Ask the maker a question..."
                    className="w-full px-5 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-800 rounded-xl outline-none transition-all pr-12"
                  />
                  <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-6 bg-gray-50 rounded-2xl text-center mb-10 border border-dashed border-gray-200">
                <p className="text-gray-500 font-medium">Please sign in to join the discussion.</p>
              </div>
            )}

            <div className="space-y-8">
              {product.comments?.length === 0 ? (
                <div className="text-center py-8 text-gray-400 italic">No comments yet. Start the conversation!</div>
              ) : (
                product.comments?.map((comment: Comment) => {
                  const hasUpvotedComment = commentVotes.has(`${user?.id}_${comment.id}`);
                  return (
                    <div key={comment.id} className="flex gap-4 group">
                      <button 
                        className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-emerald-50 cursor-pointer hover:ring-2 hover:ring-emerald-800 transition-all active:scale-95"
                        onClick={() => onViewProfile(comment.user_id)}
                      >
                        <img src={comment.avatar_url} alt={comment.username} className="w-full h-full object-cover" />
                      </button>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <button 
                            className={`font-bold text-sm cursor-pointer hover:underline hover:text-emerald-800 transition-colors ${comment.is_maker ? 'text-emerald-800' : 'text-gray-900'}`}
                            onClick={() => onViewProfile(comment.user_id)}
                          >
                            {comment.username}
                          </button>
                          {comment.is_maker && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-emerald-800 text-white rounded font-black uppercase">Maker</span>
                          )}
                        </div>
                        <p className="text-gray-600 text-base leading-relaxed">{comment.text}</p>
                        
                        <div className="flex items-center gap-4 mt-3 text-xs font-bold text-gray-400">
                          <button 
                            onClick={() => onCommentUpvote(product.id, comment.id)}
                            className={`flex items-center gap-1 transition-colors uppercase tracking-tighter ${hasUpvotedComment ? 'text-emerald-800' : 'hover:text-emerald-800'}`}
                          >
                            <ArrowBigUp className={`w-3.5 h-3.5 ${hasUpvotedComment ? 'fill-emerald-800' : ''}`} />
                            <span>Upvote ({comment.upvotes_count || 0})</span>
                          </button>
                          <button 
                            onClick={() => handleShareComment(comment.id)}
                            className="flex items-center gap-1 hover:text-blue-500 transition-colors uppercase tracking-tighter"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                            <span>Share</span>
                          </button>
                          <button 
                            onClick={() => handleReportComment(comment.id, comment.username)}
                            className="flex items-center gap-1 hover:text-red-500 transition-colors uppercase tracking-tighter"
                          >
                            <Flag className="w-3.5 h-3.5" />
                            <span>Report</span>
                          </button>
                          <div className="flex items-center gap-1 uppercase tracking-tighter">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{formatTimeAgo(comment.created_at)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-emerald-800 rounded-[2.5rem] p-8 text-white shadow-xl shadow-emerald-900/10">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Halal Verified
            </h3>
            <div className="mb-8">
              <span className="block text-emerald-200 text-xs font-bold uppercase tracking-widest mb-1">Status</span>
              <p className="text-2xl font-bold">{product.halal_status}</p>
            </div>
            <div className="space-y-4">
              <a href={product.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-white text-emerald-900 w-full py-4 rounded-2xl font-black text-lg transition-all hover:shadow-lg active:scale-[0.98]">
                Visit Site <ExternalLink className="w-5 h-5" />
              </a>
              <button onClick={() => onUpvote(product.id)} className={`flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-black text-lg transition-all border-2 ${hasUpvoted ? 'bg-emerald-700/50 border-white text-white' : 'bg-transparent border-emerald-600/50 text-emerald-100 hover:border-white'}`}>
                <ChevronUp className="w-6 h-6" />
                {product.upvotes_count} Upvotes
              </button>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8">
            <h4 className="font-bold text-gray-900 mb-4 uppercase tracking-widest text-xs">The Maker</h4>
            <button 
              className="flex items-center gap-4 cursor-pointer group w-full text-left active:scale-[0.98] transition-transform"
              onClick={() => onViewProfile(product.founder_id)}
            >
              <div className="w-12 h-12 rounded-full overflow-hidden border border-emerald-50 group-hover:ring-2 group-hover:ring-emerald-800 transition-all shrink-0">
                <img src={`https://i.pravatar.cc/150?u=${product.founder_id}`} alt="Founder" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-bold text-gray-900 group-hover:text-emerald-800 transition-colors">View Profile</p>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-tighter hover:underline">Maker Portfolio</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
