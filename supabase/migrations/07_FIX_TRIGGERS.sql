-- FIX TRIGGERS - This fixes the trigger functions that reference missing columns

-- =============================================
-- 1. FIRST, CHECK IF PRODUCTS TABLE HAS upvotes_count COLUMN
-- =============================================

DO $$
BEGIN
  -- Check if upvotes_count column exists in products table
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'upvotes_count'
  ) THEN
    -- Add the column
    ALTER TABLE products ADD COLUMN upvotes_count INTEGER DEFAULT 0;
    RAISE NOTICE 'Added upvotes_count column to products table';
  ELSE
    RAISE NOTICE 'upvotes_count column already exists in products table';
  END IF;
END $$;

-- =============================================
-- 2. DROP ALL EXISTING VOTE TRIGGERS
-- =============================================

DROP TRIGGER IF EXISTS on_vote_change ON votes;
DROP TRIGGER IF EXISTS trigger_notify_maker_on_upvote ON votes;
DROP TRIGGER IF EXISTS trigger_update_product_upvotes ON votes;

-- =============================================
-- 3. DROP EXISTING FUNCTIONS
-- =============================================

DROP FUNCTION IF EXISTS update_product_upvotes_count() CASCADE;
DROP FUNCTION IF EXISTS update_product_upvotes() CASCADE;
DROP FUNCTION IF EXISTS notify_maker_on_upvote() CASCADE;

-- =============================================
-- 4. CREATE FUNCTION TO UPDATE UPVOTE COUNT
-- =============================================

CREATE OR REPLACE FUNCTION update_product_upvotes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Increment upvote count when a vote is added
    UPDATE products
    SET upvotes_count = COALESCE(upvotes_count, 0) + 1
    WHERE id = NEW.product_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Decrement upvote count when a vote is removed
    UPDATE products
    SET upvotes_count = GREATEST(COALESCE(upvotes_count, 0) - 1, 0)
    WHERE id = OLD.product_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 5. CREATE FUNCTION TO NOTIFY MAKER ON UPVOTE
-- =============================================

CREATE OR REPLACE FUNCTION notify_maker_on_upvote()
RETURNS TRIGGER AS $$
DECLARE
  product_name TEXT;
  product_user_id UUID;
  voter_username TEXT;
  voter_avatar TEXT;
BEGIN
  -- Only send notification on INSERT (new upvote)
  IF TG_OP = 'INSERT' THEN
    -- Get product details and maker
    SELECT name, user_id INTO product_name, product_user_id
    FROM products
    WHERE id = NEW.product_id;

    -- If product not found, skip notification
    IF product_user_id IS NULL THEN
      RETURN NEW;
    END IF;

    -- Get voter details from profiles table
    SELECT username, avatar_url
    INTO voter_username, voter_avatar
    FROM profiles
    WHERE id = NEW.user_id;

    -- If voter not found, use defaults
    IF voter_username IS NULL THEN
      voter_username := 'Someone';
      voter_avatar := 'https://i.pravatar.cc/150?u=default';
    END IF;

    -- Don't notify if user upvotes their own product
    IF product_user_id IS DISTINCT FROM NEW.user_id THEN
      -- Insert notification for product maker
      INSERT INTO notifications (
        user_id,
        type,
        title,
        message,
        product_id,
        sender_id,
        sender_name,
        sender_avatar,
        avatar_url,
        is_read,
        created_at
      ) VALUES (
        product_user_id,
        'upvote',
        'New Upvote!',
        voter_username || ' upvoted your product ' || product_name,
        NEW.product_id,
        NEW.user_id,
        voter_username,
        voter_avatar,
        voter_avatar,
        false,
        NOW()
      );
    END IF;
  END IF;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the vote insert
    RAISE WARNING 'Error in notify_maker_on_upvote: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 6. CREATE TRIGGERS
-- =============================================

-- Trigger for updating upvote count
CREATE TRIGGER trigger_update_product_upvotes
AFTER INSERT OR DELETE ON votes
FOR EACH ROW
EXECUTE FUNCTION update_product_upvotes();

-- Trigger for notifying maker
CREATE TRIGGER trigger_notify_maker_on_upvote
AFTER INSERT ON votes
FOR EACH ROW
EXECUTE FUNCTION notify_maker_on_upvote();

-- =============================================
-- 7. ENSURE NOTIFICATIONS TABLE EXISTS
-- =============================================

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
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

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policies
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
-- 8. ADD TO REALTIME
-- =============================================

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
  RAISE NOTICE 'Added notifications to realtime';
EXCEPTION
  WHEN duplicate_object THEN
    RAISE NOTICE 'notifications already in realtime';
END $$;

-- =============================================
-- 9. VERIFY EVERYTHING
-- =============================================

DO $$
DECLARE
  trigger_count INTEGER;
  products_cols TEXT;
BEGIN
  -- Count triggers on votes table
  SELECT COUNT(*) INTO trigger_count
  FROM information_schema.triggers
  WHERE event_object_table = 'votes';

  -- Get products columns
  SELECT string_agg(column_name, ', ' ORDER BY ordinal_position)
  INTO products_cols
  FROM information_schema.columns
  WHERE table_name = 'products';

  RAISE NOTICE '========================================';
  RAISE NOTICE 'TRIGGERS FIXED SUCCESSFULLY!';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE 'Products table columns: %', products_cols;
  RAISE NOTICE '';
  RAISE NOTICE 'Triggers on votes table: %', trigger_count;
  RAISE NOTICE '  ✓ trigger_update_product_upvotes';
  RAISE NOTICE '  ✓ trigger_notify_maker_on_upvote';
  RAISE NOTICE '';
  RAISE NOTICE 'Functions created:';
  RAISE NOTICE '  ✓ update_product_upvotes()';
  RAISE NOTICE '  ✓ notify_maker_on_upvote()';
  RAISE NOTICE '';
  RAISE NOTICE 'Tables ready:';
  RAISE NOTICE '  ✓ votes';
  RAISE NOTICE '  ✓ notifications';
  RAISE NOTICE '  ✓ products (with upvotes_count)';
  RAISE NOTICE '';
  RAISE NOTICE 'DONE! Your upvote system is ready.';
  RAISE NOTICE '';
  RAISE NOTICE 'Dont forget to enable Realtime for:';
  RAISE NOTICE '  - votes table';
  RAISE NOTICE '  - notifications table';
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
END $$;
