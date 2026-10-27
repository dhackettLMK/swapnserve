import { motion } from "framer-motion";
import { ArrowRight, Award, Code, Shirt, Trophy, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import cupSpray from "@/assets/cup-spraypaint.png";
import cupWordmark from "@/assets/swapnserve-wordmark-cup.png";

const programmes = [
  { number: "02", icon: Award, title: "Talented People", status: "Thirty Under Thirty", copy: "Every day Limerick City is full of people doing remarkable things: building businesses, coaching teams, caring for others, making things. This is our chance to put a name to that talent and celebrate it in public.", href: "/thirty-under-thirty", label: "Meet the honourees" },
  { number: "03", icon: Code, title: "Swap'n'Serve Hackathon", status: "Coming Soon", copy: "Teams build digital solutions to real problems facing Limerick, then pitch to a panel of judges for a cash prize. Hosted at The Engine, Limerick's Local Enterprise Office, to develop skills and turn ideas into something tangible.", href: null, label: null },
  { number: "04", icon: Shirt, title: "Swap'N'Serve 3", status: "Coming Soon", copy: "Our flagship clothing redistribution event. Quality donated clothing, sorted by volunteers and offered at €1 per item or free where appropriate. No sign-up, no means testing. Every leftover piece is shared with local charities.", href: "#how-it-works", label: "See how it works" },
];

export default function ProgrammesSection() {
  return (
    <section id="programmes" className="border-b border-border bg-background py-16 md:py-24">
      <div className="container">
        <div className="mb-10 grid gap-5 border-b border-border pb-8 md:grid-cols-[1.2fr_1fr] md:items-end">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase text-primary">Our programmes</p>
            <h2 className="max-w-xl font-section text-3xl font-semibold leading-tight md:text-4xl">Built for the betterment of Limerick</h2>
          </div>
          <p className="max-w-lg text-base leading-relaxed text-muted-foreground">One umbrella, four pillars. Each programme reaches a different part of Limerick: grassroots, talent, enterprise and recognition, all under one mission.</p>
        </div>
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
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
            <p className="mb-5 text-lg leading-relaxed text-primary-foreground/90">A 5-a-side community football tournament with a €1,000 prize pot. Built to unite the city across every background and fund future Swap'N'Serve projects.</p>
            <div className="mb-8 grid grid-cols-2 gap-4 border-y border-primary-foreground/20 py-5">
              <div><p className="text-2xl font-semibold text-accent">€1,000</p><p className="mt-1 text-xs text-primary-foreground/70">Winners' prize</p></div>
              <div><p className="text-2xl font-semibold">5-a-side</p><p className="mt-1 text-xs text-primary-foreground/70">2 subs · rolling subs</p></div>
            </div>
            <p className="mb-6 text-sm text-primary-foreground/75">€10 per team member · 7 team members required</p>
            <div className="mt-auto flex flex-wrap gap-3">
              <Button asChild variant="secondary" size="lg"><Link to="/cup?src=programme-team">Register your team <ArrowRight /></Link></Button>
              <Button asChild variant="ghost" size="lg" className="border border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"><Link to="/cup?src=programme-solo#solo">Register as an individual <UserPlus /></Link></Button>
            </div>
            <Link to="/cup/format" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary-foreground/80 hover:text-primary-foreground">View the tournament <ArrowRight size={15} /></Link>
          </motion.article>
          <div className="divide-y divide-border">
            {programmes.map((programme) => (
              <article key={programme.number} className="py-7 first:pt-0 last:pb-0">
                <div className="mb-4 flex items-center justify-between gap-3 text-xs font-semibold text-muted-foreground"><span className="flex items-center gap-2"><programme.icon size={16} /> {programme.number}</span><span className="text-muted-foreground">{programme.status}</span></div>
                <h3 className="mb-3 text-xl font-semibold md:text-2xl">{programme.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{programme.copy}</p>
                {programme.href && <Button asChild variant="link" className="mt-3 h-auto px-0">{programme.href.startsWith("#") ? <a href={programme.href}>{programme.label}<ArrowRight /></a> : <Link to={programme.href}>{programme.label}<ArrowRight /></Link>}</Button>}
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
