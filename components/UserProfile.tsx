
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
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-emerald-800 transition-colors mb-10 group font-bold uppercase tracking-widest text-xs"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Community
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Profile Sidebar */}
        <div className="lg:col-span-1 space-y-6 sticky top-24">
          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm">
            <div className="w-32 h-32 mx-auto rounded-[2.5rem] overflow-hidden border-4 border-emerald-50 mb-6 shadow-md">
              <img src={profile.avatar_url} alt={profile.username} className="w-full h-full object-cover" />
            </div>
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-1">
                <h1 className="text-2xl font-serif font-bold text-emerald-900">{profile.username}</h1>
                {isOwnProfile && <Sparkles className="w-4 h-4 text-emerald-500" />}
              </div>
              {profile.headline && (
                <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest mb-3 bg-emerald-50 py-1 px-3 rounded-full inline-block">
                  {profile.headline}
                </p>
              )}
              <p className="text-gray-500 text-sm leading-relaxed">{profile.bio}</p>
            </div>

            <div className="space-y-3 pt-6 border-t border-gray-50">
              {profile.twitter_url && (
                <a href={profile.twitter_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-400 hover:text-emerald-800 transition-colors text-sm font-medium">
                  <Twitter className="w-4 h-4" /> @{profile.username}
                </a>
              )}
              {profile.website_url && (
                <a href={profile.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-400 hover:text-emerald-800 transition-colors text-sm font-medium">
                  <Globe className="w-4 h-4" /> Personal Site
                </a>
              )}
              <div className="flex items-center gap-3 text-gray-400 text-sm font-medium">
                <Calendar className="w-4 h-4" /> Joined 2024
              </div>
            </div>
          </div>

          <div className="bg-emerald-900 rounded-[2.5rem] p-8 text-white shadow-xl shadow-emerald-900/10">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400 mb-6 flex items-center gap-2">
              <Award className="w-4 h-4" /> Maker Stats
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-emerald-800/50 p-4 rounded-2xl text-center">
                <p className="text-2xl font-black">{makerHistory.length}</p>
                <p className="text-[10px] uppercase font-bold text-emerald-300 tracking-tighter">Launches</p>
              </div>
              <div className="bg-emerald-800/50 p-4 rounded-2xl text-center">
                <p className="text-2xl font-black">{totalKarma}</p>
                <p className="text-[10px] uppercase font-bold text-emerald-300 tracking-tighter">Karma</p>
              </div>
            </div>
          </div>
        </div>

        {/* Maker History Main Feed */}
        <div className="lg:col-span-3 space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
              <TrendingUp className="w-6 h-6 text-emerald-800" />
              <h2 className="text-2xl font-serif font-bold text-emerald-900">Maker History</h2>
            </div>

            {makerHistory.length > 0 ? (
              <div className="space-y-4 bg-white/40 p-3 rounded-[3rem] border border-emerald-50/50 shadow-inner">
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
              <div className="bg-white border border-gray-100 rounded-[3rem] p-24 text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-10 h-10 text-gray-200" />
                </div>
                <h3 className="text-xl font-serif font-bold text-gray-400 mb-2">Preparing for Launch</h3>
                <p className="text-gray-400 font-medium italic">This maker is currently exploring the ecosystem.</p>
              </div>
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-serif font-bold text-emerald-900 mb-6 flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-gray-300" /> Recent Community Activity
            </h3>
            <div className="bg-white border border-gray-50 rounded-[2.5rem] p-12 text-center text-gray-400 text-sm italic shadow-sm">
              Discussion threads and community contributions will appear here as the maker participates.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
