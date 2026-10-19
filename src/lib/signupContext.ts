// Anonymous sign-up attribution: which app or browser, which device, and
// which site someone arrived from. No personal data, nothing stored beyond
// the current browser tab session until they pay.
const REF_KEY = "cup_first_referrer";

export function detectApp(ua: string): string {
  if (/Instagram/i.test(ua)) return "Instagram";
  if (/Snapchat/i.test(ua)) return "Snapchat";
  if (/musical_ly|TikTok|BytedanceWebview/i.test(ua)) return "TikTok";
  if (/FBAN|FBAV|FB_IAB/i.test(ua)) return "Facebook";
  if (/WhatsApp/i.test(ua)) return "WhatsApp";
  if (/LinkedInApp/i.test(ua)) return "LinkedIn";
  if (/Twitter/i.test(ua)) return "X";
  if (/EdgA?\//i.test(ua)) return "Edge";
  if (/SamsungBrowser/i.test(ua)) return "Samsung Internet";
  if (/Firefox|FxiOS/i.test(ua)) return "Firefox";
  if (/CriOS|Chrome\//i.test(ua)) return "Chrome";
  if (/Safari/i.test(ua)) return "Safari";
  return "Other";
}

export function detectDevice(ua: string): string {
  if (/iPhone|iPod/i.test(ua)) return "iPhone";
  if (/iPad/i.test(ua)) return "iPad";
  if (/Android/i.test(ua)) return "Android";
  return "Computer";
}

export function referrerLabel(ref: string, ownHost: string): string {
  if (!ref) return "None";
  let host = "";
  try {
    host = new URL(ref).hostname.replace(/^www\./, "");
  } catch {
    return "None";
  }
  if (!host || host === ownHost.replace(/^www\./, "")) return "None";
  if (/instagram/.test(host)) return "Instagram";
  if (/snapchat/.test(host)) return "Snapchat";
  if (/tiktok/.test(host)) return "TikTok";
  if (/facebook|fb\.com/.test(host)) return "Facebook";
  if (/google\./.test(host)) return "Google";
  if (/bing\./.test(host)) return "Bing";
  if (/t\.co$|twitter|x\.com/.test(host)) return "X";
  if (/linkedin|lnkd/.test(host)) return "LinkedIn";
  if (/whatsapp/.test(host)) return "WhatsApp";
  return host.slice(0, 60);
}

/** Call once on app load: remembers the site they first arrived from. */
export function captureReferrer(): void {
  try {
    if (sessionStorage.getItem(REF_KEY) !== null) return;
    sessionStorage.setItem(REF_KEY, referrerLabel(document.referrer, window.location.hostname));
  } catch {
    // Storage disabled: attribution is optional.
  }
}

export function getSignupContext() {
  const ua = navigator.userAgent;
  let referrer = "None";
  try {
    referrer = sessionStorage.getItem(REF_KEY) ?? referrerLabel(document.referrer, window.location.hostname);
  } catch {
    // ignore
  }
  return { signup_app: detectApp(ua), signup_device: detectDevice(ua), signup_referrer: referrer };
}
