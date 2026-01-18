import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import SafeImage from './SafeImage';
import { Loader2, Plus, Check } from 'lucide-react';
import { Profile } from '../types';

interface UserHoverCardProps {
    userId: string;
    username: string;
    children: React.ReactNode;
    align?: 'left' | 'right';
}

const UserHoverCard: React.FC<UserHoverCardProps> = ({ userId, username, children, align = 'left' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isFollowLoading, setIsFollowLoading] = useState(false);
    const [points, setPoints] = useState(0);

    let hoverTimeout: NodeJS.Timeout;

    const fetchProfileData = async () => {
        if (profile) return; // Already fetched
        setIsLoading(true);

        try {
            // Fetch current user
            const { data: { user } } = await supabase.auth.getUser();
            setCurrentUser(user);

            // Fetch Profile
            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (profileData) {
                setProfile(profileData);
            }

            // Fetch Points (Aggregate of products upvotes for now, or just a mock if expensive)
            // Using a simple count of products * 5 + comments * 1 as a "Maker Score" estimation
            const { count: productCount } = await supabase
                .from('products')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', userId);

            setPoints((productCount || 0) * 10); // Simple calculation for "points"

            // Check if following
            if (user) {
                const { data: followData } = await supabase
                    .from('follows')
                    .select('*')
                    .eq('follower_id', user.id)
                    .eq('following_id', userId)
                    .single();

                setIsFollowing(!!followData);
            }

        } catch (error) {
            console.error('Error fetching hover card data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleMouseEnter = () => {
        clearTimeout(hoverTimeout);
        setIsOpen(true);
        fetchProfileData();
    };

    const handleMouseLeave = () => {
        hoverTimeout = setTimeout(() => {
            setIsOpen(false);
        }, 300); // Small delay to allow moving mouse to the card
    };

    const toggleFollow = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!currentUser) return; // Should potentially prompt login

        setIsFollowLoading(true);
        try {
            if (isFollowing) {
                await supabase
                    .from('follows')
                    .delete()
                    .eq('follower_id', currentUser.id)
                    .eq('following_id', userId);
                setIsFollowing(false);
                if (profile) {
                    setProfile({ ...profile, followers_count: Math.max(0, (profile.followers_count || 0) - 1) });
                }
            } else {
                await supabase
                    .from('follows')
                    .insert({
                        follower_id: currentUser.id,
                        following_id: userId
                    });
                setIsFollowing(true);
                if (profile) {
                    setProfile({ ...profile, followers_count: (profile.followers_count || 0) + 1 });
                }
            }
        } catch (error) {
            console.error('Error toggling follow:', error);
        } finally {
            setIsFollowLoading(false);
        }
    };

    return (
        <div
            className="relative inline-block"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {children}

            {isOpen && (
                <div
                    className={`absolute z-50 bottom-full mb-2 ${align === 'left' ? 'left-0' : 'right-0'} w-[320px] bg-white rounded-2xl shadow-xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200`}
                    style={{ marginBottom: '10px' }}
                >
                    {isLoading ? (
                        <div className="p-8 flex justify-center">
                            <Loader2 className="w-6 h-6 animate-spin text-gray-300" />
                        </div>
                    ) : profile ? (
                        <div className="p-5 text-left">
                            {/* Header: Avatar & Name */}
                            <div className="flex items-start gap-4 mb-3">
                                <div className="w-14 h-14 rounded-full overflow-hidden border border-gray-100 shrink-0">
                                    <SafeImage src={profile.avatar_url} alt={profile.username} className="w-full h-full object-cover" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="font-bold text-gray-900 text-lg leading-tight truncate">{profile.username}</h3>
                                    {/* Assuming full_name isn't always there, fallback to username or hide */}
                                    <p className="text-gray-500 text-xs font-medium truncate mb-1">{profile.headline || 'Community Member'}</p>

                                    <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                                        <span className="flex items-center gap-1 text-[#ff6154]">
                                            <span className="w-4 h-4 rounded-full bg-[#ff6154] text-white flex items-center justify-center text-[10px] font-bold">K</span>
                                            {points} points
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Socials & Actions */}
                            <div className="flex items-center justify-between pt-2">
                                <div className="flex items-center gap-2">
                                    {/* Placeholder for social icons if needed, based on screenshot just showing stats/follow */}
                                    <span className="text-xs font-semibold text-gray-700">{profile.followers_count || 0} Followers</span>
                                </div>

                                {currentUser?.id !== userId && (
                                    <button
                                        onClick={toggleFollow}
                                        disabled={isFollowLoading}
                                        className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all flex items-center gap-1 ${isFollowing
                                                ? 'bg-transparent border border-gray-200 text-gray-500 hover:border-gray-300'
                                                : 'bg-primary text-white hover:bg-primary-dark shadow-md shadow-primary/20'
                                            }`}
                                    >
                                        {isFollowLoading ? (
                                            <Loader2 className="w-3 h-3 animate-spin" />
                                        ) : isFollowing ? (
                                            'Following'
                                        ) : (
                                            <>
                                                Follow
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="p-4 text-center text-gray-500 text-sm">User not found</div>
                    )}

                    {/* Arrow */}
                    <div className="absolute top-full left-6 -mt-px w-4 h-4 bg-white border-b border-r border-gray-100 transform rotate-45"></div>
                </div>
            )}
        </div>
    );
};

export default UserHoverCard;
