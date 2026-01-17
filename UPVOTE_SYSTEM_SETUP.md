# Upvote System & Notifications - Setup Guide

This guide explains how to set up the complete upvote persistence, toggling, and real-time notification system for Muslim Hunt.

## Overview

The upvote system includes:
- ✅ Persistent upvotes stored in Supabase
- ✅ Toggle functionality (upvote/remove upvote)
- ✅ Real-time upvote updates across all users
- ✅ Automatic upvote count synchronization
- ✅ Real-time notifications for product makers
- ✅ Notifications on upvotes and comments

## Database Schema

### Tables Created

1. **votes** - Stores all user upvotes
   - `id` (UUID, primary key)
   - `user_id` (UUID, references auth.users)
   - `product_id` (UUID, references products)
   - `created_at` (timestamp)
   - Unique constraint on (user_id, product_id)

2. **notifications** - Stores user notifications
   - `id` (UUID, primary key)
   - `user_id` (UUID, references auth.users)
   - `type` (text: upvote, comment, reply, mention, follow, streak, approval)
   - `title` (text)
   - `message` (text)
   - `product_id` (UUID, optional)
   - `comment_id` (UUID, optional)
   - `sender_id` (UUID, optional)
   - `sender_name` (text, optional)
   - `sender_avatar` (text, optional)
   - `is_read` (boolean, default false)
   - `created_at` (timestamp)

## Migration Steps

### Step 1: Run the Votes and Notifications Migration

Run this migration first to create the base tables:

```bash
# In Supabase SQL Editor, run:
supabase/migrations/06_votes_and_notifications_system.sql
```

This creates:
- `votes` table with RLS policies
- `notifications` table with RLS policies
- Indexes for performance
- Realtime publication for votes

### Step 2: Run the Triggers Migration

Run this migration to add automatic triggers:

```bash
# In Supabase SQL Editor, run:
supabase/migrations/07_upvote_triggers_and_notifications.sql
```

This creates:
- **update_product_upvotes()** - Automatically updates product upvote counts
- **notify_maker_on_upvote()** - Sends notifications to makers when their product is upvoted
- **notify_maker_on_comment()** - Sends notifications to makers when someone comments
- Triggers to call these functions automatically
- Realtime publication for notifications

### Step 3: Enable Realtime in Supabase Dashboard

**CRITICAL MANUAL STEP:**

1. Go to your Supabase Dashboard
2. Navigate to **Database** > **Replication**
3. Find the **`votes`** table in the list
4. Toggle **Enable Realtime** to ON
5. Find the **`notifications`** table in the list
6. Toggle **Enable Realtime** to ON

Without this step, real-time updates will not work!

### Step 4: Verify Row Level Security

Ensure RLS is enabled for both tables:

```sql
-- Check RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('votes', 'notifications');

-- Should return:
-- votes | true
-- notifications | true
```

## How It Works

### Upvote Flow

1. **User clicks upvote button**
   - Frontend calls `handleUpvote(productId)`
   - If not voted: Insert into `votes` table
   - If already voted: Delete from `votes` table

2. **Database trigger fires**
   - `update_product_upvotes()` automatically updates product upvote count
   - `notify_maker_on_upvote()` creates notification for product maker

3. **Real-time updates**
   - All connected clients receive the upvote via Supabase Realtime
   - Product upvote count updates across all users instantly
   - Product maker receives notification in real-time

### Notification Flow

1. **Notification created** (via trigger)
   - When someone upvotes: "X upvoted your product Y"
   - When someone comments: "X commented on your product Y"

2. **Real-time delivery**
   - Notification appears instantly in maker's notification panel
   - No page refresh needed

3. **Notification management**
   - Users can mark notifications as read
   - Notifications are fetched on login
   - Limited to 50 most recent notifications

## Frontend Implementation

### Key Functions

```typescript
// Fetch user's votes on login
const fetchUserVotes = async (userId: string) => {
  const { data } = await supabase
    .from('votes')
    .select('product_id, user_id')
    .eq('user_id', userId);
  // Populate votes Set
};

// Toggle upvote
const handleUpvote = async (productId: string) => {
  if (hasVoted) {
    // Delete vote
    await supabase.from('votes')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId);
  } else {
    // Insert vote
    await supabase.from('votes')
      .insert({ user_id: user.id, product_id: productId });
  }
};

// Fetch notifications
const fetchUserNotifications = async (userId: string) => {
  const { data } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);
  setNotifications(data);
};
```

