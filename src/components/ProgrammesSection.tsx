import { motion } from "framer-motion";
import { Shirt, Trophy, Code, Terminal, ArrowLeftRight } from "lucide-react";
import { useMemo } from "react";

/* -------------------------------------------------------------------------- */
/*  Clothing Flagship — boutique / wardrobe card                              */
/* -------------------------------------------------------------------------- */

const WardrobeBackdrop = () => (
  <svg
    viewBox="0 0 400 300"
    className="absolute inset-0 w-full h-full opacity-[0.10] pointer-events-none"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
  >
    {/* Clothing rack bar */}
    <line x1="40" y1="60" x2="360" y2="60" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" />
    {/* Rack uprights */}
    <line x1="40" y1="60" x2="40" y2="260" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" />
    <line x1="360" y1="60" x2="360" y2="260" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" />
    {/* Rack feet */}
    <line x1="25" y1="260" x2="55" y2="260" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" />
    <line x1="345" y1="260" x2="375" y2="260" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" />
    {/* Hangers */}
    {[80, 130, 180, 230, 280].map((x, i) => (
      <g key={i}>
        <path d={`M${x} 60 L${x} 75`} stroke="hsl(var(--primary))" strokeWidth="1.5" />
        <path d={`M${x - 10} 75 Q${x} 65 ${x + 10} 75`} fill="none" stroke="hsl(var(--primary))" strokeWidth="1.5" />
      </g>
    ))}
  </svg>
);

const FloatingGarments = () => {
  const garments = useMemo(
    () => [
      { emoji: "👕", left: 12, top: 18, size: 22, delay: 0, duration: 7 },
      { emoji: "👖", left: 78, top: 22, size: 20, delay: 1.5, duration: 8 },
      { emoji: "🧥", left: 65, top: 55, size: 24, delay: 0.8, duration: 9 },
      { emoji: "👗", left: 22, top: 60, size: 20, delay: 2.2, duration: 7.5 },
      { emoji: "🧣", left: 88, top: 45, size: 16, delay: 3, duration: 6 },
      { emoji: "👚", left: 8, top: 75, size: 18, delay: 1, duration: 8.5 },
    ],
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {garments.map((g, i) => (
        <motion.span
          key={i}
          className="absolute select-none opacity-0 group-hover:opacity-40 transition-opacity duration-700"
          style={{
            left: `${g.left}%`,
            top: `${g.top}%`,
            fontSize: g.size,
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.15))",
          }}
          animate={{
            y: [0, -14, 0, 8, 0],
            x: [0, 6, -4, 2, 0],
            rotate: [0, 6, -4, 2, 0],
          }}
          transition={{
            duration: g.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: g.delay,
          }}
        >
          {g.emoji}
        </motion.span>
      ))}
    </div>
  );
};

