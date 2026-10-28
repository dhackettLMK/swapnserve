import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { availabilityOptions, referralOptions, roleNames, volunteerSchema } from '@/lib/volunteer';
import { z } from 'zod';

export type VolunteerValues = z.infer<typeof volunteerSchema>;
export default function VolunteerForm({ selectedRoles, onRolesChange }: { selectedRoles: string[]; onRolesChange: (roles: string[]) => void }) {
  const [complete, setComplete] = useState(false);
  const [failure, setFailure] = useState('');
  const applicationId = useRef(crypto.randomUUID());
  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<VolunteerValues>({ resolver: zodResolver(volunteerSchema), defaultValues: { full_name: '', email: '', phone: '', roles: [], availability: [], skills: '' } });
  useEffect(() => { setValue('roles', selectedRoles, { shouldValidate: selectedRoles.length > 0 }); }, [selectedRoles, setValue]);
  const inputClass = 'mt-2 w-full rounded-md border border-input bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring';
  const error = (key: keyof VolunteerValues) => errors[key] ? <p id={`${key}-error`} className="mt-2 text-sm text-destructive" role="alert">{errors[key]?.message}</p> : null;
  async function submit(values: VolunteerValues) {
    setFailure('');
    const result = await supabase.rpc('submit_volunteer_application', { payload: { ...values, roles: selectedRoles, id: applicationId.current } });
    if (result.error) { setFailure('We could not save your application. Please try again shortly.'); return; }
    setComplete(true);
  }
  return <section id="join-team" className="scroll-mt-28 border-t border-border bg-muted/30 py-16 md:py-24">
    <div className="container max-w-4xl">
      <p className="mb-3 text-sm font-semibold text-primary">VOLUNTEER WITH US</p>
      <h2 className="mb-4 text-3xl font-bold md:text-4xl">Join the team</h2>
      <p className="mb-10 text-muted-foreground">We only collect these details to contact you about volunteering. Your details are not shown publicly.</p>
      {complete ? <div role="status" className="border-l-4 border-primary py-6 pl-6"><CheckCircle2 className="mb-4 text-primary" size={32} /><p className="text-xl font-semibold">Thanks for stepping up! We'll be in touch within a week.</p></div> : <form onSubmit={handleSubmit(submit)} noValidate className="space-y-8">
        <div className="grid gap-6 sm:grid-cols-2">
          {(['full_name', 'email', 'phone'] as const).map((key) => <label key={key} className="block font-semibold" htmlFor={key}>{key === 'full_name' ? 'Full name' : key === 'email' ? 'Email' : 'Phone'} <span className="text-muted-foreground">(required)</span><input id={key} type={key === 'email' ? 'email' : key === 'phone' ? 'tel' : 'text'} autoComplete={key === 'full_name' ? 'name' : key === 'phone' ? 'tel' : 'email'} maxLength={key === 'full_name' ? 100 : key === 'phone' ? 30 : 255} {...register(key)} className={inputClass} aria-invalid={!!errors[key]} aria-describedby={errors[key] ? `${key}-error` : undefined} />{error(key)}</label>)}
          <fieldset><legend className="font-semibold">Age group</legend><div className="mt-4 flex gap-6">{(['18+', 'Under 18'] as const).map(value => <label key={value} className="flex items-center gap-2"><input type="radio" value={value} {...register('age_group')} className="h-4 w-4 accent-primary" />{value}</label>)}</div>{watch('age_group') === 'Under 18' && <p className="mt-3 text-sm text-primary">A parent/guardian will need to give consent</p>}{error('age_group')}</fieldset>
        </div>
        <fieldset><legend className="mb-4 font-semibold">Roles interested in</legend><div className="grid gap-3 sm:grid-cols-2">{roleNames.map(role => <label key={role} className="flex items-start gap-3 text-sm"><input type="checkbox" checked={selectedRoles.includes(role)} onChange={e => onRolesChange(e.target.checked ? [...selectedRoles, role] : selectedRoles.filter(item => item !== role))} className="mt-0.5 h-4 w-4 shrink-0 accent-primary" />{role}</label>)}</div>{error('roles')}</fieldset>
        <fieldset><legend className="mb-4 font-semibold">Availability</legend><div className="flex flex-wrap gap-x-8 gap-y-4">{availabilityOptions.map(value => <label key={value} className="flex items-center gap-2"><input type="checkbox" value={value} {...register('availability')} className="h-4 w-4 accent-primary" />{value}</label>)}</div>{error('availability')}</fieldset>
        <label htmlFor="skills" className="block font-semibold">Relevant skills or experience <span className="font-normal text-muted-foreground">(optional)</span><textarea id="skills" {...register('skills')} maxLength={2000} rows={4} className={inputClass} />{error('skills')}</label>
        <fieldset><legend className="mb-4 font-semibold">Willing to complete Garda vetting if required?</legend><div className="flex gap-8">{(['Yes', 'No'] as const).map(value => <label key={value} className="flex items-center gap-2"><input type="radio" value={value} {...register('garda_vetting')} className="h-4 w-4 accent-primary" />{value}</label>)}</div>{error('garda_vetting')}</fieldset>
        <label htmlFor="referral" className="block font-semibold">How did you hear about us?<select id="referral" {...register('referral')} className={inputClass}><option value="">Select an option</option>{referralOptions.map(value => <option key={value}>{value}</option>)}</select>{error('referral')}</label>
        <div><label className="flex items-start gap-3 text-sm"><input type="checkbox" {...register('consent')} className="mt-1 h-4 w-4 shrink-0 accent-primary" />I agree to Swap 'N' Serve storing my details to contact me about volunteering.</label>{error('consent')}</div>
        {failure && <p role="alert" className="text-destructive">{failure}</p>}
        <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">{isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <ArrowRight size={18} />}{isSubmitting ? 'Sending…' : 'Join the team'}</Button>
      </form>}
    </div>
  </section>;
}
