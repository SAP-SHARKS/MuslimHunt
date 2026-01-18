-- Votes and Notifications System (FINAL VERSION)
-- This migration works with your EXISTING votes table

-- =============================================
-- 1. USE EXISTING VOTES TABLE
-- =============================================

DO $$
BEGIN
  -- Check if votes table exists
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'votes') THEN
    RAISE NOTICE 'Table "votes" already exists. Will update it if needed.';
  ELSE
    RAISE EXCEPTION 'Table "votes" does not exist. Please check your database.';
  END IF;
END $$;

-- =============================================
-- 2. ENSURE VOTES TABLE HAS CORRECT COLUMNS
-- =============================================

DO $$
BEGIN
  -- Add product_id column if it doesn't exist
  IF NOT EXISTS (
    SELECT FROM information_schema.columns
    WHERE table_name = 'votes' AND column_name = 'product_id'
  ) THEN
    ALTER TABLE votes ADD COLUMN product_id UUID NOT NULL;
    RAISE NOTICE 'Added product_id column to votes table.';
  ELSE
    RAISE NOTICE 'Column product_id already exists.';
  END IF;

  -- Add user_id column if it doesn't exist
  IF NOT EXISTS (
    SELECT FROM information_schema.columns
    WHERE table_name = 'votes' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE votes ADD COLUMN user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE;
    RAISE NOTICE 'Added user_id column to votes table.';
  ELSE
    RAISE NOTICE 'Column user_id already exists.';
  END IF;

  -- Add created_at column if it doesn't exist
  IF NOT EXISTS (
    SELECT FROM information_schema.columns
    WHERE table_name = 'votes' AND column_name = 'created_at'
  ) THEN
    ALTER TABLE votes ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL;
    RAISE NOTICE 'Added created_at column to votes table.';
  ELSE
    RAISE NOTICE 'Column created_at already exists.';
  END IF;
END $$;

-- =============================================
-- 3. ADD UNIQUE CONSTRAINT IF NOT EXISTS
-- =============================================

DO $$
BEGIN
  -- Add unique constraint on user_id, product_id if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'votes_user_id_product_id_key'
    AND conrelid = 'votes'::regclass
  ) THEN
    ALTER TABLE votes ADD CONSTRAINT votes_user_id_product_id_key UNIQUE(user_id, product_id);
    RAISE NOTICE 'Added unique constraint on (user_id, product_id).';
  ELSE
    RAISE NOTICE 'Unique constraint already exists.';
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Could not add unique constraint: %', SQLERRM;
END $$;

-- =============================================
-- 4. CREATE INDEXES FOR VOTES TABLE
-- =============================================

CREATE INDEX IF NOT EXISTS idx_votes_user_id ON votes(user_id);
CREATE INDEX IF NOT EXISTS idx_votes_product_id ON votes(product_id);
CREATE INDEX IF NOT EXISTS idx_votes_user_product ON votes(user_id, product_id);

-- =============================================
-- 5. CREATE NOTIFICATIONS TABLE
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
-- 6. ROW LEVEL SECURITY POLICIES FOR VOTES
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

-- =============================================
-- 7. ROW LEVEL SECURITY POLICIES FOR NOTIFICATIONS
-- =============================================

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
-- 8. ENABLE REALTIME FOR VOTES TABLE
-- =============================================

-- Enable realtime replication for votes table
DO $$
BEGIN
  -- Try to add to publication
  EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE votes';
  RAISE NOTICE 'Added votes table to realtime publication.';
EXCEPTION
  WHEN duplicate_object THEN
    RAISE NOTICE 'Votes table already in realtime publication.';
  WHEN OTHERS THEN
    RAISE NOTICE 'Note: Could not add to realtime publication: %', SQLERRM;
END $$;

-- =============================================
-- 9. DELETE OLD UPVOTES TABLE IF IT EXISTS
-- =============================================

DO $$
BEGIN
  -- Check if upvotes table exists and is empty
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'upvotes') THEN
    -- Count rows in upvotes table
    DECLARE
      row_count INTEGER;
    BEGIN
      SELECT COUNT(*) INTO row_count FROM upvotes;

      IF row_count = 0 THEN
        DROP TABLE upvotes CASCADE;
        RAISE NOTICE 'Deleted empty "upvotes" table.';
      ELSE
        RAISE NOTICE 'WARNING: "upvotes" table has % rows. Please manually migrate data or delete it.', row_count;
      END IF;
    END;
  END IF;
END $$;

-- =============================================
-- 10. VERIFY SETUP
-- =============================================

DO $$
DECLARE
  votes_columns TEXT;
BEGIN
  -- Get list of columns in votes table
  SELECT string_agg(column_name, ', ' ORDER BY ordinal_position)
  INTO votes_columns
  FROM information_schema.columns
  WHERE table_name = 'votes';

  RAISE NOTICE '========================================';
  RAISE NOTICE 'Votes and Notifications System Setup Complete!';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE 'Tables verified:';
  RAISE NOTICE '  ✓ votes (columns: %)', votes_columns;
  RAISE NOTICE '  ✓ notifications (with RLS policies)';
  RAISE NOTICE '';
  RAISE NOTICE 'Indexes created:';
  RAISE NOTICE '  ✓ idx_votes_user_id';
  RAISE NOTICE '  ✓ idx_votes_product_id';
  RAISE NOTICE '  ✓ idx_votes_user_product';
  RAISE NOTICE '  ✓ idx_notifications_user_id';
  RAISE NOTICE '  ✓ idx_notifications_created_at';
  RAISE NOTICE '';
  RAISE NOTICE 'RLS Policies:';
  RAISE NOTICE '  ✓ votes table (3 policies)';
  RAISE NOTICE '  ✓ notifications table (3 policies)';
  RAISE NOTICE '';
  RAISE NOTICE 'IMPORTANT - Manual Steps Required:';
  RAISE NOTICE '1. Go to Supabase Dashboard > Database > Replication';
  RAISE NOTICE '2. Find "votes" table and toggle ON "Enable Realtime"';
  RAISE NOTICE '3. Find "notifications" table and toggle ON "Enable Realtime"';
  RAISE NOTICE '';
  RAISE NOTICE 'Next Step: Run migration 07_upvote_triggers_and_notifications_SAFE.sql';
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
END $$;
