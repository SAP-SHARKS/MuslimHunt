-- Fix Stories Navigation Menu Item
-- Updates the Stories menu item to point to the correct view

-- Update the Stories menu item to use STORIES view instead of NEWSLETTER
UPDATE navigation_menu
SET view_name = 'stories'
WHERE label = 'Stories'
  AND parent_id IN (
    SELECT id FROM navigation_menu WHERE label = 'News'
  );

-- If the Stories item doesn't exist, insert it
INSERT INTO navigation_menu (label, subtext, icon, bgClass, colorClass, view_name, parent_id, display_order, is_active)
SELECT
  'Stories',
  'Tech news, interviews, and tips from makers',
  'BookOpen',
  'bg-pink-50',
  'text-pink-600',
  'stories',
  (SELECT id FROM navigation_menu WHERE label = 'News' LIMIT 1),
  2,
  true
WHERE NOT EXISTS (
  SELECT 1 FROM navigation_menu
  WHERE label = 'Stories'
    AND parent_id IN (SELECT id FROM navigation_menu WHERE label = 'News')
);

-- Verify the update
SELECT
  nm.label,
  nm.subtext,
  nm.view_name,
  parent.label as parent_menu
FROM navigation_menu nm
LEFT JOIN navigation_menu parent ON nm.parent_id = parent.id
WHERE nm.label = 'Stories';
