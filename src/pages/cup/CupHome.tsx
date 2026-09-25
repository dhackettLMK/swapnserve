import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CalendarDays, Check, Clock3, Copy, Loader2, MapPin, Receipt, Share2, Trophy, UserPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import CupLayout from "@/components/cup/CupLayout";
import { KitDot, StatusBadge, ConfigNotice } from "@/components/cup/CupUi";
import { isSupabaseConfigured } from "@/lib/supabase";
import { cupApi, type CheckoutInput } from "@/lib/cupApi";
import { CupCheckoutDialog } from "@/components/cup/CupCheckoutDialog";
import { CupAssistant } from "@/components/cup/CupAssistant";
import { formatEuros, TEAM_PRICE_CENTS } from "@/lib/teamStatus";
import { captureSignupSource, getSignupSource, setSignupSource } from "@/lib/signupSource";
import type { Payment } from "@/lib/cupTypes";

/** Each player's share of the €70 entry fee. */
const DEPOSIT_CENTS = TEAM_PRICE_CENTS / 7;
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

/* -------------------------------------------------------------------------- */
/*  Solo entry: placed at random into a mixed squad                           */
/* -------------------------------------------------------------------------- */

function SoloEntry() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [checkout, setCheckout] = useState<CheckoutInput | null>(null);

  const startPayment = () =>
    setCheckout({
      mode: "solo",
      full_name: fullName,
      email,
      phone,
      signup_source: getSignupSource() ?? undefined,
      returnUrl: `${window.location.origin}/cup?entry_paid=1`,
    });

  return (
    <section id="solo" className="scroll-mt-24 border-b border-border bg-background py-14 md:py-20">
      <CupCheckoutDialog checkout={checkout} onClose={() => setCheckout(null)} />
      <div className="container grid items-center gap-10 font-cup-body lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-secondary">
            No team? No problem
          </p>
          <h2 className="font-cup-display text-4xl leading-none text-foreground md:text-5xl">
            Sign up on your own and make new friends
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            Sign up as an individual and we put you into a mixed squad with other players who
            entered on their own. You turn up, meet six new team mates, and play the full day
            together. It is the easiest way to meet people in Limerick through football.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
            {[
              "Placed at random into a Free Agents squad of seven",
              "Same €10 as everyone else, same two guaranteed games",
              "We send your squad details and a group chat link before the day",
            ].map((line) => (
              <li key={line} className="flex items-start gap-3">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>

        {(
          <form
            className="w-full min-w-0 space-y-5 rounded-[2rem] border border-border bg-card p-6 shadow-[0_24px_70px_hsl(var(--accent)/0.12)] md:p-8"
            onSubmit={(e) => {
              e.preventDefault();
              startPayment();
            }}
          >
            <h3 className="font-cup-display text-3xl leading-none text-foreground">
              Join as an individual
            </h3>
            <div className="space-y-2">
              <Label htmlFor="solo-name">Full name</Label>
              <Input id="solo-name" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="h-12 rounded-xl bg-background px-4 focus-visible:ring-accent" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="solo-phone">Phone</Label>
              <Input id="solo-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required className="h-12 rounded-xl bg-background px-4 focus-visible:ring-accent" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="solo-email">Email</Label>
              <Input id="solo-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-12 rounded-xl bg-background px-4 focus-visible:ring-accent" />
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">You are placed in a squad once your €10 is paid. {PRIVACY_NOTE}</p>
            <Button type="submit" size="lg" className="cup-primary-cta h-13 w-full rounded-full bg-primary font-cup-body text-base font-bold text-primary-foreground hover:bg-primary/90" >
              <UserPlus /> Pay €10 and join a squad
            </Button>
          </form>
        )}
      </div>
    </section>
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
  /** Captain's €10 deposit, opened as soon as the team row exists. */
  const [deposit, setDeposit] = useState<CheckoutInput | null>(null);
  const [manageToken, setManageToken] = useState<string | null>(null);

  // Nothing is saved until the captain's €10 goes through.
  const create = {
    isPending: false,
    mutate: () =>
      setDeposit({
        mode: "new_team",
        team_name: name,
        full_name: captainName,
        email,
        phone,
        signup_source: getSignupSource(),
        returnUrl: `${window.location.origin}/cup?entry_paid=1`,
      }),
  };

  const eventFacts = [
    { icon: CalendarDays, label: "Date", value: "5 December" },
    { icon: Clock3, label: "Kick-off", value: "2pm until completion" },
    { icon: Users, label: "Format", value: "5-a-side, 2 subs, rolling subs" },
  ];

  return (
    <div className="cup-landing -mt-1">
      <section className="cup-hero relative isolate overflow-hidden bg-primary text-primary-foreground">
        <div className="cup-pitch-lines absolute inset-0 opacity-25" aria-hidden="true" />
        <div className="cup-floodlight absolute inset-x-0 top-0 h-40 opacity-70" aria-hidden="true" />
        <div className="container relative z-10 grid min-h-[680px] items-center gap-8 py-12 lg:min-h-[720px] lg:grid-cols-[1.15fr_0.85fr] lg:py-16">
          <div className="min-w-0 animate-fade-up text-center lg:text-left">
            <p className="mb-5 font-cup-body text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Limerick grassroots football
            </p>
            <div className="relative mx-auto w-full min-w-0 max-w-[620px] lg:mx-0">
              <img
                src={cupWordmark}
                alt="Swap'n'Serve"
                className="cup-wordmark w-full min-w-0 max-w-full"
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
              A community tournament with permanent goals left for the local
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
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <Link
                to="/cup/format"
                className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 px-5 py-2.5 font-cup-body text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10"
              >
                View the tournament format
              </Link>
              <a
                href="#solo"
                onClick={() => setSignupSource("cup-page-solo")}
                className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-5 py-2.5 font-cup-body text-sm font-semibold text-accent transition-colors hover:bg-accent/20"
              >
                <UserPlus className="h-4 w-4" /> No team? Sign up on your own
              </a>
            </div>
          </div>


          <form
            id="register"
            className="cup-register-form w-full min-w-0 max-w-xl scroll-mt-24 space-y-5 justify-self-center rounded-[2rem] border border-border bg-card p-6 text-card-foreground shadow-[0_24px_70px_hsl(var(--accent)/0.14)] md:p-8 lg:justify-self-end"
            onSubmit={(e) => {
              e.preventDefault();
              create.mutate();
            }}
          >
            <div className="font-cup-body">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-secondary">Registration</p>
              <h2 className="mt-1 font-cup-display text-4xl leading-none text-foreground">Register your team</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Your captain creates the team and pays their own €10 as a deposit to hold the place. We then provide a private link to invite the remaining six players and arrange the rest of the payment.
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
              {create.isPending ? <Loader2 className="animate-spin" /> : <Trophy />} Create team · pay your €10 deposit
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

      <SoloEntry />

      <section className="bg-card py-14 md:py-20">
        <div className="container font-cup-body">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-secondary">Match venue</p>
          <h2 className="font-cup-display text-5xl leading-none text-foreground md:text-6xl">Summerville Rovers FC Astro</h2>
          <div className="mt-6 flex items-start gap-3 text-muted-foreground">
            <MapPin className="mt-0.5 shrink-0 text-primary" size={20} />
            <p>124 Ballinacurra Gardens, Ballinacurra Weston, Limerick, V94 R98D</p>
          </div>
        </div>
      </section>

      <CupCheckoutDialog
        checkout={deposit}
        onClose={() => {
          setDeposit(null);
        }}
      />
    </div>
  );
}


/* -------------------------------------------------------------------------- */
/*  Manage a team (captain dashboard)                                         */
/* -------------------------------------------------------------------------- */

/** Lets the captain choose how many players to pay for in one go. */
function PaySharesPanel({
  outstandingCents,
  onPay,
  onPayAll,
}: {
  outstandingCents: number;
  onPay: (shares: number) => void;
  onPayAll: () => void;
}) {
  const maxShares = Math.min(7, Math.max(1, Math.ceil(outstandingCents / DEPOSIT_CENTS)));
  const [shares, setShares] = useState(1);
  const count = Math.min(shares, maxShares);
  const amount = Math.min(count * DEPOSIT_CENTS, outstandingCents);
  const payingAll = amount >= outstandingCents;

  return (
    <div className="mt-4 rounded-xl border border-border p-4">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-sm font-semibold">How many players do you want to pay for?</p>
        <p className="text-lg font-bold text-primary">{formatEuros(amount)}</p>
      </div>

      <Slider
        value={[count]}
        min={1}
        max={maxShares}
        step={1}
        onValueChange={(v) => setShares(v[0])}
        className="mt-4"
      />
      <div className="mt-2 flex justify-between text-xs text-muted-foreground">
        <span>1 player</span>
        <span className="font-semibold text-foreground">
          {count} {count === 1 ? "player" : "players"} at €10 each
        </span>
        <span>
          {maxShares} {maxShares === 1 ? "player" : "players"}
        </span>
      </div>

      <Button
        variant="cta"
        className="mt-4 w-full"
        onClick={() => (payingAll ? onPayAll() : onPay(count))}
      >
        Pay {formatEuros(amount)}
        {payingAll ? " and register the team" : ""}
      </Button>
      <p className="mt-2 text-center text-xs text-muted-foreground">
        {formatEuros(outstandingCents)} is outstanding. Your players can also pay their own €10 from
        the list below or through the invite link.
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function ManageTeam({ manageToken }: { manageToken: string }) {
  const qc = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [checkout, setCheckout] = useState<CheckoutInput | null>(null);
  const [justPaid, setJustPaid] = useState(false);
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
        setJustPaid(true);
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

  const { team, players, payments, summary } = data;
  const pct = Math.round((summary.paidCents / TEAM_PRICE_CENTS) * 100);
  const captainPaid = players.some((p) => p.is_captain && p.paid);
  const paidPayments = payments.filter((p) => p.status === "paid");
  const playerName = (id: string | null) =>
    players.find((p) => p.id === id)?.full_name ?? null;
  const paymentLabel = (p: Payment) => {
    const name = playerName(p.player_id);
    if (name) return `${name}${p.player_id === players.find((x) => x.is_captain)?.id ? " (captain deposit)" : ""}`;
    if (p.covers_player_ids.length > 1) return `Team payment for ${p.covers_player_ids.length} players`;
    return "Team payment";
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <CupCheckoutDialog checkout={checkout} onClose={() => setCheckout(null)} />

      {justPaid && (
        <div className="animate-fade-up rounded-2xl border border-success/40 bg-success/10 p-6 text-center shadow-sm">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-success/20 text-success">
            <Check size={28} />
          </div>
          <h2 className="font-section text-2xl font-bold">Payment received</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Thanks, {team.captain_name.split(" ")[0]}. Your payment for {team.name} went through.
          </p>

          <dl className="mx-auto mt-5 max-w-sm space-y-2 rounded-xl border border-border bg-card p-4 text-left text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Team</dt>
              <dd className="font-medium">{team.name}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Paid so far</dt>
              <dd className="font-medium">
                {formatEuros(summary.paidCents)} of {formatEuros(TEAM_PRICE_CENTS)}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Status</dt>
              <dd className="font-medium">
                {summary.outstandingCents > 0
                  ? `${formatEuros(summary.outstandingCents)} left to register`
                  : "Officially registered"}
              </dd>
            </div>
          </dl>

          <p className="mt-4 text-sm text-muted-foreground">
            {summary.outstandingCents > 0
              ? "Next: share your invite link below so your six teammates can join and pay their €10."
              : "Your team is in the draw. See you on the pitch on 5 December."}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Your receipt goes to {team.captain_email}. Keep this page bookmarked, it is your private
            team link.
          </p>
          <Button variant="outline" className="mt-5 rounded-full" onClick={() => setJustPaid(false)}>
            Continue to my team
          </Button>
        </div>
      )}

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

        <div className="mt-6 rounded-xl border border-border p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Roster</p>
          <p className="mt-1 text-2xl font-bold">{summary.rosterCount}/7 players</p>
          {summary.rosterNeeded > 0 && (
            <p className="text-xs text-muted-foreground">{summary.rosterNeeded} more to invite</p>
          )}
        </div>

        <div className="mt-4 rounded-xl border border-border p-5">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Entry fee progress
              </p>
              <p className="mt-1 text-3xl font-bold leading-none">
                {formatEuros(summary.paidCents)}
                <span className="text-lg font-normal text-muted-foreground">
                  {" "}
                  / {formatEuros(TEAM_PRICE_CENTS)}
                </span>
              </p>
            </div>
            <p className="text-sm font-semibold text-muted-foreground">{pct}%</p>
          </div>

          <Progress value={pct} className="mt-3 h-3" />

          <p className="mt-3 text-sm text-muted-foreground">
            {summary.outstandingCents > 0 ? (
              <>
                <span className="font-semibold text-foreground">
                  {formatEuros(summary.outstandingCents)} left
                </span>{" "}
                until your team is officially registered for the tournament. Your place is only
                confirmed once the full {formatEuros(TEAM_PRICE_CENTS)} has been paid.
              </>
            ) : (
              <>
                The full {formatEuros(TEAM_PRICE_CENTS)} is paid. Your team is officially
                registered.
              </>
            )}
          </p>

          {summary.outstandingCents > 0 && (
            <PaySharesPanel
              outstandingCents={summary.outstandingCents}
              onPay={(shares) =>
                setCheckout({ mode: "shares", shares, manage_token: manageToken, returnUrl })
              }
              onPayAll={() =>
                setCheckout({ mode: "full", manage_token: manageToken, returnUrl })
              }
            />
          )}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-border p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Captain deposit</p>
            <p className="mt-1 text-xl font-bold">{formatEuros(DEPOSIT_CENTS)}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {captainPaid ? "Paid" : "Not paid yet"}
            </p>
          </div>
          <div className="rounded-xl border border-border p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Balance left</p>
            <p className="mt-1 text-xl font-bold">{formatEuros(summary.outstandingCents)}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {summary.outstandingCents > 0
                ? `${Math.ceil(summary.outstandingCents / DEPOSIT_CENTS)} × €10 still to come`
                : "Nothing left to pay"}
            </p>
          </div>
          <div className="rounded-xl border border-border p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Registration</p>
            <p
              className={`mt-1 text-xl font-bold ${summary.fullyPaid ? "text-success" : "text-foreground"}`}
            >
              {summary.fullyPaid ? "Registered" : "Not yet"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {summary.fullyPaid ? "Your place is confirmed" : "Confirmed once €70 is paid"}
            </p>
          </div>
        </div>
      </div>

      {/* Payment history */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <Receipt size={16} className="text-primary" />
          <h2 className="font-section text-lg font-bold">Payment history</h2>
        </div>
        {paidPayments.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No payments yet. Your €10 deposit shows here as soon as it goes through.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {paidPayments.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <p className="text-sm font-medium">{paymentLabel(p)}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(p.created_at).toLocaleDateString("en-IE", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <span className="text-sm font-semibold">{formatEuros(p.amount_cents)}</span>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-4 flex justify-between border-t border-border pt-3 text-sm font-semibold">
          <span>Total paid</span>
          <span>
            {formatEuros(summary.paidCents)}{" "}
            <span className="font-normal text-muted-foreground">
              of {formatEuros(TEAM_PRICE_CENTS)}
            </span>
          </span>
        </p>
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

      <CupAssistant manageToken={manageToken} />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Join a team (teammate)                                                    */
/* -------------------------------------------------------------------------- */

function JoinTeam({ inviteToken }: { inviteToken: string }) {
  const qc = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [joinedPlayerId, setJoinedPlayerId] = useState<string | null>(null);
  const [justPaid, setJustPaid] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["cup-public-team", inviteToken],
    queryFn: () => cupApi.getPublicTeam(inviteToken),
  });

  // Coming back from Stripe: confirm the €10, then show the receipt panel.
  useEffect(() => {
    if (searchParams.get("paid") !== "1") return;
    const sessionId = searchParams.get("session_id");
    const refresh = async () => {
      if (sessionId) {
        try {
          await cupApi.confirmPayment(sessionId);
        } catch {
          // The webhook catches up; the refresh below still shows it.
        }
      }
      setJustPaid(true);
      qc.invalidateQueries({ queryKey: ["cup-public-team", inviteToken] });
      searchParams.delete("paid");
      searchParams.delete("session_id");
      setSearchParams(searchParams, { replace: true });
    };
    refresh();
  }, [searchParams, setSearchParams, qc, inviteToken]);

  const join = useMutation({
    mutationFn: () =>
      cupApi.joinTeam({ invite_token: inviteToken, full_name: fullName, email, phone }),
    onSuccess: (res) => {
      setJoinedPlayerId(res.player_id);
      toast.success("You're on the team. Your captain has covered your €10.");
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

      {justPaid && (
        <div className="animate-fade-up mb-6 rounded-2xl border border-success/40 bg-success/10 p-6 text-center shadow-sm">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-success/20 text-success">
            <Check size={28} />
          </div>
          <h2 className="font-section text-2xl font-bold">Payment received</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Your €10 is paid and your place in {data.team.name} is held.
          </p>

          <dl className="mx-auto mt-5 max-w-sm space-y-2 rounded-xl border border-border bg-card p-4 text-left text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Squad</dt>
              <dd className="font-medium">{data.team.name}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">You paid</dt>
              <dd className="font-medium">{formatEuros(DEPOSIT_CENTS)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Squad total</dt>
              <dd className="font-medium">
                {formatEuros(data.paidCents)} of {formatEuros(TEAM_PRICE_CENTS)}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Status</dt>
              <dd className="font-medium">
                {data.outstandingCents > 0
                  ? `${formatEuros(data.outstandingCents)} left to register`
                  : "Officially registered"}
              </dd>
            </div>
          </dl>

          <p className="mt-4 text-sm text-muted-foreground">
            {data.team.is_pool
              ? "We fill your squad with other players who signed up on their own, then send you your team mates and the kick-off details before the day."
              : data.outstandingCents > 0
                ? "Your squad is registered once every place is paid for."
                : "Your squad is in the draw. See you on the pitch on 5 December."}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Your receipt is emailed to you by our payment provider. Bookmark this page to follow
            your squad filling up.
          </p>
          <Button variant="outline" className="mt-5 rounded-full" onClick={() => setJustPaid(false)}>
            Continue
          </Button>
        </div>
      )}

      <div className="mb-6 text-center">
        <div className="mb-2 flex items-center justify-center gap-2">
          <KitDot colour={data.team.kit_colour} size={18} />
          <h1 className="text-3xl font-display font-bold">{data.team.name}</h1>
        </div>
        <p className="text-muted-foreground">
          {data.team.is_pool
            ? `Your mixed squad for the Swap'n'Serve Cup. ${data.rosterCount}/7 players so far.`
            : `You've been invited to join this team for the Swap'n'Serve Cup. ${data.rosterCount}/7 players so far.`}
        </p>
      </div>

      <div className="mb-6 rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-end justify-between gap-3">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Entry fee progress
          </p>
          <p className="text-lg font-bold">
            {formatEuros(data.paidCents)}
            <span className="text-sm font-normal text-muted-foreground">
              {" "}
              / {formatEuros(TEAM_PRICE_CENTS)}
            </span>
          </p>
        </div>
        <Progress
          value={Math.round((data.paidCents / TEAM_PRICE_CENTS) * 100)}
          className="mt-2 h-2.5"
        />
        <p className="mt-2 text-xs text-muted-foreground">
          {data.outstandingCents > 0
            ? `${formatEuros(data.outstandingCents)} left before this team is officially registered.`
            : "Paid in full. This team is officially registered."}
        </p>
      </div>

      {joinedPlayerId ? (
        <div className="rounded-2xl border border-success/30 bg-success/10 p-6 text-center">
          <Check className="mx-auto mb-2 text-success" />
          <p className="font-medium">You're on the roster for {data.team.name}.</p>
          <p className="mt-2 text-sm text-muted-foreground">Your captain has already paid your €10. See you on the pitch.</p>
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
            if ((data.prepaidSlots ?? 0) > 0) {
              join.mutate();
            } else {
              setCheckout({
                mode: "join",
                invite_token: inviteToken,
                full_name: fullName,
                email,
                phone,
                returnUrl: `${window.location.origin}/cup?entry_paid=1`,
              });
            }
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
          <p className="text-xs text-muted-foreground">You are only added to the team once your €10 is paid. {PRIVACY_NOTE}</p>
          <Button type="submit" variant="cta" size="lg" className="w-full" disabled={join.isPending}>
            {join.isPending ? <Loader2 className="animate-spin" /> : null}{" "}
            {(data.prepaidSlots ?? 0) > 0
              ? `Join ${data.team.name} (already paid for by your captain)`
              : `Pay €10 and join ${data.team.name}`}
          </Button>
        </form>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Back from payment: create the entry, then send them to their page          */
/* -------------------------------------------------------------------------- */

function PaymentReturn() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId) {
      setFailed(true);
      return;
    }
    let tries = 0;
    let cancelled = false;
    const attempt = async () => {
      try {
        const res = await cupApi.confirmPayment(sessionId);
        if (res.status === "paid" && (res.manage_token || res.invite_token)) {
          navigate(
            res.manage_token
              ? `/cup?manage=${res.manage_token}&paid=1`
              : `/cup?invite=${res.invite_token}&paid=1`,
            { replace: true },
          );
          return;
        }
      } catch {
        // retry below
      }
      if (cancelled) return;
      if (++tries < 6) window.setTimeout(attempt, 2500);
      else setFailed(true);
    };
    attempt();
    return () => {
      cancelled = true;
    };
  }, [searchParams, navigate]);

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
      {failed ? (
        <>
          <h1 className="font-section text-2xl font-bold">We couldn't confirm your payment yet</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            If money left your account, email swapnserve@gmail.com and we will sort it straight away.
          </p>
        </>
      ) : (
        <>
          <Loader2 className="mx-auto mb-3 animate-spin text-secondary" />
          <h1 className="font-section text-2xl font-bold">Payment received</h1>
          <p className="mt-2 text-sm text-muted-foreground">Setting up your place now...</p>
        </>
      )}
    </div>
  );
}

const CupHome = () => {
  const [searchParams] = useSearchParams();
  const manageToken = searchParams.get("manage");
  const inviteToken = searchParams.get("invite");

  // Remember which button brought them here.
  useEffect(() => {
    captureSignupSource();
  }, []);

  // Deep links such as /cup#solo scroll straight to individual registration.
  useEffect(() => {
    if (manageToken || inviteToken) return;
    if (window.location.hash !== "#solo") return;
    const t = window.setTimeout(() => {
      document.getElementById("solo")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);
    return () => window.clearTimeout(t);
  }, [manageToken, inviteToken]);

  const entryPaid = searchParams.get("entry_paid") === "1";
  const view = useMemo(() => {
    if (entryPaid) return <PaymentReturn />;
    if (inviteToken) return <JoinTeam inviteToken={inviteToken} />;
    if (manageToken) return <ManageTeam manageToken={manageToken} />;
    return <CreateTeam />;
  }, [inviteToken, manageToken, entryPaid]);

  return (
    <CupLayout>
      <div className={manageToken || inviteToken || entryPaid ? "container py-10 md:py-14" : ""}>{isSupabaseConfigured ? view : <ConfigNotice />}</div>
    </CupLayout>
  );
};

export default CupHome;
