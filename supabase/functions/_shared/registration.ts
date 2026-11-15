/** Close new team places, preserving existing squads and previously paid sessions. */
export function entryRegistrationError(mode: string): string | null {
  return mode === "solo" || mode === "new_team"
    ? "The Swap'N'Serve Cup is SOLD OUT. Come down and watch, with free food, live local musicians and poets!"
    : null;
}