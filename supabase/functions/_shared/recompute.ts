import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
import {
  evaluateTeamStatus,
  paidTowardEntry,
  type PaymentInput,
  type TeamStatus,
} from "./teamStatus.ts";

/**
 * Reloads a team's players + payments, recomputes its status with the shared
 * state machine, and persists both the status and the capped amount_paid_cents.
 * Called after a player joins and after a Stripe payment clears, so the two
 * paths can never disagree about when a team is registered.
 */
export async function recomputeTeamStatus(
  supabase: SupabaseClient,
  teamId: string,
): Promise<{ status: TeamStatus; amountPaidCents: number }> {
  const [{ data: players }, { data: payments }] = await Promise.all([
    supabase.from("players").select("id").eq("team_id", teamId),
    supabase.from("payments").select("status, amount_cents").eq("team_id", teamId),
  ]);

  const paymentRows = (payments ?? []) as PaymentInput[];
  const status = evaluateTeamStatus({}, players ?? [], paymentRows);
  const amountPaidCents = paidTowardEntry(paymentRows);

  await supabase
    .from("teams")
    .update({ status, amount_paid_cents: amountPaidCents })
    .eq("id", teamId);

  return { status, amountPaidCents };
}
