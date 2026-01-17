-- Votes and Notifications System
-- This migration creates tables and triggers for upvoting products and notifying makers

-- =============================================
-- 1. CREATE VOTES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, product_id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_votes_user_id ON votes(user_id);
CREATE INDEX IF NOT EXISTS idx_votes_product_id ON votes(product_id);
CREATE INDEX IF NOT EXISTS idx_votes_user_product ON votes(user_id, product_id);

-- =============================================
-- 2. CREATE NOTIFICATIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('upvote', 'comment', 'reply', 'mention', 'follow', 'streak', 'approval')),
  title TEXT,
  message TEXT NOT NULL,
  product_id UUID,
  comment_id UUID,
  thread_id UUID,
  sender_id UUID,
  sender_name TEXT,
  sender_avatar TEXT,
  avatar_url TEXT,
  streak_days INTEGER,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_product_id ON notifications(product_id);

-- =============================================
-- 3. ROW LEVEL SECURITY POLICIES
-- =============================================

-- Enable RLS on votes
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view votes" ON votes;
DROP POLICY IF EXISTS "Users can insert their own votes" ON votes;
DROP POLICY IF EXISTS "Users can delete their own votes" ON votes;

-- Users can view all votes (to check if they've voted)
CREATE POLICY "Anyone can view votes"
  ON votes FOR SELECT
  USING (true);

-- Users can only insert their own votes
CREATE POLICY "Users can insert their own votes"
  ON votes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own votes
CREATE POLICY "Users can delete their own votes"
  ON votes FOR DELETE
  USING (auth.uid() = user_id);

-- Enable RLS on notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;
DROP POLICY IF EXISTS "System can insert notifications" ON notifications;

-- Users can only view their own notifications
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- System can insert notifications (for triggers)
CREATE POLICY "System can insert notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);

-- =============================================
-- 4. FUNCTION TO UPDATE PRODUCT UPVOTE COUNT
-- =============================================
-- Only create this if products table exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'products') THEN
    -- Create function to update product upvote count
    CREATE OR REPLACE FUNCTION update_product_upvote_count()
    RETURNS TRIGGER AS $func$
    BEGIN
      IF TG_OP = 'INSERT' THEN
        -- Increment upvote count
        UPDATE products
        SET upvotes_count = upvotes_count + 1
        WHERE id = NEW.product_id;
        RETURN NEW;
      ELSIF TG_OP = 'DELETE' THEN
        -- Decrement upvote count
        UPDATE products
        SET upvotes_count = GREATEST(upvotes_count - 1, 0)
        WHERE id = OLD.product_id;
        RETURN OLD;
      END IF;
      RETURN NULL;
    END;
    $func$ LANGUAGE plpgsql;

    -- Create trigger for vote count updates
    DROP TRIGGER IF EXISTS trigger_update_product_upvote_count ON votes;
    CREATE TRIGGER trigger_update_product_upvote_count
      AFTER INSERT OR DELETE ON votes
      FOR EACH ROW
      EXECUTE FUNCTION update_product_upvote_count();

    RAISE NOTICE 'Product upvote count trigger created successfully';
  ELSE
    RAISE NOTICE 'Products table does not exist - skipping product upvote count trigger';
  END IF;
END $$;

