import { motion } from "framer-motion";
import { ArrowLeftRight, ArrowRight, Code, Shirt, Terminal, Trophy, UserPlus } from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import cupSpray from "@/assets/cup-spraypaint.webp";
import cupWordmark from "@/assets/swapnserve-wordmark-cup.png";

import Banknote from "@/components/cup/Banknote";

const PRIZES = [
  { amount: "1,000", label: "Cup winners", serial: "SNS 001000" },
  { amount: "300", label: "Plate winners", serial: "SNS 000300" },
  { amount: "100", label: "Player of the tournament", serial: "SNS 000100" },
];


const MatrixRain = () => {
  const columns = useMemo(() => {
    const chars = ".*+oOo.*".split("");
    return Array.from({ length: 14 }).map((_, i) => ({
      left: (i / 14) * 100 + Math.random() * 3,
      duration: 6 + Math.random() * 6,
      delay: Math.random() * 5,
      glyphs: Array.from({ length: 18 }).map(() => chars[Math.floor(Math.random() * chars.length)]),
    }));
  }, []);
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.16] transition-opacity duration-500 group-hover:opacity-[0.32]">
      {columns.map((col, i) => (
        <motion.div key={i} className="absolute -top-1/2 whitespace-pre font-mono text-[11px] leading-[1.1] text-accent" style={{ left: `${col.left}%` }} animate={{ y: ["0%", "220%"] }} transition={{ duration: col.duration, repeat: Infinity, ease: "linear", delay: col.delay }}>
          {col.glyphs.map((g, j) => <div key={j} style={{ opacity: 1 - j / col.glyphs.length }}>{g}</div>)}
        </motion.div>
      ))}
    </div>
  );
};

const Cursor = () => (
  <motion.span aria-hidden="true" className="ml-1 inline-block h-[14px] w-[7px] bg-accent align-middle" animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
);

const RIVER_Y = 138;

const BUILDINGS = [
  { x: 12, w: 34, h: 46 },
  { x: 50, w: 22, h: 62 },
  { x: 76, w: 30, h: 34 },
  { x: 110, w: 26, h: 78 },
  { x: 140, w: 34, h: 50 },
  { x: 178, w: 20, h: 66 },
  { x: 202, w: 36, h: 40 },
  { x: 242, w: 24, h: 72 },
  { x: 270, w: 32, h: 44 },
  { x: 306, w: 22, h: 58 },
  { x: 332, w: 30, h: 36 },
  { x: 366, w: 26, h: 52 },
  { x: 396, w: 18, h: 30 },
];

const STARS = [
  { x: 30, y: 18 }, { x: 88, y: 30 }, { x: 150, y: 14 }, { x: 210, y: 26 },
  { x: 268, y: 16 }, { x: 318, y: 34 }, { x: 400, y: 44 }, { x: 120, y: 44 },
  { x: 240, y: 46 }, { x: 350, y: 52 },
];

