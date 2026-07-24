import { Trophy } from "lucide-react";
import { KitDot } from "@/components/cup/CupUi";
import { championId, type Bracket, type Slot } from "@/lib/tournament";
import type { StandingRow } from "@/lib/cupTypes";

type TeamMap = Record<string, { name: string; kit_colour: string }>;

function TeamLabel({ teamId, teams }: { teamId: string | null; teams: TeamMap }) {
  if (!teamId) return <span className="text-muted-foreground">TBD</span>;
  const t = teams[teamId];
  if (!t) return <span className="text-muted-foreground">Unknown</span>;
  return (
    <span className="inline-flex items-center gap-2">
      <KitDot colour={t.kit_colour} /> {t.name}
    </span>
  );
}

/** One group's standings table. */
export function GroupStandings({
  name,
  standings,
  teams,
  qualifiersPerGroup,
}: {
  name: string;
  standings: StandingRow[];
  teams: TeamMap;
  qualifiersPerGroup: number;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <h3 className="mb-3 font-section text-lg font-bold">Group {name}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="py-1 pr-2 font-medium">#</th>
              <th className="py-1 pr-2 font-medium">Team</th>
              <th className="py-1 px-1 text-center font-medium" title="Played">P</th>
              <th className="py-1 px-1 text-center font-medium" title="Won">W</th>
              <th className="py-1 px-1 text-center font-medium" title="Drawn">D</th>
              <th className="py-1 px-1 text-center font-medium" title="Lost">L</th>
              <th className="py-1 px-1 text-center font-medium" title="Goal difference">GD</th>
              <th className="py-1 px-1 text-center font-semibold">Pts</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((row) => {
              const qualifies = row.rank <= qualifiersPerGroup;
              return (
                <tr
                  key={row.teamId}
                  className={`border-t border-border ${qualifies ? "bg-success/5" : ""}`}
                >
                  <td className="py-2 pr-2">
                    <span
                      className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-xs font-semibold ${
                        qualifies ? "bg-success text-success-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {row.rank}
                    </span>
                  </td>
                  <td className="py-2 pr-2">
                    <TeamLabel teamId={row.teamId} teams={teams} />
                  </td>
                  <td className="px-1 text-center">{row.played}</td>
                  <td className="px-1 text-center">{row.won}</td>
                  <td className="px-1 text-center">{row.drawn}</td>
                  <td className="px-1 text-center">{row.lost}</td>
                  <td className="px-1 text-center">
                    {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
                  </td>
                  <td className="px-1 text-center font-bold">{row.points}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function roundName(matchesInRound: number): string {
  if (matchesInRound === 1) return "Final";
  if (matchesInRound === 2) return "Semi-finals";
  if (matchesInRound === 4) return "Quarter-finals";
  return `Round of ${matchesInRound * 2}`;
}

function slotLabel(slot: Slot, teams: TeamMap) {
  if (slot.kind === "bye") return <span className="text-muted-foreground italic">Bye</span>;
  if (slot.kind === "winner") return <span className="text-muted-foreground">Winner {slot.matchId}</span>;
  return <TeamLabel teamId={slot.teamId} teams={teams} />;
}

/** The knockout bracket rendered as columns from first round to the final. */
export function BracketView({ bracket, teams }: { bracket: Bracket; teams: TeamMap }) {
  const champion = championId(bracket);
  if (bracket.rounds.length === 0) {
    return <p className="text-sm text-muted-foreground">The knockout bracket hasn't been drawn yet.</p>;
  }
  return (
    <div className="space-y-4">
      {champion && (
        <div className="flex items-center gap-2 rounded-xl border border-accent/40 bg-accent/10 p-4">
          <Trophy className="text-accent" />
          <span className="font-section font-bold">
            Champion: <TeamLabel teamId={champion} teams={teams} />
          </span>
        </div>
      )}
      <div className="flex gap-4 overflow-x-auto pb-2">
        {bracket.rounds.map((round, i) => (
          <div key={i} className="min-w-[220px] flex-1 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {roundName(round.length)}
            </p>
            {round.map((m) => (
              <div key={m.id} className="rounded-xl border border-border bg-card p-3 text-sm shadow-sm">
                <div
                  className={`flex items-center justify-between ${
                    m.winnerId && m.slotA.kind === "team" && m.winnerId === m.slotA.teamId
                      ? "font-bold"
                      : ""
                  }`}
                >
                  {slotLabel(m.slotA, teams)}
                </div>
                <div className="my-1 border-t border-dashed border-border" />
                <div
                  className={`flex items-center justify-between ${
                    m.winnerId && m.slotB.kind === "team" && m.winnerId === m.slotB.teamId
                      ? "font-bold"
                      : ""
                  }`}
                >
                  {slotLabel(m.slotB, teams)}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
