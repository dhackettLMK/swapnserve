import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, Clock, Medal, Timer, Trophy, Users } from "lucide-react";
import CupLayout from "@/components/cup/CupLayout";
import wordmark from "@/assets/swapnserve-wordmark-cup.png";
import cupSpray from "@/assets/cup-spraypaint.png";

type Comp = "cup" | "plate";

type BracketMatch = {
  id: string;
  no: number;
  a: string;
  b: string;
  scoreA?: number;
  scoreB?: number;
};

const rise = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

const KEY_FACTS = [
  { icon: Users, label: "32 teams" },
  { icon: Trophy, label: "5-a-side" },
  { icon: Users, label: "2 subs per team" },
  { icon: Medal, label: "1 pitch" },
  { icon: Timer, label: "8-minute knockouts" },
  { icon: Clock, label: "2 games guaranteed" },
  { icon: Trophy, label: "Cup + Plate" },
];

/** Builds a 16-team bracket with example scores in the early rounds. */
function buildBracket(prefix: string, firstNo: number): BracketMatch[][] {
  const teams = Array.from({ length: 16 }, (_, i) => `Team ${i + 1}`);
  const rounds: BracketMatch[][] = [];
  let current = teams;
  let no = firstNo;
  let roundIndex = 0;

  while (current.length > 1) {
    const round: BracketMatch[] = [];
    const next: string[] = [];
    for (let i = 0; i < current.length; i += 2) {
      const a = current[i];
      const b = current[i + 1];
      const played = roundIndex < 2 && a !== "TBD" && b !== "TBD";
      const scoreA = played ? (i / 2 + roundIndex) % 3 + 1 : undefined;
      const scoreB = played ? (i / 2 + roundIndex) % 2 : undefined;
      round.push({ id: `${prefix}-${no}`, no, a, b, scoreA, scoreB });
      next.push(played ? ((scoreA ?? 0) > (scoreB ?? 0) ? a : b) : "TBD");
      no += 1;
    }
    rounds.push(round);
    current = next;
    roundIndex += 1;
  }
  return rounds;
}

const ROUND_NAMES = ["Round 2", "Quarter-finals", "Semi-finals", "Final"];

