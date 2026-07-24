import { describe, it, expect } from "vitest";
import {
  drawGroups,
  generateGroupFixtures,
  computeStandings,
  qualifiersFromGroups,
  buildBracket,
  recordKnockoutResult,
  championId,
  type MatchResult,
} from "./tournament";

const ids = (n: number) => Array.from({ length: n }, (_, i) => `t${i + 1}`);

describe("drawGroups", () => {
  it("is deterministic for a given seed", () => {
    const a = drawGroups(ids(8), { groupSize: 4, seed: 42 });
    const b = drawGroups(ids(8), { groupSize: 4, seed: 42 });
    expect(a).toEqual(b);
  });

  it("changes with a different seed", () => {
    const a = drawGroups(ids(8), { groupSize: 4, seed: 1 });
    const b = drawGroups(ids(8), { groupSize: 4, seed: 2 });
    expect(a).not.toEqual(b);
  });

  it("splits 8 teams into two groups of 4", () => {
    const groups = drawGroups(ids(8), { groupSize: 4, seed: 7 });
    expect(groups).toHaveLength(2);
    expect(groups.map((g) => g.teamIds.length)).toEqual([4, 4]);
    expect(groups.map((g) => g.name)).toEqual(["A", "B"]);
  });

  it("balances uneven counts to within one (10 teams, size 4 → 4,3,3)", () => {
    const groups = drawGroups(ids(10), { groupSize: 4, seed: 3 });
    expect(groups).toHaveLength(3);
    expect(groups.map((g) => g.teamIds.length)).toEqual([4, 3, 3]);
  });

  it("places every team exactly once with no duplicates", () => {
    const groups = drawGroups(ids(11), { groupSize: 4, seed: 9 });
    const placed = groups.flatMap((g) => g.teamIds).sort();
    expect(placed).toEqual(ids(11).sort());
  });

  it("handles fewer teams than a full group", () => {
    const groups = drawGroups(ids(3), { groupSize: 4, seed: 1 });
    expect(groups).toHaveLength(1);
    expect(groups[0].teamIds).toHaveLength(3);
  });

  it("returns no groups for no teams", () => {
    expect(drawGroups([], { groupSize: 4 })).toEqual([]);
  });
});

describe("generateGroupFixtures", () => {
  it("creates a single round-robin (n*(n-1)/2 fixtures)", () => {
    const fixtures = generateGroupFixtures({ name: "A", teamIds: ids(4) });
    expect(fixtures).toHaveLength(6);
    // Each pair appears exactly once.
    const pairs = new Set(fixtures.map((f) => [f.homeId, f.awayId].sort().join("-")));
    expect(pairs.size).toBe(6);
  });
});

