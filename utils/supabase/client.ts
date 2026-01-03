
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    (import.meta as any).env?.VITE_SUPA_URL || 'https://anzqsjvvguiqcenfdevh.supabase.co',
    (import.meta as any).env?.VITE_SUPA_KEY || 'sb_publishable_NtQS4iJiNrKgGH-cBKBF6w_hUn8GNEs'
  );
}
