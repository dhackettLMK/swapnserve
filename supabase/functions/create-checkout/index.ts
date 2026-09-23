// Swap'n'Serve Cup — create a Stripe Checkout session (embedded mode).
// Supports the whole €70 at once ("full") or a single player's €10 ("player"),
// including the mixed case. The overpay guard means a team can never be charged
// beyond €70: the amount is clamped to whatever is still outstanding.
//
// Runs on Lovable's built-in Stripe connection: API calls go through the
// connector gateway (see _shared/stripe.ts) and the checkout form is embedded
// on the site — we return a clientSecret, never a redirect URL.
import { json, preflight } from "../_shared/cors.ts";
import { supabaseAdmin } from "../_shared/supabaseAdmin.ts";
import { createStripeClient, type StripeEnv } from "../_shared/stripe.ts";
import {
  PRICE_PER_PLAYER_CENTS,
  remainingCents,
  type PaymentInput,
} from "../_shared/teamStatus.ts";

function clean(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return preflight();
  try {
    const body = await req.json().catch(() => ({}));
    const env: StripeEnv = body.environment === "live" ? "live" : "sandbox";
    const mode = clean(body.mode); // "full" | "player" | "shares"
    const shares = Math.max(1, Math.min(7, Math.floor(Number(body.shares) || 1)));
    const manageToken = clean(body.manage_token);
    const inviteToken = clean(body.invite_token);
    const playerId = clean(body.player_id);
    const returnUrl = clean(body.return_url) || `${Deno.env.get("SITE_URL") ?? ""}/cup`;

    const stripe = createStripeClient(env);
    const supabase = supabaseAdmin();

    // Authorise against the team via either token.
    let teamQuery = supabase.from("teams").select("id, name");
    teamQuery = manageToken
      ? teamQuery.eq("manage_token", manageToken)
      : teamQuery.eq("invite_token", inviteToken);
    const { data: team } = await teamQuery.maybeSingle();
    if (!team) return json({ error: "Team not found for that link." }, 404);

    const { data: paymentsData } = await supabase
      .from("payments")
      .select("status, amount_cents")
      .eq("team_id", team.id);
    const payments = (paymentsData ?? []) as PaymentInput[];
    const outstanding = remainingCents(payments);
    if (outstanding <= 0) return json({ error: "This team has already paid in full." }, 409);

    // Decide the amount and which players it covers.
    let amountCents: number;
    let coversPlayerIds: string[] = [];

    if (mode === "player") {
      if (!playerId) return json({ error: "Missing player." }, 400);
      const { data: player } = await supabase
        .from("players")
        .select("id, paid")
        .eq("id", playerId)
        .eq("team_id", team.id)
        .maybeSingle();
      if (!player) return json({ error: "Player not found on this team." }, 404);
      if (player.paid) return json({ error: "This player has already paid." }, 409);
      amountCents = Math.min(PRICE_PER_PLAYER_CENTS, outstanding);
      coversPlayerIds = [playerId];
    } else if (mode === "shares") {
      // Pay for a chosen number of players (1-7), clamped to what's outstanding.
      amountCents = Math.min(shares * PRICE_PER_PLAYER_CENTS, outstanding);
      const { data: unpaidPlayers } = await supabase
        .from("players")
        .select("id")
        .eq("team_id", team.id)
        .eq("paid", false)
        .order("created_at");
      coversPlayerIds = (unpaidPlayers ?? []).slice(0, shares).map((p) => p.id as string);
    } else {
      // "full" — pay everything still outstanding toward the €70.
      amountCents = outstanding;
      const { data: unpaidPlayers } = await supabase
        .from("players")
        .select("id")
        .eq("team_id", team.id)
        .eq("paid", false);
      coversPlayerIds = (unpaidPlayers ?? []).map((p) => p.id as string);
    }


    if (amountCents <= 0) return json({ error: "Nothing left to pay." }, 409);

    // Guard against double charges, enforced by the
    // payments_one_pending_per_target unique index (one open checkout per
    // team for full payments, one per player for individual payments).
    // Before creating a session, retire conflicting abandoned checkouts:
    // a full-team payment conflicts with every open checkout for the team;
    // a player payment conflicts with an open full checkout or another
    // checkout for the same player. Sessions that Stripe says are already
    // paid are left for the webhook / confirm-payment to fulfil.
    const { data: pendingRows } = await supabase
      .from("payments")
      .select("id, player_id, stripe_session_id")
      .eq("team_id", team.id)
      .eq("status", "pending");
    for (const row of pendingRows ?? []) {
      const conflicts = mode === "player"
        ? row.player_id === null || row.player_id === playerId
        : true;
      if (!conflicts) continue;
      try {
        const existing = await stripe.checkout.sessions.retrieve(
          row.stripe_session_id,
        );
        if (existing.payment_status === "paid") continue;
        if (existing.status === "open") {
          await stripe.checkout.sessions.expire(row.stripe_session_id);
        }
        await supabase.from("payments").delete().eq("id", row.id);
      } catch (err) {
        console.error("could not retire pending session", row.stripe_session_id, err);
      }
    }

    const productName =
      mode === "player"
        ? `Swap'n'Serve Cup — player entry (${team.name})`
        : `Swap'n'Serve Cup — team entry (${team.name})`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      ui_mode: "embedded_page",
      return_url: returnUrl,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: amountCents,
            product_data: { name: productName },
          },
        },
      ],
      // Surfaces as the product name in the payments dashboard.
      payment_intent_data: { description: productName },
      metadata: {
        team_id: team.id,
        covers_player_ids: JSON.stringify(coversPlayerIds),
      },
    });

    // Record a pending payment; the webhook flips it to "paid". The unique
    // index rejects a second concurrent checkout for this team — if that
    // happens, cancel the session we just made and tell the user to retry.
    const { error: insertError } = await supabase.from("payments").insert({
      team_id: team.id,
      player_id: mode === "player" ? playerId : null,
      stripe_session_id: session.id,
      amount_cents: amountCents,
      covers_player_ids: coversPlayerIds,
      status: "pending",
    });
    if (insertError) {
      console.error("pending payment insert failed", insertError);
      try {
        await stripe.checkout.sessions.expire(session.id);
      } catch {
        // best effort
      }
      return json(
        { error: "Another checkout for this team is already open. Please try again in a moment." },
        409,
      );
    }

    return json({ clientSecret: session.client_secret });
  } catch (err) {
    console.error("create-checkout error", err);
    return json({ error: "Could not start checkout. Please try again." }, 500);
  }
});
