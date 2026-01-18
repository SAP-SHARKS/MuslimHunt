-- Create follows table
CREATE TABLE IF NOT EXISTS follows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    follower_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    following_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(follower_id, following_id),
    CONSTRAINT different_users CHECK (follower_id != following_id)
);

-- Add stats columns to profiles if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'followers_count') THEN
        ALTER TABLE profiles ADD COLUMN followers_count INTEGER DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'following_count') THEN
        ALTER TABLE profiles ADD COLUMN following_count INTEGER DEFAULT 0;
    END IF;
END $$;

-- Enable RLS
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can read follows"
    ON follows FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can follow others"
    ON follows FOR INSERT
    WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow"
    ON follows FOR DELETE
    USING (auth.uid() = follower_id);

-- Trigger Function to update counts
CREATE OR REPLACE FUNCTION update_follow_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        -- Increase following count for the follower
        UPDATE profiles 
        SET following_count = following_count + 1
        WHERE id = NEW.follower_id;

        -- Increase followers count for the person being followed
        UPDATE profiles 
        SET followers_count = followers_count + 1
        WHERE id = NEW.following_id;
    ELSIF (TG_OP = 'DELETE') THEN
        -- Decrease following count for the follower
        UPDATE profiles 
        SET following_count = GREATEST(following_count - 1, 0)
        WHERE id = OLD.follower_id;

        -- Decrease followers count for the person being followed
        UPDATE profiles 
        SET followers_count = GREATEST(followers_count - 1, 0)
        WHERE id = OLD.following_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger
DROP TRIGGER IF EXISTS on_follow_change ON follows;
CREATE TRIGGER on_follow_change
    AFTER INSERT OR DELETE ON follows
    FOR EACH ROW
    EXECUTE FUNCTION update_follow_counts();
