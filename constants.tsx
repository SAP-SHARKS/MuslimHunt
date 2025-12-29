import { Product } from './types';

export const HALAL_STATUSES = ['Certified', 'Self-Certified', 'Shariah-Compliant'] as const;

export interface CategoryItem {
  name: string;
  description: string;
}

export interface CategorySection {
  id: string;
  title: string;
  icon: any; // Using any for simplicity in constants, typed in components
  items: CategoryItem[];
}

export const CATEGORY_SECTIONS: CategorySection[] = [
  {
    id: "productivity",
    title: "Productivity",
    icon: 'CheckSquare',
    items: [
      { name: "AI notetakers", description: "Automated meeting transcripts and summaries for high-output teams." },
      { name: "App switcher", description: "Seamlessly navigate between your desktop applications." },
      { name: "Compliance software", description: "Keep your startup aligned with global regulatory standards." },
      { name: "Email clients", description: "The next generation of inbox management and AI-powered replies." },
      { name: "Knowledge base", description: "Centralize your team's documentation and internal wisdom." },
      { name: "Note and writing apps", description: "Distraction-free environments for your best ideas." },
      { name: "Presentation Software", description: "Design stunning slide decks with the help of AI agents." },
      { name: "Resume tools", description: "Build professional, ATS-optimized resumes in minutes." },
      { name: "Search", description: "Find anything across your entire local and cloud workspace." },
      { name: "Team collaboration", description: "Communication platforms for modern, distributed teams." },
      { name: "Virtual office", description: "Remote-first environments that replicate the feel of being together." }
    ]
  },
  {
    id: "engineering",
    title: "Engineering & Dev",
    icon: 'Code',
    items: [
      { name: "A/B testing tools", description: "Optimize your product conversions with data-driven experiments." },
      { name: "AI Coding Agents", description: "Autonomous agents that write and fix code based on high-level prompts." },
      { name: "Automation tools", description: "Connect your entire stack and automate repetitive workflows." },
      { name: "AI Code Editors", description: "The next evolution of IDEs with deep semantic understanding." },
      { name: "AI Databases", description: "Vector stores and high-performance databases for the AI era." },
      { name: "Browser Automation", description: "Scrape, test, and interact with the web programmatically." },
      { name: "AI Code Testing", description: "Automated unit test generation and bug detection." },
      { name: "Authentication", description: "Secure identity management for apps and services." },
      { name: "Cloud Computing", description: "Serverless, edge, and infrastructure-as-a-service providers." },
      { name: "Code Review Tools", description: "AI-powered feedback on pull requests and code quality." },
      { name: "Databases & Backend", description: "Scalable storage solutions and backend-as-a-service." },
      { name: "Issue tracking", description: "Manage bugs, features, and roadmaps with ease." },
      { name: "Predictive AI", description: "Models that forecast trends and user behavior." },
      { name: "Static site generators", description: "Blazing fast tools for content-heavy web projects." },
      { name: "Unified API", description: "One interface to rule dozens of third-party integrations." },
      { name: "Vibe Coding Tools", description: "Tools for developers who prioritize flow and rapid prototyping." }
    ]
  },
  {
    id: "design",
    title: "Design & Creative",
    icon: 'Palette',
    items: [
      { name: "3D & Animation", description: "Create immersive assets and motion graphics without the learning curve." },
      { name: "AI Headshot Generators", description: "Professional portraits generated from simple selfies." },
      { name: "Camera apps", description: "Advanced photography tools for your mobile device." },
      { name: "Design resources", description: "Libraries of high-quality UI kits, icons, and fonts." },
      { name: "Icon sets", description: "Hand-crafted and AI-generated iconography for every brand." },
      { name: "Music Generation", description: "Custom soundtracks and beats generated from text prompts." },
      { name: "Social audio apps", description: "Voice-first social networks and podcasting tools." },
      { name: "UI frameworks", description: "Build beautiful interfaces faster with pre-built components." },
      { name: "AI Characters", description: "Interactive avatars and digital personas for games and support." },
      { name: "Avatar generators", description: "Custom profile pictures and digital identities." },
      { name: "Interface design tools", description: "Collaborative platforms for web and mobile prototyping." },
      { name: "Photo editing", description: "Powerful image manipulation tools powered by neural networks." },
      { name: "User research", description: "Collect and analyze qualitative feedback from your users." },
      { name: "Wireframing", description: "Quickly map out your application's user experience." },
      { name: "AI Generative Media", description: "Synthesize images and video from natural language." },
      { name: "Graphic design tools", description: "Everything you need for branding and marketing visuals." },
      { name: "Video editing", description: "Automated and pro-level tools for cinematic content." }
    ]
  },
  {
    id: "finance",
    title: "Finance & Wealth",
    icon: 'DollarSign',
    items: [
      { name: "Accounting", description: "Automated bookkeeping and tax preparation for small businesses." },
      { name: "Financial planning", description: "Tools to manage your long-term wealth and investments." },
      { name: "Invoicing", description: "Get paid faster with professional, automated billing." },
      { name: "Online banking", description: "Next-gen banking services for founders and digital nomads." },
      { name: "Retirement planning", description: "Secure your future with smart savings strategies." },
      { name: "Startup incorporation", description: "Launch your legal entity in minutes, anywhere in the world." },
      { name: "Treasury management", description: "Optimize your company's cash flow and interest rates." },
      { name: "Budgeting", description: "Take control of your personal and business spending." },
      { name: "Fundraising", description: "Manage your cap table and investor relationships." },
      { name: "Money transfer", description: "Global payments with minimal fees and maximum speed." },
      { name: "Payroll", description: "Easily pay employees and contractors across borders." },
      { name: "Savings", description: "High-yield accounts and automated saving habits." },
      { name: "Stock trading", description: "Access the global markets with powerful trading platforms." }
    ]
  },
  {
    id: "marketing",
    title: "Marketing & Sales",
    icon: 'Megaphone',
    items: [
      { name: "AI sales tools", description: "Supercharge your outbound efforts with AI prospect research." },
      { name: "CRM", description: "The source of truth for all your customer relationships." },
      { name: "GEO Tools", description: "Analyze markets and target users based on location data." },
      { name: "Landing page builders", description: "Convert visitors into customers with high-performance pages." },
      { name: "SEO", description: "Rank higher on search engines with automated content tools." },
      { name: "Social management", description: "Schedule and analyze your brand's social presence." },
      { name: "Advertising tools", description: "Manage and optimize your paid spend across networks." },
      { name: "Lead generation", description: "Find and qualify new business opportunities automatically." },
      { name: "Sales enablement", description: "Equip your sales team with the best decks and collateral." },
      { name: "Affiliate marketing", description: "Build and manage your partner referral programs." },
      { name: "Email marketing", description: "Send personalized campaigns that actually get opened." },
      { name: "Marketing automation", description: "Nurture your leads through complex, triggered journeys." }
    ]
  },
  {
    id: "spirituality",
    title: "Spirituality & Deen",
    icon: 'BookOpen',
    items: [
      { name: "Quran Apps", description: "Reading, translation, and recitation platforms." },
      { name: "Prayer Timings", description: "Global prayer time and Qibla direction tools." },
      { name: "Islamic Education", description: "Courses, lectures, and children's learning apps." },
      { name: "Charity & Zakat", description: "Simplified platforms for giving and tracking donations." }
    ]
  }
];

