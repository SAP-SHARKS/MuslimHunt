
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'https://esm.sh/next@14.2.3/headers';

export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.VITE_SUPA_URL || 'https://anzqsjvvguiqcenfdevh.supabase.co',
    process.env.VITE_SUPA_KEY || 'sb_publishable_NtQS4iJiNrKgGH-cBKBF6w_hUn8GNEs',
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Handled by middleware
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // Handled by middleware
          }
        },
      },
    }
  );
}
