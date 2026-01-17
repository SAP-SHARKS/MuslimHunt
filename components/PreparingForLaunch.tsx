import React, { useState, useEffect } from 'react';
import { ChevronDown, Rocket, CheckSquare, Users, CheckCircle2, ArrowRight, Sparkles, Clipboard } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface PreparingForLaunchProps {
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

const PreparingForLaunch: React.FC<PreparingForLaunchProps> = ({ onBack }) => {
  const [activeSection, setActiveSection] = useState('content-checklist');
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch content from Supabase
  useEffect(() => {
    const fetchContent = async () => {
      const { data, error } = await supabase
        .from('launch_content')
        .select('*')
        .eq('is_active', true)
        .eq('metadata->>section', 'preparing-for-launch');

      if (error) {
        console.error('Error fetching launch content:', error);
        // Fallback to default content
        setSections([
          {
            id: 'content-checklist',
            title: 'Content checklist',
            content: `Below we have recapped all fields and forms that you'll come across when submitting your product, along with best practices for each so you can prepare anything you want ahead of time. Note that all of your work will be auto-saved and accessible as a draft, so you don't need to have all the information at once.

**URL** - A direct link to the primary product page, usually your own landing page or homepage where the product can be used or downloaded. In some cases, your URL might otherwise be a link to an external site, like the App Store or a GitHub repo. Shortened links (e.g. bit.ly) and track links (e.g. Google UTMs) are not accepted. If this is your second time submitting the same product in less than six months, see here.

**Name of the product** - Only the product's name, no description or emojis (unless it is a legit part of the name).

Good: "Meow On-Demand App"
NOT allowed: "Kitty sounds you'll love" or the "The best cat app"

**Tagline (max 60 characters)** - A very short description of the product — no gimmicks or over-the-top language. Don't make it hard for the community to understand what the product does. This is typically the main element that drives someone to click on a product from the homepage and learn more.

Good: "Send your friends a voicemail meow from a real cat."
NOT allowed: "The most ameozing app in the app store"

**Links (optional)** - If the product has additional links, such as to the App Store, Google Play, Amazon, etc., you can add them here.

**X handle (optional)** - This should be your product's handle, in most cases, not your personal one.

**Description (max 500 characters)** - This is where you can give more information about what the product is and/or does. It's good practice to have a short, concise explanation of your value proposition and features.

**Launch tags** - Choose up to 3 launch tags that strongly relate to your launch. We suggest including at least a few so your product will show up on our launch tag pages.

**Thumbnail (required)** - Use an image with square dimensions. We recommend 240x240. GIFs for the thumbnail are popular and they can look sharp as hell, but note that they aren't necessarily tied to success. Less than a third of Product of the Day products used an animated GIF as a thumbnail. All images, GIF or not, need to be under 3MB. Note that GIFs do not autoplay (they animate on hover) so you will need to ensure that the first frame is what you would like to appear as the thumbnail. GIFs with strobing effects, quick cuts, unreadable text, etc. are not recommended and may be edited by the Muslim Hunt team.

**Gallery images (Two required)** - We highly recommend putting some thought into your gallery images. While some technical products only need a couple images, others might need many. Animated GIFs can also be used. The recommended size for images in the gallery is 1270x760. You can upload multiple images to the gallery at once. Once the images have been uploaded, you can also drag and drop them to re-order them. The gallery will need 2+ images before it is viewable on the post page.

**Video (optional)** - About 53% of products that reached Product of the Day since 2021 include a video, so videos can help depending on what your product is, but aren't always necessary. If you don't have a budget for a high end video, consider doing a quick demo with a video tool (e.g. Loom). This can go a long way to helping the community see your product in action, and helps personalize your message. For uploading, only YouTube links are supported. Make sure your video is not set to private. You'll also need the full URL; shortened links will not load.

One fun thing to note: The community does appreciate some fun and that can create buzz. For the 2021 Golden Kitty Awards we gave away an award for Best Video. Check out the winner (it will make you LOL).

**Interactive Demo** - The most successful launches tell a compelling story of the product, including showing what the user interface looks and feels like. Build your demo with Arcade, Storylane, Hexus, Supademo, Layerpath, or ScreenSpace — all are free for Muslim Hunt launches.

**Makers** - We'll ask you if you are one of the makers of the product. You can also add your co-makers here. You will need their Muslim Hunt usernames, so make sure they've created an account well before launch day so they can join the conversation and are credited for their hard work.

**Shoutouts** - Share the tools that helped you bring your product to life. You only get three shoutouts per product launch, so make sure you're spreading love to the ones who had the most impact on your journey.

**Pricing** - There are three options: free, paid, and paid (with a free trial or plan). Select the option that correctly describes your product's pricing status.

**Promo** - If you'd like to offer a promo code for the Muslim Hunt community, you can add it here. All input fields are required: "What is the offer?," "promo code," and "expiration date." See more advice about promo codes here.

**First comment** - Be sure to kick off the conversation with a comment about the product. This is a very important part of your launch — 70% of products who achieved Product of the Day, Week, or Month had a first comment by the maker. Read more advice in the next section.

**Launch/Schedule** - You can now schedule your launch up to 1 month in advance so that you can tease it, drive traffic, and collect followers well before your big day (which we highly suggest!).

If you're ready for your launch to go live right away, you can select the "Launch now" option.

Find info on the best time to launch here.

For troubleshooting during the building of your launch page, reach out to our support team using the chat button on the bottom right corner of the website.`,
            metadata: { brand: 'Muslim Hunt', vibe: 'Muslim vibes', section: 'preparing-for-launch' }
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

      // Handle examples/lines starting with "Good:" or "NOT allowed:"
      if (line.startsWith('Good:') || line.startsWith('NOT allowed:')) {
        const isGood = line.startsWith('Good:');
        return (
          <p key={idx} className={`text-sm sm:text-base leading-relaxed mb-2 pl-4 ${isGood ? 'text-green-600' : 'text-red-600'}`}>
            {line}
          </p>
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
                  <Clipboard className="w-4 h-4" />
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
            <CheckSquare className="w-3 h-3" />
            Preparing for Launch
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-primary mb-4 sm:mb-6">
            Get Everything Ready
          </h1>
          <p className="text-base sm:text-xl text-gray-600 leading-relaxed font-medium max-w-2xl mx-auto">
            A comprehensive checklist to help you prepare all the content you need for a successful launch on Muslim Hunt. Feel the Muslim vibes!
          </p>
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => scrollToSection(sections[0]?.id || 'content-checklist')}
              className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary-dark text-white font-black rounded-xl sm:rounded-2xl transition-all shadow-lg shadow-emerald-900/10 active:scale-95 inline-flex items-center justify-center gap-2"
            >
              View Checklist
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
                  <Clipboard className="w-6 sm:w-7 h-6 sm:h-7 text-primary" />
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
            You've got all the content prepared. Now it's time to make your launch happen. Join thousands of Muslim makers who have successfully launched their products!
          </p>
          <button className="px-8 sm:px-10 py-4 sm:py-5 bg-white text-primary font-black rounded-xl sm:rounded-2xl hover:bg-gray-50 transition-all shadow-xl active:scale-95 text-base sm:text-lg">
            Submit Your Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreparingForLaunch;
