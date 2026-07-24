// Swap'n'Serve Cup — public tournament read.
// Unauthenticated, but only ever returns public-safe fields (team name + kit
// colour, fixtures, standings, bracket) — never emails or phone numbers.
import { json, preflight } from "../_shared/cors.ts";
import { supabaseAdmin } from "../_shared/supabaseAdmin.ts";
import { computeStandings, type MatchResult } from "../_shared/tournament.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return preflight();
  try {
    const supabase = supabaseAdmin();

    const { data: tournament } = await supabase
      .from("tournament")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!tournament) return json({ tournament: null });

    const [{ data: groups }, { data: groupTeams }, { data: matches }, { data: teams }] =
      await Promise.all([
        supabase.from("groups").select("id, name").eq("tournament_id", tournament.id).order("name"),
        supabase.from("group_teams").select("group_id, team_id"),
        supabase.from("matches").select("*").eq("tournament_id", tournament.id),
        supabase.from("teams").select("id, name, kit_colour"),
      ]);

    const teamMap: Record<string, { name: string; kit_colour: string }> = {};
    for (const t of teams ?? []) {
      teamMap[t.id as string] = { name: t.name as string, kit_colour: t.kit_colour as string };
    }

    const groupData = (groups ?? []).map((g) => {
      const teamIds = (groupTeams ?? [])
        .filter((gt) => gt.group_id === g.id)
        .map((gt) => gt.team_id as string);
      const results: MatchResult[] = (matches ?? [])
        .filter(
          (m) =>
            m.group_id === g.id && m.played && m.home_goals != null && m.away_goals != null,
        )
        .map((m) => ({
          homeId: m.home_team_id as string,
          awayId: m.away_team_id as string,
          homeGoals: m.home_goals as number,
          awayGoals: m.away_goals as number,
        }));
      return { name: g.name, teamIds, standings: computeStandings(teamIds, results) };
    });

    const publicMatches = (matches ?? []).map((m) => ({
      id: m.id,
      stage: m.stage,
      group_id: m.group_id,
      bracket_match_id: m.bracket_match_id,
      round: m.round,
      home_team_id: m.home_team_id,
      away_team_id: m.away_team_id,
      home_goals: m.home_goals,
      away_goals: m.away_goals,
      played: m.played,
    }));

    return json({
      tournament: {
        name: tournament.name,
        status: tournament.status,
        group_size: tournament.group_size,
        qualifiers_per_group: tournament.qualifiers_per_group,
      },
      teams: teamMap,
      groups: groupData,
      matches: publicMatches,
      bracket: tournament.bracket ?? null,
    });
  } catch (err) {
    console.error("tournament function error", err);
    return json({ error: "Could not load the tournament." }, 500);
  }
});
