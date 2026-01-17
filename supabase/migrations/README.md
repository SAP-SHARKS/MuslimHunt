# Supabase Migration Instructions

## How to Run the Launch Guide Links Migration

### Step 1: Access Supabase SQL Editor
1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to the SQL Editor (left sidebar)

### Step 2: Run the Migration
1. Open the file `launch_guide_links.sql` in this folder
2. Copy the entire SQL content
3. Paste it into the Supabase SQL Editor
4. Click "Run" to execute the migration

### Step 3: Verify the Data
After running the migration, verify that the table was created and data was inserted:

```sql
SELECT * FROM launch_guide_links ORDER BY display_order;
```

You should see 4 links:
- 🔍 Hunters: Do you need one?
- 📦 Setting pack
- 📅 Content checklist
- 🎬 Maker stories & studios

## How to Update Links in the Future

### Option 1: Using Supabase Dashboard
1. Go to Table Editor in Supabase
2. Find the `launch_guide_links` table
3. Edit any row directly by clicking on it
4. Changes will appear immediately on your website

### Option 2: Using SQL
```sql
-- Update a specific link
UPDATE launch_guide_links
SET label = 'New Label', url = 'https://new-url.com'
WHERE label = 'Hunters: Do you need one?';

-- Add a new link
INSERT INTO launch_guide_links (icon, label, url, display_order)
VALUES ('🎯', 'New Link', 'https://example.com', 5);

-- Delete a link (set inactive)
UPDATE launch_guide_links
SET is_active = false
WHERE label = 'Some Link';
```

## Table Structure

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Unique identifier |
| icon | TEXT | Emoji icon for the link |
| label | TEXT | Link text/label |
| url | TEXT | Link destination URL |
| display_order | INTEGER | Order of appearance (lower = higher) |
| is_active | BOOLEAN | Whether to show the link |
| created_at | TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | Last update time |

## Notes
- The LaunchGuide component automatically fetches links from this table
- If the fetch fails, it falls back to default hardcoded links
- Links are cached in the component state until page refresh
- External links (starting with http) open in new tab automatically
