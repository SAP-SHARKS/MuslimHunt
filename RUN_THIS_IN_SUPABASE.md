# ⚡ Quick Setup Guide - Run in Supabase

Follow these exact steps in order:

## Step 1: Run First Migration

Copy and paste this ENTIRE file into Supabase SQL Editor and click **Run**:

**File:** `supabase/migrations/06_votes_and_notifications_system.sql`

This creates:
- ✅ `votes` table
- ✅ `notifications` table
- ✅ RLS policies
- ✅ Indexes

## Step 2: Run Second Migration

Copy and paste this ENTIRE file into Supabase SQL Editor and click **Run**:

**File:** `supabase/migrations/07_upvote_triggers_and_notifications_SAFE.sql`

This creates:
- ✅ Upvote count update trigger
- ✅ Notification triggers
- ✅ Realtime setup

## Step 3: Enable Realtime (CRITICAL!)

1. Go to Supabase Dashboard
2. Click **Database** in sidebar
3. Click **Replication** tab
4. Find **`votes`** table in the list
5. Toggle **"Enable Realtime"** to **ON** ✅
6. Find **`notifications`** table in the list
7. Toggle **"Enable Realtime"** to **ON** ✅

⚠️ **Without this step, real-time updates WILL NOT WORK!**

## Step 4: Verify Everything Works

Run this query in SQL Editor to verify:

```sql
-- Check tables exist
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('votes', 'notifications', 'products');

-- Check functions exist
SELECT routine_name FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN ('update_product_upvotes', 'notify_maker_on_upvote');

-- Check triggers exist
SELECT trigger_name, event_object_table 
FROM information_schema.triggers 
WHERE trigger_schema = 'public';
```

Expected results:
- ✅ 3 tables: votes, notifications, products
- ✅ 2 functions: update_product_upvotes, notify_maker_on_upvote
- ✅ 2+ triggers including trigger_update_product_upvotes

## Step 5: Test in Your App

1. Sign in to your app
2. Upvote a product
3. Refresh the page
4. ✅ Upvote should still be highlighted

---

## Troubleshooting

### Error: "column product_id does not exist"

This means your `products` table doesn't have the right structure. Run this to check:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products';
```

You should see columns: `id`, `name`, `user_id`, `upvotes_count`

### Error: "table products does not exist"

You need to create the products table first. The upvote system needs:
- A `products` table with columns: `id`, `user_id`, `upvotes_count`
- An `auth.users` table (created by Supabase Auth)

### Realtime Not Working

1. Verify Realtime is enabled in Dashboard → Database → Replication
2. Check browser console for WebSocket errors
3. Verify you're signed in (realtime requires authentication)

---

## Quick Reference

**Migration Order:**
1. `06_votes_and_notifications_system.sql` (tables)
2. `07_upvote_triggers_and_notifications_SAFE.sql` (triggers)
3. Enable Realtime in Dashboard ⚠️

**Critical Manual Step:**
Enable Realtime for `votes` and `notifications` tables!

---

**Need Help?** Check `UPVOTE_SYSTEM_SETUP.md` for detailed documentation.
