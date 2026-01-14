-- Create app_settings table for storing global theme
CREATE TABLE IF NOT EXISTS app_settings (
  id TEXT PRIMARY KEY,
  config JSONB NOT NULL,
  tokens JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read app_settings (for loading global theme)
CREATE POLICY "Anyone can read app_settings"
  ON app_settings
  FOR SELECT
  TO public
  USING (true);

-- Policy: Only admins can update app_settings
CREATE POLICY "Only admins can update app_settings"
  ON app_settings
  FOR ALL
  TO authenticated
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

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_app_settings_id ON app_settings(id);

COMMENT ON TABLE app_settings IS 'Global application settings including theme configuration';
COMMENT ON COLUMN app_settings.id IS 'Unique identifier for the setting (e.g., global_theme)';
COMMENT ON COLUMN app_settings.config IS 'Theme configuration object';
COMMENT ON COLUMN app_settings.tokens IS 'Generated CSS tokens';
