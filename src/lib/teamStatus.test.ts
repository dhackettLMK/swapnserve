import { describe, it, expect } from "vitest";
import {
  evaluateTeamStatus,
  summariseTeam,
  paidTowardEntry,
  remainingCents,
  maxAdditionalChargeCents,
  formatEuros,
  TEAM_PRICE_CENTS,
  PRICE_PER_PLAYER_CENTS,
  ROSTER_SIZE,
  type PaymentInput,
  type PlayerInput,
} from "./teamStatus";

const team = { id: "team-1" };
const players = (n: number): PlayerInput[] => Array.from({ length: n }, (_, i) => ({ id: `p${i}` }));
const paid = (amount: number): PaymentInput => ({ status: "paid", amount_cents: amount });
const pending = (amount: number): PaymentInput => ({ status: "pending", amount_cents: amount });

describe("evaluateTeamStatus", () => {
  it("is draft when only the captain exists and nothing is paid", () => {
    expect(evaluateTeamStatus(team, players(1), [])).toBe("draft");
  });

  it("is collecting with a partial roster", () => {
    expect(evaluateTeamStatus(team, players(4), [])).toBe("collecting");
  });

  it("is collecting when the roster is full but the fee is underpaid", () => {
    const payments = [paid(PRICE_PER_PLAYER_CENTS * 5)]; // €50 of €70
    expect(evaluateTeamStatus(team, players(ROSTER_SIZE), payments)).toBe("collecting");
  });

  it("is collecting when fully paid but the roster is short", () => {
    expect(evaluateTeamStatus(team, players(6), [paid(TEAM_PRICE_CENTS)])).toBe("collecting");
  });

  it("registers exactly when roster is 7 and €70 is paid", () => {
    expect(evaluateTeamStatus(team, players(ROSTER_SIZE), [paid(TEAM_PRICE_CENTS)])).toBe(
      "registered",
    );
  });

  it("registers with captain-pays-all (one €70 payment)", () => {
    const payments = [paid(7000)];
    expect(evaluateTeamStatus(team, players(7), payments)).toBe("registered");
  });

  it("registers with seven individual €10 payments (mixed payers)", () => {
    const payments = Array.from({ length: 7 }, () => paid(PRICE_PER_PLAYER_CENTS));
    expect(evaluateTeamStatus(team, players(7), payments)).toBe("registered");
  });

  it("registers on a mixed case: captain covers €40, three pay €10 each", () => {
    const payments = [paid(4000), paid(1000), paid(1000), paid(1000)];
    expect(paidTowardEntry(payments)).toBe(7000);
    expect(evaluateTeamStatus(team, players(7), payments)).toBe("registered");
  });

  it("ignores pending/unpaid payments", () => {
    const payments = [paid(6000), pending(1000)];
    expect(evaluateTeamStatus(team, players(7), payments)).toBe("collecting");
  });
});

describe("overpay guard", () => {
  it("caps counted payment at €70 even if more clears", () => {
    const payments = [paid(7000), paid(1000)]; // €80 cleared
    expect(paidTowardEntry(payments)).toBe(7000);
    expect(remainingCents(payments)).toBe(0);
    expect(maxAdditionalChargeCents(payments)).toBe(0);
  });

  it("reports the exact remaining charge allowed", () => {
    const payments = [paid(4000)];
    expect(remainingCents(payments)).toBe(3000);
    expect(maxAdditionalChargeCents(payments)).toBe(3000);
  });

  it("an overpaid, full roster is still just registered (never beyond)", () => {
    const payments = [paid(9000)];
    expect(evaluateTeamStatus(team, players(7), payments)).toBe("registered");
  });
});

describe("summariseTeam", () => {
  it("summarises a half-collected team", () => {
    const s = summariseTeam(team, players(4), [paid(3000)]);
    expect(s).toMatchObject({
      status: "collecting",
      rosterCount: 4,
      rosterNeeded: 3,
      rosterComplete: false,
      paidCents: 3000,
      outstandingCents: 4000,
      fullyPaid: false,
    });
  });

  it("summarises a registered team with nothing outstanding", () => {
    const s = summariseTeam(team, players(7), [paid(7000)]);
    expect(s).toMatchObject({
      status: "registered",
      rosterNeeded: 0,
      rosterComplete: true,
      outstandingCents: 0,
      fullyPaid: true,
    });
  });

  it("never reports a negative outstanding on overpay", () => {
    const s = summariseTeam(team, players(7), [paid(9000)]);
    expect(s.outstandingCents).toBe(0);
    expect(s.paidCents).toBe(7000);
  });
});

describe("formatEuros", () => {
  it("formats cents as euros", () => {
    expect(formatEuros(7000)).toBe("€70.00");
    expect(formatEuros(1000)).toBe("€10.00");
    expect(formatEuros(0)).toBe("€0.00");
  });
});
