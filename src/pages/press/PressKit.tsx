import { Download, ExternalLink, Printer } from "lucide-react";
import PressLayout from "@/components/press/PressLayout";
import PressSeo from "@/components/press/PressSeo";
import CopyButton from "@/components/press/CopyButton";
import {
  ASSET_CREDIT,
  BOILERPLATE,
  CUP_EVENT,
  KEY_FACTS,
  ONE_LINER,
  PAST_COVERAGE,
  PRESS_ASSETS,
  QUOTES,
  TIMELINE,
} from "@/content";
import pressPlaceholder from "@/assets/press/press-placeholder.jpg";

const PressKit = () => (
  <PressLayout>
    <PressSeo
      title="Press Kit | Swap 'N' Serve"
      description={ONE_LINER}
      path="/press/kit"
    />
    <div className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Press kit</p>
          <h1 className="mt-3 font-press-serif text-4xl font-semibold tracking-tight md:text-5xl">
            Everything you need to write the story
          </h1>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="no-print inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Printer className="h-4 w-4" aria-hidden /> Download full press kit (PDF)
        </button>
      </div>

      {/* One-liner */}
      <section className="mt-12">
        <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-primary">The story in one line</h2>
        <p className="mt-3 font-press-serif text-2xl font-semibold leading-snug">{ONE_LINER}</p>
        <CopyButton className="mt-4" label="Copy summary" text={ONE_LINER} />
      </section>

      {/* Boilerplate */}
      <section className="mt-12 border-t border-border pt-10">
        <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Boilerplate</h2>
        <p className="mt-3 text-base leading-relaxed text-foreground/90">{BOILERPLATE}</p>
        <CopyButton className="mt-4" label="Copy boilerplate" text={BOILERPLATE} />
      </section>

      {/* Key facts */}
      <section className="mt-12 border-t border-border pt-10">
        <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Key facts</h2>
        <ul className="mt-4 space-y-3">
          {KEY_FACTS.map((fact) => (
            <li key={fact} className="flex items-start justify-between gap-4 rounded-lg border border-border bg-card p-4">
              <p className="text-sm leading-relaxed text-foreground/90">{fact}</p>
              <CopyButton text={fact} className="shrink-0" />
            </li>
          ))}
        </ul>
      </section>

      {/* Quotes */}
      <section className="mt-12 border-t border-border pt-10">
        <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Quotes, free to use</h2>
        <div className="mt-4 space-y-4">
          {QUOTES.map((q) => (
            <figure key={q.text} className="rounded-lg border border-border bg-card p-5">
              <blockquote className="font-press-serif text-lg leading-relaxed">"{q.text}"</blockquote>
              <figcaption className="mt-2 text-sm text-muted-foreground">– {q.attribution}</figcaption>
              <CopyButton className="mt-3" label="Copy with attribution" text={`"${q.text}" – ${q.attribution}`} />
            </figure>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="mt-12 border-t border-border pt-10">
        <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Timeline</h2>
        <ol className="mt-4 space-y-0">
          {TIMELINE.map((t) => (
            <li key={t.when} className="relative border-l-2 border-primary/30 pb-6 pl-6 last:pb-0">
              <span className="absolute -left-[7px] top-1 h-3 w-3 rounded-full bg-accent ring-2 ring-background" aria-hidden />
              <p className="text-xs font-bold uppercase tracking-wide text-primary">{t.when}</p>
              <p className="mt-1 text-sm leading-relaxed text-foreground/90">{t.what}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* The Cup */}
      <section className="mt-12 border-t border-border pt-10">
        <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-primary">The Swap 'N' Serve Cup</h2>
        <ul className="mt-4 space-y-2 text-sm leading-relaxed text-foreground/90">
          <li><strong>What:</strong> {CUP_EVENT.what}</li>
          <li><strong>When:</strong> {CUP_EVENT.date}</li>
          <li><strong>Where:</strong> {CUP_EVENT.where}</li>
          <li><strong>Enter a team:</strong> {CUP_EVENT.enter}</li>
          <li><strong>Prizes:</strong> {CUP_EVENT.prizes}</li>
          <li><strong>Media:</strong> {CUP_EVENT.media}</li>
        </ul>
      </section>

      {/* Assets */}
      <section className="mt-12 border-t border-border pt-10">
        <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Photos</h2>
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {PRESS_ASSETS.map((asset) => (
            <figure key={asset.title} className="overflow-hidden rounded-xl border border-border bg-card">
              <img
                src={pressPlaceholder}
                alt={`${asset.title} (placeholder, final photo coming soon)`}
                loading="lazy"
                width={1200}
                height={912}
                className="aspect-[4/3] w-full object-cover"
              />
              <figcaption className="p-4">
                <p className="text-sm font-semibold">{asset.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{ASSET_CREDIT}</p>
                <a
                  href={pressPlaceholder}
                  download={`${asset.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.jpg`}
                  className="no-print mt-3 inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold hover:border-primary hover:text-primary"
                >
                  <Download className="h-3.5 w-3.5" aria-hidden /> Download
                </a>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Past coverage */}
      <section className="mt-12 border-t border-border pt-10">
        <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Past coverage</h2>
        <ul className="mt-4 space-y-3">
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
                  <p className="mt-1 text-sm font-medium leading-relaxed text-foreground group-hover:text-primary">{c.title}</p>
                </div>
                <ExternalLink className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  </PressLayout>
);

export default PressKit;
