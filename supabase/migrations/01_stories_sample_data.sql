-- Sample Stories Data
-- Run this AFTER running 00_stories_setup.sql

-- Get category IDs
DO $$
DECLARE
  cat_makers UUID;
  cat_opinions UUID;
  cat_news UUID;
  cat_announcements UUID;
  cat_howto UUID;
  cat_interviews UUID;
BEGIN
  -- Get category IDs
  SELECT id INTO cat_makers FROM story_categories WHERE slug = 'makers';
  SELECT id INTO cat_opinions FROM story_categories WHERE slug = 'opinions';
  SELECT id INTO cat_news FROM story_categories WHERE slug = 'news';
  SELECT id INTO cat_announcements FROM story_categories WHERE slug = 'announcements';
  SELECT id INTO cat_howto FROM story_categories WHERE slug = 'how-to';
  SELECT id INTO cat_interviews FROM story_categories WHERE slug = 'interviews';

  -- MAKERS STORIES (5 sample stories)
  INSERT INTO stories (title, slug, subtitle, content, excerpt, author_name, author_avatar_url, category_id, reading_time, is_featured, published_at) VALUES

  ('Building My First Halal Food Discovery App', 'building-first-halal-food-discovery-app',
  'How I went from struggling to find halal restaurants to building an app with 10,000+ users',
  E'## The Problem That Started It All\n\nMoving to a new city as a Muslim professional means facing a common challenge: where can I eat? Google Maps shows thousands of restaurants, but which ones serve halal food? I spent hours scrolling, reading reviews, calling restaurants, and still ended up disappointed.\n\n## The Decision to Build\n\nAfter six months of frustration, I decided to build something. I wasn\'t a developer, but I knew basic HTML and CSS from college. I took an online course in React Native and spent my evenings learning.\n\n## The MVP\n\nI built the simplest version possible:\n\n- Search halal restaurants by location\n- Users can add and verify restaurants\n- Photo uploads for menu items\n- Community reviews and ratings\n\nI launched it in my local Muslim community WhatsApp group. Within 48 hours, 200 people downloaded it. Within two weeks, we had 50 restaurants listed with verified halal status.\n\n## Growth Strategies\n\n**Community-First Approach:** I joined every Muslim community group in major cities and asked for help. People were excited to contribute because it solved their problem too.\n\n**Partnerships:** I reached out to halal certification organizations. They helped verify restaurants and promoted the app to their networks.\n\n**Word of Mouth:** Happy users told their friends. That\'s still our biggest growth channel.\n\n## Results After One Year\n\n- 10,000+ downloads across 5 countries\n- 500+ verified halal restaurants\n- 4.7-star rating on app stores\n- $2,000 MRR from restaurant premium accounts\n\n## Lessons Learned\n\n1. Start with a problem you personally face\n2. Launch before you\'re ready\n3. Community feedback is invaluable\n4. Simple solutions work best\n5. Trust your users',
  'From struggling to find halal food to building an app that serves 10,000+ Muslims across 5 countries.',
  'Aisha Rahman', 'https://i.pravatar.cc/150?img=1', cat_makers, 7, true, NOW() - INTERVAL '2 days'),

  ('From Side Project to $10K MRR: My SaaS Journey', 'side-project-to-10k-mrr-saas-journey',
  'How I built a Muslim-friendly HR platform while working full-time and scaled it to profitability',
  E'## The Beginning\n\nI was working as an HR manager when I noticed a gap: existing HR software didn\'t accommodate Islamic requirements like prayer times, Ramadan schedules, Eid holidays, and halal considerations.\n\n## Building in Secret\n\nFor six months, I coded after Fajr and before work. I built features specifically for Muslim-owned businesses:\n\n- Automatic prayer time breaks\n- Ramadan schedule adjustments\n- Islamic calendar integration\n- Halal expense categorization\n\n## The Launch\n\nI soft-launched to 10 Muslim business owners I knew. They loved it. Within a month, they referred 20 more companies.\n\n## Pricing Strategy\n\nI kept it simple:\n\n- $50/month for up to 10 employees\n- $150/month for up to 50 employees\n- $500/month for unlimited employees\n\n## Current Status\n\n- $10,000 MRR\n- 80 company clients\n- 1,500+ employees using the platform\n- 2 part-time team members\n- I quit my job last month to focus full-time\n\n## Advice for Aspiring Makers\n\n1. Don\'t quit your job immediately\n2. Solve real problems for specific communities\n3. Start with pricing from day one\n4. Build in public and share your journey\n5. Hire help when you need it',
  'The complete journey from side project to $10K MRR SaaS business serving Muslim companies.',
  'Omar Hassan', 'https://i.pravatar.cc/150?img=2', cat_makers, 9, true, NOW() - INTERVAL '5 days'),

  ('My Journey Building a Quran Memorization App', 'quran-memorization-app-journey',
  'From struggling hafiz to helping thousands memorize Quran with technology',
  E'## My Personal Struggle\n\nWhen I started memorizing Quran, I struggled with tracking my progress and staying consistent. I tried notebooks and apps, but nothing quite fit my needs as a working professional.\n\n## The Idea\n\nWhat if there was an app designed specifically for busy people trying to memorize Quran? Something that understood your schedule, your learning style, and Islamic pedagogical methods.\n\n## Building QuranMem\n\n**Key Features:**\n\n1. Smart scheduling based on your availability\n2. Audio playback with tajweed highlighting\n3. Spaced repetition reminders\n4. Progress tracking with beautiful visualizations\n5. Connection to local Quran teachers for verification\n\n## Results\n\n**First Month:**\n\n- 5,000 downloads\n- 2,000 active users\n- 500 premium subscribers at $2.99/month\n- 4.6-star rating on app stores\n\n## What\'s Next\n\n**Upcoming Features:**\n\n- Group memorization challenges\n- Integration with online Quran schools\n- AI-powered pronunciation correction\n- Family sharing accounts\n- Kids\' mode with gamification\n\n## Final Thoughts\n\nBuilding QuranMem has been the most rewarding project of my career. It\'s not just about the code or the business - it\'s about facilitating people\'s connection with Allah through His book.',
  'The inspiring journey of building a Quran memorization app that helps thousands of Muslims worldwide.',
  'Ibrahim Al-Masri', 'https://i.pravatar.cc/150?img=5', cat_makers, 8, false, NOW() - INTERVAL '1 week'),

  ('Launching an Islamic Calendar App in 2025', 'launching-islamic-calendar-app-2025',
  'From idea to 50,000+ downloads: A complete product launch story',
  E'## The Problem\n\nAs a Muslim professional, I juggled multiple calendars: Gregorian for work, Islamic for religious events, and prayer times. I wished for one app that understood my needs.\n\n## Building the MVP\n\n**Core Features:**\n\n- Dual calendar view (Gregorian + Islamic)\n- Prayer time notifications\n- Ramadan countdown and schedules\n- Islamic holidays with descriptions\n- Zakat and Sadaqah trackers\n\nI built it using Flutter for cross-platform development.\n\n## Launch Strategy\n\n**Pre-Launch:**\n\n- 50 beta testers from my community\n- YouTube videos about Islamic productivity\n- Blog posts about balancing faith and work\n- Instagram content with Islamic quotes\n\n**Launch Day Results:**\n\n- 1,000 downloads in first 24 hours\n- Featured on Product Hunt\n- #3 Product of the Day on Muslim Hunt\n- 50+ reviews with 4.7-star average\n\n## Current Metrics\n\n- 50,000+ downloads\n- 10,000 monthly active users\n- $4,000 MRR\n- 4.6-star rating on both stores\n\n## Key Takeaways\n\n1. Validate your idea before building\n2. Design matters more than you think\n3. Community is your biggest asset\n4. Prepare for app store quirks\n5. Customer support is part of the product',
  'A detailed guide through building, launching, and growing an Islamic calendar app from scratch.',
  'Fatima Zahra', 'https://i.pravatar.cc/150?img=4', cat_makers, 9, false, NOW() - INTERVAL '10 days'),

  ('Building a Halal Investment Platform: Tech Stack & Lessons', 'building-halal-investment-platform',
  'How we built a Shariah-compliant investment app serving 5,000+ Muslim investors',
  E'## The Vision\n\nMuslim investors needed a platform that automatically screens stocks for Shariah compliance and provides halal investment options.\n\n## Technical Challenges\n\n**Challenge 1: Real-time Stock Screening**\n\nWe built an algorithm that checks:\n\n- Revenue sources (no alcohol, gambling, etc.)\n- Debt ratios\n- Interest-based income\n- Industry classifications\n\n**Challenge 2: Compliance Verification**\n\nWe partnered with certified Islamic scholars to verify our screening methodology.\n\n## Tech Stack\n\n- **Frontend:** React Native\n- **Backend:** Node.js + PostgreSQL\n- **Real-time Data:** WebSocket connections\n- **Payment:** Stripe (configured for halal transactions)\n- **Hosting:** AWS with auto-scaling\n\n## Growth\n\n- 5,000+ active investors\n- $2M+ in managed investments\n- Partnership with 3 Islamic banks\n- Expansion to 5 countries\n\n## What We Learned\n\n1. Regulatory compliance is crucial\n2. Work with Islamic finance experts\n3. Education is part of the product\n4. Trust takes time to build\n5. Community feedback shapes everything',
  'Building a Shariah-compliant investment platform with modern technology and traditional Islamic principles.',
  'Yusuf Malik', 'https://i.pravatar.cc/150?img=6', cat_makers, 10, true, NOW() - INTERVAL '3 days');

END $$;