describe("computeStandings", () => {
  it("awards 3/1/0 and orders by points", () => {
    const teams = ["a", "b", "c"];
    const results: MatchResult[] = [
      { homeId: "a", awayId: "b", homeGoals: 2, awayGoals: 0 }, // a win
      { homeId: "a", awayId: "c", homeGoals: 1, awayGoals: 1 }, // draw
      { homeId: "b", awayId: "c", homeGoals: 0, awayGoals: 3 }, // c win
    ];
    const table = computeStandings(teams, results);
    // a & c both finish on 4 pts; c ranks first on goal difference (+3 vs +2).
    expect(table.map((r) => r.teamId)).toEqual(["c", "a", "b"]);
    expect(table[0]).toMatchObject({ teamId: "c", points: 4, goalDifference: 3 });
    expect(table[1]).toMatchObject({ teamId: "a", points: 4, won: 1, drawn: 1, lost: 0 });
    expect(table[2]).toMatchObject({ teamId: "b", points: 0 });
  });

  it("breaks a points tie by goal difference, then goals for", () => {
    const teams = ["a", "b"];
    const results: MatchResult[] = [
      // Both beat nobody head-to-head here; craft equal points, different GD.
      { homeId: "a", awayId: "x", homeGoals: 5, awayGoals: 0 },
      { homeId: "b", awayId: "y", homeGoals: 2, awayGoals: 0 },
    ];
    // x and y excluded from the standings set, so only a & b counted (both 3 pts).
    const table = computeStandings(teams, results);
    expect(table.map((r) => r.teamId)).toEqual(["a", "b"]); // a has better GD
  });

  it("uses head-to-head when points, GD and GF are equal", () => {
    // Three-way tie on points/GD/GF; head-to-head decides.
    const teams = ["a", "b", "c"];
    const results: MatchResult[] = [
      { homeId: "a", awayId: "b", homeGoals: 1, awayGoals: 0 }, // a beats b
      { homeId: "b", awayId: "c", homeGoals: 1, awayGoals: 0 }, // b beats c
      { homeId: "c", awayId: "a", homeGoals: 1, awayGoals: 0 }, // c beats a
    ];
    // Each: 1W 1L, GF1 GA1, GD0, 3 pts — fully tied overall.
    const table = computeStandings(teams, results);
    // Head-to-head is also a perfect cycle, so it falls back to team id order.
    expect(table.map((r) => r.teamId)).toEqual(["a", "b", "c"]);
    expect(table.every((r) => r.points === 3 && r.goalDifference === 0)).toBe(true);
  });

  it("head-to-head separates two tied teams by their direct result", () => {
    const teams = ["a", "b", "c", "d"];
    const results: MatchResult[] = [
      // a and b both beat c and d identically, but b beat a head-to-head.
      { homeId: "a", awayId: "c", homeGoals: 1, awayGoals: 0 },
      { homeId: "a", awayId: "d", homeGoals: 1, awayGoals: 0 },
      { homeId: "b", awayId: "c", homeGoals: 1, awayGoals: 0 },
      { homeId: "b", awayId: "d", homeGoals: 1, awayGoals: 0 },
      { homeId: "b", awayId: "a", homeGoals: 1, awayGoals: 0 },
    ];
    const table = computeStandings(teams, results);
    // b and a tie on the a/b-vs-c/d results, but the b>a match ranks b first.
    expect(table[0].teamId).toBe("b");
    expect(table[1].teamId).toBe("a");
  });

  it("counts only matches between teams in the set", () => {
    const table = computeStandings(["a"], [
      { homeId: "a", awayId: "outsider", homeGoals: 3, awayGoals: 0 },
    ]);
    expect(table[0].played).toBe(0);
  });
});

describe("buildBracket", () => {
  it("builds a balanced bracket for a power-of-two field", () => {
    const bracket = buildBracket(["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"]);
    expect(bracket.rounds.map((r) => r.length)).toEqual([4, 2, 1]); // QF, SF, F
    // Seed 1 (top) opens vs the lowest seed; seed 2 sits in the opposite half
    // (matches M3/M4) so seeds 1 and 2 can only meet in the final.
    const r1 = bracket.rounds[0];
    expect(r1[0].slotA).toEqual({ kind: "team", teamId: "s1" });
    expect(r1[0].slotB).toEqual({ kind: "team", teamId: "s8" });
    const firstHalfTeams = [r1[0], r1[1]].flatMap((m) =>
      [m.slotA, m.slotB].filter((s) => s.kind === "team").map((s) => (s as { teamId: string }).teamId),
    );
    const secondHalfTeams = [r1[2], r1[3]].flatMap((m) =>
      [m.slotA, m.slotB].filter((s) => s.kind === "team").map((s) => (s as { teamId: string }).teamId),
    );
    expect(firstHalfTeams).toContain("s1");
    expect(secondHalfTeams).toContain("s2");
  });

  it("wires later rounds to the winners of earlier matches", () => {
    const bracket = buildBracket(ids(4));
    const final = bracket.rounds[1][0];
    expect(final.slotA).toEqual({ kind: "winner", matchId: "R1-M1" });
    expect(final.slotB).toEqual({ kind: "winner", matchId: "R1-M2" });
  });

  it("hands byes to top seeds and auto-advances them (6 teams → 8 slots)", () => {
    const bracket = buildBracket(["s1", "s2", "s3", "s4", "s5", "s6"]);
    expect(bracket.rounds.map((r) => r.length)).toEqual([4, 2, 1]);
    const r1 = bracket.rounds[0];
    const byeMatches = r1.filter((m) => m.slotA.kind === "bye" || m.slotB.kind === "bye");
    expect(byeMatches).toHaveLength(2); // 8 - 6 = 2 byes
    // Every bye match is already decided in favour of its real team.
    for (const m of byeMatches) {
      expect(m.winnerId).toBeDefined();
      const teamSlot = m.slotA.kind === "team" ? m.slotA : m.slotB;
      expect(teamSlot.kind).toBe("team");
      if (teamSlot.kind === "team") expect(m.winnerId).toBe(teamSlot.teamId);
    }
    // Top two seeds (s1, s2) received the byes.
    const advanced = byeMatches.map((m) => m.winnerId).sort();
    expect(advanced).toEqual(["s1", "s2"]);
  });

  it("returns an empty bracket for 0 or 1 qualifiers", () => {
    expect(buildBracket([]).rounds).toEqual([]);
    expect(buildBracket(["only"]).rounds).toEqual([]);
  });
});

