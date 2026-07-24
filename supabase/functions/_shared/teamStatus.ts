/**
 * Swap'n'Serve Cup — registration state machine (Deno edge-function copy).
 *
 * This is an exact mirror of `src/lib/teamStatus.ts`, which is the source of
 * truth and carries the unit tests. Edge functions can't import from `src/`,
 * so the logic is duplicated here. Keep the two files in sync.
 */

/** Players required for a complete roster (captain + 6). */
export const ROSTER_SIZE = 7;
/** Price per player, in cents (€10). */
export const PRICE_PER_PLAYER_CENTS = 1000;
/** Full team entry fee, in cents (€70). */
export const TEAM_PRICE_CENTS = ROSTER_SIZE * PRICE_PER_PLAYER_CENTS;

export type TeamStatus = "draft" | "collecting" | "registered";

export interface PaymentInput {
  status: string;
  amount_cents: number;
}

export type PlayerInput = Record<string, unknown>;

export function isPaid(payment: PaymentInput): boolean {
  return payment.status === "paid";
}

export function paidTowardEntry(payments: readonly PaymentInput[]): number {
  const total = payments.filter(isPaid).reduce((sum, p) => sum + p.amount_cents, 0);
  return Math.min(total, TEAM_PRICE_CENTS);
}

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

export function remainingCents(payments: readonly PaymentInput[]): number {
  return Math.max(0, TEAM_PRICE_CENTS - paidTowardEntry(payments));
}

export function maxAdditionalChargeCents(payments: readonly PaymentInput[]): number {
  return remainingCents(payments);
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

export function formatEuros(cents: number): string {
  return `€${(cents / 100).toFixed(2)}`;
}
