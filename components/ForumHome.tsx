
import React from 'react';
import { Home, MessageSquare, Search, Plus, Hash, Triangle, ChevronDown, Sparkles, Clock, Users } from 'lucide-react';
import { View } from '../types';

interface ForumHomeProps {
  setView: (view: View) => void;
  user: any;
}

const ForumHome: React.FC<ForumHomeProps> = ({ setView, user }) => {
  // Mock data for forum threads
  const threads = [
    {
      id: 'f1',
      forum: 'p/general',
      title: 'Building in Public: My journey from 0 to 100 users',
      author: {
        name: 'Ahmed',
        avatar: 'https://i.pravatar.cc/150?u=u_1'
      },
      preview: "I started this journey three months ago with just a simple idea to help the Ummah track their Zakat more efficiently. Here's what I learned...",
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
        avatar: 'https://i.pravatar.cc/150?u=u_2'
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
        avatar: 'https://i.pravatar.cc/150?u=u_3'
      },
      preview: "Salaam everyone! I've been in the industry for 15 years. Happy to answer questions about scaling, compliance, or getting started in FinTech.",
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
        avatar: 'https://i.pravatar.cc/150?u=u_4'
      },
      preview: "AI is moving fast. How do we ensure our algorithms respect our values? I've put together a manifesto for Ethical AI development...",
      upvotes: 204,
      comments: 31,
      created_at: '2025-05-08T12:00:00Z',
      online: 5
    }
  ];

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString();
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 flex flex-col lg:flex-row gap-12">
      {/* Left Sidebar Navigation */}
      <aside className="hidden lg:block w-64 shrink-0 space-y-8 sticky top-24 h-fit">
        <nav className="space-y-1">
          <button 
            onClick={() => setView(View.FORUM_HOME)}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-black text-emerald-800 bg-emerald-50 rounded-xl"
          >
            <Home className="w-4 h-4" /> Home
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-500 hover:text-emerald-800 hover:bg-emerald-50 rounded-xl transition-all">
            <MessageSquare className="w-4 h-4" /> Recent comments
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-500 hover:text-emerald-800 hover:bg-emerald-50 rounded-xl transition-all">
            <Search className="w-4 h-4" /> Search all threads
          </button>
        </nav>

        <button 
          onClick={() => user ? setView(View.NEW_THREAD) : setView(View.LOGIN)}
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-100 py-3 rounded-xl text-xs font-black text-gray-700 uppercase tracking-widest hover:border-emerald-800 hover:text-emerald-800 hover:bg-emerald-50 transition-all shadow-sm active:scale-95"
        >
          <Plus className="w-4 h-4" /> Start new thread
        </button>

        <section>
          <h3 className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Topic Forums</h3>
          <div className="space-y-1">
            {['p/general', 'p/vibecoding', 'p/ama', 'p/show-and-tell'].map((forum) => (
              <button key={forum} className="w-full flex items-center gap-3 px-4 py-2 text-sm font-bold text-gray-500 hover:text-emerald-800 hover:bg-emerald-50 rounded-xl transition-all">
                <Hash className="w-3.5 h-3.5 opacity-50" /> {forum}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Product Forums</h3>
          <div className="space-y-1">
            {['QuranFlow', 'HalalWallet', 'ArabicHero'].map((product) => (
              <button key={product} className="w-full flex items-center gap-3 px-4 py-2 text-sm font-bold text-gray-500 hover:text-emerald-800 hover:bg-emerald-50 rounded-xl transition-all">
                <Hash className="w-3.5 h-3.5 opacity-50" /> {product}
              </button>
            ))}
          </div>
        </section>
      </aside>

      {/* Main Forum Feed */}
      <main className="flex-1 space-y-8">
        <header className="flex items-center justify-between mb-8 border-b border-emerald-50 pb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-emerald-900">Community Discussion</h1>
            <p className="text-gray-500 mt-1 font-medium">Connect with the global Muslim tech ecosystem.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all">
            Trending <ChevronDown className="w-4 h-4" />
          </button>
        </header>

        <div className="space-y-4">
          {threads.map((thread) => (
            <div key={thread.id} className="group bg-white border border-gray-100 rounded-[2rem] p-6 sm:p-8 hover:border-emerald-100 hover:shadow-xl hover:shadow-emerald-900/5 transition-all cursor-pointer">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded">
                      {thread.forum}
                    </span>
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                      <div className="w-6 h-6 rounded-full overflow-hidden border border-emerald-50">
                        <img src={thread.author.avatar} alt={thread.author.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="hover:text-emerald-800 transition-colors">{thread.author.name}</span>
                    </div>
                    {thread.is_pinned && (
                      <span className="flex items-center gap-1 text-[10px] font-black text-white uppercase tracking-widest bg-emerald-800 px-2 py-1 rounded">
                        <Sparkles className="w-2.5 h-2.5" /> Pinned
                      </span>
                    )}
                    <span className="text-[10px] font-bold text-gray-300 flex items-center gap-1 uppercase tracking-tighter">
                      <Clock className="w-3 h-3" /> {formatTime(thread.created_at)}
                    </span>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600/60 uppercase tracking-tighter">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      {thread.online} online
                    </div>
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 group-hover:text-emerald-800 transition-colors mb-2 leading-tight">
                    {thread.title}
                  </h2>
                  <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed font-medium">
                    {thread.preview}
                  </p>
                </div>

                <div className="flex sm:flex-col items-center gap-2 sm:shrink-0">
                  <div className="flex flex-col items-center justify-center min-w-[3.5rem] h-14 rounded-xl border border-gray-50 text-gray-400">
                    <MessageSquare className="w-4 h-4 mb-0.5" />
                    <span className="text-[10px] font-black">{thread.comments}</span>
                  </div>
                  <button className="flex flex-col items-center justify-center min-w-[4rem] h-14 rounded-xl border-2 border-gray-100 bg-white text-gray-400 hover:border-emerald-800 hover:text-emerald-800 transition-all active:scale-95">
                    <Triangle className="w-3 h-3 mb-0.5" />
                    <span className="text-[10px] font-black">{thread.upvotes}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ForumHome;
