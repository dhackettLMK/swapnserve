import { evaluateTeamStatus, type PaymentInput } from "./teamStatus.ts";

interface DrawTeam {
  id: string;
  status: string;
}

interface TeamPayment extends PaymentInput {
  team_id: string;
}

/** Draw eligibility follows the dashboard's payment rule, not cached status. */
export function registeredTeamIds(
  teams: readonly DrawTeam[],
  payments: readonly TeamPayment[],
): string[] {
  const byTeam = new Map<string, TeamPayment[]>();
  for (const payment of payments) {
    const rows = byTeam.get(payment.team_id) ?? [];
    rows.push(payment);
    byTeam.set(payment.team_id, rows);
  }
  return teams
    .filter((team) => evaluateTeamStatus(team, [], byTeam.get(team.id) ?? []) === "registered")
    .map((team) => team.id);
}