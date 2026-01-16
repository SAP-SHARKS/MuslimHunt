-- Thread Review RLS Policy for Admin
-- Run this in Supabase SQL Editor to enable admin thread review functionality

-- 1. First, let's see existing policies on threads table
-- SELECT * FROM pg_policies WHERE tablename = 'threads';

-- 2. Allow admins to read ALL threads (including pending ones)
CREATE POLICY "Admins can read all threads" ON threads
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- 3. Allow admins to update threads (for approval)
CREATE POLICY "Admins can update threads" ON threads
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- 4. Allow admins to delete threads (for rejection)
CREATE POLICY "Admins can delete threads" ON threads
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- 5. Make sure regular users can only see approved threads
-- (You may need to update existing SELECT policy)
-- DROP POLICY IF EXISTS "Users can read approved threads" ON threads;
CREATE POLICY "Users can read approved threads" ON threads
FOR SELECT
TO public
USING (is_approved = true);

-- 6. Allow thread authors to see their own pending threads
CREATE POLICY "Authors can read their own threads" ON threads
FOR SELECT
TO authenticated
USING (author_id = auth.uid());


-- IMPORTANT: If you get "policy already exists" errors, run these DROP commands first:
-- DROP POLICY IF EXISTS "Admins can read all threads" ON threads;
-- DROP POLICY IF EXISTS "Admins can update threads" ON threads;
-- DROP POLICY IF EXISTS "Admins can delete threads" ON threads;
-- DROP POLICY IF EXISTS "Users can read approved threads" ON threads;
-- DROP POLICY IF EXISTS "Authors can read their own threads" ON threads;
