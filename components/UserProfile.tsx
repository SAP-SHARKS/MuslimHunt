import React, { useState } from 'react';
import { Twitter, Globe, Flame, MessageSquare, ChevronDown } from 'lucide-react';
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
  onEditProfile?: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({
  profile,
  currentUser,
  products,
  votes,
  onProductClick,
  onCommentClick,
  onUpvote,
  onEditProfile
}) => {
  const [activeTab, setActiveTab] = useState('About');
  const isOwnProfile = currentUser?.id === profile.id;

  // Aligned with user_id schema
  const makerHistory = products.filter(p => p.user_id === profile.id);

  const tabs = ['About', 'Forums', 'Activity', 'Upvotes', 'Collections', 'Stacks', 'Reviews'];

  return (
    <div className="min-h-screen bg-white font-sans text-[#4b587c]">
      {/* Header Section */}
      <div className="max-w-5xl mx-auto px-4 pt-12 pb-4">
        <div className="flex flex-col md:flex-row items-start gap-8">

          {/* Avatar */}
          <div className="shrink-0">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border border-gray-100">
              <img src={profile.avatar_url} alt={profile.username} className="w-full h-full object-cover" />
            </div>
          </div>

          {/* User Info & Actions */}
          <div className="flex-1 min-w-0 w-full">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">

              {/* Info */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">{profile.full_name || profile.username}</h1>
                <p className="text-gray-500 mb-2 font-light">{profile.headline || 'Community Member'}</p>

                {/* Stats Row */}
                <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-gray-500 mb-4">
                  <span className="uppercase tracking-wide">#{profile.id.substring(0, 7)}</span>
                  <span>0 followers</span>
                  <span>0 following</span>
                  <span className="flex items-center gap-1 text-[#ff6154]"><Flame className="w-3 h-3 fill-[#ff6154]" /> 7 day streak</span>
                </div>

                {/* Socials / Location */}
                <div className="flex items-center gap-4">
                  {profile.twitter_url && (
                    <a href={profile.twitter_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#1DA1F2] transition-colors"><Twitter className="w-4 h-4" /></a>
                  )}
                  {profile.website_url && (
                    <a href={profile.website_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-emerald-800 transition-colors"><Globe className="w-4 h-4" /></a>
                  )}
                </div>
              </div>

              {/* Edit Button */}
              {isOwnProfile && (
                <button
                  onClick={onEditProfile}
                  className="px-5 py-2.5 rounded-full border border-[#d9e1ec] text-sm font-semibold text-[#4b587c] hover:bg-gray-50 transition-colors bg-white shadow-sm"
                >
                  Edit my profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="pl-4 md:pl-0 mt-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-8 overflow-x-auto no-scrollbar border-b border-gray-100">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm font-medium whitespace-nowrap transition-colors relative ${activeTab === tab
                  ? 'text-gray-900 border-b-2 border-[#ff6154]'
                  : 'text-gray-500 hover:text-gray-900'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {activeTab === 'About' && (
          <div className="space-y-12">

            {/* About Section */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-4">About</h3>
              {profile.bio ? (
                <p className="text-gray-600 leading-relaxed max-w-3xl text-[15px]">{profile.bio}</p>
              ) : (
                <div className="bg-[#f3f4f8] rounded-md p-8 text-center border border-gray-100 max-w-3xl">
                  <p className="text-gray-600 text-sm">Add a bio to help people get a better idea of you, your skills, history, and talents.</p>
                </div>
              )}
            </section>

            {/* Badges Section */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Badges</h3>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-3 bg-white border border-[#e8ebf3] px-4 py-3 rounded-xl shadow-sm min-w-[200px]">
                  <div className="w-10 h-10 bg-[#fff0ed] rounded-full flex items-center justify-center">
                    <Flame className="w-5 h-5 text-[#ff6154] fill-[#ff6154]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">Gone streaking</p>
                    <div className="flex gap-0.5 mt-1">
                      <div className="w-4 h-1 bg-[#ff6154] rounded-full"></div>
                      <div className="w-4 h-1 bg-[#ff6154] rounded-full"></div>
                      <div className="w-4 h-1 bg-gray-200 rounded-full"></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white border border-[#e8ebf3] px-4 py-3 rounded-xl shadow-sm min-w-[200px]">
                  <div className="w-10 h-10 bg-[#e7f6ed] rounded-full flex items-center justify-center">
                    <Flame className="w-5 h-5 text-[#4bba72] fill-[#4bba72]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">Gone streaking 5</p>
                    <p className="text-[10px] text-gray-400">5 day streak</p>
                  </div>
                </div>
              </div>
              <button className="mt-4 text-xs font-semibold text-gray-500 hover:text-gray-900">View all badges</button>
            </section>
          </div>
        )}

        {/* Forums Tab */}
        {activeTab === 'Forums' && (
          <div className="py-20 text-center flex flex-col items-center justify-center">
            {/* Cat Placeholder Icon */}
            <span className="text-4xl mb-4">🐱</span>
            <h3 className="text-lg font-bold text-gray-900 mb-2">You haven't started any discussions yet.</h3>
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'Activity' && (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <button className="text-sm font-semibold text-gray-900 flex items-center gap-1 hover:text-gray-700">
                All activity <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {makerHistory.length > 0 ? (
              <div className="grid gap-4 max-w-2xl">
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
              <div className="text-left text-gray-500 text-sm">
                No activity events
              </div>
            )}
          </div>
        )}

        {/* Upvotes Tab */}
        {activeTab === 'Upvotes' && (
          <div className="py-20 text-center flex flex-col items-center justify-center">
            <span className="text-4xl mb-4">🐱</span>
            <h3 className="text-gray-900 font-medium">No upvotes yet!</h3>
          </div>
        )}

        {/* Collections Tab */}
        {activeTab === 'Collections' && (
          <div className="py-20 text-center flex flex-col items-center justify-center">
            <span className="text-4xl mb-4">🐱</span>
            <h3 className="text-gray-900 font-medium">No collections yet!</h3>
          </div>
        )}

        {/* Stacks Tab */}
        {activeTab === 'Stacks' && (
          <div className="py-20 text-center flex flex-col items-center justify-center">
            <span className="text-4xl mb-4">🐱</span>
            <h3 className="text-gray-900 font-medium">You have not stacked any products yet.</h3>
            <p className="text-gray-500 text-sm mt-2">Stacks are a way to share the tools you use.</p>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'Reviews' && (
          <div className="py-20 text-center flex flex-col items-center justify-center">
            <h3 className="text-gray-500 font-medium">No reviews</h3>
          </div>
        )}

      </div>
    </div>
  );
};

export default UserProfile;
