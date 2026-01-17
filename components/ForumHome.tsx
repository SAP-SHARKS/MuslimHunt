
import React, { useState, useEffect } from 'react';
import { Triangle, ChevronDown, Sparkles, Clock, MessageSquare, Filter, Loader2 } from 'lucide-react';
import { View } from '../types';
import { supabase } from '../lib/supabase';

interface ForumHomeProps {
  setView: (view: View) => void;
  user: any;
  onSignIn: () => void;
}

interface Thread {
  id: string;
  title: string;
  body: string;
  slug: string;
  category_id: number;
  author_id: string;
  created_at: string;
  is_approved: boolean;
  upvotes: number;
  profiles?: {
    username: string;
    avatar_url: string;
    headline?: string;
  };
  forum_categories?: {
    name: string;
    slug: string;
  };
  image_url?: string;
  is_pinned?: boolean;
}

const ForumHome: React.FC<ForumHomeProps> = ({ setView, user, onSignIn }) => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const { data, error } = await supabase
          .from('threads')
          .select(`
            *,
            profiles:author_id (username, avatar_url, headline),
            forum_categories:category_id (name, slug)
          `)
          .eq('is_approved', true)
          .order('created_at', { ascending: false })
          .limit(20);

        if (error) throw error;
        setThreads(data || []);
      } catch (err) {
        console.error('Error fetching threads:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchThreads();
  }, []);

  const fallbackThreads = [
    {
      id: 'f1',
      forum: 'p/general',
      title: 'Building in Public: My journey from 0 to 100 users',
      author: {
        name: 'Ahmed',
        avatar: 'https://i.pravatar.cc/150?u=u_1',
        headline: 'Maker of QuranFlow'
      },
      preview: "I started this journey three months ago with just a simple idea to help the Ummah track their Zakat more efficiently. Here's what I learned about consistency and community feedback...",
      image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
      upvotes: 156,
      comments: 24,
      created_at: '2025-05-10T10:00:00Z',
      online: 8,
      is_pinned: true
    },
    {
      id: 'f2',
      forum: 'p/vibecoding',
      title: 'Which tech stack is best for Halal e-commerce in 2025?',
      author: {
        name: 'Sara',
        avatar: 'https://i.pravatar.cc/150?u=u_2',
        headline: 'Full-stack Dev'
      },
      preview: "We're looking to rebuild our marketplace. Currently debating between Next.js/Supabase and a more traditional Laravel approach. What are your thoughts on Shariah-compliant payment gateways?",
      upvotes: 92,
      comments: 18,
      created_at: '2025-05-10T09:30:00Z',
      online: 12
    }
  ];

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const displayThreads = threads.length > 0 ? threads : fallbackThreads;

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between mb-8 border-b border-emerald-50 pb-8">
        <div>
          <div className="flex items-center gap-2 text-[#004D40] mb-2">
            <Sparkles className="w-4 h-4 fill-[#004D40]" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Community Feed</span>
          </div>
          <h1 className="text-4xl font-serif font-bold text-primary leading-none">Discussions</h1>
        </div>
        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
            <Filter className="w-4 h-4 text-gray-400" />
            Trending <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </header>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
      ) : threads.length === 0 ? (
        <div className="text-center py-20 bg-white border border-gray-100 rounded-[2rem] border-dashed">
          <MessageSquare className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">No discussions yet</h3>
          <p className="text-gray-500 mb-6">Be the first to start a conversation!</p>
          <button
            onClick={() => user ? setView(View.NEW_THREAD) : onSignIn()}
            className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all"
          >
            Start Discussion
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {threads.map((thread) => (
          <div
            key={thread.id}
            className="group bg-white border border-gray-100 rounded-[2rem] p-5 sm:p-8 hover:border-primary-light hover:shadow-xl transition-all cursor-pointer"
            onClick={() => setView(View.FORUM_THREAD, `/p/${thread.forum_categories?.slug || 'general'}/${thread.slug}`)}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="text-[10px] font-black text-[#004D40] uppercase tracking-[0.15em] bg-primary-light px-2 py-0.5 rounded-md">
                    p/{thread.forum_categories?.slug || 'general'}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full overflow-hidden">
                      <img
                        src={thread.profiles?.avatar_url || `https://i.pravatar.cc/150?u=${thread.author_id}`}
                        alt={thread.profiles?.username || 'User'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-[12px] font-bold text-gray-900 group-hover:text-[#004D40] transition-colors">
                      {thread.profiles?.username || 'Anonymous'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-gray-300 font-bold ml-auto sm:ml-4">
                    <Clock className="w-3 h-3" /> {formatTime(thread.created_at)}
                  </div>
                </div>

                <h2 className="text-xl font-bold text-gray-900 group-hover:text-[#004D40] transition-colors mb-2 leading-tight">
                  {thread.title}
                </h2>
                <p className="text-gray-500 text-[14px] line-clamp-2 leading-snug font-medium mb-4">
                  {stripHtml(thread.body).substring(0, 200)}...
                </p>

                {thread.image_url && (
                  <div className="mb-4 rounded-xl overflow-hidden border border-gray-100 shadow-sm bg-gray-50 max-h-[300px]">
                    <img src={thread.image_url} alt={thread.title} className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="flex sm:flex-col items-center gap-2 shrink-0">
                <div className="flex flex-col items-center justify-center min-w-[3rem] h-12 rounded-xl bg-gray-50 text-gray-400 group-hover:bg-primary-light group-hover:text-[#004D40] transition-all">
                  <MessageSquare className="w-4 h-4 mb-0.5" />
                  <span className="text-[11px] font-black">0</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle upvote
                  }}
                  className="flex flex-col items-center justify-center min-w-[3.5rem] h-14 rounded-xl border-2 border-gray-100 bg-white text-gray-400 hover:border-[#004D40] hover:text-[#004D40] transition-all active:scale-95 shadow-sm"
                >
                  <Triangle className="w-4 h-4 mb-0.5" />
                  <span className="text-[12px] font-black">{thread.upvotes || 0}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
};

export default ForumHome;
