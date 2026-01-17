-- Launch Archive Navigation Update
-- Run this in Supabase SQL Editor to update the Launches dropdown with Launch Archive view

-- First, check current Launches menu item structure
-- SELECT * FROM navigation_menu WHERE label = 'Launches';

-- Update the sub_items for the Launches menu item to include Launch Archive
UPDATE navigation_menu
SET sub_items = '[
  {
    "label": "Launch archive",
    "subtext": "Most-loved launches by the community",
    "icon": "Rocket",
    "bgClass": "bg-red-50",
    "colorClass": "text-red-500",
    "view": "launch_archive"
  },
  {
    "label": "Launch Guide",
    "subtext": "Checklists and pro tips for launching",
    "icon": "Star",
    "bgClass": "bg-emerald-50",
    "colorClass": "text-emerald-500",
    "view": "LAUNCH_GUIDE"
  }
]'::jsonb
WHERE label = 'Launches';

-- Verify the update
-- SELECT label, sub_items FROM navigation_menu WHERE label = 'Launches';
