// Swap'n'Serve Cup — shared frontend types + constants.
import type { StandingRow, Bracket } from "./tournament";
import type { TeamStatus, TeamSummary } from "./teamStatus";

export type { StandingRow, Bracket, TeamStatus, TeamSummary };

/** The six kit colours a team can wear, with swatch colours for the UI. */
export const KIT_COLOURS = [
  { name: "Blue", hex: "#2563eb" },
  { name: "Red", hex: "#dc2626" },
  { name: "Green", hex: "#16a34a" },
  { name: "Black", hex: "#111827" },
  { name: "White", hex: "#f9fafb" },
  { name: "Yellow", hex: "#eab308" },
] as const;

export type KitColour = (typeof KIT_COLOURS)[number]["name"];

export function kitHex(name: string): string {
  return KIT_COLOURS.find((k) => k.name === name)?.hex ?? "#94a3b8";
}

export interface Player {
  id: string;
  team_id: string;
  full_name: string;
  email: string;
  phone: string;
  is_captain: boolean;
  paid: boolean;
  amount_paid_cents: number;
  created_at: string;
}

export interface Payment {
  id: string;
  team_id: string;
  player_id: string | null;
  amount_cents: number;
  status: string;
  covers_player_ids: string[];
  created_at: string;
}

export interface ManageTeamResponse {
  team: {
    id: string;
    name: string;
    kit_colour: string;
    status: TeamStatus;
    captain_name: string;
    captain_email: string;
    invite_token: string;
  };
  players: Player[];
  payments: Payment[];
  summary: TeamSummary;
}

export interface PublicTeamResponse {
  team: { name: string; kit_colour: string; status: TeamStatus; is_pool?: boolean };
  rosterCount: number;
  rosterNeeded: number;
  rosterComplete: boolean;
  paidCents: number;
  outstandingCents: number;
  fullyPaid: boolean;
}

export interface CreateTeamResponse {
  team_id: string;
  invite_token: string;
  manage_token: string;
  /** The captain's player row, charged the €10 deposit straight after creation. */
  captain_player_id: string | null;
}

/** A solo player placed at random into a mixed "Free Agents" squad. */
export interface SoloJoinResponse {
  ok: true;
  player_id: string;
  invite_token: string;
  team_name: string;
  squad_size: number;
}

export interface AdminTeamRow {
  team: {
    id: string;
    name: string;
    kit_colour: string;
    status: TeamStatus;
    captain_name: string;
    captain_email: string;
    captain_phone: string;
    invite_token: string;
    manage_token: string;
  };
  players: Player[];
  summary: TeamSummary;
}

export interface AdminListResponse {
  teams: AdminTeamRow[];
  totals: { teamCount: number; registeredCount: number; totalPaidCents: number };
  tournament: TournamentRow | null;
}

export interface TournamentRow {
  id: string;
  name: string;
  status: "draft" | "group_stage" | "knockout" | "complete";
  group_size: number;
  qualifiers_per_group: number;
  seed: number;
  bracket: Bracket | null;
}

export interface CupMatch {
  id: string;
  stage: "group" | "knockout";
  group_id: string | null;
  bracket_match_id: string | null;
  round: number | null;
  home_team_id: string | null;
  away_team_id: string | null;
  home_goals: number | null;
  away_goals: number | null;
  played: boolean;
}

export interface TournamentPublicResponse {
  tournament: {
    name: string;
    status: TournamentRow["status"];
    group_size: number;
    qualifiers_per_group: number;
  } | null;
  teams: Record<string, { name: string; kit_colour: string }>;
  groups: Array<{ name: string; teamIds: string[]; standings: StandingRow[] }>;
  matches: CupMatch[];
  bracket: Bracket | null;
}
