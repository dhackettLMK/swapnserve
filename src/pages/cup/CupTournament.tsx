import { useQuery } from "@tanstack/react-query";
import { Loader2, Trophy } from "lucide-react";
import CupLayout from "@/components/cup/CupLayout";
import { ConfigNotice, KitDot } from "@/components/cup/CupUi";
import { GroupStandings, BracketView } from "@/components/cup/TournamentView";
import { isSupabaseConfigured } from "@/lib/supabase";
import { cupApi } from "@/lib/cupApi";
import type { CupMatch } from "@/lib/cupTypes";

function Fixtures({
  matches,
  teams,
}: {
  matches: CupMatch[];
  teams: Record<string, { name: string; kit_colour: string }>;
}) {
  const label = (id: string | null) => (id ? teams[id]?.name ?? "Unknown" : "TBD");
  return (
    <ul className="divide-y divide-border text-sm">
      {matches.map((m) => (
        <li key={m.id} className="flex items-center justify-between gap-2 py-2">
          <span className="flex-1 text-right">{label(m.home_team_id)}</span>
          <span className="min-w-[56px] text-center font-mono font-semibold">
            {m.played ? `${m.home_goals} – ${m.away_goals}` : "v"}
          </span>
          <span className="flex-1">{label(m.away_team_id)}</span>
        </li>
      ))}
    </ul>
  );
}

const CupTournament = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["cup-tournament"],
    queryFn: () => cupApi.tournament(),
    enabled: isSupabaseConfigured,
  });

  if (!isSupabaseConfigured) {
    return (
      <CupLayout>
        <ConfigNotice />
      </CupLayout>
    );
  }

  return (
    <CupLayout>
      <div className="container py-10 md:py-14">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/15 border border-accent/30">
            <Trophy className="text-accent" />
          </div>
          <h1 className="text-3xl font-display font-bold">Swap'n'Serve Cup</h1>
          <p className="text-muted-foreground">Live groups, standings and the road to the final.</p>
        </div>

        {isLoading && (
          <div className="flex justify-center py-16">
            <Loader2 className="animate-spin text-muted-foreground" />
          </div>
        )}

        {(isError || (data && !data.tournament)) && (
          <div className="mx-auto max-w-lg rounded-2xl border border-border bg-muted/40 p-6 text-center text-sm text-muted-foreground">
            The draw hasn't been made yet. Once teams are registered and the organiser generates the
            tournament, groups and fixtures will appear here.
          </div>
        )}

        {data && data.tournament && (
          <div className="space-y-10">
            {/* Groups */}
            {data.groups.length > 0 && (
              <section>
                <h2 className="mb-4 font-section text-2xl font-bold">Group stage</h2>
                <div className="grid gap-6 md:grid-cols-2">
                  {data.groups.map((g) => (
                    <div key={g.name} className="space-y-3">
                      <GroupStandings
                        name={g.name}
                        standings={g.standings}
                        teams={data.teams}
                        qualifiersPerGroup={data.tournament!.qualifiers_per_group}
                      />
                      <details className="rounded-xl border border-border bg-card p-4">
                        <summary className="cursor-pointer text-sm font-medium">
                          Group {g.name} fixtures
                        </summary>
                        <div className="mt-2">
                          <Fixtures
                            matches={data.matches.filter(
                              (m) => m.stage === "group" && g.teamIds.includes(m.home_team_id ?? ""),
                            )}
                            teams={data.teams}
                          />
                        </div>
                      </details>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Knockout */}
            {data.bracket && data.bracket.rounds.length > 0 && (
              <section>
                <h2 className="mb-4 font-section text-2xl font-bold">Knockout stage</h2>
                <BracketView bracket={data.bracket} teams={data.teams} />
              </section>
            )}

            {/* Registered teams (when no draw yet) */}
            {data.groups.length === 0 && (
              <section>
                <h2 className="mb-4 font-section text-2xl font-bold">Teams</h2>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(data.teams).map(([id, t]) => (
                    <span
                      key={id}
                      className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm"
                    >
                      <KitDot colour={t.kit_colour} /> {t.name}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </CupLayout>
  );
};

export default CupTournament;
