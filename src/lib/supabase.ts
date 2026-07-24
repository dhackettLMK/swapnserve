import { createClient } from "@supabase/supabase-js";

// Public values. Safe to ship in frontend code. Env vars take precedence
// when present so different environments can override without a code change.
const FALLBACK_SUPABASE_URL = "https://vccnalvvsgngobroubef.supabase.co";
const FALLBACK_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjY25hbHZ2c2duZ29icm91YmVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5MjAwNDEsImV4cCI6MjEwMDQ5NjA0MX0.pvAk1A2THqy6Z2bH7gSDWgqWEFnbkX-4VT8amOWnxck";

const supabaseUrl =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) ?? FALLBACK_SUPABASE_URL;
const supabaseAnonKey =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ?? FALLBACK_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