const CityScene = () => {
  const windows = useMemo(() => BUILDINGS.flatMap((b, bi) => {
    const cols = Math.max(1, Math.floor((b.w - 8) / 8));
    const rows = Math.max(1, Math.floor((b.h - 12) / 11));
    const out: { x: number; y: number; i: number; lit: boolean }[] = [];
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        const i = bi * 97 + c * 7 + r * 13;
        out.push({ x: b.x + 5 + c * 8, y: RIVER_Y - b.h + 8 + r * 11, i, lit: i % 11 < 6 });
      }
    }
    return out;
  }), []);

  return (
    <div aria-hidden="true" className="relative mt-6 overflow-hidden rounded-lg border border-primary-foreground/10 bg-primary-foreground/[0.03] px-2 pb-2 pt-3 md:px-3">
      <motion.div className="pointer-events-none absolute -inset-10" style={{ background: "radial-gradient(circle at 50% 30%, hsl(var(--accent) / 0.16), transparent 65%)" }} animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} />
      <svg viewBox="0 0 420 176" className="relative h-auto w-full" fill="none">
        <circle cx={372} cy={26} r={20} fill="hsl(var(--accent) / 0.07)" />
        <circle cx={372} cy={26} r={9} fill="hsl(var(--accent) / 0.8)" />
        {STARS.map((s, i) => (
          <motion.circle key={i} cx={s.x} cy={s.y} r={1.4} fill="hsl(var(--accent) / 0.8)" animate={{ opacity: [0.15, 0.9, 0.15] }} transition={{ duration: 3 + (i % 4), repeat: Infinity, ease: "easeInOut", delay: i * 0.6 }} />
        ))}
        {BUILDINGS.map((b, i) => (
          <rect key={i} x={b.x} y={RIVER_Y - b.h} width={b.w} height={b.h} fill="hsl(var(--primary-foreground) / 0.06)" stroke="hsl(var(--accent) / 0.22)" strokeWidth={1} />
        ))}
        <path d={`M240 ${RIVER_Y - 72} l26 0 l-13 -13 z`} fill="hsl(var(--primary-foreground) / 0.08)" stroke="hsl(var(--accent) / 0.3)" strokeWidth={1} />
        <line x1={123} y1={RIVER_Y - 78} x2={123} y2={RIVER_Y - 94} stroke="hsl(var(--accent) / 0.45)" strokeWidth={1.4} strokeLinecap="round" />
        <line x1={61} y1={RIVER_Y - 62} x2={61} y2={RIVER_Y - 74} stroke="hsl(var(--accent) / 0.4)" strokeWidth={1.2} strokeLinecap="round" />
        <motion.circle cx={123} cy={RIVER_Y - 96} r={2} fill="hsl(var(--accent) / 0.95)" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }} />
        <motion.circle cx={61} cy={RIVER_Y - 76} r={1.6} fill="hsl(var(--accent) / 0.85)" animate={{ opacity: [0.2, 0.95, 0.2] }} transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0.8 }} />
        {windows.map((wd) => wd.i % 3 === 0 && wd.lit ? (
          <motion.rect key={wd.i} x={wd.x} y={wd.y} width={3.5} height={4.5} rx={0.6} fill="hsl(var(--accent) / 0.9)" animate={{ opacity: [0.15, 1, 0.15] }} transition={{ duration: 2.5 + (wd.i % 4), repeat: Infinity, ease: "easeInOut", delay: (wd.i % 9) * 0.5 }} />
        ) : (
          <rect key={wd.i} x={wd.x} y={wd.y} width={3.5} height={4.5} rx={0.6} fill={wd.lit ? "hsl(var(--accent) / 0.3)" : "hsl(var(--primary-foreground) / 0.08)"} />
        ))}
        <rect x={0} y={RIVER_Y} width={420} height={38} fill="hsl(var(--primary-foreground) / 0.04)" />
        <rect x={0} y={RIVER_Y} width={420} height={1.4} fill="hsl(var(--accent) / 0.45)" />
        <rect x={100} y={145} width={220} height={3.5} rx={1.5} fill="hsl(var(--accent) / 0.35)" />
        {[108, 160, 212, 264].map((ax) => (
          <path key={ax} d={`M${ax} 148 q 26 20 52 0`} fill="none" stroke="hsl(var(--accent) / 0.4)" strokeWidth={2} />
        ))}
        {[118, 168, 218, 268].map((lx, i) => (
          <g key={lx}>
            <line x1={lx} y1={145} x2={lx} y2={138} stroke="hsl(var(--accent) / 0.4)" strokeWidth={1.2} />
            <motion.circle cx={lx} cy={136} r={2.2} fill="hsl(var(--accent) / 0.9)" animate={{ opacity: [0.35, 1, 0.35] }} transition={{ duration: 3 + i * 0.7, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }} />
          </g>
        ))}
        {[64, 122, 190, 250, 316, 378].map((rx, i) => (
          <motion.line key={rx} x1={rx} y1={152} x2={rx} y2={168} stroke="hsl(var(--accent) / 0.18)" strokeWidth={2.5} strokeLinecap="round" animate={{ opacity: [0.08, 0.3, 0.08], y: [0, 2, 0] }} transition={{ duration: 4 + i * 0.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.7 }} />
        ))}
        {[
          { x: 40, y: 150, w: 26, d: 5, delay: 0 },
          { x: 120, y: 162, w: 18, d: 6.5, delay: 1.2 },
          { x: 210, y: 156, w: 30, d: 5.5, delay: 2.4 },
          { x: 300, y: 166, w: 22, d: 7, delay: 0.6 },
          { x: 356, y: 152, w: 16, d: 6, delay: 3 },
          { x: 70, y: 170, w: 20, d: 6.8, delay: 1.8 },
        ].map((s, i) => (
          <motion.line key={i} x1={s.x} y1={s.y} x2={s.x + s.w} y2={s.y} stroke="hsl(var(--accent) / 0.35)" strokeWidth={1.2} strokeLinecap="round" animate={{ x: [0, 14, 0], opacity: [0.15, 0.6, 0.15] }} transition={{ duration: s.d, repeat: Infinity, ease: "easeInOut", delay: s.delay }} />
        ))}
        {[
          { x: 64, d: 8, delay: 0 },
          { x: 190, d: 9.5, delay: 2.6 },
          { x: 300, d: 8.5, delay: 5 },
        ].map((o, i) => (
          <motion.g key={i} animate={{ y: [0, -76], opacity: [0, 0.9, 0] }} transition={{ duration: o.d, repeat: Infinity, ease: "easeOut", delay: o.delay }}>
            <circle cx={o.x} cy={128} r={3} fill="hsl(var(--accent) / 0.9)" />
            <line x1={o.x} y1={131} x2={o.x} y2={140} stroke="hsl(var(--accent) / 0.35)" strokeWidth={1.4} strokeLinecap="round" />
          </motion.g>
        ))}
      </svg>
      <div className="relative mt-2 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-primary-foreground/45">built for limerick</div>
    </div>
  );
};

