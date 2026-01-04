import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

// Use optional chaining to safely access environment variables and prevent "Cannot read properties of undefined"
const supabaseUrl = (import.meta as any)?.env?.VITE_SUPA_URL || 'https://anzqsjvvguiqcenfdevh.supabase.co';
const supabaseKey = (import.meta as any)?.env?.VITE_SUPA_KEY || 'sb_publishable_NtQS4iJiNrKgGH-cBKBF6w_hUn8GNEs';

export const supabase = createClient(supabaseUrl, supabaseKey);