
import React, { useEffect, useState } from 'react';
import { Home, MessageSquare, Search, PlusCircle, Hash, ArrowUpRight } from 'lucide-react';
import { View, User, ForumCategory } from '../types';
import { supabase } from '../lib/supabase';

interface ForumSidebarProps {
  currentView: View;
  setView: (view: View, path?: string) => void;
  user: User | null;
  onSignIn: () => void;
}

const ForumSidebar: React.FC<ForumSidebarProps> = ({ currentView, setView, user, onSignIn }) => {
  const [forumCategories, setForumCategories] = useState<ForumCategory[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchForumCategories = async () => {
      const { data, error } = await supabase
        .from('forum_categories')
        .select('*')
        .order('id', { ascending: true });

      if (!error && data) {
        setForumCategories(data);
      }
    };
    fetchForumCategories();
  }, []);

  const SidebarLink = ({
    icon: Icon,
    label,
    isActive = false,
    onClick
  }: {
    icon: any,
    label: string,
    isActive?: boolean,
    onClick: () => void
  }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${isActive
        ? 'bg-primary text-white font-bold'
        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
        }`}
    >
      <Icon size={18} className={isActive ? 'text-white' : 'text-gray-400'} />
      <span className="text-[14px]">{label}</span>
    </button>
  );

  return (
    <aside className="w-full lg:w-[250px] shrink-0 space-y-8 sticky top-24 h-fit">
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search all threads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
          />
        </div>

        <nav className="space-y-1">
          <SidebarLink
            icon={Home}
            label="Home"
            isActive={currentView === View.FORUM_HOME}
            onClick={() => setView(View.FORUM_HOME)}
          />
          <SidebarLink
            icon={MessageSquare}
            label="Recent comments"
            isActive={currentView === View.RECENT_COMMENTS}
            onClick={() => setView(View.RECENT_COMMENTS)}
          />
          <SidebarLink
            icon={Search}
            label="Search all threads"
            onClick={() => { }}
          />
          <SidebarLink
            icon={PlusCircle}
            label="Start new thread"
            isActive={currentView === View.NEW_THREAD}
            onClick={() => user ? setView(View.NEW_THREAD) : onSignIn()}
          />
        </nav>
      </div>

      <section>
        <h3 className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Topic Forums</h3>
        <div className="space-y-0.5">
          {forumCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setView(View.FORUM_CATEGORY, `/p/${cat.slug}`)}
              className={`w-full flex items-center gap-3 px-3 py-1.5 text-[14px] font-medium rounded-lg transition-all text-left ${currentView === View.FORUM_CATEGORY && window.location.pathname === `/p/${cat.slug}`
                ? 'bg-primary-light text-[#004D40] font-bold'
                : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
              <Hash size={14} className={currentView === View.FORUM_CATEGORY && window.location.pathname === `/p/${cat.slug}` ? "text-[#004D40]" : "text-gray-300"} />
              <span className="truncate">p/{cat.slug}</span>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Product Forums</h3>
        <div className="space-y-0.5">
          {['QuranFlow', 'HalalWallet', 'ArabicHero'].map((product) => (
            <button key={product} className="w-full flex items-center gap-3 px-3 py-1.5 text-[14px] font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-all">
              <div className="w-5 h-5 rounded bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500">
                {product[0]}
              </div>
              {product}
            </button>
          ))}
        </div>
      </section>

      <div className="p-6 bg-[#004D40] rounded-2xl text-white shadow-lg overflow-hidden relative">
        <p className="text-[10px] font-bold uppercase tracking-widest text-primary-light mb-2">Ummah Voice</p>
        <p className="text-sm font-semibold leading-relaxed">Join 12,000+ Muslim builders shaping the future of Halal tech.</p>
        <button className="mt-4 flex items-center gap-1 text-[11px] font-bold hover:underline text-emerald-300">
          View Guidelines <ArrowUpRight size={12} />
        </button>
      </div>
    </aside>
  );
};

export default ForumSidebar;
