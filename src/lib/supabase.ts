import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Shared Supabase browser client for the Swap'n'Serve Cup feature.
 * Reads Vite env vars when present, otherwise falls back to the public
 * project values so the site works even where env vars aren't set (e.g. Lovable).
 * The anon key is safe in the browser bundle — RLS + the admin edge function
 * guard all privileged access.
 */
const FALLBACK_SUPABASE_URL = "https://vccnalvvsgngobroubef.supabase.co";
const FALLBACK_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjY25hbHZ2c2duZ29icm91YmVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5MjAwNDEsImV4cCI6MjEwMDQ5NjA0MX0.pvAk1A2THqy6Z2bH7gSDWgqWEFnbkX-4VT8amOWnxck";

const supabaseUrl =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) ?? FALLBACK_SUPABASE_URL;
const supabaseAnonKey =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ?? FALLBACK_SUPABASE_ANON_KEY;

/** True once both values are present — pages use this to show a friendly notice. */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

let client: SupabaseClient | null = null;

/** Returns the shared Supabase client. */
export function getSupabase(): SupabaseClient {
  if (!client) {
    client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
    });
  }
  return client;
}

/** Bare client export for callers that import it directly. */
export const supabase = getSupabase();