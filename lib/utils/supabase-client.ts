import { createBrowserClient } from '@supabase/ssr'

import { config } from 'dotenv';

config({ path: '.env' });

export function getBrowserClient() {
  // Create a supabase client on the browser with project's credentials
  return createBrowserClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  )
}