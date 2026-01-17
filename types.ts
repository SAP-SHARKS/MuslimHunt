
export interface Profile {
  id: string;
  username: string;
  avatar_url: string;
  bio?: string;
  headline?: string;
  twitter_url?: string;
  website_url?: string;
}

export interface Comment {
  id: string;
  user_id: string;
  product_id: string;
  username: string;
  avatar_url: string;
  text: string;
  created_at: string;
  is_maker?: boolean;
  upvotes_count: number;
  parent_id?: string; // Added for threading
}

export interface Badge {
  id: string;
  type: 'award' | 'ranking' | 'calendar' | 'square' | 'trophy' | 'featured';
  label: string;
  description: string;
  color: 'purple' | 'gold' | 'emerald' | 'blue' | 'yellow';
  value?: string; // e.g., "1" for #1 Product of the Day
}

export interface Product {
  id: string;
  created_at: string;
  name: string;
  description: string;
  tagline: string;
  url?: string;
  website_url?: string;
  logo_url: string;
  user_id: string; // Changed from founder_id
  category: string;
  upvotes_count: number;
  halal_status: 'Certified' | 'Self-Certified' | 'Shariah-Compliant';
  sadaqah_info?: string;
  comments?: Comment[];
  badges?: Badge[];
  is_approved: boolean; // Moderation flag
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon_name: string;
  parent_category: string;
}

export interface ForumCategory {
  id: number;
  name: string;
  slug: string;
}

export interface Notification {
  id: string;
  type: 'upvote' | 'comment' | 'approval' | 'rejection' | 'streak';
  message: string;
  created_at: string;
  is_read: boolean;
  avatar_url?: string;
  streak_days?: number;
}

export interface NavSubItem {
  label: string;
  subtext: string;
  icon: string;
  bgClass: string;
  colorClass: string;
  view: View;
}

export interface NavMenuItem {
  id: string;
  label: string;
  view?: View;
  icon?: string;
  sub_items?: NavSubItem[];
  display_order: number;
  is_active: boolean;
}

export interface Vote {
  id: string;
  user_id: string;
  product_id: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  avatar_url: string;
  bio?: string;
  twitter_url?: string;
  website_url?: string;
  headline?: string;
  is_admin?: boolean; // Admin privilege flag
}

export interface StoryCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  display_order: number;
  is_active: boolean;
}

export interface Story {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  content: string;
  excerpt?: string;
  cover_image_url?: string;
  author_id?: string;
  author_name: string;
  author_avatar_url?: string;
  category_id: string;
  views_count: number;
  comments_count: number;
  likes_count: number;
  reading_time?: number;
  is_featured: boolean;
  is_published: boolean;
  published_at: string;
  created_at: string;
  category?: StoryCategory;
}

export interface StoryComment {
  id: string;
  story_id: string;
  user_id?: string;
  username: string;
  avatar_url?: string;
  text: string;
  parent_id?: string;
  likes_count: number;
  created_at: string;
  updated_at: string;
}

export enum View {
  HOME = 'home',
  SUBMIT = 'submit',
  DETAIL = 'detail',
  DIRECTORY = 'directory',
  PROFILE = 'profile',
  NEW_THREAD = 'new_thread',
  FORUM_HOME = 'forum_home',
  RECENT_COMMENTS = 'recent_comments',
  SPONSOR = 'sponsor',
  NEWSLETTER = 'newsletter',
  CATEGORIES = 'categories',
  CATEGORY_DETAIL = 'category_detail',
  WELCOME = 'welcome',
  POST_SUBMIT = 'post_submit',
  NOTIFICATIONS = 'notifications',
  SUBMISSION = 'submission',
  LAUNCH_GUIDE = 'LAUNCH_GUIDE',
  HELP_CENTER = 'HELP_CENTER',
  ADMIN_PANEL = 'admin_panel',
  SETTINGS = 'settings',
  API_DASHBOARD = 'api_dashboard',
  PROFILE_EDIT = 'profile_edit',
  MY_PRODUCTS = 'my_products',
  FOLLOWED_PRODUCTS = 'followed_products',
  VERIFICATION = 'verification',
  FORUM_CATEGORY = 'forum_category',
  FORUM_THREAD = 'forum_thread',
  HELP_ARTICLE = 'help_article',
  LAUNCH_ARCHIVE = 'launch_archive',
  HOW_IT_WORKS = 'how_it_works',
  BEFORE_LAUNCH = 'before_launch',
  PREPARING_FOR_LAUNCH = 'preparing_for_launch',
  DAYS_AFTER_LAUNCH = 'days_after_launch',
  SHARING_YOUR_LAUNCH = 'sharing_your_launch',
  LAUNCH_DAY_DUTIES = 'launch_day_duties',
  DEFINITIONS = 'definitions',
  STORIES = 'stories',
  STORY_DETAIL = 'story_detail',
  STORY_CATEGORY = 'story_category'
}
