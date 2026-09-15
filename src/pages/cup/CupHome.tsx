import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowDown, CalendarDays, Check, Clock3, Copy, Loader2, MapPin, Share2, Trophy, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import CupLayout from "@/components/cup/CupLayout";
import { KitDot, StatusBadge, ConfigNotice } from "@/components/cup/CupUi";
import { isSupabaseConfigured } from "@/lib/supabase";
import { cupApi, type CheckoutInput } from "@/lib/cupApi";
import { CupCheckoutDialog } from "@/components/cup/CupCheckoutDialog";
import { formatEuros, TEAM_PRICE_CENTS } from "@/lib/teamStatus";
import cupWordmark from "@/assets/swapnserve-wordmark-cup.png";
import cupSpray from "@/assets/cup-spraypaint.png";

const PRIVACY_NOTE =
  "We only collect your name, email and phone to run the tournament and contact you about your team. Nothing else.";

function inviteUrl(token: string): string {
  return `${window.location.origin}/cup?invite=${token}`;
}

function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          toast.success("Copied to clipboard");
          setTimeout(() => setCopied(false), 1500);
        } catch {
          toast.error("Couldn't copy. Select and copy manually.");
        }
      }}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />} {label}
    </Button>
  );
}

/* -------------------------------------------------------------------------- */
/*  Create a team                                                             */
/* -------------------------------------------------------------------------- */

