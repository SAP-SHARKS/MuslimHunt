import React, { useEffect, useState, useMemo } from 'react';
import { ArrowLeft, Search, Sparkles, ChevronRight, Hash, Zap, Code, Palette, DollarSign, Megaphone, CheckSquare, Users, BookOpen } from 'lucide-react';
import { View } from '../types.ts';

interface CategoryItem {
  name: string;
  description: string;
}

interface CategorySection {
  id: string;
  title: string;
  icon: any;
  items: CategoryItem[];
}

interface CategoriesProps {
  onBack: () => void;
  onCategorySelect: (category: string) => void;
}

const CATEGORY_SECTIONS: CategorySection[] = [
  {
    id: "productivity",
    title: "Productivity",
    icon: CheckSquare,
    items: [
      { name: "AI notetakers", description: "Automated meeting transcripts and summaries for high-output teams." },
      { name: "App switcher", description: "Seamlessly navigate between your desktop applications." },
      { name: "Compliance software", description: "Keep your startup aligned with global regulatory standards." },
      { name: "Email clients", description: "The next generation of inbox management and AI-powered replies." },
      { name: "Knowledge base", description: "Centralize your team's documentation and internal wisdom." },
      { name: "Note and writing apps", description: "Distraction-free environments for your best ideas." },
      { name: "Presentation Software", description: "Design stunning slide decks with the help of AI agents." },
      { name: "Resume tools", description: "Build professional, ATS-optimized resumes in minutes." },
      { name: "Search", description: "Find anything across your entire local and cloud workspace." },
      { name: "Team collaboration", description: "Communication platforms for modern, distributed teams." },
      { name: "Virtual office", description: "Remote-first environments that replicate the feel of being together." }
    ]
  },
  {
    id: "engineering",
    title: "Engineering & Dev",
    icon: Code,
    items: [
      { name: "A/B testing tools", description: "Optimize your product conversions with data-driven experiments." },
      { name: "AI Coding Agents", description: "Autonomous agents that write and fix code based on high-level prompts." },
      { name: "Automation tools", description: "Connect your entire stack and automate repetitive workflows." },
      { name: "AI Code Editors", description: "The next evolution of IDEs with deep semantic understanding." },
      { name: "AI Databases", description: "Vector stores and high-performance databases for the AI era." },
      { name: "Browser Automation", description: "Scrape, test, and interact with the web programmatically." },
      { name: "AI Code Testing", description: "Automated unit test generation and bug detection." },
      { name: "Authentication", description: "Secure identity management for apps and services." },
      { name: "Cloud Computing", description: "Serverless, edge, and infrastructure-as-a-service providers." },
      { name: "Code Review Tools", description: "AI-powered feedback on pull requests and code quality." },
      { name: "Databases & Backend", description: "Scalable storage solutions and backend-as-a-service." },
      { name: "Issue tracking", description: "Manage bugs, features, and roadmaps with ease." },
      { name: "Predictive AI", description: "Models that forecast trends and user behavior." },
      { name: "Static site generators", description: "Blazing fast tools for content-heavy web projects." },
      { name: "Unified API", description: "One interface to rule dozens of third-party integrations." },
      { name: "Vibe Coding Tools", description: "Tools for developers who prioritize flow and rapid prototyping." }
    ]
  },
  {
    id: "design",
    title: "Design & Creative",
    icon: Palette,
    items: [
      { name: "3D & Animation", description: "Create immersive assets and motion graphics without the learning curve." },
      { name: "AI Headshot Generators", description: "Professional portraits generated from simple selfies." },
      { name: "Camera apps", description: "Advanced photography tools for your mobile device." },
      { name: "Design resources", description: "Libraries of high-quality UI kits, icons, and fonts." },
      { name: "Icon sets", description: "Hand-crafted and AI-generated iconography for every brand." },
      { name: "Music Generation", description: "Custom soundtracks and beats generated from text prompts." },
      { name: "Social audio apps", description: "Voice-first social networks and podcasting tools." },
      { name: "UI frameworks", description: "Build beautiful interfaces faster with pre-built components." },
      { name: "AI Characters", description: "Interactive avatars and digital personas for games and support." },
      { name: "Avatar generators", description: "Custom profile pictures and digital identities." },
      { name: "Interface design tools", description: "Collaborative platforms for web and mobile prototyping." },
      { name: "Photo editing", description: "Powerful image manipulation tools powered by neural networks." },
      { name: "User research", description: "Collect and analyze qualitative feedback from your users." },
      { name: "Wireframing", description: "Quickly map out your application's user experience." },
      { name: "AI Generative Media", description: "Synthesize images and video from natural language." },
      { name: "Graphic design tools", description: "Everything you need for branding and marketing visuals." },
      { name: "Video editing", description: "Automated and pro-level tools for cinematic content." }
    ]
  },
  {
    id: "finance",
    title: "Finance & Wealth",
    icon: DollarSign,
    items: [
      { name: "Accounting", description: "Automated bookkeeping and tax preparation for small businesses." },
      { name: "Financial planning", description: "Tools to manage your long-term wealth and investments." },
      { name: "Invoicing", description: "Get paid faster with professional, automated billing." },
      { name: "Online banking", description: "Next-gen banking services for founders and digital nomads." },
      { name: "Retirement planning", description: "Secure your future with smart savings strategies." },
      { name: "Startup incorporation", description: "Launch your legal entity in minutes, anywhere in the world." },
      { name: "Treasury management", description: "Optimize your company's cash flow and interest rates." },
      { name: "Budgeting", description: "Take control of your personal and business spending." },
      { name: "Fundraising", description: "Manage your cap table and investor relationships." },
      { name: "Money transfer", description: "Global payments with minimal fees and maximum speed." },
      { name: "Payroll", description: "Easily pay employees and contractors across borders." },
      { name: "Savings", description: "High-yield accounts and automated saving habits." },
      { name: "Stock trading", description: "Access the global markets with powerful trading platforms." }
    ]
  },
  {
    id: "marketing",
    title: "Marketing & Sales",
    icon: Megaphone,
    items: [
      { name: "AI sales tools", description: "Supercharge your outbound efforts with AI prospect research." },
      { name: "CRM", description: "The source of truth for all your customer relationships." },
      { name: "GEO Tools", description: "Analyze markets and target users based on location data." },
      { name: "Landing page builders", description: "Convert visitors into customers with high-performance pages." },
      { name: "SEO", description: "Rank higher on search engines with automated content tools." },
      { name: "Social management", description: "Schedule and analyze your brand's social presence." },
      { name: "Advertising tools", description: "Manage and optimize your paid spend across networks." },
      { name: "Lead generation", description: "Find and qualify new business opportunities automatically." },
      { name: "Sales enablement", description: "Equip your sales team with the best decks and collateral." },
      { name: "Affiliate marketing", description: "Build and manage your partner referral programs." },
      { name: "Email marketing", description: "Send personalized campaigns that actually get opened." },
      { name: "Marketing automation", description: "Nurture your leads through complex, triggered journeys." }
    ]
  }
];

