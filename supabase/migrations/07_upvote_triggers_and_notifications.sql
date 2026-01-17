-- Upvote Triggers and Notifications System
-- This migration adds triggers to automatically update upvote counts and send notifications

-- =============================================
-- 1. FUNCTION TO UPDATE PRODUCT UPVOTE COUNT
-- =============================================

-- Drop function if it exists
DROP FUNCTION IF EXISTS update_product_upvotes() CASCADE;

-- Create function to update product upvote count
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
$$ LANGUAGE plpgsql;

-- =============================================
-- 2. CREATE TRIGGER FOR UPVOTE COUNT
-- =============================================

-- Drop trigger if it exists
DROP TRIGGER IF EXISTS trigger_update_product_upvotes ON votes;

-- Create trigger for INSERT
CREATE TRIGGER trigger_update_product_upvotes
AFTER INSERT OR DELETE ON votes
FOR EACH ROW
EXECUTE FUNCTION update_product_upvotes();

-- =============================================
-- 3. FUNCTION TO NOTIFY PRODUCT MAKER ON UPVOTE
-- =============================================

-- Drop function if it exists
DROP FUNCTION IF EXISTS notify_maker_on_upvote() CASCADE;

-- Create function to send notification to product maker
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

    -- Get voter details
    SELECT
      COALESCE(raw_user_meta_data->>'full_name', email) as username,
      COALESCE(raw_user_meta_data->>'avatar_url', 'https://i.pravatar.cc/150?u=' || id::text) as avatar
    INTO voter_username, voter_avatar
    FROM auth.users
    WHERE id = NEW.user_id;

    -- Don't notify if user upvotes their own product
    IF product_user_id != NEW.user_id THEN
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
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- 4. CREATE TRIGGER FOR MAKER NOTIFICATIONS
-- =============================================

-- Drop trigger if it exists
DROP TRIGGER IF EXISTS trigger_notify_maker_on_upvote ON votes;

-- Create trigger for upvote notifications
CREATE TRIGGER trigger_notify_maker_on_upvote
AFTER INSERT ON votes
FOR EACH ROW
EXECUTE FUNCTION notify_maker_on_upvote();

-- =============================================
-- 5. FUNCTION TO NOTIFY MAKER ON NEW COMMENT
-- =============================================

-- Drop function if it exists
DROP FUNCTION IF EXISTS notify_maker_on_comment() CASCADE;

-- Create function to send notification to product maker on comment
CREATE OR REPLACE FUNCTION notify_maker_on_comment()
RETURNS TRIGGER AS $$
DECLARE
  product_name TEXT;
  product_user_id UUID;
  commenter_username TEXT;
  commenter_avatar TEXT;
BEGIN
  -- Get product details and maker
  SELECT name, user_id INTO product_name, product_user_id
  FROM products
  WHERE id = NEW.product_id;

  -- Get commenter details
  SELECT username, avatar_url
  INTO commenter_username, commenter_avatar
  FROM profiles
  WHERE id = NEW.user_id;

  -- Don't notify if user comments on their own product
  IF product_user_id != NEW.user_id THEN
    -- Insert notification for product maker
    INSERT INTO notifications (
      user_id,
      type,
      title,
      message,
      product_id,
      comment_id,
      sender_id,
      sender_name,
      sender_avatar,
      avatar_url,
      is_read,
      created_at
    ) VALUES (
      product_user_id,
      'comment',
      'New Comment!',
      commenter_username || ' commented on your product ' || product_name,
      NEW.product_id,
      NEW.id,
      NEW.user_id,
      commenter_username,
      commenter_avatar,
      commenter_avatar,
      false,
      NOW()
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- 6. CREATE TRIGGER FOR COMMENT NOTIFICATIONS
-- =============================================

-- Drop trigger if it exists
DROP TRIGGER IF EXISTS trigger_notify_maker_on_comment ON comments;

-- Create trigger for comment notifications
CREATE TRIGGER trigger_notify_maker_on_comment
AFTER INSERT ON comments
FOR EACH ROW
EXECUTE FUNCTION notify_maker_on_comment();

-- =============================================
-- 7. ENABLE REALTIME FOR NOTIFICATIONS
-- =============================================

-- Enable realtime replication for notifications table
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- =============================================
-- 8. VERIFY SETUP
-- =============================================

DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Upvote Triggers and Notifications Setup Complete!';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE 'Functions created:';
  RAISE NOTICE '  ✓ update_product_upvotes()';
  RAISE NOTICE '  ✓ notify_maker_on_upvote()';
  RAISE NOTICE '  ✓ notify_maker_on_comment()';
  RAISE NOTICE '';
  RAISE NOTICE 'Triggers created:';
  RAISE NOTICE '  ✓ trigger_update_product_upvotes (on votes table)';
  RAISE NOTICE '  ✓ trigger_notify_maker_on_upvote (on votes table)';
  RAISE NOTICE '  ✓ trigger_notify_maker_on_comment (on comments table)';
  RAISE NOTICE '';
  RAISE NOTICE 'Realtime enabled:';
  RAISE NOTICE '  ✓ notifications table added to supabase_realtime publication';
  RAISE NOTICE '';
  RAISE NOTICE 'Features now available:';
  RAISE NOTICE '  ✓ Automatic upvote count updates';
  RAISE NOTICE '  ✓ Real-time notifications for makers';
  RAISE NOTICE '  ✓ Notifications on upvotes and comments';
  RAISE NOTICE '';
  RAISE NOTICE 'IMPORTANT - Manual Steps Required:';
  RAISE NOTICE '1. Go to Supabase Dashboard > Database > Replication';
  RAISE NOTICE '2. Find "notifications" table and toggle ON "Enable Realtime"';
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
END $$;
