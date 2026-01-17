import React, { useState, useEffect } from 'react';
import { ChevronDown, Share2, TrendingUp, CheckCircle2, ArrowRight, Sparkles, Megaphone } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SharingYourLaunchProps {
  onBack: () => void;
}

interface ContentSection {
  id: string;
  title: string;
  content: string;
  metadata: {
    brand?: string;
    vibe?: string;
    section?: string;
  };
}

const SharingYourLaunch: React.FC<SharingYourLaunchProps> = ({ onBack }) => {
  const [activeSection, setActiveSection] = useState('marketing-strategies');
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch content from Supabase
  useEffect(() => {
    const fetchContent = async () => {
      const { data, error } = await supabase
        .from('launch_content')
        .select('*')
        .eq('is_active', true)
        .eq('metadata->>section', 'sharing-your-launch');

      if (error) {
        console.error('Error fetching launch content:', error);
        // Fallback to default content
        setSections([
          {
            id: 'marketing-strategies',
            title: 'Marketing strategies',
            content: `We have a few best practices on what you should have ready for launch day.

**Update your profile**

The chances of people viewing your Muslim Hunt profile on the day you launch or the days and weeks after are much higher than usual. Take the opportunity to update your "About" section and make sure everything is polished and accurately showcases your experience, interests, goals, personal website, and social accounts. Growing followers will help you gain support for your upcoming launches!

**Landing page**

Consider creating a landing page on your website that drives people to download or use your product. Oftentimes this can be your homepage, however, sometimes such pages are cluttered with additional information and links that distract from your key launch goals. Your landing page on the other hand should be focused on the key values your product provides with one CTA that drives people to use your product.

Your landing page can even be specifically targeted to the Muslim Hunt community, especially if you're offering a special discount.

**Badges & Embeds**

We also have several badges & embeds available to add your homepage, sitewide banner, or blog. You can find them by clicking the Embed link at the top right of your Launch Page.

These tools help:

• Drive traffic to your Launch Page
• Engage your current community in your launch
• Show off the success of your launch
• Help tell your story and give context in blogs and on media pages

**Promotions and discounts**

Many Muslim Hunt users love a good deal (duh). Feel free to include a special promotion or offer on a dedicated landing page. These special launch day offers can increase engagement, help capture people's attention, and encourage people to try what you're working on (e.g. 20% off for 6 months).`,
            metadata: { brand: 'Muslim Hunt', vibe: 'Muslim vibes', section: 'sharing-your-launch' }
          }
        ]);
      } else if (data) {
        setSections(data.map((item: any) => ({
          id: item.page_id,
          title: item.title,
          content: item.content,
          metadata: item.metadata || {}
        })));
      }
      setLoading(false);
    };

    fetchContent();
  }, []);

  // Handle hash navigation on load
  useEffect(() => {
    const hash = window.location.hash.substring(1);
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          setActiveSection(hash);
        }
      }, 100);
    }
  }, [loading]);

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

  const renderContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      // Handle bold text with **
      if (line.startsWith('**') && line.endsWith('**')) {
        const text = line.slice(2, -2);
        return (
          <h3 key={idx} className="text-lg sm:text-xl font-bold text-primary mt-6 mb-4">
            {text}
          </h3>
        );
      }

      // Handle bullet points
      if (line.startsWith('• ')) {
        return (
          <li key={idx} className="text-sm sm:text-base text-gray-600 leading-relaxed mb-2 ml-4">
            {line.slice(2)}
          </li>
        );
      }

      // Regular paragraphs
      if (line.trim()) {
        return (
          <p key={idx} className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
            {line}
          </p>
        );
      }

      return null;
    });
  };

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
                  <Megaphone className="w-4 h-4" />
                  <span>{section.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-orange-50 via-white to-yellow-50 border-b border-gray-100 py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100 text-orange-600 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] mb-4 sm:mb-6">
            <Share2 className="w-3 h-3" />
            Sharing Your Launch
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-primary mb-4 sm:mb-6">
            Marketing Strategies
          </h1>
          <p className="text-base sm:text-xl text-gray-600 leading-relaxed font-medium max-w-2xl mx-auto">
            Get ready for launch day with these proven marketing strategies. Build your presence, engage your audience, and spread those Muslim vibes!
          </p>
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => scrollToSection(sections[0]?.id || 'marketing-strategies')}
              className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary-dark text-white font-black rounded-xl sm:rounded-2xl transition-all shadow-lg shadow-emerald-900/10 active:scale-95 inline-flex items-center justify-center gap-2"
            >
              View Strategies
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={onBack}
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-gray-50 text-primary font-black rounded-xl sm:rounded-2xl transition-all border-2 border-primary inline-flex items-center justify-center gap-2"
            >
              Back to Launch Guide
            </button>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="space-y-16 sm:space-y-24">
          {sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              data-section={section.id}
              className="scroll-mt-32"
            >
              <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-orange-100 flex items-center justify-center shrink-0">
                  <Megaphone className="w-6 sm:w-7 h-6 sm:h-7 text-orange-600" />
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-primary">
                  {section.title}
                </h2>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-6 sm:p-8 hover:border-primary-light hover:shadow-md transition-all">
                <div className="prose prose-sm sm:prose max-w-none">
                  {renderContent(section.content)}
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 sm:mt-24 bg-gradient-to-br from-primary to-primary-dark rounded-2xl sm:rounded-[2.5rem] p-8 sm:p-12 text-center text-white">
          <h2 className="text-2xl sm:text-4xl font-serif font-bold mb-4">
            Ready to share your launch?
          </h2>
          <p className="text-base sm:text-lg text-primary-light mb-6 sm:mb-8 max-w-2xl mx-auto">
            Use these marketing strategies to maximize your launch impact. Engage your community, drive traffic, and make your Muslim Hunt launch a success!
          </p>
          <button className="px-8 sm:px-10 py-4 sm:py-5 bg-white text-primary font-black rounded-xl sm:rounded-2xl hover:bg-gray-50 transition-all shadow-xl active:scale-95 text-base sm:text-lg">
            Start Sharing
          </button>
        </div>
      </div>
    </div>
  );
};

export default SharingYourLaunch;