const SwapFlow = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
    <motion.div
      className="absolute top-1/2 left-[15%] -translate-y-1/2"
      animate={{ x: [0, 40, 0], opacity: [0.3, 0.7, 0.3] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      <ArrowLeftRight size={28} className="text-primary/40" />
    </motion.div>
    <motion.div
      className="absolute top-1/3 right-[20%]"
      animate={{ y: [0, 20, 0], opacity: [0.2, 0.5, 0.2] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
    >
      <ArrowLeftRight size={20} className="text-secondary/40 rotate-90" />
    </motion.div>
  </div>
);

const WarmGlow = () => (
  <motion.div
    aria-hidden="true"
    className="absolute -top-20 -right-20 w-72 h-72 rounded-full pointer-events-none opacity-0 group-hover:opacity-40 transition-opacity duration-700"
    style={{
      background: "radial-gradient(circle, hsl(var(--secondary) / 0.35), transparent 70%)",
    }}
    animate={{ scale: [1, 1.15, 1] }}
    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
  />
);

const FlagshipCard = () => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    whileHover={{ y: -6, transition: { duration: 0.25 } }}
    className="group relative rounded-3xl border border-border bg-gradient-to-br from-card via-card to-[hsl(var(--secondary)_/_0.08)] p-8 shadow-sm hover-lift hover:shadow-xl hover:shadow-secondary/10 overflow-hidden"
  >
    <WardrobeBackdrop />
    <FloatingGarments />
    <SwapFlow />
    <WarmGlow />

    <div className="absolute top-5 right-5 inline-flex items-center rounded-full bg-secondary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-secondary border border-secondary/20">
      Flagship Event
    </div>

    <div className="relative">
      <motion.div
        className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5"
        whileHover={{ rotate: [0, -6, 6, -3, 3, 0], scale: 1.05 }}
        transition={{ duration: 0.6 }}
      >
        <Shirt size={26} className="text-primary drop-shadow-[0_0_6px_hsl(var(--primary)/0.4)]" />
      </motion.div>

      <h3 className="text-2xl font-section font-bold text-foreground mb-3">
        The Clothing Swap
      </h3>

      <p className="text-muted-foreground leading-relaxed mb-6">
        Our flagship event. We gather clean, usable clothing from across Limerick and
        redistribute it to families and individuals, no questions asked. A simple,
        respectful exchange rooted in dignity and circular fashion.
      </p>

      <a
        href="#how-it-works"
        className="inline-flex items-center rounded-full border border-primary bg-primary/5 px-5 py-2.5 text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground hover:scale-[1.02] active:scale-[0.98]"
      >
        See how it works
      </a>
    </div>
  </motion.div>
);

/* -------------------------------------------------------------------------- */
/*  Swap'n'Serve Cup — world-cup inspired stadium card                        */
/* -------------------------------------------------------------------------- */

const StadiumBackdrop = () => (
  <svg
    viewBox="0 0 400 300"
    className="absolute inset-0 w-full h-full opacity-[0.12] pointer-events-none"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
  >
    {/* Pitch outline */}
    <rect x="20" y="40" width="360" height="220" rx="6" fill="none" stroke="hsl(var(--accent))" strokeWidth="1.5" />
    {/* Halfway line */}
    <line x1="200" y1="40" x2="200" y2="260" stroke="hsl(var(--accent))" strokeWidth="1.5" />
    {/* Centre circle */}
    <circle cx="200" cy="150" r="42" fill="none" stroke="hsl(var(--accent))" strokeWidth="1.5" />
    <circle cx="200" cy="150" r="2" fill="hsl(var(--accent))" />
    {/* Penalty boxes */}
    <rect x="20" y="95" width="55" height="110" fill="none" stroke="hsl(var(--accent))" strokeWidth="1.5" />
    <rect x="325" y="95" width="55" height="110" fill="none" stroke="hsl(var(--accent))" strokeWidth="1.5" />
    {/* Goal boxes */}
    <rect x="20" y="125" width="20" height="50" fill="none" stroke="hsl(var(--accent))" strokeWidth="1.5" />
    <rect x="360" y="125" width="20" height="50" fill="none" stroke="hsl(var(--accent))" strokeWidth="1.5" />
  </svg>
);

const Spotlight = ({ delay }: { delay: number }) => (
  <motion.div
    aria-hidden="true"
    className="absolute -top-32 left-1/2 w-[120%] h-[140%] pointer-events-none"
    style={{
      background:
        "radial-gradient(ellipse 25% 60% at center top, hsl(var(--accent) / 0.22), transparent 70%)",
      transformOrigin: "50% 0%",
    }}
    animate={{ rotate: [-18, 18, -18] }}
    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay }}
  />
);

const Football = () => (
  <motion.div
    className="absolute top-6 right-6 text-3xl select-none pointer-events-none drop-shadow-[0_4px_10px_rgba(0,0,0,0.35)]"
    initial={{ y: 0, rotate: 0 }}
    animate={{ y: [0, -10, 0], rotate: [0, 360] }}
    transition={{
      y: { duration: 1.6, repeat: Infinity, ease: "easeInOut" },
      rotate: { duration: 4, repeat: Infinity, ease: "linear" },
    }}
  >
    ⚽
  </motion.div>
);

const Confetti = () => {
  const pieces = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 4,
        duration: 4 + Math.random() * 3,
        color: ["hsl(var(--accent))", "hsl(var(--secondary))", "hsl(0 0% 100%)"][i % 3],
        size: 4 + Math.random() * 4,
      })),
    []
  );
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      {pieces.map((p, i) => (
        <motion.span
          key={i}
          className="absolute rounded-sm"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            top: "100%",
            backgroundColor: p.color,
          }}
          animate={{ y: [-0, -320], opacity: [0, 1, 0], rotate: [0, 360] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "easeOut" }}
        />
      ))}
    </div>
  );
};

