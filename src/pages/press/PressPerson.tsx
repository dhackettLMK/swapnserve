import { resolvePressPortrait } from "@/lib/pressPortraits";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import PressLayout from "@/components/press/PressLayout";
import PressSeo from "@/components/press/PressSeo";
import CopyButton from "@/components/press/CopyButton";
import NotFound from "@/pages/NotFound";
import { PEOPLE } from "@/content";

const PressPerson = () => {
  const { slug } = useParams<{ slug: string }>();
  const index = PEOPLE.findIndex((p) => p.slug === slug);
  if (index === -1) return <NotFound />;

  const person = PEOPLE[index];
  const prev = PEOPLE[(index - 1 + PEOPLE.length) % PEOPLE.length];
  const next = PEOPLE[(index + 1) % PEOPLE.length];
  const bioText = person.bio.join("\n\n");

  return (
    <PressLayout>
      <PressSeo
        title={`${person.name} | Swap 'N' Serve Press Room`}
        description={`${person.name}, ${person.role}, ${person.area}. ${person.hook}`}
        path={`/press/people/${person.slug}`}
      />
      <article className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6">
        <Link
          to="/press#people"
          className="no-print inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden /> All people
        </Link>

        {person.photo && (
          <img src={resolvePressPortrait(person.photo)} alt={person.name} className="mt-8 aspect-[4/5] w-48 rounded-xl object-cover object-top" />
        )}
        <p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-primary">
          {person.role}
          {person.organiser ? " · Organiser" : ""}
        </p>
        <h1 className="mt-3 font-press-serif text-4xl font-semibold tracking-tight md:text-6xl">{person.name}</h1>
        <p className="mt-2 text-sm font-medium uppercase tracking-wide text-muted-foreground">{person.area}</p>
        <p className="mt-6 border-l-4 border-accent pl-5 font-press-serif text-xl italic leading-relaxed text-foreground/90">
          {person.hook}
        </p>

        <div className="mt-10 space-y-5">
          {person.bio.map((para, i) => (
            <p key={i} className="text-lg leading-relaxed text-foreground/90">
              {para}
            </p>
          ))}
        </div>
        <CopyButton className="mt-6" label="Copy bio" text={`${person.name} (${person.role}, ${person.area})\n\n${bioText}`} />

        <div className="mt-10 rounded-xl border border-border bg-card p-6">
          <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Why David chose them</h2>
          <p className="mt-3 text-base leading-relaxed text-foreground/90">{person.hook}</p>
          <h2 className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-primary">Their role in the Cup</h2>
          <p className="mt-3 text-base leading-relaxed text-foreground/90">{person.roleInCup}</p>
        </div>

        {person.links.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Links</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {person.links.map((l) => (
                <li key={l.url}>
                  <a
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    {l.label} <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <nav className="no-print mt-12 flex items-center justify-between border-t border-border pt-6" aria-label="More people">
          <Link to={`/press/people/${prev.slug}`} className="group max-w-[45%]">
            <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden /> Previous
            </span>
            <p className="mt-1 font-press-serif text-base font-semibold text-foreground group-hover:text-primary">
              {prev.name}
            </p>
          </Link>
          <Link to={`/press/people/${next.slug}`} className="group max-w-[45%] text-right">
            <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Next <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </span>
            <p className="mt-1 font-press-serif text-base font-semibold text-foreground group-hover:text-primary">
              {next.name}
            </p>
          </Link>
        </nav>
      </article>
    </PressLayout>
  );
};

export default PressPerson;
