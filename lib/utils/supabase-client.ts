import { createBrowserClient } from '@supabase/ssr';
import { Database } from "../database.types";

export function getBrowserClient() {
  // Create a supabase client on the browser with project's credentials
  return createBrowserClient<Database>(
    process.env.VITE_SUPABASE_URL!,
    process.env.VITE_SUPABASE_ANON_KEY!
  )
}