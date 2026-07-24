/**
 * Swap'n'Serve Cup — tournament engine.
 *
 * A pure, dependency-free module (no React, no DB). Everything here is a plain
 * function over plain data so it can be unit-tested exhaustively and reused by
 * the admin UI, the public tournament page, and any edge function.
 *
 * Flow: {@link drawGroups} → play group fixtures → {@link computeStandings} →
 * {@link qualifiersFromGroups} → {@link buildBracket} → {@link recordKnockoutResult}.
 */

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export interface Group {
  /** "A", "B", "C", … */
  name: string;
  teamIds: string[];
}

/** A finished (or in-progress) match with a score. */
export interface MatchResult {
  homeId: string;
  awayId: string;
  homeGoals: number;
  awayGoals: number;
}

export interface StandingRow {
  teamId: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  /** 1-based position after all tiebreakers are applied. */
  rank: number;
}

/** A single knockout slot: a concrete team, an empty bye, or the winner of an earlier match. */
export type Slot =
  | { kind: "team"; teamId: string }
  | { kind: "bye" }
  | { kind: "winner"; matchId: string };

export interface BracketMatch {
  /** Stable id, e.g. "R1-M1". */
  id: string;
  /** 1 = first knockout round; increases toward the final. */
  round: number;
  slotA: Slot;
  slotB: Slot;
  /** Set once the match is decided (including bye walkovers). */
  winnerId?: string;
}

export interface Bracket {
  /** rounds[0] is the first knockout round; the last round holds the final. */
  rounds: BracketMatch[][];
}

/** Points awarded per result. */
export const POINTS = { win: 3, draw: 1, loss: 0 } as const;

/* -------------------------------------------------------------------------- */
/*  Seeded PRNG (deterministic draws for reproducible tests)                  */
/* -------------------------------------------------------------------------- */

/** Small, fast, deterministic PRNG. Same seed → same sequence. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Deterministic Fisher–Yates shuffle driven by a seeded PRNG. Does not mutate the input. */
function seededShuffle<T>(items: readonly T[], seed: number): T[] {
  const out = items.slice();
  const rand = mulberry32(seed);
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/* -------------------------------------------------------------------------- */
/*  Group draw                                                                */
/* -------------------------------------------------------------------------- */

export interface DrawOptions {
  /** Target teams per group (default 4). Groups may end up smaller when N isn't divisible. */
  groupSize?: number;
  /** Seed for the deterministic draw. Same seed + teams → same groups. */
  seed?: number;
}

function groupLabel(index: number): string {
  // A..Z, then AA, AB, … for the (unlikely) case of >26 groups.
  let n = index;
  let label = "";
  do {
    label = String.fromCharCode(65 + (n % 26)) + label;
    n = Math.floor(n / 26) - 1;
  } while (n >= 0);
  return label;
}

/**
 * Deterministically draws teams into balanced groups.
 *
 * When the team count isn't divisible by the group size, groups differ in size
 * by at most one (e.g. 10 teams, size 4 → groups of 4, 3, 3). Teams are shuffled
 * with the seed, then dealt round-robin so the larger groups are spread evenly.
 */
export function drawGroups(teamIds: readonly string[], options: DrawOptions = {}): Group[] {
  const groupSize = options.groupSize ?? 4;
  const seed = options.seed ?? 1;
  if (groupSize < 1) throw new Error("groupSize must be >= 1");
  if (teamIds.length === 0) return [];

  const numGroups = Math.max(1, Math.ceil(teamIds.length / groupSize));
  const shuffled = seededShuffle(teamIds, seed);
  const groups: Group[] = Array.from({ length: numGroups }, (_, i) => ({
    name: groupLabel(i),
    teamIds: [],
  }));
  // Round-robin deal keeps sizes within one of each other.
  shuffled.forEach((teamId, i) => {
    groups[i % numGroups].teamIds.push(teamId);
  });
  return groups;
}

/**
 * Every team in a group plays every other once. Uses the circle method so the
 * fixture list is stable and each team appears the same number of times.
 */
export function generateGroupFixtures(group: Group): Array<{ homeId: string; awayId: string }> {
  const fixtures: Array<{ homeId: string; awayId: string }> = [];
  const teams = group.teamIds;
  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      fixtures.push({ homeId: teams[i], awayId: teams[j] });
    }
  }
  return fixtures;
}

