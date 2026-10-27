import { cn } from "@/lib/utils";

/** Prize figure as live text: euro sign raised and smaller, numerals in metallic gold. */
const PrizeAmount = ({ value, className }: { value: string; className?: string }) => (
  <span
    className={cn("prize-gold inline-flex items-start font-cup-display font-extrabold leading-none tracking-[-0.04em]", className)}
    aria-label={`€${value}`}
  >
    <span className="mr-[0.06em] mt-[0.12em] text-[0.5em]">€</span>
    {value}
  </span>
);

export default PrizeAmount;
