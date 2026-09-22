// Tracks which button brought someone to the Cup sign-up page, so we can see
// which calls to action drive captain sign-ups versus individual sign-ups.
const KEY = "cup_signup_source";

/** Stores the `?src=` value from the current URL, if there is one. */
export function captureSignupSource(): void {
  try {
    const src = new URLSearchParams(window.location.search).get("src");
    if (src) sessionStorage.setItem(KEY, src.slice(0, 40));
  } catch {
    // Private browsing with storage disabled: tracking is optional.
  }
}

/** Overrides the source, for buttons inside the Cup page itself. */
export function setSignupSource(src: string): void {
  try {
    sessionStorage.setItem(KEY, src.slice(0, 40));
  } catch {
    // Ignore.
  }
}

/** The button that led to this sign-up, or "direct" if we never saw one. */
export function getSignupSource(): string {
  try {
    return sessionStorage.getItem(KEY) || "direct";
  } catch {
    return "direct";
  }
}
