import wordmark from "@/assets/swapnserve-wordmark-cup.png";
import cupSpraypaint from "@/assets/cup-spraypaint.png";

interface CupButtonBrandProps {
  wordmarkClass?: string;
  cupClass?: string;
}

// The Swap'n'Serve wordmark followed by the gold spray-paint CUP graphic,
// used inside sign-up buttons so they carry the actual Cup branding.
const CupButtonBrand = ({ wordmarkClass = "h-4", cupClass = "h-5" }: CupButtonBrandProps) => (
  <span className="inline-flex items-center gap-2 whitespace-nowrap">
    <img src={wordmark} alt="" className={`${wordmarkClass} w-auto`} />
    <img src={cupSpraypaint} alt="Swap'n'Serve Cup" className={`${cupClass} w-auto`} />
  </span>
);

export default CupButtonBrand;
