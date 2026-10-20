// Local copies of the ten researched honouree portraits.
//
// The page content row stores each photo as a Lovable Assets CDN path such as
// "/__l5e/assets-v1/<asset-id>/ryan-morrisey.jpg". Those paths serve on the
// published site but are not proxied by the local preview, so we bundle the
// same files and swap them in by asset id. Anything else (a private-bucket
// signed URL from an organiser upload, or a path with no bundled copy) is
// returned untouched, so the page editor keeps working as the source of truth.
import avaCrean from "@/assets/thirty/portraits/ava-crean.jpg";
import cameronDiBenneto from "@/assets/thirty/portraits/cameron-dibenneto.jpg";
import darrenNwankwo from "@/assets/thirty/portraits/darren-nwankwo.jpg";
import excelAhmed from "@/assets/thirty/portraits/excel-ahmed.jpg";
import michaelDike from "@/assets/thirty/portraits/michael-dike.jpg";
import oluchiOkoli from "@/assets/thirty/portraits/oluchi-okoli.jpg";
import richkovBoevi from "@/assets/thirty/portraits/richkov-boevi.jpg";
import ryanBeniDijopang from "@/assets/thirty/portraits/ryan-beni-dijopang.jpg";
import ryanMorrisey from "@/assets/thirty/portraits/ryan-morrisey.jpg";
import seanLeddin from "@/assets/thirty/portraits/sean-leddin.jpg";

const BY_ASSET_ID: Record<string, string> = {
  "f60b4eb1-bd4a-4f72-b685-3a6e0304465f": avaCrean,
  "86bbee1d-43d0-4843-9b0c-1598cd85e8c9": cameronDiBenneto,
  "9e0b8a08-1060-42fe-b554-5e3397e7988d": darrenNwankwo,
  "2abcd576-9990-40fa-b15e-87b5bfff6240": excelAhmed,
  "c74baaab-aa14-4971-8f1d-c56a928209f6": michaelDike,
  "2a34cdd7-1932-4ae0-a87b-17cc08e50cff": oluchiOkoli,
  "93cbbc6f-5866-4488-bed2-7b8cd68918ad": richkovBoevi,
  "032f9468-21ab-4806-9af8-6895f39fce20": ryanBeniDijopang,
  "8d11e300-f900-4eb7-ae88-1d7dda08df5a": ryanMorrisey,
  "50a74999-90f3-44a9-86f5-1262975b4d3a": seanLeddin,
};

const ASSET_PATH = /\/__l5e\/assets-v1\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\//i;

/** Swap a stored Assets CDN path for its bundled copy when we have one. */
export function resolvePortrait(photo: string | null | undefined): string {
  if (!photo) return "";
  const match = ASSET_PATH.exec(photo);
  return (match && BY_ASSET_ID[match[1].toLowerCase()]) || photo;
}