const Categories: React.FC<CategoriesProps> = ({ onBack, onCategorySelect }) => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredSections = useMemo(() => {
    if (!searchTerm.trim()) return CATEGORY_SECTIONS;
    
    return CATEGORY_SECTIONS.map(section => ({
      ...section,
      items: section.items.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })).filter(section => section.items.length > 0 || section.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

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
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Full Directory</span>
          </div>
          <h1 className="text-5xl sm:text-7xl font-serif font-bold text-emerald-900 tracking-tighter mb-6">
            Product Categories
          </h1>
          <p className="text-lg text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Explore 200+ specialized categories of the global Ummah tech landscape.
          </p>
        </div>

        {/* Search Bar & Quick Jump */}
        <div className="sticky top-[4.1rem] z-40 bg-white/80 backdrop-blur-md py-4 mb-16 border-b border-gray-50">
          <div className="max-w-xl mx-auto mb-6">
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-800 transition-colors" />
              <input 
                type="text" 
                placeholder="Search 200+ categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-md font-medium outline-none focus:bg-white focus:border-emerald-800 focus:ring-4 focus:ring-emerald-900/5 transition-all shadow-sm"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORY_SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-full text-xs font-black text-gray-500 uppercase tracking-widest hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-200 transition-all whitespace-nowrap active:scale-95"
              >
                <section.icon className="w-3.5 h-3.5" />
                {section.title}
              </button>
            ))}
          </div>
        </div>

        {/* Super-Index Grid Sections */}
        <div className="space-y-32 pb-32">
          {filteredSections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-20">
              <div className="flex items-center gap-3 mb-10 border-b border-gray-100 pb-6">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-800 rounded-xl flex items-center justify-center">
                  <section.icon className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-serif font-bold text-emerald-900">{section.title}</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {section.items.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => onCategorySelect(item.name)}
                    className="flex flex-col p-6 bg-white border border-gray-100 rounded-2xl hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-900/5 transition-all text-left group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-base font-bold text-gray-900 group-hover:text-emerald-800 transition-colors">
                        {item.name}
                      </h3>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-emerald-800 group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="text-[13px] text-gray-500 leading-snug font-medium line-clamp-2">
                      {item.description}
                    </p>
                  </button>
                ))}
              </div>
            </section>
          ))}
          
          {filteredSections.length === 0 && (
            <div className="text-center py-32">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-gray-200" />
              </div>
              <h3 className="text-xl font-serif font-bold text-gray-400 mb-2">No categories found</h3>
              <p className="text-gray-400 font-medium italic">Try a different search term or browse the full index.</p>
            </div>
          )}
        </div>

        {/* Categories Footer CTA */}
        <div className="bg-[#042119] rounded-[4rem] p-12 sm:p-24 text-white relative overflow-hidden group shadow-2xl shadow-emerald-900/20">
          <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
            <Hash className="w-80 h-80 -rotate-12" />
          </div>
          <div className="max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-800/50 text-emerald-400 rounded-full mb-8 border border-emerald-700/30">
              <Zap className="w-4 h-4 fill-emerald-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Build with us</span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-serif font-bold mb-8 leading-tight tracking-tight">Can't find what <br/>you're looking for?</h2>
            <p className="text-emerald-100/70 text-xl font-medium mb-12 leading-relaxed">
              We're constantly expanding our directory. If you're building in a niche we haven't covered yet, suggest it during your next launch!
            </p>
            <button className="px-10 py-5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl active:scale-95 flex items-center gap-3">
              Launch your product <ArrowLeft className="w-4 h-4 rotate-180" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;