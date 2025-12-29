import React, { useMemo } from 'react';
import { MessageSquare, Sparkles, ArrowUpRight, Clock, ChevronRight } from 'lucide-react';

interface CategorySidebarProps {
  activeCategory?: string;
  onCategorySelect?: (category: string) => void;
}

const CATEGORY_GROUPS: Record<string, string[]> = {
  'Productivity': [
    "AI notetakers", "App switcher", "Compliance software", "Email clients", 
    "Knowledge base", "Note and writing apps", "Presentation Software", 
    "Resume tools", "Search", "Team collaboration", "Virtual office"
  ],
  'Engineering': [
    "AI Coding Agents", "Vibe Coding Tools", "AI Code Editors", "AI Databases", 
    "Browser Automation", "Issue tracking", "Code Review Tools"
  ],
  'Design': [
    "AI headshot generators", "3D & Animation", "Avatar generators", "Music Generation"
  ],
};

const CategorySidebar: React.FC<CategorySidebarProps> = ({ activeCategory = "AI notetakers", onCategorySelect }) => {
  const currentParent = useMemo(() => {
    return Object.keys(CATEGORY_GROUPS).find(key => CATEGORY_GROUPS[key].includes(activeCategory)) || "Productivity";
  }, [activeCategory]);

  const siblingLinks = CATEGORY_GROUPS[currentParent] || CATEGORY_GROUPS['Productivity'];

  return (
    <aside className="hidden lg:block space-y-10 sticky top-24 h-fit pb-12 overflow-y-auto max-h-[calc(100vh-6rem)] custom-scrollbar">
      <section>
        <div className="flex items-center justify-between mb-6 border-b border-gray-50 pb-4">
          <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
            Forum Discussions
            <MessageSquare className="w-3.5 h-3.5 opacity-50" />
          </h3>
        </div>
        
        <div className="space-y-6">
          {[
            { id: 't1', title: `What are your favorite ${activeCategory} for 2025?`, views: '1.6K', time: '2D AGO' },
            { id: 't2', title: `Seeking ethical datasets for ${activeCategory} models`, views: '840', time: '1W AGO' },
          ].map((thread) => (
            <div key={thread.id} className="group cursor-pointer">
              <h4 className="text-sm font-bold text-gray-900 group-hover:text-emerald-800 transition-colors leading-relaxed mb-2 tracking-tight">
                {thread.title}
              </h4>
              <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">
                <span>{thread.views} VIEWS</span>
                <span className="text-gray-200">•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {thread.time}
                </span>
              </div>
            </div>
          ))}
        </div>

        <button className="w-full mt-10 py-3.5 bg-gray-50 text-[10px] font-black text-gray-500 hover:text-emerald-800 hover:bg-emerald-50 border border-transparent hover:border-emerald-100 rounded-xl uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 active:scale-[0.98] shadow-sm">
          View All {activeCategory} Threads
          <ChevronRight className="w-3 h-3" />
        </button>
      </section>

      <section className="bg-[#052e16] rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl shadow-emerald-900/20">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform pointer-events-none">
          <Sparkles className="w-24 h-24 text-emerald-400 rotate-12" />
        </div>
        
        <div className="relative z-10">
          <div className="inline-block px-2.5 py-1 bg-emerald-400 text-[#052e16] rounded-md text-[9px] font-black uppercase tracking-widest mb-6 shadow-sm">
            Pro Insight
          </div>
          
          <h4 className="text-lg font-bold leading-relaxed mb-8 text-emerald-50 font-sans tracking-tight">
            The {activeCategory} market is projected to grow significantly this year.
          </h4>
          
          <button className="flex items-center gap-2 text-xs font-black text-emerald-400 hover:text-white transition-colors group/link uppercase tracking-widest">
            Read Trends Report
            <ArrowUpRight className="w-4 h-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </section>
      
      <section className="pt-4">
        <h3 className="text-sm font-bold text-gray-900 mb-6 tracking-tight">
          More in {currentParent}
        </h3>
        <div className="flex flex-col space-y-3.5">
          {siblingLinks.map((link) => {
            const isActive = activeCategory === link;
            return (
              <button
                key={link}
                onClick={() => onCategorySelect?.(link)}
                className={`text-sm text-left transition-all duration-200 hover:underline decoration-1 underline-offset-4 ${
                  isActive 
                    ? 'text-emerald-800 font-bold' 
                    : 'text-gray-500 hover:text-emerald-800 font-medium'
                }`}
              >
                {link}
              </button>
            );
          })}
        </div>
      </section>
    </aside>
  );
};

export default CategorySidebar;