const HackathonCard = () => (
  <motion.article initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }} whileHover={{ y: -4 }} className="group relative overflow-hidden rounded-xl bg-primary p-6 text-primary-foreground md:p-8">
    <MatrixRain />
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-30 mix-blend-overlay" style={{ backgroundImage: "repeating-linear-gradient(0deg, hsl(var(--accent) / 0.08) 0px, hsl(var(--accent) / 0.08) 1px, transparent 1px, transparent 3px)" }} />
    {["left-3 top-3 border-l border-t", "right-3 top-3 border-r border-t", "bottom-3 left-3 border-b border-l", "bottom-3 right-3 border-b border-r"].map((c) => <div key={c} aria-hidden="true" className={`absolute h-3 w-3 border-accent/60 ${c}`} />)}
    <div className="relative">
      <div className="mb-4 flex items-center justify-between gap-3 text-xs font-semibold text-primary-foreground/70"><span className="flex items-center gap-2"><Code size={16} className="text-accent" /> 02</span></div>
      <h3 className="mb-2 text-xl font-semibold transition-all group-hover:[text-shadow:_2px_0_0_hsl(var(--accent)/0.8),_-2px_0_0_hsl(var(--primary)/0.8)] md:text-2xl">Swap'n'Serve Hackathon</h3>
      <div className="mb-4 flex items-center font-mono text-[12px] text-accent/90"><Terminal size={12} className="mr-1.5" /><span className="opacity-70">$</span><span className="ml-1.5">status --coming-soon</span><Cursor /></div>
      <p className="text-sm leading-relaxed text-primary-foreground/85">Teams build digital solutions to real problems facing Limerick, then pitch to a panel of judges for a cash prize. The aim is to bring the concept of a computer science hackathon into a more mainstream view and include a range of sectors such as Marketing , Finance &amp; Engineering students &amp; graduates into the space to solve these problems , compete and collaborate. Hopefully this may spark new start-ups, Employers will be present reviewing the talent and if suitable will be offering opportunities such as Internships, Placements &amp; Grants. Ultimately these teams will be competing for major cash prizes or valuable items like laptop's.</p>
      <TeamScene />
      <div className="mt-5 flex flex-wrap gap-2 font-mono text-[11px]">
        <span className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1.5 font-semibold text-accent">{"</>"} Real Limerick problems</span>
        <span className="rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-3 py-1.5">Open to all skill levels</span>
      </div>
    </div>
  </motion.article>
);

