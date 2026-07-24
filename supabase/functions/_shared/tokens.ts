// Unguessable, URL-safe tokens for invite / manage links. 32 random bytes of
// crypto entropy, base64url-encoded — no accounts, no passwords required.
export function generateToken(bytes = 24): string {
  const buf = new Uint8Array(bytes);
  crypto.getRandomValues(buf);
  let binary = "";
  for (const b of buf) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
