
import { Product } from './types';

export const HALAL_STATUSES = ['Certified', 'Self-Certified', 'Shariah-Compliant'] as const;

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    created_at: new Date().toISOString(),
    name: 'QuranFlow',
    description: 'A beautiful, distraction-free Quran reading experience with habit tracking, tajweed highlights, and professional recitations. Designed for consistency.',
    tagline: 'Build a meaningful relationship with the Quran.',
    url: 'https://example.com/quranflow',
    logo_url: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=100&h=100&fit=crop',
    founder_id: 'u_1',
    category: 'Spirituality',
    upvotes_count: 142,
    halal_status: 'Certified',
    sadaqah_info: '10% of all premium subscriptions go to global education funds.',
    comments: [
      {
        id: 'c1',
        user_id: 'u_1',
        username: 'Ahmed (Maker)',
        avatar_url: 'https://i.pravatar.cc/150?u=u_1',
        text: 'Assalamu Alaikum! We just launched our newest version with Dark Mode. Happy to answer any questions!',
        created_at: new Date().toISOString(),
        is_maker: true
      },
      {
        id: 'c2',
        user_id: 'u_99',
        username: 'Fatima',
        avatar_url: 'https://i.pravatar.cc/150?u=fatima',
        text: 'This looks amazing. Is there a mobile app coming soon?',
        created_at: new Date().toISOString()
      }
    ]
  },
  {
    id: '2',
    created_at: new Date().toISOString(),
    name: 'HalalTrip Planner',
    description: 'Find prayer rooms, halal-certified restaurants, and qibla directions while traveling. Includes community-vetted travel itineraries.',
    tagline: 'Your global companion for halal travel.',
    url: 'https://example.com/halaltrip',
    logo_url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=100&h=100&fit=crop',
    founder_id: 'u_2',
    category: 'Travel',
    upvotes_count: 89,
    halal_status: 'Shariah-Compliant',
    comments: []
  },
  {
    id: '5',
    created_at: new Date().toISOString(),
    name: 'Madrassah OS',
    description: 'A complete management system for Islamic schools. Track student progress, attendance, and curriculum goals with ease.',
    tagline: 'Modern tools for traditional learning.',
    url: 'https://example.com/madrassahos',
    logo_url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=100&h=100&fit=crop',
    founder_id: 'u_5',
    category: 'Education',
    upvotes_count: 56,
    halal_status: 'Self-Certified',
    comments: []
  },
  {
    id: '3',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    name: 'ZakatCalc Pro',
    description: 'Precise Zakat calculations including complex assets like stocks, crypto, and business equity. Built with Shariah-compliance at its core.',
    tagline: 'Calculating your Zakat made simple and accurate.',
    url: 'https://example.com/zakatcalc',
    logo_url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=100&h=100&fit=crop',
    founder_id: 'u_3',
    category: 'Finance',
    upvotes_count: 215,
    halal_status: 'Self-Certified',
    sadaqah_info: 'We provide free access to non-profits and masjids.',
    comments: []
  },
  {
    id: '6',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    name: 'Ethical Wealth',
    description: 'A robo-advisor that exclusively invests in Shariah-compliant and ESG-screened equities.',
    tagline: 'Grow your wealth the halal way.',
    url: 'https://example.com/ethicalwealth',
    logo_url: 'https://images.unsplash.com/photo-1579621970795-87faff2f9070?w=100&h=100&fit=crop',
    founder_id: 'u_6',
    category: 'Finance',
    upvotes_count: 178,
    halal_status: 'Certified',
    comments: []
  },
  {
    id: '7',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    name: 'HalalBite',
    description: 'The first delivery app that only features Halal-certified vendors with a zero-alcohol policy.',
    tagline: 'Pure food, delivered fast.',
    url: 'https://example.com/halalbite',
    logo_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=100&h=100&fit=crop',
    founder_id: 'u_7',
    category: 'Food',
    upvotes_count: 312,
    halal_status: 'Certified',
    comments: []
  },
  {
    id: '4',
    created_at: new Date(Date.now() - 172800000).toISOString(),
    name: 'Ummah Hub',
    description: 'A professional network for the global Muslim community to connect on projects, find jobs, and share knowledge.',
    tagline: 'Connect, collaborate, and grow with the Ummah.',
    url: 'https://example.com/ummahhub',
    logo_url: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=100&h=100&fit=crop',
    founder_id: 'u_4',
    category: 'Social',
    upvotes_count: 156,
    halal_status: 'Shariah-Compliant',
    comments: []
  },
  {
    id: '8',
    created_at: new Date(Date.now() - 172800000).toISOString(),
    name: 'Sunnah Wellness',
    description: 'An AI-powered health app that integrates Prophetic medicine and sunnah diet practices with modern science.',
    tagline: 'Holistic health from a Sunnah perspective.',
    url: 'https://example.com/sunnahwell',
    logo_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=100&h=100&fit=crop',
    founder_id: 'u_8',
    category: 'Health',
    upvotes_count: 94,
    halal_status: 'Self-Certified',
    comments: []
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