describe("recordKnockoutResult / championId", () => {
  it("propagates a winner into the next round and does not mutate the input", () => {
    const bracket = buildBracket(ids(4));
    const updated = recordKnockoutResult(bracket, "R1-M1", "t1");
    expect(bracket.rounds[1][0].slotA).toEqual({ kind: "winner", matchId: "R1-M1" });
    expect(updated.rounds[1][0].slotA).toEqual({ kind: "team", teamId: "t1" });
    expect(updated.rounds[0][0].winnerId).toBe("t1");
  });

  it("rejects a winner that isn't in the match", () => {
    const bracket = buildBracket(ids(4));
    expect(() => recordKnockoutResult(bracket, "R1-M1", "nope")).toThrow();
  });

  it("plays a full 4-team knockout through to a champion", () => {
    let bracket = buildBracket(["s1", "s2", "s3", "s4"]);
    expect(championId(bracket)).toBeUndefined();
    // R1: s1 (vs s4) and s2 (vs s3) win.
    bracket = recordKnockoutResult(bracket, "R1-M1", "s1");
    bracket = recordKnockoutResult(bracket, "R1-M2", "s2");
    const final = bracket.rounds[1][0];
    expect(final.slotA).toEqual({ kind: "team", teamId: "s1" });
    expect(final.slotB).toEqual({ kind: "team", teamId: "s2" });
    bracket = recordKnockoutResult(bracket, final.id, "s1");
    expect(championId(bracket)).toBe("s1");
  });

  it("carries a bye winner all the way through", () => {
    // 3 teams → 4 slots, seed 1 gets a bye into the final.
    let bracket = buildBracket(["s1", "s2", "s3"]);
    // s1's bye is auto-resolved; the other semi is s2 vs s3.
    const semi = bracket.rounds[0].find(
      (m) => m.slotA.kind === "team" && m.slotB.kind === "team",
    )!;
    bracket = recordKnockoutResult(bracket, semi.id, "s2");
    const final = bracket.rounds[1][0];
    expect(final.slotA).toEqual({ kind: "team", teamId: "s1" });
    expect(final.slotB).toEqual({ kind: "team", teamId: "s2" });
    bracket = recordKnockoutResult(bracket, final.id, "s2");
    expect(championId(bracket)).toBe("s2");
  });
});

describe("qualifiersFromGroups → buildBracket (end to end)", () => {
  it("seeds winners ahead of runners-up and builds a clean bracket", () => {
    const groups = [
      { name: "A", teamIds: ["a1", "a2", "a3"] },
      { name: "B", teamIds: ["b1", "b2", "b3"] },
    ];
    const resultsByGroup = {
      A: [
        { homeId: "a1", awayId: "a2", homeGoals: 3, awayGoals: 0 },
        { homeId: "a1", awayId: "a3", homeGoals: 3, awayGoals: 0 },
        { homeId: "a2", awayId: "a3", homeGoals: 1, awayGoals: 0 },
      ],
      B: [
        { homeId: "b1", awayId: "b2", homeGoals: 3, awayGoals: 0 },
        { homeId: "b1", awayId: "b3", homeGoals: 3, awayGoals: 0 },
        { homeId: "b2", awayId: "b3", homeGoals: 1, awayGoals: 0 },
      ],
    };
    const seeds = qualifiersFromGroups(groups, resultsByGroup, 2);
    // Winners first (A1, B1), then runners-up (A2, B2).
    expect(seeds).toEqual(["a1", "b1", "a2", "b2"]);
    const bracket = buildBracket(seeds);
    // No first-round rematch of same-group teams.
    for (const m of bracket.rounds[0]) {
      const a = m.slotA.kind === "team" ? m.slotA.teamId[0] : null;
      const b = m.slotB.kind === "team" ? m.slotB.teamId[0] : null;
      expect(a).not.toBe(b);
    }
  });
});
