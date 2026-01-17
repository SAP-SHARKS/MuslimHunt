import React, { useState, useEffect } from 'react';
import { ChevronDown, Rocket, Target, Users, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface BeforeLaunchProps {
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

const BeforeLaunch: React.FC<BeforeLaunchProps> = ({ onBack }) => {
  const [activeSection, setActiveSection] = useState('setting-goals');
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch content from Supabase
  useEffect(() => {
    const fetchContent = async () => {
      const { data, error } = await supabase
        .from('launch_content')
        .select('*')
        .eq('is_active', true)
        .eq('metadata->>section', 'before-launch');

      if (error) {
        console.error('Error fetching launch content:', error);
        // Fallback to default content
        setSections([
          {
            id: 'setting-goals',
            title: 'Setting goals',
            content: `If you came across Muslim Hunt on the interwebs, you might know that a lot of people measure success by the number of upvotes they receive or the product's position on the leaderboard.

There's no doubt that "Product of the Day," or the product at the top of the leaderboard on the day of launch, is an indication of a successful launch. Some pretty epic companies have achieved the status. But that's far from the only way to measure success.

There are many reasons you may choose to launch on Muslim Hunt, and just as many goals and measures of success you can apply to your launch:

**Success Metrics:**

• **Leaderboard** (any position, not just the top!): Join the ranks of notable products like Notion, Loom, and more.
• **Upvotes**
• **Comments** (messages from the community provide helpful feedback so you adjust things like your product features or positioning, or see if you have product-market fit)
• **New followers/community members** (on Muslim Hunt or elsewhere)
• **Social media buzz**
• **Getting ahead of the competition**
• **Interest from investors**
• **Website traffic**
• **Product sales/leads, early adopters**
• **Feedback and networking**
• **Team** (people have found companies they want to work for on Muslim Hunt, or discovered partners who became co-founders)
• **Brand recognition, visibility, and reach**
• **Just getting it done!** Launching is a milestone.

**The most important point here:** You should have measurable goals that you can work towards and evaluate your launch against. We recommend tying these goals to whatever your overall company/product goals are. Product of the Day is certainly an awesome goal to strive for and our foam fingers are at the ready. However, many products that do not achieve this rank have done very well, met their goals, and had undeniably successful Muslim Hunt launches.`,
            metadata: { brand: 'Muslim Hunt', vibe: 'Muslim vibes', section: 'before-launch' }
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
        const content = line.slice(2);
        // Extract bold text within the bullet point
        const parts = content.split('**');
        return (
          <li key={idx} className="flex items-start gap-3 mb-3">
            <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <span className="text-sm sm:text-base text-gray-600 leading-relaxed">
              {parts.map((part, i) =>
                i % 2 === 1 ? <strong key={i} className="font-bold text-gray-900">{part}</strong> : part
              )}
            </span>
          </li>
        );
      }

      // Handle section headers (lines ending with :)
      if (line.endsWith(':') && line.length < 50) {
        return (
          <h4 key={idx} className="text-base sm:text-lg font-bold text-gray-900 mt-6 mb-3">
            {line}
          </h4>
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
      <div className="bg-gradient-to-br from-primary-light/20 via-white to-primary-light/10 border-b border-gray-100 py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-light text-primary text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] mb-4 sm:mb-6">
            <Sparkles className="w-3 h-3" />
            Before Launch
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-primary mb-4 sm:mb-6">
            Prepare for Your Launch
          </h1>
          <p className="text-base sm:text-xl text-gray-600 leading-relaxed font-medium max-w-2xl mx-auto">
            Set your goals, understand success metrics, and prepare everything you need for a successful launch on Muslim Hunt. Feel the Muslim vibes!
          </p>
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => scrollToSection(sections[0]?.id || 'setting-goals')}
              className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary-dark text-white font-black rounded-xl sm:rounded-2xl transition-all shadow-lg shadow-emerald-900/10 active:scale-95 inline-flex items-center justify-center gap-2"
            >
              Get Started
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
                <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-primary-light flex items-center justify-center shrink-0">
                  <Target className="w-6 sm:w-7 h-6 sm:h-7 text-primary" />
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
            Ready to launch on Muslim Hunt?
          </h2>
          <p className="text-base sm:text-lg text-primary-light mb-6 sm:mb-8 max-w-2xl mx-auto">
            You've got the goals. Now it's time to make your launch happen. Join thousands of Muslim makers who have successfully launched their products!
          </p>
          <button className="px-8 sm:px-10 py-4 sm:py-5 bg-white text-primary font-black rounded-xl sm:rounded-2xl hover:bg-gray-50 transition-all shadow-xl active:scale-95 text-base sm:text-lg">
            Submit Your Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default BeforeLaunch;
