import { OFFICIAL_STATEMENT } from "@/content/mission";

export default function OfficialStatement() {
  return (
    <section id="official-statement" aria-labelledby="statement-title" className="scroll-mt-28 border-b border-border bg-background py-14 md:py-20">
      <div className="container grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16">
        <div>
          <p className="mb-4 text-xs font-semibold uppercase text-primary">Our purpose. Our responsibility.</p>
          <h2 id="statement-title" className="max-w-lg font-section text-3xl font-semibold leading-tight md:text-4xl">Official Swap'N'Serve statement</h2>
        </div>
        <div className="max-w-3xl">
          <div className="space-y-6 text-base leading-loose text-foreground md:text-lg">
            {OFFICIAL_STATEMENT.split(/\n\s*\n/).map((paragraph, index) => <p key={index} className="whitespace-pre-wrap">{paragraph}</p>)}
          </div>
          <p className="mt-10 border-t border-border pt-6 font-display text-base font-semibold text-primary">Swap'N'Serve Chairman - David Hackett</p>
        </div>
      </div>
    </section>
  );
}