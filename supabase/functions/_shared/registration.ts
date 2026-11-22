/** Reject new individual entries without interfering with previously paid sessions. */
export function entryRegistrationError(mode: string): string | null {
  return mode === "solo" ? "Individual registration is closed. Please register as a team." : null;
}