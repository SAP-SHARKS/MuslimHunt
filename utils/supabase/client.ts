
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    (import.meta as any).env?.VITE_SUPA_URL || 'https://anzqsjvvguiqcenfdevh.supabase.co',
    (import.meta as any).env?.VITE_SUPA_KEY || 'sb_publishable_NtQS4iJiNrKgGH-cBKBF6w_hUn8GNEs',
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'sb-auth-token',
        // In modern @supabase/ssr, createBrowserClient automatically uses cookies 
        // if window.document is available, but we can ensure it's prioritized here.
      }
    }
  );
}
