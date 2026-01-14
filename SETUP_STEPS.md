# Theme Database Setup - Step by Step

## 📋 Quick Setup Checklist

Follow these steps in order:

### ✅ Step 1: Open Supabase Dashboard
1. Go to: https://supabase.com/dashboard
2. Login with your account
3. Select your project (anzqsjvvguiqcenfdevh)

### ✅ Step 2: Open SQL Editor
1. Look at left sidebar
2. Click on **SQL Editor** (database icon)
3. You'll see a SQL query interface

### ✅ Step 3: Create New Query
1. Click **New Query** button (top right)
2. You'll see an empty SQL editor

### ✅ Step 4: Copy SQL Migration
1. Open file: `supabase_migration_app_settings.sql`
2. Select all text (Ctrl+A)
3. Copy (Ctrl+C)

### ✅ Step 5: Paste and Run
1. Go back to Supabase SQL Editor
2. Paste the SQL code (Ctrl+V)
3. Click **Run** button (or press F5)
4. Wait for "Success. No rows returned" message

### ✅ Step 6: Verify Table Created
1. In SQL Editor, clear previous query
2. Type: `SELECT * FROM app_settings;`
3. Click **Run**
4. You should see one row with id = 'global_theme'

### ✅ Step 7: Test in Your App
1. Open your Muslim Hunt app
2. Login as admin (zeirislam@gmail.com)
3. Go to Admin Panel → Theme Settings

### ✅ Step 8: Test Apply Theme (localStorage)
1. Click any theme preset (e.g., "Ocean Teal")
2. Click **Apply Theme** button
3. Page reloads with new theme
4. Open in incognito/another browser → Old theme (because localStorage only)

### ✅ Step 9: Test Publish to All Users (database)
1. Click a different theme (e.g., "Rose Garden")
2. Click **Publish to All Users** button
3. Confirm the dialog
4. Page reloads with new theme
5. Open in incognito/another browser → Same theme! (from database)

### ✅ Step 10: Verify Console Logs
1. Press F12 to open browser console
2. Look for these messages:
   - `[Theme] Loaded global theme from database`
   - `[Theme] Published theme to database for all users`
   - `[Theme] Applied theme variables: 55 tokens`

---

## 🎯 Visual Flow

```
┌─────────────────────────────────────────────────┐
│         Supabase Dashboard                      │
│                                                 │
│  1. Select Project                              │
│  2. Click "SQL Editor"                          │
│  3. Click "New Query"                           │
│  4. Paste migration SQL                         │
│  5. Click "Run"                                 │
│  6. Verify with SELECT query                    │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│         Muslim Hunt App                         │
│                                                 │
│  1. Login as admin                              │
│  2. Go to Admin Panel                           │
│  3. Click "Theme Settings"                      │
│  4. Test "Apply Theme" (localStorage)           │
│  5. Test "Publish to All Users" (database)      │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│         Verification                            │
│                                                 │
│  1. Open app in different browser               │
│  2. Theme should match published theme          │
│  3. Check console for success messages          │
│  4. Check database for updated timestamp        │
└─────────────────────────────────────────────────┘
```

---

## 🔍 What to Look For

### In Supabase SQL Editor:

**After running migration:**
```
✅ Success. No rows returned
```

**After SELECT query:**
```
| id           | config                    | tokens | updated_at          |
|--------------|---------------------------|--------|---------------------|
| global_theme | {"primaryColor":"#10..."} | {...}  | 2026-01-14 10:30:00 |
```

### In Browser Console:

**On app load:**
```
[Theme] Loaded global theme from database
[Theme] Applied theme variables: 55 tokens
```

**After clicking "Publish to All Users":**
```
[Theme] Published theme to database for all users
[Theme] Saved config to localStorage
[Theme] Saved tokens to localStorage
[Theme] Applied theme variables: 55 tokens
```

### In Admin Panel:

**Apply Theme button:**
- ✅ Shows alert: "Theme applied successfully! The page will reload."
- ✅ Page reloads
- ✅ Theme changes for you only

