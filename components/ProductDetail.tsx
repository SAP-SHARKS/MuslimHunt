
import React, { useState, useEffect, useRef } from 'react';
import { 
  ExternalLink, ChevronUp, ArrowLeft, Calendar, User, MessageSquare, 
  ShieldCheck, Heart, Send, Share2, Flag, ArrowBigUp, Clock, 
  Sparkles, Triangle, ChevronRight, ChevronLeft, Globe, Twitter,
  Info, Layout, Award
} from 'lucide-react';
import { Product, Comment } from '../types';
import { formatTimeAgo } from '../utils/dateUtils';
import SafeImage from './SafeImage.tsx';
import { formatCompactNumber } from '../utils/searchUtils';

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
  const [activeTab, setActiveTab] = useState('Overview');
  const discussionRef = useRef<HTMLDivElement>(null);

  // Mocked screenshots for the high-fidelity gallery
  const screenshots = [
    `https://picsum.photos/seed/${product.id}1/800/450`,
    `https://picsum.photos/seed/${product.id}2/800/450`,
    `https://picsum.photos/seed/${product.id}3/800/450`,
    `https://picsum.photos/seed/${product.id}4/800/450`,
  ];

  useEffect(() => {
    if (scrollToComments && discussionRef.current) {
      setTimeout(() => {
        discussionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [scrollToComments]);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(commentText);
    setCommentText('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col lg:grid lg:grid-cols-[1fr_300px] gap-10">
        
        {/* Left Column (70%) */}
        <div className="space-y-8 min-w-0">
          
          {/* Header Section */}
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl overflow-hidden border border-gray-100 shadow-sm shrink-0">
              <SafeImage src={product.logo_url} alt={product.name} seed={product.id} className="w-full h-full" />
            </div>
            <div className="flex-1 min-w-0 pt-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                  {product.name}
                </h1>
                <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded font-bold uppercase tracking-wider border border-emerald-100">
                  Launching today
                </span>
              </div>
              <p className="text-[16px] lg:text-[18px] text-gray-500 font-medium leading-snug">
                {product.tagline}
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-8 border-b border-gray-100 overflow-x-auto whitespace-nowrap scrollbar-hide">
            {['Overview', 'Reviews', 'Alternatives', 'Team'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm font-bold transition-all relative ${
                  activeTab === tab ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-800 rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="space-y-12">
            
            {/* Description */}
            <div className="prose prose-emerald max-w-none">
              <p className="text-gray-600 text-[17px] leading-relaxed whitespace-pre-wrap">
                {product.description}
              </p>
            </div>

            {/* Media Gallery */}
            <div className="relative group">
              <div className="flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide">
                {screenshots.map((src, i) => (
                  <div key={i} className="flex-none w-[85%] lg:w-[480px] aspect-video bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 snap-start shadow-sm hover:shadow-md transition-shadow">
                    <SafeImage src={src} alt={`${product.name} screenshot ${i+1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              {/* Navigation Arrows for Gallery */}
              <button className="absolute left-[-20px] top-[45%] p-2 bg-white rounded-full shadow-xl border border-gray-50 text-gray-400 hover:text-emerald-800 opacity-0 group-hover:opacity-100 transition-opacity hidden lg:block">
                <ChevronLeft size={24} />
              </button>
              <button className="absolute right-[-20px] top-[45%] p-2 bg-white rounded-full shadow-xl border border-gray-50 text-gray-400 hover:text-emerald-800 opacity-0 group-hover:opacity-100 transition-opacity hidden lg:block">
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Discussion Feed */}
            <div ref={discussionRef} className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Discussion</h3>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  {formatCompactNumber(product.comments?.length || 0)} comments
                </span>
              </div>

              {/* Input Area */}
              <div className="flex gap-4 items-start bg-gray-50/50 p-4 lg:p-6 rounded-[2rem] border border-gray-100">
                <div className="w-9 h-9 rounded-full bg-emerald-800 flex items-center justify-center text-white shrink-0 font-bold text-sm">
                  {user?.username?.[0].toUpperCase() || 'U'}
                </div>
                <div className="flex-1 space-y-3">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="What do you think of this launch?"
                    className="w-full bg-transparent border-none outline-none resize-none text-[15px] min-h-[60px] font-medium placeholder:text-gray-400"
                  />
                  <div className="flex justify-end">
                    <button 
                      onClick={handleSubmitComment}
                      className="px-6 py-2 bg-emerald-800 text-white rounded-full font-bold text-sm hover:bg-emerald-900 transition-all active:scale-95"
                    >
                      Comment
                    </button>
                  </div>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-6 pt-4">
                {product.comments?.map((comment) => (
                  <div key={comment.id} className="flex gap-4 group">
                    <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-gray-100 bg-gray-50">
                      <SafeImage src={comment.avatar_url} alt={comment.username} className="w-full h-full" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[14px] text-gray-900 cursor-pointer hover:text-emerald-800 transition-colors">
                          {comment.username}
                        </span>
                        {comment.is_maker && (
                          <span className="text-[9px] px-1.5 py-0.5 bg-emerald-800 text-white rounded font-black uppercase tracking-tighter">Maker</span>
                        )}
                        <span className="text-[11px] text-gray-400 font-medium">• {formatTimeAgo(comment.created_at)}</span>
                      </div>
                      <p className="text-gray-600 text-[15px] leading-relaxed font-medium">
                        {comment.text}
                      </p>
                      <div className="flex items-center gap-4 pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="text-[11px] font-bold text-gray-400 hover:text-emerald-800 uppercase tracking-wider">Reply</button>
                        <button className="text-[11px] font-bold text-gray-400 hover:text-emerald-800 uppercase tracking-wider">Upvote</button>
                        <button className="text-[11px] font-bold text-gray-400 hover:text-emerald-800 uppercase tracking-wider">Share</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Sticky Actions - 30%) */}
        <div className="hidden lg:block">
          <div className="sticky top-24 space-y-6">
            
            {/* Day Rank Card */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500 shadow-inner">
                  <Award size={20} />
                </div>
                <div>
                  <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Daily Achievement</p>
                  <p className="text-[16px] font-bold text-gray-900">#1 Day Rank</p>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1 hover:bg-gray-50 rounded text-gray-300 hover:text-emerald-800"><ChevronLeft size={16}/></button>
                <button className="p-1 hover:bg-gray-50 rounded text-gray-300 hover:text-emerald-800"><ChevronRight size={16}/></button>
              </div>
            </div>

            {/* Primary Upvote Action */}
            <button
              onClick={() => onUpvote(product.id)}
              className={`w-full py-5 rounded-2xl font-black text-lg uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-all border-2 ${
                hasUpvoted 
                  ? 'bg-emerald-900 border-emerald-900 text-white' 
                  : 'bg-white border-emerald-800 text-emerald-800 hover:bg-emerald-50'
              }`}
            >
              <Triangle className={`w-5 h-5 ${hasUpvoted ? 'fill-white' : ''}`} />
              Upvote • {formatCompactNumber(product.upvotes_count || 0)}
            </button>

            {/* Company Info & Meta */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-6">
              <div>
                <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4">Company Info</h4>
                <div className="space-y-3">
                  <a href={product.website_url || '#'} className="flex items-center justify-between text-[14px] font-bold text-gray-700 hover:text-emerald-800 transition-colors group">
                    <div className="flex items-center gap-2"><Globe size={14} className="text-gray-300" /> Website</div>
                    <ExternalLink size={12} className="opacity-0 group-hover:opacity-100" />
                  </a>
                  <a href="#" className="flex items-center justify-between text-[14px] font-bold text-gray-700 hover:text-emerald-800 transition-colors group">
                    <div className="flex items-center gap-2"><Twitter size={14} className="text-gray-300" /> Twitter</div>
                    <ExternalLink size={12} className="opacity-0 group-hover:opacity-100" />
                  </a>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-50">
                <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4">Trust & Compliance</h4>
                <div className="flex items-center gap-3 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100/50">
                  <ShieldCheck className="w-5 h-5 text-emerald-800 shrink-0" />
                  <p className="text-[13px] font-bold text-emerald-900">{product.halal_status}</p>
                </div>
              </div>

              {/* Similar Products */}
              <div className="pt-6 border-t border-gray-50">
                <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4">Similar Products</h4>
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex items-center gap-3 cursor-pointer group">
                      <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden shrink-0">
                        <SafeImage src={`https://picsum.photos/seed/${i}${i}/40/40`} alt="Similar" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-bold text-gray-900 truncate group-hover:text-emerald-800">Related App {i}</p>
                        <p className="text-[11px] text-gray-400 font-medium truncate">Alternative solution...</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Support / Advertise Card */}
            <div className="bg-emerald-900 rounded-2xl p-6 text-white relative overflow-hidden group shadow-xl">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform pointer-events-none">
                <Sparkles size={100} className="rotate-12" />
              </div>
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-2">Ummah Support</p>
                <h4 className="text-lg font-bold leading-tight mb-4">Launch your product with the community.</h4>
                <button className="text-xs font-black text-emerald-300 hover:text-white transition-colors flex items-center gap-2 uppercase tracking-widest">
                  Learn how to launch <ChevronRight size={14} />
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetail;
