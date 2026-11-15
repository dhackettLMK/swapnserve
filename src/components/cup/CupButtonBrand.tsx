import wordmark from "@/assets/swapnserve-wordmark-cup.png";
import cupSpraypaint from "@/assets/cup-spraypaint.webp";
import { CupSoldOut } from "./CupSoldOut";

interface CupButtonBrandProps {
  wordmarkClass?: string;
  cupClass?: string;
}

// The Swap'n'Serve wordmark followed by the gold spray-paint CUP graphic,
// used inside sign-up buttons so they carry the actual Cup branding.
const CupButtonBrand = ({ wordmarkClass = "h-4", cupClass = "h-5" }: CupButtonBrandProps) => (
  <span className="inline-flex flex-wrap items-center justify-center gap-2">
    <CupSoldOut compact />
    <span className="font-display text-xs font-semibold uppercase">Come watch</span>
    <img src={wordmark} alt="" className={`${wordmarkClass} w-auto`} />
    <img src={cupSpraypaint} alt="Swap'n'Serve Cup" className={`${cupClass} w-auto`} />
  </span>
);

export default CupButtonBrand;
