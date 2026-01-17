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

-- Insert Hunters Guide content
INSERT INTO launch_content (page_id, title, content, metadata) VALUES
('hunters-do-you-need-one', 'Hunters: Do you need one?', E'"Do I need someone specific to hunt my product?" you ask.

The answer is quite simple: Nope. Hunting is just posting. A hunter can be anybody with a personal Muslim Hunt account. That can be you, your co-makers, or an enthusiastic user.

**Myths around famous hunters**

When Muslim Hunt first launched, only a few people were able to hunt products… and they hunted a LOT of great products. These early community members were instrumental in Muslim Hunt''s story; many still use the site today. We are super grateful to those early users for their sheer love of tech, products, and community building. As we grew, the community requested that we open up the ability to hunt to everyone. Now anyone with a personal account on Muslim Hunt can contribute products to the community.

Hunters on Muslim Hunt are product and tech enthusiasts at their core. You can be the hunter of your own product, and we actively encourage this to give you more control over your launch. We love hunters; we are hunters! Our advice to makers is not to let waiting for the ''ideal'' hunter to post your product be a blocker to launching. This can become a distraction from working on the most important thing — building your product and growing a community around it.

As for self-hunting — you can feel confident that using a top hunter is no longer a barrier to success:

• **79% of featured posts** were by makers who self-hunted
• **60% of #1 Product of the Day winners** were self-hunted

Our aim is to empower makers, so if you''re in search of someone who can help you with your questions or need help navigating your launch, reach out! You can reach our global support team via the chat button on the bottom right of the website.

**Paying hunters or promoters**

There is no rule against using a hunter outside of your team, but paying people to hunt your product goes against our guidelines.

We obsess over making sure everyone enjoys a free, fair experience. People who ask for compensation for posting or pushing traffic to your launch have been known to use tactics that go against our policies, like using bots to spam the community or running giveaways for upvotes. That inauthentic behavior is easy to spot. Not only does that actually end up being a turn-off for those who genuinely want to engage with your product, it also hurts your product. Products caught breaking the rules will be unfeatured or removed and the makers associated with the product may be permanently banned from the site. Read more on this here.

**What to focus on**

Choose a hunter who really understands the benefits of your product, whether that''s you, a co-maker, or a user who big-time loves your product. By doing so, you''re showing the community that you''re invested — not just in vanity metrics, but in what you''re building and the experience of your users. Garnering your first 100 true fans is far more critical for your product in the long term than false engagement for short-lived perceived gains.

Focus on authentic engagement. Set goals, prepare your launch content, read case studies, and let your community know your launch is coming.',
'{"brand": "Muslim Hunt", "vibe": "Muslim vibes", "section": "before-launch"}'::jsonb),

-- Insert Setting Goals content
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
