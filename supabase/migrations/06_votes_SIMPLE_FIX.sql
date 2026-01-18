-- Simple Fix: Add missing columns to votes table and create notifications

-- =============================================
-- 1. CHECK CURRENT VOTES TABLE STRUCTURE
-- =============================================

DO $$
DECLARE
  col_list TEXT;
BEGIN
  SELECT string_agg(column_name, ', ' ORDER BY ordinal_position)
  INTO col_list
  FROM information_schema.columns
  WHERE table_name = 'votes';

  RAISE NOTICE '========================================';
  RAISE NOTICE 'Current votes table columns: %', col_list;
  RAISE NOTICE '========================================';
END $$;

-- =============================================
-- 2. ADD MISSING COLUMNS TO VOTES TABLE
-- =============================================

-- Add product_id if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'votes' AND column_name = 'product_id'
  ) THEN
    -- Check if there's a different column that should be product_id
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'votes' AND column_name = 'post_id'
    ) THEN
      ALTER TABLE votes RENAME COLUMN post_id TO product_id;
      RAISE NOTICE 'Renamed post_id to product_id';
    ELSIF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'votes' AND column_name = 'item_id'
    ) THEN
      ALTER TABLE votes RENAME COLUMN item_id TO product_id;
      RAISE NOTICE 'Renamed item_id to product_id';
    ELSE
      -- Add as new column - you'll need to populate it
      ALTER TABLE votes ADD COLUMN product_id UUID;
      RAISE NOTICE 'Added product_id column (NULL allowed for now)';
      RAISE WARNING 'You need to populate product_id column with data!';
    END IF;
  ELSE
    RAISE NOTICE 'product_id column already exists';
  END IF;
END $$;

-- Add user_id if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'votes' AND column_name = 'user_id'
  ) THEN
    -- Check if there's a different column
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'votes' AND column_name = 'voter_id'
    ) THEN
      ALTER TABLE votes RENAME COLUMN voter_id TO user_id;
      RAISE NOTICE 'Renamed voter_id to user_id';
    ELSE
      ALTER TABLE votes ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
      RAISE NOTICE 'Added user_id column';
    END IF;
  ELSE
    RAISE NOTICE 'user_id column already exists';
  END IF;
END $$;

-- Add created_at if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'votes' AND column_name = 'created_at'
  ) THEN
    ALTER TABLE votes ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW());
    -- Update existing rows
    UPDATE votes SET created_at = NOW() WHERE created_at IS NULL;
    -- Make it NOT NULL
    ALTER TABLE votes ALTER COLUMN created_at SET NOT NULL;
    RAISE NOTICE 'Added created_at column';
  ELSE
    RAISE NOTICE 'created_at column already exists';
  END IF;
END $$;

-- =============================================
-- 3. CREATE INDEXES
-- =============================================

CREATE INDEX IF NOT EXISTS idx_votes_user_id ON votes(user_id);
CREATE INDEX IF NOT EXISTS idx_votes_product_id ON votes(product_id);
CREATE INDEX IF NOT EXISTS idx_votes_user_product ON votes(user_id, product_id);

-- =============================================
-- 4. CREATE NOTIFICATIONS TABLE
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
-- 5. ENABLE RLS ON VOTES
-- =============================================

ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view votes" ON votes;
DROP POLICY IF EXISTS "Users can insert their own votes" ON votes;
DROP POLICY IF EXISTS "Users can delete their own votes" ON votes;

-- Create policies
CREATE POLICY "Anyone can view votes"
  ON votes FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own votes"
  ON votes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own votes"
  ON votes FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================
-- 6. ENABLE RLS ON NOTIFICATIONS
-- =============================================

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;
DROP POLICY IF EXISTS "System can insert notifications" ON notifications;

CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);

-- =============================================
-- 7. ADD TO REALTIME
-- =============================================

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE votes;
  RAISE NOTICE 'Added votes to realtime';
EXCEPTION
  WHEN duplicate_object THEN
    RAISE NOTICE 'votes already in realtime';
END $$;

-- =============================================
-- 8. SHOW FINAL STRUCTURE
-- =============================================

DO $$
DECLARE
  col_list TEXT;
BEGIN
  SELECT string_agg(column_name || ' (' || data_type || ')', ', ' ORDER BY ordinal_position)
  INTO col_list
  FROM information_schema.columns
  WHERE table_name = 'votes';

  RAISE NOTICE '========================================';
  RAISE NOTICE 'Setup Complete!';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE 'Final votes table structure:';
  RAISE NOTICE '%', col_list;
  RAISE NOTICE '';
  RAISE NOTICE 'Tables ready:';
  RAISE NOTICE '  ✓ votes';
  RAISE NOTICE '  ✓ notifications';
  RAISE NOTICE '';
  RAISE NOTICE 'NEXT STEPS:';
  RAISE NOTICE '1. Check if product_id column has data';
  RAISE NOTICE '2. Go to Dashboard > Database > Replication';
  RAISE NOTICE '3. Enable Realtime for votes and notifications';
  RAISE NOTICE '4. Run: 07_upvote_triggers_and_notifications_SAFE.sql';
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
END $$;
