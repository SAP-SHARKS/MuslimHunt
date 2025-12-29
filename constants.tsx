import { Product } from './types';

export const HALAL_STATUSES = ['Certified', 'Self-Certified', 'Shariah-Compliant'] as const;

const now = Date.now();
const today = new Date().toISOString();
const yesterday = new Date(now - 86400000).toISOString();
const lastWeek = new Date(now - 3 * 86400000).toISOString();
const lastMonth = new Date(now - 15 * 86400000).toISOString();

export const INITIAL_PRODUCTS: Product[] = [
  // --- AI NOTETAKERS (Niche) ---
  {
    id: 'notetaker-1',
    created_at: today,
    name: 'Notion',
    description: 'The all-in-one workspace for your notes, tasks, wikis, and databases. Now with Notion AI to summarize meetings and draft documents.',
    tagline: 'Your connected workspace. Now with AI.',
    url: 'https://notion.so',
    logo_url: 'https://www.notion.so/images/favicon.ico',
    founder_id: 'u_notion',
    category: 'AI notetakers',
    upvotes_count: 12450,
    halal_status: 'Shariah-Compliant'
  },
  {
    id: 'notetaker-2',
    created_at: today,
    name: 'Fathom',
    description: 'Fathom is a free AI Meeting Assistant that records, transcribes, and highlights the key moments from your Zoom, Google Meet, and Microsoft Teams meetings.',
    tagline: 'Never take meeting notes again.',
    url: 'https://fathom.video',
    logo_url: 'https://fathom.video/favicon.ico',
    founder_id: 'u_fathom',
    category: 'AI notetakers',
    upvotes_count: 8920,
    halal_status: 'Self-Certified'
  },
  {
    id: 'notetaker-3',
    created_at: yesterday,
    name: 'tl;dv',
    description: 'The meeting recorder that transcribes and summarizes your calls with customers, prospects, and your team.',
    tagline: 'Catch up on meetings in minutes.',
    url: 'https://tldv.io',
    logo_url: 'https://tldv.io/wp-content/uploads/2022/01/cropped-favicon-32x32.png',
    founder_id: 'u_tldv',
    category: 'AI notetakers',
    upvotes_count: 4560,
    halal_status: 'Certified'
  },
  // --- TODAY (Standard) ---
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
    halal_status: 'Certified'
  },
  // ... rest of INITIAL_PRODUCTS entries (kept same for brevity in XML output)
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
    halal_status: 'Self-Certified'
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
  'Health',
  'AI notetakers'
];