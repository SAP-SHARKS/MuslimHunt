-- Sample Stories Data
-- Run this AFTER running 00_complete_setup.sql

DO $$
DECLARE
  cat_makers UUID;
BEGIN
  -- Get category ID
  SELECT id INTO cat_makers FROM story_categories WHERE slug = 'makers';

  -- Check if we found the category
  IF cat_makers IS NULL THEN
    RAISE EXCEPTION 'Makers category not found. Please run 00_complete_setup.sql first.';
  END IF;

  -- MAKERS STORIES (5 sample stories)
  INSERT INTO stories (title, slug, subtitle, content, excerpt, author_name, author_avatar_url, category_id, reading_time, is_featured, published_at) VALUES

  ('Building My First Halal Food Discovery App', 'building-first-halal-food-discovery-app',
  'How I went from struggling to find halal restaurants to building an app with 10,000+ users',
  '## The Problem That Started It All

Moving to a new city as a Muslim professional means facing a common challenge: where can I eat? Google Maps shows thousands of restaurants, but which ones serve halal food? I spent hours scrolling, reading reviews, calling restaurants, and still ended up disappointed.

## The Decision to Build

After six months of frustration, I decided to build something. I wasn''t a developer, but I knew basic HTML and CSS from college. I took an online course in React Native and spent my evenings learning.

## The MVP

I built the simplest version possible:

- Search halal restaurants by location
- Users can add and verify restaurants
- Photo uploads for menu items
- Community reviews and ratings

I launched it in my local Muslim community WhatsApp group. Within 48 hours, 200 people downloaded it. Within two weeks, we had 50 restaurants listed with verified halal status.

## Growth Strategies

**Community-First Approach:** I joined every Muslim community group in major cities and asked for help. People were excited to contribute because it solved their problem too.

**Partnerships:** I reached out to halal certification organizations. They helped verify restaurants and promoted the app to their networks.

**Word of Mouth:** Happy users told their friends. That''s still our biggest growth channel.

## Results After One Year

- 10,000+ downloads across 5 countries
- 500+ verified halal restaurants
- 4.7-star rating on app stores
- $2,000 MRR from restaurant premium accounts

## Lessons Learned

1. Start with a problem you personally face
2. Launch before you''re ready
3. Community feedback is invaluable
4. Simple solutions work best
5. Trust your users',
  'From struggling to find halal food to building an app that serves 10,000+ Muslims across 5 countries.',
  'Aisha Rahman', 'https://i.pravatar.cc/150?img=1', cat_makers, 7, true, NOW() - INTERVAL '2 days'),

  ('From Side Project to $10K MRR: My SaaS Journey', 'side-project-to-10k-mrr-saas-journey',
  'How I built a Muslim-friendly HR platform while working full-time and scaled it to profitability',
  '## The Beginning

I was working as an HR manager when I noticed a gap: existing HR software didn''t accommodate Islamic requirements like prayer times, Ramadan schedules, Eid holidays, and halal considerations.

## Building in Secret

For six months, I coded after Fajr and before work. I built features specifically for Muslim-owned businesses:

- Automatic prayer time breaks
- Ramadan schedule adjustments
- Islamic calendar integration
- Halal expense categorization

## The Launch

I soft-launched to 10 Muslim business owners I knew. They loved it. Within a month, they referred 20 more companies.

## Pricing Strategy

I kept it simple:

- $50/month for up to 10 employees
- $150/month for up to 50 employees
- $500/month for unlimited employees

## Current Status

- $10,000 MRR
- 80 company clients
- 1,500+ employees using the platform
- 2 part-time team members
- I quit my job last month to focus full-time

## Advice for Aspiring Makers

1. Don''t quit your job immediately
2. Solve real problems for specific communities
3. Start with pricing from day one
4. Build in public and share your journey
5. Hire help when you need it',
  'The complete journey from side project to $10K MRR SaaS business serving Muslim companies.',
  'Omar Hassan', 'https://i.pravatar.cc/150?img=2', cat_makers, 9, true, NOW() - INTERVAL '5 days'),

  ('My Journey Building a Quran Memorization App', 'quran-memorization-app-journey',
  'From struggling hafiz to helping thousands memorize Quran with technology',
  '## My Personal Struggle

When I started memorizing Quran, I struggled with tracking my progress and staying consistent. I tried notebooks and apps, but nothing quite fit my needs as a working professional.

## The Idea

What if there was an app designed specifically for busy people trying to memorize Quran? Something that understood your schedule, your learning style, and Islamic pedagogical methods.

## Building QuranMem

**Key Features:**

1. Smart scheduling based on your availability
2. Audio playback with tajweed highlighting
3. Spaced repetition reminders
4. Progress tracking with beautiful visualizations
5. Connection to local Quran teachers for verification

## Results

**First Month:**

- 5,000 downloads
- 2,000 active users
- 500 premium subscribers at $2.99/month
- 4.6-star rating on app stores

## What''s Next

**Upcoming Features:**

- Group memorization challenges
- Integration with online Quran schools
- AI-powered pronunciation correction
- Family sharing accounts
- Kids'' mode with gamification

## Final Thoughts

Building QuranMem has been the most rewarding project of my career. It''s not just about the code or the business - it''s about facilitating people''s connection with Allah through His book.',
  'The inspiring journey of building a Quran memorization app that helps thousands of Muslims worldwide.',
  'Ibrahim Al-Masri', 'https://i.pravatar.cc/150?img=5', cat_makers, 8, false, NOW() - INTERVAL '1 week'),

  ('Launching an Islamic Calendar App in 2025', 'launching-islamic-calendar-app-2025',
  'From idea to 50,000+ downloads: A complete product launch story',
  '## The Problem

As a Muslim professional, I juggled multiple calendars: Gregorian for work, Islamic for religious events, and prayer times. I wished for one app that understood my needs.

## Building the MVP

**Core Features:**

- Dual calendar view (Gregorian + Islamic)
- Prayer time notifications
- Ramadan countdown and schedules
- Islamic holidays with descriptions
- Zakat and Sadaqah trackers

I built it using Flutter for cross-platform development.

## Launch Strategy

**Pre-Launch:**

- 50 beta testers from my community
- YouTube videos about Islamic productivity
- Blog posts about balancing faith and work
- Instagram content with Islamic quotes

**Launch Day Results:**

- 1,000 downloads in first 24 hours
- Featured on Product Hunt
- Top product of the day on Muslim Hunt
- 50+ reviews with 4.7-star average

## Current Metrics

- 50,000+ downloads
- 10,000 monthly active users
- $4,000 MRR
- 4.6-star rating on both stores

## Key Takeaways

1. Validate your idea before building
2. Design matters more than you think
3. Community is your biggest asset
4. Prepare for app store quirks
5. Customer support is part of the product',
  'A detailed guide through building, launching, and growing an Islamic calendar app from scratch.',
  'Fatima Zahra', 'https://i.pravatar.cc/150?img=4', cat_makers, 9, false, NOW() - INTERVAL '10 days'),

  ('Building a Halal Investment Platform: Tech Stack and Lessons', 'building-halal-investment-platform',
  'How we built a Shariah-compliant investment app serving 5,000+ Muslim investors',
  '## The Vision

Muslim investors needed a platform that automatically screens stocks for Shariah compliance and provides halal investment options.

## Technical Challenges

**Challenge 1: Real-time Stock Screening**

We built an algorithm that checks:

- Revenue sources (no alcohol, gambling, etc.)
- Debt ratios
- Interest-based income
- Industry classifications

**Challenge 2: Compliance Verification**

We partnered with certified Islamic scholars to verify our screening methodology.

## Tech Stack

- **Frontend:** React Native
- **Backend:** Node.js + PostgreSQL
- **Real-time Data:** WebSocket connections
- **Payment:** Stripe (configured for halal transactions)
- **Hosting:** AWS with auto-scaling

## Growth

- 5,000+ active investors
- $2M+ in managed investments
- Partnership with 3 Islamic banks
- Expansion to 5 countries

## What We Learned

1. Regulatory compliance is crucial
2. Work with Islamic finance experts
3. Education is part of the product
4. Trust takes time to build
5. Community feedback shapes everything',
  'Building a Shariah-compliant investment platform with modern technology and traditional Islamic principles.',
  'Yusuf Malik', 'https://i.pravatar.cc/150?img=6', cat_makers, 10, true, NOW() - INTERVAL '3 days');

  RAISE NOTICE 'Successfully inserted 5 sample stories';

END $$;
