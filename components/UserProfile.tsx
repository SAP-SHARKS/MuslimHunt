
import React, { useState } from 'react';
import { 
  ArrowLeft, TrendingUp, Twitter, Globe, Calendar, Award, 
  MessageSquare, Heart, Sparkles, Settings, ChevronRight, 
  Share2, ShieldCheck, ArrowUpRight, Triangle 
} from 'lucide-react';
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
    { name: 'About', count: null },
    { name: 'Forums', count: 12 },
    { name: 'Activity', count: null },
    { name: 'Upvotes', count: votes.size },
    { name: 'Collections', count: 0 },
    { name: 'Stacks', count: 2 },
    { name: 'Reviews', count: 0 }
  ];

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-8 animate-in fade-in duration-500">
      {/* Header Breadcrumb */}
      <div className="flex items-center justify-between mb-12">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-emerald-800 transition-colors group font-black uppercase tracking-[0.2em] text-[10px]"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Home
        </button>
        <button className="p-2 text-gray-400 hover:text-emerald-800 transition-all active:scale-95">
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      {/* Hero Section */}
      <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl shrink-0 group">
          <img src={profile.avatar_url} alt={profile.username} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        </div>
        
        <div className="flex-1 min-w-0 pt-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-4xl font-serif font-bold text-gray-900 tracking-tight flex items-center gap-2">
                {profile.full_name || profile.username}
                {profile.is_admin && <ShieldCheck className="w-5 h-5 text-emerald-600" />}
              </h1>
              <div className="flex items-center gap-2 text-gray-400 font-bold mt-1">
                <span>@{profile.username}</span>
                <span className="text-gray-200">•</span>
                <span className="text-[11px] font-black uppercase tracking-widest text-emerald-800/40">#{profile.id.slice(0, 4)}</span>
              </div>
            </div>

            {isOwnProfile ? (
              <button 
                onClick={onEditClick}
                className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-200 rounded-xl font-bold text-sm text-gray-700 hover:bg-gray-50 hover:border-emerald-800 transition-all active:scale-95 shadow-sm"
              >
                <Settings className="w-4 h-4" />
                Edit my profile
              </button>
            ) : (
              <button className="px-8 py-2.5 bg-emerald-800 text-white rounded-xl font-black text-sm uppercase tracking-widest hover:bg-emerald-900 transition-all shadow-xl shadow-emerald-900/10 active:scale-95">
                Follow
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-6">
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

          {profile.headline && (
            <p className="text-gray-600 text-lg font-medium leading-snug max-w-2xl">
              {profile.headline}
            </p>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-100 mb-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
        <div className="flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`pb-4 text-[13px] font-black uppercase tracking-[0.15em] transition-all relative ${
                activeTab === tab.name ? 'text-emerald-900' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div className="flex items-center gap-2">
                {tab.name}
                {tab.count !== null && (
                  <span className={`px-1.5 py-0.5 rounded text-[10px] ${activeTab === tab.name ? 'bg-emerald-100 text-emerald-900' : 'bg-gray-50 text-gray-400'}`}>
                    {tab.count}
                  </span>
                )}
              </div>
              {activeTab === tab.name && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-800 rounded-t-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {activeTab === 'About' && (
            <section className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm mb-12">
                <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
                <p className="text-gray-500 leading-relaxed font-medium whitespace-pre-wrap">
                  {profile.bio || "Bismillah! This maker is on a journey of discovery within the Ummah. No bio provided yet."}
                </p>
                <div className="mt-8 pt-8 border-t border-gray-50 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {profile.twitter_url && (
                    <a href={profile.twitter_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-400 hover:text-emerald-800 transition-colors">
                      <Twitter className="w-5 h-5" />
                      <span className="text-sm font-bold">Twitter</span>
                    </a>
                  )}
                  {profile.website_url && (
                    <a href={profile.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-400 hover:text-emerald-800 transition-colors">
                      <Globe className="w-5 h-5" />
                      <span className="text-sm font-bold">Website</span>
                    </a>
                  )}
                  <div className="flex items-center gap-3 text-gray-400">
                    <Calendar className="w-5 h-5" />
                    <span className="text-sm font-bold">Joined May 2025</span>
                  </div>
                </div>
              </div>

              {makerHistory.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center justify-between">
                    Products Made
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{makerHistory.length}</span>
                  </h2>
                  <div className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-sm">
                    {makerHistory.map(p => (
                      <ProductCard 
                        key={p.id} product={p} onUpvote={onUpvote} 
                        hasUpvoted={votes.has(`${currentUser?.id}_${p.id}`)}
                        onClick={onProductClick} onCommentClick={onCommentClick}
                      />
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {activeTab !== 'About' && (
            <div className="py-20 text-center animate-in fade-in duration-300">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-serif font-bold text-gray-400 mb-2">Module is being polished</h3>
              <p className="text-gray-400 text-sm font-medium italic">Activity in {activeTab} will appear here soon.</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-8">
          <section className="bg-[#052e16] rounded-[2rem] p-8 text-white relative overflow-hidden group shadow-2xl">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform pointer-events-none">
              <Award className="w-24 h-24 text-emerald-400 rotate-12" />
            </div>
            <div className="relative z-10">
              <div className="inline-block px-2.5 py-1 bg-emerald-400 text-[#052e16] rounded-md text-[9px] font-black uppercase tracking-widest mb-6">MAKER STATUS</div>
              <h4 className="text-xl font-bold leading-relaxed mb-8">Active contributor to the global Halal tech ecosystem.</h4>
              <div className="flex items-center gap-4">
                <div className="bg-white/10 px-4 py-2 rounded-xl border border-white/10">
                  <p className="text-[10px] font-black text-emerald-300 uppercase tracking-widest mb-0.5">Rank</p>
                  <p className="font-bold">#241</p>
                </div>
                <div className="bg-white/10 px-4 py-2 rounded-xl border border-white/10">
                  <p className="text-[10px] font-black text-emerald-300 uppercase tracking-widest mb-0.5">Badges</p>
                  <p className="font-bold">12</p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm">
            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              TOP UPVOTES <Triangle className="w-3 h-3 fill-gray-400" />
            </h3>
            <div className="space-y-4">
              {products.slice(0, 3).map(p => (
                <div key={p.id} className="flex items-center gap-4 group cursor-pointer" onClick={() => onProductClick(p)}>
                  <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-50 shrink-0">
                    <img src={p.logo_url} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold text-gray-900 group-hover:text-emerald-800 transition-colors truncate">{p.name}</p>
                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-tighter">{p.upvotes_count} UPVOTES</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-2 text-[10px] font-black text-emerald-800 hover:underline uppercase tracking-widest">View all activity</button>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default UserProfile;
