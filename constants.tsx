
import { Product } from './types';

export const HALAL_STATUSES = ['Certified', 'Self-Certified', 'Shariah-Compliant'] as const;

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    created_at: new Date().toISOString(),
    name: 'QuranFlow',
    description: 'A beautiful, distraction-free Quran reading experience with habit tracking.',
    tagline: 'Build a meaningful relationship with the Quran.',
    url: 'https://example.com/quranflow',
    logo_url: 'https://picsum.photos/seed/quran/100/100',
    founder_id: 'user1',
    category: 'Spirituality',
    upvotes_count: 142,
    halal_status: 'Certified',
    sadaqah_info: '10% of all premium subscriptions go to global education funds.',
    comments: [
      {
        id: 'c1',
        user_id: 'user1',
        username: 'Ahmed (Maker)',
        avatar_url: 'https://i.pravatar.cc/150?u=user1',
        text: 'Assalamu Alaikum! We just launched our newest version with Dark Mode. Happy to answer any questions!',
        created_at: new Date().toISOString(),
        is_maker: true
      },
      {
        id: 'c2',
        user_id: 'user2',
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
    description: 'Find prayer rooms, halal restaurants, and qibla directions while traveling.',
    tagline: 'Your global companion for halal travel.',
    url: 'https://example.com/halaltrip',
    logo_url: 'https://picsum.photos/seed/travel/100/100',
    founder_id: 'user2',
    category: 'Travel',
    upvotes_count: 89,
    halal_status: 'Shariah-Compliant',
    comments: []
  },
  {
    id: '3',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    name: 'ZakatCalc Pro',
    description: 'Precise Zakat calculations including complex assets like stocks and crypto.',
    tagline: 'Calculating your Zakat made simple and accurate.',
    url: 'https://example.com/zakatcalc',
    logo_url: 'https://picsum.photos/seed/finance/100/100',
    founder_id: 'user3',
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
