// Bundled copies of blog portrait photos.
// Content stores CDN asset URLs (the editable source of truth). The local
// preview cannot serve /__l5e/assets-v1/... paths, so a same-named file in
// src/assets/press/portraits/ is swapped in when present; otherwise the CDN
// URL is used, which serves on the published site.
const portraits = import.meta.glob<string>("/src/assets/press/portraits/*.{jpg,jpeg,png,webp}", {
  eager: true,
  query: "?url",
  import: "default",
});

export function resolvePressPortrait(photo?: string): string | undefined {
  if (!photo) return undefined;
  const name = photo.split("/").pop();
  if (!name) return photo;
  return portraits[`/src/assets/press/portraits/${name}`] ?? photo;
}
