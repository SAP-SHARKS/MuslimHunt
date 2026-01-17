-- Admin Policies for Threads Table
-- Run this in Supabase SQL Editor to allow admins to see and manage all threads

-- Drop existing admin policy if exists
DROP POLICY IF EXISTS "Admins can view all threads" ON threads;
DROP POLICY IF EXISTS "Admins can update threads" ON threads;
DROP POLICY IF EXISTS "Admins can delete threads" ON threads;

-- Allow admins to view ALL threads (including unapproved ones)
CREATE POLICY "Admins can view all threads"
  ON threads
  FOR SELECT
  USING (
    auth.jwt() ->> 'email' IN (
      'admin@muslimhunt.com',
      'moderator@muslimhunt.com',
      'zeirislam@gmail.com'
    )
    OR is_approved = true
  );

-- Allow admins to update threads
CREATE POLICY "Admins can update threads"
  ON threads
  FOR UPDATE
  USING (
    auth.jwt() ->> 'email' IN (
      'admin@muslimhunt.com',
      'moderator@muslimhunt.com',
      'zeirislam@gmail.com'
    )
  );

-- Allow admins to delete threads
CREATE POLICY "Admins can delete threads"
  ON threads
  FOR DELETE
  USING (
    auth.jwt() ->> 'email' IN (
      'admin@muslimhunt.com',
      'moderator@muslimhunt.com',
      'zeirislam@gmail.com'
    )
  );

-- Also update the existing policy to allow public to view only approved threads
DROP POLICY IF EXISTS "Anyone can view approved threads" ON threads;

CREATE POLICY "Anyone can view approved threads"
  ON threads
  FOR SELECT
  USING (is_approved = true);