const Hanger = ({ delay, left, top, duration }: { delay: number; left: string; top: string; duration: number }) => (
  <motion.div aria-hidden="true" className="pointer-events-none absolute opacity-25 transition-opacity duration-500 group-hover:opacity-50" style={{ left, top }} animate={{ y: [0, -12, 0], rotate: [0, 5, -5, 0] }} transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}>
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--accent))" strokeWidth="1.5" strokeLinecap="round"><path d="M6 9l6-3 6 3" /><path d="M12 6V3" /><path d="M6 9v10a2 2 0 002 2h8a2 2 0 002-2V9" /></svg>
  </motion.div>
);

const RunwayModel = () => (
  <motion.div
    className="absolute left-1/2 h-[110px] w-9 origin-bottom md:h-[128px]"
    animate={{
      x: "-50%",
      bottom: ["34%", "19%", "19%", "19%"],
      scale: [0.4, 0.9, 0.9, 0.9],
      opacity: [0, 0.95, 0.95, 0],
    }}
    transition={{ duration: 9, times: [0, 0.28, 0.92, 1], repeat: Infinity, ease: "easeOut" }}
  >
    <motion.div
      className="h-full w-full"
      style={{ originY: "42%" }}
      animate={{ rotate: [-3.5, 3.5, -3.5], y: [0, -1.5, 0] }}
      transition={{ duration: 1.05, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg viewBox="0 0 60 150" className="h-full w-full overflow-visible" fill="none">
        <defs>
          <linearGradient id="gownGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="hsl(var(--accent))" stopOpacity="0.95" />
            <stop offset="1" stopColor="hsl(var(--accent))" stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id="sheenGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="hsl(var(--primary-foreground))" stopOpacity="0.55" />
            <stop offset="1" stopColor="hsl(var(--primary-foreground))" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        {/* upper body counter-rotates against the hips */}
        <motion.g
          fill="url(#gownGrad)"
          style={{ transformBox: "view-box", transformOrigin: "30px 24px" }}
          animate={{ rotate: [2.2, -2.2, 2.2] }}
          transition={{ duration: 1.05, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* flowing hair swept behind, with its own bounce */}
          <motion.path
            d="M26.5 5 C33.5 2.5 37 7 36.5 14 C38.5 24 37.5 34 33 41 C34.5 30.5 33.5 20 31.5 13 C30 9.5 28 8.5 26.2 10 Z"
            style={{ transformBox: "view-box", transformOrigin: "30px 8px" }}
            animate={{ rotate: [-5, 5, -5] }}
            transition={{ duration: 2.1, repeat: Infinity, ease: "easeInOut" }}
          />
          <ellipse cx="30" cy="10.5" rx="3.6" ry="4.5" />
          <rect x="28.7" y="14.5" width="2.6" height="3.8" rx="1.2" />
          <path d="M22.5 20 Q30 16.5 37.5 20 L36.3 40.5 Q30 43.5 23.7 40.5 Z" />
          {/* arm on hip */}
          <path d="M23.5 20 C17.5 26.5 15.5 36.5 21 46 L24 45 C19.5 37 21 28.5 26 23 Z" />
          {/* free arm swings gently */}
          <motion.path
            d="M37 20 C42.5 27.5 44.5 38.5 43 48.5 L39.8 48 C41.3 38.5 39.5 29.5 35 22.5 Z"
            style={{ transformBox: "view-box", transformOrigin: "37px 21px" }}
            animate={{ rotate: [-4, 4, -4] }}
            transition={{ duration: 1.05, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.g>
        {/* hips and skirt ride with the hip sway */}
        <g fill="url(#gownGrad)">
          <path d="M23.7 40.5 L36.3 40.5 Q39 47.5 37.5 55 Q30 59 22.5 55 Q21 47.5 23.7 40.5 Z" />
          <path d="M22.5 55 Q20.5 67 22 78 Q30 81.5 38 78 Q39.5 67 37.5 55 Q30 59 22.5 55 Z" />
        </g>
        {/* shimmer sweeping the dress */}
        <motion.g fill="url(#sheenGrad)" animate={{ opacity: [0, 0.4, 0] }} transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}>
          <path d="M22.5 20 Q30 16.5 37.5 20 L36.3 40.5 Q30 43.5 23.7 40.5 Z" />
          <path d="M22.5 55 Q20.5 67 22 78 Q30 81.5 38 78 Q39.5 67 37.5 55 Q30 59 22.5 55 Z" />
        </motion.g>
        {/* legs in mid-stride, subtle alternate kick */}
        <motion.g
          fill="url(#gownGrad)"
          style={{ transformBox: "view-box", transformOrigin: "27px 60px" }}
          animate={{ rotate: [3.5, -3.5, 3.5] }}
          transition={{ duration: 1.05, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M25 80 C23.5 97 23 116 24 133 L27.6 133 C27 116 27.5 97 29 80 Z" />
          <path d="M23 133 l-2.2 7 h3 l1.6 -5.5 z" />
        </motion.g>
        <motion.g
          fill="url(#gownGrad)"
          style={{ transformBox: "view-box", transformOrigin: "35px 60px" }}
          animate={{ rotate: [-3.5, 3.5, -3.5] }}
          transition={{ duration: 1.05, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M33.5 80 C36 95 38 111 40.5 126 L44 125 C41.5 109 38.5 92 36.5 80 Z" />
          <path d="M39.6 126 l-1.6 6.5 h3 l-1.4 -5.5 z" />
        </motion.g>
      </svg>
    </motion.div>
  </motion.div>
);

const Catwalk = () => (
  <div aria-hidden="true" className="relative mt-7 h-40 overflow-hidden rounded-lg border border-primary-foreground/10 bg-primary md:h-44">
    <div className="absolute inset-x-0 top-0 h-[38%]" style={{ background: "linear-gradient(180deg, hsl(var(--primary-foreground) / 0.06), hsl(var(--primary-foreground) / 0.01))" }} />
    <motion.div
      className="absolute left-1/2 top-[16%] h-12 w-16 -translate-x-1/2 rounded-t-full"
      style={{ background: "radial-gradient(ellipse at 50% 100%, hsl(var(--accent) / 0.5), hsl(var(--accent) / 0.08) 60%, transparent 80%)" }}
      animate={{ opacity: [0.55, 0.95, 0.55] }}
      transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
    />
    <div
      className="absolute inset-x-0 bottom-0 h-[62%]"
      style={{
        clipPath: "polygon(41% 0, 59% 0, 100% 100%, 0 100%)",
        background: "linear-gradient(180deg, hsl(var(--primary-foreground) / 0.02), hsl(var(--primary-foreground) / 0.16))",
      }}
    />
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 160" preserveAspectRatio="none" fill="none">
      <path d="M164 60 L8 160" stroke="hsl(var(--accent) / 0.5)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      <path d="M236 60 L392 160" stroke="hsl(var(--accent) / 0.5)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      <path d="M200 60 L200 160" stroke="hsl(var(--primary-foreground) / 0.25)" strokeWidth="1" strokeDasharray="6 8" vectorEffect="non-scaling-stroke" />
    </svg>
    <motion.div
      className="absolute -top-2 left-[4%] h-[135%] w-[46%] origin-top -rotate-12"
      style={{ background: "linear-gradient(180deg, hsl(var(--accent) / 0.12), transparent 78%)", clipPath: "polygon(42% 0, 58% 0, 100% 100%, 0 100%)" }}
      animate={{ opacity: [0.35, 0.75, 0.35] }}
      transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute -top-2 right-[4%] h-[135%] w-[46%] origin-top rotate-12"
      style={{ background: "linear-gradient(180deg, hsl(var(--accent) / 0.12), transparent 78%)", clipPath: "polygon(42% 0, 58% 0, 100% 100%, 0 100%)" }}
      animate={{ opacity: [0.6, 0.3, 0.6] }}
      transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
    />
    <div className="absolute bottom-0 left-1/2 h-16 w-40 -translate-x-1/2" style={{ background: "radial-gradient(ellipse at 50% 0%, hsl(var(--accent) / 0.35), transparent 70%)" }} />
    {Array.from({ length: 6 }).map((_, i) => (
      <span key={`cl${i}`} className="absolute h-1.5 w-1.5 rounded-full bg-primary-foreground/20" style={{ left: `${2 + i * 3.4}%`, bottom: `${8 + (i % 3) * 5}%` }} />
    ))}
    {Array.from({ length: 6 }).map((_, i) => (
      <span key={`cr${i}`} className="absolute h-1.5 w-1.5 rounded-full bg-primary-foreground/20" style={{ right: `${2 + i * 3.4}%`, bottom: `${16 + (i % 3) * 5}%` }} />
    ))}
    {Array.from({ length: 5 }).map((_, i) => (
      <motion.span
        key={`f${i}`}
        className={`absolute h-1.5 w-1.5 rounded-full bg-primary-foreground ${i % 2 ? "right-[8%]" : "left-[8%]"}`}
        style={{ top: `${22 + (i % 3) * 7}%` }}
        animate={{ opacity: [0, 0, 1, 0, 0], scale: [0.4, 0.4, 1.8, 0.4, 0.4] }}
        transition={{ duration: 9, times: [0, 0.24 + i * 0.03, 0.28 + i * 0.03, 0.32 + i * 0.03, 1], repeat: Infinity, ease: "easeOut" }}
      />
    ))}
    <RunwayModel />
    <div className="absolute inset-x-0 top-2.5 flex items-center justify-between px-3 text-[8px] font-semibold uppercase tracking-[0.3em] text-accent/80 md:text-[9px]">
      <span>Swap'n'Serve · The Show</span>
      <span>Vol. 03</span>
    </div>
  </div>
);

const SwapCard = () => (
  <motion.article initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }} whileHover={{ y: -4 }} className="group relative overflow-hidden rounded-xl bg-primary p-6 text-primary-foreground md:p-8">
    <svg viewBox="0 0 400 300" aria-hidden="true" preserveAspectRatio="xMidYMid slice" className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.12]">
      <g stroke="hsl(var(--primary-foreground))" strokeWidth="2" strokeLinecap="round" fill="none">
        <line x1="40" y1="60" x2="360" y2="60" /><line x1="40" y1="60" x2="40" y2="260" /><line x1="360" y1="60" x2="360" y2="260" />
        {[80, 130, 180, 230, 280, 330].map((x) => <path key={x} d={`M${x} 60 L${x} 75 M${x - 10} 75 Q${x} 65 ${x + 10} 75`} />)}
      </g>
    </svg>
    <Hanger delay={0} left="72%" top="12%" duration={5} />
    <Hanger delay={1.5} left="86%" top="48%" duration={6} />
    <Hanger delay={3} left="60%" top="70%" duration={7} />
    <motion.div aria-hidden="true" className="pointer-events-none absolute right-[12%] top-[30%]" animate={{ x: [0, 30, 0], opacity: [0.2, 0.6, 0.2] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}><ArrowLeftRight size={26} className="text-accent" /></motion.div>
    <motion.div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-30" style={{ background: "radial-gradient(circle, hsl(var(--accent) / 0.45), transparent 70%)" }} animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} />
    <motion.div aria-hidden="true" className="pointer-events-none absolute top-0 h-full w-[40%] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" style={{ background: "linear-gradient(90deg, transparent, hsl(var(--accent) / 0.25), transparent)" }} animate={{ left: ["-40%", "100%"] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }} />
    <div className="relative">
      <div className="mb-4 flex items-center justify-between gap-3 text-xs font-semibold"><span className="flex items-center gap-2 text-primary-foreground/70"><Shirt size={16} className="text-accent" /> 03</span>
        <span className="flex items-center gap-2 uppercase tracking-[0.16em] text-accent"><span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-accent" /></span>Coming Soon</span></div>
      <h3 className="mb-3 text-xl font-semibold md:text-2xl">Swap'N'Serve 3 &amp; Fashion Show</h3>
      <p className="text-sm leading-relaxed text-primary-foreground/85">Our flagship clothing redistribution event. Quality donated clothing, sorted by volunteers and offered at €1 per item or free where appropriate. No sign-up, no means testing. Every leftover piece is shared with local charities.<br /><br />We aim to deliver a new cool side project under this event&nbsp; by which as means of promotion we will use all of our donations as stock to facilitate a local fashion show, fully made out of donated second hand clothing.<br /><br />There will be lots of different opportunities for volunteers to make this come to life!</p>
      <Catwalk />
      <a href="#volunteer" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-accent underline underline-offset-4 transition-colors hover:text-primary-foreground">Sign up here <ArrowRight size={15} /></a>
      <a href="#how-it-works" className="mt-7 inline-flex items-center gap-2 rounded-full border border-accent bg-accent/10 px-4 py-2 text-sm font-semibold text-accent transition-colors hover:bg-accent hover:text-accent-foreground">See how it works <ArrowRight size={15} /></a>
    </div>
  </motion.article>
);

export default function ProgrammesSection() {
  return (
    <section id="programmes" className="border-b border-border bg-background py-16 md:py-24">
      <div className="container">
        <div className="mb-10 grid gap-5 border-b border-border pb-8 md:grid-cols-[1.2fr_1fr] md:items-end">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase text-primary">Our programmes</p>
            <h2 className="max-w-xl font-section text-3xl font-semibold leading-tight md:text-4xl">Built for the betterment of Limerick</h2>
          </div>
          <p className="max-w-lg text-base leading-relaxed text-muted-foreground">One umbrella, three pillars. Each programme reaches a different part of Limerick: grassroots, talent and enterprise, all under one mission.</p>
        </div>
        <div className="flex flex-col gap-8">
          <motion.article initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex min-w-0 flex-col rounded-xl bg-primary p-6 text-primary-foreground md:p-10">
            <div className="mb-10 flex items-center justify-between border-b border-primary-foreground/20 pb-4 text-xs font-semibold">
              <span className="flex items-center gap-2"><Trophy size={16} /> 01 / Community football</span>
              <span className="text-accent">Registration open</span>
            </div>
            <h3 className="sr-only">Swap'n'Serve Cup</h3>
            <div className="mb-8 w-fit">
              <img src={cupWordmark} alt="Swap'n'Serve" className="h-auto w-64 max-w-full" />
              <img src={cupSpray} alt="Cup" className="ml-auto h-16 w-auto" />
            </div>
            <p className="mb-5 max-w-3xl text-lg leading-relaxed text-primary-foreground/90">A 5-a-side community football tournament with €1,400 in prize money. Built to unite the city across every background and fund future Swap'N'Serve projects.</p>
            <div className="mb-8 border-y border-primary-foreground/20 py-6">
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.16em] text-accent">The prize money</p>
              <div className="grid gap-4 sm:grid-cols-3">
                {PRIZES.map((prize) => (
                  <div key={prize.label} className="flex min-w-0 flex-col items-center text-center">
                    <Banknote value={prize.amount} label={prize.label} serial={prize.serial} />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-auto flex flex-wrap items-end justify-between gap-x-8 gap-y-6">
              <div className="min-w-0">
                <p className="mb-6 text-sm text-primary-foreground/75">€10 per team member · 7 team members required</p>
                <div className="flex flex-wrap gap-3">
                  <Button asChild variant="secondary" size="lg"><Link to="/cup?src=programme-team">Register your team <ArrowRight /></Link></Button>
                  <Button asChild variant="ghost" size="lg" className="border border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"><Link to="/cup?src=programme-solo#solo">Register as an individual <UserPlus /></Link></Button>
                </div>
                <Link to="/cup/format" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary-foreground/80 hover:text-primary-foreground">View the tournament <ArrowRight size={15} /></Link>
              </div>
              <div className="min-w-0 text-right">
                <p className="font-cup-display text-5xl font-bold uppercase leading-none tracking-tight text-primary-foreground md:text-6xl">32 <span className="text-accent">teams</span></p>
                <p className="mt-3 text-xs text-primary-foreground/70">5-a-side · 2 subs · rolling subs</p>
              </div>
            </div>
          </motion.article>
          <div className="grid min-w-0 gap-6 md:grid-cols-2">
            <HackathonCard />
            <SwapCard />
          </div>
        </div>
      </div>
    </section>
  );
}
