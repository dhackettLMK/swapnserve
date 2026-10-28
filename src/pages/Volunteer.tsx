import { useEffect, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, Check, Clock, HandHeart, Users, Megaphone, CalendarDays, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import VolunteerForm from '@/components/volunteer/VolunteerForm';
import { roleGroups } from '@/lib/volunteer';
import communityPhoto from '@/assets/hero-community-sm.jpg';
import wordmark from '@/assets/swapnserve-wordmark-cup.png';

const groupIcons = [Users, Megaphone, CalendarDays, HandHeart, ShieldCheck];
export default function Volunteer() {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  useEffect(() => { const previous = document.title; document.title = "Volunteer With Us | Swap'n'Serve"; return () => { document.title = previous; }; }, []);
  const interested = (role: string) => {
    setSelectedRoles(current => current.includes(role) ? current : [...current, role]);
    document.getElementById('join-team')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };
  return <>
    <header className="border-b border-primary-foreground/20 bg-primary text-primary-foreground"><div className="container flex min-h-20 items-center justify-between gap-4 py-4"><Link to="/" aria-label="Swap'n'Serve home"><img src={wordmark} className="h-7 w-auto sm:h-10" alt="Swap'n'Serve" /></Link><nav aria-label="Volunteer navigation" className="flex shrink-0 items-center gap-2"><Button asChild variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"><Link to="/" aria-label="Back to home"><ArrowLeft size={16} /></Link></Button><Button asChild variant="secondary" className="bg-background text-primary hover:bg-muted"><a href="#join-team">Volunteer</a></Button></nav></div></header>
    <main>
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <img src={communityPhoto} alt="Swap'n'Serve community event in Limerick" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-primary/90" />
        <div className="container relative py-20 md:py-28"><p className="mb-6 text-sm font-semibold text-accent">VOLUNTEER WITH US</p><h1 className="max-w-4xl text-3xl font-bold leading-tight sm:text-5xl">Swap 'N' Serve is built by the community, for the community.</h1><p className="mt-6 max-w-2xl text-lg leading-relaxed text-primary-foreground/80">We're growing, and we need people who want to own a piece of it. Pick a role, give what time you can, and help us serve Limerick.</p><Button asChild size="lg" variant="secondary" className="mt-8 bg-background text-primary hover:bg-muted"><a href="#teams">Find your role<ArrowDown size={18} /></a></Button></div>
      </section>
      <section id="teams" className="container scroll-mt-8 py-16 md:py-24"><h2 className="mb-12 text-3xl font-bold md:text-4xl">Teams &amp; Roles</h2><div className="space-y-16">{roleGroups.map((group, groupIndex) => {
        const Icon = groupIcons[groupIndex] ?? Users;
        return <section key={group.title}><div className="mb-6 flex items-center gap-4 border-b border-border pb-5"><Icon className="shrink-0 text-primary" size={26} /><div><p className="mb-1 text-xs font-semibold text-muted-foreground">TEAM {groupIndex + 1}</p><h3 className="text-xl font-semibold md:text-2xl">{group.title}</h3></div></div><div className="grid items-start gap-5 md:grid-cols-2 lg:grid-cols-3">{group.roles.map(([title, description, commitment, bullets]) => <article key={title} className="flex flex-col rounded-lg border border-border bg-card p-6"><Icon aria-hidden="true" className="mb-4 text-primary" size={24} /><h4 className="text-lg font-semibold">{title}</h4><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p><p className="my-5 flex items-center gap-2 text-xs font-semibold text-primary"><Clock size={14} />{commitment}</p><details className="mb-5 border-t border-border pt-4"><summary className="cursor-pointer text-sm font-semibold">What you'll do</summary><ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">{bullets.map(bullet => <li key={bullet}>{bullet}</li>)}</ul></details><Button variant="outline" className="w-full justify-between" onClick={() => interested(title)}>I'm interested<ArrowRight size={16} /></Button></article>)}</div></section>;
      })}</div></section>
      <section className="border-y border-border bg-primary py-12 text-primary-foreground"><div className="container"><h2 className="mb-6 text-2xl font-semibold">Why volunteer?</h2><div className="grid gap-6 md:grid-cols-3">{['Make a real impact in Limerick', 'Gain experience and references', 'Join a community that shows up'].map(point => <p key={point} className="flex items-start gap-3"><Check className="shrink-0 text-accent" size={20} />{point}</p>)}</div></div></section>
      <VolunteerForm selectedRoles={selectedRoles} onRolesChange={setSelectedRoles} />
    </main>
    <footer className="container py-8 text-sm text-muted-foreground"><Link to="/" className="hover:text-primary">Swap 'N' Serve · Limerick</Link></footer>
  </>;
}
