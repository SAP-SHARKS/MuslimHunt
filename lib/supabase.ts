
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

// Use import.meta.env for Vite projects as process.env is not available in the browser context by default
const env = (import.meta as any).env || {};
const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("VITE_SUPABASE keys are missing. Check your environment variables in Vercel or your .env file!");
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder'
);
