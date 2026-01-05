
import React, { useState, useEffect, useRef } from 'react';
// Added Users and ChevronRight to the lucide-react imports
import { 
  ExternalLink, ChevronUp, ArrowLeft, Calendar, User, MessageSquare, 
  ShieldCheck, Heart, Send, Share2, Flag, ArrowBigUp, Clock, Sparkles, 
  Triangle, Image as ImageIcon, Award, Users, ChevronRight 
} from 'lucide-react';
import { Product, Comment } from '../types';
import { formatTimeAgo } from '../utils/dateUtils';
import SafeImage from './SafeImage.tsx';

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
  const [hoveredCommentId, setHoveredCommentId] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<number | null>(null);
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

  const handleMouseEnter = (commentId: string) => {
    if (hoverTimeoutRef.current) window.clearTimeout(hoverTimeoutRef.current);
    setHoveredCommentId(commentId);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = window.setTimeout(() => {
      setHoveredCommentId(null);
    }, 300);
  };

  const UserHoverCard = ({ comment }: { comment: Comment }) => (
    <div 
      className="absolute bottom-full left-0 mb-4 w-72 bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[1.5rem] p-6 z-50 animate-in fade-in zoom-in-95 duration-200 cursor-default"
      onMouseEnter={() => handleMouseEnter(comment.id)}
      onMouseLeave={handleMouseLeave}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-emerald-50 shrink-0 shadow-sm">
          <SafeImage src={comment.avatar_url} alt={comment.username} className="w-full h-full object-cover" />
        </div>
        <div>
          <h4 className="font-bold text-gray-900 text-lg leading-tight">{comment.username}</h4>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[10px] px-1.5 py-0.5 bg-emerald-50 text-emerald-800 rounded font-black uppercase tracking-wider">
              {comment.is_maker ? 'Maker' : 'Contributor'}
            </span>
            {comment.is_maker && <Sparkles className="w-3 h-3 text-emerald-500" />}
          </div>
        </div>
      </div>
      
      <p className="text-gray-500 text-sm leading-relaxed mb-6 font-medium">
        Building the future of Halal tech. Currently working on <span className="text-emerald-800 font-bold">Global Ummah</span> solutions.
      </p>

      <div className="grid grid-cols-2 gap-4 mb-6 pt-6 border-t border-gray-50">
        <div className="text-center">
          <p className="font-black text-gray-900 text-lg leading-none">1.4k</p>
          <p className="text-[10px] uppercase font-bold text-gray-400 mt-1 tracking-tighter">Followers</p>
        </div>
        <div className="text-center border-l border-gray-50">
          <p className="font-black text-gray-900 text-lg leading-none">840</p>
          <p className="text-[10px] uppercase font-bold text-gray-400 mt-1 tracking-tighter">Points</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button className="flex-1 py-2.5 border border-gray-200 rounded-xl font-bold text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-[0.98]">
          Follow
        </button>
        <button 
          onClick={() => onViewProfile(comment.user_id)}
          className="px-4 py-2.5 bg-emerald-800 text-white rounded-xl font-bold text-sm hover:bg-emerald-900 transition-all active:scale-[0.98]"
        >
          Profile
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-8">
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-emerald-800 transition-colors mb-10 group font-bold uppercase tracking-widest text-xs"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to discovery feed
      </button>

      {/* Main Grid: 70/30 Split */}
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left Column (70%) */}
        <div className="flex-1 lg:max-w-[65%] space-y-12">
          {/* Header Info */}
          <div className="flex items-start gap-8">
            <div className="w-24 h-24 rounded-[1.5rem] bg-white overflow-hidden border border-gray-100 shadow-sm shrink-0">
              <SafeImage src={product.logo_url} alt={product.name} seed={product.id} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded-md font-black uppercase tracking-widest border border-emerald-100/50">
                  {product.category}
                </span>
              </div>
              <h1 className="text-4xl font-serif font-bold text-emerald-900 mb-2 tracking-tight">{product.name}</h1>
              <p className="text-xl text-gray-500 font-medium leading-tight mb-6">{product.tagline}</p>
              
              <div className="flex items-center gap-4">
                <a 
                  href={product.website_url || product.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="px-8 py-3.5 bg-emerald-800 text-white rounded-xl font-black text-sm uppercase tracking-widest hover:bg-emerald-900 transition-all shadow-xl shadow-emerald-900/10 active:scale-[0.98] flex items-center gap-2"
                >
                  Visit website <ExternalLink className="w-4 h-4" />
                </a>
                <button className="p-3.5 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-emerald-800 hover:border-emerald-800 transition-all active:scale-[0.98] shadow-sm">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Media Gallery (High Fidelity Mock) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <ImageIcon className="w-3 h-3" /> 
              Media Gallery
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {[1, 2, 3].map((i) => (
                <div key={i} className="min-w-[450px] aspect-video bg-gray-50 border border-gray-100 rounded-3xl overflow-hidden shadow-sm shrink-0 group">
                  <SafeImage 
                    src={`https://images.unsplash.com/photo-${i === 1 ? '1609599006353-e629aaabfeae' : i === 2 ? '1557838923-2985c318be48' : '1542816417-0983c9c9ad53'}?w=900&q=80`} 
                    alt="Gallery" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="prose prose-emerald max-w-none">
            <h2 className="text-xl font-serif font-bold text-gray-900 mb-4">What's new?</h2>
            <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-wrap font-medium">
              {product.description || "The maker hasn't provided a long description yet, but this tool is already making waves in the Ummah tech community. Check the website for more details!"}
            </p>
          </div>

          {/* Threaded Discussion Feed */}
          <div ref={discussionRef} className="bg-white border border-gray-100 rounded-[2.5rem] p-8 sm:p-12 shadow-sm scroll-mt-20">
            <div className="flex items-center justify-between mb-8 border-b border-gray-50 pb-6">
              <h3 className="text-lg font-bold text-emerald-900 flex items-center gap-3 uppercase tracking-tight">
                <MessageSquare className="w-5 h-5 text-emerald-700" />
                Community Discussion
              </h3>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] bg-gray-50 px-3 py-1 rounded-full">{product.comments?.length || 0} Comments</span>
            </div>

            {user ? (
              <form onSubmit={handleSubmitComment} className="mb-12 flex gap-4">
                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-gray-200">
                  <SafeImage src={user.avatar_url} alt={user.username} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 relative">
                  <textarea 
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    placeholder="Ask the maker a question or leave feedback..."
                    className="w-full px-6 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-800 rounded-2xl outline-none transition-all pr-14 text-sm font-medium resize-none min-h-[100px] shadow-inner"
                  />
                  <button type="submit" className="absolute right-3 bottom-3 p-3 bg-emerald-800 text-white rounded-xl hover:bg-emerald-900 transition-colors shadow-lg shadow-emerald-900/20 active:scale-95">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-8 bg-gray-50 rounded-3xl text-center mb-12 border border-dashed border-gray-200">
                <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Sign in to join the conversation</p>
              </div>
            )}

            <div className="space-y-8">
              {product.comments?.length === 0 ? (
                <div className="text-center py-20">
                   <MessageSquare className="w-12 h-12 text-gray-100 mx-auto mb-4" />
                   <p className="text-gray-400 font-medium italic">No comments yet. Be the first to say Mabrook!</p>
                </div>
              ) : (
                product.comments?.map((comment: Comment) => {
                  const hasUpvotedComment = commentVotes.has(`${user?.id}_${comment.id}`);
                  const isHovered = hoveredCommentId === comment.id;

                  return (
                    <div key={comment.id} className="flex gap-4 group relative">
                      <div 
                        className="relative shrink-0"
                        onMouseEnter={() => handleMouseEnter(comment.id)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <button 
                          className="w-10 h-10 rounded-full overflow-hidden border border-emerald-50 cursor-pointer hover:ring-2 hover:ring-emerald-800 transition-all active:scale-95 shadow-sm"
                          onClick={() => onViewProfile(comment.user_id)}
                        >
                          <SafeImage src={comment.avatar_url} alt={comment.username} className="w-full h-full object-cover" />
                        </button>
                        {isHovered && <UserHoverCard comment={comment} />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          <button 
                            className={`font-bold text-[14px] cursor-pointer hover:underline hover:text-emerald-800 transition-colors ${comment.is_maker ? 'text-emerald-800' : 'text-gray-900'}`}
                            onClick={() => onViewProfile(comment.user_id)}
                          >
                            {comment.username}
                          </button>
                          {comment.is_maker && (
                            <span className="text-[8px] px-1.5 py-0.5 bg-emerald-800 text-white rounded font-black uppercase tracking-widest">Maker</span>
                          )}
                        </div>
                        
                        <p className="text-gray-600 text-[15px] leading-relaxed break-words font-medium">
                          {comment.text}
                        </p>
                        
                        <div className="flex items-center gap-4 mt-3 text-[11px] font-black text-gray-400 uppercase tracking-tighter">
                          <button 
                            onClick={() => onCommentUpvote(product.id, comment.id)}
                            className={`flex items-center gap-1 transition-colors ${hasUpvotedComment ? 'text-emerald-800' : 'hover:text-emerald-800'}`}
                          >
                            <Triangle className={`w-2.5 h-2.5 ${hasUpvotedComment ? 'fill-emerald-800' : ''}`} />
                            <span>Upvote ({comment.upvotes_count || 0})</span>
                          </button>
                          <span className="text-gray-200">•</span>
                          <button className="hover:text-emerald-800 transition-colors">Reply</button>
                          <span className="text-gray-200">•</span>
                          <div className="flex items-center gap-1 text-gray-300">
                            <Clock className="w-3 h-3" />
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

        {/* Right Column: Sticky Sidebar (30%) */}
        <div className="lg:w-[35%] shrink-0">
          <div className="sticky top-24 space-y-6">
            {/* Primary Upvote Card */}
            <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm flex flex-col items-center text-center">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6">Support this Launch</h4>
              <button 
                onClick={() => onUpvote(product.id)} 
                className={`w-full py-6 rounded-[1.5rem] font-black text-lg uppercase tracking-widest transition-all active:scale-[0.98] flex flex-col items-center justify-center gap-2 border-2 ${
                  hasUpvoted 
                    ? 'bg-emerald-800 border-emerald-800 text-white shadow-xl shadow-emerald-900/20' 
                    : 'bg-white border-emerald-800 text-emerald-800 hover:bg-emerald-50'
                }`}
              >
                <Triangle className={`w-6 h-6 ${hasUpvoted ? 'fill-white' : ''}`} />
                UPVOTE • {product.upvotes_count || 0}
              </button>
              <div className="mt-6 pt-6 border-t border-gray-50 w-full">
                 <div className="flex items-center justify-center gap-2 text-gray-400 text-xs font-bold uppercase">
                    {/* Fixed: Added missing Users icon */}
                    <Users className="w-4 h-4" /> 
                    <span>1,204 Supporters today</span>
                 </div>
              </div>
            </div>

            {/* High-Fidelity Day Rank Card */}
            <div className="bg-emerald-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-emerald-900/10">
              <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                 <Award className="w-24 h-24 rotate-12" />
              </div>
              <div className="relative z-10">
                <div className="inline-block px-3 py-1 bg-emerald-400 text-[#064e3b] rounded-md text-[10px] font-black uppercase tracking-widest mb-4">
                  LAUNCH PERFORMANCE
                </div>
                <p className="text-4xl font-serif font-bold mb-1">#4 Product</p>
                <p className="text-emerald-300 text-[11px] font-black uppercase tracking-[0.2em] mb-8">Of the Day</p>
                <div className="flex items-center gap-3 p-4 bg-emerald-800/40 rounded-2xl border border-emerald-700/30">
                   <ShieldCheck className="w-6 h-6 text-emerald-400" />
                   <div>
                     <p className="text-[11px] font-black uppercase tracking-widest">Halal Status</p>
                     <p className="text-sm font-bold text-emerald-50">{product.halal_status}</p>
                   </div>
                </div>
              </div>
            </div>

            {/* Maker Card */}
            <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">The Builder</h4>
              <div className="flex items-center gap-4 group cursor-pointer" onClick={() => onViewProfile(product.user_id)}>
                <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-emerald-50 group-hover:ring-2 group-hover:ring-emerald-800 transition-all shrink-0">
                  <SafeImage src={`https://i.pravatar.cc/150?u=${product.user_id}`} alt="Founder" className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-gray-900 group-hover:text-emerald-800 transition-colors truncate">View Profile</p>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">Maker of {product.name}</p>
                </div>
                {/* Fixed: Added missing ChevronRight icon */}
                <ChevronRight className="ml-auto w-5 h-5 text-gray-300 group-hover:text-emerald-800 transition-colors" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
