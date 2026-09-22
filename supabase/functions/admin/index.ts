// Swap'n'Serve Cup — organiser-only admin endpoint.
// Guarded by the ADMIN_TOKEN secret (sent as the `x-admin-token` header). No
// user accounts: the organiser types a passcode that must match the secret.
// Actions: list | generate-groups | generate-knockout | record-match | reset.
import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
import { json, preflight } from "../_shared/cors.ts";
import { supabaseAdmin } from "../_shared/supabaseAdmin.ts";
import { summariseTeam, type PaymentInput } from "../_shared/teamStatus.ts";
import {
  drawGroups,
  generateGroupFixtures,
  qualifiersFromGroups,
  buildBracket,
  recordKnockoutResult,
  championId,
  type Bracket,
  type MatchResult,
} from "../_shared/tournament.ts";

function clean(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

/** Keeps the `matches` rows for a knockout in sync with the engine's bracket. */
async function syncKnockoutMatches(
  supabase: SupabaseClient,
  tournamentId: string,
  bracket: Bracket,
): Promise<void> {
  const resolve = (slot: Bracket["rounds"][number][number]["slotA"]): string | null =>
    slot.kind === "team" ? slot.teamId : null;

  for (const round of bracket.rounds) {
    for (const m of round) {
      await supabase
        .from("matches")
        .upsert(
          {
            tournament_id: tournamentId,
            bracket_match_id: m.id,
            stage: "knockout",
            round: m.round,
            home_team_id: resolve(m.slotA),
            away_team_id: resolve(m.slotB),
          },
          { onConflict: "tournament_id,bracket_match_id", ignoreDuplicates: false },
        );
    }
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return preflight();

  const adminToken = Deno.env.get("ADMIN_TOKEN");
  if (!adminToken) return json({ error: "Admin is not configured." }, 503);
  if (req.headers.get("x-admin-token") !== adminToken) {
    return json({ error: "Not authorised." }, 401);
  }

  try {
    const supabase = supabaseAdmin();
    const body = await req.json().catch(() => ({}));
    const action = clean(body.action);

    // ---------------------------------------------------------------- list
    if (action === "list") {
      const { data: teams } = await supabase.from("teams").select("*").order("created_at");
      const { data: players } = await supabase.from("players").select("*");
      const { data: payments } = await supabase.from("payments").select("*");

      const rows = (teams ?? []).map((team) => {
        const teamPlayers = (players ?? []).filter((p) => p.team_id === team.id);
        const teamPayments = ((payments ?? []).filter(
          (p) => p.team_id === team.id,
        ) as PaymentInput[]);
        return { team, players: teamPlayers, summary: summariseTeam(team, teamPlayers, teamPayments) };
      });

      const totalCents = (payments ?? [])
        .filter((p) => p.status === "paid")
        .reduce((s, p) => s + (p.amount_cents as number), 0);

      const { data: tournament } = await supabase
        .from("tournament")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      // Sign-up mix: captains (team entries) versus individuals (solo entries),
      // broken down by the button each person came in through.
      const everyone = players ?? [];
      const captains = everyone.filter((p) => p.is_captain);
      const solos = everyone.filter((p) => p.is_solo);
      const bySource = new Map<string, { source: string; captains: number; individuals: number }>();
      const bump = (p: Record<string, unknown>, key: "captains" | "individuals") => {
        const source = (p.signup_source as string | null) || "direct";
        const row = bySource.get(source) ?? { source, captains: 0, individuals: 0 };
        row[key] += 1;
        bySource.set(source, row);
      };
      captains.forEach((p) => bump(p, "captains"));
      solos.forEach((p) => bump(p, "individuals"));

      return json({
        teams: rows,
        totals: {
          teamCount: rows.length,
          registeredCount: rows.filter((r) => r.summary.status === "registered").length,
          totalPaidCents: totalCents,
        },
        signups: {
          captains: captains.length,
          individuals: solos.length,
          teammates: everyone.length - captains.length - solos.length,
          sources: [...bySource.values()].sort(
            (a, b) => b.captains + b.individuals - (a.captains + a.individuals),
          ),
        },
        tournament,
      });
    }

    // ------------------------------------------------------ generate-groups
    if (action === "generate-groups") {
      const groupSize = Number(body.group_size) || 4;
      const qualifiersPerGroup = Number(body.qualifiers_per_group) || 2;
      const seed = Number(body.seed) || Math.floor(Math.random() * 1_000_000) + 1;

      const { data: registered } = await supabase
        .from("teams")
        .select("id")
        .eq("status", "registered");
      const teamIds = (registered ?? []).map((t) => t.id as string);
      if (teamIds.length < 2) {
        return json({ error: "Need at least 2 registered teams to draw groups." }, 409);
      }

      // Fresh tournament each time this is run.
      await supabase.from("tournament").delete().neq("id", "00000000-0000-0000-0000-000000000000");

      const { data: tournament } = await supabase
        .from("tournament")
        .insert({
          group_size: groupSize,
          qualifiers_per_group: qualifiersPerGroup,
          seed,
          status: "group_stage",
        })
        .select()
        .single();

      const groups = drawGroups(teamIds, { groupSize, seed });
      for (const g of groups) {
        const { data: groupRow } = await supabase
          .from("groups")
          .insert({ tournament_id: tournament.id, name: g.name })
          .select()
          .single();

        await supabase
          .from("group_teams")
          .insert(g.teamIds.map((teamId) => ({ group_id: groupRow.id, team_id: teamId })));

        const fixtures = generateGroupFixtures(g);
        if (fixtures.length > 0) {
          await supabase.from("matches").insert(
            fixtures.map((f) => ({
              tournament_id: tournament.id,
              stage: "group",
              group_id: groupRow.id,
              home_team_id: f.homeId,
              away_team_id: f.awayId,
            })),
          );
        }
      }

      return json({ ok: true, tournament_id: tournament.id, groups: groups.length });
    }

    // --------------------------------------------------- generate-knockout
    if (action === "generate-knockout") {
      const { data: tournament } = await supabase
        .from("tournament")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (!tournament) return json({ error: "No tournament yet. Draw the groups first." }, 409);

      const { data: groups } = await supabase
        .from("groups")
        .select("id, name")
        .eq("tournament_id", tournament.id)
        .order("name");
      const { data: groupTeams } = await supabase
        .from("group_teams")
        .select("group_id, team_id");
      const { data: groupMatches } = await supabase
        .from("matches")
        .select("group_id, home_team_id, away_team_id, home_goals, away_goals, played")
        .eq("tournament_id", tournament.id)
        .eq("stage", "group");

      const engineGroups = (groups ?? []).map((g) => ({
        name: g.name as string,
        teamIds: (groupTeams ?? [])
          .filter((gt) => gt.group_id === g.id)
          .map((gt) => gt.team_id as string),
      }));

      const resultsByGroup: Record<string, MatchResult[]> = {};
      for (const g of groups ?? []) {
        const gm = (groupMatches ?? []).filter(
          (m) => m.group_id === g.id && m.played && m.home_goals != null && m.away_goals != null,
        );
        resultsByGroup[g.name as string] = gm.map((m) => ({
          homeId: m.home_team_id as string,
          awayId: m.away_team_id as string,
          homeGoals: m.home_goals as number,
          awayGoals: m.away_goals as number,
        }));
      }

      const seeds = qualifiersFromGroups(
        engineGroups,
        resultsByGroup,
        tournament.qualifiers_per_group,
      );
      const bracket = buildBracket(seeds);

      await supabase
        .from("matches")
        .delete()
        .eq("tournament_id", tournament.id)
        .eq("stage", "knockout");
      await supabase
        .from("tournament")
        .update({ bracket, status: "knockout" })
        .eq("id", tournament.id);
      await syncKnockoutMatches(supabase, tournament.id, bracket);

      return json({ ok: true, qualifiers: seeds.length, rounds: bracket.rounds.length });
    }

    // -------------------------------------------------------- record-match
    if (action === "record-match") {
      const matchId = clean(body.match_id);
      const homeGoals = Number(body.home_goals);
      const awayGoals = Number(body.away_goals);
      if (!matchId || !Number.isInteger(homeGoals) || !Number.isInteger(awayGoals)) {
        return json({ error: "Provide a match and two whole-number scores." }, 400);
      }

      const { data: match } = await supabase
        .from("matches")
        .select("*")
        .eq("id", matchId)
        .maybeSingle();
      if (!match) return json({ error: "Match not found." }, 404);

      await supabase
        .from("matches")
        .update({ home_goals: homeGoals, away_goals: awayGoals, played: true })
        .eq("id", matchId);

      if (match.stage === "knockout") {
        if (homeGoals === awayGoals) {
          return json({ error: "Knockout matches can't end level — enter a winner." }, 400);
        }
        const winnerId = homeGoals > awayGoals ? match.home_team_id : match.away_team_id;
        const { data: tournament } = await supabase
          .from("tournament")
          .select("*")
          .eq("id", match.tournament_id)
          .maybeSingle();
        if (tournament?.bracket && match.bracket_match_id) {
          const updated = recordKnockoutResult(
            tournament.bracket as Bracket,
            match.bracket_match_id,
            winnerId as string,
          );
          const champion = championId(updated);
          await supabase
            .from("tournament")
            .update({ bracket: updated, status: champion ? "complete" : "knockout" })
            .eq("id", tournament.id);
          await syncKnockoutMatches(supabase, tournament.id, updated);
        }
      }

      return json({ ok: true });
    }

    // ----------------------------------------------------------- rename-team
    if (action === "rename-team") {
      const teamId = clean(body.team_id);
      const name = clean(body.name);
      if (!teamId || name.length < 2) {
        return json({ error: "Provide a team and a name of at least 2 characters." }, 400);
      }
      const { error } = await supabase.from("teams").update({ name }).eq("id", teamId);
      if (error) return json({ error: "Couldn't rename that team." }, 500);
      return json({ ok: true });
    }

    // ----------------------------------------------------------- delete-team
    if (action === "delete-team") {
      const teamId = clean(body.team_id);
      if (!teamId) return json({ error: "Provide a team to remove." }, 400);

      await supabase
        .from("matches")
        .delete()
        .or(`home_team_id.eq.${teamId},away_team_id.eq.${teamId}`);
      await supabase.from("group_teams").delete().eq("team_id", teamId);
      await supabase.from("payments").delete().eq("team_id", teamId);
      await supabase.from("players").delete().eq("team_id", teamId);
      const { error } = await supabase.from("teams").delete().eq("id", teamId);
      if (error) return json({ error: "Couldn't remove that team." }, 500);
      return json({ ok: true });
    }

    // --------------------------------------------------------------- reset
    if (action === "reset") {
      await supabase.from("tournament").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      return json({ ok: true });
    }

    return json({ error: "Unknown action." }, 400);
  } catch (err) {
    console.error("admin function error", err);
    return json({ error: "Something went wrong. Please try again." }, 500);
  }
});
