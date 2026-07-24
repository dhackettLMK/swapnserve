// Shared CORS headers for the Cup edge functions. The frontend calls these
// directly from the browser, so preflight + permissive origin are required.
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-admin-token",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

export function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

/** Standard preflight response; return this for OPTIONS requests. */
export function preflight(): Response {
  return new Response("ok", { headers: corsHeaders });
}
