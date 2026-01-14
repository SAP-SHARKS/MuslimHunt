# Theme System Setup - বাংলায়

## কি করা হয়েছে

এখন থিম সিস্টেম দুইভাবে কাজ করবে:

### 1. Apply Theme (শুধু আপনার ব্রাউজারে)
- শুধু আপনার (admin) ব্রাউজারে থিম চেঞ্জ হবে
- localStorage এ সেভ হয়
- অন্য ডিভাইস/ব্রাউজার থেকে দেখলে পুরনো থিম দেখাবে

### 2. Publish to All Users (সবার জন্য)
- **পুরো ওয়েবসাইটের থিম চেঞ্জ হবে সবার জন্য**
- Supabase database এ সেভ হয়
- যে কেউ যেকোনো ডিভাইস থেকে দেখলে নতুন থিম দেখবে
- Public থিম হয়ে যাবে

## Database Setup (প্রথমবার করতে হবে)

### Step 1: Supabase এ Table তৈরি করুন

1. Supabase Dashboard এ যান: https://supabase.com/dashboard
2. আপনার project select করুন
3. বাম পাশে **SQL Editor** তে ক্লিক করুন
4. **New Query** button এ ক্লিক করুন
5. `supabase_migration_app_settings.sql` ফাইলটি খুলুন
6. সম্পূর্ণ SQL কোড কপি করে SQL Editor এ পেস্ট করুন
7. **Run** button এ ক্লিক করুন

### Step 2: Verify করুন

SQL Editor এ এই query run করুন:

```sql
SELECT * FROM app_settings WHERE id = 'global_theme';
```

যদি একটা row দেখায় মানে সফলভাবে table create হয়েছে!

## কিভাবে ব্যবহার করবেন

### শুধু নিজের জন্য থিম টেস্ট করতে:
1. Admin Panel → Theme Settings এ যান
2. একটা থিম সিলেক্ট করুন (যেমন "Ocean Teal")
3. **Apply Theme** button এ ক্লিক করুন
4. পেজ reload হবে এবং নতুন থিম দেখাবে
5. কিন্তু অন্য ডিভাইস থেকে দেখলে পুরনো থিম দেখাবে

### সবার জন্য থিম পাবলিশ করতে:
1. Admin Panel → Theme Settings এ যান
2. একটা থিম সিলেক্ট করুন (যেমন "Rose Garden")
3. **Publish to All Users** button এ ক্লিক করুন
4. Confirm dialog এ **OK** করুন
5. পেজ reload হবে
6. এখন যে কেউ যেকোনো ডিভাইস থেকে দেখলে এই থিম দেখবে!

## কিভাবে কাজ করে

### Apply Theme:
```
"Apply Theme" ক্লিক করলে
  ↓
localStorage এ save হয় (শুধু আপনার ব্রাউজারে)
  ↓
Page reload হয়
  ↓
localStorage থেকে load করে
  ↓
শুধু আপনার কাছে নতুন theme দেখায়
```

### Publish to All Users:
```
"Publish to All Users" ক্লিক করলে
  ↓
Supabase database এ save হয় (সবার জন্য)
  ↓
Page reload হয়
  ↓
Database থেকে load করে
  ↓
সবাই নতুন theme দেখে (পুরো website!)
```

### যখন কেউ website visit করে:
```
Website load হয়
  ↓
প্রথমে database check করে
  ↓
Database এ theme পেলে: সেটা apply করে (public theme)
না পেলে: default theme দেখায়
  ↓
Website render হয়
```

## Important Files

### 1. `supabase_migration_app_settings.sql`
- Database table তৈরি করার SQL code
- একবার Supabase এ run করতে হবে

### 2. `theme/apply.ts`
- `publishThemeToAllUsers()` - Database এ theme save করে
- `loadGlobalTheme()` - Database থেকে theme load করে
- `initializeThemeFromDatabase()` - App start এ call হয়

### 3. `components/admin/ThemeAdminPanelV2.tsx`
- Apply Theme button - localStorage only
- Publish to All Users button - Database save

### 4. `index.tsx`
- App start হওয়ার সময় `initializeThemeFromDatabase()` call করে

## Troubleshooting

### যদি "Failed to publish theme to database" error আসে:

**Check করুন:**
1. Supabase SQL migration run করেছেন কিনা
2. আপনি admin হিসেবে login করেছেন কিনা (zeirislam@gmail.com)
3. Browser console এ error আছে কিনা (F12 চেপে Console tab দেখুন)

### যদি theme publish করার পর অন্য ডিভাইসে দেখা না যায়:

**Check করুন:**
1. Console log দেখুন: `[Theme] Loaded global theme from database` দেখাচ্ছে কিনা
2. SQL Editor এ check করুন:
   ```sql
   SELECT config FROM app_settings WHERE id = 'global_theme';
   ```
3. Browser cache clear করে reload দিন

## Admin Permissions

শুধু এই email গুলো theme publish করতে পারবে:
- admin@muslimhunt.com
- moderator@muslimhunt.com
- zeirislam@gmail.com

নতুন admin add করতে চাইলে Supabase SQL Editor এ এই query run করুন:

```sql
ALTER POLICY "Only admins can update app_settings" ON app_settings
USING (
  auth.jwt() ->> 'email' IN (
    'admin@muslimhunt.com',
    'moderator@muslimhunt.com',
    'zeirislam@gmail.com',
    'newadmin@example.com'  -- নতুন admin email এখানে add করুন
  )
);
```

## Testing Checklist

Setup সঠিকভাবে হয়েছে কিনা check করুন:

- [ ] Supabase SQL migration run হয়েছে
- [ ] `app_settings` table এ `global_theme` row আছে
- [ ] Admin Panel থেকে Apply Theme কাজ করছে
- [ ] Admin Panel থেকে Publish to All Users কাজ করছে
- [ ] অন্য browser/device থেকে published theme দেখা যাচ্ছে
- [ ] Console এ কোনো error নেই

## Summary

✅ **Apply Theme**: শুধু আপনার preview (localStorage)

✅ **Publish to All Users**: সবাই দেখবে (Supabase database)

✅ **Security**: শুধু admin রা publish করতে পারবে

✅ **Production Ready**: Database cloud-hosted, deploy করলেই কাজ করবে

---

এখন শুধু Supabase এ SQL migration run করুন, তারপর theme publish করতে পারবেন! 🎨✨
