-- Stories Feature - Complete Setup
-- Run this in Supabase SQL Editor

-- 1. Create update_updated_at_column function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 2. Create story_categories table
CREATE TABLE IF NOT EXISTS story_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Create stories table
CREATE TABLE IF NOT EXISTS stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  subtitle TEXT,
  content TEXT NOT NULL,
  excerpt TEXT,
  cover_image_url TEXT,
  author_id UUID REFERENCES auth.users(id),
  author_name TEXT NOT NULL,
  author_avatar_url TEXT,
  category_id UUID REFERENCES story_categories(id),
  views_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  reading_time INTEGER,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Create story_comments table
CREATE TABLE IF NOT EXISTS story_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  username TEXT NOT NULL,
  avatar_url TEXT,
  text TEXT NOT NULL,
  parent_id UUID REFERENCES story_comments(id) ON DELETE CASCADE,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Enable Row Level Security
ALTER TABLE story_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_comments ENABLE ROW LEVEL SECURITY;

-- 6. Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Anyone can view active categories" ON story_categories;
DROP POLICY IF EXISTS "Anyone can view published stories" ON stories;
DROP POLICY IF EXISTS "Anyone can view story comments" ON story_comments;

-- 7. Create policies for public read access
CREATE POLICY "Anyone can view active categories"
  ON story_categories
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Anyone can view published stories"
  ON stories
  FOR SELECT
  USING (is_published = true);

CREATE POLICY "Anyone can view story comments"
  ON story_comments
  FOR SELECT
  USING (true);

-- 8. Insert story categories
INSERT INTO story_categories (name, slug, description, display_order) VALUES
('All', 'all', 'All stories from the Muslim Hunt community', 0),
('Makers', 'makers', 'Stories from makers building amazing products', 1),
('Opinions', 'opinions', 'Thoughts and perspectives from the community', 2),
('News', 'news', 'Latest news and updates in the Muslim tech space', 3),
('Announcements', 'announcements', 'Official announcements from Muslim Hunt', 4),
('How To', 'how-to', 'Guides and tutorials for makers', 5),
('Interviews', 'interviews', 'Conversations with inspiring Muslim makers', 6)
ON CONFLICT (slug) DO NOTHING;

-- 9. Create indexes
CREATE INDEX IF NOT EXISTS idx_stories_category ON stories(category_id);
CREATE INDEX IF NOT EXISTS idx_stories_slug ON stories(slug);
CREATE INDEX IF NOT EXISTS idx_stories_published_at ON stories(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_story_comments_story ON story_comments(story_id);
CREATE INDEX IF NOT EXISTS idx_story_comments_parent ON story_comments(parent_id);

-- 10. Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_stories_updated_at ON stories;
DROP TRIGGER IF EXISTS update_story_comments_updated_at ON story_comments;

-- 11. Create triggers for updated_at
CREATE TRIGGER update_stories_updated_at
  BEFORE UPDATE ON stories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_story_comments_updated_at
  BEFORE UPDATE ON story_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
