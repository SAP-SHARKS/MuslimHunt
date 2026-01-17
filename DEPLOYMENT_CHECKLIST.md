# Deployment Checklist - Muslim Hunt Upvote System

## Pre-Deployment Steps

### 1. Database Migrations ⬜

- [ ] Open Supabase SQL Editor
- [ ] Run `06_votes_and_notifications_system.sql`
- [ ] Verify tables created: `votes`, `notifications`
- [ ] Check for migration errors in Supabase logs

### 2. Database Triggers ⬜

- [ ] Run `07_upvote_triggers_and_notifications.sql`
- [ ] Verify functions created in Supabase Dashboard → Database → Functions:
  - [ ] `update_product_upvotes()`
  - [ ] `notify_maker_on_upvote()`
  - [ ] `notify_maker_on_comment()`
- [ ] Verify triggers created in Supabase Dashboard → Database → Triggers

### 3. Enable Realtime ⬜

**CRITICAL STEP - Don't skip this!**

- [ ] Go to Supabase Dashboard
- [ ] Navigate to Database → Replication
- [ ] Find `votes` table
- [ ] Toggle "Enable Realtime" to **ON**
- [ ] Find `notifications` table  
- [ ] Toggle "Enable Realtime" to **ON**
- [ ] Verify both tables show "Enabled" in the Realtime column

### 4. Verify RLS Policies ⬜

- [ ] Go to Supabase Dashboard → Authentication → Policies
- [ ] Verify `votes` table has 3 policies:
  - [ ] "Anyone can view votes"
  - [ ] "Users can insert their own votes"
  - [ ] "Users can delete their own votes"
- [ ] Verify `notifications` table has 3 policies:
  - [ ] "Users can view their own notifications"
  - [ ] "Users can update their own notifications"
  - [ ] "System can insert notifications"

## Testing Steps

### 5. Test Upvote Persistence ⬜

- [ ] Sign in as a test user
- [ ] Upvote a product
- [ ] Refresh the browser
- [ ] **Expected:** Upvote button still highlighted
- [ ] **Expected:** Upvote count unchanged

### 6. Test Upvote Toggle ⬜

- [ ] Sign in as a test user
- [ ] Click upvote on a product (count: X → X+1)
- [ ] Click upvote again (count: X+1 → X)
- [ ] **Expected:** Upvote count increases/decreases correctly
- [ ] **Expected:** Button state toggles properly

### 7. Test Real-time Upvotes ⬜

- [ ] Open two browser windows
- [ ] Sign in as different users in each
- [ ] Upvote a product in Window 1
- [ ] **Expected:** Upvote count updates in Window 2 **without refresh**
- [ ] Remove upvote in Window 1
- [ ] **Expected:** Count decreases in Window 2 **without refresh**

### 8. Test Maker Notifications (Upvotes) ⬜

- [ ] Create a product as User A
- [ ] Note the product ID
- [ ] Sign in as User B in another window
- [ ] Upvote User A's product as User B
- [ ] Check User A's notifications
- [ ] **Expected:** Notification appears: "User B upvoted your product X"
- [ ] **Expected:** Notification appears **instantly** (real-time)

### 9. Test Maker Notifications (Comments) ⬜

- [ ] Create a product as User A
- [ ] Sign in as User B in another window
- [ ] Comment on User A's product as User B
- [ ] Check User A's notifications
- [ ] **Expected:** Notification appears: "User B commented on your product X"
- [ ] **Expected:** Notification appears **instantly** (real-time)

### 10. Test Legal Pages ⬜

- [ ] Navigate to `/legal#terms`
- [ ] **Expected:** Terms of Service tab is active
- [ ] **Expected:** Content displays correctly
- [ ] Navigate to `/legal#privacy`
- [ ] **Expected:** Privacy Policy tab is active
- [ ] **Expected:** Content displays correctly
- [ ] Click between tabs
- [ ] **Expected:** URL updates correctly
- [ ] **Expected:** Content switches smoothly

### 11. Test Footer Links ⬜

- [ ] Scroll to footer
- [ ] Click "Terms" link
- [ ] **Expected:** Navigates to `/legal#terms`
- [ ] Click "Privacy" link
- [ ] **Expected:** Navigates to `/legal#privacy`
- [ ] Click "About" link
- [ ] **Expected:** Navigates to `/about`

