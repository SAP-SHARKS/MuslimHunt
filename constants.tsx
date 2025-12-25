
import { Product } from './types';

export const HALAL_STATUSES = ['Certified', 'Self-Certified', 'Shariah-Compliant'] as const;

const now = Date.now();
const today = new Date().toISOString();
const yesterday = new Date(now - 86400000).toISOString();
const lastWeek = new Date(now - 3 * 86400000).toISOString();
const lastMonth = new Date(now - 15 * 86400000).toISOString();

export const INITIAL_PRODUCTS: Product[] = [
  // --- TODAY (10 Products) ---
  {
    id: 't1',
    created_at: today,
    name: 'QuranFlow 2.0',
    description: 'A beautiful, distraction-free Quran reading experience with habit tracking and professional recitations.',
    tagline: 'Build a meaningful relationship with the Quran.',
    url: 'https://example.com/quranflow',
    logo_url: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=100&h=100&fit=crop',
    founder_id: 'u_1',
    category: 'Spirituality',
    upvotes_count: 485,
    halal_status: 'Certified',
    comments: [
      { id: 'c1', user_id: 'u_1', product_id: 't1', upvotes_count: 12, username: 'Ahmed (Maker)', avatar_url: 'https://i.pravatar.cc/150?u=u_1', text: 'Assalamu Alaikum! We just launched v2.0 with a new dark mode and better audio.', created_at: today, is_maker: true },
      { id: 'c2', user_id: 'u_2', product_id: 't1', upvotes_count: 5, username: 'Sara', avatar_url: 'https://i.pravatar.cc/150?u=u_2', text: 'The interface is stunning. Love the focus on consistency.', created_at: today }
    ]
  },
  {
    id: 't2',
    created_at: today,
    name: 'ArabicHero',
    description: 'Gamified Arabic learning for kids and adults. Master the language of the Quran through interactive stories.',
    tagline: 'Master Arabic through play.',
    url: 'https://example.com/arabichero',
    logo_url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=100&h=100&fit=crop',
    founder_id: 'u_5',
    category: 'Education',
    upvotes_count: 410,
    halal_status: 'Self-Certified',
    comments: [
      { id: 'c3', user_id: 'u_3', product_id: 't2', upvotes_count: 8, username: 'Omar', avatar_url: 'https://i.pravatar.cc/150?u=u_3', text: 'My kids are actually excited to learn Arabic now. Great work!', created_at: today }
    ]
  },
  {
    id: 't3',
    created_at: today,
    name: 'SunnahSleep',
    description: 'A wellness app that tracks your sleep cycles based on Sunnah habits and early morning productivity.',
    tagline: 'Wake up for Fajr feeling refreshed.',
    url: 'https://example.com/sunnahsleep',
    logo_url: 'https://images.unsplash.com/photo-1511295742364-917e703b5758?w=100&h=100&fit=crop',
    founder_id: 'u_8',
    category: 'Health',
    upvotes_count: 320,
    halal_status: 'Shariah-Compliant'
  },
  {
    id: 't4',
    created_at: today,
    name: 'SalahSync',
    description: 'Smart widget system that syncs your local prayer times across all your Apple and Android devices.',
    tagline: 'Your prayer times, everywhere.',
    url: 'https://example.com/salahsync',
    logo_url: 'https://images.unsplash.com/photo-1590076214667-c0f33b98c422?w=100&h=100&fit=crop',
    founder_id: 'u_9',
    category: 'Spirituality',
    upvotes_count: 275,
    halal_status: 'Certified'
  },
  {
    id: 't5',
    created_at: today,
    name: 'HalalHabit',
    description: 'A productivity app for Muslims that incorporates Dhikr and reflection breaks into your work day.',
    tagline: 'Productivity with a purpose.',
    url: 'https://example.com/halalhabit',
    logo_url: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=100&h=100&fit=crop',
    founder_id: 'u_10',
    category: 'Productivity',
    upvotes_count: 180,
    halal_status: 'Self-Certified'
  },
  {
    id: 't6',
    created_at: today,
    name: 'HajjQuest',
    description: 'Interactive VR training for Hajj and Umrah. Prepare for your journey from the comfort of your home.',
    tagline: 'Experience the journey before you go.',
    url: 'https://example.com/hajjquest',
    logo_url: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=100&h=100&fit=crop',
    founder_id: 'u_11',
    category: 'Travel',
    upvotes_count: 145,
    halal_status: 'Certified'
  },
  {
    id: 't7',
    created_at: today,
    name: 'UmmahConnect',
    description: 'A privacy-focused social network for Muslim professionals and creatives to collaborate.',
    tagline: 'Network with the Global Ummah.',
    url: 'https://example.com/ummahconnect',
    logo_url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=100&h=100&fit=crop',
    founder_id: 'u_12',
    category: 'Social',
    upvotes_count: 120,
    halal_status: 'Shariah-Compliant'
  },
  {
    id: 't8',
    created_at: today,
    name: 'QiblaQuest',
    description: 'AR-powered Qibla finder with beautiful mosque architectural visualizations.',
    tagline: 'Finding the way, beautifully.',
    url: 'https://example.com/qiblaquest',
    logo_url: 'https://images.unsplash.com/photo-1564769662533-4f00a87b4056?w=100&h=100&fit=crop',
    founder_id: 'u_13',
    category: 'Travel',
    upvotes_count: 110,
    halal_status: 'Certified'
  },
  {
    id: 't9',
    created_at: today,
    name: 'ZakatStream',
    description: 'Real-time Zakat distribution dashboard for donors to see the impact of their wealth on the ground.',
    tagline: 'Transparency in every Dirham.',
    url: 'https://example.com/zakatstream',
    logo_url: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=100&h=100&fit=crop',
    founder_id: 'u_14',
    category: 'Finance',
    upvotes_count: 98,
    halal_status: 'Self-Certified'
  },
  {
    id: 't10',
    created_at: today,
    name: 'TayyibBites',
    description: 'Machine-learning powered Halal food scanner that checks ingredients against multiple Fiqh standards.',
    tagline: 'Know what you eat.',
    url: 'https://example.com/tayyibbites',
    logo_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=100&h=100&fit=crop',
    founder_id: 'u_15',
    category: 'Food',
    upvotes_count: 85,
    halal_status: 'Certified'
  },

  // --- YESTERDAY (10 Products) ---
  {
    id: 'y1',
    created_at: yesterday,
    name: 'QuranCompanion',
    description: 'An AI-powered tutor that helps you perfect your Tajweed through real-time audio feedback.',
    tagline: 'Perfect your recitation with AI.',
    url: 'https://example.com/qurancompanion',
    logo_url: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=100&h=100&fit=crop',
    founder_id: 'u_16',
    category: 'Spirituality',
    upvotes_count: 450,
    halal_status: 'Certified'
  },
  {
    id: 'y2',
    created_at: yesterday,
    name: 'HalalWallet',
    description: 'The first comprehensive Shariah-compliant crypto wallet with built-in Zakat calculation and purification features.',
    tagline: 'DeFi for the Ummah.',
    url: 'https://example.com/halalwallet',
    logo_url: 'https://images.unsplash.com/photo-1621416848446-9914441b2a0c?w=100&h=100&fit=crop',
    founder_id: 'u_17',
    category: 'Finance',
    upvotes_count: 330,
    halal_status: 'Shariah-Compliant',
    comments: [
      { id: 'c4', user_id: 'u_4', product_id: 'y2', upvotes_count: 15, username: 'Zaid', avatar_url: 'https://i.pravatar.cc/150?u=u_4', text: 'Finally a wallet that handles purification automatically!', created_at: yesterday }
    ]
  },
  {
    id: 'y3',
    created_at: yesterday,
    name: 'MuslimMind',
    description: 'A mental health and mindfulness app tailored for the Muslim identity, combining modern therapy with Islamic wisdom.',
    tagline: 'Healing for the heart and mind.',
    url: 'https://example.com/muslimmind',
    logo_url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=100&h=100&fit=crop',
    founder_id: 'u_18',
    category: 'Health',
    upvotes_count: 290,
    halal_status: 'Self-Certified'
  },
  {
    id: 'y4',
    created_at: yesterday,
    name: 'MadinahMaps',
    description: 'The definitive digital guide for visitors to the Prophet\'s City, including historical site tours and crowd alerts.',
    tagline: 'Your guide to the City of Lights.',
    url: 'https://example.com/madinahmaps',
    logo_url: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=100&h=100&fit=crop',
    founder_id: 'u_19',
    category: 'Travel',
    upvotes_count: 210,
    halal_status: 'Certified'
  },
  {
    id: 'y5',
    created_at: yesterday,
    name: 'SadaqahSpot',
    description: 'A local-first charity platform that helps you find and fund micro-projects in your own neighborhood.',
    tagline: 'Charity begins at home.',
    url: 'https://example.com/sadaqahspot',
    logo_url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=100&h=100&fit=crop',
    founder_id: 'u_20',
    category: 'Social',
    upvotes_count: 195,
    halal_status: 'Shariah-Compliant'
  },
  {
    id: 'y6',
    created_at: yesterday,
    name: 'MadrasaPro',
    description: 'Complete management system for part-time Islamic schools. Attendance, grades, and parent communication.',
    tagline: 'Scaling sacred knowledge.',
    url: 'https://example.com/madrasapro',
    logo_url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=100&h=100&fit=crop',
    founder_id: 'u_21',
    category: 'Education',
    upvotes_count: 140,
    halal_status: 'Self-Certified'
  },
  {
    id: 'y7',
    created_at: yesterday,
    name: 'SunnahStyle',
    description: 'Marketplace for ethical, sustainable, and modest fashion from independent Muslim designers.',
    tagline: 'Modesty meets sustainability.',
    url: 'https://example.com/sunnahstyle',
    logo_url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=100&h=100&fit=crop',
    founder_id: 'u_22',
    category: 'Social',
    upvotes_count: 80,
    halal_status: 'Self-Certified'
  },
  {
    id: 'y8',
    created_at: yesterday,
    name: 'EthicAds',
    description: 'A privacy-first ad network for Halal brands that respects user data and content boundaries.',
    tagline: 'Advertising, the ethical way.',
    url: 'https://example.com/ethicads',
    logo_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=100&h=100&fit=crop',
    founder_id: 'u_23',
    category: 'Finance',
    upvotes_count: 75,
    halal_status: 'Shariah-Compliant'
  },
  {
    id: 'y9',
    created_at: yesterday,
    name: 'IftarPlanner',
    description: 'Collaborative tool for Masjids and families to plan and manage community Iftars during Ramadan.',
    tagline: 'Feeding the community together.',
    url: 'https://example.com/iftarplanner',
    logo_url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=100&h=100&fit=crop',
    founder_id: 'u_24',
    category: 'Food',
    upvotes_count: 65,
    halal_status: 'Self-Certified'
  },
  {
    id: 'y10',
    created_at: yesterday,
    name: 'HijabFinder',
    description: 'Directory and community reviews for the best fabric, styling, and stores for the modern Hijabi.',
    tagline: 'Your style, vetted.',
    url: 'https://example.com/hijabfinder',
    logo_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100&h=100&fit=crop',
    founder_id: 'u_25',
    category: 'Social',
    upvotes_count: 55,
    halal_status: 'Self-Certified'
  },

  // --- LAST WEEK (10 Products) ---
  {
    id: 'w1',
    created_at: lastWeek,
    name: 'HalalInvest',
    description: 'Automated Shariah-compliant investing platform. Build your wealth without compromising your values.',
    tagline: 'Ethical investing for everyone.',
    url: 'https://example.com/halalinvest',
    logo_url: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=100&h=100&fit=crop',
    founder_id: 'u_26',
    category: 'Finance',
    upvotes_count: 480,
    halal_status: 'Shariah-Compliant'
  },
  {
    id: 'w2',
    created_at: lastWeek,
    name: 'MasjidFinder',
    description: 'The world\'s most comprehensive database of prayer spaces, including facilities info for women and accessibility.',
    tagline: 'Find your home away from home.',
    url: 'https://example.com/masjidfinder',
    logo_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100&h=100&fit=crop',
    founder_id: 'u_27',
    category: 'Travel',
    upvotes_count: 400,
    halal_status: 'Certified',
    comments: [
      { id: 'c5', user_id: 'u_6', product_id: 'w2', upvotes_count: 20, username: 'Fatima', avatar_url: 'https://i.pravatar.cc/150?u=u_6', text: 'Love the filter for separate sisters sections!', created_at: lastWeek }
    ]
  },
  {
    id: 'w3',
    created_at: lastWeek,
    name: 'NikahMatch',
    description: 'An intentional, privacy-first platform for Muslims looking for marriage. Focus on compatibility and values.',
    tagline: 'Marriage, the Sunnah way.',
    url: 'https://example.com/nikahmatch',
    logo_url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=100&h=100&fit=crop',
    founder_id: 'u_28',
    category: 'Social',
    upvotes_count: 380,
    halal_status: 'Shariah-Compliant'
  },
  {
    id: 'w4',
    created_at: lastWeek,
    name: 'DeenJournal',
    description: 'A beautiful digital journaling app that prompts you daily with Quranic verses and reflection questions.',
    tagline: 'Document your spiritual journey.',
    url: 'https://example.com/deenjournal',
    logo_url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=100&h=100&fit=crop',
    founder_id: 'u_29',
    category: 'Productivity',
    upvotes_count: 310,
    halal_status: 'Self-Certified'
  },
  {
    id: 'w5',
    created_at: lastWeek,
    name: 'ArabicKids',
    description: 'Interactive cartoons and games that teach children the foundations of the Arabic language.',
    tagline: 'The future of Arabic learning.',
    url: 'https://example.com/arabickids',
    logo_url: 'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=100&h=100&fit=crop',
    founder_id: 'u_30',
    category: 'Education',
    upvotes_count: 250,
    halal_status: 'Certified'
  },
  {
    id: 'w6',
    created_at: lastWeek,
    name: 'DuaDesk',
    description: 'A desktop application that suggests relevant Duas based on your current tasks and stress levels.',
    tagline: 'Spiritual support at your fingertips.',
    url: 'https://example.com/duadesk',
    logo_url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=100&h=100&fit=crop',
    founder_id: 'u_31',
    category: 'Spirituality',
    upvotes_count: 200,
    halal_status: 'Certified'
  },
  {
    id: 'w7',
    created_at: lastWeek,
    name: 'UmrahLog',
    description: 'The companion app for your Umrah journey. Track your rituals, notes, and photos in one place.',
    tagline: 'Memories of a lifetime.',
    url: 'https://example.com/umrahlog',
    logo_url: 'https://images.unsplash.com/photo-1564769662533-4f00a87b4056?w=100&h=100&fit=crop',
    founder_id: 'u_32',
    category: 'Travel',
    upvotes_count: 155,
    halal_status: 'Certified'
  },
  {
    id: 'w8',
    created_at: lastWeek,
    name: 'TayyibTech',
    description: 'Directory for developers to find and contribute to open-source projects serving the Ummah.',
    tagline: 'Open source for a higher purpose.',
    url: 'https://example.com/tayyibtech',
    logo_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=100&h=100&fit=crop',
    founder_id: 'u_33',
    category: 'Productivity',
    upvotes_count: 130,
    halal_status: 'Self-Certified'
  },
  {
    id: 'w9',
    created_at: lastWeek,
    name: 'SunnahSmoothies',
    description: 'Subscription box and app for healthy smoothies made with ingredients mentioned in the Quran and Sunnah.',
    tagline: 'Healthy body, healthy soul.',
    url: 'https://example.com/sunnahsmoothies',
    logo_url: 'https://images.unsplash.com/photo-1502741224143-90386d7f8c82?w=100&h=100&fit=crop',
    founder_id: 'u_34',
    category: 'Food',
    upvotes_count: 120,
    halal_status: 'Certified'
  },
  {
    id: 'w10',
    created_at: lastWeek,
    name: 'HalalChef',
    description: 'Collaborative recipe platform for Halal food from every culture around the globe.',
    tagline: 'Discover the world of Halal cooking.',
    url: 'https://example.com/halalchef',
    logo_url: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=100&h=100&fit=crop',
    founder_id: 'u_35',
    category: 'Food',
    upvotes_count: 90,
    halal_status: 'Self-Certified'
  },

  // --- LAST MONTH (10 Products) ---
  {
    id: 'm1',
    created_at: lastMonth,
    name: 'QuranVoice',
    description: 'High-quality audio streaming of the Quran with professional multi-language translations and commentary.',
    tagline: 'Listen to the Divine Word.',
    url: 'https://example.com/quranvoice',
    logo_url: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=100&h=100&fit=crop',
    founder_id: 'u_36',
    category: 'Spirituality',
    upvotes_count: 500,
    halal_status: 'Certified'
  },
  {
    id: 'm2',
    created_at: lastMonth,
    name: 'CharityCloud',
    description: 'The API layer for charities. Integrate Zakat and Sadaqah payments into any website or application effortlessly.',
    tagline: 'Powering the future of giving.',
    url: 'https://example.com/charitycloud',
    logo_url: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=100&h=100&fit=crop',
    founder_id: 'u_37',
    category: 'Social',
    upvotes_count: 420,
    halal_status: 'Shariah-Compliant'
  },
  {
    id: 'm3',
    created_at: lastMonth,
    name: 'UmmahMarket',
    description: 'A decentralized marketplace for small businesses in the Muslim world to trade internationally.',
    tagline: 'Global trade for small makers.',
    url: 'https://example.com/ummahmarket',
    logo_url: 'https://images.unsplash.com/photo-1511317551221-c19623630746?w=100&h=100&fit=crop',
    founder_id: 'u_38',
    category: 'Social',
    upvotes_count: 300,
    halal_status: 'Self-Certified'
  },
  {
    id: 'm4',
    created_at: lastMonth,
    name: 'ArabicTalk',
    description: 'Peer-to-peer platform for practicing spoken Arabic with native speakers from different regions.',
    tagline: 'Speak Arabic, confidently.',
    url: 'https://example.com/arabictalk',
    logo_url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=100&h=100&fit=crop',
    founder_id: 'u_39',
    category: 'Education',
    upvotes_count: 280,
    halal_status: 'Certified'
  },
  {
    id: 'm5',
    created_at: lastMonth,
    name: 'ZakatEasy',
    description: 'Simplified Zakat calculator with expert consultations for complex business and investment portfolios.',
    tagline: 'Zakat made simple.',
    url: 'https://example.com/zakateasy',
    logo_url: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=100&h=100&fit=crop',
    founder_id: 'u_40',
    category: 'Finance',
    upvotes_count: 220,
    halal_status: 'Shariah-Compliant'
  },
  {
    id: 'm6',
    created_at: lastMonth,
    name: 'SunnahSecrets',
    description: 'Curated wellness routines and products derived from prophetic medicine and traditional healing.',
    tagline: 'Ancient wisdom for modern life.',
    url: 'https://example.com/sunnahsecrets',
    logo_url: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc2069?w=100&h=100&fit=crop',
    founder_id: 'u_41',
    category: 'Health',
    upvotes_count: 190,
    halal_status: 'Self-Certified'
  },
  {
    id: 'm7',
    created_at: lastMonth,
    name: 'HajjSim',
    description: 'The first ever detailed 3D simulator for Hajj, used for educational purposes in schools globally.',
    tagline: 'Learn the rituals in 3D.',
    url: 'https://example.com/hajjsim',
    logo_url: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=100&h=100&fit=crop',
    founder_id: 'u_42',
    category: 'Travel',
    upvotes_count: 165,
    halal_status: 'Certified'
  },
  {
    id: 'm8',
    created_at: lastMonth,
    name: 'DeenDesign',
    description: 'A library of high-quality Islamic design assets for developers and brands.',
    tagline: 'Modern Islamic aesthetics.',
    url: 'https://example.com/deendesign',
    logo_url: 'https://images.unsplash.com/photo-1534670007418-fbb7f6cf32c3?w=100&h=100&fit=crop',
    founder_id: 'u_43',
    category: 'Social',
    upvotes_count: 140,
    halal_status: 'Self-Certified'
  },
  {
    id: 'm9',
    created_at: lastMonth,
    name: 'HalalHikes',
    description: 'A global community and trail guide for Muslim outdoor enthusiasts. Prayer spots and Halal snacks on the trail.',
    tagline: 'Discover the creation.',
    url: 'https://example.com/halalhikes',
    logo_url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=100&h=100&fit=crop',
    founder_id: 'u_44',
    category: 'Health',
    upvotes_count: 110,
    halal_status: 'Certified'
  },
  {
    id: 'm10',
    created_at: lastMonth,
    name: 'TayyibTaste',
    description: 'Subscription box for organic, ethically-sourced, and Halal-certified snacks from across the Ummah.',
    tagline: 'Taste the purity.',
    url: 'https://example.com/tayyibtaste',
    logo_url: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=100&h=100&fit=crop',
    founder_id: 'u_45',
    category: 'Food',
    upvotes_count: 70,
    halal_status: 'Certified'
  }
];

export const CATEGORIES = [
  'Spirituality',
  'Travel',
  'Finance',
  'Social',
  'Education',
  'Productivity',
  'Food',
  'Health'
];
