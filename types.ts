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

export interface Product {
  id: string;
  created_at: string;
  name: string;
  description: string;
  tagline: string;
  url: string;
  logo_url: string;
  founder_id: string;
  category: string;
  upvotes_count: number;
  halal_status: 'Certified' | 'Self-Certified' | 'Shariah-Compliant';
  sadaqah_info?: string;
  comments?: Comment[];
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
  LOGIN = 'login',
  PROFILE = 'profile',
  NEW_THREAD = 'new_thread',
  FORUM_HOME = 'forum_home',
  RECENT_COMMENTS = 'recent_comments',
  SPONSOR = 'sponsor',
  NEWSLETTER = 'newsletter'
}