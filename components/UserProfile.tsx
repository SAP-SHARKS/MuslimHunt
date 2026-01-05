
import React, { useState } from 'react';
import { 
  ArrowLeft, Twitter, Globe, Calendar, Award, 
  MessageSquare, Settings, Share2, ShieldCheck, Triangle, Sparkles, Plus 
} from 'lucide-react';
import { Product, Profile, User } from '../types';
import ProductCard from './ProductCard';
import SafeImage from './SafeImage.tsx';

interface UserProfileProps {
  profile: Profile;
  currentUser: User | null;
  products: Product[];
  votes: Set<string>;
  onBack: () => void;
  onProductClick: (product: Product) => void;
  onCommentClick: (product: Product) => void;
  onUpvote: (productId: string) => void;
  onEditClick: () => void;
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
  const [activeTab, setActiveTab] = useState('About');
  const makerHistory = products.filter(p => p.user_id === profile.id);
  const totalKarma = makerHistory.reduce((acc, p) => acc + (p.upvotes_count || 0), 0);
  const isOwnProfile = currentUser?.id === profile.id;

  const tabs = [
    'About', 'Forums', 'Activity', 'Upvotes', 'Collections', 'Stacks', 'Reviews'
  ];

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 sm:px-8 animate-in fade-in duration-500">
      {/* Breadcrumbs */}
      <div className="flex items-center justify-between mb-12">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-emerald-800 transition-colors group font-black uppercase tracking-[0.2em] text-[10px]"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Discovery Feed
        </button>
        <div className="flex items-center gap-3">
          <button className="p-2.5 text-gray-400 hover:text-emerald-800 hover:bg-white rounded-full border border-transparent hover:border-gray-100 transition-all active:scale-95">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Product Hunt Style Header */}
      <div className="flex flex-col md:flex-row gap-10 items-start mb-16 relative">
        <div className="w-40 h-40 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl shrink-0 group relative z-10">
          <SafeImage 
            src={profile.avatar_url} 
            alt={profile.username} 
            seed={profile.username}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
          />
        </div>
        
        <div className="flex-1 min-w-0 pt-2">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
            <div className="space-y-1">
              <h1 className="text-5xl font-serif font-bold text-gray-900 tracking-tight flex items-center gap-3">
                {profile.username}
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
              </h1>
              <div className="flex items-center gap-2 text-gray-400 font-bold">
                <span className="text-[13px]">@{profile.username}</span>
                <span className="text-gray-200">•</span>
                <span className="text-[11px] font-black uppercase tracking-widest text-emerald-800/40">#{profile.id.slice(0, 4)}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {isOwnProfile ? (
                <button 
                  onClick={onEditClick}
                  className="flex items-center gap-2 px-8 py-3 bg-white border border-gray-200 rounded-full font-black text-xs uppercase tracking-widest text-gray-700 hover:bg-gray-50 hover:border-emerald-800 transition-all active:scale-95 shadow-sm"
                >
                  <Settings className="w-4 h-4" />
                  Edit my profile
                </button>
              ) : (
                <button className="px-10 py-3 bg-emerald-800 text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-emerald-900 transition-all shadow-xl shadow-emerald-900/10 active:scale-95">
                  Follow
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-2 mb-8 border-y border-gray-50 py-4">
            <div className="flex items-center gap-2">
              <span className="font-black text-gray-900">1.2K</span>
              <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Followers</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-black text-gray-900">420</span>
              <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Following</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-black text-gray-900">{totalKarma}</span>
              <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Points</span>
            </div>
          </div>

          <div className="max-w-2xl">
            <p className="text-xl text-gray-900 font-bold mb-2">{profile.headline || 'Halal-conscious Builder'}</p>
            <p className="text-gray-500 leading-relaxed font-medium">
              {profile.bio || "Bismillah! This maker hasn't shared their story yet."}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-100 mb-12 sticky top-[4.1rem] bg-[#fdfcf0]/80 backdrop-blur-md z-40">
        <div className="flex gap-10 overflow-x-auto whitespace-nowrap scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-5 text-[13px] font-black uppercase tracking-[0.2em] transition-all relative ${
                activeTab === tab ? 'text-emerald-900' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-800 rounded-t-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-12">
          {activeTab === 'About' && (
            <section className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-12">
              {makerHistory.length > 0 ? (
                <div>
                  <h2 className="text-2xl font-serif font-bold text-gray-900 mb-8 flex items-center justify-between">
                    Products Made
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">({makerHistory.length})</span>
                  </h2>
                  <div className="bg-white border border-gray-100 rounded-[3rem] overflow-hidden shadow-sm">
                    {makerHistory.map(p => (
                      <ProductCard 
                        key={p.id} product={p} onUpvote={onUpvote} 
                        hasUpvoted={votes.has(`${currentUser?.id}_${p.id}`)}
                        onClick={onProductClick} onCommentClick={onCommentClick}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-dashed border-gray-200 rounded-[3rem] p-24 text-center">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="w-10 h-10 text-gray-200" />
                  </div>
                  <p className="text-gray-400 font-bold italic">No products launched yet. The next big thing starts with Bismillah.</p>
                </div>
              )}
            </section>
          )}

          {activeTab !== 'About' && (
            <div className="py-24 text-center animate-in fade-in duration-300">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-800 shadow-inner">
                <Triangle className="w-8 h-8 rotate-180" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">Module Optimization</h3>
              <p className="text-gray-400 font-medium">Detailed activity for <span className="text-emerald-800 font-black uppercase tracking-widest text-xs px-2 py-1 bg-emerald-50 rounded">{activeTab}</span> is coming soon.</p>
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <aside className="space-y-10">
          <section className="bg-emerald-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group shadow-2xl">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform pointer-events-none">
              <Award className="w-32 h-32 text-emerald-400 rotate-12" />
            </div>
            <div className="relative z-10">
              <div className="inline-block px-3 py-1 bg-emerald-400 text-emerald-900 rounded-md text-[10px] font-black uppercase tracking-widest mb-8">BADGE PROGRESS</div>
              <h4 className="text-2xl font-serif font-bold leading-tight mb-10">Active member of the Global Ummah Tech ecosystem.</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                  <p className="text-[10px] font-black text-emerald-300 uppercase tracking-widest mb-1">BADGES</p>
                  <p className="text-xl font-bold">12</p>
                </div>
                <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                  <p className="text-[10px] font-black text-emerald-300 uppercase tracking-widest mb-1">STREAK</p>
                  <p className="text-xl font-bold">42d</p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white border border-gray-100 rounded-[2.5rem] p-10 shadow-sm">
            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
              PROFESSIONAL LINKS
            </h3>
            <div className="space-y-6">
              {profile.website_url && (
                <a href={profile.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-gray-500 hover:text-emerald-800 transition-colors group">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-emerald-50 transition-colors"><Globe className="w-4 h-4" /></div>
                  <span className="text-sm font-bold">Portfolio</span>
                </a>
              )}
              {profile.twitter_url && (
                <a href={profile.twitter_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-gray-500 hover:text-emerald-800 transition-colors group">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-emerald-50 transition-colors"><Twitter className="w-4 h-4" /></div>
                  <span className="text-sm font-bold">Twitter</span>
                </a>
              )}
              <div className="flex items-center gap-4 text-gray-400">
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center"><Calendar className="w-4 h-4" /></div>
                <span className="text-sm font-bold">Joined May 2025</span>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default UserProfile;
