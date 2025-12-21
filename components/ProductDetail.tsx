
import React, { useState } from 'react';
import { ExternalLink, ChevronUp, ArrowLeft, Calendar, User, MessageSquare, ShieldCheck, Heart, Send } from 'lucide-react';
import { Product, Comment } from '../types';

interface ProductDetailProps {
  product: Product;
  user: any;
  onBack: () => void;
  onUpvote: (id: string) => void;
  hasUpvoted: boolean;
  onAddComment: (text: string) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, user, onBack, onUpvote, hasUpvoted, onAddComment }) => {
  const [commentText, setCommentText] = useState('');

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(commentText);
    setCommentText('');
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
        {/* Main Content */}
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
                <p className="text-xl text-gray-500 font-medium leading-snug">
                  {product.tagline}
                </p>
              </div>
            </div>

            <div className="prose prose-emerald max-w-none">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About this product</h2>
              <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-wrap">
                {product.description}
              </p>
            </div>

            {product.sadaqah_info && (
              <div className="mt-8 p-6 bg-red-50/50 border border-red-100 rounded-2xl flex gap-4">
                <Heart className="w-6 h-6 text-red-500 shrink-0" />
                <div>
                  <h4 className="font-bold text-red-900">Community Impact (Sadaqah)</h4>
                  <p className="text-red-800/80">{product.sadaqah_info}</p>
                </div>
              </div>
            )}
          </div>

          {/* Discussion Section */}
          <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-sm p-8 sm:p-12">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-emerald-900 flex items-center gap-3">
                <MessageSquare className="w-6 h-6" />
                Discussion
              </h3>
              <span className="text-gray-400 font-medium">{product.comments?.length || 0} comments</span>
            </div>

            {user ? (
              <form onSubmit={handleSubmitComment} className="mb-10 flex gap-4">
                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-gray-200">
                  <img src={user.avatar_url} alt={user.username} className="w-full h-full object-cover" />
                </div>
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
                product.comments?.map((comment: Comment) => (
                  <div key={comment.id} className="flex gap-4 group">
                    <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-emerald-50">
                      <img src={comment.avatar_url} alt={comment.username} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`font-bold text-sm ${comment.is_maker ? 'text-emerald-800' : 'text-gray-900'}`}>
                          {comment.username}
                        </span>
                        {comment.is_maker && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-emerald-800 text-white rounded font-black uppercase">Maker</span>
                        )}
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-600 text-base leading-relaxed">
                        {comment.text}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
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
              <a 
                href={product.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-white text-emerald-900 w-full py-4 rounded-2xl font-black text-lg transition-all hover:shadow-lg active:scale-[0.98]"
              >
                Visit Site <ExternalLink className="w-5 h-5" />
              </a>
              <button
                onClick={() => onUpvote(product.id)}
                className={`flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-black text-lg transition-all border-2 ${
                  hasUpvoted 
                    ? 'bg-emerald-700/50 border-white text-white' 
                    : 'bg-transparent border-emerald-600/50 text-emerald-100 hover:border-white'
                }`}
              >
                <ChevronUp className="w-6 h-6" />
                {product.upvotes_count} Upvotes
              </button>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8">
            <h4 className="font-bold text-gray-900 mb-4">The Maker</h4>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800">
                <User className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-gray-900">Community Builder</p>
                <p className="text-sm text-gray-500">Kuala Lumpur, MY</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
