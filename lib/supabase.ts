
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

// Use process.env instead of import.meta.env to resolve Property 'env' does not exist on type 'ImportMeta'
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("VITE_SUPABASE keys are missing. Auth features will be disabled until environment variables are configured.");
}

export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder');
