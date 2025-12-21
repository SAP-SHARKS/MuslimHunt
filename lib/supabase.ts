import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

/**
 * Supabase client initialization using Vite-style environment variables.
 * Falls back to hardcoded project values to ensure connectivity.
 * Uses optional chaining to prevent crashes in environments where import.meta.env is undefined.
 */
// @ts-ignore
const supabaseUrl = import.meta.env?.VITE_SUPA_URL || 'https://anzqsjvvguiqcenfdevh.supabase.co';
// @ts-ignore
const supabaseKey = import.meta.env?.VITE_SUPA_KEY || 'sb_publishable_NtQS4iJiNrKgGH-cBKBF6w_hUn8GNEs';

export const supabase = createClient(supabaseUrl, supabaseKey);