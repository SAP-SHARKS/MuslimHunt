import React, { useState, useEffect } from 'react';
import { ChevronDown, BookOpen, Search, CheckCircle2, ArrowRight, Sparkles, Info } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface DefinitionsProps {
  onBack: () => void;
}

interface DefinitionItem {
  id: string;
  term: string;
  definition: string;
  order: number;
}

interface ContentSection {
  id: string;
  title: string;
  content: string;
  definitions: DefinitionItem[];
  metadata: {
    brand?: string;
    vibe?: string;
    section?: string;
  };
}

const Definitions: React.FC<DefinitionsProps> = ({ onBack }) => {
  const [activeSection, setActiveSection] = useState('definitions');
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch content from Supabase
  useEffect(() => {
    const fetchContent = async () => {
      const { data, error } = await supabase
        .from('definitions')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching definitions:', error);
        // Fallback to default content
        setSections([
          {
            id: 'definitions',
            title: 'Definitions',
            content: 'A glossary for navigating Muslim Hunt and common terminology.',
            definitions: [
              {
                id: '1',
                term: 'Hunter',
                definition: 'A hunter is anybody with a free, personal Muslim Hunt account who posts a new product to share with the community.',
                order: 1
              },
              {
                id: '2',
                term: 'Maker',
                definition: 'We define a maker as anyone who uses technology to solve their problems. At Muslim Hunt, makers share what they built by hunting their product, whether they made it by themselves or contributed via a team of makers.',
                order: 2
              },
              {
                id: '3',
                term: 'Launch',
                definition: 'A launch happens when a product is shared to a community en masse for the first time. At Muslim Hunt, hunting a product is often the same thing as launching a product — makers hunt their own product when they\'re ready to launch it. However, products can also be hunted by others; anyone with an account. People hunt products because they like them and want to share them.',
                order: 3
              },
              {
                id: '4',
                term: 'Launch Page',
                definition: 'On Muslim Hunt, when you hunt a new product, that product is given a launch page. On this page, visitors can view details about the product (like who made it) as well as comment on it, upvote it, and more.',
                order: 4
              },
              {
                id: '5',
                term: 'First comment',
                definition: 'The first comment is the first comment left on a product\'s launch page. It appears right below the gallery so it\'s highly visible. For makers, the first comment offers an opportunity to deep dive into the story behind your product, like why you made it and what its best features are. 70% of products that have reached Product of the Day had a first comment left by the maker.',
                order: 5
              },
              {
                id: '6',
                term: 'Product Page',
                definition: 'Product Pages are your single source of truth, the place to find everything about a product\'s journey including launches, reviews, job openings, and more.',
                order: 6
              },
              {
                id: '7',
                term: 'Product of the Day',
                definition: 'Muslim Hunt\'s homepage features a leaderboard, where members of the (free) community upvote their favorite products. New products are added by community members every day. These products compete to reach the top of the leaderboard, or Product of the Day. The Product of the Day is determined via a confidential algorithm that evaluates all of the day\'s featured products using upvotes, time since posting, and a number of other factors. Product of the Week and Product of the Month awards are also given.',
                order: 7
              }
            ],
            metadata: { brand: 'Muslim Hunt', vibe: 'Muslim vibes', section: 'definitions' }
          }
        ]);
      } else if (data) {
        setSections([{
          id: 'definitions',
          title: 'Definitions',
          content: 'A glossary for navigating Muslim Hunt and common terminology.',
          definitions: data.map((item: any) => ({
            id: item.id,
            term: item.term,
            definition: item.definition,
            order: item.display_order
          })),
          metadata: { brand: 'Muslim Hunt', vibe: 'Muslim vibes', section: 'definitions' }
        }]);
      }
      setLoading(false);
    };

    fetchContent();
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
      setActiveSection(sectionId);
      window.history.pushState(null, '', `#${sectionId}`);
    }
  };

  const filteredDefinitions = sections[0]?.definitions.filter((def) =>
    def.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    def.definition.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Navigation */}
      <nav className="sticky top-16 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide py-4">
            {sections.map((section) => {
              const isActive = activeSection === section.id;

              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all shrink-0 text-sm font-bold ${
                    isActive
                      ? 'bg-primary text-white shadow-lg'
                      : 'bg-gray-50 text-gray-600 hover:bg-primary-light hover:text-primary'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>{section.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-amber-50 via-white to-orange-50 border-b border-gray-100 py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] mb-4 sm:mb-6">
            <BookOpen className="w-3 h-3" />
            Definitions
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-primary mb-4 sm:mb-6">
            Muslim Hunt Glossary
          </h1>
          <p className="text-base sm:text-xl text-gray-600 leading-relaxed font-medium max-w-2xl mx-auto">
            A glossary for navigating Muslim Hunt and common terminology. Learn the lingo with those Muslim vibes!
          </p>

          {/* Search Bar */}
          <div className="mt-8 sm:mt-10 max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search definitions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none text-base"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onBack}
              className="w-full sm:w-auto px-8 py-3 bg-white hover:bg-gray-50 text-primary font-black rounded-xl transition-all border-2 border-primary inline-flex items-center justify-center gap-2"
            >
              Back to Launch Guide
            </button>
          </div>
        </div>
      </div>

      {/* Definitions List */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="space-y-6">
          {filteredDefinitions.map((definition, index) => (
            <div
              key={definition.id}
              id={definition.term.toLowerCase().replace(/\s+/g, '-')}
              className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-6 sm:p-8 hover:border-primary-light hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                  <Info className="w-5 sm:w-6 h-5 sm:h-6 text-amber-700" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl font-bold text-primary mb-3">
                    {definition.term}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    {definition.definition}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {filteredDefinitions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No definitions found matching "{searchTerm}"</p>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="mt-16 sm:mt-24 bg-gradient-to-br from-primary to-primary-dark rounded-2xl sm:rounded-[2.5rem] p-8 sm:p-12 text-center text-white">
          <h2 className="text-2xl sm:text-4xl font-serif font-bold mb-4">
            Ready to Join Muslim Hunt?
          </h2>
          <p className="text-base sm:text-lg text-primary-light mb-6 sm:mb-8 max-w-2xl mx-auto">
            Now that you understand the terminology, you're ready to launch your product and join our amazing community of Muslim makers!
          </p>
          <button className="px-8 sm:px-10 py-4 sm:py-5 bg-white text-primary font-black rounded-xl sm:rounded-2xl hover:bg-gray-50 transition-all shadow-xl active:scale-95 text-base sm:text-lg">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default Definitions;
