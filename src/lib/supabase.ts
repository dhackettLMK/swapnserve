import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase as cloudClient } from "@/integrations/supabase/client";

/**
 * Shared backend client for the Swap'n'Serve Cup feature.
 * The project runs on Lovable Cloud, so this simply re-exports the generated
 * client rather than configuring its own credentials.
 */
export const isSupabaseConfigured = true;

export function getSupabase(): SupabaseClient {
  return cloudClient as unknown as SupabaseClient;
}

export const supabase = getSupabase();
