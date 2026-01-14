-- Remove Forums dropdown sub-items to make it a simple link like Advertise
-- This will make Forums show as a simple underlined link instead of a dropdown menu

-- First, delete all sub-items for the Forums menu
DELETE FROM nav_sub_items
WHERE menu_item_id = (
  SELECT id FROM nav_menu_items WHERE label = 'Forums'
);

-- Optionally, update the Forums menu item to have a view
UPDATE nav_menu_items
SET view = 'FORUM_HOME'
WHERE label = 'Forums';

-- Verify the changes
SELECT * FROM nav_menu_items WHERE label = 'Forums';
