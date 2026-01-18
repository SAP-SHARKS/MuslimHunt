import React, { useState, useEffect } from 'react';
import { Twitter, Globe, Flame, MessageSquare, ChevronDown, Triangle, Linkedin, CheckCircle, Calendar, Award, Link as LinkIcon } from 'lucide-react';
import { Product, Profile, User } from '../types';
import ProductCard from './ProductCard';
import SafeImage from './SafeImage';
import { supabase } from '../lib/supabase';

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
  const [userProducts, setUserProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const isOwnProfile = currentUser?.id === profile.id;

  // Fetch user's products from Supabase
  useEffect(() => {
    const fetchUserProducts = async () => {
      setIsLoadingProducts(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('user_id', profile.id)
          .eq('is_approved', true)
          .order('created_at', { ascending: false });

        if (data && !error) {
          setUserProducts(data);
        }
      } catch (err) {
        console.error('Error fetching user products:', err);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    if (profile.id) {
      fetchUserProducts();
    }
  }, [profile.id]);

  // Also include products from props
  const makerHistory = [...userProducts, ...products.filter(p => p.user_id === profile.id && !userProducts.find(up => up.id === p.id))];

  const tabs = ['About', 'Forums', 'Activity', 'Upvotes', `${makerHistory.length} Hunted`, 'Collections', '1 Stack', 'Reviews'];

  // Format join date
  const formatJoinDate = (dateString?: string) => {
    if (!dateString) return 'January 2026';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header Section - Product Hunt Style */}
      <div className="max-w-5xl mx-auto px-4 pt-12 pb-4">
        <div className="flex flex-col md:flex-row items-start gap-6">

          {/* Avatar with badge */}
          <div className="shrink-0 relative">
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <SafeImage
                src={profile.avatar_url}
                alt={profile.username}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Verified badge */}
            {profile.is_verified && (
              <div className="absolute bottom-2 right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center border-2 border-white">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
            )}
          </div>

          {/* User Info & Actions */}
          <div className="flex-1 min-w-0 w-full">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">

              {/* Info */}
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {profile.full_name || profile.username}
                  </h1>
                  {profile.is_verified && (
                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-bold rounded">
                      Verified
                    </span>
                  )}
                </div>
                <p className="text-gray-500 mb-3 text-sm md:text-base">
                  {profile.headline || 'Community Member'}
                </p>

                {/* Stats Row - Product Hunt Style */}
                <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm text-gray-500 mb-4">
                  <span className="text-gray-400">#{profile.id.substring(0, 7).toUpperCase()}</span>
                  <span className="font-medium">0 followers</span>
                  <span className="font-medium">0 following</span>
                </div>

                {/* Points & Streak */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1.5 text-sm">
                    <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-orange-500 text-xs">🔥</span>
                    </div>
                    <span className="font-semibold text-gray-700">19 points</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm">
                    <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                    <span className="font-semibold text-orange-500">10 day streak</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {isOwnProfile ? (
                  <button
                    onClick={onEditProfile}
                    className="px-6 py-2.5 rounded-full border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors bg-white shadow-sm"
                  >
                    Edit my profile
                  </button>
                ) : (
                  <button className="px-6 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors shadow-sm">
                    Follow
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation - Product Hunt Style */}
      <div className="border-b border-gray-100 mt-6">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.includes('Hunted') ? 'Hunted' : tab.includes('Stack') ? 'Stacks' : tab)}
                className={`px-4 py-4 text-sm font-medium whitespace-nowrap transition-colors relative ${
                  (activeTab === tab ||
                   (activeTab === 'Hunted' && tab.includes('Hunted')) ||
                   (activeTab === 'Stacks' && tab.includes('Stack')))
                    ? 'text-gray-900'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {tab}
                {(activeTab === tab ||
                  (activeTab === 'Hunted' && tab.includes('Hunted')) ||
                  (activeTab === 'Stacks' && tab.includes('Stack'))) && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {activeTab === 'About' && (
          <div className="space-y-10">

            {/* About Section */}
            <section>
              <h3 className="text-base font-bold text-gray-900 mb-3">About</h3>
              {profile.bio ? (
                <p className="text-gray-600 leading-relaxed max-w-3xl text-[15px]">{profile.bio}</p>
              ) : (
                <p className="text-gray-500 text-sm">No bio added yet.</p>
              )}
            </section>

            {/* Links Section */}
            {(profile.twitter_url || profile.website_url || profile.linkedin_url) && (
              <section>
                <h3 className="text-base font-bold text-gray-900 mb-3">Links</h3>
                <div className="flex flex-wrap gap-3">
                  {profile.linkedin_url && (
                    <a
                      href={profile.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                    >
                      <Linkedin className="w-4 h-4" />
                      LinkedIn
                    </a>
                  )}
                  {profile.twitter_url && (
                    <a
                      href={profile.twitter_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-[#1DA1F2] hover:underline"
                    >
                      <Twitter className="w-4 h-4" />
                      Twitter
                    </a>
                  )}
                  {profile.website_url && (
                    <a
                      href={profile.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-gray-600 hover:underline"
                    >
                      <Globe className="w-4 h-4" />
                      Website
                    </a>
                  )}
                </div>
              </section>
            )}

            {/* Badges Section */}
            <section>
              <h3 className="text-base font-bold text-gray-900 mb-4">Badges</h3>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-3 bg-white border border-gray-200 px-4 py-3 rounded-xl">
                  <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center">
                    <Award className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Tastemaker</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white border border-gray-200 px-4 py-3 rounded-xl">
                  <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center relative">
                    <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
                    <span className="absolute -bottom-1 -right-1 text-[10px] font-bold bg-orange-500 text-white px-1 rounded">10</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Gone streaking 10</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white border border-gray-200 px-4 py-3 rounded-xl">
                  <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                    <Flame className="w-5 h-5 text-green-500 fill-green-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Gone streaking</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white border border-gray-200 px-4 py-3 rounded-xl">
                  <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center relative">
                    <Flame className="w-5 h-5 text-emerald-500 fill-emerald-500" />
                    <span className="absolute -bottom-1 -right-1 text-[10px] font-bold bg-emerald-500 text-white px-1 rounded">5</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Gone streaking 5</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Maker History Section */}
            <section>
              <h3 className="text-base font-bold text-gray-900 mb-4">Maker History</h3>
              {isLoadingProducts ? (
                <div className="space-y-4">
                  {[1, 2].map(i => (
                    <div key={i} className="animate-pulse flex items-center gap-4 p-4 border border-gray-100 rounded-xl">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                        <div className="h-3 bg-gray-100 rounded w-2/3"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : makerHistory.length > 0 ? (
                <div className="space-y-4">
                  {makerHistory.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => onProductClick(product)}
                      className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:border-gray-200 hover:shadow-sm transition-all cursor-pointer group"
                    >
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-100 shrink-0">
                        <SafeImage
                          src={product.logo_url}
                          alt={product.name}
                          seed={product.id}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                          {product.name}
                        </h4>
                        <p className="text-sm text-gray-500 truncate">{product.tagline}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm text-gray-400">
                          {new Date(product.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No products launched yet.</p>
              )}

              {/* Joined Date */}
              <div className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl mt-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">Joined Muslim Hunt</h4>
                  <p className="text-sm text-gray-500">{formatJoinDate(profile.created_at)}</p>
                </div>
              </div>
            </section>

            {/* Forums Section */}
            <section>
              <h3 className="text-base font-bold text-gray-900 mb-4">Forums</h3>
              <div className="space-y-4">
                <div className="p-4 border border-gray-100 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-primary font-medium">p/vibecoding</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-xs text-gray-400">{profile.username}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-xs text-gray-400">8d ago</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2 hover:text-primary cursor-pointer">
                    How do you usually clean up pasted AI text?
                  </h4>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    I use AI tools a lot for email and chat, and I keep running into the same annoying last-mile problem: pasted text comes in with odd fonts, spacing, or broken bullets...
                  </p>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1 text-sm text-gray-400">
                      <MessageSquare className="w-4 h-4" />
                      <span>1</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-400">
                      <Triangle className="w-4 h-4" />
                      <span>2</span>
                    </div>
                  </div>
                </div>
              </div>
              <button className="mt-4 w-full py-3 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                View more
              </button>
            </section>

          </div>
        )}

        {/* Forums Tab */}
        {activeTab === 'Forums' && (
          <div className="py-16 text-center flex flex-col items-center justify-center">
            <span className="text-5xl mb-4">🐱</span>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No discussions started yet.</h3>
            <p className="text-gray-500 text-sm">Start a discussion in the forums!</p>
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'Activity' && (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <button className="text-sm font-semibold text-gray-900 flex items-center gap-1 hover:text-gray-700 px-3 py-1.5 border border-gray-200 rounded-lg">
                All activity <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {makerHistory.length > 0 ? (
              <div className="grid gap-4">
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
              <div className="text-center py-16">
                <span className="text-5xl mb-4 block">🐱</span>
                <p className="text-gray-500">No activity yet</p>
              </div>
            )}
          </div>
        )}

        {/* Hunted Tab */}
        {activeTab === 'Hunted' && (
          <div>
            {makerHistory.length > 0 ? (
              <div className="grid gap-4">
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
              <div className="py-16 text-center">
                <span className="text-5xl mb-4 block">🐱</span>
                <h3 className="text-gray-900 font-medium">No products hunted yet!</h3>
              </div>
            )}
          </div>
        )}

        {/* Upvotes Tab */}
        {activeTab === 'Upvotes' && (
          <div className="py-16 text-center flex flex-col items-center justify-center">
            <span className="text-5xl mb-4">🐱</span>
            <h3 className="text-gray-900 font-medium">No upvotes yet!</h3>
          </div>
        )}

        {/* Collections Tab */}
        {activeTab === 'Collections' && (
          <div className="py-16 text-center flex flex-col items-center justify-center">
            <span className="text-5xl mb-4">🐱</span>
            <h3 className="text-gray-900 font-medium">No collections yet!</h3>
          </div>
        )}

        {/* Stacks Tab */}
        {activeTab === 'Stacks' && (
          <div className="py-16 text-center flex flex-col items-center justify-center">
            <span className="text-5xl mb-4">🐱</span>
            <h3 className="text-gray-900 font-medium">No stacks yet.</h3>
            <p className="text-gray-500 text-sm mt-2">Stacks are a way to share the tools you use.</p>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'Reviews' && (
          <div className="py-16 text-center flex flex-col items-center justify-center">
            <span className="text-5xl mb-4">🐱</span>
            <h3 className="text-gray-500 font-medium">No reviews yet</h3>
          </div>
        )}

      </div>

      {/* Report Link */}
      <div className="max-w-5xl mx-auto px-4 py-8 border-t border-gray-100">
        <button className="text-sm text-gray-400 hover:text-gray-600">Report</button>
      </div>
    </div>
  );
};

export default UserProfile;
