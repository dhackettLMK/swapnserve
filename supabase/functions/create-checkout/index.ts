// Swap'n'Serve Cup — create a Stripe Checkout session.
// Supports the whole €70 at once ("full") or a single player's €10 ("player"),
// including the mixed case. The overpay guard means a team can never be charged
// beyond €70: the amount is clamped to whatever is still outstanding.
import Stripe from "https://esm.sh/stripe@16.6.0?target=deno";
import { json, preflight } from "../_shared/cors.ts";
import { supabaseAdmin } from "../_shared/supabaseAdmin.ts";
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
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) return json({ error: "Payments are not configured yet." }, 503);
    const siteUrl = Deno.env.get("SITE_URL") ?? "";

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2024-06-20",
      httpClient: Stripe.createFetchHttpClient(),
    });
    const supabase = supabaseAdmin();

    const body = await req.json().catch(() => ({}));
    const mode = clean(body.mode); // "full" | "player"
    const manageToken = clean(body.manage_token);
    const inviteToken = clean(body.invite_token);
    const playerId = clean(body.player_id);

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

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: amountCents,
            product_data: {
              name:
                mode === "player"
                  ? `Swap'n'Serve Cup — player entry (${team.name})`
                  : `Swap'n'Serve Cup — team entry (${team.name})`,
            },
          },
        },
      ],
      success_url: `${siteUrl}/cup?paid=1`,
      cancel_url: `${siteUrl}/cup?canceled=1`,
      metadata: {
        team_id: team.id,
        covers_player_ids: JSON.stringify(coversPlayerIds),
      },
    });

    // Record a pending payment; the webhook flips it to "paid".
    await supabase.from("payments").insert({
      team_id: team.id,
      player_id: mode === "player" ? playerId : null,
      stripe_session_id: session.id,
      amount_cents: amountCents,
      covers_player_ids: coversPlayerIds,
      status: "pending",
    });

    return json({ url: session.url, session_id: session.id });
  } catch (err) {
    console.error("create-checkout error", err);
    return json({ error: "Could not start checkout. Please try again." }, 500);
  }
});
