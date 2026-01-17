-- Definitions Table
-- This table stores glossary definitions for Muslim Hunt terminology

-- Create definitions table
CREATE TABLE IF NOT EXISTS definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  term TEXT NOT NULL,
  definition TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE definitions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Anyone can view active definitions"
  ON definitions
  FOR SELECT
  USING (is_active = true);

-- Insert definitions data
INSERT INTO definitions (term, definition, display_order) VALUES
('Hunter', 'A hunter is anybody with a free, personal Muslim Hunt account who posts a new product to share with the community.', 1),
('Maker', 'We define a maker as anyone who uses technology to solve their problems. At Muslim Hunt, makers share what they built by hunting their product, whether they made it by themselves or contributed via a team of makers.', 2),
('Launch', 'A launch happens when a product is shared to a community en masse for the first time. At Muslim Hunt, hunting a product is often the same thing as launching a product — makers hunt their own product when they''re ready to launch it. However, products can also be hunted by others; anyone with an account. People hunt products because they like them and want to share them.', 3),
('Launch Page', 'On Muslim Hunt, when you hunt a new product, that product is given a launch page. On this page, visitors can view details about the product (like who made it) as well as comment on it, upvote it, and more.', 4),
('First comment', 'The first comment is the first comment left on a product''s launch page. It appears right below the gallery so it''s highly visible. For makers, the first comment offers an opportunity to deep dive into the story behind your product, like why you made it and what its best features are. 70% of products that have reached Product of the Day had a first comment left by the maker.', 5),
('Product Page', 'Product Pages are your single source of truth, the place to find everything about a product''s journey including launches, reviews, job openings, and more.', 6),
('Product of the Day', 'Muslim Hunt''s homepage features a leaderboard, where members of the (free) community upvote their favorite products. New products are added by community members every day. These products compete to reach the top of the leaderboard, or Product of the Day. The Product of the Day is determined via a confidential algorithm that evaluates all of the day''s featured products using upvotes, time since posting, and a number of other factors. Product of the Week and Product of the Month awards are also given.', 7);

-- Create trigger for updated_at
CREATE TRIGGER update_definitions_updated_at
  BEFORE UPDATE ON definitions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create index for ordering
CREATE INDEX idx_definitions_order ON definitions(display_order);

-- Verify the data
-- SELECT term, definition FROM definitions WHERE is_active = true ORDER BY display_order;
