-- Fix Forum Display Issues
-- This migration fixes:
-- 1. Ensures profiles table exists with proper structure
-- 2. Creates a view or trigger to sync auth.users with profiles
-- 3. Fixes any data inconsistencies

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT,
  avatar_url TEXT,
  headline TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Create policies for profiles
CREATE POLICY "Anyone can view profiles"
  ON profiles
  FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Create a function to sync new users to profiles
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url, headline)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://i.pravatar.cc/150?u=' || NEW.id),
    COALESCE(NEW.raw_user_meta_data->>'headline', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger to auto-create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Backfill profiles for existing users who don't have profiles
INSERT INTO profiles (id, username, avatar_url, headline)
SELECT
  u.id,
  COALESCE(u.raw_user_meta_data->>'full_name', u.email) as username,
  COALESCE(u.raw_user_meta_data->>'avatar_url', 'https://i.pravatar.cc/150?u=' || u.id) as avatar_url,
  COALESCE(u.raw_user_meta_data->>'headline', '') as headline
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM profiles p WHERE p.id = u.id
);

-- Update any threads with NULL author_id to use a default system user
-- First, ensure we have a system user profile (if needed)
DO $$
DECLARE
  system_user_id UUID;
BEGIN
  -- Check if any threads have NULL author_id
  IF EXISTS (SELECT 1 FROM threads WHERE author_id IS NULL) THEN
    -- Get first admin user or any user
    SELECT id INTO system_user_id FROM auth.users LIMIT 1;

    -- Update threads with NULL author_id
    IF system_user_id IS NOT NULL THEN
      UPDATE threads
      SET author_id = system_user_id
      WHERE author_id IS NULL;
    END IF;
  END IF;
END $$;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_threads_author_approved ON threads(author_id, is_approved);
