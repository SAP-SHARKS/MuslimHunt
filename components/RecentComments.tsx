
import React, { useState, useRef } from 'react';
import { Home, MessageSquare, Search, Plus, Hash, Sparkles, Clock, ArrowUpRight } from 'lucide-react';
import { View, Comment } from '../types';

interface RecentCommentsProps {
  setView: (view: View) => void;
  user: any;
  onViewProfile: (userId: string) => void;
}

const RecentComments: React.FC<RecentCommentsProps> = ({ setView, user, onViewProfile }) => {
  const [forumSearch, setForumSearch] = useState('');
  const [hoveredCommentId, setHoveredCommentId] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<number | null>(null);

  // Mock data for recent forum comments
  const recentComments = [
    {
      id: 'rc1',
      forum: 'p/vibecoding',
      threadTitle: 'Which tech stack is best for Halal e-commerce in 2025?',
      author: {
        id: 'u_10',
        name: 'Pasindu (Riggz)',
        avatar: 'https://i.pravatar.cc/150?u=u_10',
        headline: 'HalalTech Enthusiast'
      },
      text: "@bobbydesign can't imagine what we will have after year or two. The scalability of Next.js combined with the local-first capabilities of Supabase is definitely the way forward for our ecosystem.",
      created_at: '2025-05-10T14:43:00Z'
    },
    {
      id: 'rc2',
      forum: 'p/general',
      threadTitle: 'Building in Public: My journey from 0 to 100 users',
      author: {
        id: 'u_5',
        name: 'Sarah K.',
        avatar: 'https://i.pravatar.cc/150?u=u_5',
        headline: 'Indie Maker'
      },
      text: "Consistency is truly the key. I noticed that when I stopped posting updates for a week, my engagement dropped by almost 40%. Keep going!",
      created_at: '2025-05-10T13:20:00Z'
    },
    {
      id: 'rc3',
      forum: 'p/ama',
      threadTitle: 'AMA: I am a CTO at a top Islamic FinTech firm. Ask me anything!',
      author: {
        id: 'u_8',
        name: 'Omar Farooq',
        avatar: 'https://i.pravatar.cc/150?u=u_8',
        headline: 'Full-stack Architect'
      },
      text: "How do you handle cross-border Shariah compliance when dealing with multiple jurisdictions? It seems like a massive technical overhead.",
      created_at: '2025-05-10T12:05:00Z'
    }
  ];

  const formatTimeAgo = (dateStr: string) => {
    const now = new Date();
    const past = new Date(dateStr);
    const diffInMinutes = Math.floor((now.getTime() - past.getTime()) / 60000);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return past.toLocaleDateString();
  };

  const handleMouseEnter = (commentId: string) => {
    if (hoverTimeoutRef.current) window.clearTimeout(hoverTimeoutRef.current);
    setHoveredCommentId(commentId);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = window.setTimeout(() => {
      setHoveredCommentId(null);
    }, 300);
  };

  const UserHoverCard = ({ comment }: { comment: any }) => (
    <div 
      className="absolute bottom-full left-0 mb-4 w-72 bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[1.5rem] p-6 z-50 animate-in fade-in zoom-in-95 duration-200 cursor-default"
      onMouseEnter={() => handleMouseEnter(comment.id)}
      onMouseLeave={handleMouseLeave}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-emerald-50 shrink-0 shadow-sm">
          <img src={comment.author.avatar} alt={comment.author.name} className="w-full h-full object-cover" />
        </div>
        <div>
          <h4 className="font-bold text-gray-900 text-lg leading-tight">{comment.author.name}</h4>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[10px] px-1.5 py-0.5 bg-emerald-50 text-emerald-800 rounded font-black uppercase tracking-wider">
              Contributor
            </span>
            <Sparkles className="w-3 h-3 text-emerald-500" />
          </div>
        </div>
      </div>
      
      <p className="text-gray-500 text-sm leading-relaxed mb-6 font-medium">
        Active builder in the Muslim tech community. {comment.author.headline}.
      </p>

      <div className="grid grid-cols-2 gap-4 mb-6 pt-6 border-t border-gray-50">
        <div className="text-center">
          <p className="font-black text-gray-900 text-lg leading-none">245</p>
          <p className="text-[10px] uppercase font-bold text-gray-400 mt-1 tracking-tighter">Activity</p>
        </div>
        <div className="text-center border-l border-gray-50">
          <p className="font-black text-gray-900 text-lg leading-none">120</p>
          <p className="text-[10px] uppercase font-bold text-gray-400 mt-1 tracking-tighter">Points</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button 
          onClick={() => onViewProfile(comment.author.id)}
          className="flex-1 py-2.5 bg-emerald-800 text-white rounded-xl font-bold text-sm hover:bg-emerald-900 transition-all active:scale-[0.98]"
        >
          View Profile
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 flex flex-col lg:flex-row gap-12">
      {/* Left Sidebar Navigation */}
      <aside className="hidden lg:block w-72 shrink-0 space-y-10 sticky top-24 h-fit">
        <div className="space-y-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-emerald-800 transition-colors" />
            <input 
              type="text" 
              placeholder="Search all threads..."
              value={forumSearch}
              onChange={(e) => setForumSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/10 focus:border-emerald-700 transition-all font-bold placeholder:text-gray-300 shadow-sm"
            />
          </div>

          <nav className="space-y-1">
            <button 
              onClick={() => setView(View.FORUM_HOME)}
              className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-bold text-gray-500 hover:text-emerald-800 hover:bg-emerald-50 rounded-xl transition-all"
            >
              <div className="flex items-center gap-3">
                <Home className="w-4 h-4" /> Home
              </div>
            </button>
            <button 
              onClick={() => setView(View.RECENT_COMMENTS)}
              className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-black text-emerald-800 bg-emerald-50 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4" /> Recent comments
              </div>
            </button>
          </nav>

          <button 
            onClick={() => user ? setView(View.NEW_THREAD) : setView(View.LOGIN)}
            className="w-full flex items-center justify-center gap-2 bg-emerald-800 text-white py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-900 transition-all shadow-lg active:scale-95"
          >
            <Plus className="w-4 h-4" /> Start new thread
          </button>
        </div>

        <section>
          <h3 className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Topic Forums</h3>
          <div className="space-y-1">
            {['p/general', 'p/vibecoding', 'p/ama', 'p/show-and-tell'].map((fid) => (
              <button key={fid} className="w-full flex items-center justify-between px-4 py-2 text-[13px] font-bold text-gray-500 hover:text-emerald-800 hover:bg-emerald-50 rounded-xl transition-all">
                <div className="flex items-center gap-3">
                  <Hash className="w-3.5 h-3.5 opacity-50" /> {fid}
                </div>
              </button>
            ))}
          </div>
        </section>
      </aside>

      {/* Main Recent Comments Feed */}
      <main className="flex-1 space-y-8">
        <header className="mb-12 border-b border-emerald-50 pb-8">
          <div>
            <div className="flex items-center gap-2 text-emerald-800 mb-2">
              <MessageSquare className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Live Interactions</span>
            </div>
            <h1 className="text-4xl font-serif font-bold text-emerald-900 leading-none">Recent Comments</h1>
          </div>
        </header>

        <div className="space-y-4">
          {recentComments.map((comment) => {
            const isHovered = hoveredCommentId === comment.id;
            return (
              <div 
                key={comment.id} 
                className="group bg-white border border-gray-100 rounded-[2.5rem] p-6 sm:p-8 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-900/5 transition-all cursor-pointer"
              >
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
                    <span className="text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {formatTimeAgo(comment.created_at)}
                    </span>
                    <span className="text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {comment.forum}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 group-hover:text-emerald-800 transition-colors leading-tight">
                    {comment.threadTitle}
                  </h2>

                  <div className="flex items-start gap-4 pt-2">
                    <div 
                      className="relative"
                      onMouseEnter={() => handleMouseEnter(comment.id)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <button 
                        className="w-10 h-10 rounded-xl overflow-hidden border border-emerald-50 shrink-0"
                        onClick={(e) => { e.stopPropagation(); onViewProfile(comment.author.id); }}
                      >
                        <img src={comment.author.avatar} alt={comment.author.name} className="w-full h-full object-cover" />
                      </button>
                      {isHovered && <UserHoverCard comment={comment} />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-gray-600 text-[15px] leading-relaxed line-clamp-2">
                        <span className="font-bold text-gray-900 mr-1">{comment.author.name}:</span>
                        {comment.text}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="py-12 text-center">
          <button className="px-8 py-3 bg-white border border-gray-100 rounded-full text-sm font-bold text-gray-500 hover:text-emerald-800 hover:border-emerald-800 transition-all shadow-sm">
            Load older comments
          </button>
        </div>
      </main>
    </div>
  );
};

export default RecentComments;
