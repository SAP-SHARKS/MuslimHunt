
import React, { useState, useEffect } from 'react';
import { ChevronLeft, MessageSquare, Hash, Triangle, Clock, Search, Plus, Loader2, Users, Sparkles } from 'lucide-react';
import { View, Thread, Forum } from '../types';
import { supabase } from '../lib/supabase';
import { formatTimeAgo } from '../utils/dateUtils';

interface ForumDetailProps {
  setView: (view: View, path?: string) => void;
  user: any;
  forumSlug: string;
  forums: Forum[];
}

const ForumDetail: React.FC<ForumDetailProps> = ({ setView, user, forumSlug, forums }) => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const forum = forums.find(f => f.slug === forumSlug);

  useEffect(() => {
    if (!forum) return;
    const fetchThreads = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('threads')
          .select('*, profiles(username, avatar_url, headline)')
          .eq('forum_id', forum.id)
          .order('created_at', { ascending: false });
        if (!error) setThreads(data as any[]);
      } catch (err) { console.error('[ForumDetail] Fetch failed:', err); }
      finally { setLoading(false); }
    };
    fetchThreads();
  }, [forum]);

  if (!forum) {
    return (
      <div className="py-24 text-center">
        <Loader2 className="w-10 h-10 text-emerald-800 animate-spin mx-auto mb-6" />
        <h2 className="text-2xl font-serif font-bold text-emerald-900">Locating Forum...</h2>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 animate-in fade-in duration-500">
      <button 
        onClick={() => setView(View.FORUM_HOME)}
        className="flex items-center gap-2 text-gray-400 hover:text-emerald-800 transition-colors mb-10 font-black uppercase tracking-widest text-[10px] group"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Forums
      </button>

      <header className="bg-white border border-gray-100 rounded-[3rem] p-10 sm:p-14 mb-12 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full -mr-32 -mt-32 opacity-40 blur-3xl" />
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-emerald-900 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-emerald-900/20">
                <Hash className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-5xl font-serif font-bold text-emerald-900 tracking-tight">p/{forum.slug}</h1>
                <p className="text-xl text-gray-500 font-medium italic mt-2">{forum.description}</p>
              </div>
            </div>
            <button 
              onClick={() => setView(View.NEW_THREAD)}
              className="bg-emerald-800 hover:bg-emerald-900 text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl active:scale-95 flex items-center gap-3"
            >
              <Plus className="w-5 h-5" /> Start Discussion
            </button>
          </div>
          <div className="flex items-center gap-6 mt-12 pt-10 border-t border-gray-50">
             <div className="flex items-center gap-2 text-emerald-800/60 font-black text-[10px] uppercase tracking-widest">
               <Users className="w-4 h-4" /> {threads.length} Threads
             </div>
             <div className="flex items-center gap-2 text-emerald-800/60 font-black text-[10px] uppercase tracking-widest">
               <Sparkles className="w-4 h-4" /> Active Community
             </div>
          </div>
        </div>
      </header>

      <div className="space-y-4">
        {loading ? (
          <div className="py-24 text-center"><Loader2 className="w-10 h-10 text-emerald-800 animate-spin mx-auto" /></div>
        ) : threads.length === 0 ? (
          <div className="py-32 bg-white border border-dashed border-gray-200 rounded-[3rem] text-center">
            <p className="text-gray-400 text-lg font-medium italic">Bismillah! Be the first to start a conversation in this forum.</p>
          </div>
        ) : (
          threads.map((thread: any) => (
            <div key={thread.id} className="group bg-white border border-gray-100 rounded-[2.5rem] p-8 hover:border-emerald-200 hover:shadow-xl transition-all cursor-pointer">
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-4">
                    <img src={thread.profiles.avatar_url} className="w-9 h-9 rounded-full border-2 border-emerald-50" alt="Author" />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-900">@{thread.profiles.username}</span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{formatTimeAgo(thread.created_at)}</span>
                    </div>
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-gray-900 group-hover:text-emerald-800 transition-colors mb-3 leading-tight">{thread.title}</h2>
                  <p className="text-gray-500 text-[15px] line-clamp-3 leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: thread.body }} />
                </div>
                <div className="flex flex-col items-center gap-2 shrink-0">
                   <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col items-center justify-center text-gray-400 group-hover:bg-emerald-50 group-hover:text-emerald-800 transition-all">
                     <MessageSquare className="w-4 h-4 mb-0.5" />
                     <span className="text-[11px] font-black">{thread.comment_count || 0}</span>
                   </div>
                   <button className="w-14 h-14 rounded-2xl border-2 border-gray-100 flex flex-col items-center justify-center text-gray-400 hover:border-emerald-800 hover:text-emerald-800 active:scale-95 transition-all">
                     <Triangle className="w-4 h-4 mb-0.5" />
                     <span className="text-[11px] font-black">{thread.upvotes_count || 0}</span>
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

export default ForumDetail;
