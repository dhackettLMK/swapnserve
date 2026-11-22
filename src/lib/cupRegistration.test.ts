import { describe, expect, it } from "vitest";
import { entryRegistrationError } from "../../supabase/functions/_shared/registration";

describe("Cup registration", () => {
  it("rejects new individual entries", () => {
    expect(entryRegistrationError("solo")).toBe("Individual registration is closed. Please register as a team.");
  });

  it("keeps captain registration and team invitations open", () => {
    expect(entryRegistrationError("new_team")).toBeNull();
    expect(entryRegistrationError("join")).toBeNull();
  });
});