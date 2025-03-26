import { createBrowserClient } from '@supabase/ssr'

export function getBrowserClient() {
  console.log("SUPABASE_URL", process.env.SUPABASE_URL!);
  console.log("SUPABASE_KEY", process.env.SUPABASE_ANON_KEY!);
  // Create a supabase client on the browser with project's credentials
  return createBrowserClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  )
}