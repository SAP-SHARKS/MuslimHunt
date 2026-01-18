-- Product Images Storage Setup
-- This creates a storage bucket for product logos and images

-- =============================================
-- 1. CREATE STORAGE BUCKET (run in Supabase Dashboard SQL Editor)
-- =============================================

-- Note: Storage buckets must be created via the Supabase Dashboard or using the supabase CLI
-- Go to: Storage > New Bucket
-- Name: product-images
-- Public: Yes (so logos can be displayed without authentication)

-- =============================================
-- 2. STORAGE POLICIES (after creating bucket)
-- =============================================

-- Allow anyone to view product images (public bucket)
-- Run this in the SQL Editor after creating the bucket:

/*
-- Policy: Allow public read access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Policy: Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images'
  AND auth.role() = 'authenticated'
);

-- Policy: Users can update their own uploads
CREATE POLICY "Users can update own uploads"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'product-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Users can delete their own uploads
CREATE POLICY "Users can delete own uploads"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'product-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
*/

-- =============================================
-- MANUAL STEPS IN SUPABASE DASHBOARD:
-- =============================================

-- 1. Go to Storage in Supabase Dashboard
-- 2. Click "New Bucket"
-- 3. Name: product-images
-- 4. Toggle ON "Public bucket"
-- 5. Click "Create bucket"
-- 6. Go to "Policies" tab
-- 7. Click "New Policy" and add policies for:
--    - SELECT: Allow public access (no condition)
--    - INSERT: Allow authenticated users
--    - UPDATE/DELETE: Allow users to manage their own files

DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'PRODUCT IMAGES STORAGE SETUP';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE 'This is a REMINDER migration.';
  RAISE NOTICE 'Storage buckets must be created manually.';
  RAISE NOTICE '';
  RAISE NOTICE 'STEPS:';
  RAISE NOTICE '1. Go to Supabase Dashboard > Storage';
  RAISE NOTICE '2. Click "New Bucket"';
  RAISE NOTICE '3. Name: product-images';
  RAISE NOTICE '4. Enable "Public bucket"';
  RAISE NOTICE '5. Create bucket';
  RAISE NOTICE '6. Add policies (see comments above)';
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
END $$;
