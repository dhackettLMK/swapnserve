import { describe, it, expect } from "vitest";
import { detectApp, detectDevice, referrerLabel } from "./signupContext";

const SNAP_IPHONE = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Snapchat/12.50.0";
const IG_ANDROID = "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/120 Mobile Safari/537.36 Instagram 300.0";
const SAFARI_IPHONE = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Version/17.0 Mobile/15E148 Safari/604.1";
const CHROME_MAC = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36";

describe("signup attribution", () => {
  it("detects Snapchat on iPhone", () => {
    expect(detectApp(SNAP_IPHONE)).toBe("Snapchat");
    expect(detectDevice(SNAP_IPHONE)).toBe("iPhone");
  });
  it("detects Instagram on Android", () => {
    expect(detectApp(IG_ANDROID)).toBe("Instagram");
    expect(detectDevice(IG_ANDROID)).toBe("Android");
  });
  it("detects Safari and Chrome on computer", () => {
    expect(detectApp(SAFARI_IPHONE)).toBe("Safari");
    expect(detectApp(CHROME_MAC)).toBe("Chrome");
    expect(detectDevice(CHROME_MAC)).toBe("Computer");
  });
  it("labels referrers", () => {
    expect(referrerLabel("https://www.google.com/", "swapnserve.com")).toBe("Google");
    expect(referrerLabel("https://l.instagram.com/?u=x", "swapnserve.com")).toBe("Instagram");
    expect(referrerLabel("https://swapnserve.com/", "www.swapnserve.com")).toBe("None");
    expect(referrerLabel("", "swapnserve.com")).toBe("None");
  });
});
