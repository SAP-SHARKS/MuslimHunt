
import { createClient as createBrowserClient } from '../utils/supabase/client.ts';

// Standard client for use in browser components
export const supabase = createBrowserClient();
