-- Fix Threads Foreign Key Relationships
-- This adds the missing foreign key constraints for threads table

-- First, check if the foreign key already exists and drop it if needed
DO $$
BEGIN
    -- Drop existing foreign key if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'threads_author_id_fkey'
        AND table_name = 'threads'
    ) THEN
        ALTER TABLE threads DROP CONSTRAINT threads_author_id_fkey;
    END IF;
END $$;

-- Add foreign key constraint for author_id -> auth.users
ALTER TABLE threads
ADD CONSTRAINT threads_author_id_fkey
FOREIGN KEY (author_id)
REFERENCES auth.users(id)
ON DELETE CASCADE;

-- Verify the constraint was created
SELECT
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_name = 'threads'
    AND kcu.column_name = 'author_id';
