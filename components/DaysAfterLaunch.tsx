import React, { useState, useEffect } from 'react';
import { ChevronDown, TrendingUp, Users, CheckCircle2, ArrowRight, Sparkles, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface DaysAfterLaunchProps {
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

const DaysAfterLaunch: React.FC<DaysAfterLaunchProps> = ({ onBack }) => {
  const [activeSection, setActiveSection] = useState('days-after-launch');
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch content from Supabase
  useEffect(() => {
    const fetchContent = async () => {
      const { data, error } = await supabase
        .from('launch_content')
        .select('*')
        .eq('is_active', true)
        .eq('metadata->>section', 'days-after-launch');

      if (error) {
        console.error('Error fetching launch content:', error);
        // Fallback to default content
        setSections([
          {
            id: 'days-after-launch',
            title: 'Days after your launch',
            content: `Congratulations on your launch! Now the real work begins — building and nurturing a community around your product. Here's how to keep the momentum going with that Muslim vibes energy.

**Your Muslim Hunt Product Page**

Your Product Page is your home on Muslim Hunt. Think of your Launch Page as a moment in time, while your Product Page is an evergreen resource that grows with your product.

**What you can do with your Product Page:**

• Share product updates and milestones
• Announce new features and improvements
• Collect and respond to reviews from users
• Build a following of engaged community members
• Track your product's journey and growth metrics

**Engaging with your community**

The Muslim Hunt community is here to support you beyond launch day. Here's how to stay connected:

**Respond to feedback**

Every comment, review, and piece of feedback is an opportunity to learn and improve. Engage authentically with your community. Thank supporters, address concerns, and show that you're listening. This builds trust and loyalty.

**Share regular updates**

Keep your followers in the loop about what you're working on. Major feature releases, bug fixes, behind-the-scenes content — all of this helps maintain interest and shows your commitment to the product.

**Celebrate milestones**

Hit 1,000 users? Reached profitability? Launched in a new market? Share these wins with the Muslim Hunt community. People love being part of success stories.

**Building beyond Muslim Hunt**

While Muslim Hunt is a great launchpad, your community should extend beyond any single platform:

**Create community spaces**

Consider starting a Discord server, Slack community, or forum where your users can connect with each other. These spaces foster deeper relationships and create advocates for your product.

**Newsletter and content**

Regular newsletters keep your audience engaged. Share product updates, industry insights, user stories, and tips. Quality content positions you as a thought leader in your space.

**Social media presence**

Maintain active social media accounts. Share user testimonials, feature highlights, and engage with your audience. Social proof builds credibility.

**Long-term growth strategies**

**Listen and iterate**

Your early users are your best source of truth. Pay attention to what they love, what frustrates them, and what features they're requesting. Not every piece of feedback needs to be implemented, but all of it should be considered.

**Build in public**

Share your journey — the wins and the challenges. The Muslim Hunt community appreciates authenticity. Building in public creates accountability and attracts people who want to be part of your story.

**Leverage your network**

Connect with other makers on Muslim Hunt. Share experiences, collaborate on features, cross-promote products. The Muslim Hunt community is collaborative, not competitive.

**Keep launching**

Every major update is an opportunity to launch again on Muslim Hunt. Share new versions, significant features, and pivots. Each launch brings fresh attention and validates your progress.

**Metrics that matter**

Focus on metrics that align with your goals:

• User retention and engagement
• Customer feedback and satisfaction scores
• Revenue and growth metrics
• Community size and activity
• Product usage patterns

Remember, building a community is a marathon, not a sprint. Stay consistent, stay authentic, and keep those Muslim vibes strong. Your launch was just the beginning of an incredible journey.`,
            metadata: { brand: 'Muslim Hunt', vibe: 'Muslim vibes', section: 'days-after-launch' }
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
                  <TrendingUp className="w-4 h-4" />
                  <span>{section.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-50 via-white to-blue-50 border-b border-gray-100 py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100 text-purple-600 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] mb-4 sm:mb-6">
            <Calendar className="w-3 h-3" />
            Growing a Community
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-primary mb-4 sm:mb-6">
            Days After Your Launch
          </h1>
          <p className="text-base sm:text-xl text-gray-600 leading-relaxed font-medium max-w-2xl mx-auto">
            Your launch was just the beginning. Learn how to nurture your community, keep the momentum going, and build long-term success with Muslim vibes.
          </p>
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => scrollToSection(sections[0]?.id || 'days-after-launch')}
              className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary-dark text-white font-black rounded-xl sm:rounded-2xl transition-all shadow-lg shadow-emerald-900/10 active:scale-95 inline-flex items-center justify-center gap-2"
            >
              Learn Growth Strategies
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
                <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-purple-100 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-6 sm:w-7 h-6 sm:h-7 text-purple-600" />
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
            Keep Building Your Community
          </h2>
          <p className="text-base sm:text-lg text-primary-light mb-6 sm:mb-8 max-w-2xl mx-auto">
            Your journey doesn't end at launch. Stay engaged with your users, iterate based on feedback, and keep those Muslim vibes strong!
          </p>
          <button className="px-8 sm:px-10 py-4 sm:py-5 bg-white text-primary font-black rounded-xl sm:rounded-2xl hover:bg-gray-50 transition-all shadow-xl active:scale-95 text-base sm:text-lg">
            Visit Your Product Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default DaysAfterLaunch;