function CreateTeam() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [captainName, setCaptainName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const create = useMutation({
    mutationFn: () =>
      cupApi.createTeam({
        name,
        kit_colour: "Green",
        captain_name: captainName,
        captain_email: email,
        captain_phone: phone,
      }),
    onSuccess: (res) => {
      toast.success("Team created! Share your invite link with your teammates.");
      navigate(`/cup?manage=${res.manage_token}`);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const eventFacts = [
    { icon: CalendarDays, label: "Date", value: "5 December" },
    { icon: Clock3, label: "Kick-off", value: "2pm until completion" },
    { icon: Users, label: "Format", value: "5-a-side, squads of 7" },
  ];

  return (
    <div className="cup-landing -mt-1">
      <section className="cup-hero relative isolate overflow-hidden bg-primary text-primary-foreground">
        <div className="cup-pitch-lines absolute inset-0 opacity-25" aria-hidden="true" />
        <div className="cup-floodlight absolute inset-x-0 top-0 h-40 opacity-70" aria-hidden="true" />
        <div className="container relative z-10 grid min-h-[680px] items-center gap-8 py-12 lg:min-h-[720px] lg:grid-cols-[1.15fr_0.85fr] lg:py-16">
          <div className="animate-fade-up text-center lg:text-left">
            <p className="mb-5 font-cup-body text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Limerick grassroots football
            </p>
            <div className="relative mx-auto w-fit lg:mx-0">
              <img
                src={cupWordmark}
                alt="Swap'n'Serve"
                className="cup-wordmark w-full max-w-[620px]"
              />
              <img
                src={cupSpray}
                alt=""
                aria-hidden="true"
                className="cup-wordmark mx-auto -mt-3 w-2/5 max-w-[240px] -rotate-2 drop-shadow-[0_6px_18px_hsl(var(--accent)/0.35)] lg:ml-auto lg:mr-6"
              />
            </div>
            <h1 className="sr-only">The Swap'n'Serve Cup</h1>
            <p className="mt-5 max-w-xl font-cup-body text-lg leading-relaxed text-primary-foreground/75 lg:text-xl">
              A World Cup-style community tournament with permanent goals left for the local
              community after the final whistle.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
              <span className="inline-flex items-center gap-2.5 rounded-full border border-accent/40 bg-accent/10 px-5 py-2.5 font-cup-body text-sm font-semibold text-accent shadow-[0_0_30px_hsl(var(--accent)/0.15)]">
                <Trophy className="h-4 w-4" /> €1,000 winners' prize
              </span>
              <span className="font-cup-body text-sm text-primary-foreground/65">
                €10 per team member · 7 team members required
              </span>
            </div>
          </div>

          <form
            id="register"
            className="cup-register-form w-full max-w-xl scroll-mt-24 space-y-5 justify-self-center rounded-[2rem] border border-border bg-card p-6 text-card-foreground shadow-[0_24px_70px_hsl(var(--accent)/0.14)] md:p-8 lg:justify-self-end"
            onSubmit={(e) => {
              e.preventDefault();
              create.mutate();
            }}
          >
            <div className="font-cup-body">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-secondary">Registration</p>
              <h2 className="mt-1 font-cup-display text-4xl leading-none text-foreground">Register your team</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Your captain creates the team here. We then provide a private link to invite the remaining six players and arrange payment.
              </p>
            </div>
            <div className="space-y-2 font-cup-body">
              <Label htmlFor="team-name">Team name</Label>
              <Input id="team-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="For example, Shannonside Rovers" required className="h-12 rounded-xl bg-background px-4 focus-visible:ring-accent" />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2 font-cup-body">
                <Label htmlFor="captain-name">Captain name</Label>
                <Input id="captain-name" value={captainName} onChange={(e) => setCaptainName(e.target.value)} required className="h-12 rounded-xl bg-background px-4 focus-visible:ring-accent" />
              </div>
              <div className="space-y-2 font-cup-body">
                <Label htmlFor="captain-phone">Captain phone</Label>
                <Input id="captain-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required className="h-12 rounded-xl bg-background px-4 focus-visible:ring-accent" />
              </div>
            </div>
            <div className="space-y-2 font-cup-body">
              <Label htmlFor="captain-email">Captain email</Label>
              <Input id="captain-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="We'll send the private team link here" required className="h-12 rounded-xl bg-background px-4 focus-visible:ring-accent" />
            </div>
            <p className="font-cup-body text-xs leading-relaxed text-muted-foreground">{PRIVACY_NOTE}</p>
            <Button type="submit" size="lg" className="cup-primary-cta h-13 w-full rounded-full bg-primary font-cup-body text-base font-bold text-primary-foreground hover:bg-primary/90" disabled={create.isPending}>
              {create.isPending ? <Loader2 className="animate-spin" /> : <Trophy />} Create team · €10 per team member
            </Button>
          </form>
        </div>
      </section>

      <section className="border-b border-border bg-background py-10">
        <div className="container grid gap-6 md:grid-cols-3">
          {eventFacts.map((fact, index) => (
            <div key={fact.label} className="cup-fact flex items-start gap-4 font-cup-body" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/8 text-primary">
                <fact.icon size={19} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{fact.label}</p>
                <p className="mt-1 text-lg font-semibold text-foreground">{fact.value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-card py-14 md:py-20">
        <div className="container grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div className="font-cup-body">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-secondary">Match venue</p>
            <h2 className="font-cup-display text-5xl leading-none text-foreground md:text-6xl">Summerville Rovers FC Astro</h2>
            <div className="mt-6 flex items-start gap-3 text-muted-foreground">
              <MapPin className="mt-0.5 shrink-0 text-primary" size={20} />
              <p>124 Ballinacurra Gardens, Ballinacurra Weston, Limerick, V94 R98D</p>
            </div>
          </div>
          <div className="relative min-h-56 overflow-hidden rounded-[2rem] bg-primary p-8 text-primary-foreground md:p-10">
            <div className="cup-mini-pitch absolute inset-0 opacity-20" aria-hidden="true" />
            <div className="relative max-w-lg font-cup-body">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">More than one match</p>
              <p className="mt-4 text-xl leading-relaxed text-primary-foreground/85 md:text-2xl">
                The tournament funds permanent football goals for the local community, creating a place to play long after cup day.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Manage a team (captain dashboard)                                         */
/* -------------------------------------------------------------------------- */

function ManageTeam({ manageToken }: { manageToken: string }) {
  const qc = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [checkout, setCheckout] = useState<CheckoutInput | null>(null);
  const returnUrl = `${window.location.origin}/cup?manage=${manageToken}&paid=1`;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["cup-team", manageToken],
    queryFn: () => cupApi.getTeam(manageToken),
  });

  // Handle the Stripe redirect back to this page: confirm the payment with
  // the backend, then refresh the team so the new status shows.
  useEffect(() => {
    if (searchParams.get("paid") === "1") {
      const sessionId = searchParams.get("session_id");
      const refresh = async () => {
        if (sessionId) {
          try {
            await cupApi.confirmPayment(sessionId);
          } catch {
            // The webhook will catch up; the refresh below still shows it.
          }
        }
        toast.success("Payment received, thanks! Your team status is updated.");
        qc.invalidateQueries({ queryKey: ["cup-team", manageToken] });
        searchParams.delete("paid");
        searchParams.delete("session_id");
        setSearchParams(searchParams, { replace: true });
      };
      refresh();
    }
  }, [searchParams, setSearchParams, qc, manageToken]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (isError || !data) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-destructive/40 bg-destructive/5 p-6 text-center">
        <p className="text-sm text-muted-foreground">
          {(error as Error)?.message ?? "We couldn't find that team."}
        </p>
      </div>
    );
  }

  const { team, players, summary } = data;
  const pct = Math.round((summary.paidCents / TEAM_PRICE_CENTS) * 100);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <CupCheckoutDialog checkout={checkout} onClose={() => setCheckout(null)} />
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <KitDot colour={team.kit_colour} size={16} />
              <h1 className="text-2xl font-display font-bold">{team.name}</h1>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">Captain: {team.captain_name}</p>
          </div>
          <StatusBadge status={team.status} />
        </div>

        {summary.status === "registered" && (
          <div className="mt-4 rounded-xl border border-success/30 bg-success/10 p-4 text-sm text-success">
            Your team is fully registered and in the draw. Nothing more to do, see you on the
            pitch!
          </div>
        )}

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Roster</p>
            <p className="mt-1 text-2xl font-bold">{summary.rosterCount}/7 players</p>
            {summary.rosterNeeded > 0 && (
              <p className="text-xs text-muted-foreground">
                {summary.rosterNeeded} more to invite
              </p>
            )}
          </div>
          <div className="rounded-xl border border-border p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Paid</p>
            <p className="mt-1 text-2xl font-bold">
              {formatEuros(summary.paidCents)}
              <span className="text-base font-normal text-muted-foreground">
                {" "}
                / {formatEuros(TEAM_PRICE_CENTS)}
              </span>
            </p>
            <Progress value={pct} className="mt-2 h-2" />
            {summary.outstandingCents > 0 && (
              <p className="mt-1 text-xs text-muted-foreground">
                {formatEuros(summary.outstandingCents)} outstanding
              </p>
            )}
          </div>
        </div>

        {summary.outstandingCents > 0 && (
          <Button
            variant="cta"
            className="mt-4 w-full"
            onClick={() => setCheckout({ mode: "full", manage_token: manageToken, returnUrl })}
          >
            Pay outstanding {formatEuros(summary.outstandingCents)} now
          </Button>
        )}
      </div>

      {/* Invite link */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-2 flex items-center gap-2">
          <Share2 size={16} className="text-primary" />
          <h2 className="font-section text-lg font-bold">Invite your squad</h2>
        </div>
        <p className="mb-3 text-sm text-muted-foreground">
          Send this link to your 6 teammates. They add their details, then either they pay their own
          €10 or you cover it below.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input readOnly value={inviteUrl(team.invite_token)} className="font-mono text-xs" />
          <CopyButton value={inviteUrl(team.invite_token)} label="Copy link" />
        </div>
      </div>

      {/* Players */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-4 font-section text-lg font-bold">Players ({players.length}/7)</h2>
        <ul className="divide-y divide-border">
          {players.map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-3 py-3">
              <div>
                <p className="font-medium">
                  {p.full_name}
                  {p.is_captain && (
                    <span className="ml-2 rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Captain
                    </span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">{p.email}</p>
              </div>
              {p.paid ? (
                <span className="inline-flex items-center gap-1 text-sm font-medium text-success">
                  <Check size={15} /> Paid
                </span>
              ) : summary.outstandingCents > 0 ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setCheckout({
                      mode: "player",
                      manage_token: manageToken,
                      player_id: p.id,
                      returnUrl,
                    })
                  }
                >
                  Pay €10
                </Button>
              ) : (
                <span className="text-xs text-muted-foreground">Covered</span>
              )}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-muted-foreground">
          Bookmark this page. It's your private link to manage the team.
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Join a team (teammate)                                                    */
/* -------------------------------------------------------------------------- */

function JoinTeam({ inviteToken }: { inviteToken: string }) {
  const qc = useQueryClient();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [joinedPlayerId, setJoinedPlayerId] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["cup-public-team", inviteToken],
    queryFn: () => cupApi.getPublicTeam(inviteToken),
  });

  const join = useMutation({
    mutationFn: () =>
      cupApi.joinTeam({ invite_token: inviteToken, full_name: fullName, email, phone }),
    onSuccess: (res) => {
      setJoinedPlayerId(res.player_id);
      toast.success("You're on the team! Now pay your €10 (or ask your captain to cover it).");
      qc.invalidateQueries({ queryKey: ["cup-public-team", inviteToken] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const [checkout, setCheckout] = useState<CheckoutInput | null>(null);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (isError || !data) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-destructive/40 bg-destructive/5 p-6 text-center">
        <p className="text-sm text-muted-foreground">This invite link isn't valid.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <CupCheckoutDialog checkout={checkout} onClose={() => setCheckout(null)} />
      <div className="mb-6 text-center">
        <div className="mb-2 flex items-center justify-center gap-2">
          <KitDot colour={data.team.kit_colour} size={18} />
          <h1 className="text-3xl font-display font-bold">{data.team.name}</h1>
        </div>
        <p className="text-muted-foreground">
          You've been invited to join this team for the Swap'n'Serve Cup. {data.rosterCount}/7
          players so far.
        </p>
      </div>

      {joinedPlayerId ? (
        <div className="rounded-2xl border border-success/30 bg-success/10 p-6 text-center">
          <Check className="mx-auto mb-2 text-success" />
          <p className="mb-4 font-medium">You're on the roster for {data.team.name}.</p>
          <Button
            variant="cta"
            className="w-full"
            onClick={() =>
              setCheckout({
                mode: "player",
                invite_token: inviteToken,
                player_id: joinedPlayerId,
                returnUrl: `${window.location.origin}/cup`,
              })
            }
          >
            Pay my €10
          </Button>
          <p className="mt-3 text-xs text-muted-foreground">
            Already sorted? Your captain may be covering your entry. You can close this page.
          </p>
        </div>
      ) : data.rosterComplete ? (
        <div className="rounded-2xl border border-border bg-muted/40 p-6 text-center text-sm text-muted-foreground">
          This team already has all 7 players. Ask your captain if you think this is a mistake.
        </div>
      ) : (
        <form
          className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-sm"
          onSubmit={(e) => {
            e.preventDefault();
            join.mutate();
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="join-name">Full name</Label>
            <Input id="join-name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="join-email">Email</Label>
            <Input
              id="join-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="join-phone">Phone</Label>
            <Input
              id="join-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <p className="text-xs text-muted-foreground">{PRIVACY_NOTE}</p>
          <Button type="submit" variant="cta" size="lg" className="w-full" disabled={join.isPending}>
            {join.isPending ? <Loader2 className="animate-spin" /> : null} Join {data.team.name}
          </Button>
        </form>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */

const CupHome = () => {
  const [searchParams] = useSearchParams();
  const manageToken = searchParams.get("manage");
  const inviteToken = searchParams.get("invite");

  const view = useMemo(() => {
    if (inviteToken) return <JoinTeam inviteToken={inviteToken} />;
    if (manageToken) return <ManageTeam manageToken={manageToken} />;
    return <CreateTeam />;
  }, [inviteToken, manageToken]);

  return (
    <CupLayout>
      <div className={manageToken || inviteToken ? "container py-10 md:py-14" : ""}>{isSupabaseConfigured ? view : <ConfigNotice />}</div>
    </CupLayout>
  );
};

export default CupHome;
