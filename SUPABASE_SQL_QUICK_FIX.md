# Quick Fix: Run This SQL in Supabase

## 🚨 Error: "Could not find the table 'public.app_settings'"

This error appears when you click "Publish to All Users" because the database table doesn't exist yet.

---

## ✅ Solution (2 minutes)

### Step 1: Go to Supabase
Open: **https://supabase.com/dashboard/project/anzqsjvvguiqcenfdevh/editor**

(Or go to your Supabase dashboard → Click "SQL Editor" in sidebar)

### Step 2: Click "New Query"
Top right corner, click the **"New Query"** button

### Step 3: Copy & Paste This SQL

```sql
-- Create table for global app settings
CREATE TABLE IF NOT EXISTS app_settings (
  id TEXT PRIMARY KEY,
  config JSONB NOT NULL,
  tokens JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable security
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read (for loading theme)
CREATE POLICY "Anyone can read app_settings"
  ON app_settings FOR SELECT TO public USING (true);

-- Only admins can write (your email is in the list)
CREATE POLICY "Only admins can update app_settings"
  ON app_settings FOR ALL TO authenticated
  USING (
    auth.jwt() ->> 'email' IN (
      'admin@muslimhunt.com',
      'moderator@muslimhunt.com',
      'zeirislam@gmail.com'
    )
  );

-- Insert default theme
INSERT INTO app_settings (id, config, tokens)
VALUES (
  'global_theme',
  '{"primaryColor":"#10B981","accentColor":"#F59E0B","backgroundColor":"clean-white","roundness":"rounded"}',
  '{}'
)
ON CONFLICT (id) DO NOTHING;

-- Add index for speed
CREATE INDEX IF NOT EXISTS idx_app_settings_id ON app_settings(id);
```

### Step 4: Click "Run" (or press F5)

You should see: **"Success. No rows returned"**

### Step 5: Verify It Worked

Run this quick test:
```sql
SELECT * FROM app_settings WHERE id = 'global_theme';
```

You should see **1 row** with your default theme!

### Step 6: Go Back to Your App

Reload your Muslim Hunt app and try "Publish to All Users" again. It will work now! ✅

---

## What This Does

- ✅ Creates `app_settings` table in your database
- ✅ Adds security (only admins can publish)
- ✅ Inserts default theme
- ✅ Makes "Publish to All Users" button work
- ✅ Lets everyone see the same theme across all devices

---

## বাংলায় (In Bengali)

1. Supabase Dashboard খুলুন
2. **SQL Editor** এ যান
3. **New Query** করুন
4. উপরের SQL টা কপি-পেস্ট করুন
5. **Run** button ক্লিক করুন
6. App reload করুন

Done! এখন "Publish to All Users" কাজ করবে! 🎉

---

## Still Having Issues?

### Error: "permission denied"
Re-run the policy part (the CREATE POLICY lines)

### Error: "relation already exists"
Great! Table is already created. Just use the app.

### No error but button still doesn't work
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard reload (Ctrl+Shift+R)
3. Check you're logged in as admin (zeirislam@gmail.com)

---

**Time to fix**: 2 minutes
**Difficulty**: Copy & paste
**Result**: "Publish to All Users" works perfectly!

Happy theming! 🎨✨
