
import React, { useState } from 'react';
import { Home, MessageSquare, Search, Plus, Hash, Triangle, ChevronDown, Sparkles, Clock, Users, ArrowUpRight, TrendingUp } from 'lucide-react';
import { View } from '../types';

interface ForumHomeProps {
  setView: (view: View) => void;
  user: any;
}

const ForumHome: React.FC<ForumHomeProps> = ({ setView, user }) => {
  const [forumSearch, setForumSearch] = useState('');

  // Mock data for forum threads
  const threads = [
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
    },
    {
      id: 'f3',
      forum: 'p/ama',
      title: 'AMA: I am a CTO at a top Islamic FinTech firm. Ask me anything!',
      author: {
        name: 'Omar',
        avatar: 'https://i.pravatar.cc/150?u=u_3',
        headline: 'CTO @ HalalWealth'
      },
      preview: "Salaam everyone! I've been in the industry for 15 years. Happy to answer questions about scaling, compliance, or getting started in FinTech from a technical perspective.",
      upvotes: 310,
      comments: 42,
      created_at: '2025-05-09T15:00:00Z',
      online: 15
    },
    {
      id: 'f4',
      forum: 'p/show-and-tell',
      title: 'The future of Ethical AI in the Muslim world',
      author: {
        name: 'Zaid',
        avatar: 'https://i.pravatar.cc/150?u=u_4',
        headline: 'AI Ethics Researcher'
      },
      preview: "AI is moving fast. How do we ensure our algorithms respect our values? I've put together a manifesto for Ethical AI development and would love feedback from the community...",
      upvotes: 204,
      comments: 31,
      created_at: '2025-05-08T12:00:00Z',
      online: 5
    }
  ];

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 flex flex-col lg:flex-row gap-12">
      {/* Left Sidebar Navigation */}
      <aside className="hidden lg:block w-72 shrink-0 space-y-10 sticky top-24 h-fit">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search all threads..."
              value={forumSearch}
              onChange={(e) => setForumSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/10 focus:border-emerald-700 transition-all font-medium"
            />
          </div>

          <nav className="space-y-1">
            <button 
              onClick={() => setView(View.FORUM_HOME)}
              className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-black text-emerald-800 bg-emerald-50 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <Home className="w-4 h-4" /> Home
              </div>
            </button>
            <button className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-bold text-gray-500 hover:text-emerald-800 hover:bg-emerald-50 rounded-xl transition-all">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4" /> Recent comments
              </div>
            </button>
          </nav>

          <button 
            onClick={() => user ? setView(View.NEW_THREAD) : setView(View.LOGIN)}
            className="w-full flex items-center justify-center gap-2 bg-emerald-800 text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-900 transition-all shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4" /> Start new thread
          </button>
        </div>

        <section>
          <h3 className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Topic Forums</h3>
          <div className="space-y-1">
            {[
              { id: 'p/general', count: 124 },
              { id: 'p/vibecoding', count: 42 },
              { id: 'p/ama', count: 18 },
              { id: 'p/show-and-tell', count: 86 }
            ].map((forum) => (
              <button key={forum.id} className="w-full flex items-center justify-between px-4 py-2 text-sm font-bold text-gray-500 hover:text-emerald-800 hover:bg-emerald-50 rounded-xl transition-all group">
                <div className="flex items-center gap-3">
                  <Hash className="w-3.5 h-3.5 opacity-50" /> {forum.id}
                </div>
                <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity font-black bg-emerald-100 px-1.5 py-0.5 rounded text-emerald-800">
                  {forum.count}
                </span>
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Product Forums</h3>
          <div className="space-y-1">
            {['QuranFlow', 'HalalWallet', 'ArabicHero'].map((product) => (
              <button key={product} className="w-full flex items-center gap-3 px-4 py-2 text-sm font-bold text-gray-500 hover:text-emerald-800 hover:bg-emerald-50 rounded-xl transition-all">
                <div className="w-5 h-5 rounded-md bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[10px] text-emerald-800">
                  {product[0]}
                </div>
                {product}
              </button>
            ))}
          </div>
        </section>

        <div className="p-6 bg-emerald-800 rounded-[2rem] text-white">
          <p className="text-xs font-black uppercase tracking-widest text-emerald-300 mb-2">Ummah Voice</p>
          <p className="text-sm font-bold leading-relaxed">Join 12,000+ Muslim builders shaping the future of Halal tech.</p>
          <button className="mt-4 flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:underline">
            View Guidelines <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </aside>

      {/* Main Forum Feed */}
      <main className="flex-1 space-y-8">
        <header className="flex items-end justify-between mb-8 border-b border-emerald-50 pb-8">
          <div>
            <div className="flex items-center gap-2 text-emerald-800 mb-2">
              <TrendingUp className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Live Community</span>
            </div>
            <h1 className="text-4xl font-serif font-bold text-emerald-900 leading-none">Community</h1>
          </div>
          <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
              Trending <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </header>

        <div className="space-y-4">
          {threads.map((thread) => (
            <div 
              key={thread.id} 
              className="group bg-white border border-gray-100 rounded-[2rem] p-6 sm:p-8 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-900/5 transition-all cursor-pointer"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-8">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded-lg">
                      {thread.forum}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full overflow-hidden border-2 border-emerald-50 shadow-sm">
                        <img src={thread.author.avatar} alt={thread.author.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col -space-y-0.5">
                        <span className="text-xs font-bold text-gray-900 hover:text-emerald-800 transition-colors">
                          {thread.author.name}
                        </span>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">
                          {thread.author.headline}
                        </span>
                      </div>
                    </div>
                    {thread.is_pinned && (
                      <span className="flex items-center gap-1.5 text-[9px] font-black text-white uppercase tracking-widest bg-emerald-800 px-2.5 py-1 rounded-lg">
                        <Sparkles className="w-3 h-3 fill-emerald-300 text-emerald-300" /> Pinned
                      </span>
                    )}
                    <div className="flex items-center gap-4 text-[10px] font-bold text-gray-300 uppercase tracking-tighter ml-auto sm:ml-0">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {formatTime(thread.created_at)}
                      </div>
                      <div className="flex items-center gap-1 text-emerald-600/70">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        {thread.online} online
                      </div>
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900 group-hover:text-emerald-800 transition-colors mb-3 leading-tight tracking-tight">
                    {thread.title}
                  </h2>
                  <p className="text-gray-500 text-base line-clamp-2 leading-relaxed font-medium">
                    {thread.preview}
                  </p>
                </div>

                <div className="flex sm:flex-col items-center gap-3 sm:shrink-0 pt-2">
                  <div className="flex flex-col items-center justify-center min-w-[4rem] h-16 rounded-2xl border border-gray-50 bg-gray-50/30 text-gray-400 group-hover:bg-white group-hover:border-emerald-50 transition-all">
                    <MessageSquare className="w-5 h-5 mb-0.5" />
                    <span className="text-xs font-black">{thread.comments}</span>
                  </div>
                  <button className="flex flex-col items-center justify-center min-w-[4rem] h-16 rounded-2xl border-2 border-gray-100 bg-white text-gray-400 hover:border-emerald-800 hover:text-emerald-800 transition-all active:scale-95 shadow-sm hover:shadow-md">
                    <Triangle className="w-4 h-4 mb-0.5" />
                    <span className="text-xs font-black">{thread.upvotes}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          <div className="py-12 text-center">
            <button className="px-8 py-3 bg-white border border-gray-100 rounded-full text-sm font-bold text-gray-500 hover:text-emerald-800 hover:border-emerald-800 transition-all shadow-sm">
              Load more discussions
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ForumHome;
