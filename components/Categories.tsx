import React, { useEffect } from 'react';
import { ArrowLeft, Search, Sparkles, ChevronRight } from 'lucide-react';
import { View } from '../types';

interface CategoryGroup {
  title: string;
  links: string[];
}

interface CategoriesProps {
  onBack: () => void;
  onCategorySelect: (category: string) => void;
}

const CATEGORY_DATA: CategoryGroup[] = [
  {
    title: "Productivity",
    links: ["AI notetakers", "Note and writing apps", "Team collaboration software", "Search", "Calendar Sync", "Task Management", "Halal Habit Trackers", "Focus Apps"]
  },
  {
    title: "Engineering & Development",
    links: ["Vibe Coding Tools", "AI Coding Agents", "AI Code Editors", "Web Frameworks", "API Management", "DevOps Tools", "Open Source", "No-code Platforms"]
  },
  {
    title: "Marketing & Sales",
    links: ["Lead generation software", "Marketing automation platforms", "Ethical Marketing", "CRM Platforms", "Ad Networks", "Customer Support", "SEO Tools"]
  },
  {
    title: "Design & Creative",
    links: ["Video editing", "Design resources", "Graphic design tools", "AI Generative Media", "Figma Plugins", "Static site generators", "UI Kits"]
  },
  {
    title: "Spirituality & Education",
    links: ["Quranic EdTech", "Prayer Apps", "Spirituality Tools", "Arabic Learning", "Hajj & Umrah Guides", "Masjid Management", "Islamic Courses"]
  },
  {
    title: "Finance & Wealth",
    links: ["Shariah Fintech", "Zakat Calculators", "Halal Investing", "Crypto Purifiers", "Estate Planning", "Crowdfunding", "Islamic Banking"]
  },
  {
    title: "Social & Lifestyle",
    links: ["Muslim Tech Ecosystem", "Halal Travel Guides", "Modest Fashion", "Nikah Platforms", "Community Forums", "Parenting Tools", "Food Scanners"]
  },
  {
    title: "AI & Future Tech",
    links: ["LLM Solutions", "AI Safety", "Local-first AI", "Ethical Datasets", "AI Agents", "Vector Databases", "Prompt Engineering"]
  }
];

const Categories: React.FC<CategoriesProps> = ({ onBack, onCategorySelect }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        {/* Breadcrumb / Back */}
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-emerald-800 transition-colors mb-12 group font-bold uppercase tracking-widest text-xs"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to feed
        </button>

        {/* Hero */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full mb-4">
            <Sparkles className="w-3.5 h-3.5 fill-emerald-800" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Directory</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-serif font-bold text-emerald-900 tracking-tight mb-6">
            Product Categories
          </h1>
          <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Discover thousands of Halal-conscious tools and products across the entire digital ecosystem.
          </p>
        </div>

        {/* Search Bar - High Fidelity PH style */}
        <div className="max-w-2xl mx-auto mb-24">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-800 transition-colors" />
            <input 
              type="text" 
              placeholder="Search 200+ categories..."
              className="w-full pl-14 pr-6 py-5 bg-gray-50 border border-gray-100 rounded-2xl text-lg font-medium outline-none focus:bg-white focus:border-emerald-800 focus:ring-4 focus:ring-emerald-900/5 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-16 pb-10">
          {CATEGORY_DATA.map((group) => (
            <div key={group.title} className="flex flex-col">
              <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center justify-between group cursor-pointer hover:text-emerald-800 transition-colors">
                {group.title}
                <ChevronRight className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-all" />
              </h3>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link}>
                    <button
                      onClick={() => onCategorySelect(link)}
                      className="text-sm font-medium text-gray-500 hover:text-emerald-800 hover:underline transition-all text-left block w-full truncate"
                    >
                      {link}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    onClick={() => onCategorySelect(group.title)}
                    className="text-[10px] font-black text-emerald-800 uppercase tracking-widest mt-2 hover:opacity-70 transition-opacity"
                  >
                    View all {group.title}
                  </button>
                </li>
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;