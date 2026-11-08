import { ArrowUpRight } from "lucide-react";
import { useTalentContent } from "@/lib/thirtyApi";
import { resolvePortrait } from "@/lib/thirtyPortraits";

function Biography({ text }: { text: string }) {
  return <>{text.split(/(https?:\/\/[^\s]+)/g).map((part, index) => {
    if (/^https?:\/\//.test(part)) {
      const url = new URL(part);
      return <a key={index} href={url.href} target="_blank" rel="noopener noreferrer" className="inline-flex max-w-full items-center gap-1 break-all font-semibold text-primary underline underline-offset-4">{url.hostname.replace(/^www\./, "")}<ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden /></a>;
    }
    return <span key={index}>{part}</span>;
  })}</>;
}

export default function TalentProfiles() {
  const { data: content } = useTalentContent();
  if (!content) return null;
  return (
    <section aria-labelledby="talent-profiles-heading" className="mt-10 border-t border-border pt-10">
      <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">{content.intro}</p>
      <h2 id="talent-profiles-heading" className="mt-10 text-2xl font-semibold md:text-3xl">Meet the talent</h2>
      <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">{content.aboutBody}</p>
      <div className="mt-8 grid items-start gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {content.honourees.map((person, index) => (
          <article key={person.id} className="min-w-0 border-b border-border pb-6">
            <div className="relative mb-5 aspect-[4/3] overflow-hidden rounded-lg bg-muted">
              {person.photo ? <img src={resolvePortrait(person.photo)} alt={person.name} loading="lazy" className="h-full w-full object-cover object-top" /> : <div aria-hidden="true" className="flex h-full items-center justify-center bg-primary/5 font-press-serif text-6xl text-primary/35">{person.name.split(/\s+/).filter((word) => /^[\p{L}]/u.test(word)).slice(0, 2).map((word) => word[0]).join("")}</div>}
              <span className="absolute bottom-3 left-3 bg-background px-2 py-1 text-xs font-semibold text-primary">{String(index + 1).padStart(2, "0")}</span>
            </div>
            <p className="text-xs font-semibold uppercase text-primary">{person.role}</p>
            <h3 className="mt-2 text-xl font-semibold leading-snug">{person.name}</h3>
            {person.age && <p className="mt-2 text-sm text-muted-foreground">Age {person.age}</p>}
            <details className="group mt-4">
              <summary className="cursor-pointer text-sm font-semibold text-primary underline-offset-4 hover:underline">Read their story</summary>
              <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted-foreground"><Biography text={person.bio} /></p>
            </details>
          </article>
        ))}
      </div>
    </section>
  );
}