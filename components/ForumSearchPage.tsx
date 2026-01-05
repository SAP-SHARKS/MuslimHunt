
import React, { useState, useEffect, useCallback } from 'react';
import { Search, ChevronDown, MessageSquare, Triangle, Clock, Loader2 } from 'lucide-react';
import { View } from '../types';
import { supabase } from '../lib/supabase';
import { formatTimeAgo } from '../utils/dateUtils';

interface ForumSearchPageProps {
  setView: (view: View) => void;
}

const ForumSearchPage: React.FC<ForumSearchPageProps> = ({ setView }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Read query from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    if (q) {
      setQuery(q);
      performSearch(q);
    }
  }, []);

  const performSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      // Explicit join with profiles for author metadata
      const { data, error } = await supabase
        .from('threads')
        .select(`
          *,
          forum_categories ( slug, name ),
          profiles:author_id ( username, avatar_url )
        `)
        .or(`title.ilike.%${searchTerm}%,body.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResults(data || []);
    } catch (err) {
      console.error('Forum search failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextQ = e.target.value;
    setQuery(nextQ);
    
    // Update URL without a full page reload or App.tsx routing override
    const url = new URL(window.location.href);
    if (nextQ) url.searchParams.set('q', nextQ);
    else url.searchParams.delete('q');
    window.history.replaceState({}, '', url.toString());

    performSearch(nextQ);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      {/* Top Search Bar */}
      <div className="relative">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 w-6 h-6" />
        <input
          type="text"
          value={query}
          onChange={handleQueryChange}
          placeholder="Search for discussions..."
          className="w-full pl-16 pr-8 py-6 bg-white border border-gray-100 rounded-3xl text-xl font-bold text-gray-900 outline-none focus:border-emerald-800 transition-all shadow-sm placeholder:text-gray-300"
          autoFocus
        />
      </div>

      {/* Sorting / Filter Bar */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Sort by</span>
          <button className="flex items-center gap-1.5 text-[11px] font-black text-gray-900 uppercase tracking-widest hover:text-emerald-800 transition-colors">
            Recent <ChevronDown className="w-3 h-3" />
          </button>
        </div>
        {query && !loading && (
          <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
            {results.length} result{results.length !== 1 ? 's' : ''} found
          </span>
        )}
      </div>

      {/* Results Area */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 text-emerald-800 animate-spin" />
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Searching Forum Database...</p>
          </div>
        ) : !query ? (
          <div className="py-20 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-200">
              <Search className="w-10 h-10" />
            </div>
            <p className="text-gray-400 font-bold italic">Enter a search term to find discussions.</p>
          </div>
        ) : results.length === 0 ? (
          <div className="py-20 text-center bg-white border border-dashed border-gray-200 rounded-[2rem]">
            <p className="text-gray-400 font-bold italic">Bismillah! No discussions found for "{query}".</p>
            <p className="text-sm text-gray-300 mt-2">Try broader keywords or different terms.</p>
          </div>
        ) : (
          results.map((thread) => (
            <div 
              key={thread.id} 
              className="group bg-white border border-gray-100 rounded-[2rem] p-6 hover:border-emerald-200 hover:shadow-xl transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[10px] font-black text-[#004D40] uppercase tracking-[0.15em] bg-emerald-50 px-2 py-0.5 rounded-md">
                      p/{thread.forum_categories?.slug || 'general'}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full overflow-hidden border border-gray-100">
                        <img 
                          src={thread.profiles?.avatar_url || `https://i.pravatar.cc/150?u=${thread.author_id}`} 
                          className="w-full h-full object-cover" 
                          alt="Author" 
                        />
                      </div>
                      <span className="text-[11px] font-bold text-gray-500 group-hover:text-[#004D40] transition-colors truncate max-w-[150px]">
                        {thread.profiles?.username}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-gray-300 font-bold">
                      <span className="mx-1 opacity-50">•</span>
                      <Clock className="w-3 h-3" /> {formatTimeAgo(thread.created_at)}
                    </div>
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 group-hover:text-[#004D40] transition-colors leading-tight mb-2">
                    {thread.title}
                  </h2>
                  {thread.body && (
                    <p className="text-gray-500 text-sm line-clamp-1 leading-snug font-medium opacity-80" 
                       dangerouslySetInnerHTML={{ __html: thread.body.replace(/<[^>]*>?/gm, '').slice(0, 150) + '...' }} 
                    />
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex flex-col items-center justify-center min-w-[3rem] h-12 rounded-xl bg-gray-50 text-gray-400 group-hover:bg-emerald-50 group-hover:text-[#004D40] transition-all">
                    <MessageSquare className="w-4 h-4 mb-0.5" />
                    <span className="text-[11px] font-black">0</span>
                  </div>
                  <button className="flex flex-col items-center justify-center min-w-[3.5rem] h-14 rounded-xl border-2 border-gray-100 bg-white text-gray-400 hover:border-[#004D40] hover:text-[#004D40] transition-all active:scale-95 shadow-sm">
                    <Triangle className="w-4 h-4 mb-0.5" />
                    <span className="text-[12px] font-black">0</span>
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

export default ForumSearchPage;
