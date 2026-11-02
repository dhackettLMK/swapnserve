import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, MapPin, ExternalLink } from "lucide-react";
import PressLayout from "@/components/press/PressLayout";
import PressSeo from "@/components/press/PressSeo";
import CopyButton from "@/components/press/CopyButton";
import PersonCard from "@/components/press/PersonCard";
import {
  CONTACT,
  CUP_EVENT,
  KEY_FACTS,
  ONE_LINER,
  PAST_COVERAGE,
  PEOPLE,
  PERSON_CATEGORIES,
  QUOTES,
  STANDFIRST,
  STORY_IN_BRIEF,
  type PersonCategory,
} from "@/content";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, ease: "easeOut" as const },
};

const PressHome = () => {
  const [filter, setFilter] = useState<PersonCategory | "All">("All");
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  }, [hash]);

  const people =
    filter === "All" ? PEOPLE : PEOPLE.filter((p) => p.category === filter);

  return (
    <PressLayout>
      <PressSeo
        title="Limerick's Hidden Talent | Swap 'N' Serve Press Room"
        description={ONE_LINER}
        path="/press"
      />

      {/* Hero */}
      <section className="border-b border-border">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-24">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary"
          >
            <CalendarDays className="h-3.5 w-3.5" aria-hidden />
            Swap 'N' Serve Cup · Sat 5 Dec 2026 · Summerville Rovers F.C.
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mt-6 max-w-3xl font-press-serif text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl"
          >
            Limerick's Hidden Talent
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 max-w-2xl text-lg leading-relaxed text-foreground/80 md:text-xl"
          >
            {STANDFIRST}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="no-print mt-8 flex flex-wrap items-center gap-3"
          >
            <a
              href="#story"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Read the story <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
            <Link
              to="/press/kit"
              className="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              Download press kit
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Story in brief */}
      <section id="story" className="border-b border-border">
        <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
          <motion.div {...fadeUp}>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">The story in brief</p>
            {STORY_IN_BRIEF.map((para, i) => (
              <p key={i} className="mt-5 text-lg leading-relaxed text-foreground/90 first:mt-6">
                {para}
              </p>
            ))}
            <CopyButton className="mt-6" label="Copy this summary" text={STORY_IN_BRIEF.join("\n\n")} />
          </motion.div>
        </div>
      </section>

      {/* People */}
      <section id="people" className="border-b border-border bg-card/50">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <motion.div {...fadeUp}>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">The people</p>
            <h2 className="mt-3 font-press-serif text-3xl font-semibold tracking-tight md:text-5xl">
              Seventeen people delivering the day
            </h2>
            <p className="mt-3 max-w-2xl text-sm italic text-muted-foreground">
              Descriptions are in David's words and may be quoted directly.
            </p>
          </motion.div>
          <div className="no-print mt-8 flex flex-wrap gap-2" role="group" aria-label="Filter people by category">
            {(["All", ...PERSON_CATEGORIES] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilter(cat)}
                aria-pressed={filter === cat}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                  filter === cat
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground hover:border-primary hover:text-primary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {people.map((p) => (
              <motion.div key={p.slug} {...fadeUp}>
                <PersonCard person={p} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Key facts */}
      <section className="border-b border-border">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <motion.div {...fadeUp}>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Key facts</p>
            <h2 className="mt-3 font-press-serif text-3xl font-semibold tracking-tight md:text-4xl">
              The numbers, ready to paste
            </h2>
          </motion.div>
          <ul className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            {KEY_FACTS.map((fact) => (
              <motion.li
                key={fact}
                {...fadeUp}
                className="flex items-start justify-between gap-4 rounded-xl border border-border bg-card p-5"
              >
                <p className="text-sm leading-relaxed text-foreground/90">{fact}</p>
                <CopyButton text={fact} className="shrink-0" />
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* Quotes */}
      <section className="border-b border-border bg-primary text-primary-foreground">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <motion.div {...fadeUp}>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Quotes, free to use</p>
            <h2 className="mt-3 font-press-serif text-3xl font-semibold tracking-tight md:text-4xl">
              In David's words
            </h2>
          </motion.div>
          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
            {QUOTES.map((q) => (
              <motion.figure
                key={q.text}
                {...fadeUp}
                className="flex flex-col rounded-xl bg-primary-foreground/10 p-6 ring-1 ring-primary-foreground/15"
              >
                <blockquote className="font-press-serif text-lg leading-relaxed">
                  "{q.text}"
                </blockquote>
                <figcaption className="mt-4 text-sm text-primary-foreground/80">– {q.attribution}</figcaption>
                <CopyButton
                  className="mt-5 self-start border-primary-foreground/30 bg-transparent text-primary-foreground hover:border-accent hover:text-accent"
                  label="Copy with attribution"
                  text={`"${q.text}" – ${q.attribution}`}
                />
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      {/* Coming up */}
      <section className="border-b border-border">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <motion.div {...fadeUp}>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Coming up</p>
            <div className="mt-4 rounded-2xl border border-border bg-card p-6 md:p-10">
              <h2 className="font-press-serif text-3xl font-semibold tracking-tight md:text-4xl">
                {CUP_EVENT.name}
              </h2>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-foreground/80">
                {CUP_EVENT.what.charAt(0).toUpperCase() + CUP_EVENT.what.slice(1)}.
              </p>
              <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-wide text-muted-foreground">When</dt>
                    <dd className="text-sm font-medium">{CUP_EVENT.date}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Where</dt>
                    <dd className="text-sm font-medium">{CUP_EVENT.where}</dd>
                  </div>
                </div>
              </dl>
              <p className="mt-6 text-sm font-semibold text-primary">Prizes: {CUP_EVENT.prizes}.</p>
              <div className="no-print mt-6 flex flex-wrap gap-3">
                <Link
                  to="/press/cup"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Full event details <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                <CopyButton
                  label="Copy event summary"
                  text={`${CUP_EVENT.name}: ${CUP_EVENT.what}. ${CUP_EVENT.date}, ${CUP_EVENT.where}. Prizes: ${CUP_EVENT.prizes}. Enter a team: ${CUP_EVENT.enter}. ${CUP_EVENT.media}.`}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Past coverage */}
      <section className="border-b border-border bg-card/50">
        <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
          <motion.div {...fadeUp}>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Past coverage</p>
            <h2 className="mt-3 font-press-serif text-3xl font-semibold tracking-tight">Previously in the press</h2>
            <ul className="mt-8 space-y-5">
              {PAST_COVERAGE.map((c) => (
                <li key={c.url}>
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start justify-between gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary"
                  >
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-primary">{c.outlet}</p>
                      <p className="mt-1 text-sm font-medium leading-relaxed text-foreground group-hover:text-primary">
                        {c.title}
                      </p>
                    </div>
                    <ExternalLink className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Contact strip */}
      <section>
        <div className="mx-auto w-full max-w-3xl px-4 py-16 text-center sm:px-6">
          <motion.div {...fadeUp}>
            <h2 className="font-press-serif text-3xl font-semibold tracking-tight">Speak to David</h2>
            <p className="mt-3 text-base text-foreground/80">
              {CONTACT.name}, {CONTACT.role}. {CONTACT.note}
            </p>
            <a
              href={`mailto:${CONTACT.email}`}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              {CONTACT.email}
            </a>
          </motion.div>
        </div>
      </section>
    </PressLayout>
  );
};

export default PressHome;
