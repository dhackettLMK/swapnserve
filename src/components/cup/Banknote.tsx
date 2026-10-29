import { useId } from "react";
import { cn } from "@/lib/utils";
import wordmark from "@/assets/swapnserve-wordmark-cup.png";

type Props = { value: string; label: string; serial: string; className?: string };

/**
 * Swap'n'Serve prize banknote. Markup and SVG only, so it stays crisp at any size;
 * all sizing uses container units relative to the note's width.
 */
const Banknote = ({ value, label, serial, className }: Props) => {
  const id = useId().replace(/:/g, "");
  const gold = "hsl(var(--note-gold))";
  return (
    <div
      className={cn(
        "group relative aspect-[2/1] w-full overflow-hidden rounded-lg text-left shadow-[0_24px_48px_-24px_hsl(var(--note-shadow)/0.9)] ring-1 ring-[hsl(var(--note-gold)/0.45)] transition-transform duration-500 hover:-translate-y-1",
        className,
      )}
      style={{ containerType: "inline-size", background: "var(--note-bg)" }}
      role="img"
      aria-label={`€${value} Swap'n'Serve note, ${label}`}
    >
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 200 100" aria-hidden>
        <defs>
          <linearGradient id={`f${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="hsl(var(--note-gold-light))" />
            <stop offset="0.5" stopColor={gold} />
            <stop offset="1" stopColor="hsl(var(--note-gold-deep))" />
          </linearGradient>
          <radialGradient id={`r${id}`} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor={gold} stopOpacity="0.22" />
            <stop offset="1" stopColor={gold} stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* fine engraved wave lines */}
        {Array.from({ length: 14 }).map((_, i) => (
          <path
            key={i}
            d={`M0 ${8 + i * 6.5} Q 50 ${2 + i * 6.5} 100 ${8 + i * 6.5} T 200 ${8 + i * 6.5}`}
            fill="none"
            stroke={gold}
            strokeWidth="0.15"
            opacity="0.22"
          />
        ))}
        {/* rosette */}
        <circle cx="148" cy="50" r="46" fill={`url(#r${id})`} />
        <g opacity="0.5" fill="none" stroke={`url(#f${id})`} strokeWidth="0.22">
          {Array.from({ length: 24 }).map((_, i) => (
            <ellipse key={i} cx="148" cy="50" rx="34" ry="13" transform={`rotate(${i * 7.5} 148 50)`} />
          ))}
        </g>
        <circle cx="148" cy="50" r="36" fill="none" stroke={gold} strokeWidth="0.3" opacity="0.6" />
        <circle cx="148" cy="50" r="38" fill="none" stroke={gold} strokeWidth="0.15" strokeDasharray="0.6 0.9" opacity="0.7" />
        {/* frame */}
        <rect x="3.5" y="3.5" width="193" height="93" rx="2.5" fill="none" stroke={`url(#f${id})`} strokeWidth="0.6" />
        <rect x="5.5" y="5.5" width="189" height="89" rx="1.5" fill="none" stroke={gold} strokeWidth="0.2" opacity="0.7" />
      </svg>

      {/* sheen on hover */}
      <div className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(105deg,transparent_40%,hsl(var(--note-gold-light)/0.18)_50%,transparent_60%)] transition-transform duration-1000 group-hover:translate-x-full" />

      <div className="absolute left-[7%] top-[13%] w-[38%]">
        <img src={wordmark} alt="" className="h-auto w-full drop-shadow-[0_1px_1px_hsl(var(--note-shadow)/0.6)]" />
      </div>

      <div className="absolute bottom-[13%] left-[7%] max-w-[42%]">
        <p className="text-[2.3cqw] font-semibold uppercase tracking-[0.3em] text-[hsl(var(--note-gold-light))]">Prize</p>
        <p className="mt-[0.8cqw] font-cup-display text-[3.6cqw] font-bold uppercase leading-tight tracking-[0.06em] text-[hsl(var(--note-paper))]">
          {label}
        </p>
        <p className="mt-[1.6cqw] font-mono text-[2.1cqw] tracking-[0.2em] text-[hsl(var(--note-gold)/0.8)]">{serial}</p>
      </div>

      <div className="absolute left-[71%] top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-start">
        <span className="prize-gold mt-[1.4cqw] font-cup-display text-[6cqw] font-bold">€</span>
        <span className="prize-gold font-cup-display text-[13cqw] font-extrabold leading-none tracking-[-0.05em]">{value}</span>
      </div>

      <span className="absolute right-[6%] top-[11%] font-cup-display text-[3.4cqw] font-bold text-[hsl(var(--note-gold-light)/0.85)]">
        €{value}
      </span>
    </div>
  );
};

export default Banknote;