## Performance Testing

### 12. Test Database Performance ⬜

- [ ] Check Supabase Dashboard → Database → Query Performance
- [ ] Verify indexes are being used:
  - [ ] `idx_votes_user_id`
  - [ ] `idx_votes_product_id`
  - [ ] `idx_votes_user_product`
  - [ ] `idx_notifications_user_id`
  - [ ] `idx_notifications_created_at`

### 13. Test Realtime Performance ⬜

- [ ] Open browser DevTools → Network tab
- [ ] Sign in
- [ ] Filter for WebSocket connections
- [ ] **Expected:** See active WebSocket connection to Supabase
- [ ] Upvote a product
- [ ] **Expected:** See realtime message in WebSocket traffic
- [ ] **Expected:** No polling requests (should use WebSocket, not HTTP polling)

## Production Deployment

### 14. Code Deployment ⬜

- [ ] Commit all changes to git
- [ ] Push to main branch
- [ ] **Files to verify in commit:**
  - [ ] `App.tsx` (upvote persistence)
  - [ ] `components/Legal.tsx` (legal pages)
  - [ ] `types.ts` (LEGAL view)
  - [ ] `supabase/migrations/06_*.sql`
  - [ ] `supabase/migrations/07_*.sql`
  - [ ] `UPVOTE_SYSTEM_SETUP.md`

### 15. Environment Verification ⬜

- [ ] Verify Supabase project URL is correct
- [ ] Verify Supabase anon key is configured
- [ ] Check that RLS is enabled in production
- [ ] Verify Realtime is enabled in production Supabase

### 16. Monitoring Setup ⬜

- [ ] Set up Supabase log monitoring
- [ ] Monitor for trigger errors
- [ ] Monitor for RLS policy violations
- [ ] Set up alerts for failed upvotes
- [ ] Monitor WebSocket connection stability

## Post-Deployment Verification

### 17. Production Smoke Tests ⬜

Run these tests on production:

- [ ] Sign in works correctly
- [ ] Upvote persists after page refresh
- [ ] Upvote toggle works
- [ ] Real-time updates work across tabs
- [ ] Notifications appear for product makers
- [ ] Legal pages load correctly
- [ ] No console errors in browser
- [ ] No errors in Supabase logs

### 18. User Acceptance Testing ⬜

- [ ] Ask 3-5 beta users to test upvoting
- [ ] Verify they receive notifications
- [ ] Collect feedback on performance
- [ ] Check for any reported issues

## Rollback Plan

### If Issues Occur ⬜

**Minor issues (notifications not working):**
- [ ] Check Supabase logs for trigger errors
- [ ] Verify Realtime is enabled
- [ ] Restart realtime subscriptions

**Major issues (upvotes not working):**
- [ ] Roll back to previous version
- [ ] Run rollback SQL (see UPVOTE_SYSTEM_SETUP.md)
- [ ] Investigate issue in staging environment

## Documentation

### 19. Update Documentation ⬜

- [ ] Update README.md with new features
- [ ] Document any configuration changes
- [ ] Update API documentation if needed
- [ ] Create user guide for notifications

### 20. Team Communication ⬜

- [ ] Notify team of deployment
- [ ] Share testing results
- [ ] Document any issues found
- [ ] Schedule follow-up meeting

---

## Quick Reference

**Migration Files:**
- `supabase/migrations/06_votes_and_notifications_system.sql`
- `supabase/migrations/07_upvote_triggers_and_notifications.sql`

**Documentation:**
- `UPVOTE_SYSTEM_SETUP.md` - Complete setup guide
- `IMPLEMENTATION_SUMMARY.md` - Implementation details

**Key Features:**
- ✅ Persistent upvotes
- ✅ Toggle upvote/remove
- ✅ Real-time updates
- ✅ Maker notifications
- ✅ Legal pages (Terms & Privacy)

**Critical Manual Step:**
⚠️ Enable Realtime for `votes` and `notifications` tables in Supabase Dashboard!

---

**Completed by:** _________________
**Date:** _________________
**Deployment Status:** ⬜ Success / ⬜ Issues Found
