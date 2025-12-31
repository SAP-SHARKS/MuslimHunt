
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
}

export interface Badge {
  id: string;
  type: 'award' | 'ranking' | 'calendar' | 'square' | 'trophy' | 'featured';
  label: string;
  description: string;
  color: 'purple' | 'gold' | 'emerald' | 'blue' | 'yellow';
  value?: string; 
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
  founder_id: string;
  category: string;
  upvotes_count: number;
  halal_status: 'Certified' | 'Self-Certified' | 'Shariah-Compliant';
  sadaqah_info?: string;
  comments?: Comment[];
  badges?: Badge[];
  is_approved: boolean;
  // New specific columns for Product Hunt fidelity
  pricing_type?: string;
  promo_code?: string;
  promo_offer?: string;
  promo_expiry?: string;
  scheduled_date?: string;
  metadata?: any;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon_name: string;
  parent_category: string;
  display_order: number;
}

export interface Notification {
  id: string;
  type: 'upvote' | 'comment';
  message: string;
  created_at: string;
  is_read: boolean;
  avatar_url?: string;
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
}

export enum View {
  HOME = 'home',
  SUBMIT = 'submit', 
  DETAIL = 'detail',
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
  ADMIN_PANEL = 'admin_panel'
}
