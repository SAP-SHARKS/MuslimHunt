import { createClient } from '@supabase/supabase-js';

// Use optional chaining to safely access environment variables and prevent "Cannot read properties of undefined"
const supabaseUrl = 'https://anzqsjvvguiqcenfdevh.supabase.co';
const supabaseKey = 'sb_publishable_NtQS4iJiNrKgGH-cBKBF6w_hUn8GNEs';

if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase keys missing!', { supabaseUrl, supabaseKey });
}

export const supabase = createClient(supabaseUrl, supabaseKey);