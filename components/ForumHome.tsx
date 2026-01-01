
import React, { useState, useEffect } from 'react';
import { Home, MessageSquare, Search, PlusSquare, Hash, Triangle, ChevronDown, Sparkles, Clock, ArrowUpRight, Filter, Loader2 } from 'lucide-react';
import { View, Thread, Forum } from '../types';
import { supabase } from '../lib/supabase';
import { formatTimeAgo } from '../utils/dateUtils';

interface ForumHomeProps {
  setView: (view: View, path?: string) => void;
  user: any;
  onSignIn: () => void;
  forums: Forum[];
}

const ForumHome: React.FC<ForumHomeProps> = ({ setView, user, onSignIn, forums }) => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchRecentThreads = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('threads')
        .select('*, forums(name, slug), profiles(username, avatar_url, headline)')
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (!error) setThreads(data as any[]);
    } catch (err) {
      console.error('[ForumHome] Fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentThreads();
  }, []);

  const filteredThreads = threads.filter(t => t.title.toLowerCase().includes(search.toLowerCase()));

  const SidebarLink = ({ icon: Icon, label, active = false, onClick }: any) => (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all rounded-xl ${
        active ? 'text-emerald-800 bg-emerald-50 font-bold' : 'text-gray-500 hover:text-emerald-800 hover:bg-emerald-50'
      }`}
    >
      <Icon className={`w-4 h-4 ${active ? 'text-emerald-800' : 'text-gray-400 opacity-70'}`} />
      {label}
    </button>
  );

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 flex flex-col lg:flex-row gap-12 animate-in fade-in duration-500">
      <aside className="hidden lg:block w-72 shrink-0 space-y-10 sticky top-24 h-fit max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar pr-2">
        <nav className="space-y-1">
          <SidebarLink icon={Home} label="Home" active={true} onClick={() => setView(View.FORUM_HOME)} />
          <SidebarLink icon={MessageSquare} label="Recent comments" onClick={() => setView(View.RECENT_COMMENTS)} />
          <SidebarLink icon={PlusSquare} label="Start discussion" onClick={() => user ? setView(View.NEW_THREAD) : onSignIn()} />
        </nav>

        <section>
          <h3 className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Topic Forums</h3>
          <div className="space-y-0.5">
            {forums.map((f) => (
              <button 
                key={f.id} onClick={() => setView(View.FORUM_DETAIL, `/forums/${f.slug}`)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-bold text-gray-500 hover:text-emerald-800 hover:bg-emerald-50 rounded-xl transition-all"
              >
                <Hash className="w-3.5 h-3.5 opacity-40" /> 
                <span className="truncate">{f.name}</span>
              </button>
            ))}
          </div>
        </section>

        <div className="p-8 bg-emerald-900 rounded-[2.5rem] text-white shadow-xl shadow-emerald-900/10 relative overflow-hidden">
          <Sparkles className="absolute -top-4 -right-4 w-20 h-20 text-emerald-400 opacity-20 rotate-12" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 mb-3">Community Hub</p>
          <p className="text-sm font-bold leading-relaxed">Shape the future of Halal tech with 12,000+ builders.</p>
        </div>
      </aside>

      <main className="flex-1 space-y-8">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-emerald-50 pb-8">
          <div>
            <div className="flex items-center gap-2 text-emerald-800 mb-2">
              <Sparkles className="w-4 h-4 fill-emerald-800" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Global Feed</span>
            </div>
            <h1 className="text-4xl font-serif font-bold text-emerald-900 leading-none">Discussions</h1>
          </div>
          <div className="relative group min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-emerald-800" />
            <input 
              type="text" placeholder="Search threads..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-100 rounded-2xl text-sm focus:border-emerald-800 transition-all font-bold shadow-sm"
            />
          </div>
        </header>

        <div className="space-y-4">
          {loading ? (
            <div className="py-24 text-center">
              <Loader2 className="w-10 h-10 text-emerald-800 animate-spin mx-auto mb-4" />
              <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Loading Conversations...</p>
            </div>
          ) : filteredThreads.length === 0 ? (
            <div className="py-24 bg-white border border-dashed border-gray-200 rounded-[3rem] text-center">
              <p className="text-gray-400 italic">No discussions found. Bismillah, start one!</p>
            </div>
          ) : (
            filteredThreads.map((thread: any) => (
              <div 
                key={thread.id} 
                className="group bg-white border border-gray-100 rounded-[2.5rem] p-6 sm:p-8 hover:border-emerald-200 hover:shadow-2xl hover:shadow-emerald-900/5 transition-all cursor-pointer"
                onClick={() => setView(View.FORUM_DETAIL, `/forums/${thread.forums.slug}`)}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-5">
                      <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded-lg">
                        p/{thread.forums.slug}
                      </span>
                      <div className="flex items-center gap-3">
                        <img src={thread.profiles.avatar_url} className="w-8 h-8 rounded-full border-2 border-emerald-50 shadow-sm" alt="User" />
                        <div className="flex flex-col">
                          <span className="text-[13px] font-bold text-gray-900 leading-none">@{thread.profiles.username}</span>
                          <span className="text-[10px] text-gray-400 font-medium">{formatTimeAgo(thread.created_at)}</span>
                        </div>
                      </div>
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-gray-900 group-hover:text-emerald-800 transition-colors mb-3 leading-tight tracking-tight">
                      {thread.title}
                    </h2>
                    <p className="text-gray-500 text-[15px] line-clamp-2 leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: thread.body }} />
                  </div>
                  <div className="flex sm:flex-col items-center gap-3 shrink-0">
                    <div className="flex flex-col items-center justify-center min-w-[3.5rem] h-14 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-100">
                      <MessageSquare className="w-4 h-4 mb-0.5" />
                      <span className="text-xs font-black">{thread.comment_count || 0}</span>
                    </div>
                    <button className="flex flex-col items-center justify-center min-w-[3.5rem] h-14 rounded-2xl border-2 border-gray-100 bg-white text-gray-400 hover:border-emerald-800 hover:text-emerald-800 transition-all active:scale-95">
                      <Triangle className="w-4 h-4 mb-0.5" />
                      <span className="text-xs font-black">{thread.upvotes_count || 0}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default ForumHome;