-- =============================================
-- 5. FUNCTION TO CREATE NOTIFICATION ON UPVOTE
-- =============================================
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'products')
     AND EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN

    CREATE OR REPLACE FUNCTION create_upvote_notification()
    RETURNS TRIGGER AS $func$
    DECLARE
      product_name TEXT;
      product_maker_id UUID;
      voter_username TEXT;
      voter_avatar TEXT;
    BEGIN
      -- Get product details and maker ID
      SELECT name, user_id INTO product_name, product_maker_id
      FROM products
      WHERE id = NEW.product_id;

      -- Don't notify if user upvotes their own product
      IF NEW.user_id = product_maker_id THEN
        RETURN NEW;
      END IF;

      -- Get voter details from profiles table
      SELECT username, avatar_url INTO voter_username, voter_avatar
      FROM profiles
      WHERE id = NEW.user_id;

      -- If no username in profiles, try to get from auth.users email
      IF voter_username IS NULL THEN
        SELECT COALESCE(
          (SELECT raw_user_meta_data->>'username' FROM auth.users WHERE id = NEW.user_id),
          SPLIT_PART((SELECT email FROM auth.users WHERE id = NEW.user_id), '@', 1)
        ) INTO voter_username;
      END IF;

      -- Create notification for product maker
      INSERT INTO notifications (
        user_id,
        type,
        title,
        message,
        product_id,
        sender_id,
        sender_name,
        sender_avatar
      ) VALUES (
        product_maker_id,
        'upvote',
        'New upvote on your product',
        COALESCE(voter_username, 'Someone') || ' upvoted ' || product_name,
        NEW.product_id,
        NEW.user_id,
        voter_username,
        voter_avatar
      );

      RETURN NEW;
    END;
    $func$ LANGUAGE plpgsql;

    -- Create trigger for upvote notifications
    DROP TRIGGER IF EXISTS trigger_create_upvote_notification ON votes;
    CREATE TRIGGER trigger_create_upvote_notification
      AFTER INSERT ON votes
      FOR EACH ROW
      EXECUTE FUNCTION create_upvote_notification();

    RAISE NOTICE 'Upvote notification trigger created successfully';
  ELSE
    RAISE NOTICE 'Products or profiles table does not exist - skipping upvote notification trigger';
  END IF;
END $$;

-- =============================================
-- 6. FUNCTION TO CREATE NOTIFICATION ON COMMENT
-- =============================================
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'products')
     AND EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'comments')
     AND EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN

    CREATE OR REPLACE FUNCTION create_comment_notification()
    RETURNS TRIGGER AS $func$
    DECLARE
      product_name TEXT;
      product_maker_id UUID;
      commenter_username TEXT;
      commenter_avatar TEXT;
    BEGIN
      -- Get product details and maker ID
      SELECT name, user_id INTO product_name, product_maker_id
      FROM products
      WHERE id = NEW.product_id;

      -- Don't notify if user comments on their own product
      IF NEW.user_id = product_maker_id THEN
        RETURN NEW;
      END IF;

      -- Get commenter details from profiles table
      SELECT username, avatar_url INTO commenter_username, commenter_avatar
      FROM profiles
      WHERE id = NEW.user_id;

      -- If no username in profiles, try to get from auth.users email
      IF commenter_username IS NULL THEN
        SELECT COALESCE(
          (SELECT raw_user_meta_data->>'username' FROM auth.users WHERE id = NEW.user_id),
          SPLIT_PART((SELECT email FROM auth.users WHERE id = NEW.user_id), '@', 1)
        ) INTO commenter_username;
      END IF;

      -- Create notification for product maker
      INSERT INTO notifications (
        user_id,
        type,
        title,
        message,
        product_id,
        comment_id,
        sender_id,
        sender_name,
        sender_avatar
      ) VALUES (
        product_maker_id,
        'comment',
        'New comment on your product',
        COALESCE(commenter_username, 'Someone') || ' commented on ' || product_name,
        NEW.product_id,
        NEW.id,
        NEW.user_id,
        commenter_username,
        commenter_avatar
      );

      RETURN NEW;
    END;
    $func$ LANGUAGE plpgsql;

    -- Create trigger for comment notifications
    DROP TRIGGER IF EXISTS trigger_create_comment_notification ON comments;
    CREATE TRIGGER trigger_create_comment_notification
      AFTER INSERT ON comments
      FOR EACH ROW
      EXECUTE FUNCTION create_comment_notification();

    RAISE NOTICE 'Comment notification trigger created successfully';
  ELSE
    RAISE NOTICE 'Products, comments, or profiles table does not exist - skipping comment notification trigger';
  END IF;
END $$;

-- =============================================
-- 7. VERIFY SETUP
-- =============================================
DO $$
BEGIN
  RAISE NOTICE 'Votes and Notifications system setup completed!';
  RAISE NOTICE 'Tables created: votes, notifications';
  RAISE NOTICE 'Check notices above for trigger status';
END $$;