const CupCard = () => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: 0.1 }}
    whileHover={{ y: -6, transition: { duration: 0.25 } }}
    className="group relative rounded-3xl border border-accent/30 bg-gradient-to-br from-primary via-primary to-[hsl(152_50%_22%)] p-8 shadow-sm hover-lift hover:shadow-xl hover:shadow-primary/30 overflow-hidden"
  >
    <StadiumBackdrop />
    <Spotlight delay={0} />
    <Spotlight delay={2} />
    <Confetti />
    <Football />

    <div className="relative">
      <motion.div
        className="w-14 h-14 rounded-2xl bg-accent/15 border border-accent/30 flex items-center justify-center mb-5"
        whileHover={{ rotate: [0, -8, 8, 0], scale: 1.05 }}
        transition={{ duration: 0.6 }}
      >
        <Trophy size={26} className="text-accent drop-shadow-[0_0_8px_hsl(var(--accent)/0.6)]" />
      </motion.div>

      <h3 className="text-2xl font-section font-bold text-primary-foreground mb-1">
        Swap'n'Serve Cup
      </h3>

      <div className="flex items-center gap-2 mb-4">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
        </span>
        <p
          className="text-sm font-semibold uppercase tracking-[0.18em]"
          style={{ color: "hsl(var(--accent))" }}
        >
          Coming Soon
        </p>
      </div>

      <p className="text-primary-foreground/85 leading-relaxed mb-4">
        A community football tournament with a €1,000 prize pot, bringing Limerick
        together on the pitch.
      </p>
      <p className="text-primary-foreground/75 leading-relaxed mb-6">
        Beyond the final whistle, we'll be installing permanent goals into the local
        community, so neighbours of every age can keep enjoying the game long after
        the trophy is lifted.
      </p>

      <div className="flex flex-wrap gap-2">
        <motion.span
          whileHover={{ scale: 1.06 }}
          className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent"
        >
          <Trophy size={11} /> €1,000 prize
        </motion.span>
        <motion.span
          whileHover={{ scale: 1.06 }}
          className="inline-flex items-center rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-3 py-1.5 text-xs font-medium text-primary-foreground/90"
        >
          Permanent goals installed
        </motion.span>
        <motion.span
          whileHover={{ scale: 1.06 }}
          className="inline-flex items-center rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-3 py-1.5 text-xs font-medium text-primary-foreground/90"
        >
          For the whole community
        </motion.span>
      </div>
    </div>
  </motion.div>
);

/* -------------------------------------------------------------------------- */
/*  Swap'n'Serve Hackathon — terminal / matrix-rain card                      */
/* -------------------------------------------------------------------------- */

const MatrixRain = () => {
  const columns = useMemo(() => {
    const chars = "10{}<>/=;_$#01ABCDEF".split("");
    return Array.from({ length: 14 }).map((_, i) => ({
      left: (i / 14) * 100 + Math.random() * 3,
      duration: 6 + Math.random() * 6,
      delay: Math.random() * 5,
      glyphs: Array.from({ length: 18 }).map(
        () => chars[Math.floor(Math.random() * chars.length)]
      ),
    }));
  }, []);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.18] group-hover:opacity-[0.35] transition-opacity duration-500">
      {columns.map((col, i) => (
        <motion.div
          key={i}
          className="absolute -top-1/2 font-mono text-[11px] leading-[1.1] text-accent whitespace-pre"
          style={{ left: `${col.left}%` }}
          animate={{ y: ["0%", "220%"] }}
          transition={{
            duration: col.duration,
            repeat: Infinity,
            ease: "linear",
            delay: col.delay,
          }}
        >
          {col.glyphs.map((g, j) => (
            <div
              key={j}
              style={{ opacity: 1 - j / col.glyphs.length }}
            >
              {g}
            </div>
          ))}
        </motion.div>
      ))}
    </div>
  );
};

const Cursor = () => (
  <motion.span
    aria-hidden="true"
    className="inline-block w-[7px] h-[14px] bg-accent ml-1 align-middle"
    animate={{ opacity: [1, 0, 1] }}
    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
  />
);

