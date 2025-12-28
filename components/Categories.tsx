import React, { useEffect, useState } from 'react';
import { ArrowLeft, Search, Sparkles, ChevronRight, Hash } from 'lucide-react';
import { View } from '../types.ts';

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
    links: [
      "AI notetakers", "App switchers", "Compliance software", "Email clients", 
      "Knowledge base", "Note and writing apps", "Presentation Software",
      "Task management", "Calendar Sync", "Halal Habit Trackers", "Focus Apps"
    ]
  },
  {
    title: "Engineering & Development",
    links: [
      "A/B testing", "AI Coding Agents", "Automation tools", "AI Code Editors", 
      "AI Databases", "Browser Automation", "Authentication",
      "Vibe Coding Tools", "Web Frameworks", "API Management", "DevOps Tools"
    ]
  },
  {
    title: "Marketing & Sales",
    links: [
      "AI sales tools", "CRM", "GEO Tools", "Landing page builders", "SEO", 
      "Social media management", "Lead generation software", 
      "Marketing automation platforms", "Ethical Marketing"
    ]
  },
  {
    title: "Design & Creative",
    links: [
      "3D & Animation", "AI Headshots", "Camera apps", "Design resources", 
      "Icon sets", "Music Generation", "Social audio", "Video editing",
      "Graphic design tools", "AI Generative Media", "Figma Plugins"
    ]
  },
  {
    title: "Finance",
    links: [
      "Accounting software", "Financial planning", "Invoicing", "Online banking", 
      "Retirement planning", "Startup incorporation", "Shariah Fintech",
      "Zakat Calculators", "Halal Investing", "Crypto Purifiers"
    ]
  },
  {
    title: "Spirituality & Education",
    links: [
      "Quranic EdTech", "Prayer Apps", "Spirituality Tools", "Arabic Learning", 
      "Hajj & Umrah Guides", "Masjid Management", "Islamic Courses",
      "Dua Collections", "Halal Education", "Hadith Databases"
    ]
  },
  {
    title: "Social & Lifestyle",
    links: [
      "Muslim Tech Ecosystem", "Halal Travel Guides", "Modest Fashion", 
      "Nikah Platforms", "Community Forums", "Parenting Tools", "Food Scanners",
      "Halal Restaurants", "Ethical Social Networks"
    ]
  },
  {
    title: "AI & Future Tech",
    links: [
      "LLM Solutions", "AI Safety", "Local-first AI", "Ethical Datasets", 
      "AI Agents", "Vector Databases", "Prompt Engineering", "No-code Platforms"
    ]
  }
];

const Categories: React.FC<CategoriesProps> = ({ onBack, onCategorySelect }) => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredCategories = CATEGORY_DATA.map(group => ({
    ...group,
    links: group.links.filter(link => 
      link.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(group => group.links.length > 0 || group.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        {/* Navigation / Breadcrumb */}
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-emerald-800 transition-colors mb-12 group font-black uppercase tracking-widest text-[10px]"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to discovery feed
        </button>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full mb-6">
            <Sparkles className="w-3.5 h-3.5 fill-emerald-800" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Product Index</span>
          </div>
          <h1 className="text-5xl sm:text-7xl font-serif font-bold text-emerald-900 tracking-tighter mb-6">
            Product Categories
          </h1>
          <p className="text-lg text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
            The complete directory of Halal-conscious tools and digital products across the global Ummah tech landscape.
          </p>
        </div>

        {/* Search Bar - High Density PH style */}
        <div className="max-w-xl mx-auto mb-20">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-800 transition-colors" />
            <input 
              type="text" 
              placeholder="Search hundreds of categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-5 bg-gray-50 border border-gray-100 rounded-2xl text-lg font-medium outline-none focus:bg-white focus:border-emerald-800 focus:ring-4 focus:ring-emerald-900/5 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Super-Grid of Categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-16 pb-20 border-t border-gray-50 pt-16">
          {filteredCategories.map((group) => (
            <div key={group.title} className="flex flex-col">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-[0.15em] mb-6 flex items-center justify-between group/title">
                {group.title}
                <ChevronRight className="w-3 h-3 text-gray-300 opacity-0 group-hover/title:opacity-100 group-hover/title:translate-x-1 transition-all" />
              </h3>
              <ul className="space-y-1.5">
                {group.links.map((link) => (
                  <li key={link}>
                    <button
                      onClick={() => onCategorySelect(link)}
                      className="text-sm text-gray-600 hover:text-emerald-800 hover:underline transition-all text-left block w-full py-0.5 font-medium truncate"
                    >
                      {link}
                    </button>
                  </li>
                ))}
                {group.links.length > 0 && (
                  <li className="pt-4">
                    <button
                      onClick={() => onCategorySelect(group.title)}
                      className="flex items-center gap-1.5 text-[10px] font-black text-emerald-800 uppercase tracking-widest hover:opacity-70 transition-opacity"
                    >
                      Browse All {group.title} <ArrowLeft className="w-3 h-3 rotate-180" />
                    </button>
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>

        {/* Categories Footer Help */}
        <div className="bg-[#042119] rounded-[3rem] p-10 sm:p-16 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
            <Hash className="w-64 h-64 -rotate-12" />
          </div>
          <div className="max-w-2xl relative z-10">
            <h2 className="text-3xl font-serif font-bold mb-4">Can't find a category?</h2>
            <p className="text-emerald-100/70 text-lg font-medium mb-8">
              We're constantly expanding our directory. If you're building in a niche we haven't covered yet, suggest it during your next launch!
            </p>
            <button className="px-8 py-4 bg-emerald-800 hover:bg-emerald-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl active:scale-95">
              Launch your product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;