### Real-time Subscriptions

```typescript
// Subscribe to vote changes
supabase
  .channel('global_votes')
  .on('postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'votes' },
    (payload) => {
      // Update UI when anyone votes
    })
  .on('postgres_changes',
    { event: 'DELETE', schema: 'public', table: 'votes' },
    (payload) => {
      // Update UI when anyone removes vote
    })
  .subscribe();

// Subscribe to user's notifications
supabase
  .channel('user_notifications')
  .on('postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'notifications',
      filter: `user_id=eq.${user.id}`
    },
    (payload) => {
      // Show new notification
    })
  .subscribe();
```

## Testing

### Test Upvote Persistence

1. Sign in as User A
2. Upvote a product
3. Refresh the page
4. ✅ Upvote should still be highlighted

### Test Upvote Toggle

1. Sign in as User A
2. Upvote a product (count increases)
3. Click upvote again (count decreases)
4. ✅ Upvote button should toggle state

### Test Real-time Updates

1. Open two browser windows
2. Sign in as different users in each
3. Upvote a product in Window 1
4. ✅ Upvote count should update in Window 2 instantly

### Test Maker Notifications

1. Sign in as User A (product maker)
2. Note product ID
3. Sign in as User B in another window
4. Upvote User A's product
5. ✅ User A should receive notification instantly

### Test Comment Notifications

1. Sign in as User A (product maker)
2. Sign in as User B in another window
3. User B comments on User A's product
4. ✅ User A should receive notification instantly

## Troubleshooting

### Upvotes not persisting
- Check if `votes` table exists in Supabase
- Verify RLS policies are enabled
- Check browser console for errors

### Real-time not working
- Ensure Realtime is enabled in Supabase Dashboard
- Check if tables are added to `supabase_realtime` publication
- Verify WebSocket connection in Network tab

### Notifications not appearing
- Verify `notifications` table exists
- Check if triggers are created (see Functions in Supabase)
- Ensure Realtime is enabled for notifications table
- Check notification subscription filter

### Upvote count not updating
- Verify trigger `trigger_update_product_upvotes` exists
- Check if function `update_product_upvotes()` is created
- Look for errors in Supabase logs

## Performance Considerations

### Indexes
The system includes indexes on:
- `votes(user_id)` - Fast lookup of user's votes
- `votes(product_id)` - Fast lookup of product votes
- `votes(user_id, product_id)` - Unique constraint optimization
- `notifications(user_id)` - Fast user notification queries
- `notifications(created_at)` - Efficient ordering

### Optimization Tips
- Votes are cached in frontend Set for instant UI updates
- Database triggers handle count updates automatically
- Limit notifications to 50 most recent
- Use realtime subscriptions instead of polling

## Security

### Row Level Security (RLS)

**Votes Table:**
- Anyone can view votes (to check if they voted)
- Users can only insert their own votes
- Users can only delete their own votes

**Notifications Table:**
- Users can only view their own notifications
- Users can only update their own notifications
- System can insert notifications (for triggers)

## Migration Rollback

If you need to rollback:

```sql
-- Drop triggers
DROP TRIGGER IF EXISTS trigger_update_product_upvotes ON votes;
DROP TRIGGER IF EXISTS trigger_notify_maker_on_upvote ON votes;
DROP TRIGGER IF EXISTS trigger_notify_maker_on_comment ON comments;

-- Drop functions
DROP FUNCTION IF EXISTS update_product_upvotes() CASCADE;
DROP FUNCTION IF EXISTS notify_maker_on_upvote() CASCADE;
DROP FUNCTION IF EXISTS notify_maker_on_comment() CASCADE;

-- Remove from realtime
ALTER PUBLICATION supabase_realtime DROP TABLE votes;
ALTER PUBLICATION supabase_realtime DROP TABLE notifications;

-- Drop tables
DROP TABLE IF EXISTS votes CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
```

## Support

If you encounter issues:
1. Check Supabase logs for errors
2. Verify all migration steps completed successfully
3. Ensure Realtime is enabled in dashboard
4. Check browser console for JavaScript errors
5. Review RLS policies are correctly applied

---

**Status:** ✅ Fully Implemented
**Last Updated:** January 18, 2026
**Version:** 1.0
