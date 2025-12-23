
import { Product } from './types';

export const HALAL_STATUSES = ['Certified', 'Self-Certified', 'Shariah-Compliant'] as const;

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    created_at: new Date().toISOString(),
    name: 'QuranFlow',
    description: 'A beautiful, distraction-free Quran reading experience with habit tracking, tajweed highlights, and professional recitations. Designed for consistency.',
    tagline: 'Build a meaningful relationship with the Quran.',
    website_url: 'https://example.com/quranflow',
    logo_url: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=100&h=100&fit=crop',
    user_id: 'u_1',
    category: 'Spirituality',
    upvotes_count: 142,
    halal_status: 'Certified',
    sadaqah_info: '10% of all premium subscriptions go to global education funds.',
    comments: [
      {
        id: 'c1',
        user_id: 'u_1',
        product_id: '00000000-0000-0000-0000-000000000001',
        username: 'Ahmed (Maker)',
        avatar_url: 'https://i.pravatar.cc/150?u=u_1',
        text: 'Assalamu Alaikum! We just launched our newest version with Dark Mode. Happy to answer any questions!',
        created_at: new Date().toISOString(),
        is_maker: true
      }
    ]
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    created_at: new Date().toISOString(),
    name: 'HalalTrip Planner',
    description: 'Find prayer rooms, halal-certified restaurants, and qibla directions while traveling. Includes community-vetted travel itineraries.',
    tagline: 'Your global companion for halal travel.',
    website_url: 'https://example.com/halaltrip',
    logo_url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=100&h=100&fit=crop',
    user_id: 'u_2',
    category: 'Travel',
    upvotes_count: 89,
    halal_status: 'Shariah-Compliant',
    comments: []
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    created_at: new Date().toISOString(),
    name: 'Madrassah OS',
    description: 'A complete management system for Islamic schools. Track student progress, attendance, and curriculum goals with ease.',
    tagline: 'Modern tools for traditional learning.',
    website_url: 'https://example.com/madrassahos',
    logo_url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=100&h=100&fit=crop',
    user_id: 'u_5',
    category: 'Education',
    upvotes_count: 56,
    halal_status: 'Self-Certified',
    comments: []
  },
  {
    id: '00000000-0000-0000-0000-000000000004',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    name: 'ZakatCalc Pro',
    description: 'Precise Zakat calculations including complex assets like stocks, crypto, and business equity. Built with Shariah-compliance at its core.',
    tagline: 'Calculating your Zakat made simple and accurate.',
    website_url: 'https://example.com/zakatcalc',
    logo_url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=100&h=100&fit=crop',
    user_id: 'u_3',
    category: 'Finance',
    upvotes_count: 215,
    halal_status: 'Self-Certified',
    sadaqah_info: 'We provide free access to non-profits and masjids.',
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
