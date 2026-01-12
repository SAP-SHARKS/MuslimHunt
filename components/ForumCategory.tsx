import React, { useEffect, useState } from 'react';
import { Triangle, MessageSquare, Clock, Filter, Plus } from 'lucide-react';
import { View, User, ForumCategory as IForumCategory } from '../types';
import { supabase } from '../lib/supabase';
import ForumSidebar from './ForumSidebar';
import ForumCategorySkeleton from './ForumCategorySkeleton';

interface Thread {
    id: string;
    title: string;
    slug: string;
    body: string;
    created_at: string;
    upvotes: number; // assuming simulated or from relation
    author_id: string; // we might need to join profile
    category_id: number;
    profiles?: {
        username: string;
        avatar_url: string;
        headline?: string;
    };
}

interface ForumCategoryProps {
    categorySlug: string;
    setView: (view: View, path?: string) => void;
    user: User | null;
    onSignIn: () => void;
    categories: IForumCategory[];
}

const ForumCategory: React.FC<ForumCategoryProps> = ({ categorySlug, setView, user, onSignIn, categories }) => {
    const [loading, setLoading] = useState(true);
    const [threads, setThreads] = useState<Thread[]>([]);
    const [currentCategory, setCurrentCategory] = useState<IForumCategory | null>(null);

    useEffect(() => {
        const fetchCategoryAndThreads = async () => {
            setLoading(true);
            try {
                // 1. Find category by slug (either from props or fetch if needed, utilizing passed categories for speed)
                let category = categories.find(c => c.slug === categorySlug);

                if (!category) {
                    // Fallback fetch if categories prop is empty or not found
                    const { data: catData } = await supabase
                        .from('forum_categories')
                        .select('*')
                        .eq('slug', categorySlug)
                        .single();
                    if (catData) category = catData;
                }

                if (category) {
                    setCurrentCategory(category);

                    // 2. Fetch threads
                    // Note: joining profiles using the relation if it exists, otherwise we might just get author_id
                    // Assuming 'profiles' table is related via author_id
                    const { data, error } = await supabase
                        .from('threads')
                        .select(`
              *,
              profiles:author_id (
                username,
                avatar_url,
                headline
              )
            `)
                        .eq('category_id', category.id)
                        .order('created_at', { ascending: false });

                    if (!error && data) {
                        setThreads(data as any); // Type assertion for profiles join
                    }
                }
            } catch (err) {
                console.error('Error fetching forum category:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCategoryAndThreads();
    }, [categorySlug, categories]);

    if (loading) return <ForumCategorySkeleton />;


    if (!currentCategory) return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Category not found</h2>
            <p className="text-gray-500">The forum category "p/{categorySlug}" does not exist.</p>
            <button onClick={() => setView(View.FORUM_HOME)} className="mt-6 text-emerald-600 font-bold hover:underline">
                Go back to Forums
            </button>
        </div>
    );

    return (
        <div className="space-y-6">
            <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 border-b border-emerald-50 pb-8">
                <div>
                    <div className="flex items-center gap-2 text-[#004D40] mb-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-emerald-100/50 px-2 py-1 rounded">p/{currentCategory.slug}</span>
                    </div>
                    <h1 className="text-4xl font-serif font-bold text-emerald-900 leading-none mb-2">{currentCategory.name}</h1>
                    <p className="text-gray-500 font-medium max-w-2xl">
                        Discussion, questions, and sharing for {currentCategory.name}.
                    </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    <button
                        onClick={() => user ? setView(View.NEW_THREAD) : onSignIn()}
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#004D40] text-white rounded-xl text-sm font-bold hover:bg-[#003d33] transition-all shadow-lg shadow-emerald-900/10 active:scale-95"
                    >
                        <Plus className="w-4 h-4" />
                        Start Discussion
                    </button>
                </div>
            </header>

            <div className="space-y-4">
                {threads.length === 0 ? (
                    <div className="py-20 text-center bg-white border border-gray-100 rounded-[2rem] border-dashed">
                        <MessageSquare className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-gray-900 mb-2">No threads yet</h3>
                        <p className="text-gray-500">Be the first to start a conversation in p/{currentCategory.slug}!</p>
                    </div>
                ) : (
                    threads.map((thread) => (
                        <div
                            key={thread.id}
                            className="group bg-white border border-gray-100 rounded-[2rem] p-5 sm:p-8 hover:border-emerald-200 hover:shadow-xl transition-all cursor-pointer"
                        // Add navigation to thread detail if needed in future
                        >
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-3 mb-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-100">
                                                {thread.profiles?.avatar_url ? (
                                                    <img src={thread.profiles.avatar_url} alt={thread.profiles.username} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full bg-emerald-100 flex items-center justify-center text-[10px] font-bold text-emerald-800">
                                                        {thread.profiles?.username?.[0] || 'A'}
                                                    </div>
                                                )}
                                            </div>
                                            <span className="text-[12px] font-bold text-gray-900 group-hover:text-[#004D40] transition-colors">
                                                {thread.profiles?.username || 'Anonymous'}
                                            </span>
                                            {thread.profiles?.headline && (
                                                <>
                                                    <span className="text-gray-300">•</span>
                                                    <span className="text-[12px] text-gray-400 truncate max-w-[150px]">{thread.profiles.headline}</span>
                                                </>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1 text-[10px] text-gray-300 font-bold ml-auto sm:ml-4">
                                            <Clock className="w-3 h-3" /> {new Date(thread.created_at).toLocaleDateString()}
                                        </div>
                                    </div>

                                    <h2 className="text-xl font-bold text-gray-900 group-hover:text-[#004D40] transition-colors mb-2 leading-tight">
                                        {thread.title}
                                    </h2>
                                    <p className="text-gray-500 text-[14px] line-clamp-2 leading-snug font-medium mb-4">
                                        {thread.body}
                                    </p>
                                </div>

                                <div className="flex sm:flex-col items-center gap-2 shrink-0">
                                    <div className="flex flex-col items-center justify-center min-w-[3rem] h-12 rounded-xl bg-gray-50 text-gray-400 group-hover:bg-emerald-50 group-hover:text-[#004D40] transition-all">
                                        <MessageSquare className="w-4 h-4 mb-0.5" />
                                        <span className="text-[11px] font-black">0</span> {/* Placeholder for comment count if not in table */}
                                    </div>
                                    <button className="flex flex-col items-center justify-center min-w-[3.5rem] h-14 rounded-xl border-2 border-gray-100 bg-white text-gray-400 hover:border-[#004D40] hover:text-[#004D40] transition-all active:scale-95 shadow-sm">
                                        <Triangle className="w-4 h-4 mb-0.5" />
                                        <span className="text-[12px] font-black">{thread.upvotes || 0}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ForumCategory;
