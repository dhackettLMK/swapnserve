import { createClient, type SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

/**
 * A service-role Supabase client for edge functions. Bypasses RLS, so every
 * caller MUST be authorised (token or admin secret) before this touches data.
 * SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are injected by the Supabase runtime.
 */
export function supabaseAdmin(): SupabaseClient {
  const url = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceKey) {
    throw new Error("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not set");
  }
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}
