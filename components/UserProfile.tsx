
import React, { useMemo, useState } from 'react';
import { ArrowLeft, TrendingUp, MessageSquare, Heart, Calendar } from 'lucide-react';
import { Product, User } from '../types';
import ProductCard from './ProductCard';

interface UserProfileProps {
  profileUser: User;
  currentUser: User | null;
  products: Product[];
  votes: Set<string>;
  onBack: () => void;
  onProductClick: (product: Product) => void;
  onCommentClick: (product: Product) => void;
  onUpvote: (productId: string) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({
  profileUser,
  currentUser,
  products,
  votes,
  onBack,
  onProductClick,
  onCommentClick,
  onUpvote
}) => {
  const [activeTab, setActiveTab] = useState<'launches' | 'upvoted'>('launches');

  // Get user's submitted products
  const userProducts = useMemo(() => {
    // Fixed: changed 'founder_id' to 'user_id'
    return products.filter(p => p.user_id === profileUser.id);
  }, [products, profileUser.id]);

  // Get user's upvoted products
  const upvotedProducts = useMemo(() => {
    return products.filter(p => votes.has(`${profileUser.id}_${p.id}`));
  }, [products, profileUser.id, votes]);

  // Get user's comments count
  const commentsCount = useMemo(() => {
    return products.reduce((count, product) => {
      const userComments = product.comments?.filter(c => c.user_id === profileUser.id) || [];
      return count + userComments.length;
    }, 0);
  }, [products, profileUser.id]);

  const totalUpvotesReceived = useMemo(() => {
    return userProducts.reduce((sum, p) => sum + p.upvotes_count, 0);
  }, [userProducts]);

  const isOwnProfile = currentUser?.id === profileUser.id;
  const displayProducts = activeTab === 'launches' ? userProducts : upvotedProducts;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-emerald-800 transition-colors mb-10 group font-bold uppercase tracking-widest text-xs"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back
      </button>

      {/* Profile Header */}
      <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 md:p-12 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
          {/* Avatar */}
          <div className="w-32 h-32 rounded-[2rem] overflow-hidden border-4 border-emerald-100 shadow-lg shrink-0">
            <img 
              src={profileUser.avatar_url} 
              alt={profileUser.username}
              className="w-full h-full object-cover"
            />
          </div>

          {/* User Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-emerald-900">
                {profileUser.username}
              </h1>
              {isOwnProfile && (
                <span className="text-sm px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-sans font-bold">
                  You
                </span>
              )}
            </div>
            <p className="text-gray-500 text-lg mb-6">{profileUser.email}</p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                <div className="flex items-center gap-2 text-emerald-800 mb-1">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Launches</span>
                </div>
                <p className="text-3xl font-bold text-emerald-900">{userProducts.length}</p>
              </div>

              <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                <div className="flex items-center gap-2 text-red-800 mb-1">
                  <Heart className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Impact</span>
                </div>
                <p className="text-3xl font-bold text-red-900">{totalUpvotesReceived}</p>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-center gap-2 text-blue-800 mb-1">
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Comments</span>
                </div>
                <p className="text-3xl font-bold text-blue-900">{commentsCount}</p>
              </div>

              <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                <div className="flex items-center gap-2 text-purple-800 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Member</span>
                </div>
                <p className="text-sm font-bold text-purple-900">
                  {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="flex gap-4 border-b border-gray-200">
          <button 
            onClick={() => setActiveTab('launches')}
            className={`pb-4 px-4 font-bold transition-all ${activeTab === 'launches' ? 'text-emerald-800 border-b-2 border-emerald-800' : 'text-gray-400 hover:text-emerald-800'}`}
          >
            Launches ({userProducts.length})
          </button>
          {isOwnProfile && (
            <button 
              onClick={() => setActiveTab('upvoted')}
              className={`pb-4 px-4 font-bold transition-all ${activeTab === 'upvoted' ? 'text-emerald-800 border-b-2 border-emerald-800' : 'text-gray-400 hover:text-emerald-800'}`}
            >
              Upvoted ({upvotedProducts.length})
            </button>
          )}
        </div>
      </div>

      {/* Products Grid */}
      {displayProducts.length > 0 ? (
        <div className="space-y-3 bg-white rounded-[2.5rem] border border-gray-100 p-3 shadow-sm">
          {displayProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onUpvote={onUpvote}
              hasUpvoted={votes.has(`${currentUser?.id}_${product.id}`)}
              onClick={onProductClick}
              onCommentClick={onCommentClick}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-[2.5rem] p-16 text-center">
          <TrendingUp className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h3 className="text-2xl font-serif font-bold text-gray-400 mb-2">
            {activeTab === 'launches' 
              ? (isOwnProfile ? "You haven't launched anything yet" : `${profileUser.username} hasn't launched anything yet`)
              : "No upvoted products found"
            }
          </h3>
          {isOwnProfile && activeTab === 'launches' && (
            <p className="text-gray-500">Be the first to share your halal product with the Ummah!</p>
          )}
        </div>
      )}
    </div>
  );
};

export default UserProfile;