// Curated Unsplash IDs for high-fidelity images
const UNSPLASH_IDS = [
  'photo-1609599006353-e629aaabfeae', // Quran
  'photo-1584697964400-2af6a2f6204c', // Calligraphy
  'photo-1517694712202-14dd9538aa97', // Tech/Work
  'photo-1557838923-2985c318be48', // Marketing
  'photo-1542816417-0983c9c9ad53', // Minaret
  'photo-1564120029-291750e70391', // Prayer
  'photo-1591604129939-f1efa4d9f7fa', // Architecture
  'photo-1579621970563-ebec7560ff3e', // Finance
  'photo-1512621776951-a57141f2eefd', // Food
  'photo-1521737711867-e3b97375f902', // Social
  'photo-1556761175-4b46a572b786', // Meeting
  'photo-1590076214667-c0f33b98c422', // Kaaba
  'photo-1633156189757-45430d6c949d', // Wallet
  'photo-1506126613408-eca07ce68773', // Calm
  'photo-1516979187457-637abb4f9353', // Books
  'photo-1511295742364-917e703b5758', // Bed/Sleep
  'photo-1503676260728-1c00da094a0b', // Cards
  'photo-1542744094-24638eff58bb', // Audience
  'photo-1559526324-4b87b5e36e44', // Charts
  'photo-1456513080510-7bf3a84b82f8', // Writing
  'photo-1555066931-4365d14bab8c', // Code
  'photo-1498050108023-c5249f4df085', // Laptop
  'photo-1526304640581-d334cdbbf45e', // Money
  'photo-1548013146-72479768bbaa', // Taj Mahal
  'photo-1571019613454-1cb2f99b2d8b', // Gym
  'photo-1518467166778-b8c6b252b19d', // Audio
  'photo-1461749280684-dccba630e2f6', // Keyboard
  'photo-1523413363574-c3c444a14c78', // Globe
  'photo-1567620905732-2d1ec7bb7445', // Blocks
  'photo-1504674900247-0877df9cc836', // Baking
  'photo-1511688868353-3a2d5be94cd7', // Plants
];

