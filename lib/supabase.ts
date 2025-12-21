import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

/**
 * Supabase client initialization.
 * Use process.env for environment variables instead of import.meta.env.
 * We include the project keys as hardcoded fallbacks to ensure robust operation.
 */
const supabaseUrl = process.env.VITE_SUPA_URL || 'https://anzqsjvvguiqcenfdevh.supabase.co';
const supabaseKey = process.env.VITE_SUPA_KEY || 'sb_publishable_NtQS4iJiNrKgGH-cBKBF6w_hUn8GNEs';

if (!supabaseUrl || supabaseUrl === 'undefined') {
  console.error("VITE_SUPA_URL is missing or invalid!");
}

if (!supabaseKey || supabaseKey === 'undefined') {
  console.error("VITE_SUPA_KEY is missing or invalid!");
}

export const supabase = createClient(
  supabaseUrl || 'https://anzqsjvvguiqcenfdevh.supabase.co', 
  supabaseKey || 'sb_publishable_NtQS4iJiNrKgGH-cBKBF6w_hUn8GNEs'
);