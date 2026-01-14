# Theme Database Setup

## Overview

The theme system now supports two modes:

1. **Apply Theme** - Saves theme to localStorage (only affects current admin's browser)
2. **Publish to All Users** - Saves theme to Supabase database (affects everyone publicly)

## Database Setup Instructions

### Step 1: Create the Database Table

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/anzqsjvvguiqcenfdevh
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the contents of `supabase_migration_app_settings.sql`
5. Click **Run** to execute the SQL

This will create:
- `app_settings` table with columns: `id`, `config`, `tokens`, `updated_at`, `created_at`
- Row Level Security policies (anyone can read, only admins can write)
- Default theme entry with id `global_theme`

### Step 2: Verify the Table

Run this query in SQL Editor to verify:

```sql
SELECT * FROM app_settings WHERE id = 'global_theme';
```

You should see one row with the default theme configuration.

### Step 3: Test the Theme System

1. **Test Apply Theme (localStorage only)**:
   - Go to Admin Panel → Theme Settings
   - Select a theme (e.g., "Ocean Teal")
   - Click **Apply Theme**
   - Page reloads with new theme
   - Open in another browser/device → Still shows old theme (because it's localStorage)

2. **Test Publish to All Users (database)**:
   - Go to Admin Panel → Theme Settings
   - Select a theme (e.g., "Rose Garden")
   - Click **Publish to All Users**
   - Confirm the dialog
   - Page reloads with new theme
   - Open in another browser/device → Shows the same theme! (from database)
   - Have a friend visit the site → They see the new theme too!

## How It Works

### Apply Theme Flow:
```
Click "Apply Theme"
  ↓
Save to localStorage (browser only)
  ↓
Reload page
  ↓
Load from localStorage
  ↓
Apply CSS variables
```

### Publish to All Users Flow:
```
Click "Publish to All Users"
  ↓
Save to Supabase database (app_settings table)
  ↓
Also save to localStorage (cache)
  ↓
Reload page
  ↓
Load from database (for all users)
  ↓
Apply CSS variables globally
```

### App Startup Flow:
```
App starts (index.tsx)
  ↓
initializeThemeFromDatabase()
  ↓
Try to load from database first
  ↓
If found: Apply database theme (public theme)
If not found: Fallback to localStorage or defaults
  ↓
Render app with theme
```

## Troubleshooting

### Theme not publishing to database

**Error**: `Failed to publish theme to database`

**Check**:
1. Is the `app_settings` table created? Run:
   ```sql
   SELECT * FROM app_settings;
   ```

2. Are you logged in as admin? Check:
   - Your email is in the admin list: `zeirislam@gmail.com`
   - DevAuthButtons shows "Admin Access" badge

3. Check browser console for errors (F12 → Console tab)

### Theme not loading on page load

**Error**: Theme reverts to default on reload

**Check**:
1. Check console logs: Should see `[Theme] Loaded global theme from database`
2. Check database:
   ```sql
   SELECT config, updated_at FROM app_settings WHERE id = 'global_theme';
   ```
3. Clear browser cache and reload

### Database permissions error

**Error**: `permission denied for table app_settings`

**Fix**: Re-run the RLS policies from the SQL file:
```sql
-- Run these policies again
CREATE POLICY "Anyone can read app_settings" ...
CREATE POLICY "Only admins can update app_settings" ...
```

## Database Schema

```sql
CREATE TABLE app_settings (
  id TEXT PRIMARY KEY,              -- 'global_theme'
  config JSONB NOT NULL,            -- Theme configuration object
  tokens JSONB NOT NULL,            -- Generated CSS tokens (70+ variables)
  updated_at TIMESTAMP,             -- Last update time
  created_at TIMESTAMP              -- Creation time
);
```

### Example Row:

| id | config | tokens | updated_at |
|----|--------|--------|------------|
| global_theme | `{"primaryColor":"#EC4899","accentColor":"#8B5CF6",...}` | `{"--color-primary":"#EC4899","--color-primary-hover":"#DB2777",...}` | 2026-01-14 10:30:00 |

## Admin Emails

Only these emails can publish themes:
- admin@muslimhunt.com
- moderator@muslimhunt.com
- zeirislam@gmail.com

To add more admins, update the RLS policy in Supabase:
```sql
ALTER POLICY "Only admins can update app_settings" ON app_settings
USING (
  auth.jwt() ->> 'email' IN (
    'admin@muslimhunt.com',
    'moderator@muslimhunt.com',
    'zeirislam@gmail.com',
    'newadmin@example.com'  -- Add new admin emails here
  )
);
```

## Testing Checklist

- [ ] Database table created successfully
- [ ] Default theme row exists (`id = 'global_theme'`)
- [ ] RLS policies are active
- [ ] Admin can publish theme (Publish to All Users works)
- [ ] Regular user can read theme (app loads with published theme)
- [ ] Apply Theme saves to localStorage only
- [ ] Publish saves to database and affects all users
- [ ] Theme persists across browser sessions
- [ ] Theme persists across different devices
- [ ] Non-admin cannot publish theme

## Production Deployment

When deploying to Vercel:

1. ✅ SQL migration is already run in Supabase (database is cloud-hosted)
2. ✅ No environment variables needed (Supabase URL is hardcoded)
3. ✅ RLS policies are in effect
4. ✅ Theme loads from database on every page load

Just deploy normally with `vercel --prod` and the theme system will work!

## Summary

- **Apply Theme**: Admin preview only (localStorage)
- **Publish to All Users**: Everyone sees it (Supabase database)
- **Database table**: `app_settings` with one row `id='global_theme'`
- **Security**: RLS policies ensure only admins can publish

Happy theming! 🎨✨
