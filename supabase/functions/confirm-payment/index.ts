// Swap'n'Serve Cup — confirm a payment after the player returns from checkout.
// The frontend calls this with the session id Stripe puts on the return URL.
// We retrieve the session from Stripe; if it is paid, we fulfil it here
// (idempotently — the webhook may have beaten us to it) so a team's status
// never depends on webhook delivery timing.
import { json, preflight } from "../_shared/cors.ts";
import { supabaseAdmin } from "../_shared/supabaseAdmin.ts";
import { createStripeClient, type StripeEnv } from "../_shared/stripe.ts";
import { recomputeTeamStatus } from "../_shared/recompute.ts";
import { fulfilSoloSession, isSoloSession } from "../_shared/solo.ts";

function clean(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return preflight();
  try {
    const body = await req.json().catch(() => ({}));
    const env: StripeEnv = body.environment === "live" ? "live" : "sandbox";
    const sessionId = clean(body.session_id);
    if (!/^cs_(test|live)_/.test(sessionId)) {
      return json({ error: "Invalid session." }, 400);
    }

    const stripe = createStripeClient(env);
    const supabase = supabaseAdmin();

    // Already fulfilled by the webhook? Nothing to do.
    const { data: payment } = await supabase
      .from("payments")
      .select("*")
      .eq("stripe_session_id", sessionId)
      .maybeSingle();
    if (payment?.status === "paid") {
      const { data: team } = await supabase
        .from("teams")
        .select("invite_token")
        .eq("id", payment.team_id)
        .maybeSingle();
      return json({ status: "paid", invite_token: team?.invite_token ?? null });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!payment) {
      // Individual entries have no row until paid.
      if (!isSoloSession(session)) return json({ status: "unknown" });
      if (session.payment_status !== "paid") return json({ status: "pending" });
      const inviteToken = await fulfilSoloSession(supabase, session);
      return json({ status: "paid", invite_token: inviteToken });
    }
    if (session.payment_status !== "paid") return json({ status: "pending" });

    await supabase.from("payments").update({ status: "paid" }).eq("id", payment.id);

    const coveredIds: string[] = payment.covers_player_ids ?? [];
    if (coveredIds.length > 0) {
      await supabase
        .from("players")
        .update({ paid: true, stripe_session_id: sessionId })
        .in("id", coveredIds);
    }

    await recomputeTeamStatus(supabase, payment.team_id);
    return json({ status: "paid" });
  } catch (err) {
    console.error("confirm-payment error", err);
    return json({ error: "Could not confirm the payment. Please try again." }, 500);
  }
});
