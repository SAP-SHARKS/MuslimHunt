import React from 'react';
import { Twitter, Linkedin, Facebook, Instagram, Github } from 'lucide-react';
import { View } from '../types';

interface FooterProps {
  setView?: (view: View) => void;
}

const Footer: React.FC<FooterProps> = ({ setView }) => {
  const sections = [
    {
      title: "Engineering & Dev",
      links: ["AI Development", "Web Frameworks", "No-code Tools", "API Management", "DevOps Tools", "Open Source"]
    },
    {
      title: "LLMs & AI",
      links: ["GPT-4o Solutions", "Ethical AI Tools", "AI Voice Generators", "Vector Databases", "ML Platforms", "AI Safety"]
    },
    {
      title: "Productivity",
      links: ["Task Management", "Halal Habit Trackers", "Focus Apps", "Collaboration Tools", "Note Taking", "Calendar Sync"]
    },
    {
      title: "Growth & Sales",
      links: ["Ethical Marketing", "CRM Platforms", "Lead Generation", "Ad Networks", "Customer Support", "SEO Tools"]
    }
  ];

  const categoriesGrid = [
    {
      title: "Trending Categories",
      links: ["Muslim Tech Ecosystem", "Shariah Fintech", "Quranic EdTech", "Halal Travel Guides", "Spirituality Tools"]
    },
    {
      title: "Top Reviewed",
      links: ["QuranFlow 2.0", "HalalWallet", "ArabicHero", "MasjidFinder", "NikahMatch"]
    },
    {
      title: "Trending Products",
      links: ["SunnahSleep", "SalahSync", "ZakatStream", "MuslimMind", "UmmahConnect"]
    },
    {
      title: "Top Forum Threads",
      links: ["Building in Public", "Best Tech Stack for Halal", "Seeking Beta Testers", "Ethical AI Future", "Community AMA"]
    }
  ];

  return (
    <footer className="bg-[#042119] text-gray-400 py-16 mt-20 border-t border-emerald-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="text-gray-100 font-bold text-[11px] uppercase tracking-[0.2em] mb-6">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-[13px] hover:text-emerald-400 transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y border-emerald-900/20 mb-12">
          {categoriesGrid.map((group) => (
            <div key={group.title}>
              <h3 className="text-gray-100 font-bold text-[11px] uppercase tracking-[0.2em] mb-6">
                {group.title}
              </h3>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-[13px] hover:text-emerald-400 transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 pt-8 text-[11px] font-medium tracking-tight uppercase">
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-3">
            <span className="text-gray-500 font-black tracking-widest">© 2025 MUSLIM HUNT</span>
            <button 
              onClick={() => setView?.(View.NEWSLETTER)}
              className="hover:text-emerald-400 transition-colors"
            >
              Newsletter
            </button>
            <a href="#" className="hover:text-emerald-400 transition-colors">Apps</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">About</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">FAQ</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Privacy</a>
            <button 
              onClick={() => setView?.(View.SPONSOR)}
              className="hover:text-emerald-400 transition-colors"
            >
              Advertise
            </button>
            <a href="#" className="hover:text-emerald-400 transition-colors italic">llms.txt</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Contact us</a>
          </div>

          <div className="flex items-center gap-6">
            <a href="#" className="text-gray-500 hover:text-emerald-400 transition-colors">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="text-gray-500 hover:text-emerald-400 transition-colors">
              <Linkedin className="w-4 h-4" />
            </a>
            <a href="#" className="text-gray-500 hover:text-emerald-400 transition-colors">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="#" className="text-gray-500 hover:text-emerald-400 transition-colors">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" className="text-gray-500 hover:text-emerald-400 transition-colors">
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;