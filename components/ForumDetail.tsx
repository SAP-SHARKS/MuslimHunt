
import React, { useState, useEffect } from 'react';
import { ChevronLeft, MessageSquare, Hash, Triangle, Sparkles, Plus, Loader2, ArrowRight, Rocket, Compass, Flame, Calendar, Mail, FileText, Menu, X, Star, Zap, Code, Cpu, CheckSquare, Palette, Users, DollarSign, Megaphone, Layout, Bot, Trophy, Activity, Wind, Brain, Moon, Dumbbell, Hotel, Map, Chrome, Figma, Slack, Wallet, ShoppingBag, CreditCard, Baby, BookOpen } from 'lucide-react';
import { View, Forum, Thread } from '../types';
import { supabase } from '../lib/supabase';
import { formatTimeAgo } from '../utils/dateUtils';

const ICON_MAP: Record<string, any> = {
  Rocket, Compass, MessageSquare, Flame, Calendar, Mail, BookOpen, FileText, Menu, X, Star, Zap, Code, Cpu, CheckSquare, Palette, Users, DollarSign, Megaphone, Layout, Triangle, Bot, Sparkles, Trophy, Hash,
  Activity, Wind, Brain, Moon, Dumbbell, Hotel, Map, Chrome, Figma, Slack, Wallet, ShoppingBag, CreditCard, Baby
};

interface ForumDetailProps {
  setView: (view: View, path?: string) => void;
  user: any;
  slug: string;
  forums: Forum[];
}

const ForumDetail: React.FC<ForumDetailProps> = ({ setView, user, slug, forums }) => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const forum = forums.find(f => f.slug === slug);

  useEffect(() => {
    if (!forum) return;
    const fetchThreads = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('threads')
          .select('*, profiles:user_id(*)')
          .eq('forum_id', forum.id)
          .order('upvotes_count', { ascending: false })
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setThreads(data || []);
      } catch (err) {
        console.error('[ForumDetail] Failed to fetch threads:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchThreads();
  }, [forum, slug]);

  if (!forum) {
    return (
      <div className="py-48 text-center flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-emerald-800 animate-spin mb-6" />
        <h2 className="text-2xl font-serif font-bold text-emerald-900">Locating Community...</h2>
      </div>
    );
  }

  const ForumIcon = ICON_MAP[forum.icon_name] || Hash;

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 animate-in fade-in duration-500">
      <button 
        onClick={() => setView(View.FORUM_HOME)}
        className="flex items-center gap-2 text-gray-400 hover:text-emerald-800 transition-colors mb-10 group font-black uppercase tracking-widest text-[10px]"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Forums
      </button>

      <header className="bg-white border border-gray-100 rounded-[3rem] p-10 sm:p-14 mb-12 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full -mr-32 -mt-32 opacity-40 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="w-16 h-16 bg-emerald-900 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-emerald-900/20">
              <ForumIcon className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-5xl font-serif font-bold text-emerald-900 tracking-tight leading-none mb-4">p/{forum.slug}</h1>
              <p className="text-xl text-gray-500 font-medium italic leading-relaxed">{forum.description}</p>
            </div>
          </div>
          <button 
            onClick={() => user ? setView(View.NEW_THREAD) : setView(View.HOME)} // setView(View.HOME) should trigger auth via navbar
            className="flex items-center gap-3 bg-emerald-800 text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-900 transition-all shadow-xl shadow-emerald-900/10 active:scale-95"
          >
            <Plus className="w-5 h-5" /> Start Discussion
          </button>
        </div>
      </header>

      <div className="space-y-6">
        <div className="flex items-center justify-between px-4">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">{threads.length} ACTIVE THREADS</h3>
          <span className="flex items-center gap-1.5 text-emerald-600 font-black text-[10px] uppercase tracking-widest">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Community Live
          </span>
        </div>

        {loading ? (
          <div className="py-24 text-center">
            <Loader2 className="w-10 h-10 text-emerald-800 animate-spin mx-auto mb-4" />
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Syncing p/{forum.slug}...</p>
          </div>
        ) : threads.length === 0 ? (
          <div className="py-32 bg-white border border-dashed border-gray-200 rounded-[3rem] text-center">
            <p className="text-gray-400 text-lg font-medium italic mb-6">No discussions here yet. Bismillah, be the first!</p>
            <button onClick={() => setView(View.NEW_THREAD)} className="px-10 py-4 bg-emerald-800 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-emerald-900 transition-all">Create Thread</button>
          </div>
        ) : (
          threads.map((thread: any) => (
            <div 
              key={thread.id} 
              className="group bg-white border border-gray-100 rounded-[2.5rem] p-8 hover:border-emerald-200 hover:shadow-2xl transition-all cursor-pointer"
            >
              <div className="flex flex-col md:flex-row items-start justify-between gap-8">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-5">
                    <img src={thread.profiles?.avatar_url} className="w-10 h-10 rounded-full border-2 border-emerald-50 shadow-sm" alt="User" />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-900 group-hover:text-emerald-800 transition-colors">@{thread.profiles?.username}</span>
                      <span className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">{formatTimeAgo(thread.created_at)}</span>
                    </div>
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-gray-900 group-hover:text-emerald-800 transition-colors mb-4 tracking-tight leading-tight">
                    {thread.title}
                  </h2>
                  <div className="text-gray-500 text-[15px] line-clamp-3 leading-relaxed font-medium prose-sm prose-emerald" dangerouslySetInnerHTML={{ __html: thread.body }} />
                </div>
                <div className="flex md:flex-col items-center gap-3 shrink-0 pt-2">
                  <div className="flex flex-col items-center justify-center min-w-[4rem] h-16 rounded-2xl bg-gray-50 text-gray-400 group-hover:bg-emerald-50 group-hover:text-emerald-800 transition-all">
                    <MessageSquare className="w-5 h-5 mb-0.5" />
                    <span className="text-xs font-black">{thread.comment_count || 0}</span>
                  </div>
                  <button className="flex flex-col items-center justify-center min-w-[4rem] h-16 rounded-2xl border-2 border-gray-100 bg-white text-gray-400 hover:border-emerald-800 hover:text-emerald-800 transition-all active:scale-95 shadow-sm">
                    <Triangle className="w-5 h-5 mb-0.5" />
                    <span className="text-xs font-black">{thread.upvotes_count || 0}</span>
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
