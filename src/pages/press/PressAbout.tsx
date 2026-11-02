import PressLayout from "@/components/press/PressLayout";
import PressSeo from "@/components/press/PressSeo";
import CopyButton from "@/components/press/CopyButton";
import { BOILERPLATE, CONTACT, PEOPLE } from "@/content";

const david = PEOPLE.find((p) => p.slug === "david-hackett")!;

const PressAbout = () => (
  <PressLayout>
    <PressSeo
      title="About David Hackett and Swap 'N' Serve | Press Room"
      description={BOILERPLATE}
      path="/press/about"
    />
    <div className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">About</p>
      <h1 className="mt-3 font-press-serif text-4xl font-semibold tracking-tight md:text-5xl">David Hackett</h1>
      <p className="mt-2 text-sm font-medium uppercase tracking-wide text-muted-foreground">
        Founder, Swap 'N' Serve · Raheen, Limerick
      </p>
      <div className="mt-8 space-y-5">
        {david.bio.map((para, i) => (
          <p key={i} className="text-lg leading-relaxed text-foreground/90">
            {para}
          </p>
        ))}
      </div>
      <CopyButton className="mt-6" label="Copy bio" text={`${david.name}, ${david.role}\n\n${david.bio.join("\n\n")}`} />

      <div className="mt-12 border-t border-border pt-10">
        <h2 className="font-press-serif text-2xl font-semibold tracking-tight">About Swap 'N' Serve</h2>
        <p className="mt-4 text-base leading-relaxed text-foreground/90">{BOILERPLATE}</p>
        <CopyButton className="mt-4" label="Copy boilerplate" text={BOILERPLATE} />
      </div>

      <div className="mt-12 rounded-xl border border-primary/25 bg-primary/5 p-6">
        <h2 className="font-press-serif text-xl font-semibold">Contact</h2>
        <p className="mt-2 text-sm leading-relaxed text-foreground/80">
          {CONTACT.name}, {CONTACT.role}. {CONTACT.note}
        </p>
        <p className="mt-3 text-sm">
          <a href={`mailto:${CONTACT.email}`} className="font-semibold text-primary hover:underline">
            {CONTACT.email}
          </a>
          {" · "}
          <a href="https://swapnserve.com" className="font-semibold text-primary hover:underline">
            {CONTACT.website}
          </a>
        </p>
      </div>
    </div>
  </PressLayout>
);

export default PressAbout;
