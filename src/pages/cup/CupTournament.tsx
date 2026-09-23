import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowDown, ChevronRight, Clock3, Loader2, Medal, Trophy, Users } from "lucide-react";
import CupLayout from "@/components/cup/CupLayout";
import { ConfigNotice, KitDot } from "@/components/cup/CupUi";
import { BracketView, GroupStandings } from "@/components/cup/TournamentView";
import wordmark from "@/assets/swapnserve-wordmark-cup.png";
import cupSpray from "@/assets/cup-spraypaint.png";
import { isSupabaseConfigured } from "@/lib/supabase";
import { cupApi } from "@/lib/cupApi";
import type { CupMatch, TournamentPublicResponse } from "@/lib/cupTypes";

type Pathway = "cup" | "plate";

const facts = [
  { icon: Users, value: "32", label: "teams" },
  { icon: Clock3, value: "2", label: "games guaranteed" },
  { icon: Trophy, value: "5-a-side", label: "2 rolling subs" },
];


function Fixtures({
  matches,
  teams,
}: {
  matches: CupMatch[];
  teams: Record<string, { name: string; kit_colour: string }>;
}) {
  const label = (id: string | null) => (id ? teams[id]?.name ?? "Unknown" : "TBD");
  return (
    <ul className="divide-y divide-border font-cup-body text-sm">
      {matches.map((match) => (
        <li key={match.id} className="grid grid-cols-[1fr_64px_1fr] items-center gap-2 py-3">
          <span className="truncate text-right">{label(match.home_team_id)}</span>
          <span className="text-center font-bold">
            {match.played ? `${match.home_goals} - ${match.away_goals}` : "v"}
          </span>
          <span className="truncate">{label(match.away_team_id)}</span>
        </li>
      ))}
    </ul>
  );
}

function OpeningMatch({ number, home, away }: { number: number; home: string; away: string }) {
  return (
    <div className="rounded-xl border border-primary-foreground/15 bg-primary-foreground/[0.07] p-3">
      <p className="mb-2 font-cup-body text-[10px] uppercase text-primary-foreground/50">
        Match {number} · 6 mins
      </p>
      <div className="flex items-center justify-between gap-2 font-cup-body text-sm">
        <span>{home}</span><span className="text-accent">v</span><span className="text-right">{away}</span>
      </div>
    </div>
  );
}