**Publish to All Users button:**
- ✅ Shows confirm dialog: "Publish this theme for all users?"
- ✅ After confirm, shows: "Theme published successfully to all users!"
- ✅ Page reloads
- ✅ Theme changes for EVERYONE

---

## ❌ Common Issues & Fixes

### Issue 1: SQL Error - "relation already exists"

**What it means:** Table was already created

**Fix:** That's OK! Skip to Step 6 (verify table)

---

### Issue 2: "permission denied for table app_settings"

**What it means:** RLS policies not set up correctly

**Fix:**
1. Go to Supabase SQL Editor
2. Run these queries:

```sql
-- Fix read policy
DROP POLICY IF EXISTS "Anyone can read app_settings" ON app_settings;
CREATE POLICY "Anyone can read app_settings"
  ON app_settings FOR SELECT TO public USING (true);

-- Fix write policy
DROP POLICY IF EXISTS "Only admins can update app_settings" ON app_settings;
CREATE POLICY "Only admins can update app_settings"
  ON app_settings FOR ALL TO authenticated
  USING (
    auth.jwt() ->> 'email' IN (
      'admin@muslimhunt.com',
      'moderator@muslimhunt.com',
      'zeirislam@gmail.com'
    )
  );
```

---

### Issue 3: "Failed to publish theme to database"

**What it means:** Can't connect to Supabase or not authorized

**Check:**
1. Are you logged in as admin? (email: zeirislam@gmail.com)
2. Is internet connection working?
3. Check browser console for detailed error
4. Verify Supabase URL is correct in `lib/supabase.ts`

---

### Issue 4: Theme not loading from database

**What it means:** Database query failing or table empty

**Fix:**
1. Check console: Should see "[Theme] Loaded global theme from database"
2. If not, run this in SQL Editor:
```sql
SELECT * FROM app_settings WHERE id = 'global_theme';
```
3. If no rows, insert default:
```sql
INSERT INTO app_settings (id, config, tokens)
VALUES (
  'global_theme',
  '{"primaryColor":"#10B981","accentColor":"#F59E0B","backgroundColor":"clean-white","roundness":"rounded"}',
  '{}'
);
```

---

### Issue 5: Theme changes but reverts on reload

**What it means:** Published to localStorage but not database

**Fix:** Make sure you click "Publish to All Users", not "Apply Theme"

---

## 📝 Testing Script

Copy and paste this in SQL Editor to test everything:

```sql
-- Test 1: Check table exists
SELECT * FROM app_settings;

-- Test 2: Check you can read (should work)
SELECT config FROM app_settings WHERE id = 'global_theme';

-- Test 3: Check RLS policies
SELECT tablename, policyname
FROM pg_policies
WHERE tablename = 'app_settings';

-- Test 4: Try to update (should work if you're admin)
UPDATE app_settings
SET updated_at = NOW()
WHERE id = 'global_theme'
RETURNING id, updated_at;
```

Expected results:
- Test 1: Shows one row
- Test 2: Shows config JSON
- Test 3: Shows two policies
- Test 4: Updates timestamp (if admin)

---

## ✨ Success Criteria

You know it's working when:

- ✅ SQL migration runs without errors
- ✅ `app_settings` table visible in Supabase
- ✅ "Apply Theme" button works (localStorage)
- ✅ "Publish to All Users" button works (database)
- ✅ Published theme visible in different browser
- ✅ Console shows database success messages
- ✅ No errors in browser console

---

## 🎉 Done!

Once all steps are complete, your theme system is fully functional!

**What you can do now:**
- Change theme for yourself with "Apply Theme"
- Change theme for everyone with "Publish to All Users"
- Export/import themes as JSON
- Reset to defaults
- Use 8 preset themes
- Build custom themes

**For your users:**
- They'll always see the latest published theme
- Theme is consistent across all devices
- No setup needed on their end

---

## 📚 More Info

- Full docs: `THEME_DATABASE_SETUP.md`
- বাংলা গাইড: `THEME_SETUP_BANGLA.md`
- Changes summary: `THEME_CHANGES_SUMMARY.md`
- Original theme docs: `ADMIN_THEME_README.md`

---

**Need help?** Check browser console (F12) for detailed error messages!

Happy theming! 🎨✨
