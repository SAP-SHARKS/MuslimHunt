
import React, { useState, useEffect, useRef } from 'react';
import { 
  ExternalLink, ArrowLeft, Calendar, MessageSquare, 
  ShieldCheck, Send, Triangle, ChevronRight, ChevronLeft, 
  Globe, Twitter, Award, Clock, Sparkles
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

  // High-fidelity mocked media for the gallery
  const screenshots = [
    `https://picsum.photos/seed/${product.id}1/1280/720`,
    `https://picsum.photos/seed/${product.id}2/1280/720`,
    `https://picsum.photos/seed/${product.id}3/1280/720`,
    `https://picsum.photos/seed/${product.id}4/1280/720`,
  ];

  useEffect(() => {
    if (scrollToComments && discussionRef.current) {
      setTimeout(() => {
        discussionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    }
  }, [scrollToComments]);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(commentText);
    setCommentText('');
  };

  return (
    <div className="max-w-[1100px] mx-auto px-4 py-6">
      <div className="flex flex-col lg:grid lg:grid-cols-[1fr_300px] gap-12">
        
        {/* Left Column (70%) */}
        <div className="min-w-0 space-y-10">
          
          {/* Header Area */}
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-[20px] overflow-hidden border border-gray-100 shadow-sm shrink-0">
              <SafeImage src={product.logo_url} alt={product.name} seed={product.id} className="w-full h-full" />
            </div>
            <div className="flex-1 min-w-0 pt-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight tracking-tight">
                  {product.name}
                </h1>
                <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded font-bold uppercase tracking-wider border border-emerald-100 shadow-sm">
                  Launching today
                </span>
              </div>
              <p className="text-[17px] lg:text-[19px] text-gray-500 font-medium leading-snug tracking-tight mb-4">
                {product.tagline}
              </p>
              <div className="flex items-center gap-3">
                <a 
                  href={product.website_url || product.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="px-6 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:border-emerald-800 hover:text-emerald-800 transition-all shadow-sm active:scale-95 flex items-center gap-2"
                >
                  Visit website <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>

          {/* Navigation Tabs (Product Hunt Style) */}
          <div className="flex items-center gap-8 border-b border-gray-100 overflow-x-auto whitespace-nowrap scrollbar-hide">
            {['Overview', 'Reviews', 'Alternatives', 'Team'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-[13px] font-bold transition-all relative ${
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

          {/* Media Gallery */}
          <div className="relative group">
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
              {screenshots.map((src, i) => (
                <div key={i} className="flex-none w-[90%] lg:w-[540px] aspect-video bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 snap-start shadow-sm group-hover:shadow-md transition-all">
                  <SafeImage src={src} alt={`${product.name} screenshot ${i+1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            {/* Gallery Navigation UI */}
            <button className="absolute left-[-24px] top-[42%] p-2.5 bg-white rounded-full shadow-2xl border border-gray-100 text-gray-400 hover:text-emerald-800 opacity-0 group-hover:opacity-100 transition-opacity hidden lg:block active:scale-90">
              <ChevronLeft size={22} />
            </button>
            <button className="absolute right-[-24px] top-[42%] p-2.5 bg-white rounded-full shadow-2xl border border-gray-100 text-gray-400 hover:text-emerald-800 opacity-0 group-hover:opacity-100 transition-opacity hidden lg:block active:scale-90">
              <ChevronRight size={22} />
            </button>
          </div>

          {/* Product Description */}
          <div className="prose prose-emerald max-w-none">
            <p className="text-gray-600 text-[17px] leading-relaxed whitespace-pre-wrap tracking-tight">
              {product.description}
            </p>
          </div>

          {/* High-Density Discussion Feed */}
          <div ref={discussionRef} className="space-y-8 pt-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-lg font-bold text-gray-900 tracking-tight">Discussion</h3>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                {formatCompactNumber(product.comments?.length || 0)} comments
              </span>
            </div>

            {/* What do you think input */}
            <div className="flex gap-4 items-start bg-gray-50/50 p-5 lg:p-6 rounded-3xl border border-gray-100 shadow-inner">
              <div className="w-10 h-10 rounded-full bg-emerald-800 flex items-center justify-center text-white shrink-0 font-bold text-sm shadow-sm">
                {user?.username?.[0].toUpperCase() || 'U'}
              </div>
              <div className="flex-1 space-y-4">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="What do you think of this launch?"
                  className="w-full bg-transparent border-none outline-none resize-none text-[15px] min-h-[80px] font-medium placeholder:text-gray-400 leading-snug pt-1"
                />
                <div className="flex justify-end">
                  <button 
                    onClick={handleSubmitComment}
                    className="px-8 py-2.5 bg-emerald-800 text-white rounded-full font-bold text-[13px] hover:bg-emerald-900 transition-all active:scale-95 shadow-lg shadow-emerald-900/10 uppercase tracking-widest"
                  >
                    Comment
                  </button>
                </div>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-8">
              {product.comments?.map((comment) => (
                <div key={comment.id} className="flex gap-4 group">
                  <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-gray-100 bg-gray-50 shadow-sm">
                    <SafeImage src={comment.avatar_url} alt={comment.username} className="w-full h-full" />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[14px] text-gray-900 cursor-pointer hover:text-emerald-800 transition-colors tracking-tight">
                        {comment.username}
                      </span>
                      {comment.is_maker && (
                        <span className="text-[9px] px-1.5 py-0.5 bg-emerald-800 text-white rounded font-black uppercase tracking-tighter">Maker</span>
                      )}
                      <span className="text-[11px] text-gray-400 font-medium tracking-tight">• {formatTimeAgo(comment.created_at)}</span>
                    </div>
                    <p className="text-gray-600 text-[14px] lg:text-[15px] leading-relaxed font-normal tracking-tight">
                      {comment.text}
                    </p>
                    <div className="flex items-center gap-5 pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-[10px] font-bold text-gray-400 hover:text-emerald-800 uppercase tracking-widest transition-colors">Reply</button>
                      <button 
                        onClick={() => onCommentUpvote(product.id, comment.id)}
                        className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${commentVotes.has(`${user?.id}_${comment.id}`) ? 'text-emerald-800' : 'text-gray-400 hover:text-emerald-800'}`}
                      >
                        Upvote {comment.upvotes_count > 0 && `(${formatCompactNumber(comment.upvotes_count)})`}
                      </button>
                      <button className="text-[10px] font-bold text-gray-400 hover:text-emerald-800 uppercase tracking-widest transition-colors">Share</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (Sticky Actions - 30%) */}
        <div className="hidden lg:block relative">
          <div className="sticky top-24 space-y-6">
            
            {/* Day Rank Card */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500 shadow-inner">
                  <Award size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Daily Achievement</p>
                  <p className="text-[17px] font-bold text-gray-900 tracking-tight">#1 Day Rank</p>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1 hover:bg-gray-50 rounded text-gray-300 hover:text-emerald-800"><ChevronLeft size={16}/></button>
                <button className="p-1 hover:bg-gray-50 rounded text-gray-300 hover:text-emerald-800"><ChevronRight size={16}/></button>
              </div>
            </div>

            {/* Primary Upvote Action (PH Style Red/Orange or Muslim Hunt Emerald) */}
            <button
              onClick={() => onUpvote(product.id)}
              className={`w-full py-5 rounded-2xl font-black text-lg uppercase tracking-[0.15em] flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all border-2 ${
                hasUpvoted 
                  ? 'bg-emerald-900 border-emerald-900 text-white' 
                  : 'bg-white border-emerald-800 text-emerald-800 hover:bg-emerald-50'
              }`}
            >
              <Triangle className={`w-5 h-5 ${hasUpvoted ? 'fill-white' : ''}`} />
              Upvote • {formatCompactNumber(product.upvotes_count || 0)}
            </button>

            {/* Company Info & Compliance Meta */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-6 shadow-sm">
              <div>
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Company Info</h4>
                <div className="space-y-4">
                  <a href={product.website_url || '#'} target="_blank" className="flex items-center justify-between text-[14px] font-bold text-gray-700 hover:text-emerald-800 transition-colors group tracking-tight">
                    <div className="flex items-center gap-2"><Globe size={15} className="text-gray-300" /> Website</div>
                    <ChevronRight size={14} className="opacity-0 group-hover:opacity-100" />
                  </a>
                  <a href="#" className="flex items-center justify-between text-[14px] font-bold text-gray-700 hover:text-emerald-800 transition-colors group tracking-tight">
                    <div className="flex items-center gap-2"><Twitter size={15} className="text-gray-300" /> Twitter</div>
                    <ChevronRight size={14} className="opacity-0 group-hover:opacity-100" />
                  </a>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-50">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Verification</h4>
                <div className="flex items-center gap-3 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100/50">
                  <ShieldCheck className="w-5 h-5 text-emerald-800 shrink-0" />
                  <div>
                    <p className="text-[13px] font-bold text-emerald-900 tracking-tight leading-none mb-1">{product.halal_status}</p>
                    <p className="text-[10px] text-emerald-600/70 font-medium">Compliance verified</p>
                  </div>
                </div>
              </div>

              {/* Related Apps */}
              <div className="pt-6 border-t border-gray-50">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Similar Products</h4>
                <div className="space-y-5">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex items-center gap-3 cursor-pointer group">
                      <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden shrink-0 shadow-sm">
                        <SafeImage src={`https://picsum.photos/seed/${i}${i}/48/48`} alt="Similar" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-bold text-gray-900 truncate group-hover:text-emerald-800 tracking-tight">Related App {i}</p>
                        <p className="text-[11px] text-gray-400 font-medium truncate tracking-tight">Alternative solution...</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Launch Support CTA */}
            <div className="bg-emerald-900 rounded-3xl p-7 text-white relative overflow-hidden group shadow-2xl">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform pointer-events-none">
                <Sparkles size={110} className="rotate-12" />
              </div>
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-3">Community Growth</p>
                <h4 className="text-xl font-bold leading-tight mb-5 tracking-tight">Launch your next tool with the Ummah.</h4>
                <button className="text-[11px] font-black text-emerald-300 hover:text-white transition-colors flex items-center gap-2 uppercase tracking-widest">
                  View Launch Guidelines <ChevronRight size={14} />
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
