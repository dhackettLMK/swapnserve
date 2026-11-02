import { Link } from "react-router-dom";
import type { Person } from "@/content";

const initials = (name: string) =>
  name
    .replace(/[()"]/g, "")
    .split(/\s+/)
    .filter((w) => w[0] === w[0]?.toUpperCase())
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

const PersonCard = ({ person }: { person: Person }) => (
  <Link
    to={`/press/people/${person.slug}`}
    className="group flex h-full flex-col rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-refined)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
  >
    <div
      className="flex aspect-square w-full items-center justify-center rounded-lg bg-primary/10 font-press-serif text-4xl font-semibold text-primary"
      aria-hidden
    >
      {initials(person.name)}
    </div>
    <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
      {person.role}
      {person.organiser ? " · Organiser" : ""}
    </p>
    <h3 className="mt-1 font-press-serif text-xl font-semibold leading-snug text-foreground group-hover:text-primary">
      {person.name}
    </h3>
    <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">{person.area}</p>
    <p className="mt-2 text-sm leading-relaxed text-foreground/80">{person.hook}</p>
  </Link>
);

export default PersonCard;
