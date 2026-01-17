import React, { useState, useEffect } from 'react';
import { ChevronDown, Rocket, CheckSquare, CheckCircle2, ArrowRight, Sparkles, Target } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface LaunchDayDutiesProps {
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

const LaunchDayDuties: React.FC<LaunchDayDutiesProps> = ({ onBack }) => {
  const [activeSection, setActiveSection] = useState('launch-day-duties');
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch content from Supabase
  useEffect(() => {
    const fetchContent = async () => {
      const { data, error } = await supabase
        .from('launch_content')
        .select('*')
        .eq('is_active', true)
        .eq('metadata->>section', 'launch-a-product');

      if (error) {
        console.error('Error fetching launch content:', error);
        // Fallback to default content
        setSections([
          {
            id: 'launch-day-duties',
            title: 'Launch Day duties',
            content: `Now that you know what to expect, let's talk about the things you should keep an eye on for launch day.

This article covers:

• Track your progress
• How do products get in the newsletter
• Claiming your Product Page

**Track your progress**

The Launch Day dashboard is a great place to keep an eye on the performance of your launch. It will track your position, upvotes, comments, and reviews throughout the day (and after launch day). You can also easily see and reply to the latest comments and get embeddable badges to drive traffic from your website to your launch.

**How do products get in the newsletter**

If you didn't know, Muslim Hunt actually started as a newsletter back in 2013! Today, our Daily Digest newsletter is how more than half a million readers learn about new products. It gets delivered every weekday and includes the previous day's top 10 most upvoted products.

We also have an editorial section where we highlight trends, curate collections, and talk about the buzziest launches. This means even if you didn't make it to the top of the leaderboard, you still have a chance of getting into the newsletter. The best thing you can do to make it into the Daily Digest is to focus on having a successful launch, using the tips we provide on this page. Great content, like a thoughtful first comment, goes a long way in giving us the tools our writers need to tell your story.

**Claiming your Product Page**

When you post a product, you create a Launch Page and a Product Page. Almost everything in this guide up until now has been about your Launch Page. While Launch Pages drive awareness and traffic during your launch milestone, Product Pages are the single source of truth for people to follow along on your product's journey as you grow.

You should request access to edit your Product Page as soon as you launch. You can do this by clicking "Claim this page" or "Request access to manage this page" on the Product Page.

We'll cover how Muslim Hunt Product Pages can help you engage your community and drive more traffic to your product long after launch. It's helpful to know what your Product Page is and claim it now because you can start collecting followers right away since, those who upvote your launch will become followers of your Product Page too.`,
            metadata: { brand: 'Muslim Hunt', vibe: 'Muslim vibes', section: 'launch-a-product' }
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
                  <Target className="w-4 h-4" />
                  <span>{section.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 border-b border-gray-100 py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 text-blue-600 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] mb-4 sm:mb-6">
            <Rocket className="w-3 h-3" />
            Launch a Product
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-primary mb-4 sm:mb-6">
            Launch Day Duties
          </h1>
          <p className="text-base sm:text-xl text-gray-600 leading-relaxed font-medium max-w-2xl mx-auto">
            Now that you know what to expect, let's talk about the things you should keep an eye on for launch day. Get ready with those Muslim vibes!
          </p>
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => scrollToSection(sections[0]?.id || 'launch-day-duties')}
              className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary-dark text-white font-black rounded-xl sm:rounded-2xl transition-all shadow-lg shadow-emerald-900/10 active:scale-95 inline-flex items-center justify-center gap-2"
            >
              View Launch Day Guide
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
                <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-blue-100 flex items-center justify-center shrink-0">
                  <Target className="w-6 sm:w-7 h-6 sm:h-7 text-blue-600" />
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
            Ready for Your Launch Day?
          </h2>
          <p className="text-base sm:text-lg text-primary-light mb-6 sm:mb-8 max-w-2xl mx-auto">
            You've got everything you need to make your launch successful. Track your progress, engage with the community, and let those Muslim vibes shine!
          </p>
          <button className="px-8 sm:px-10 py-4 sm:py-5 bg-white text-primary font-black rounded-xl sm:rounded-2xl hover:bg-gray-50 transition-all shadow-xl active:scale-95 text-base sm:text-lg">
            Launch Your Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default LaunchDayDuties;
