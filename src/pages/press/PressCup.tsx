import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, MapPin, Trophy, Users, Music, Utensils, Mic } from "lucide-react";
import PressLayout from "@/components/press/PressLayout";
import PressSeo from "@/components/press/PressSeo";
import CopyButton from "@/components/press/CopyButton";
import { CONTACT, CUP_EVENT } from "@/content";

const programmeIcons = [Trophy, Utensils, Music, Mic, Mic];

const PressCup = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: CUP_EVENT.name,
    description: CUP_EVENT.what,
    startDate: CUP_EVENT.dateISO,
    location: {
      "@type": "Place",
      name: "Summerville Rovers F.C.",
      address: "124 Ballinacurra Gardens, Ballinacurra (Weston), Limerick, V94 R98D",
    },
    organizer: { "@type": "Organization", name: "Swap 'N' Serve", url: "https://swapnserve.com" },
    url: "https://swapnserve.com/press/cup",
  };

  return (
    <PressLayout>
      <PressSeo
        title="The Swap 'N' Serve Cup, 5 December 2026 | Press Room"
        description={`${CUP_EVENT.what}. ${CUP_EVENT.date}, ${CUP_EVENT.where}.`}
        path="/press/cup"
        jsonLd={jsonLd}
      />
      <div className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">The event</p>
        <h1 className="mt-3 font-press-serif text-4xl font-semibold tracking-tight md:text-6xl">{CUP_EVENT.name}</h1>
        <p className="mt-5 text-lg leading-relaxed text-foreground/85">
          {CUP_EVENT.what.charAt(0).toUpperCase() + CUP_EVENT.what.slice(1)}.
        </p>

        <dl className="mt-10 space-y-5 rounded-2xl border border-border bg-card p-6 md:p-8">
          <div className="flex items-start gap-3">
            <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
            <div>
              <dt className="text-xs font-bold uppercase tracking-wide text-muted-foreground">When</dt>
              <dd className="text-base font-medium">{CUP_EVENT.date}</dd>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
            <div>
              <dt className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Where</dt>
              <dd className="text-base font-medium">{CUP_EVENT.where}</dd>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Trophy className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
            <div>
              <dt className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Prizes</dt>
              <dd className="text-base font-medium">{CUP_EVENT.prizes}</dd>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Users className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
            <div>
              <dt className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Enter a team</dt>
              <dd className="text-base font-medium">{CUP_EVENT.enter}</dd>
            </div>
          </div>
        </dl>

        <h2 className="mt-12 font-press-serif text-2xl font-semibold tracking-tight md:text-3xl">On the day</h2>
        <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {CUP_EVENT.programme.map((item, i) => {
            const Icon = programmeIcons[i] ?? Trophy;
            return (
              <li key={item} className="flex items-center gap-2.5 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold">
                <Icon className="h-4 w-4 shrink-0 text-primary" aria-hidden /> {item}
              </li>
            );
          })}
        </ul>

        <div className="mt-12 rounded-xl border border-primary/25 bg-primary/5 p-6">
          <h2 className="font-press-serif text-xl font-semibold">Media welcome on the day</h2>
          <p className="mt-2 text-sm leading-relaxed text-foreground/80">
            {CUP_EVENT.media}. Contact {CONTACT.name} at{" "}
            <a href={`mailto:${CONTACT.email}`} className="font-semibold text-primary hover:underline">
              {CONTACT.email}
            </a>
            .
          </p>
          <div className="no-print mt-5 flex flex-wrap gap-3">
            <Link
              to="/cup"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Enter a team <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <CopyButton
              label="Copy event details"
              text={`${CUP_EVENT.name}: ${CUP_EVENT.what}. ${CUP_EVENT.date}, ${CUP_EVENT.where}. Prizes: ${CUP_EVENT.prizes}. Enter a team: ${CUP_EVENT.enter}. ${CUP_EVENT.media}.`}
            />
          </div>
        </div>
      </div>
    </PressLayout>
  );
};

export default PressCup;
