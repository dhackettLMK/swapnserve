import savedContent from "@/assets/thirty/content.json";

const portraits = import.meta.glob<string>("/src/assets/thirty/portraits/*.jpg", { eager: true, query: "?url", import: "default" });
const assetNames = new Map(savedContent.honourees.filter((person) => person.photo).map((person) => {
  const parts = person.photo.split("/");
  return [parts.at(-2), parts.at(-1)];
}));

export function resolvePortrait(photo: string): string {
  const parts = photo.split("/");
  const name = assetNames.get(parts.at(-2));
  return name ? portraits[`/src/assets/thirty/portraits/${name}`] ?? photo : photo;
}