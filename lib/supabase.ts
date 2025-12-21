
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

// Use import.meta.env for Vite projects as process.env is not available in the browser context by default
const env = (import.meta as any).env || {};
const supabaseUrl = env.VITE_SUPA_URL;
const supabaseAnonKey = env.VITE_SUPA_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("VITE_SUPA environment variables are missing. Check your Vercel settings or .env file!");
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder'
);
