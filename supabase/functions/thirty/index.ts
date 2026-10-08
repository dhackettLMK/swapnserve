// Thirty Under Thirty page content.
//   get         public, returns the saved page content
//   save        organiser only (x-admin-token), stores the page content
//   upload-url  organiser only, returns a one-time upload URL plus the
//               long-lived URL the image will be shown from
import { json, preflight } from "../_shared/cors.ts";
import { supabaseAdmin } from "../_shared/supabaseAdmin.ts";

const KEY = "thirty-under-thirty";
const TEN_YEARS = 60 * 60 * 24 * 365 * 10;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return preflight();
  try {
    const body = await req.json().catch(() => ({}));
    const action = typeof body.action === "string" ? body.action : "get";
    const supabase = supabaseAdmin();

    if (action === "get") {
      const { data } = await supabase.from("site_content").select("data").eq("key", KEY).maybeSingle();
      return json({ content: data?.data ?? null });
    }

    const adminToken = Deno.env.get("ADMIN_TOKEN");
    if (!adminToken || req.headers.get("x-admin-token") !== adminToken) {
      return json({ error: "Wrong passcode." }, 401);
    }

    if (action === "check") return json({ ok: true });

    if (action === "save") {
      const content = body.content;
      if (!content || typeof content !== "object") return json({ error: "Nothing to save." }, 400);
      if (JSON.stringify(content).length > 500_000) return json({ error: "Too much text." }, 413);
      const { error } = await supabase
        .from("site_content")
        .upsert({ key: KEY, data: content, updated_at: new Date().toISOString() });
      if (error) throw error;
      return json({ ok: true });
    }

    if (action === "upload-url") {
      const ext = String(body.ext ?? "jpg").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 5) || "jpg";
      const path = `${crypto.randomUUID()}.${ext}`;
      const bucket = supabase.storage.from("thirty");
      const { data: up, error } = await bucket.createSignedUploadUrl(path);
      if (error) throw error;
      const { data: view, error: vErr } = await bucket.createSignedUrl(path, TEN_YEARS);
      if (vErr) throw vErr;
      return json({ path, token: up.token, url: view.signedUrl });
    }

    return json({ error: "Unknown action." }, 400);
  } catch (err) {
    console.error("thirty function error", err);
    return json({ error: "Something went wrong. Please try again." }, 500);
  }
});
