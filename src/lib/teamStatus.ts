/**
 * Swap'n'Serve Cup — registration state machine.
 *
 * A single pure function decides whether a team is `draft`, `collecting`, or
 * `registered`. It is called from both the join flow and the Stripe webhook, so
 * the two can never disagree about when a team becomes eligible for the draw.
 *
 * NOTE: The Deno edge functions can't import from `src/`, so an identical copy
 * lives at `supabase/functions/_shared/teamStatus.ts`. Keep the two in sync —
 * this file is the source of truth and the tested one.
 */

/** Players required for a complete roster (captain + 6). */
export const ROSTER_SIZE = 7;
/** Price per player, in cents (€10). */
export const PRICE_PER_PLAYER_CENTS = 1000;
/** Full team entry fee, in cents (€70). */
export const TEAM_PRICE_CENTS = ROSTER_SIZE * PRICE_PER_PLAYER_CENTS;

export type TeamStatus = "draft" | "collecting" | "registered";

/** Only the fields the state machine needs from a payment row. */
export interface PaymentInput {
  /** A payment counts toward the total only when it has cleared ("paid"). */
  status: string;
  amount_cents: number;
}

/** Only the fields the state machine needs from a player row. */
export type PlayerInput = Record<string, unknown>;

/** A payment counts toward the €70 once Stripe has confirmed it. */
export function isPaid(payment: PaymentInput): boolean {
  return payment.status === "paid";
}

/**
 * Total cleared payments toward the entry fee, in cents, capped at the team
 * price so an accidental overpay can never push a team "past" registered or
 * distort the outstanding amount.
 */
export function paidTowardEntry(payments: readonly PaymentInput[]): number {
  const total = payments.filter(isPaid).reduce((sum, p) => sum + p.amount_cents, 0);
  return Math.min(total, TEAM_PRICE_CENTS);
}

/**
 * The team's registration status.
 *
 * - `registered` — full roster of 7 AND the €70 is fully paid. On this
 *   transition the team is auto-eligible to be seeded into the Cup.
 * - `draft` — freshly created: only the captain, nothing paid yet.
 * - `collecting` — anything in between (players joining and/or money coming in).
 */
export function evaluateTeamStatus(
  _team: unknown,
  players: readonly PlayerInput[],
  payments: readonly PaymentInput[],
): TeamStatus {
  const rosterCount = Math.min(players.length, ROSTER_SIZE);
  const paidCents = paidTowardEntry(payments);

  if (rosterCount >= ROSTER_SIZE && paidCents >= TEAM_PRICE_CENTS) return "registered";
  if (rosterCount <= 1 && paidCents === 0) return "draft";
  return "collecting";
}

export interface TeamSummary {
  status: TeamStatus;
  rosterCount: number;
  rosterNeeded: number;
  rosterComplete: boolean;
  paidCents: number;
  outstandingCents: number;
  fullyPaid: boolean;
}

/** A UI-friendly rollup of roster + payment progress alongside the status. */
export function summariseTeam(
  team: unknown,
  players: readonly PlayerInput[],
  payments: readonly PaymentInput[],
): TeamSummary {
  const rosterCount = Math.min(players.length, ROSTER_SIZE);
  const paidCents = paidTowardEntry(payments);
  return {
    status: evaluateTeamStatus(team, players, payments),
    rosterCount,
    rosterNeeded: Math.max(0, ROSTER_SIZE - rosterCount),
    rosterComplete: rosterCount >= ROSTER_SIZE,
    paidCents,
    outstandingCents: Math.max(0, TEAM_PRICE_CENTS - paidCents),
    fullyPaid: paidCents >= TEAM_PRICE_CENTS,
  };
}

/** Cents still owed toward the €70 given what has already cleared. Never negative. */
export function remainingCents(payments: readonly PaymentInput[]): number {
  return Math.max(0, TEAM_PRICE_CENTS - paidTowardEntry(payments));
}

/**
 * Overpay guard: the largest additional charge (in cents) that may be accepted
 * without exceeding €70. Returns 0 once the fee is fully covered. The checkout
 * function uses this to reject charges that would push a team over the total.
 */
export function maxAdditionalChargeCents(payments: readonly PaymentInput[]): number {
  return remainingCents(payments);
}

/** €X.YZ formatting for a cents amount, e.g. 7000 → "€70.00". */
export function formatEuros(cents: number): string {
  return `€${(cents / 100).toFixed(2)}`;
}
