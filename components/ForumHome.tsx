
import React, { useState } from 'react';
import { Home, MessageSquare, Search, PlusSquare, Hash, Triangle, ChevronDown, Sparkles, Clock, ArrowUpRight, Filter } from 'lucide-react';
import { View } from '../types';
import { TrendingSidebar } from '../App';

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

  const TOPIC_FORUMS = [
    'p/general', 'p/vibecoding', 'p/ama', 'p/introduce-yourself', 'p/self-promotion'
  ];

  const SidebarLink = ({ icon: Icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick: () => void }) => (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-xl ${
        active 
        ? 'text-emerald-800 bg-emerald-50 font-bold' 
        : 'text-gray-500 hover:text-emerald-800 hover:bg-emerald-50'
      }`}
    >
      <Icon className={`w-4 h-4 ${active ? 'text-emerald-800' : 'text-gray-400 opacity-70'}`} />
      {label}
    </button>
  );

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 flex flex-col lg:flex-row gap-8">
      {/* Left Sidebar Navigation - Consistent with NewThreadForm */}
      <aside className="hidden lg:block w-72 shrink-0 space-y-10 sticky top-24 h-fit max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar pr-2">
        <div className="space-y-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-emerald-800 transition-colors" />
            <input 
              type="text" 
              placeholder="Search all threads..."
              value={forumSearch}
              onChange={(e) => setForumSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-900/5 focus:border-emerald-800 transition-all font-bold placeholder:text-gray-300 shadow-sm"
            />
          </div>

          <nav className="space-y-1">
            <SidebarLink icon={Home} label="Home" active={true} onClick={() => setView(View.FORUM_HOME)} />
            <SidebarLink icon={MessageSquare} label="Recent comments" onClick={() => setView(View.RECENT_COMMENTS)} />
            <SidebarLink icon={Search} label="Search all threads" onClick={() => {}} />
            <SidebarLink icon={PlusSquare} label="Start new thread" onClick={() => user ? setView(View.NEW_THREAD) : setView(View.LOGIN)} />
          </nav>
        </div>

        <section>
          <h3 className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Topic Forums</h3>
          <div className="space-y-0.5">
            {TOPIC_FORUMS.map((fid) => (
              <button 
                key={fid} 
                className="w-full flex items-center gap-3 px-4 py-2 text-[13px] font-bold text-gray-500 hover:text-emerald-800 hover:bg-emerald-50 rounded-xl transition-all"
              >
                <Hash className="w-3.5 h-3.5 opacity-40" /> 
                <span className="truncate">{fid}</span>
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Product Forums</h3>
          <div className="space-y-0.5">
            {['QuranFlow', 'HalalWallet', 'ArabicHero'].map((product) => (
              <button key={product} className="w-full flex items-center gap-3 px-4 py-2 text-[13px] font-bold text-gray-500 hover:text-emerald-800 hover:bg-emerald-50 rounded-xl transition-all">
                <div className="w-5 h-5 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[9px] font-black text-emerald-800 uppercase shadow-sm">
                  {product[0]}
                </div>
                {product}
              </button>
            ))}
          </div>
        </section>

        <div className="p-8 bg-emerald-900 rounded-[2rem] text-white shadow-xl shadow-emerald-900/10 relative overflow-hidden">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-emerald-800 rounded-full blur-2xl opacity-50" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 mb-3 relative z-10">Ummah Voice</p>
          <p className="text-sm font-bold leading-relaxed relative z-10">Join 12,000+ Muslim builders shaping the future of Halal tech.</p>
          <button className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:underline text-emerald-300 relative z-10">
            View Guidelines <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </aside>

      {/* Main Forum Feed - High-Density central column */}
      <main className="flex-1 space-y-6">
        <header className="flex items-center justify-between mb-8 border-b border-emerald-50 pb-8">
          <div>
            <div className="flex items-center gap-2 text-emerald-800 mb-2">
              <Sparkles className="w-4 h-4 fill-emerald-800" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Community Feed</span>
            </div>
            <h1 className="text-4xl font-serif font-bold text-emerald-900 leading-none">Discussions</h1>
          </div>
          <div className="flex items-center gap-3">
             <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-black uppercase tracking-tighter">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               42 Makers Online
             </div>
             <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-xl text-sm font-black text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
              <Filter className="w-4 h-4 text-gray-400" />
              Trending <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </header>

        <div className="space-y-4">
          {threads.map((thread) => (
            <div 
              key={thread.id} 
              className="group bg-white border border-gray-100 rounded-[2.5rem] p-6 sm:p-10 hover:border-emerald-200 hover:shadow-2xl hover:shadow-emerald-900/5 transition-all cursor-pointer"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-8">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-4 mb-5">
                    <span className="text-[10px] font-black text-emerald-800 uppercase tracking-[0.15em] bg-emerald-50 px-2.5 py-1 rounded-lg">
                      {thread.forum}
                    </span>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-emerald-50 shadow-sm ring-2 ring-transparent group-hover:ring-emerald-100 transition-all">
                        <img src={thread.author.avatar} alt={thread.author.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[13px] font-bold text-gray-900 group-hover:text-emerald-800 transition-colors leading-none">
                          {thread.author.name}
                        </span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-0.5">
                          {thread.author.headline}
                        </span>
                      </div>
                    </div>
                    {thread.is_pinned && (
                      <span className="flex items-center gap-1.5 text-[9px] font-black text-white uppercase tracking-widest bg-emerald-800 px-2.5 py-1 rounded-lg shadow-sm shadow-emerald-900/20">
                        <Sparkles className="w-3 h-3 fill-emerald-300 text-emerald-300" /> Pinned
                      </span>
                    )}
                    <div className="flex items-center gap-4 text-[11px] font-bold text-gray-300 uppercase tracking-tighter ml-auto sm:ml-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {formatTime(thread.created_at)}
                      </div>
                      <div className="flex items-center gap-1.5 text-emerald-600/70">
                        <div className="w-2 h-2 rounded-full bg-emerald-500/50 animate-pulse" />
                        {thread.online} active
                      </div>
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900 group-hover:text-emerald-800 transition-colors mb-3 leading-tight tracking-tight max-w-2xl">
                    {thread.title}
                  </h2>
                  <p className="text-gray-500 text-[15px] line-clamp-2 leading-relaxed font-medium">
                    {thread.preview}
                  </p>
                </div>

                <div className="flex sm:flex-col items-center gap-3 sm:shrink-0 sm:pt-1">
                  <div className="flex flex-col items-center justify-center min-w-[4.5rem] h-20 rounded-2xl border border-gray-50 bg-gray-50/20 text-gray-400 group-hover:bg-white group-hover:border-emerald-50 transition-all shadow-inner group-hover:shadow-none">
                    <MessageSquare className="w-6 h-6 mb-1 opacity-70" />
                    <span className="text-[13px] font-black">{thread.comments}</span>
                  </div>
                  <button className="flex flex-col items-center justify-center min-w-[4.5rem] h-20 rounded-2xl border-2 border-gray-100 bg-white text-gray-400 hover:border-emerald-800 hover:text-emerald-800 transition-all active:scale-95 shadow-sm hover:shadow-lg group/upvote">
                    <Triangle className="w-5 h-5 mb-1 group-hover/upvote:fill-emerald-800 transition-colors" />
                    <span className="text-[13px] font-black">{thread.upvotes}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          <div className="py-16 text-center">
            <button className="px-12 py-4 bg-white border border-gray-100 rounded-2xl text-[13px] font-black uppercase tracking-widest text-gray-400 hover:text-emerald-800 hover:border-emerald-800 transition-all shadow-sm active:scale-95">
              Load more discussions
            </button>
          </div>
        </div>
      </main>

      {/* Right Sidebar - Reusing TrendingSidebar */}
      <TrendingSidebar user={user} setView={setView} />
    </div>
  );
};

export default ForumHome;
