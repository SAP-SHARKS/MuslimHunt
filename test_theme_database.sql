-- Test script for theme database
-- Run these queries one by one in Supabase SQL Editor to test

-- 1. Check if app_settings table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables
  WHERE table_schema = 'public'
  AND table_name = 'app_settings'
);
-- Expected: true

-- 2. Check if global_theme row exists
SELECT * FROM app_settings WHERE id = 'global_theme';
-- Expected: One row with config and tokens

-- 3. Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'app_settings';
-- Expected: Two policies (read for public, write for admins)

-- 4. Test reading theme (should work for anyone)
SELECT
  id,
  config->>'primaryColor' as primary_color,
  config->>'backgroundColor' as background,
  updated_at
FROM app_settings
WHERE id = 'global_theme';
-- Expected: Should return the theme config

-- 5. Test updating theme (only works if you're logged in as admin)
UPDATE app_settings
SET
  config = jsonb_set(
    config,
    '{primaryColor}',
    '"#0EA5E9"'
  ),
  updated_at = NOW()
WHERE id = 'global_theme'
RETURNING *;
-- Expected: If admin - success, if not admin - permission denied

-- 6. Check update timestamp
SELECT
  id,
  updated_at,
  extract(epoch from (NOW() - updated_at)) as seconds_since_update
FROM app_settings
WHERE id = 'global_theme';
-- Expected: Shows when theme was last updated

-- 7. Verify JSON structure
SELECT
  jsonb_pretty(config) as theme_config,
  jsonb_typeof(config) as config_type,
  jsonb_typeof(tokens) as tokens_type
FROM app_settings
WHERE id = 'global_theme';
-- Expected: Pretty-printed JSON config

-- 8. Test inserting a test theme (will fail if already exists)
INSERT INTO app_settings (id, config, tokens)
VALUES (
  'test_theme',
  '{"primaryColor":"#FF0000","backgroundColor":"clean-white","roundness":"rounded"}',
  '{}'
);
-- Expected: Should insert (or error if already exists)

-- 9. Clean up test theme
DELETE FROM app_settings WHERE id = 'test_theme';
-- Expected: Deletes test row

-- 10. Final verification - check everything is OK
SELECT
  COUNT(*) as total_rows,
  COUNT(*) FILTER (WHERE id = 'global_theme') as has_global_theme,
  MAX(updated_at) as last_update
FROM app_settings;
-- Expected: total_rows >= 1, has_global_theme = 1, last_update = recent timestamp

-- Success! If all queries work, your database is set up correctly ✅
