# 🚨 URGENT: Fix Database Error

## The Error You're Seeing

```
[Theme] Failed to load global theme:
{code: 'PGRST204', details: null, hint: null, message: "Could not find the table 'public.app_settings' in the schema cache"}
```

**This means**: The `app_settings` table doesn't exist in your Supabase database yet.

---

## ✅ Quick Fix (5 minutes)

### Step 1: Open Supabase Dashboard
Go to: https://supabase.com/dashboard/project/anzqsjvvguiqcenfdevh

### Step 2: Click SQL Editor
- Look at the left sidebar
- Click **SQL Editor** (database icon)

### Step 3: Create New Query
- Click **New Query** button (top right)

### Step 4: Copy This SQL

Open the file `supabase_migration_app_settings.sql` and copy ALL the content, OR copy this:

```sql
-- Create app_settings table for storing global theme
CREATE TABLE IF NOT EXISTS app_settings (
  id TEXT PRIMARY KEY,
  config JSONB NOT NULL,
  tokens JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read app_settings (for loading global theme)
CREATE POLICY "Anyone can read app_settings"
  ON app_settings
  FOR SELECT
  TO public
  USING (true);

-- Policy: Only admins can update app_settings
CREATE POLICY "Only admins can update app_settings"
  ON app_settings
  FOR ALL
  TO authenticated
  USING (
    auth.jwt() ->> 'email' IN (
      'admin@muslimhunt.com',
      'moderator@muslimhunt.com',
      'zeirislam@gmail.com'
    )
  );

-- Insert default theme if not exists
INSERT INTO app_settings (id, config, tokens)
VALUES (
  'global_theme',
  '{"primaryColor":"#10B981","accentColor":"#F59E0B","backgroundColor":"clean-white","roundness":"rounded"}',
  '{}'
)
ON CONFLICT (id) DO NOTHING;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_app_settings_id ON app_settings(id);
```

### Step 5: Paste and Run
1. Paste the SQL in the editor
2. Click **Run** button (or F5)
3. Wait for success message

### Step 6: Verify
Run this query to check:
```sql
SELECT * FROM app_settings WHERE id = 'global_theme';
```

You should see 1 row returned!

### Step 7: Reload Your App
- Go back to your Muslim Hunt app
- Press **Ctrl+Shift+R** (hard reload)
- The error should be gone!

---

## What Will Work Now

### ✅ Before SQL Migration (Current State)
- ❌ "Publish to All Users" → Shows error about missing table
- ✅ "Apply Theme" → Works (uses localStorage)
- ✅ App loads normally (uses localStorage fallback)

### ✅ After SQL Migration
- ✅ "Publish to All Users" → Works! Saves to database
- ✅ "Apply Theme" → Works (uses localStorage)
- ✅ App loads → Loads global theme from database
- ✅ All users see same theme

---

## If You Get Errors

### Error: "permission denied"
**Fix**: Re-run the RLS policy part of the SQL

### Error: "relation already exists"
**Meaning**: Table already created! You're good to go!

### Error: Network/CORS error
**Fix**: Check your internet connection and Supabase status

---

## Alternative: Skip Database for Now

If you don't want to use the database feature right now:

1. Just use "Apply Theme" button (works with localStorage)
2. "Publish to All Users" will show error but won't break the app
3. Run the SQL migration whenever you're ready

The app will continue working normally with localStorage!

---

## Quick Summary

**Problem**: Database table doesn't exist

**Solution**: Run SQL migration in Supabase

**Time**: 5 minutes

**File to run**: `supabase_migration_app_settings.sql`

**Where**: Supabase Dashboard → SQL Editor

**After**: Both "Apply Theme" and "Publish to All Users" will work!

---

Need help? Check these files:
- `SETUP_STEPS.md` - Detailed step-by-step guide
- `THEME_SETUP_BANGLA.md` - বাংলায় গাইড
- `THEME_DATABASE_SETUP.md` - Full documentation

The error won't break your app - it just means database publishing is not available until you run the migration! 🎨
