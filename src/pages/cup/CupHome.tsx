import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Check, Copy, Loader2, Share2, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CupLayout from "@/components/cup/CupLayout";
import { KitDot, StatusBadge, ConfigNotice } from "@/components/cup/CupUi";
import { isSupabaseConfigured } from "@/lib/supabase";
import { cupApi } from "@/lib/cupApi";
import { KIT_COLOURS } from "@/lib/cupTypes";
import { formatEuros, TEAM_PRICE_CENTS } from "@/lib/teamStatus";

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
          toast.error("Couldn't copy — select and copy manually.");
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
  const [kit, setKit] = useState("");
  const [captainName, setCaptainName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const create = useMutation({
    mutationFn: () =>
      cupApi.createTeam({
        name,
        kit_colour: kit,
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

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/15 border border-accent/30">
          <Trophy className="text-accent" />
        </div>
        <h1 className="text-3xl font-display font-bold mb-2">Register your team</h1>
        <p className="text-muted-foreground">
          5-a-side, World Cup format, €1,000 prize pot. Teams are 7 players at €10 a head — €70 in
          total. Create your team, then invite your squad.
        </p>
      </div>

      <form
        className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-sm"
        onSubmit={(e) => {
          e.preventDefault();
          create.mutate();
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="team-name">Team name</Label>
          <Input
            id="team-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Shannonside Rovers"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="kit">Kit colour (the whole team wears this)</Label>
          <Select value={kit} onValueChange={setKit}>
            <SelectTrigger id="kit">
              <SelectValue placeholder="Choose a colour" />
            </SelectTrigger>
            <SelectContent>
              {KIT_COLOURS.map((c) => (
                <SelectItem key={c.name} value={c.name}>
                  <span className="flex items-center gap-2">
                    <KitDot colour={c.name} /> {c.name}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="captain-name">Captain name</Label>
            <Input
              id="captain-name"
              value={captainName}
              onChange={(e) => setCaptainName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="captain-phone">Captain phone</Label>
            <Input
              id="captain-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="captain-email">Captain email</Label>
          <Input
            id="captain-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="We'll send your team management link here"
            required
          />
        </div>

        <p className="text-xs text-muted-foreground">{PRIVACY_NOTE}</p>

        <Button type="submit" variant="cta" size="lg" className="w-full" disabled={create.isPending}>
          {create.isPending ? <Loader2 className="animate-spin" /> : <Trophy />} Create team
        </Button>
      </form>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Manage a team (captain dashboard)                                         */
/* -------------------------------------------------------------------------- */

function ManageTeam({ manageToken }: { manageToken: string }) {
  const qc = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["cup-team", manageToken],
    queryFn: () => cupApi.getTeam(manageToken),
  });

  // Handle the Stripe redirect back to this page.
  useEffect(() => {
    if (searchParams.get("paid") === "1") {
      toast.success("Payment received — thanks! Your team status is updating.");
      qc.invalidateQueries({ queryKey: ["cup-team", manageToken] });
      searchParams.delete("paid");
      setSearchParams(searchParams, { replace: true });
    } else if (searchParams.get("canceled") === "1") {
      toast("Payment canceled — no charge was made.");
      searchParams.delete("canceled");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams, qc, manageToken]);

  const payFull = useMutation({
    mutationFn: () => cupApi.checkout({ mode: "full", manage_token: manageToken }),
    onSuccess: (res) => {
      window.location.href = res.url;
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const payPlayer = useMutation({
    mutationFn: (playerId: string) =>
      cupApi.checkout({ mode: "player", manage_token: manageToken, player_id: playerId }),
    onSuccess: (res) => {
      window.location.href = res.url;
    },
    onError: (e: Error) => toast.error(e.message),
  });

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
            🎉 Your team is fully registered and in the draw. Nothing more to do — see you on the
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
            onClick={() => payFull.mutate()}
            disabled={payFull.isPending}
          >
            {payFull.isPending ? <Loader2 className="animate-spin" /> : null}
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
                  onClick={() => payPlayer.mutate(p.id)}
                  disabled={payPlayer.isPending}
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
          Bookmark this page — it's your private link to manage the team.
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

  const payMine = useMutation({
    mutationFn: () =>
      cupApi.checkout({ mode: "player", invite_token: inviteToken, player_id: joinedPlayerId! }),
    onSuccess: (res) => {
      window.location.href = res.url;
    },
    onError: (e: Error) => toast.error(e.message),
  });

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
            onClick={() => payMine.mutate()}
            disabled={payMine.isPending}
          >
            {payMine.isPending ? <Loader2 className="animate-spin" /> : null} Pay my €10
          </Button>
          <p className="mt-3 text-xs text-muted-foreground">
            Already sorted? Your captain may be covering your entry — you can close this page.
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
      <div className="container py-10 md:py-14">{isSupabaseConfigured ? view : <ConfigNotice />}</div>
    </CupLayout>
  );
};

export default CupHome;
