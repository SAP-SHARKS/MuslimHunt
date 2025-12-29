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
    logo_url: 'https://logo.clearbit.com/notion.so',
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
    logo_url: 'https://logo.clearbit.com/fathom.video',
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
    logo_url: 'https://logo.clearbit.com/tldv.io',
    founder_id: 'u_tldv',
    category: 'AI notetakers',
    upvotes_count: 4560,
    halal_status: 'Certified'
  },
  {
    id: 'notetaker-4',
    created_at: lastWeek,
    name: 'Fireflies.ai',
    description: 'Automate your meeting notes. Fireflies.ai records, transcribes and searches through your voice conversations.',
    tagline: 'Your AI voice assistant for meetings.',
    url: 'https://fireflies.ai',
    logo_url: 'https://logo.clearbit.com/fireflies.ai',
    founder_id: 'u_fire',
    category: 'AI notetakers',
    upvotes_count: 3820,
    halal_status: 'Self-Certified'
  },
  {
    id: 'notetaker-5',
    created_at: lastWeek,
    name: 'Grain',
    description: 'Grain is the easiest way to record, transcribe, and edit your Zoom meetings.',
    tagline: 'The best way to record Zoom calls.',
    url: 'https://grain.com',
    logo_url: 'https://logo.clearbit.com/grain.com',
    founder_id: 'u_grain',
    category: 'AI notetakers',
    upvotes_count: 2140,
    halal_status: 'Certified'
  },
  {
    id: 'notetaker-6',
    created_at: lastWeek,
    name: 'Otter.ai',
    description: 'Otter.ai uses AI to write meeting notes in real time, so you can stay focused on the conversation.',
    tagline: 'The smartest way to capture voice.',
    url: 'https://otter.ai',
    logo_url: 'https://logo.clearbit.com/otter.ai',
    founder_id: 'u_otter',
    category: 'AI notetakers',
    upvotes_count: 7600,
    halal_status: 'Shariah-Compliant'
  },
  {
    id: 'notetaker-7',
    created_at: lastWeek,
    name: 'Granola',
    description: 'The AI notepad that learns your style. Granola takes notes for you on Zoom, Google Meet, and Slack.',
    tagline: 'AI notes that sound like you.',
    url: 'https://granola.ai',
    logo_url: 'https://logo.clearbit.com/granola.ai',
    founder_id: 'u_gran',
    category: 'AI notetakers',
    upvotes_count: 1450,
    halal_status: 'Self-Certified'
  },
  {
    id: 'notetaker-8',
    created_at: lastWeek,
    name: 'Supernormal',
    description: 'The easiest way to take meeting notes. Supernormal transcribes and summarizes your calls automatically.',
    tagline: 'Notes that write themselves.',
    url: 'https://supernormal.com',
    logo_url: 'https://logo.clearbit.com/supernormal.com',
    founder_id: 'u_super',
    category: 'AI notetakers',
    upvotes_count: 3100,
    halal_status: 'Certified'
  },
  {
    id: 'notetaker-9',
    created_at: lastMonth,
    name: 'Tactiq',
    description: 'Real-time transcription for Google Meet, Zoom, and MS Teams.',
    tagline: 'Capture every word effortlessly.',
    url: 'https://tactiq.io',
    logo_url: 'https://logo.clearbit.com/tactiq.io',
    founder_id: 'u_tact',
    category: 'AI notetakers',
    upvotes_count: 980,
    halal_status: 'Self-Certified'
  },
  {
    id: 'notetaker-10',
    created_at: lastMonth,
    name: 'Avoma',
    description: 'AI-powered meeting assistant for customer-facing teams.',
    tagline: 'Win more deals with AI meetings.',
    url: 'https://avoma.com',
    logo_url: 'https://logo.clearbit.com/avoma.com',
    founder_id: 'u_avoma',
    category: 'AI notetakers',
    upvotes_count: 1200,
    halal_status: 'Certified'
  },
  {
    id: 'notetaker-11',
    created_at: lastMonth,
    name: 'Fellow',
    description: 'The AI meeting management tool for teams to collaborate on agendas and notes.',
    tagline: 'Optimize your team meetings.',
    url: 'https://fellow.app',
    logo_url: 'https://logo.clearbit.com/fellow.app',
    founder_id: 'u_fellow',
    category: 'AI notetakers',
    upvotes_count: 2400,
    halal_status: 'Shariah-Compliant'
  },
  {
    id: 'notetaker-12',
    created_at: lastMonth,
    name: 'Claap',
    description: 'The all-in-one video workspace for remote teams.',
    tagline: 'Video notes for modern teams.',
    url: 'https://claap.io',
    logo_url: 'https://logo.clearbit.com/claap.io',
    founder_id: 'u_claap',
    category: 'AI notetakers',
    upvotes_count: 1560,
    halal_status: 'Self-Certified'
  },
  {
    id: 'notetaker-13',
    created_at: lastMonth,
    name: 'Krisp.ai',
    description: 'AI-powered noise cancellation and meeting notes.',
    tagline: 'Speak without distractions.',
    url: 'https://krisp.ai',
    logo_url: 'https://logo.clearbit.com/krisp.ai',
    founder_id: 'u_krisp',
    category: 'AI notetakers',
    upvotes_count: 8200,
    halal_status: 'Certified'
  },
  {
    id: 'notetaker-14',
    created_at: lastMonth,
    name: 'MeetGeek',
    description: 'Your personal AI meeting assistant for recording and sharing call highlights.',
    tagline: 'Extract value from your calls.',
    url: 'https://meetgeek.ai',
    logo_url: 'https://logo.clearbit.com/meetgeek.ai',
    founder_id: 'u_geek',
    category: 'AI notetakers',
    upvotes_count: 740,
    halal_status: 'Self-Certified'
  },
  {
    id: 'notetaker-15',
    created_at: lastMonth,
    name: 'Sembly AI',
    description: 'Transcribe, take meeting notes, and generate insights for your professional calls.',
    tagline: 'Smart meeting insights.',
    url: 'https://sembly.ai',
    logo_url: 'https://logo.clearbit.com/sembly.ai',
    founder_id: 'u_sembly',
    category: 'AI notetakers',
    upvotes_count: 620,
    halal_status: 'Certified'
  },
  {
    id: 'notetaker-16',
    created_at: lastMonth,
    name: 'Snote',
    description: 'A simple AI tool for converting voice to organized notes.',
    tagline: 'Voice to text simplified.',
    url: 'https://snote.io',
    logo_url: 'https://logo.clearbit.com/snote.io',
    founder_id: 'u_snote',
    category: 'AI notetakers',
    upvotes_count: 450,
    halal_status: 'Self-Certified'
  },
  {
    id: 'notetaker-17',
    created_at: lastMonth,
    name: 'Read.ai',
    description: 'Read offers meeting summaries, transcription, and scheduling tools.',
    tagline: 'Better meetings, better outcomes.',
    url: 'https://read.ai',
    logo_url: 'https://logo.clearbit.com/read.ai',
    founder_id: 'u_read',
    category: 'AI notetakers',
    upvotes_count: 1900,
    halal_status: 'Shariah-Compliant'
  },
  {
    id: 'notetaker-18',
    created_at: lastMonth,
    name: 'Airgram',
    description: 'The easiest way to record, transcribe, and collaborate on meeting notes.',
    tagline: 'Collaborative AI meeting notes.',
    url: 'https://airgram.io',
    logo_url: 'https://logo.clearbit.com/airgram.io',
    founder_id: 'u_air',
    category: 'AI notetakers',
    upvotes_count: 1320,
    halal_status: 'Certified'
  },
  {
    id: 'notetaker-19',
    created_at: lastMonth,
    name: 'Sybill',
    description: 'AI meeting summaries and CRM updates for sales teams.',
    tagline: 'Automate your sales follow-ups.',
    url: 'https://sybill.ai',
    logo_url: 'https://logo.clearbit.com/sybill.ai',
    founder_id: 'u_syb',
    category: 'AI notetakers',
    upvotes_count: 580,
    halal_status: 'Self-Certified'
  },
  {
    id: 'notetaker-20',
    created_at: lastMonth,
    name: 'Jamie',
    description: 'An AI-powered personal assistant that summarizes your meetings in seconds.',
    tagline: 'Your personal meeting secretary.',
    url: 'https://meetjamie.ai',
    logo_url: 'https://logo.clearbit.com/meetjamie.ai',
    founder_id: 'u_jamie',
    category: 'AI notetakers',
    upvotes_count: 910,
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