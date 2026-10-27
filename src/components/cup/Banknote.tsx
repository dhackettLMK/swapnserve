import { useId } from "react";
import { cn } from "@/lib/utils";

type Props = { value: string; label: string; serial: string; className?: string };

/**
 * Swap'n'Serve themed banknote for prize money. Pure markup and SVG so it stays
 * crisp at any size; everything scales with the note's width (container units).
 */
const Banknote = ({ value, label, serial, className }: Props) => {
  const id = useId().replace(/:/g, "");
  return (
    <div
      className={cn(
        "relative aspect-[2.1/1] w-full overflow-hidden rounded-md text-left bg-[hsl(var(--note-paper))] text-[hsl(var(--note-ink))] shadow-[0_18px_40px_-18px_hsl(var(--note-ink)/0.8)]",
        className,
      )}
      style={{ containerType: "inline-size" }}
      role="img"
      aria-label={`€${value} note, ${label}`}
    >
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 210 100" preserveAspectRatio="none" aria-hidden>
        <defs>
          <pattern id={`g${id}`} width="7" height="7" patternUnits="userSpaceOnUse">
            <circle cx="3.5" cy="3.5" r="3.2" fill="none" stroke="currentColor" strokeWidth="0.18" opacity="0.35" />
          </pattern>
          <radialGradient id={`w${id}`} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="hsl(var(--note-gold))" stopOpacity="0.35" />
            <stop offset="1" stopColor="hsl(var(--note-gold))" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="210" height="100" fill={`url(#g${id})`} />
        <ellipse cx="160" cy="50" rx="44" ry="44" fill={`url(#w${id})`} />
        {Array.from({ length: 9 }).map((_, i) => (
          <ellipse key={i} cx="160" cy="50" rx={12 + i * 3.6} ry={12 + i * 3.6} fill="none" stroke="currentColor" strokeWidth="0.25" opacity="0.28" transform={`rotate(${i * 20} 160 50) scale(1 0.98)`} />
        ))}
        <rect x="3" y="3" width="204" height="94" rx="4" fill="none" stroke="currentColor" strokeWidth="0.9" />
        <rect x="5.5" y="5.5" width="199" height="89" rx="3" fill="none" stroke="hsl(var(--note-gold))" strokeWidth="0.5" strokeDasharray="1.4 0.8" />
      </svg>

      <span className="absolute left-[5%] top-[7%] font-cup-display text-[7cqw] font-extrabold leading-none tracking-tight">{value}</span>

      <div className="absolute left-[5%] top-[30%] max-w-[50%]">
        <p className="font-cup-display text-[4.6cqw] font-bold uppercase leading-none tracking-[0.08em]">Swap'n'Serve</p>
        <p className="mt-[1.2cqw] text-[2.4cqw] font-semibold uppercase tracking-[0.22em] opacity-70">Bank of Limerick</p>
        <p className="mt-[4cqw] text-[3cqw] font-bold uppercase leading-tight tracking-[0.1em]">{label}</p>
      </div>

      <div className="absolute right-[6%] top-1/2 flex -translate-y-1/2 items-start text-[hsl(var(--note-ink))]">
        <span className="mt-[1.6cqw] font-cup-display text-[7cqw] font-extrabold">€</span>
        <span className="font-cup-display text-[15cqw] font-extrabold leading-none tracking-[-0.05em]" style={{ WebkitTextStroke: "0.25cqw hsl(var(--note-gold))" }}>
          {value}
        </span>
      </div>

      <span className="absolute bottom-[8%] left-[5%] font-mono text-[2.4cqw] tracking-[0.18em] opacity-60">{serial}</span>
    </div>
  );
};

export default Banknote;
