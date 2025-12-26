import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle2, ArrowRight, Star, Quote, Sparkles } from 'lucide-react';

interface ArchiveItem {
  id: string;
  date: string;
  title: string;
  preview: string;
  topLaunches?: { name: string; icon: string }[];
  featuredImage?: string;
  subtext?: string;
}

interface Testimonial {
  text: string;
  author: string;
  title: string;
  avatar: string;
}

interface NewsletterProps {
  onSponsorClick: () => void;
}

const LEADERBOARD_ARCHIVE: ArchiveItem[] = [
  {
    id: 'l1',
    date: 'MARCH 15TH, 2025',
    title: 'The future of Shariah-compliant AI',
    preview: "Great products have a story behind them. This week, we dive deep into how ethical datasets are being curated for the next generation of Muslim builders.",
    topLaunches: [
      { name: 'QuranFlow', icon: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=50&h=50&fit=crop' },
      { name: 'HalalWallet', icon: 'https://images.unsplash.com/photo-1621416848446-9914441b2a0c?w=50&h=50&fit=crop' },
      { name: 'ArabicHero', icon: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=50&h=50&fit=crop' }
    ]
  },
  {
    id: 'l2',
    date: 'MARCH 8TH, 2025',
    title: 'Building community in the digital age',
    preview: "Connecting the dots between ancient traditions and modern productivity. Why 'Sunnah Habits' are trending in the Silicon Valley ecosystem.",
    topLaunches: [
      { name: 'SunnahSleep', icon: 'https://images.unsplash.com/photo-1511295742364-917e703b5758?w=50&h=50&fit=crop' },
      { name: 'SalahSync', icon: 'https://images.unsplash.com/photo-1590076214667-c0f33b98c422?w=50&h=50&fit=crop' },
      { name: 'DeenJournal', icon: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=50&h=50&fit=crop' }
    ]
  }
];

const FRONTIER_ARCHIVE: ArchiveItem[] = [
  {
    id: 'f1',
    date: 'DECEMBER 16TH, 2025',
    title: 'Disney goes AI',
    subtext: 'Plus, five AI tools you may have missed',
    preview: '',
    featuredImage: 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=800&q=80'
  },
  {
    id: 'f2',
    date: 'DECEMBER 9TH, 2025',
    title: 'The code-first generation',
    subtext: 'How Gen Z is rebuilding the web with Vibe Coding',
    preview: '',
    featuredImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80'
  }
];

const PEOPLE_TESTIMONIALS: Testimonial[] = [
  {
    text: "Muslim Hunt is the only newsletter I actually look forward to reading. The curation is world-class.",
    author: "Cherry Jeffs",
    title: "FOUNDER @ CREATIVE DEEN",
    avatar: "https://i.pravatar.cc/150?u=cj"
  },
  {
    text: "I've discovered three of my daily-use productivity tools right here. Highly recommended.",
    author: "Bruno Thomazelli",
    title: "PRODUCT DESIGNER @ HALALPAY",
    avatar: "https://i.pravatar.cc/150?u=bt"
  },
  {
    text: "The stories behind the launches give me the motivation I need for my own startup journey.",
    author: "Samin Chowdhury",
    title: "CTO @ UMMAH CONNECT",
    avatar: "https://i.pravatar.cc/150?u=sc"
  }
];

const ArchiveCard: React.FC<{ item: ArchiveItem }> = ({ item }) => (
  <div className="bg-white border border-gray-100 rounded-[1.5rem] p-8 shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 hover:border-emerald-100 transition-all group flex flex-col h-full text-left">
    <div className="flex justify-end mb-4">
      <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] group-hover:text-emerald-400 transition-colors">
        {item.date}
      </span>
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-emerald-800 transition-colors">
      {item.title}
    </h3>
    <p className="text-gray-500 text-sm leading-relaxed mb-8 font-medium">
      {item.preview}
    </p>
    <div className="mt-auto pt-6 border-t border-gray-50">
      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-4">Top Launches</p>
      <div className="flex items-center gap-4">
        {item.topLaunches?.map((launch, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md overflow-hidden border border-gray-50 shrink-0">
              <img src={launch.icon} alt={launch.name} className="w-full h-full object-cover" />
            </div>
            <span className="text-[10px] font-bold text-gray-700 whitespace-nowrap">{launch.name}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const FrontierCard: React.FC<{ item: ArchiveItem }> = ({ item }) => (
  <div className="bg-white border border-gray-100 rounded-[1.5rem] overflow-hidden shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 hover:border-emerald-100 transition-all group flex flex-col h-full text-left">
    <div className="p-8 pb-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-800 transition-colors tracking-tight">
          {item.title}
        </h3>
        <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">
          {item.date}
        </span>
      </div>
      <p className="text-gray-400 text-sm font-medium mb-4">
        {item.subtext}
      </p>
    </div>
    <div className="px-8 pb-8 flex-1">
      <div className="aspect-video w-full rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
        <img 
          src={item.featuredImage} 
          alt={item.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
        />
      </div>
    </div>
  </div>
);

const Newsletter: React.FC<NewsletterProps> = ({ onSponsorClick }) => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
    }
  };

  return (
    <div className="bg-white min-h-screen font-sans">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto py-24 sm:py-32 px-4 text-center">
        <div className="flex justify-center mb-10">
          <div className="w-24 h-24 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center text-5xl shadow-inner border border-emerald-100/50">
            📬
          </div>
        </div>

        <div className="space-y-6 mb-12">
          <h1 className="text-5xl sm:text-6xl font-serif font-bold text-emerald-900 tracking-tight">
            The best products in your inbox
          </h1>
          <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-2xl mx-auto">
            Muslim Hunt has been curating viral products and superb tech stories for the Ummah. 
            Sign up and you'll always have something cool to share with your friends.
          </p>
        </div>

        {!isSubscribed ? (
          <div className="max-w-xl mx-auto w-full">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Your email address..."
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-8 py-5 bg-gray-50 border border-gray-100 focus:bg-white focus:border-emerald-800 rounded-[1.5rem] outline-none transition-all text-lg font-medium shadow-sm"
              />
              <button
                type="submit"
                className="px-12 py-5 bg-emerald-800 text-white rounded-[1.5rem] font-black text-lg hover:bg-emerald-900 transition-all shadow-xl shadow-emerald-900/10 active:scale-95 whitespace-nowrap"
              >
                Sign me up
              </button>
            </form>
            <div className="mt-8 pt-8 border-t border-gray-50 w-full text-center">
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">
                Join 12,000+ builders and creators
              </p>
              <button 
                onClick={(e) => { e.preventDefault(); onSponsorClick(); }}
                className="group inline-flex items-center gap-2 text-[11px] font-black text-emerald-800 hover:text-emerald-900 transition-colors uppercase tracking-[0.2em]"
              >
                WANT TO SPONSOR A NEWSLETTER? FIND OUT MORE
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ) : (
          <div className="p-12 bg-emerald-50 rounded-[3rem] border border-emerald-100 flex flex-col items-center gap-6 animate-in zoom-in-95 duration-300 max-w-xl mx-auto">
            <CheckCircle2 className="w-16 h-16 text-emerald-600" />
            <div className="text-center">
              <h3 className="text-2xl font-bold text-emerald-900 mb-2">You're on the list!</h3>
              <p className="text-emerald-700 font-medium text-lg">Bismillah! Welcome to the family. Expect magic in your inbox soon.</p>
            </div>
          </div>
        )}
      </section>

      {/* Archive Section */}
      <section className="bg-gray-50/50 py-32 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-24">
            <h2 className="text-5xl font-serif font-bold text-emerald-900 mb-4 tracking-tight">
              See for yourself
            </h2>
            <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
              Great products have a story behind them. We'll connect the dots and make it make sense.
            </p>
          </div>

          <div className="space-y-32">
            {/* The Leaderboard */}
            <div className="space-y-10">
              <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                <h3 className="text-2xl font-serif font-bold text-gray-900 tracking-tight flex items-center gap-2 group cursor-pointer">
                  The Leaderboard <ArrowRight className="w-6 h-6 text-emerald-800 group-hover:translate-x-1 transition-transform" />
                </h3>
                <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Weekly Recap</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {LEADERBOARD_ARCHIVE.map(item => <ArchiveCard key={item.id} item={item} />)}
              </div>
            </div>

            {/* The Frontier */}
            <div className="space-y-10">
              <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                <h3 className="text-2xl font-serif font-bold text-gray-900 tracking-tight flex items-center gap-2 group cursor-pointer">
                  The Frontier <ArrowRight className="w-6 h-6 text-emerald-800 group-hover:translate-x-1 transition-transform" />
                </h3>
                <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Tech Deep Dives</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {FRONTIER_ARCHIVE.map(item => <FrontierCard key={item.id} item={item} />)}
              </div>
            </div>
          </div>

          <div className="mt-32 text-center">
            <button className="px-10 py-4 bg-white border border-gray-200 rounded-full font-black text-[11px] uppercase tracking-[0.2em] text-emerald-800 hover:bg-emerald-50 hover:border-emerald-800 transition-all shadow-sm active:scale-95">
              Load More Archives
            </button>
          </div>
        </div>
      </section>

      {/* Centered Premium Testimonial Section */}
      <section className="py-40 relative overflow-hidden bg-white">
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
          <Mail className="w-[40rem] h-[40rem] text-emerald-900" />
        </div>
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <p className="text-3xl sm:text-4xl font-serif italic font-bold text-emerald-900 leading-relaxed mb-12">
            "Muslim Hunt has become my #1 source for discovering what's actually happening in the Ummah's tech scene. The weekly leaderboard is essential reading."
          </p>
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-emerald-50 shadow-xl ring-4 ring-white">
              <img src="https://i.pravatar.cc/150?u=omar" alt="Omar Al-Fayed" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-black text-gray-900 text-sm tracking-tight mb-1">Omar Al-Fayed</p>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">CTO @ BARAKA TECH</p>
            </div>
          </div>
        </div>
      </section>

      {/* People Who Know Products Section */}
      <section className="py-32 bg-gray-50/30 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-24">
            <h2 className="text-4xl font-serif font-bold text-emerald-900 mb-4 tracking-tight">
              The people who know products
            </h2>
            <p className="text-xl text-gray-400 font-medium max-w-3xl mx-auto leading-relaxed">
              Curating only the best in tech is literally what we do. All day. Every day. <br className="hidden sm:block" />
              We're very good at it.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {PEOPLE_TESTIMONIALS.map((t, i) => (
              <div key={i} className="flex flex-col h-full bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
                <div className="mb-6 text-emerald-100">
                  <Quote className="w-10 h-10 rotate-180 opacity-50 fill-emerald-50" />
                </div>
                <p className="text-lg font-serif italic text-gray-700 leading-relaxed mb-10 flex-1">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-4 pt-6 border-t border-gray-50">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-emerald-50">
                    <img src={t.avatar} alt={t.author} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{t.author}</p>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{t.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-40 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-800 mx-auto mb-10 shadow-inner">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-4xl font-serif font-bold text-emerald-900 mb-6 tracking-tight">
            Ready to join the leaders?
          </h2>
          <p className="text-gray-500 font-medium mb-12">
            Get the most impactful tech stories and product launches delivered directly to your inbox. 
            Join our growing community of 12,000+ creators.
          </p>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-16 py-5 bg-emerald-800 text-white rounded-[1.5rem] font-black text-lg hover:bg-emerald-900 transition-all shadow-xl shadow-emerald-900/10 active:scale-95"
          >
            Subscribe for free
          </button>
        </div>
      </section>
    </div>
  );
};

export default Newsletter;