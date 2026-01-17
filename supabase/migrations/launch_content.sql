-- Launch Content Table
-- This table stores dynamic content for launch guide pages

-- Create launch_content table
CREATE TABLE IF NOT EXISTS launch_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE launch_content ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Anyone can view active launch content"
  ON launch_content
  FOR SELECT
  USING (is_active = true);

-- Insert Setting Goals content
INSERT INTO launch_content (page_id, title, content, metadata) VALUES
('setting-goals', 'Setting goals', E'If you came across Muslim Hunt on the interwebs, you might know that a lot of people measure success by the number of upvotes they receive or the product''s position on the leaderboard.

There''s no doubt that "Product of the Day," or the product at the top of the leaderboard on the day of launch, is an indication of a successful launch. Some pretty epic companies have achieved the status. But that''s far from the only way to measure success.

There are many reasons you may choose to launch on Muslim Hunt, and just as many goals and measures of success you can apply to your launch:

**Success Metrics:**

• **Leaderboard** (any position, not just the top!): Join the ranks of notable products like Notion, Loom, and more.
• **Upvotes**
• **Comments** (messages from the community provide helpful feedback so you adjust things like your product features or positioning, or see if you have product-market fit)
• **New followers/community members** (on Muslim Hunt or elsewhere)
• **Social media buzz**
• **Getting ahead of the competition**
• **Interest from investors**
• **Website traffic**
• **Product sales/leads, early adopters**
• **Feedback and networking**
• **Team** (people have found companies they want to work for on Muslim Hunt, or discovered partners who became co-founders)
• **Brand recognition, visibility, and reach**
• **Just getting it done!** Launching is a milestone.

**The most important point here:** You should have measurable goals that you can work towards and evaluate your launch against. We recommend tying these goals to whatever your overall company/product goals are. Product of the Day is certainly an awesome goal to strive for and our foam fingers are at the ready. However, many products that do not achieve this rank have done very well, met their goals, and had undeniably successful Muslim Hunt launches.',
'{"brand": "Muslim Hunt", "vibe": "Muslim vibes", "section": "before-launch"}'::jsonb);

-- Create trigger for updated_at
CREATE TRIGGER update_launch_content_updated_at
  BEFORE UPDATE ON launch_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create index for page_id lookup
CREATE INDEX idx_launch_content_page_id ON launch_content(page_id);

-- Verify the data
-- SELECT page_id, title FROM launch_content WHERE is_active = true;
