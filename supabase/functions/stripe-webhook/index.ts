// Swap'n'Serve Cup — Stripe webhook.
// Receives `checkout.session.completed`, marks the matching payment (and the
// players it covers) as paid, then re-evaluates the team's status with the same
// shared state machine the join flow uses. Must be deployed with JWT
// verification OFF (see supabase/config.toml) — Stripe signs it instead.
import Stripe from "https://esm.sh/stripe@16.6.0?target=deno";
import { supabaseAdmin } from "../_shared/supabaseAdmin.ts";
import { recomputeTeamStatus } from "../_shared/recompute.ts";

Deno.serve(async (req) => {
  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!stripeKey || !webhookSecret) {
    return new Response("Stripe not configured", { status: 503 });
  }

  const stripe = new Stripe(stripeKey, {
    apiVersion: "2024-06-20",
    httpClient: Stripe.createFetchHttpClient(),
  });

  const signature = req.headers.get("stripe-signature");
  if (!signature) return new Response("Missing signature", { status: 400 });

  const rawBody = await req.text();
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed", err);
    return new Response("Invalid signature", { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const supabase = supabaseAdmin();

      // Look the payment up by session id (recorded when checkout started).
      const { data: payment } = await supabase
        .from("payments")
        .select("*")
        .eq("stripe_session_id", session.id)
        .maybeSingle();

      if (payment && payment.status !== "paid") {
        await supabase.from("payments").update({ status: "paid" }).eq("id", payment.id);

        // Mark the covered players as paid.
        const coveredIds: string[] = payment.covers_player_ids ?? [];
        if (coveredIds.length > 0) {
          await supabase
            .from("players")
            .update({ paid: true, stripe_session_id: session.id })
            .in("id", coveredIds);
        }

        // Re-evaluate — this is what flips a team to "registered".
        await recomputeTeamStatus(supabase, payment.team_id);
      }
    }
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("stripe-webhook handling error", err);
    return new Response("Handler error", { status: 500 });
  }
});
