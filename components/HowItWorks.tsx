import React, { useState, useEffect } from 'react';
import { ChevronDown, Rocket, TrendingUp, Users, Star, Calendar, MessageSquare, Trophy, Zap, CheckCircle2, ArrowRight } from 'lucide-react';

interface HowItWorksProps {
  onBack: () => void;
}

interface Section {
  id: string;
  title: string;
  icon: any;
  content: {
    question: string;
    answer: string;
  }[];
}

const HowItWorks: React.FC<HowItWorksProps> = ({ onBack }) => {
  const [activeSection, setActiveSection] = useState('why-launch');
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({});

  // Auto-set active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('[data-section]');
      let currentSection = '';

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 150 && rect.bottom >= 150) {
          currentSection = section.getAttribute('data-section') || '';
        }
      });

      if (currentSection && currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection]);

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
  }, []);

  const toggleQuestion = (id: string) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

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

  const sections: Section[] = [
    {
      id: 'why-launch',
      title: 'Why should I launch on Muslim Hunt?',
      icon: Rocket,
      content: [
        {
          question: 'Get discovered by the Ummah tech community',
          answer: 'Muslim Hunt is the premier platform for discovering halal and Muslim-friendly products. Launch here to reach thousands of early adopters, developers, and entrepreneurs from the global Muslim community who are actively seeking innovative solutions.'
        },
        {
          question: 'Gain valuable feedback from Muslims worldwide',
          answer: 'The Muslim Hunt community is known for providing thoughtful, constructive feedback. You\'ll receive insights from users who understand the unique needs of Muslim consumers, helping you refine your product and ensure it aligns with Islamic values and principles.'
        },
        {
          question: 'Build credibility with halal certification',
          answer: 'Muslim Hunt features a unique halal verification system. Products can be marked as "Certified," "Self-Certified," or "Shariah-Compliant," building trust with users who prioritize halal products and services. This credibility can be a major differentiator in your market.'
        },
        {
          question: 'Drive traffic and acquire early users',
          answer: 'A successful launch on Muslim Hunt can drive significant traffic to your product. Many startups have found their first 100, 1000, or even 10,000 users through the platform. The community actively engages with new launches, providing both upvotes and genuine interest.'
        },
        {
          question: 'Attract Muslim investors and media attention',
          answer: 'Muslim Hunt is closely watched by investors, journalists, and influencers in the Muslim tech ecosystem. A trending product can lead to funding opportunities, press coverage, and partnerships that accelerate your growth within the Ummah and beyond.'
        }
      ]
    },
    {
      id: 'what-is-muslim-hunt',
      title: 'What is Muslim Hunt?',
      icon: TrendingUp,
      content: [
        {
          question: 'A curated community for halal products',
          answer: 'Muslim Hunt is a platform where the Muslim community discovers, shares, and discusses the best new halal and Muslim-friendly products every day. We curate mobile apps, websites, SaaS tools, hardware, and tech creations that serve the needs of Muslims worldwide.'
        },
        {
          question: 'Made by makers, for makers',
          answer: 'The Muslim Hunt community consists of Muslim entrepreneurs, developers, designers, investors, early adopters, and tech enthusiasts. It\'s a space where makers can showcase their work and receive feedback from others who share their values and understand their mission.'
        },
        {
          question: 'Daily leaderboard and rankings',
          answer: 'Every day, products compete on the homepage leaderboard. The community votes on products, and the most popular ones earn badges like "Product of the Day," "Product of the Week," and "Product of the Month." These badges provide social proof and visibility.'
        },
        {
          question: 'More than just a launch platform',
          answer: 'Muslim Hunt is also a community hub with discussion forums, maker stories, launch guides, and resources specifically designed for Muslim entrepreneurs. It\'s a place to connect, learn, share sadaqah initiatives, and grow together as an Ummah.'
        }
      ]
    },
    {
      id: 'how-it-works',
      title: 'How does Muslim Hunt work?',
      icon: Users,
      content: [
        {
          question: 'Create your free account',
          answer: 'Sign up with your email or social account. Muslim Hunt is completely free for both makers and community members. You can create a personal profile, customize your bio, and start engaging with the community immediately.'
        },
        {
          question: 'Submit your product',
          answer: 'Click the "Submit" button and fill out the product submission form. Include your product name, tagline, description, logo, URL, category, halal status, and optional sadaqah information. You can also add pricing details and special offers for the community.'
        },
        {
          question: 'Products are reviewed and approved',
          answer: 'Our moderation team reviews all submissions to ensure they meet community guidelines. We check for quality, relevance to the Muslim community, and appropriate halal certification claims. This typically takes 24-48 hours.'
        },
        {
          question: 'Launch day begins at 12:01 AM PST',
          answer: 'Products go live at midnight Pacific Time. The 24-hour leaderboard resets daily, giving every product a fair chance to compete. Products earn upvotes and comments throughout the day, climbing the rankings based on community engagement.'
        },
        {
          question: 'Engage with your community',
          answer: 'Respond to comments, answer questions, and thank supporters. Active engagement significantly increases your chances of success. Share your launch across social media and encourage your network to visit and support your product on Muslim Hunt.'
        },
        {
          question: 'Earn badges and recognition',
          answer: 'Top products earn badges like "#1 Product of the Day," "#1 Product of the Week," or "#1 Product of the Month." These badges appear on your product page and can be displayed on your website to build trust and credibility.'
        }
      ]
    },
    {
      id: 'best-day',
      title: 'Best day to launch on Muslim Hunt?',
      icon: Calendar,
      content: [
        {
          question: 'Launch when you\'re most prepared',
          answer: 'The best day to launch is when you and your team are ready to dedicate time and energy to engaging with the community. Launching requires active participation—responding to comments, sharing on social media, and building momentum throughout the day.'
        },
        {
          question: 'Tuesday to Thursday see highest traffic',
          answer: 'Historically, Tuesday, Wednesday, and Thursday tend to have the highest traffic and engagement on Muslim Hunt. These mid-week days attract the most community members, increasing your potential for upvotes and visibility.'
        },
        {
          question: 'Consider competition and timing',
          answer: 'Check the Muslim Hunt homepage before you launch to see what other products are scheduled. If there are several major launches on the same day, you might face more competition. Sometimes launching on a quieter day can help you stand out.'
        },
        {
          question: 'Align with your marketing calendar',
          answer: 'Coordinate your Muslim Hunt launch with other marketing activities—press releases, email announcements, social media campaigns. This creates a multiplier effect, driving more traffic and engagement across all channels.'
        },
        {
          question: 'Ramadan and Islamic holidays',
          answer: 'Consider launching during Ramadan or around Islamic holidays when the Muslim community is particularly active and engaged. However, be mindful that some users may be fasting or focused on worship, so test your timing carefully.'
        }
      ]
    },
    {
      id: 'when-to-launch',
      title: 'When to launch on Muslim Hunt?',
      icon: Star,
      content: [
        {
          question: '12:01 AM Pacific Time is optimal',
          answer: '12:01 AM PST (Pacific Standard Time) is the best time to launch if you want maximum exposure throughout the entire 24-hour period. Launching at the start of the day ensures you\'re among the first products users see when they visit Muslim Hunt.'
        },
        {
          question: 'Early upvotes create momentum',
          answer: 'Products that receive upvotes early in the day tend to maintain their position on the leaderboard. Early momentum attracts more attention, creating a virtuous cycle of engagement. Coordinate with your team and supporters to upvote immediately at launch.'
        },
        {
          question: 'Be ready to engage all day',
          answer: 'Plan to be active on Muslim Hunt throughout your launch day. The first few hours are crucial, but engagement throughout the entire 24 hours can help you maintain your position and maximize your results. Set aside time to respond to every comment and question.'
        },
        {
          question: 'Time zone considerations',
          answer: 'Muslim Hunt operates on Pacific Time (PST/PDT). If you\'re in a different time zone, plan accordingly. For example, if you\'re in London (GMT), 12:01 AM PST is 8:01 AM. If you\'re in Dubai (GST), it\'s 12:01 PM. Make sure your team is available at the right time.'
        }
      ]
    },
    {
      id: 'company-accounts',
      title: 'Can I create a company account?',
      icon: MessageSquare,
      content: [
        {
          question: 'Only personal accounts are allowed',
          answer: 'Muslim Hunt is built around individual makers and their personal journeys. Even if you\'re representing a company or organization, you should create a personal account. This helps maintain authenticity and trust within the community.'
        },
        {
          question: 'Associate products with your personal account',
          answer: 'When you submit a product, you can indicate whether you worked on it as a maker. Your personal profile will be linked to the products you create, building your reputation as a builder in the Muslim tech community.'
        },
        {
          question: 'Build your personal brand',
          answer: 'By using a personal account, you\'re building your own brand as a maker. This has long-term benefits—people follow makers, not just companies. Your personal profile becomes a portfolio of your work and contributions to the Ummah.'
        },
        {
          question: 'Team members can create individual accounts',
          answer: 'If multiple people from your company want to be active on Muslim Hunt, each person should create their own account. You can all be associated with the same product as makers, and each can engage with the community from their personal perspective.'
        }
      ]
    },
    {
      id: 'already-hunted',
      title: 'What if someone else already hunted my product?',
      icon: Trophy,
      content: [
        {
          question: 'You can claim it as a maker',
          answer: 'If someone else has submitted your product to Muslim Hunt, don\'t worry! Visit the product page and look for the "Claim as Maker" button. Click it and follow the verification process to prove you\'re associated with the product.'
        },
        {
          question: 'Verification process',
          answer: 'To claim a product, you\'ll need to verify your identity. This typically involves confirming your email address, linking your social profiles, or demonstrating ownership of the product\'s domain. Our team reviews all claims to prevent fraud.'
        },
        {
          question: 'Engage as a maker',
          answer: 'Once you\'ve claimed your product, you\'ll be marked as a "Maker" on the product page. This allows you to respond to comments with authority, update product information, and build relationships with community members who discover your work.'
        },
        {
          question: 'Thank the community member who hunted it',
          answer: 'It\'s considered good etiquette to thank the person who submitted your product. They took time to share your work with the community! Engage with them in the comments and show appreciation for their support.'
        }
      ]
    },
    {
      id: 'success-metrics',
      title: 'How do I measure success?',
      icon: Zap,
      content: [
        {
          question: 'Upvotes and ranking',
          answer: 'The most visible metric is upvotes. However, success isn\'t just about reaching #1. Even products ranked in the top 10 or top 20 can gain significant exposure and traffic. Focus on consistent engagement rather than just the final ranking.'
        },
        {
          question: 'Comments and engagement',
          answer: 'Quality comments and discussions are often more valuable than upvotes alone. Engaged users ask questions, provide feedback, and become early advocates for your product. Pay attention to the depth and quality of conversations on your product page.'
        },
        {
          question: 'Traffic and user acquisition',
          answer: 'Track referral traffic from Muslim Hunt using analytics tools. Monitor signups, trials, and conversions from Muslim Hunt visitors. The real success metric is how many community members become actual users or customers of your product.'
        },
        {
          question: 'Long-term community relationships',
          answer: 'Muslim Hunt success extends beyond launch day. Users who engage with your product can become long-term supporters, beta testers, and evangelists. Build relationships that last beyond the 24-hour launch period.'
        },
        {
          question: 'Media and investor attention',
          answer: 'Track mentions in tech blogs, social media shares, and investor inquiries that result from your launch. These secondary effects can be just as important as the direct metrics on the Muslim Hunt platform.'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Navigation */}
      <nav className="sticky top-16 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide py-4">
            {sections.map((section) => {
              const Icon = section.icon;
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
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{section.title}</span>
                  <span className="sm:hidden">{section.title.split(' ').slice(0, 2).join(' ')}</span>
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
            <Rocket className="w-3 h-3" />
            How It Works
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-primary mb-4 sm:mb-6">
            Everything you need to know about launching on Muslim Hunt
          </h1>
          <p className="text-base sm:text-xl text-gray-600 leading-relaxed font-medium max-w-2xl mx-auto">
            Get discovered by thousands of Muslim tech enthusiasts, gain valuable feedback, and grow your halal product with the support of the Ummah.
          </p>
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => scrollToSection('why-launch')}
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
          {sections.map((section) => {
            const Icon = section.icon;

            return (
              <section
                key={section.id}
                id={section.id}
                data-section={section.id}
                className="scroll-mt-32"
              >
                <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-primary-light flex items-center justify-center shrink-0">
                    <Icon className="w-6 sm:w-7 h-6 sm:h-7 text-primary" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-primary">
                    {section.title}
                  </h2>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  {section.content.map((item, idx) => {
                    const itemId = `${section.id}-${idx}`;
                    const isExpanded = expandedQuestions[itemId];

                    return (
                      <div
                        key={idx}
                        className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl overflow-hidden transition-all hover:border-primary-light hover:shadow-md"
                      >
                        <button
                          onClick={() => toggleQuestion(itemId)}
                          className="w-full flex items-center justify-between p-4 sm:p-6 text-left group"
                        >
                          <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                            <CheckCircle2 className={`w-5 sm:w-6 h-5 sm:h-6 shrink-0 mt-0.5 transition-colors ${isExpanded ? 'text-primary' : 'text-gray-300'}`} />
                            <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">
                              {item.question}
                            </h3>
                          </div>
                          <ChevronDown
                            className={`w-5 h-5 shrink-0 ml-2 text-primary transition-transform ${
                              isExpanded ? 'rotate-180' : ''
                            }`}
                          />
                        </button>

                        {isExpanded && (
                          <div className="px-4 sm:px-6 pb-4 sm:pb-6 pl-12 sm:pl-16 animate-in slide-in-from-top-2 duration-200">
                            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                              {item.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="mt-16 sm:mt-24 bg-gradient-to-br from-primary to-primary-dark rounded-2xl sm:rounded-[2.5rem] p-8 sm:p-12 text-center text-white">
          <h2 className="text-2xl sm:text-4xl font-serif font-bold mb-4">
            Ready to launch on Muslim Hunt?
          </h2>
          <p className="text-base sm:text-lg text-primary-light mb-6 sm:mb-8 max-w-2xl mx-auto">
            Join thousands of Muslim makers who have successfully launched their products on our platform. Start your journey today!
          </p>
          <button className="px-8 sm:px-10 py-4 sm:py-5 bg-white text-primary font-black rounded-xl sm:rounded-2xl hover:bg-gray-50 transition-all shadow-xl active:scale-95 text-base sm:text-lg">
            Submit Your Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
