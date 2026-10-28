import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, CheckCircle2, Lightbulb, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { proposalSchema } from '@/lib/volunteer';
import { z } from 'zod';
import wordmark from '@/assets/swapnserve-wordmark-cup.png';

type ProposalValues = z.infer<typeof proposalSchema>;

export default function VolunteerPropose() {
  const [complete, setComplete] = useState(false);
  const [failure, setFailure] = useState('');
  const proposalId = useRef(crypto.randomUUID());
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<ProposalValues>({ resolver: zodResolver(proposalSchema), defaultValues: { full_name: '', email: '', phone: '', skills: '', proposal: '' } });
  useEffect(() => { const previous = document.title; document.title = "Share Your Idea | Swap'n'Serve"; return () => { document.title = previous; }; }, []);
  const inputClass = 'mt-2 w-full rounded-md border border-input bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring';
  const error = (key: keyof ProposalValues) => errors[key] ? <p id={`${key}-error`} className="mt-2 text-sm text-destructive" role="alert">{errors[key]?.message}</p> : null;
  async function submit(values: ProposalValues) {
    setFailure('');
    const result = await supabase.rpc('submit_volunteer_proposal', { payload: { ...values, id: proposalId.current } });
    if (result.error) { setFailure('We could not save your idea. Please try again shortly.'); return; }
    setComplete(true);
  }
  return <>
    <header className="border-b border-primary-foreground/20 bg-primary text-primary-foreground"><div className="container flex min-h-20 items-center justify-between gap-4 py-4"><Link to="/" aria-label="Swap'n'Serve home"><img src={wordmark} className="h-7 w-auto sm:h-10" alt="Swap'n'Serve" /></Link><nav aria-label="Volunteer navigation" className="flex shrink-0 items-center gap-2"><Button asChild variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"><Link to="/volunteer" aria-label="Back to volunteer roles"><ArrowLeft size={16} /></Link></Button><Button asChild variant="secondary" className="bg-background text-primary hover:bg-muted"><Link to="/volunteer">See roles</Link></Button></nav></div></header>
    <main>
      <section className="bg-primary py-16 text-primary-foreground md:py-24"><div className="container max-w-4xl"><p className="mb-6 flex items-center gap-2 text-sm font-semibold text-accent"><Lightbulb size={16} />THINK WE MISSED SOMETHING?</p><h1 className="text-3xl font-bold leading-tight sm:text-5xl">Tell us what you'd like to do.</h1><p className="mt-6 max-w-2xl text-lg leading-relaxed text-primary-foreground/80">Got a skill, an interest or an idea of your own? Tell us what you enjoy doing and how you'd like to help, and we'll let you know what's possible.</p></div></section>
      <section className="border-t border-border bg-muted/30 py-16 md:py-24">
        <div className="container max-w-4xl">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Your proposal</h2>
          <p className="mb-10 text-muted-foreground">Leave your name, age, email and number so we can contact you about your idea. Your details are not shown publicly.</p>
          {complete ? <div role="status" className="border-l-4 border-primary py-6 pl-6"><CheckCircle2 className="mb-4 text-primary" size={32} /><p className="text-xl font-semibold">Thanks for sharing your idea! We'll be in touch about what's possible.</p></div> : <form onSubmit={handleSubmit(submit)} noValidate className="space-y-8">
            <div className="grid gap-6 sm:grid-cols-2">
              {(['full_name', 'email', 'phone'] as const).map((key) => <label key={key} className="block font-semibold" htmlFor={key}>{key === 'full_name' ? 'Full name' : key === 'email' ? 'Email' : 'Phone'} <span className="text-muted-foreground">(required)</span><input id={key} type={key === 'email' ? 'email' : key === 'phone' ? 'tel' : 'text'} autoComplete={key === 'full_name' ? 'name' : key === 'phone' ? 'tel' : 'email'} maxLength={key === 'full_name' ? 100 : key === 'phone' ? 30 : 255} {...register(key)} className={inputClass} aria-invalid={!!errors[key]} aria-describedby={errors[key] ? `${key}-error` : undefined} />{error(key)}</label>)}
              <fieldset><legend className="font-semibold">Age group</legend><div className="mt-4 flex gap-6">{(['18+', 'Under 18'] as const).map(value => <label key={value} className="flex items-center gap-2"><input type="radio" value={value} {...register('age_group')} className="h-4 w-4 accent-primary" />{value}</label>)}</div>{watch('age_group') === 'Under 18' && <p className="mt-3 text-sm text-primary">A parent/guardian will need to give consent</p>}{error('age_group')}</fieldset>
            </div>
            <label htmlFor="skills" className="block font-semibold">Your skills or interests <span className="font-normal text-muted-foreground">(optional)</span><textarea id="skills" {...register('skills')} maxLength={2000} rows={3} placeholder="Anything you're good at or enjoy, for example photography, cooking, organising, design…" className={inputClass} />{error('skills')}</label>
            <label htmlFor="proposal" className="block font-semibold">What would you like to do? <span className="text-muted-foreground">(required)</span><textarea id="proposal" {...register('proposal')} maxLength={2000} rows={5} placeholder="Tell us your idea or the role you'd like to create…" className={inputClass} />{error('proposal')}</label>
            <div><label className="flex items-start gap-3 text-sm"><input type="checkbox" {...register('consent')} className="mt-1 h-4 w-4 shrink-0 accent-primary" />I agree to Swap 'N' Serve storing my details to contact me about my idea.</label>{error('consent')}</div>
            {failure && <p role="alert" className="text-destructive">{failure}</p>}
            <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">{isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <ArrowRight size={18} />}{isSubmitting ? 'Sending…' : 'Send your idea'}</Button>
          </form>}
        </div>
      </section>
    </main>
    <footer className="container py-8 text-sm text-muted-foreground"><Link to="/" className="hover:text-primary">Swap 'N' Serve · Limerick</Link></footer>
  </>;
}
