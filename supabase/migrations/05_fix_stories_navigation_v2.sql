-- Fix Stories Navigation Menu Item (Simplified Version)
-- Updates the Stories menu item to point to the correct view

-- First, check if navigation_menu table has the required structure
DO $$
BEGIN
  -- Update the Stories menu item if it exists
  IF EXISTS (
    SELECT 1 FROM navigation_menu WHERE label = 'Stories'
  ) THEN
    UPDATE navigation_menu
    SET view_name = 'stories'
    WHERE label = 'Stories';

    RAISE NOTICE 'Updated Stories navigation item to use stories view';
  ELSE
    RAISE NOTICE 'Stories navigation item does not exist in database';
  END IF;
END $$;

-- Show the current state of Stories menu item
SELECT
  id,
  label,
  subtext,
  view_name,
  icon,
  is_active
FROM navigation_menu
WHERE label = 'Stories';
