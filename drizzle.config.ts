import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({ path: '.env' });

export default defineConfig({
  schema: 'db/schema.ts',
  out: 'supabase/migrations',
  dialect: 'postgresql',
  introspect: {
    casing: "preserve"
  },
  dbCredentials: {
    url: process.env.DB_CONNECTION_STRING!,
  },
  verbose: true,
  schemaFilter: ["public"],
});
