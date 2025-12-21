import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

/**
 * Supabase client initialization.
 * In Vite-based environments, environment variables are accessed via import.meta.env.
 * We include the direct keys as fallbacks to ensure immediate functionality in the AI Studio preview.
 */
const env = (import.meta as any).env || {};

const supabaseUrl = env.VITE_SUPA_URL || 'https://anzqsjvvguiqcenfdevh.supabase.co';
const supabaseAnonKey = env.VITE_SUPA_KEY || 'sb_publishable_NtQS4iJiNrKgGH-cBKBF6w_hUn8GNEs';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("VITE_SUPA environment variables are missing. Please ensure VITE_SUPA_URL and VITE_SUPA_KEY are set in your .env file or environment settings!");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
