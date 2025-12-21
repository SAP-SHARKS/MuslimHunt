import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

// Vercel environment variables at build time with hardcoded fallbacks
// Use optional chaining to safely check for env object
// @ts-ignore
const supabaseUrl = import.meta.env?.VITE_SUPA_URL || 'https://anzqsjvvguiqcenfdevh.supabase.co';
// @ts-ignore
const supabaseKey = import.meta.env?.VITE_SUPA_KEY || 'sb_publishable_NtQS4iJiNrKgGH-cBKBF6w_hUn8GNEs';

console.log('Supabase Config:', { 
  url: supabaseUrl, 
  hasKey: !!supabaseKey 
});

export const supabase = createClient(supabaseUrl, supabaseKey);