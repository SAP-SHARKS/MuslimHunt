# Supabase Migration Instructions

## Migrations to Run

You need to run TWO migrations for the launch guide feature:

1. **launch_guide_links.sql** - For the sidebar links
2. **launch_content.sql** - For the dynamic page content

## How to Run the Migrations

### Step 1: Access Supabase SQL Editor
1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to the SQL Editor (left sidebar)

### Step 2: Run Migration #1 - Launch Guide Links
1. Open the file `launch_guide_links.sql` in this folder
2. Copy the entire SQL content
3. Paste it into the Supabase SQL Editor
4. Click "Run" to execute the migration

### Step 3: Verify Links Data
After running the migration, verify that the table was created and data was inserted:

```sql
SELECT * FROM launch_guide_links ORDER BY display_order;
```

You should see 4 links:
- 🔍 Hunters: Do you need one? (points to: https://muslim-hunt.vercel.app/launch/before-launch#hunters-do-you-need-one)
- 📦 Setting pack (points to: https://muslim-hunt.vercel.app/launch/before-launch#setting-goals)
- 📅 Content checklist (points to: https://muslim-hunt.vercel.app/launch/preparing-for-launch#content-checklist)
- 🎬 Marketing strategies (points to: https://muslim-hunt.vercel.app/launch/sharing-your-launch#marketing-strategies)

### Step 4: Run Migration #2 - Launch Content
1. Open the file `launch_content.sql` in this folder
2. Copy the entire SQL content
3. Paste it into the Supabase SQL Editor
4. Click "Run" to execute the migration

### Step 5: Verify Content Data
After running the migration, verify the content:

```sql
SELECT page_id, title FROM launch_content WHERE is_active = true;
```

You should see 6 content sections:
- hunters-do-you-need-one | Hunters: Do you need one?
- setting-goals | Setting goals
- content-checklist | Content checklist
- launch-day-duties | Launch Day duties
- marketing-strategies | Marketing strategies
- days-after-launch | Days after your launch

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

## How to Update Page Content

### Using Supabase Dashboard
1. Go to Table Editor in Supabase
2. Find the `launch_content` table
3. Click on the row you want to edit
4. Update the `content` field with your new text
5. Changes will appear immediately on the website

### Using SQL
```sql
-- Update the Setting Goals content
UPDATE launch_content
SET content = 'Your new content here...'
WHERE page_id = 'setting-goals';

-- Add a new section
INSERT INTO launch_content (page_id, title, content, metadata)
VALUES (
  'hunters-guide',
  'Hunters: Do you need one?',
  'Your content here...',
  '{"brand": "Muslim Hunt", "vibe": "Muslim vibes", "section": "before-launch"}'::jsonb
);
```

## Database Tables

### launch_guide_links Table
Stores the sidebar links in the Launch Guide.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Unique identifier |
| icon | TEXT | Emoji icon for the link |
| label | TEXT | Link text/label |
| url | TEXT | Link destination URL |
| display_order | INTEGER | Order of appearance (lower = higher) |
| is_active | BOOLEAN | Whether to show the link |

### launch_content Table
Stores the page content for different launch guide sections.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Unique identifier |
| page_id | TEXT | Unique page identifier (e.g., 'setting-goals') |
| title | TEXT | Page title |
| content | TEXT | Page content (supports markdown-like formatting) |
| metadata | JSONB | Additional data (brand, vibe, section) |
| is_active | BOOLEAN | Whether to show the content |

## Notes
- The LaunchGuide component automatically fetches links from the `launch_guide_links` table
- The BeforeLaunch component automatically fetches content from the `launch_content` table
- If the fetch fails, components fall back to default hardcoded content
- Content is cached in component state until page refresh
- External links (starting with http) open in new tab automatically
- The brand "Muslim Hunt" and vibe "Muslim vibes" can be customized via Supabase
