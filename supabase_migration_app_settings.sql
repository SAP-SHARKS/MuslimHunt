-- Create the app_settings table
CREATE TABLE IF NOT EXISTS app_settings (
  id TEXT PRIMARY KEY,
  config JSONB NOT NULL,
  tokens JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
-- 1. Anyone can read the settings (needed for public users to see the theme)
CREATE POLICY "Anyone can read app_settings" ON app_settings 
  FOR SELECT TO public 
  USING (true);

-- 2. Only specific admins can update the settings
CREATE POLICY "Only admins can update app_settings" ON app_settings 
  FOR ALL TO authenticated 
  USING (
    auth.jwt() ->> 'email' IN (
      'admin@muslimhunt.com', 
      'moderator@muslimhunt.com', 
      'zeirislam@gmail.com'
    )
  );

-- Insert default theme if not exists
INSERT INTO app_settings (id, config, tokens) 
VALUES (
  'global_theme', 
  '{"primaryColor":"#10B981","accentColor":"#F59E0B","backgroundColor":"clean-white","roundness":"rounded"}', 
  '{}'
) 
ON CONFLICT (id) DO NOTHING;