/* -------------------------------------------------------------------------- */
/*  Standings                                                                 */
/* -------------------------------------------------------------------------- */

function blankRow(teamId: string): StandingRow {
  return {
    teamId,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    points: 0,
    rank: 0,
  };
}

/** Tallies results into rows keyed by team id. Only teams in `teamIds` are counted. */
function tally(teamIds: readonly string[], results: readonly MatchResult[]): Map<string, StandingRow> {
  const rows = new Map<string, StandingRow>();
  teamIds.forEach((id) => rows.set(id, blankRow(id)));

  for (const r of results) {
    const home = rows.get(r.homeId);
    const away = rows.get(r.awayId);
    if (!home || !away) continue; // ignore matches involving teams outside this set

    home.played++;
    away.played++;
    home.goalsFor += r.homeGoals;
    home.goalsAgainst += r.awayGoals;
    away.goalsFor += r.awayGoals;
    away.goalsAgainst += r.homeGoals;

    if (r.homeGoals > r.awayGoals) {
      home.won++;
      home.points += POINTS.win;
      away.lost++;
    } else if (r.homeGoals < r.awayGoals) {
      away.won++;
      away.points += POINTS.win;
      home.lost++;
    } else {
      home.drawn++;
      away.drawn++;
      home.points += POINTS.draw;
      away.points += POINTS.draw;
    }
  }

  for (const row of rows.values()) {
    row.goalDifference = row.goalsFor - row.goalsAgainst;
  }
  return rows;
}

/** Compares on points, then goal difference, then goals for. Returns 0 when tied on all three. */
function compareOverall(a: StandingRow, b: StandingRow): number {
  if (b.points !== a.points) return b.points - a.points;
  if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
  if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
  return 0;
}

/**
 * Computes a sorted group table.
 *
 * Ordering (FIFA-style): points → goal difference → goals for → head-to-head
 * among the tied teams → team id (final deterministic fallback so results are
 * reproducible). Head-to-head recomputes a mini-table using only the matches
 * played between the still-tied teams.
 */
export function computeStandings(
  teamIds: readonly string[],
  results: readonly MatchResult[],
): StandingRow[] {
  const rows = [...tally(teamIds, results).values()];

  rows.sort((a, b) => {
    const overall = compareOverall(a, b);
    if (overall !== 0) return overall;
    return a.teamId < b.teamId ? -1 : a.teamId > b.teamId ? 1 : 0;
  });

  // Resolve blocks that are tied on points/GD/GF using head-to-head.
  let i = 0;
  while (i < rows.length) {
    let j = i + 1;
    while (j < rows.length && compareOverall(rows[i], rows[j]) === 0) j++;
    if (j - i > 1) {
      const tiedIds = rows.slice(i, j).map((r) => r.teamId);
      const mini = tally(tiedIds, results);
      const block = rows.slice(i, j).sort((a, b) => {
        const ma = mini.get(a.teamId)!;
        const mb = mini.get(b.teamId)!;
        const h2h = compareOverall(ma, mb);
        if (h2h !== 0) return h2h;
        return a.teamId < b.teamId ? -1 : a.teamId > b.teamId ? 1 : 0;
      });
      rows.splice(i, block.length, ...block);
    }
    i = j;
  }

  rows.forEach((row, idx) => (row.rank = idx + 1));
  return rows;
}

/* -------------------------------------------------------------------------- */
/*  Qualification                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Selects the seeded list of qualifiers across all groups.
 *
 * Seeding order is all group winners first (in group order), then all
 * runners-up, and so on. This ordering, combined with standard bracket seeding
 * in {@link buildBracket}, keeps first-round same-group rematches out of the draw
 * and spreads group winners across the bracket.
 */
export function qualifiersFromGroups(
  groups: readonly Group[],
  resultsByGroup: Record<string, readonly MatchResult[]>,
  qualifiersPerGroup = 2,
): string[] {
  const standingsByGroup = groups.map((g) =>
    computeStandings(g.teamIds, resultsByGroup[g.name] ?? []),
  );
  const seeds: string[] = [];
  for (let rank = 0; rank < qualifiersPerGroup; rank++) {
    for (const standings of standingsByGroup) {
      if (standings[rank]) seeds.push(standings[rank].teamId);
    }
  }
  return seeds;
}

/* -------------------------------------------------------------------------- */
/*  Knockout bracket                                                          */
/* -------------------------------------------------------------------------- */

