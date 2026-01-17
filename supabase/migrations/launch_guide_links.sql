-- Launch Guide Links Table
-- This table stores the dynamic links shown in the Launch Guide sidebar

-- Create launch_guide_links table
CREATE TABLE IF NOT EXISTS launch_guide_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  icon TEXT NOT NULL,
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE launch_guide_links ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Anyone can view active launch guide links"
  ON launch_guide_links
  FOR SELECT
  USING (is_active = true);

-- Insert initial links data
INSERT INTO launch_guide_links (icon, label, url, display_order) VALUES
('🔍', 'Hunters: Do you need one?', 'https://muslim-hunt.vercel.app/launch/before-launch#hunters-do-you-need-one', 1),
('📦', 'Setting pack', 'https://muslim-hunt.vercel.app/launch/before-launch#setting-goals', 2),
('📅', 'Content checklist', 'https://muslim-hunt.vercel.app/launch/preparing-for-launch#content-checklist', 3),
('🎬', 'Maker stories & studios', '#', 4);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_launch_guide_links_updated_at
  BEFORE UPDATE ON launch_guide_links
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create index for ordering
CREATE INDEX idx_launch_guide_links_order ON launch_guide_links(display_order);

-- Verify the data
-- SELECT * FROM launch_guide_links ORDER BY display_order;