function PathBracket({ pathway }: { pathway: Pathway }) {
  const isCup = pathway === "cup";
  const firstMatch = isCup ? 17 : 25;
  const stages = [
    { title: "Round 2", matches: 8, minutes: "6 mins" },
    { title: "Quarter-finals", matches: 4, minutes: "8 mins" },
    { title: "Semi-finals", matches: 2, minutes: "8 mins" },
    { title: `${isCup ? "Cup" : "Plate"} final`, matches: 1, minutes: "10 mins" },
  ];

  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <div className={`flex h-11 w-11 items-center justify-center rounded-full ${isCup ? "bg-accent text-accent-foreground" : "bg-primary-foreground/10 text-primary-foreground"}`}>
          {isCup ? <Trophy size={22} /> : <Medal size={22} />}
        </div>
        <div>
          <h3 className="font-cup-display text-3xl text-primary-foreground">{isCup ? "Cup" : "Plate"} pathway</h3>
          <p className="font-cup-body text-xs uppercase text-primary-foreground/55">16 teams · one trophy</p>
        </div>
      </div>

      <div className="overflow-x-auto pb-4 [scrollbar-color:hsl(var(--accent))_transparent]">
        <div className="grid min-w-[930px] grid-cols-4 gap-5">
          {stages.map((stage, stageIndex) => {
            const shownMatches = stage.matches;
            return (
              <div key={stage.title} className="relative">
                <div className="mb-3 flex items-end justify-between gap-2">
                  <p className="font-cup-display text-xl text-primary-foreground">{stage.title}</p>
                  <p className="font-cup-body text-[10px] uppercase text-primary-foreground/45">{stage.minutes}</p>
                </div>
                <div className={`flex min-h-[700px] flex-col justify-around gap-3 ${stageIndex > 0 ? "py-5" : ""}`}>
                  {Array.from({ length: shownMatches }, (_, matchIndex) => {
                    const home = stageIndex === 0
                      ? isCup
                        ? `Winner Match ${matchIndex * 2 + 1}`
                        : `Loser Match ${matchIndex * 2 + 1}`
                      : `Winner ${firstMatch + matchIndex * 2}`;
                    const away = stageIndex === 0
                      ? isCup
                        ? `Winner Match ${matchIndex * 2 + 2}`
                        : `Loser Match ${matchIndex * 2 + 2}`
                      : `Winner ${firstMatch + matchIndex * 2 + 1}`;
                    return (
                      <div key={`${stage.title}-${matchIndex}`} className="relative rounded-xl border border-primary-foreground/15 bg-primary-foreground/[0.07] p-3 font-cup-body text-sm">
                        <p className="mb-2 text-[10px] uppercase text-primary-foreground/45">Match {firstMatch + matchIndex}</p>
                        <p className="truncate border-b border-primary-foreground/10 pb-1.5 text-primary-foreground/80">{home}</p>
                        <p className="truncate pt-1.5 text-primary-foreground/80">{away}</p>
                        {stageIndex < stages.length - 1 && <ChevronRight className="absolute -right-[19px] top-1/2 -translate-y-1/2 text-accent/70" size={18} />}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <p className="mt-1 font-cup-body text-xs text-primary-foreground/50 md:hidden">Swipe across to follow the bracket</p>
    </div>
  );
}

function TournamentOverview() {
  return (
    <>
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <div className="cup-pitch-lines pointer-events-none absolute inset-0 opacity-25" aria-hidden />
        <div className="cup-floodlight pointer-events-none absolute inset-0" aria-hidden />
        <div className="container relative py-12 text-center md:py-16">
          <img src={wordmark} alt="Swap'n'Serve" className="cup-wordmark mx-auto w-full max-w-[390px]" />
          <img src={cupSpray} alt="Cup" className="mx-auto -mt-2 w-32 -rotate-2 drop-shadow-[0_0_22px_hsl(var(--accent)/0.35)] md:w-40" />
          <p className="mt-5 font-cup-body text-xs uppercase text-accent">Tournament structure</p>
          <h1 className="mt-2 font-cup-display text-5xl leading-none md:text-7xl">The road to the finals</h1>
          <p className="mx-auto mt-4 max-w-xl font-cup-body text-primary-foreground/70">
            Every team plays twice. Your opening result decides whether you chase the Cup or the Plate.
          </p>
          <div className="mx-auto mt-8 grid max-w-2xl grid-cols-3 gap-2 md:gap-4">
            {facts.map((fact, index) => (
              <motion.div key={fact.label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }} className="rounded-2xl border border-primary-foreground/15 bg-primary-foreground/[0.07] px-2 py-4 backdrop-blur-sm">
                <fact.icon className="mx-auto mb-2 text-accent" size={19} />
                <p className="font-cup-display text-2xl leading-none md:text-3xl">{fact.value}</p>
                <p className="mt-1 font-cup-body text-[10px] uppercase text-primary-foreground/55 md:text-xs">{fact.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-12 md:py-16">
        <div className="container">
          <div className="text-center">
            <p className="font-cup-body text-xs uppercase text-muted-foreground">Opening round</p>
            <h2 className="mt-2 font-cup-display text-4xl md:text-5xl">32 teams · 16 matches</h2>
            <p className="mx-auto mt-3 max-w-xl font-cup-body text-muted-foreground">Six minutes decides your pathway. Losing does not eliminate you.</p>
          </div>

          <div className="mx-auto mt-9 grid max-w-4xl gap-3 rounded-3xl bg-primary p-4 text-primary-foreground sm:grid-cols-2 md:p-6 lg:grid-cols-4">
            {placeholderTeams.slice(0, 16).map((team, index) => (
              <OpeningMatch key={team} number={index + 1} home={`Team ${index * 2 + 1}`} away={`Team ${index * 2 + 2}`} />
            ))}
          </div>

          <div className="mx-auto mt-5 max-w-4xl">
            <ArrowDown className="mx-auto text-primary" />
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-accent/50 bg-accent/10 p-6 text-center">
                <Trophy className="mx-auto text-accent" />
                <p className="mt-2 font-cup-display text-3xl">16 winners enter the Cup</p>
              </div>
              <div className="rounded-2xl border border-primary/25 bg-primary/5 p-6 text-center">
                <Medal className="mx-auto text-primary" />
                <p className="mt-2 font-cup-display text-3xl">16 losing teams enter the Plate</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-primary py-12 text-primary-foreground md:py-16">
        <div className="container">
          <div className="mb-10 text-center">
            <p className="font-cup-body text-xs uppercase text-accent">The brackets</p>
            <h2 className="mt-2 font-cup-display text-4xl md:text-5xl">Two competitions. Two finals.</h2>
          </div>
          <div className="space-y-14">
            <PathBracket pathway="cup" />
            <div className="h-px bg-primary-foreground/15" />
            <PathBracket pathway="plate" />
          </div>
          <p className="mt-12 text-center font-cup-display text-4xl text-accent md:text-6xl">No one goes home after one game.</p>
        </div>
      </section>
    </>
  );
}

function LiveTournament({ data }: { data: TournamentPublicResponse }) {
  if (!data.tournament) return null;
  const qualifiersPerGroup = data.tournament.qualifiers_per_group;

  return (
    <section className="bg-muted/40 py-12 md:py-16">
      <div className="container">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-cup-body text-xs uppercase text-primary">Live tournament</p>
            <h2 className="mt-1 font-cup-display text-4xl md:text-5xl">Results and standings</h2>
          </div>
          <span className="rounded-full bg-success/10 px-4 py-2 font-cup-body text-xs font-semibold uppercase text-success">Live updates</span>
        </div>

        {data.groups.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2">
            {data.groups.map((group) => (
              <div key={group.name} className="space-y-3">
                <GroupStandings name={group.name} standings={group.standings} teams={data.teams} qualifiersPerGroup={qualifiersPerGroup} />
                <details className="rounded-xl border border-border bg-card p-4">
                  <summary className="cursor-pointer font-cup-body text-sm font-semibold">Group {group.name} fixtures</summary>
                  <div className="mt-2">
                    <Fixtures matches={data.matches.filter((match) => match.stage === "group" && group.teamIds.includes(match.home_team_id ?? ""))} teams={data.teams} />
                  </div>
                </details>
              </div>
            ))}
          </div>
        )}

        {data.bracket && data.bracket.rounds.length > 0 && (
          <div className="mt-12">
            <h3 className="mb-5 font-cup-display text-3xl">Live knockout bracket</h3>
            <BracketView bracket={data.bracket} teams={data.teams} />
          </div>
        )}

        {data.groups.length === 0 && (
          <div className="flex flex-wrap gap-2">
            {Object.entries(data.teams).map(([id, team]) => (
              <span key={id} className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 font-cup-body text-sm">
                <KitDot colour={team.kit_colour} /> {team.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

const CupTournament = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["cup-tournament"],
    queryFn: () => cupApi.tournament(),
    enabled: isSupabaseConfigured,
  });

  if (!isSupabaseConfigured) {
    return <CupLayout><ConfigNotice /></CupLayout>;
  }

  return (
    <CupLayout>
      <TournamentOverview />
      {isLoading && <div className="flex justify-center bg-muted/40 py-14"><Loader2 className="animate-spin text-primary" aria-label="Loading live tournament" /></div>}
      {data?.tournament ? <LiveTournament data={data} /> : (
        !isLoading && (
          <section className="bg-muted/40 py-12 text-center">
            <div className="container">
              <p className="font-cup-display text-3xl">The live draw will appear here</p>
              <p className="mt-2 font-cup-body text-sm text-muted-foreground">Team names, match scores and winners will update once the tournament begins.</p>
            </div>
          </section>
        )
      )}
    </CupLayout>
  );
};

export default CupTournament;