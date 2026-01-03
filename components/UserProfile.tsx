
import React, { useState } from 'react';
import { 
  ArrowLeft, TrendingUp, Twitter, Globe, Calendar, Award, MessageSquare, 
  Heart, Sparkles, Edit3, Share2, MoreHorizontal, Users, Bookmark, 
  Layers, Star, ThumbsUp, Package, Layout, User as UserIcon
} from 'lucide-react';
import { Product, Profile, User, View } from '../types';
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
  onEditClick?: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({
  profile,
  currentUser,
  products,
  votes,
  onBack,
  onProductClick,
  onCommentClick,
  onUpvote,
  onEditClick
}) => {
  const [activeTab, setActiveTab] = useState('about');
  
  const makerHistory = products.filter(p => p.user_id === profile.id);
  const totalKarma = makerHistory.reduce((acc, p) => acc + (p.upvotes_count || 0), 0);
  const isOwnProfile = currentUser?.id === profile.id;

  const tabs = [
    // Fix: Use UserIcon from lucide-react instead of User interface type
    { id: 'about', label: 'About', icon: UserIcon },
    { id: 'forums', label: 'Forums', icon: MessageSquare },
    { id: 'activity', label: 'Activity', icon: TrendingUp },
    { id: 'upvotes', label: 'Upvotes', icon: ThumbsUp },
    { id: 'collections', label: 'Collections', icon: Package },
    { id: 'stacks', label: 'Stacks', icon: Layers },
    { id: 'reviews', label: 'Reviews', icon: Star }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'about':
        return (
          <div className="space-y-12">
            <section>
              <h2 className="text-xl font-serif font-bold text-emerald-900 mb-6 flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-emerald-800 opacity-30" /> About
              </h2>
              <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 sm:p-10 shadow-sm">
                <p className="text-gray-600 leading-relaxed font-medium text-lg whitespace-pre-wrap">
                  {profile.bio || "This user hasn't added a bio yet. Bismillah, it's never too late to share your story!"}
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-serif font-bold text-emerald-900 mb-6 flex items-center gap-3">
                <Award className="w-5 h-5 text-emerald-800 opacity-30" /> Maker Activity
              </h2>
              <div className="space-y-4">
                {makerHistory.length > 0 ? (
                  makerHistory.map(p => (
                    <ProductCard 
                      key={p.id} 
                      product={p} 
                      onUpvote={onUpvote} 
                      hasUpvoted={votes.has(`${currentUser?.id}_${p.id}`)}
                      onClick={onProductClick}
                      onCommentClick={onCommentClick}
                    />
                  ))
                ) : (
                  <div className="bg-gray-50/50 border border-dashed border-gray-200 rounded-[2rem] p-16 text-center">
                    <p className="text-gray-400 font-medium italic">No products launched yet.</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        );
      case 'upvotes':
        return (
          <div className="space-y-12">
            <section>
              <h2 className="text-xl font-serif font-bold text-emerald-900 mb-6 flex items-center gap-3">
                <ThumbsUp className="w-5 h-5 text-emerald-800 opacity-30" /> Recently Upvoted
              </h2>
              <div className="space-y-4">
                {/* Mocking upvoted products from global list for visual consistency */}
                {products.slice(0, 3).map(p => (
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
            </section>
          </div>
        );
      default:
        return (
          <div className="bg-gray-50/50 border border-dashed border-gray-200 rounded-[2.5rem] p-24 text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <MessageSquare className="w-8 h-8 text-gray-200" />
            </div>
            <h3 className="text-xl font-serif font-bold text-gray-400 mb-2">No {activeTab} yet</h3>
            <p className="text-gray-400 font-medium italic">Content will appear here as the user interacts with the community.</p>
          </div>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 animate-in fade-in duration-500">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-emerald-800 transition-colors mb-10 group font-bold uppercase tracking-widest text-[10px]"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back
      </button>

      {/* Profile Header Card */}
      <div className="bg-white border border-gray-100 rounded-[3rem] p-8 sm:p-12 shadow-sm mb-8">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10">
          <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-emerald-50 shrink-0 shadow-md">
            <img src={profile.avatar_url} alt={profile.username} className="w-full h-full object-cover" />
          </div>
          
          <div className="flex-1 text-center lg:text-left">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
              <div>
                <h1 className="text-4xl font-serif font-bold text-emerald-900 mb-2">@{profile.username}</h1>
                <p className="text-gray-500 text-lg font-medium leading-relaxed max-w-2xl">
                  {profile.headline || 'Halal-conscious Tech Enthusiast'}
                </p>
              </div>
              
              <div className="flex items-center justify-center lg:justify-end gap-3">
                {isOwnProfile ? (
                  <button 
                    onClick={onEditClick}
                    className="flex items-center gap-2 px-6 py-3 bg-emerald-800 text-white rounded-xl font-bold text-sm hover:bg-emerald-900 transition-all active:scale-95 shadow-lg shadow-emerald-900/10"
                  >
                    <Edit3 className="w-4 h-4" /> Edit my profile
                  </button>
                ) : (
                  <button className="px-8 py-3 bg-emerald-800 text-white rounded-xl font-bold text-sm hover:bg-emerald-900 transition-all active:scale-95 shadow-lg shadow-emerald-900/10">
                    Follow
                  </button>
                )}
                <button className="p-3 border border-gray-100 rounded-xl text-gray-400 hover:text-emerald-800 transition-all active:scale-95">
                  <Share2 className="w-5 h-5" />
                </button>
                <button className="p-3 border border-gray-100 rounded-xl text-gray-400 hover:text-emerald-800 transition-all active:scale-95">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-800 opacity-40" />
                <span>1.4k Followers</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-800 opacity-40" />
                <span>{totalKarma} Karma</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-800 opacity-40" />
                <span>Joined May 2024</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center justify-center border-b border-gray-100 mb-12 overflow-x-auto scrollbar-hide">
        <div className="flex gap-8 sm:gap-10 px-4 min-w-max">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 text-[11px] sm:text-sm font-black uppercase tracking-widest transition-all relative whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.id ? 'text-emerald-900' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <tab.icon className={`w-3.5 h-3.5 ${activeTab === tab.id ? 'text-emerald-800' : 'text-gray-300'}`} />
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-900 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <div className="lg:col-span-3">
          {renderTabContent()}
        </div>

        {/* Sidebar Info */}
        <aside className="space-y-8">
          <div className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm">
            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-50 pb-4">Social</h3>
            <div className="space-y-4">
              {profile.twitter_url && (
                <a href={profile.twitter_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-600 hover:text-emerald-800 transition-colors font-bold text-sm">
                  <Twitter className="w-4 h-4 text-[#1DA1F2]" /> @{profile.username}
                </a>
              )}
              {profile.website_url && (
                <a href={profile.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-600 hover:text-emerald-800 transition-colors font-bold text-sm">
                  <Globe className="w-4 h-4 text-emerald-800" /> Website
                </a>
              )}
              {!profile.twitter_url && !profile.website_url && (
                <p className="text-xs text-gray-400 italic font-medium">No social links added.</p>
              )}
            </div>
          </div>
          
          <div className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm">
            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-50 pb-4">Community Badges</h3>
            <div className="flex flex-wrap gap-3">
              <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-800 border border-emerald-100" title="Founding Member">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600 border border-amber-100" title="Top Contributor">
                <Award className="w-5 h-5" />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default UserProfile;
