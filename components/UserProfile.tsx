
import React from 'react';
import { ArrowLeft, TrendingUp, Twitter, Globe, Calendar, Award, MessageSquare, Heart, Sparkles } from 'lucide-react';
import { Product, Profile, User } from '../types';
import ProductCard from './ProductCard';

interface UserProfileProps {
  profile: Profile;
  currentUser: User | null;
  products: Product[];
  votes: Set<string>;
  onBack: () => void;
  onProductClick: (product: Product) => void;
  onCommentClick: (product: Product) => void;
  onUpvote: (productId: string) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({
  profile,
  currentUser,
  products,
  votes,
  onBack,
  onProductClick,
  onCommentClick,
  onUpvote
}) => {
  // Aligned with user_id schema
  const makerHistory = products.filter(p => p.user_id === profile.id);
  const totalKarma = makerHistory.reduce((acc, p) => acc + (p.upvotes_count || 0), 0);
  const isOwnProfile = currentUser?.id === profile.id;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Top Nav */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-emerald-800 transition-colors mb-8 group font-bold uppercase tracking-widest text-xs"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Community
      </button>

      {/* Profile Header */}
      <div className="bg-white border border-gray-100 rounded-[2rem] p-8 mb-12 shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">

          {/* Left: Info */}
          <div className="flex flex-col lg:flex-row items-center lg:items-center gap-8 w-full lg:w-auto text-center lg:text-left">
            <div className="w-32 h-32 shrink-0 rounded-full overflow-hidden border-4 border-emerald-50 shadow-md">
              <img src={profile.avatar_url} alt={profile.username} className="w-full h-full object-cover" />
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-center lg:justify-start gap-3">
                <h1 className="text-3xl font-serif font-bold text-emerald-900">{profile.username}</h1>
                {isOwnProfile && <Sparkles className="w-5 h-5 text-emerald-500 fill-emerald-100" />}
                {profile.headline && (
                  <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest bg-emerald-50 py-1.5 px-3 rounded-full border border-emerald-100">
                    {profile.headline}
                  </span>
                )}
              </div>

              {profile.bio && <p className="text-gray-500 font-medium leading-relaxed max-w-xl">{profile.bio}</p>}

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-1">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                  <p className="text-emerald-800">{makerHistory.length}</p> Launches
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                  <p className="text-emerald-800">{totalKarma}</p> Karma
                </div>
                <div className="w-px h-4 bg-gray-200 hidden lg:block" />
                {profile.twitter_url && (
                  <a href={profile.twitter_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#1DA1F2] transition-colors"><Twitter className="w-4 h-4" /></a>
                )}
                {profile.website_url && (
                  <a href={profile.website_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-emerald-800 transition-colors"><Globe className="w-4 h-4" /></a>
                )}
                <span className="text-gray-300 text-xs font-medium flex items-center gap-1.5"><Calendar className="w-3 h-3" /> Joined 2024</span>
              </div>
            </div>
          </div>

          {/* Right: Actions (Desktop Only) */}
          <div className="hidden lg:flex flex-col gap-3 shrink-0">
            {isOwnProfile ? (
              <button className="px-6 py-3 bg-white border-2 border-gray-100 text-emerald-900 font-bold rounded-xl hover:border-emerald-200 hover:bg-emerald-50 hover:shadow-sm transition-all text-sm">
                Edit my profile
              </button>
            ) : (
              <button className="px-6 py-3 bg-emerald-900 text-white font-bold rounded-xl hover:bg-emerald-800 hover:shadow-lg hover:shadow-emerald-900/20 transition-all text-sm">
                Follow
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-emerald-800" />
              <h2 className="text-xl font-serif font-bold text-emerald-900">Maker History</h2>
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{makerHistory.length} Products</span>
          </div>

          {makerHistory.length > 0 ? (
            <div className="space-y-4">
              {makerHistory.map(p => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onUpvote={onUpvote}
                  hasUpvoted={votes.has(`${currentUser?.id}_${p.id}`)}
                  onClick={onProductClick}
                  onCommentClick={onCommentClick}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-100 rounded-[2rem] p-16 text-center">
              <Sparkles className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">No launches yet</h3>
              <p className="text-gray-500">This maker hasn't launched any products yet.</p>
            </div>
          )}
        </div>

        {/* Right Sidebar (Community) */}
        <div className="space-y-8">
          <div className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm">
            <h3 className="text-sm font-bold text-emerald-900 mb-4 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> Activity
            </h3>
            <div className="text-center py-8">
              <p className="text-sm text-gray-400 italic">No recent activity.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
