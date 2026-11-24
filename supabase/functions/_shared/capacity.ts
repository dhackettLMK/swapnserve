// Swap'n'Serve Cup capacity: 32 team places, free-agent squads included.
import type { SupabaseClient } from "npm:@supabase/supabase-js@2";

export const MAX_TEAMS = 32;

export interface CupCapacity {
  teams: number;
  /** No new team can be created. */
  teams_full: boolean;
  /** No new free agent can be placed (no squad with space and no place for a new squad). */
  free_agents_full: boolean;
}

export function evaluateCapacity(teamCount: number, poolSquadSizes: number[]): CupCapacity {
  const teamsFull = teamCount >= MAX_TEAMS;
  const squadHasSpace = poolSquadSizes.some((n) => n < 7);
  return { teams: teamCount, teams_full: teamsFull, free_agents_full: teamsFull && !squadHasSpace };
}

export async function getCapacity(supabase: SupabaseClient): Promise<CupCapacity> {
  const { data: teams } = await supabase.from("teams").select("id, is_pool");
  const all = teams ?? [];
  const poolIds = all.filter((t) => t.is_pool).map((t) => t.id);
  const sizes = new Map<string, number>(poolIds.map((id) => [id, 0]));
  if (poolIds.length) {
    const { data: players } = await supabase.from("players").select("team_id").in("team_id", poolIds);
    for (const p of players ?? []) sizes.set(p.team_id, (sizes.get(p.team_id) ?? 0) + 1);
  }
  return evaluateCapacity(all.length, [...sizes.values()]);
}