const HackathonCard = () => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: 0.2 }}
    whileHover={{ y: -6, transition: { duration: 0.25 } }}
    className="group relative rounded-3xl border border-accent/30 bg-gradient-to-br from-[hsl(152_45%_18%)] via-primary to-primary/90 p-8 shadow-sm hover-lift hover:shadow-xl hover:shadow-primary/30 overflow-hidden"
  >
    <MatrixRain />

    {/* Scanline overlay */}
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none opacity-30 mix-blend-overlay"
      style={{
        backgroundImage:
          "repeating-linear-gradient(0deg, hsl(var(--accent) / 0.08) 0px, hsl(var(--accent) / 0.08) 1px, transparent 1px, transparent 3px)",
      }}
    />

    {/* Corner brackets — terminal chrome */}
    {(["top-3 left-3", "top-3 right-3", "bottom-3 left-3", "bottom-3 right-3"] as const).map(
      (pos, i) => (
        <div
          key={i}
          aria-hidden="true"
          className={`absolute ${pos} w-3 h-3 border-accent/60 ${
            i === 0
              ? "border-l border-t"
              : i === 1
              ? "border-r border-t"
              : i === 2
              ? "border-l border-b"
              : "border-r border-b"
          }`}
        />
      )
    )}

    <div className="relative">
      <motion.div
        className="w-14 h-14 rounded-2xl bg-accent/15 border border-accent/30 flex items-center justify-center mb-5"
        whileHover={{ rotate: [0, -4, 4, -2, 2, 0] }}
        transition={{ duration: 0.4 }}
      >
        <Code size={26} className="text-accent drop-shadow-[0_0_8px_hsl(var(--accent)/0.6)]" />
      </motion.div>

      <h3 className="text-2xl font-section font-bold text-primary-foreground mb-1 group-hover:[text-shadow:_2px_0_0_hsl(var(--accent)/0.8),_-2px_0_0_hsl(var(--secondary)/0.6)] transition-all">
        Swap'n'Serve Hackathon
      </h3>

      <div className="font-mono text-[12px] text-accent/90 mb-4 flex items-center">
        <Terminal size={12} className="mr-1.5" />
        <span className="opacity-70">$</span>
        <span className="ml-1.5">status --coming-soon</span>
        <Cursor />
      </div>

      <p className="text-primary-foreground/85 leading-relaxed mb-4">
        A hands-on tech event bringing Limerick's builders and problem-solvers together
        to create tools that serve our city.
      </p>
      <p className="text-primary-foreground/75 leading-relaxed mb-6">
        We're partnering with a YC-backed company founded right here in Limerick City,
        giving participants mentorship from founders who started where they stand.
      </p>

      <div className="flex flex-wrap gap-2">
        <motion.span
          whileHover={{ scale: 1.06 }}
          className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3 py-1.5 font-mono text-[11px] font-semibold text-accent"
        >
          <span className="opacity-70">{"</>"}</span> YC-backed partner
        </motion.span>
        <motion.span
          whileHover={{ scale: 1.06 }}
          className="inline-flex items-center rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-3 py-1.5 font-mono text-[11px] font-medium text-primary-foreground/90"
        >
          Limerick-founded
        </motion.span>
        <motion.span
          whileHover={{ scale: 1.06 }}
          className="inline-flex items-center rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-3 py-1.5 font-mono text-[11px] font-medium text-primary-foreground/90"
        >
          Open to all skill levels
        </motion.span>
      </div>
    </div>
  </motion.div>
);

/* -------------------------------------------------------------------------- */

const ProgrammesSection = () => {
  return (
    <section id="programmes" className="py-20 md:py-28 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block rounded-full bg-primary/10 text-primary px-4 py-1.5 text-xs font-semibold uppercase tracking-wider mb-4">
            Our Programmes
          </span>
          <h2 className="text-3xl md:text-4xl font-section font-bold text-foreground mb-4">
            Built for the Betterment of Limerick
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Swap'n'Serve is a nonprofit organisation running community programmes that put
            dignity, sustainability, and neighbourhood pride first.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Flagship: Clothing Swap */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -6, transition: { duration: 0.25 } }}
            className="relative rounded-3xl border border-border bg-card p-8 shadow-sm hover-lift hover:shadow-lg hover:shadow-primary/5 overflow-hidden"
          >
            <div className="absolute top-5 right-5 inline-flex items-center rounded-full bg-secondary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-secondary">
              Flagship Event
            </div>
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
              <Shirt size={26} className="text-primary" />
            </div>
            <h3 className="text-2xl font-section font-bold text-foreground mb-3">
              The Clothing Swap
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Our flagship event. We gather clean, usable clothing from across Limerick and
              redistribute it to families and individuals, no questions asked. A simple,
              respectful exchange rooted in dignity and circular fashion.
            </p>
            <a
              href="#how-it-works"
              className="inline-flex items-center rounded-full border border-primary bg-primary/5 px-5 py-2.5 text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground hover:scale-[1.02] active:scale-[0.98]"
            >
              See how it works
            </a>
          </motion.div>

          <CupCard />
          <HackathonCard />
        </div>
      </div>
    </section>
  );
};

export default ProgrammesSection;
