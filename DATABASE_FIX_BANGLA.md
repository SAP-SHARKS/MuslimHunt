# 🚨 Database Error Fix - বাংলায়

## Error টা কি?

Console এ দেখছেন:
```
[Theme] Failed to load global theme:
Could not find the table 'public.app_settings'
```

**মানে**: Supabase database এ `app_settings` table নেই।

---

## ✅ সমাধান (৫ মিনিট)

### ১. Supabase Dashboard খুলুন
যান: https://supabase.com/dashboard/project/anzqsjvvguiqcenfdevh

### ২. SQL Editor তে যান
- বাম পাশের sidebar এ
- **SQL Editor** তে ক্লিক করুন

### ৩. New Query করুন
- **New Query** button ক্লিক করুন (উপরে ডান পাশে)

### ৪. এই SQL টা কপি করুন
`supabase_migration_app_settings.sql` ফাইলটি খুলে সব কপি করুন, বা এই SQL টা কপি করুন:

```sql
CREATE TABLE IF NOT EXISTS app_settings (
  id TEXT PRIMARY KEY,
  config JSONB NOT NULL,
  tokens JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read app_settings"
  ON app_settings FOR SELECT TO public USING (true);

CREATE POLICY "Only admins can update app_settings"
  ON app_settings FOR ALL TO authenticated
  USING (
    auth.jwt() ->> 'email' IN (
      'admin@muslimhunt.com',
      'moderator@muslimhunt.com',
      'zeirislam@gmail.com'
    )
  );

INSERT INTO app_settings (id, config, tokens)
VALUES (
  'global_theme',
  '{"primaryColor":"#10B981","accentColor":"#F59E0B","backgroundColor":"clean-white","roundness":"rounded"}',
  '{}'
)
ON CONFLICT (id) DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_app_settings_id ON app_settings(id);
```

### ৫. Paste করে Run করুন
1. SQL Editor এ পেস্ট করুন
2. **Run** button ক্লিক করুন
3. "Success" message আসার জন্য অপেক্ষা করুন

### ৬. Check করুন
এই query run করুন:
```sql
SELECT * FROM app_settings;
```
১টা row দেখাবে মানে সফল! ✅

### ৭. App Reload করুন
- Muslim Hunt app এ ফিরে যান
- **Ctrl+Shift+R** চাপুন (hard reload)
- Error চলে যাবে!

---

## এখন কি কাজ করবে?

### SQL Migration এর আগে (এখন):
- ❌ "Publish to All Users" → Error দেখাবে
- ✅ "Apply Theme" → কাজ করবে (localStorage)
- ✅ App খুলবে normally

### SQL Migration এর পরে:
- ✅ "Publish to All Users" → কাজ করবে! Database এ save হবে
- ✅ "Apply Theme" → কাজ করবে (localStorage)
- ✅ সবাই same theme দেখবে

---

## Error আসলে?

### "permission denied"
**Fix**: SQL এর RLS policy অংশটা আবার run করুন

### "relation already exists"
**মানে**: Table already তৈরি হয়ে গেছে! এটা ভাল!

---

## Database না চাইলে?

এখন database feature না চাইলে:

1. শুধু "Apply Theme" use করুন (localStorage - কাজ করে)
2. "Publish to All Users" error দেখাবে কিন্তু app break হবে না
3. যখন চাইবেন SQL migration run করবেন

App normally চলবে localStorage দিয়ে!

---

## Summary

**সমস্যা**: Database table নেই

**সমাধান**: Supabase এ SQL run করুন

**সময়**: ৫ মিনিট

**কোথায়**: Supabase Dashboard → SQL Editor

**পরে**: দুইটাই কাজ করবে ("Apply Theme" + "Publish to All Users")

---

আরও help দরকার? দেখুন:
- `SETUP_STEPS.md` - Step by step English
- `THEME_SETUP_BANGLA.md` - বিস্তারিত বাংলা গাইড
- `URGENT_FIX_DATABASE.md` - English quick fix

Error টা app break করবে না - শুধু database publishing চালু করতে SQL migration দরকার! 🎨✨
