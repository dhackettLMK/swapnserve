import { describe, expect, it } from "vitest";
import { registeredTeamIds } from "../../supabase/functions/_shared/registeredTeams";

describe("group draw eligibility", () => {
  it("includes a sponsored team with €70 paid despite an old collecting status", () => {
    expect(registeredTeamIds(
      [{ id: "sponsored", status: "collecting" }],
      [{ team_id: "sponsored", status: "paid", amount_cents: 7000 }],
    )).toEqual(["sponsored"]);
  });

  it("excludes €60 paid plus €10 pending even with an old registered status", () => {
    expect(registeredTeamIds(
      [{ id: "partial", status: "registered" }],
      [
        { team_id: "partial", status: "paid", amount_cents: 6000 },
        { team_id: "partial", status: "pending", amount_cents: 1000 },
      ],
    )).toEqual([]);
  });

  it("combines sponsored and individual payments only for their own team", () => {
    expect(registeredTeamIds(
      [{ id: "mixed", status: "draft" }, { id: "other", status: "collecting" }],
      [
        { team_id: "mixed", status: "paid", amount_cents: 4000 },
        { team_id: "mixed", status: "paid", amount_cents: 3000 },
        { team_id: "other", status: "paid", amount_cents: 1000 },
      ],
    )).toEqual(["mixed"]);
  });
});