function MatchCard({
  match,
  comp,
  selected,
  onSelect,
}: {
  match: BracketMatch;
  comp: Comp;
  selected: boolean;
  onSelect: () => void;
}) {
  const decided = match.scoreA !== undefined && match.scoreB !== undefined;
  const aWins = decided && (match.scoreA ?? 0) > (match.scoreB ?? 0);
  const accentRing = comp === "cup" ? "ring-accent/60" : "ring-primary-foreground/50";

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-2xl border border-primary-foreground/15 bg-primary-foreground/[0.06] p-3 text-left backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-foreground/10 ${
        selected ? `ring-2 ${accentRing}` : ""
      }`}
    >
      <div className="mb-2 flex items-center justify-between font-cup-body text-[10px] uppercase tracking-[0.18em] text-primary-foreground/50">
        <span>Match {match.no}</span>
        <span className={decided ? "text-accent" : ""}>{decided ? "Full time" : "To be played"}</span>
      </div>
      <Row name={match.a} score={match.scoreA} winner={decided && aWins} />
      <div className="my-1 h-px bg-primary-foreground/10" />
      <Row name={match.b} score={match.scoreB} winner={decided && !aWins} />
    </button>
  );
}

function Row({ name, score, winner }: { name: string; score?: number; winner: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span
        className={`truncate font-cup-body text-sm ${
          winner ? "font-bold text-primary-foreground" : "text-primary-foreground/70"
        }`}
      >
        {name}
      </span>
      <span
        className={`min-w-6 rounded-md px-1.5 text-center font-cup-body text-sm font-bold ${
          winner ? "bg-accent text-accent-foreground" : "text-primary-foreground/50"
        }`}
      >
        {score ?? "-"}
      </span>
    </div>
  );
}

function Bracket({ comp }: { comp: Comp }) {
  const rounds = useMemo(
    () => buildBracket(comp, comp === "cup" ? 17 : 25),
    [comp],
  );
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 lg:gap-6">
      {rounds.map((round, i) => (
        <div key={i} className="min-w-[210px] flex-1 space-y-3">
          <p className="font-cup-display text-lg tracking-[0.12em] text-primary-foreground/80">
            {ROUND_NAMES[i]}
          </p>
          <div
            className="space-y-3"
            style={{ paddingTop: i > 0 ? `${i * 18}px` : undefined }}
          >
            {round.map((m) => (
              <MatchCard
                key={m.id}
                match={m}
                comp={comp}
                selected={selected === m.id}
                onSelect={() => setSelected(selected === m.id ? null : m.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function FlowNode({
  title,
  sub,
  tone = "neutral",
}: {
  title: string;
  sub?: string;
  tone?: "neutral" | "cup" | "plate";
}) {
  const tones = {
    neutral: "border-primary-foreground/20 bg-primary-foreground/[0.06]",
    cup: "border-accent/50 bg-accent/10",
    plate: "border-primary-foreground/30 bg-primary-foreground/[0.1]",
  } as const;
  return (
    <div className={`rounded-2xl border px-5 py-4 text-center ${tones[tone]}`}>
      <p className="font-cup-display text-2xl leading-none tracking-wide text-primary-foreground">
        {title}
      </p>
      {sub && (
        <p className="mt-1 font-cup-body text-xs uppercase tracking-[0.18em] text-primary-foreground/60">
          {sub}
        </p>
      )}
    </div>
  );
}

const Arrow = () => (
  <ArrowDown className="mx-auto my-2 text-accent/70" size={20} aria-hidden />
);

const CupFormat = () => {
  return (
    <CupLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <div className="cup-pitch-lines pointer-events-none absolute inset-0 opacity-30" aria-hidden />
        <div className="cup-floodlight pointer-events-none absolute inset-0" aria-hidden />
        <div className="container relative py-14 md:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <img
              src={wordmark}
              alt="Swap'n'Serve"
              className="cup-wordmark mx-auto w-full max-w-[420px]"
            />
            <img
              src={cupSpray}
              alt="Cup"
              className="mx-auto -mt-2 w-2/5 max-w-[190px] -rotate-2 drop-shadow-[0_0_22px_hsl(var(--accent)/0.35)]"
            />
            <h1 className="mt-6 font-cup-display text-5xl tracking-wide md:text-7xl">
              Tournament format
            </h1>
            <p className="mt-3 font-cup-body text-base text-primary-foreground/75 md:text-lg">
              Thirty-two teams. One pitch. Two trophies. Here is exactly how the day runs.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-2.5">
            {KEY_FACTS.map((fact, i) => (
              <motion.span
                key={fact.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i, duration: 0.45 }}
                className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/[0.07] px-4 py-2 font-cup-body text-sm"
              >
                <fact.icon size={15} className="text-accent" />
                {fact.label}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* Main visual flow */}
      <section className="bg-primary/95 py-14 text-primary-foreground md:py-20">
        <div className="container">
          <h2 className="text-center font-cup-display text-4xl tracking-wide md:text-5xl">
            The whole day at a glance
          </h2>

          <motion.div
            variants={rise}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="mx-auto mt-10 max-w-4xl"
          >
            <div className="mx-auto max-w-xs">
              <FlowNode title="32 teams" sub="Everyone starts here" />
              <Arrow />
              <FlowNode title="Round 1" sub="16 matches, 6 minutes" />
            </div>

            <div className="my-4 flex items-center justify-center gap-3 font-cup-body text-xs uppercase tracking-[0.2em] text-primary-foreground/60">
              <span className="h-px w-16 bg-primary-foreground/25" />
              Win or lose, you play again
              <span className="h-px w-16 bg-primary-foreground/25" />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <FlowNode title="16 winners" sub="Into the Cup" tone="cup" />
                <Arrow />
                <FlowNode title="Round 2" sub="8 matches, 6 minutes" />
                <Arrow />
                <FlowNode title="Cup knockout" sub="Quarters, semis, final" />
                <Arrow />
                <FlowNode title="Cup final" sub="10 minutes" tone="cup" />
              </div>
              <div>
                <FlowNode title="16 losing teams" sub="Into the Plate" tone="plate" />
                <Arrow />
                <FlowNode title="Round 2" sub="8 matches, 6 minutes" />
                <Arrow />
                <FlowNode title="Plate knockout" sub="Quarters, semis, final" />
                <Arrow />
                <FlowNode title="Plate final" sub="10 minutes" tone="plate" />
              </div>
            </div>
          </motion.div>

          <div className="mx-auto mt-12 max-w-2xl text-center">
            <p className="font-cup-display text-4xl tracking-wide text-accent md:text-6xl">
              No one goes home after one game.
            </p>
            <p className="mt-4 font-cup-body text-primary-foreground/75">
              Every team is guaranteed a minimum of two matches. Your first game decides whether you
              compete for the Cup or the Plate.
            </p>
          </div>
        </div>
      </section>

      {/* Stage 1 */}
      <section className="bg-background py-14 md:py-20">
        <div className="container">
          <p className="font-cup-body text-xs uppercase tracking-[0.22em] text-muted-foreground">
            Stage one
          </p>
          <h2 className="mt-2 font-cup-display text-4xl tracking-wide md:text-5xl">First round</h2>
          <p className="mt-3 max-w-xl font-cup-body text-muted-foreground">
            All 32 teams play one 6-minute match. Your first result determines which competition you
            enter. Losing does not put you out of the tournament.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {[
              {
                tone: "cup",
                title: "16 winners",
                head: "Advance to the Cup",
                copy: "Win your opening match and you are on the road to the Cup final.",
              },
              {
                tone: "plate",
                title: "16 losing teams",
                head: "Advance to the Plate",
                copy: "Lose your opening match and you move straight into the Plate competition.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                variants={rise}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`hover-lift rounded-3xl border p-7 ${
                  item.tone === "cup"
                    ? "border-accent/40 bg-accent/10"
                    : "border-primary/25 bg-primary/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.tone === "cup" ? (
                    <Trophy className="text-accent" />
                  ) : (
                    <Medal className="text-primary" />
                  )}
                  <p className="font-cup-display text-3xl tracking-wide">{item.title}</p>
                </div>
                <p className="mt-3 inline-flex items-center gap-2 font-cup-body font-semibold">
                  <ArrowRight size={16} /> {item.head}
                </p>
                <p className="mt-2 font-cup-body text-sm text-muted-foreground">{item.copy}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stage 2 */}
      <section className="bg-muted/40 py-14 md:py-20">
        <div className="container">
          <p className="font-cup-body text-xs uppercase tracking-[0.22em] text-muted-foreground">
            Stage two
          </p>
          <h2 className="mt-2 font-cup-display text-4xl tracking-wide md:text-5xl">Second round</h2>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {[
              {
                tone: "cup" as const,
                name: "Cup",
                copy: "Win your second game and advance towards the Cup knockout rounds.",
              },
              {
                tone: "plate" as const,
                name: "Plate",
                copy: "Teams who lost their opening match still have a chance to win the Plate.",
              },
            ].map((path) => (
              <div
                key={path.name}
                className="hover-lift rounded-3xl border border-border bg-card p-7 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  {path.tone === "cup" ? (
                    <Trophy className="text-accent" />
                  ) : (
                    <Medal className="text-primary" />
                  )}
                  <p className="font-cup-display text-3xl tracking-wide">{path.name}</p>
                </div>
                <div className="mt-5 space-y-2 font-cup-body">
                  {["16 teams", "8 matches, 6 minutes", "8 teams remain"].map((step, i) => (
                    <div key={step}>
                      <div
                        className={`rounded-xl px-4 py-3 text-center text-sm font-semibold ${
                          path.tone === "cup" ? "bg-accent/15" : "bg-primary/10"
                        }`}
                      >
                        {step}
                      </div>
                      {i < 2 && <ArrowDown size={16} className="mx-auto my-1 text-muted-foreground" />}
                    </div>
                  ))}
                </div>
                <p className="mt-5 font-cup-body text-sm text-muted-foreground">{path.copy}</p>
              </div>
            ))}
          </div>

          <p className="mt-10 text-center font-cup-display text-3xl tracking-wide text-primary md:text-4xl">
            Every team is guaranteed at least two matches.
          </p>
        </div>
      </section>

      {/* Stage 3 brackets */}
      <section className="bg-primary py-14 text-primary-foreground md:py-20">
        <div className="container">
          <p className="font-cup-body text-xs uppercase tracking-[0.22em] text-primary-foreground/60">
            Stage three
          </p>
          <h2 className="mt-2 font-cup-display text-4xl tracking-wide md:text-5xl">
            The knockout brackets
          </h2>
          <p className="mt-3 max-w-xl font-cup-body text-primary-foreground/70">
            Knockout matches are 8 minutes, with both finals played over 10 minutes. Tap any match to
            highlight it. Team names and scores below are examples until the draw is made.
          </p>

          <div className="mt-10 space-y-12">
            <div>
              <div className="mb-5 flex flex-wrap items-center gap-3">
                <Trophy className="text-accent" />
                <h3 className="font-cup-display text-3xl tracking-wide text-primary-foreground">
                  Cup bracket
                </h3>
                <span className="rounded-full border border-accent/50 bg-accent/15 px-3 py-1 font-cup-body text-xs uppercase tracking-[0.18em] text-accent">
                  16 teams to champions
                </span>
              </div>
              <Bracket comp="cup" />
            </div>

            <div>
              <div className="mb-5 flex flex-wrap items-center gap-3">
                <Medal className="text-primary-foreground" />
                <h3 className="font-cup-display text-3xl tracking-wide text-primary-foreground">
                  Plate bracket
                </h3>
                <span className="rounded-full border border-primary-foreground/30 bg-primary-foreground/10 px-3 py-1 font-cup-body text-xs uppercase tracking-[0.18em] text-primary-foreground/80">
                  A second trophy to win
                </span>
              </div>
              <Bracket comp="plate" />
            </div>
          </div>
        </div>
      </section>

      {/* Match lengths */}
      <section className="bg-background py-14 md:py-20">
        <div className="container">
          <h2 className="font-cup-display text-4xl tracking-wide md:text-5xl">Match lengths</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              {
                label: "Opening rounds",
                time: "6 minutes",
                copy: "Fast-paced games to determine your Cup or Plate pathway.",
              },
              {
                label: "Knockout rounds",
                time: "8 minutes",
                copy: "Every game matters. Win and advance.",
              },
              {
                label: "Finals",
                time: "10 minutes",
                copy: "Everything comes down to this.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                variants={rise}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="hover-lift rounded-3xl border border-border bg-card p-7 shadow-sm"
              >
                <Clock className="text-accent" />
                <p className="mt-4 font-cup-body text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {item.label}
                </p>
                <p className="font-cup-display text-5xl tracking-wide">{item.time}</p>
                <p className="mt-3 font-cup-body text-sm text-muted-foreground">{item.copy}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="bg-primary py-16 text-center text-primary-foreground md:py-24">
        <div className="container">
          <p className="mx-auto max-w-4xl font-cup-display text-4xl leading-tight tracking-wide md:text-6xl">
            32 teams. 2 guaranteed games. 2 trophies. 1 unforgettable day.
          </p>
          <Link
            to="/cup#register"
            className="cup-primary-cta mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 font-cup-body text-sm font-bold uppercase tracking-[0.14em] text-accent-foreground"
          >
            Register your team <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </CupLayout>
  );
};

export default CupFormat;
