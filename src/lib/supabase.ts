import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Shared Supabase browser client for the Swap'n'Serve Cup feature.
 *
 * Keys are read from Vite env vars (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
 * so nothing sensitive is committed. The anon key is safe to expose in the
 * browser bundle — all privileged access is guarded by row-level security and
 * the admin edge function. See README ("Swap'n'Serve Cup") for setup.
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/** True once both env vars are present — pages use this to show a friendly notice. */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

let client: SupabaseClient | null = null;

/**
 * Returns the shared Supabase client, or throws a friendly error if the env
 * vars are missing. Guard calls with {@link isSupabaseConfigured} in the UI.
 */
export function getSupabase(): SupabaseClient {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (see README).",
    );
  }
  if (!client) {
    client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
    });
  }
  return client;
}