/**
 * Generates 50 unique high-fidelity mock products for a given category.
 */
function generateMockProducts(categoryName: string, count: number): Product[] {
  const products: Product[] = [];
  const suffix = ["Pro", "Flow", "Hero", "AI", "Connect", "Plus", "Direct", "Sync", "Hub", "Central", "Master", "Edge", "Core", "Nexus", "Pulse"];
  const adjectives = ["Smart", "Ethical", "Muslim", "Ummah", "Elite", "Modern", "Pure", "Trusted", "Global", "Active", "Daily", "Fast", "Secure"];

  for (let i = 0; i < count; i++) {
    // Deterministic random seeding based on category and index
    const seed = categoryName.length + i;
    const adj = adjectives[seed % adjectives.length];
    const suf = suffix[seed % suffix.length];
    const name = `${adj} ${categoryName.replace(/s$/, '')} ${suf} ${i + 1}`;
    
    products.push({
      id: `gen-${categoryName.replace(/\s+/g, '-')}-${i}`,
      created_at: new Date(Date.now() - (i * 3600000 * 4)).toISOString(), // Spread over last few days
      name,
      description: `A high-performance tool designed specifically for the ${categoryName} space within the Muslim tech ecosystem. Optimized for efficiency and Shariah-compliance.`,
      tagline: `The most powerful ${categoryName} solution for modern Ummah builders.`,
      url: `https://example.com/${name.toLowerCase().replace(/\s+/g, '-')}`,
      logo_url: `https://images.unsplash.com/${UNSPLASH_IDS[seed % UNSPLASH_IDS.length]}?w=128&h=128&fit=crop`,
      founder_id: `u-gen-${seed}`,
      category: categoryName,
      upvotes_count: Math.floor(50 + (Math.random() * 4950)),
      halal_status: HALAL_STATUSES[seed % HALAL_STATUSES.length]
    });
  }
  return products;
}

// Global Products Registry populated for all 60+ subcategories
const ALL_GENERATED_PRODUCTS: Product[] = CATEGORY_SECTIONS.flatMap(section => 
  section.items.flatMap(item => generateMockProducts(item.name, 50))
);

export const INITIAL_PRODUCTS: Product[] = ALL_GENERATED_PRODUCTS;

export const CATEGORIES = CATEGORY_SECTIONS.flatMap(s => s.items.map(i => i.name));
