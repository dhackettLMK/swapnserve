import { describe, expect, it } from "vitest";
import { entryRegistrationError } from "../../supabase/functions/_shared/registration";

describe("Cup registration", () => {
  it("rejects new individual entries", () => {
    expect(entryRegistrationError("solo")).not.toBeNull();
  });

  it("rejects new teams when the Cup is at full capacity", () => {
    expect(entryRegistrationError("new_team")).not.toBeNull();
  });

  it("preserves invitations for existing squads and their payments", () => {
    expect(entryRegistrationError("join")).toBeNull();
    expect(entryRegistrationError("player")).toBeNull();
    expect(entryRegistrationError("shares")).toBeNull();
    expect(entryRegistrationError("full")).toBeNull();
    expect(entryRegistrationError("donate")).toBeNull();
  });
});