function nextPowerOfTwo(n: number): number {
  let p = 1;
  while (p < n) p *= 2;
  return p;
}

/**
 * Standard single-elimination seeding order for a bracket of `size` (a power of
 * two). Returns 1-based seed numbers arranged so seed 1 and seed 2 can only meet
 * in the final, seed 1 vs the lowest seed in round one, etc.
 * e.g. size 8 → [1, 8, 5, 4, 3, 6, 7, 2].
 */
function seedingOrder(size: number): number[] {
  let order = [1, 2];
  while (order.length < size) {
    const rounds = order.length * 2;
    const next: number[] = [];
    for (const s of order) {
      next.push(s);
      next.push(rounds + 1 - s);
    }
    order = next;
  }
  return order;
}

/**
 * Builds a World-Cup-style single-elimination bracket from a seeded list of
 * qualifiers (seed 0 = strongest). When the count isn't a power of two, the
 * bracket is padded with byes that are handed to the top seeds, and those
 * walkover matches are auto-decided so their winners flow into round two.
 */
export function buildBracket(seedIds: readonly string[]): Bracket {
  if (seedIds.length <= 1) return { rounds: [] };

  const size = nextPowerOfTwo(seedIds.length);
  const order = seedingOrder(size);

  const slotFor = (seedNumber: number): Slot => {
    const teamId = seedIds[seedNumber - 1];
    return teamId ? { kind: "team", teamId } : { kind: "bye" };
  };

  // Round 1
  const rounds: BracketMatch[][] = [];
  const first: BracketMatch[] = [];
  for (let m = 0; m < size / 2; m++) {
    first.push({
      id: `R1-M${m + 1}`,
      round: 1,
      slotA: slotFor(order[m * 2]),
      slotB: slotFor(order[m * 2 + 1]),
    });
  }
  rounds.push(first);

  // Subsequent rounds reference the winners of the previous round's matches.
  let prev = first;
  let roundNo = 2;
  while (prev.length > 1) {
    const round: BracketMatch[] = [];
    for (let m = 0; m < prev.length / 2; m++) {
      round.push({
        id: `R${roundNo}-M${m + 1}`,
        round: roundNo,
        slotA: { kind: "winner", matchId: prev[m * 2].id },
        slotB: { kind: "winner", matchId: prev[m * 2 + 1].id },
      });
    }
    rounds.push(round);
    prev = round;
    roundNo++;
  }

  // Auto-advance any bye walkovers in round one and propagate the winners.
  let bracket: Bracket = { rounds };
  for (const match of first) {
    const teamSlot =
      match.slotA.kind === "team" && match.slotB.kind === "bye"
        ? match.slotA
        : match.slotB.kind === "team" && match.slotA.kind === "bye"
          ? match.slotB
          : null;
    if (teamSlot) bracket = recordKnockoutResult(bracket, match.id, teamSlot.teamId);
  }
  return bracket;
}

function replaceWinnerSlot(slot: Slot, matchId: string, teamId: string): Slot {
  return slot.kind === "winner" && slot.matchId === matchId ? { kind: "team", teamId } : slot;
}

/**
 * Records a knockout winner and propagates them into the next round's slot.
 * Returns a new {@link Bracket}; the input is not mutated. Throws if the winner
 * isn't one of the match's two teams (once both teams are known).
 */
export function recordKnockoutResult(bracket: Bracket, matchId: string, winnerId: string): Bracket {
  const rounds = bracket.rounds.map((round) =>
    round.map((match) => {
      if (match.id === matchId) {
        const teams = [match.slotA, match.slotB]
          .filter((s): s is { kind: "team"; teamId: string } => s.kind === "team")
          .map((s) => s.teamId);
        if (teams.length === 2 && !teams.includes(winnerId)) {
          throw new Error(`winner ${winnerId} is not part of match ${matchId}`);
        }
        return { ...match, winnerId };
      }
      return {
        ...match,
        slotA: replaceWinnerSlot(match.slotA, matchId, winnerId),
        slotB: replaceWinnerSlot(match.slotB, matchId, winnerId),
      };
    }),
  );
  return { rounds };
}

/** The tournament champion, once the final has a recorded winner. */
export function championId(bracket: Bracket): string | undefined {
  const finalRound = bracket.rounds[bracket.rounds.length - 1];
  if (!finalRound || finalRound.length !== 1) return undefined;
  return finalRound[0].winnerId;
}
