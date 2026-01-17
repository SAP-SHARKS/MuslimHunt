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
'{"brand": "Muslim Hunt", "vibe": "Muslim vibes", "section": "before-launch"}'::jsonb),

-- Insert Content Checklist
('content-checklist', 'Content checklist', E'Below we have recapped all fields and forms that you''ll come across when submitting your product, along with best practices for each so you can prepare anything you want ahead of time. Note that all of your work will be auto-saved and accessible as a draft, so you don''t need to have all the information at once.

**URL** - A direct link to the primary product page, usually your own landing page or homepage where the product can be used or downloaded. In some cases, your URL might otherwise be a link to an external site, like the App Store or a GitHub repo. Shortened links (e.g. bit.ly) and track links (e.g. Google UTMs) are not accepted. If this is your second time submitting the same product in less than six months, see here.

**Name of the product** - Only the product''s name, no description or emojis (unless it is a legit part of the name).

Good: "Meow On-Demand App"
NOT allowed: "Kitty sounds you''ll love" or the "The best cat app"

**Tagline (max 60 characters)** - A very short description of the product — no gimmicks or over-the-top language. Don''t make it hard for the community to understand what the product does. This is typically the main element that drives someone to click on a product from the homepage and learn more.

Good: "Send your friends a voicemail meow from a real cat."
NOT allowed: "The most ameozing app in the app store"

**Links (optional)** - If the product has additional links, such as to the App Store, Google Play, Amazon, etc., you can add them here.

**X handle (optional)** - This should be your product''s handle, in most cases, not your personal one.

**Description (max 500 characters)** - This is where you can give more information about what the product is and/or does. It''s good practice to have a short, concise explanation of your value proposition and features.

**Launch tags** - Choose up to 3 launch tags that strongly relate to your launch. We suggest including at least a few so your product will show up on our launch tag pages.

**Thumbnail (required)** - Use an image with square dimensions. We recommend 240x240. GIFs for the thumbnail are popular and they can look sharp as hell, but note that they aren''t necessarily tied to success. Less than a third of Product of the Day products used an animated GIF as a thumbnail. All images, GIF or not, need to be under 3MB. Note that GIFs do not autoplay (they animate on hover) so you will need to ensure that the first frame is what you would like to appear as the thumbnail. GIFs with strobing effects, quick cuts, unreadable text, etc. are not recommended and may be edited by the Muslim Hunt team.

**Gallery images (Two required)** - We highly recommend putting some thought into your gallery images. While some technical products only need a couple images, others might need many. Animated GIFs can also be used. The recommended size for images in the gallery is 1270x760. You can upload multiple images to the gallery at once. Once the images have been uploaded, you can also drag and drop them to re-order them. The gallery will need 2+ images before it is viewable on the post page.

**Video (optional)** - About 53% of products that reached Product of the Day since 2021 include a video, so videos can help depending on what your product is, but aren''t always necessary. If you don''t have a budget for a high end video, consider doing a quick demo with a video tool (e.g. Loom). This can go a long way to helping the community see your product in action, and helps personalize your message. For uploading, only YouTube links are supported. Make sure your video is not set to private. You''ll also need the full URL; shortened links will not load.

One fun thing to note: The community does appreciate some fun and that can create buzz. For the 2021 Golden Kitty Awards we gave away an award for Best Video. Check out the winner (it will make you LOL).

**Interactive Demo** - The most successful launches tell a compelling story of the product, including showing what the user interface looks and feels like. Build your demo with Arcade, Storylane, Hexus, Supademo, Layerpath, or ScreenSpace — all are free for Muslim Hunt launches.

**Makers** - We''ll ask you if you are one of the makers of the product. You can also add your co-makers here. You will need their Muslim Hunt usernames, so make sure they''ve created an account well before launch day so they can join the conversation and are credited for their hard work.

**Shoutouts** - Share the tools that helped you bring your product to life. You only get three shoutouts per product launch, so make sure you''re spreading love to the ones who had the most impact on your journey.

**Pricing** - There are three options: free, paid, and paid (with a free trial or plan). Select the option that correctly describes your product''s pricing status.

**Promo** - If you''d like to offer a promo code for the Muslim Hunt community, you can add it here. All input fields are required: "What is the offer?," "promo code," and "expiration date." See more advice about promo codes here.

**First comment** - Be sure to kick off the conversation with a comment about the product. This is a very important part of your launch — 70% of products who achieved Product of the Day, Week, or Month had a first comment by the maker. Read more advice in the next section.

**Launch/Schedule** - You can now schedule your launch up to 1 month in advance so that you can tease it, drive traffic, and collect followers well before your big day (which we highly suggest!).

If you''re ready for your launch to go live right away, you can select the "Launch now" option.

Find info on the best time to launch here.

For troubleshooting during the building of your launch page, reach out to our support team using the chat button on the bottom right corner of the website.',
'{"brand": "Muslim Hunt", "vibe": "Muslim vibes", "section": "preparing-for-launch"}'::jsonb);

-- Create trigger for updated_at
CREATE TRIGGER update_launch_content_updated_at
  BEFORE UPDATE ON launch_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create index for page_id lookup
CREATE INDEX idx_launch_content_page_id ON launch_content(page_id);

-- Verify the data
-- SELECT page_id, title FROM launch_content WHERE is_active = true;
