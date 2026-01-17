import React, { useMemo } from 'react';
import { Twitter, Linkedin, Facebook, Instagram, Github } from 'lucide-react';
import { View, Category, Product } from '../types';
import { slugify } from '../utils/searchUtils';

interface FooterProps {
  setView?: (view: View) => void;
  categories?: Category[];
  products?: Product[];
}

const Footer: React.FC<FooterProps> = ({ setView, categories = [], products = [] }) => {
  // Group categories by parent_category
  const sections = useMemo(() => {
    const grouped: Record<string, string[]> = {};
    categories.forEach(cat => {
      const parent = cat.parent_category || 'Other';
      if (!grouped[parent]) {
        grouped[parent] = [];
      }
      grouped[parent].push(cat.name);
    });

    // Sort links alphabetically within each group
    Object.keys(grouped).forEach(key => {
      grouped[key].sort();
    });

    return Object.entries(grouped).map(([title, links]) => ({
      title,
      links
    }));
  }, [categories]);

  // Derive dynamic lists for the second grid
  const dynamicCategoriesGrid = useMemo(() => {
    // 1. Trending Categories (For now, just pick some categories or separate logic if needed)
    // We can use the first 5 categories that are not already prominent, or just random
    const trendingCategories = categories.slice(0, 5).map(c => c.name);

    // 2. Top Reviewed (Most comments)
    // Note: comments is an array in Product type, so check length
    const topReviewed = [...products]
      .sort((a, b) => (b.comments?.length || 0) - (a.comments?.length || 0))
      .slice(0, 5)
      .map(p => p.name);

    // 3. Trending Products (Most upvotes)
    const trendingProducts = [...products]
      .sort((a, b) => (b.upvotes_count || 0) - (a.upvotes_count || 0))
      .slice(0, 5)
      .map(p => p.name);

    // 4. Top Forum Threads
    const topForumThreads = [
      { name: "General", slug: "general" },
      { name: "Vibecoding", slug: "vibecoding" },
      { name: "Questions", slug: "questions" },
      { name: "Introduce yourself", slug: "introduce-yourself" }
    ];

    return [
      {
        title: "Trending Categories",
        links: trendingCategories.length > 0 ? trendingCategories : ["Muslim Tech Ecosystem", "Shariah Fintech", "Quranic EdTech", "Halal Travel Guides", "Spirituality Tools"]
      },
      {
        title: "Top Reviewed",
        links: topReviewed.length > 0 ? topReviewed : ["QuranFlow 2.0", "HalalWallet", "ArabicHero", "MasjidFinder", "NikahMatch"]
      },
      {
        title: "Trending Products",
        links: trendingProducts.length > 0 ? trendingProducts : ["SunnahSleep", "SalahSync", "ZakatStream", "MuslimMind", "UmmahConnect"]
      },
      {
        title: "Top Forum Threads",
        links: topForumThreads
      }
    ];
  }, [categories, products]);

  return (
    <footer className="bg-gray-900 text-gray-400 py-8 mt-10 border-t" style={{ borderColor: 'var(--color-primary-alpha-20)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Main Categories Section (Dynamic from Supabase) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="text-gray-100 font-bold text-[11px] uppercase tracking-[0.2em] mb-6">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link}>
                    <a
                      href={`/categories/${slugify(link)}`}
                      className="text-[13px] transition-colors"
                      style={{ color: 'inherit' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Secondary Grid (Trending/Stats) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 mb-12" style={{ borderTop: '1px solid var(--color-primary-alpha-20)', borderBottom: '1px solid var(--color-primary-alpha-20)' }}>
          {dynamicCategoriesGrid.map((group) => (
            <div key={group.title}>
              <h3 className="text-gray-100 font-bold text-[11px] uppercase tracking-[0.2em] mb-6">
                {group.title}
              </h3>
              <ul className="space-y-3">
                {group.title === "Top Forum Threads" ? (
                  (group.links as Array<{ name: string; slug: string }>).map((thread) => (
                    <li key={thread.slug}>
                      <a
                        href={`/p/${thread.slug}`}
                        className="text-[13px] transition-colors"
                        style={{ color: 'inherit' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}
                      >
                        {thread.name}
                      </a>
                    </li>
                  ))
                ) : group.title === "Trending Categories" ? (
                  (group.links as string[]).map((link) => (
                    <li key={link}>
                      <a
                        href={`/categories/${slugify(link)}`}
                        className="text-[13px] transition-colors"
                        style={{ color: 'inherit' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}
                      >
                        {link}
                      </a>
                    </li>
                  ))
                ) : (
                  (group.links as string[]).map((link) => (
                    <li key={link}>
                      <a
                        href={`/products/${slugify(link)}`}
                        className="text-[13px] transition-colors"
                        style={{ color: 'inherit' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}
                      >
                        {link}
                      </a>
                    </li>
                  ))
                )}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 pt-8 text-[11px] font-medium tracking-tight uppercase">
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-3">
            <span className="text-gray-500 font-black tracking-widest">© 2025 MUSLIM HUNT</span>
            <button
              onClick={() => setView?.(View.NEWSLETTER)}
              className="transition-colors"
              style={{ color: 'inherit' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}
            >
              Newsletter
            </button>
            <a
              href="/about"
              className="transition-colors"
              style={{ color: 'inherit' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}
            >
              About
            </a>
            <a
              href="/help"
              className="transition-colors"
              style={{ color: 'inherit' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}
            >
              FAQ
            </a>
            <a
              href="/legal#terms"
              className="transition-colors"
              style={{ color: 'inherit' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}
            >
              Terms
            </a>
            <a
              href="/legal#privacy"
              className="transition-colors"
              style={{ color: 'inherit' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}
            >
              Privacy
            </a>
            <button
              onClick={() => setView?.(View.SPONSOR)}
              className="transition-colors"
              style={{ color: 'inherit' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}
            >
              Advertise
            </button>
            <span className="text-gray-500">Contact us: hello@muslim-hunt.vercel.app</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#" className="text-gray-500 transition-colors" onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'} onMouseLeave={(e) => e.currentTarget.style.color = ''}>
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="text-gray-500 transition-colors" onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'} onMouseLeave={(e) => e.currentTarget.style.color = ''}>
              <Linkedin className="w-4 h-4" />
            </a>
            <a href="#" className="text-gray-500 transition-colors" onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'} onMouseLeave={(e) => e.currentTarget.style.color = ''}>
              <Facebook className="w-4 h-4" />
            </a>
            <a href="#" className="text-gray-500 transition-colors" onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'} onMouseLeave={(e) => e.currentTarget.style.color = ''}>
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" className="text-gray-500 transition-colors" onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'} onMouseLeave={(e) => e.currentTarget.style.color = ''}>
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;