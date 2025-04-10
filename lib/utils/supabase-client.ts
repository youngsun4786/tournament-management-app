import { createBrowserClient } from '@supabase/ssr';
import { Database } from "../database.types";

export function getBrowserClient() {
  // Create a supabase client on the browser with project's credentials
  return createBrowserClient<Database>(
    import.meta.env.VITE_SUPABASE_URL!,
    import.meta.env.VITE_SUPABASE_ANON_KEY!
  )
}