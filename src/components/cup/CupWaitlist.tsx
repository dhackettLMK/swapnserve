import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cupApi } from "@/lib/cupApi";

/** Shown in place of registration once all 32 team places are taken. */
export function CupWaitlist({ id, className = "" }: { id?: string; className?: string }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [teamName, setTeamName] = useState("");
  const join = useMutation({
    mutationFn: () => cupApi.joinWaitlist({ full_name: fullName, email, phone, team_name: teamName }),
  });

  return (
    <div id={id} className={`w-full min-w-0 max-w-xl scroll-mt-24 rounded-xl border border-border bg-card p-6 text-card-foreground shadow-refined md:p-8 ${className}`}>
      <p className="font-cup-body text-xs font-semibold uppercase tracking-[0.16em] text-secondary">All 32 places taken</p>
      <h2 className="mt-1 font-cup-display text-3xl leading-tight text-foreground">Join the waiting list</h2>
      {join.isSuccess ? (
        <p className="mt-4 flex items-start gap-2 font-cup-body text-sm leading-relaxed text-foreground">
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
          You're on the waiting list. If a place opens up, we'll contact you first.
        </p>
      ) : (
        <form
          className="mt-4 space-y-4 font-cup-body"
          onSubmit={(e) => {
            e.preventDefault();
            join.mutate();
          }}
        >
          <p className="text-sm leading-relaxed text-muted-foreground">
            The Cup is full, but places sometimes open up. Leave your details and we'll contact you if one does. Nothing is paid now.
          </p>
          <div className="space-y-2">
            <Label htmlFor="wl-name">Full name</Label>
            <Input id="wl-name" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="h-12 rounded-xl bg-background px-4" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="wl-email">Email</Label>
            <Input id="wl-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-12 rounded-xl bg-background px-4" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="wl-phone">Phone</Label>
            <Input id="wl-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required className="h-12 rounded-xl bg-background px-4" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="wl-team">Team name (leave blank if you're on your own)</Label>
            <Input id="wl-team" value={teamName} onChange={(e) => setTeamName(e.target.value)} className="h-12 rounded-xl bg-background px-4" />
          </div>
          {join.isError && <p className="text-sm text-destructive">{(join.error as Error).message}</p>}
          <Button type="submit" disabled={join.isPending} className="h-12 w-full rounded-xl">
            {join.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Join the waiting list"}
          </Button>
          <p className="text-xs leading-relaxed text-muted-foreground">
            We only use these details to contact you about a Cup place. They're never shown publicly.
          </p>
        </form>
      )}
    </div>
  );
}
