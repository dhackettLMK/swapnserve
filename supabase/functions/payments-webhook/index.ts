// Swap'n'Serve Cup — payments webhook (Lovable built-in Stripe).
// Registered by the payments integration for both environments; the ?env=
// query parameter selects the right signing secret. On a completed checkout
// session we mark the matching payment (and the players it covers) as paid,
// then re-evaluate the team's status with the shared state machine.
import { supabaseAdmin } from "../_shared/supabaseAdmin.ts";
import { verifyWebhook, type StripeEnv } from "../_shared/stripe.ts";
import { recomputeTeamStatus } from "../_shared/recompute.ts";
import { fulfilEntrySession, isEntrySession } from "../_shared/solo.ts";

async function fulfilSession(session: { id: string; amount_total?: number | null; metadata?: Record<string, string> | null }) {
  const supabase = supabaseAdmin();

  if (isEntrySession(session)) {
    await fulfilEntrySession(supabase, session);
    return;
  }

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

async function failSession(session: { id: string }) {
  const supabase = supabaseAdmin();
  await supabase
    .from("payments")
    .update({ status: "failed" })
    .eq("stripe_session_id", session.id)
    .eq("status", "pending");
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }
  const rawEnv = new URL(req.url).searchParams.get("env");
  if (rawEnv !== "sandbox" && rawEnv !== "live") {
    return new Response(JSON.stringify({ received: true, ignored: "invalid env" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
  const env: StripeEnv = rawEnv;

  try {
    const event = await verifyWebhook(req, env);

    switch (event.type) {
      case "checkout.session.completed": {
        // Delayed-notification methods fire this before settlement — only
        // fulfil when the payment is final.
        const session = event.data.object;
        if (session.payment_status !== "unpaid") {
          await fulfilSession(session);
        }
        break;
      }
      case "checkout.session.async_payment_succeeded":
        await fulfilSession(event.data.object);
        break;
      case "checkout.session.async_payment_failed":
        await failSession(event.data.object);
        break;
      default:
        console.log("Unhandled event:", event.type);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("payments-webhook error", err);
    return new Response("Webhook error", { status: 400 });
  }
});
