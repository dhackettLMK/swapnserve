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
    const chars = "10{}<>/=;_$#01ABCDEF".split("");
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

const HackathonCard = () => (
  <motion.article initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }} whileHover={{ y: -4 }} className="group relative overflow-hidden rounded-xl bg-primary p-6 text-primary-foreground md:p-8">
    <MatrixRain />
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-30 mix-blend-overlay" style={{ backgroundImage: "repeating-linear-gradient(0deg, hsl(var(--accent) / 0.08) 0px, hsl(var(--accent) / 0.08) 1px, transparent 1px, transparent 3px)" }} />
    {["left-3 top-3 border-l border-t", "right-3 top-3 border-r border-t", "bottom-3 left-3 border-b border-l", "bottom-3 right-3 border-b border-r"].map((c) => <div key={c} aria-hidden="true" className={`absolute h-3 w-3 border-accent/60 ${c}`} />)}
    <div className="relative">
      <div className="mb-4 flex items-center justify-between gap-3 text-xs font-semibold text-primary-foreground/70"><span className="flex items-center gap-2"><Code size={16} className="text-accent" /> 02</span></div>
      <h3 className="mb-2 text-xl font-semibold transition-all group-hover:[text-shadow:_2px_0_0_hsl(var(--accent)/0.8),_-2px_0_0_hsl(var(--primary)/0.8)] md:text-2xl">Swap'n'Serve Hackathon</h3>
      <div className="mb-4 flex items-center font-mono text-[12px] text-accent/90"><Terminal size={12} className="mr-1.5" /><span className="opacity-70">$</span><span className="ml-1.5">status --coming-soon</span><Cursor /></div>
      <p className="text-sm leading-relaxed text-primary-foreground/85">Teams build digital solutions to real problems facing Limerick, then pitch to a panel of judges for a cash prize. Hosted at The Engine, Limerick's Local Enterprise Office, to develop skills and turn ideas into something tangible.</p>
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
      <h3 className="mb-3 text-xl font-semibold md:text-2xl">Swap'N'Serve 3</h3>
      <p className="text-sm leading-relaxed text-primary-foreground/85">Our flagship clothing redistribution event. Quality donated clothing, sorted by volunteers and offered at €1 per item or free where appropriate. No sign-up, no means testing. Every leftover piece is shared with local charities.</p>
      <a href="#how-it-works" className="mt-5 inline-flex items-center gap-2 rounded-full border border-accent bg-accent/10 px-4 py-2 text-sm font-semibold text-accent transition-colors hover:bg-accent hover:text-accent-foreground">See how it works <ArrowRight size={15} /></a>
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
