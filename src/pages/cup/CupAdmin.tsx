import { Fragment, useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Check, Copy, Loader2, Lock, Mail, Pencil, RefreshCw, Shuffle, Trash2, Trophy, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CupLayout from "@/components/cup/CupLayout";
import { ConfigNotice, KitDot, StatusBadge } from "@/components/cup/CupUi";
import { BracketView } from "@/components/cup/TournamentView";
import { isSupabaseConfigured } from "@/lib/supabase";
import { cupApi } from "@/lib/cupApi";
import { formatEuros, TEAM_PRICE_CENTS } from "@/lib/teamStatus";
import { Progress } from "@/components/ui/progress";
import type { CupMatch } from "@/lib/cupTypes";

const TOKEN_KEY = "cup_admin_token";

const SOURCE_LABELS: Record<string, string> = {
  hero: "Homepage hero button",
  header: "Top menu button",
  "header-mobile": "Mobile menu button",
  "mobile-bar": "Mobile bottom bar",
  "cta-banner": "Homepage banner",
  "programme-team": "Cup card: register your team",
  "programme-solo": "Cup card: register as an individual",
  "volunteer-teaser": "Get involved teaser",
  "cup-page-solo": "Cup page: sign up on your own",
  direct: "Direct or shared link",
};

function MatchRow({
  match,
  token,
  teamName,
}: {
  match: CupMatch;
  token: string;
  teamName: (id: string | null) => string;
}) {
  const qc = useQueryClient();
  const [home, setHome] = useState(match.home_goals?.toString() ?? "");
  const [away, setAway] = useState(match.away_goals?.toString() ?? "");

  const save = useMutation({
    mutationFn: () =>
      cupApi.admin.recordMatch(token, {
        match_id: match.id,
        home_goals: Number(home),
        away_goals: Number(away),
      }),
    onSuccess: () => {
      toast.success("Result saved");
      qc.invalidateQueries({ queryKey: ["cup-tournament"] });
      qc.invalidateQueries({ queryKey: ["cup-admin"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const ready = match.home_team_id && match.away_team_id;

  return (
    <div className="flex items-center gap-2 py-2 text-sm">
      <span className="flex-1 text-right">{teamName(match.home_team_id)}</span>
      <Input
        type="number"
        min={0}
        value={home}
        onChange={(e) => setHome(e.target.value)}
        className="h-8 w-14 text-center"
        disabled={!ready}
      />
      <span className="text-muted-foreground">–</span>
      <Input
        type="number"
        min={0}
        value={away}
        onChange={(e) => setAway(e.target.value)}
        className="h-8 w-14 text-center"
        disabled={!ready}
      />
      <span className="flex-1">{teamName(match.away_team_id)}</span>
      <Button
        size="sm"
        variant="outline"
        disabled={!ready || home === "" || away === "" || save.isPending}
        onClick={() => save.mutate()}
      >
        {save.isPending ? <Loader2 className="animate-spin" size={14} /> : "Save"}
      </Button>
    </div>
  );
}

/** Organiser controls for renaming or removing a team. */
function TeamActions({
  token,
  teamId,
  currentName,
}: {
  token: string;
  teamId: string;
  currentName: string;
}) {
  const qc = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(currentName);

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["cup-admin"] });
    qc.invalidateQueries({ queryKey: ["cup-tournament"] });
  };

  const rename = useMutation({
    mutationFn: () => cupApi.admin.renameTeam(token, { team_id: teamId, name: name.trim() }),
    onSuccess: () => {
      toast.success("Team name updated");
      setEditing(false);
      refresh();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: () => cupApi.admin.deleteTeam(token, teamId),
    onSuccess: () => {
      toast.success("Team removed");
      refresh();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (editing) {
    return (
      <div className="flex items-center gap-2">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-8 w-40"
          autoFocus
        />
        <Button
          size="sm"
          disabled={rename.isPending || name.trim().length < 2}
          onClick={() => rename.mutate()}
        >
          {rename.isPending ? <Loader2 className="animate-spin" size={14} /> : "Save"}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setName(currentName);
            setEditing(false);
          }}
        >
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
        <Pencil size={14} /> Rename
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className="text-destructive hover:text-destructive"
        disabled={remove.isPending}
        onClick={() => {
          if (
            confirm(
              `Remove "${currentName}"? Their players and payment records will be deleted too. This can't be undone.`,
            )
          )
            remove.mutate();
        }}
      >
        {remove.isPending ? <Loader2 className="animate-spin" size={14} /> : <Trash2 size={14} />}
      </Button>
    </div>
  );
}

/** Copies a link to the clipboard. */
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

/** Every team's private payment links, so lost links can be resent. */
function TeamLinks({
  teams,
}: {
  teams: { team: { id: string; name: string; captain_name: string; captain_email: string; invite_token: string; manage_token: string } }[];
}) {
  const origin = typeof window === "undefined" ? "" : window.location.origin;

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h2 className="mb-1 font-section text-lg font-bold">Payment links</h2>
      <p className="mb-4 text-sm text-muted-foreground">
        Every team's private links. If a captain loses theirs, copy it here and send it on. The
        captain link manages the team and pays the balance. The player link is for teammates to join
        and pay their €10.
      </p>

      <div className="space-y-4">
        {teams.map(({ team }) => {
          const manageUrl = `${origin}/cup?manage=${team.manage_token}`;
          const inviteUrl = `${origin}/cup?invite=${team.invite_token}`;
          const mailto = `mailto:${team.captain_email}?subject=${encodeURIComponent(
            `Your Swap'N'Serve Cup links for ${team.name}`,
          )}&body=${encodeURIComponent(
            `Hi ${team.captain_name},\n\nHere are your private links for ${team.name}.\n\nManage your team and pay: ${manageUrl}\n\nShare this with your players so they can join and pay their €10: ${inviteUrl}\n\nKeep the first link private.\n\nSwap'N'Serve Cup`,
          )}`;

          return (
            <div key={team.id} className="rounded-xl border border-border p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium">{team.name}</span>
                <Button size="sm" variant="secondary" asChild>
                  <a href={mailto}>
                    <Mail size={14} /> Email the captain
                  </a>
                </Button>
              </div>

              <div className="space-y-2">
                <div>
                  <Label className="text-xs text-muted-foreground">Captain link (private)</Label>
                  <div className="mt-1 flex flex-col gap-2 sm:flex-row">
                    <Input readOnly value={manageUrl} className="font-mono text-xs" />
                    <CopyButton value={manageUrl} label="Copy" />
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Player join link</Label>
                  <div className="mt-1 flex flex-col gap-2 sm:flex-row">
                    <Input readOnly value={inviteUrl} className="font-mono text-xs" />
                    <CopyButton value={inviteUrl} label="Copy" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {teams.length === 0 && (
          <p className="py-4 text-center text-sm text-muted-foreground">No teams yet.</p>
        )}
      </div>
    </div>
  );
}

function AdminConsole({ token, onSignOut }: { token: string; onSignOut: () => void }) {
  const qc = useQueryClient();
  const [groupSize, setGroupSize] = useState("4");
  const [qualifiers, setQualifiers] = useState("2");
  const [openTeamId, setOpenTeamId] = useState<string | null>(null);

  const list = useQuery({ queryKey: ["cup-admin"], queryFn: () => cupApi.admin.list(token) });
  const tournament = useQuery({ queryKey: ["cup-tournament"], queryFn: () => cupApi.tournament() });

  const teamName = (id: string | null) =>
    id ? tournament.data?.teams[id]?.name ?? "Unknown" : "TBD";

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["cup-admin"] });
    qc.invalidateQueries({ queryKey: ["cup-tournament"] });
  };

  const genGroups = useMutation({
    mutationFn: () =>
      cupApi.admin.generateGroups(token, {
        group_size: Number(groupSize),
        qualifiers_per_group: Number(qualifiers),
      }),
    onSuccess: () => {
      toast.success("Groups drawn");
      refresh();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const genKnockout = useMutation({
    mutationFn: () => cupApi.admin.generateKnockout(token),
    onSuccess: () => {
      toast.success("Knockout bracket generated");
      refresh();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const reset = useMutation({
    mutationFn: () => cupApi.admin.reset(token),
    onSuccess: () => {
      toast.success("Tournament reset");
      refresh();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (list.isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (list.isError || !list.data) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-destructive/40 bg-destructive/5 p-6 text-center">
        <p className="mb-3 text-sm text-muted-foreground">
          {(list.error as Error)?.message ?? "Couldn't load admin data."}
        </p>
        <Button variant="outline" onClick={onSignOut}>
          Re-enter passcode
        </Button>
      </div>
    );
  }

  const { teams, totals, signups } = list.data;
  const groupMatches = (tournament.data?.matches ?? []).filter((m) => m.stage === "group");
  const knockoutMatches = (tournament.data?.matches ?? [])
    .filter((m) => m.stage === "knockout")
    .sort((a, b) => (a.round ?? 0) - (b.round ?? 0));

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-display font-bold">Cup admin</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={refresh}>
            <RefreshCw size={14} /> Refresh
          </Button>
          <Button variant="ghost" size="sm" onClick={onSignOut}>
            Lock
          </Button>
        </div>
      </div>

      {/* Totals */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Teams</p>
          <p className="text-2xl font-bold">{totals.teamCount}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Registered</p>
          <p className="text-2xl font-bold">{totals.registeredCount}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Money in</p>
          <p className="text-2xl font-bold">{formatEuros(totals.totalPaidCents)}</p>
        </div>
      </div>

      {/* Sign-up mix */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h2 className="mb-4 font-section text-lg font-bold">Sign-ups</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-muted/50 p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Captains</p>
            <p className="text-2xl font-bold">{signups.captains}</p>
          </div>
          <div className="rounded-xl bg-muted/50 p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Individuals</p>
            <p className="text-2xl font-bold">{signups.individuals}</p>
          </div>
          <div className="rounded-xl bg-muted/50 p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Joined a team by invite
            </p>
            <p className="text-2xl font-bold">{signups.teammates}</p>
          </div>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="py-2 pr-3 font-medium">Button</th>
                <th className="py-2 pr-3 font-medium">Captains</th>
                <th className="py-2 pr-3 font-medium">Individuals</th>
              </tr>
            </thead>
            <tbody>
              {signups.sources.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-3 text-muted-foreground">
                    No sign-ups yet.
                  </td>
                </tr>
              )}
              {signups.sources.map((row) => (
                <tr key={row.source} className="border-t border-border/60">
                  <td className="py-2 pr-3 font-medium">{SOURCE_LABELS[row.source] ?? row.source}</td>
                  <td className="py-2 pr-3">{row.captains}</td>
                  <td className="py-2 pr-3">{row.individuals}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>


      {/* Teams table */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h2 className="mb-4 font-section text-lg font-bold">Teams</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="py-2 pr-3 font-medium">Team</th>
                <th className="py-2 pr-3 font-medium">Status</th>
                <th className="py-2 pr-3 font-medium">Roster</th>
                <th className="py-2 pr-3 font-medium">Paid</th>
                <th className="py-2 pr-3 font-medium">Captain</th>
                <th className="py-2 pr-3 font-medium">Manage</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((row) => (
                <Fragment key={row.team.id}>
                <tr className="border-t border-border align-top">
                  <td className="py-2 pr-3">
                    <span className="inline-flex items-center gap-2 font-medium">
                      <KitDot colour={row.team.kit_colour} /> {row.team.name}
                    </span>
                  </td>
                  <td className="py-2 pr-3">
                    <StatusBadge status={row.summary.status} />
                  </td>
                  <td className="py-2 pr-3">
                    <button
                      type="button"
                      onClick={() => setOpenTeamId(openTeamId === row.team.id ? null : row.team.id)}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                        openTeamId === row.team.id
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border hover:bg-muted"
                      }`}
                      aria-expanded={openTeamId === row.team.id}
                    >
                      <Users size={12} />
                      {row.summary.rosterCount}/7
                    </button>
                  </td>
                  <td className="w-40 py-2 pr-3">
                    <span className="whitespace-nowrap">
                      {formatEuros(row.summary.paidCents)}
                      <span className="text-muted-foreground">
                        {" "}
                        / {formatEuros(TEAM_PRICE_CENTS)}
                      </span>
                    </span>
                    <Progress
                      value={Math.round((row.summary.paidCents / TEAM_PRICE_CENTS) * 100)}
                      className="mt-1 h-1.5"
                    />
                    {row.summary.outstandingCents > 0 && (
                      <span className="text-xs text-muted-foreground">
                        {formatEuros(row.summary.outstandingCents)} left to register
                      </span>
                    )}
                  </td>
                  <td className="py-2 pr-3 text-xs text-muted-foreground">
                    {row.team.captain_name}
                    <br />
                    {row.team.captain_email}
                    <br />
                    {row.team.captain_phone}
                  </td>
                  <td className="py-2 pr-3">
                    <TeamActions
                      token={token}
                      teamId={row.team.id}
                      currentName={row.team.name}
                    />
                  </td>
                </tr>
                {openTeamId === row.team.id && (
                  <tr>
                    <td colSpan={6} className="border-t border-border bg-muted/30 p-4">
                      {row.players.length === 0 ? (
                        <p className="py-2 text-sm text-muted-foreground">
                          No players yet. Share the team's join link to fill the squad.
                        </p>
                      ) : (
                        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                          {row.players.map((p) => (
                            <div key={p.id} className="rounded-xl border border-border bg-card p-3 text-sm">
                              <div className="mb-1 flex flex-wrap items-center gap-2">
                                <span className="font-medium">{p.full_name}</span>
                                {p.is_captain && (
                                  <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground">
                                    Captain
                                  </span>
                                )}
                                {p.is_solo && (
                                  <span className="rounded-full bg-terracotta px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                                    Individual
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground break-all">{p.email}</p>
                              <p className="text-xs text-muted-foreground">{p.phone}</p>
                              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                                <span
                                  className={`text-xs font-medium ${
                                    p.paid ? "text-primary" : "text-muted-foreground"
                                  }`}
                                >
                                  {p.paid
                                    ? `Paid ${formatEuros(p.amount_paid_cents)}`
                                    : "Not paid yet"}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  Joined{" "}
                                  {new Date(p.created_at).toLocaleDateString("en-IE", {
                                    day: "numeric",
                                    month: "short",
                                  })}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                )}
                </Fragment>
              ))}
              {teams.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-muted-foreground">
                    No teams yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <TeamLinks teams={teams} />



      {/* Tournament controls */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h2 className="mb-1 font-section text-lg font-bold">Generate tournament</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Draw balanced groups from all <strong>registered</strong> teams, then generate the
          knockout bracket once group results are in.{" "}
          {tournament.data?.tournament && (
            <span className="font-medium">Current stage: {tournament.data.tournament.status}.</span>
          )}
        </p>
        <div className="flex flex-wrap items-end gap-3">
          <div className="space-y-1">
            <Label htmlFor="group-size" className="text-xs">
              Group size
            </Label>
            <Input
              id="group-size"
              type="number"
              min={2}
              value={groupSize}
              onChange={(e) => setGroupSize(e.target.value)}
              className="h-9 w-24"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="qualifiers" className="text-xs">
              Qualify / group
            </Label>
            <Input
              id="qualifiers"
              type="number"
              min={1}
              value={qualifiers}
              onChange={(e) => setQualifiers(e.target.value)}
              className="h-9 w-24"
            />
          </div>
          <Button onClick={() => genGroups.mutate()} disabled={genGroups.isPending}>
            {genGroups.isPending ? <Loader2 className="animate-spin" /> : <Shuffle size={16} />} Draw
            groups
          </Button>
          <Button
            variant="secondary"
            onClick={() => genKnockout.mutate()}
            disabled={genKnockout.isPending}
          >
            {genKnockout.isPending ? <Loader2 className="animate-spin" /> : <Trophy size={16} />}{" "}
            Generate knockout
          </Button>
          <Button
            variant="ghost"
            className="text-destructive hover:text-destructive"
            onClick={() => {
              if (confirm("Reset the tournament? Groups, fixtures and the bracket will be deleted."))
                reset.mutate();
            }}
            disabled={reset.isPending}
          >
            Reset
          </Button>
        </div>
      </div>

      {/* Group fixtures / results */}
      {groupMatches.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="mb-3 font-section text-lg font-bold">Group results</h2>
          <div className="divide-y divide-border">
            {groupMatches.map((m) => (
              <MatchRow key={m.id} match={m} token={token} teamName={teamName} />
            ))}
          </div>
        </div>
      )}

      {/* Knockout */}
      {knockoutMatches.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="mb-3 font-section text-lg font-bold">Knockout results</h2>
          <div className="mb-6 divide-y divide-border">
            {knockoutMatches.map((m) => (
              <MatchRow key={m.id} match={m} token={token} teamName={teamName} />
            ))}
          </div>
          {tournament.data?.bracket && (
            <BracketView bracket={tournament.data.bracket} teams={tournament.data.teams} />
          )}
        </div>
      )}
    </div>
  );
}

const CupAdmin = () => {
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem(TOKEN_KEY));
  const [input, setInput] = useState("");

  // Keep this page out of search engines.
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    const previousTitle = document.title;
    document.title = "Organiser access";
    return () => {
      meta.remove();
      document.title = previousTitle;
    };
  }, []);


  if (!isSupabaseConfigured) {
    return (
      <CupLayout>
        <ConfigNotice />
      </CupLayout>
    );
  }

  const signIn = () => {
    const t = input.trim();
    if (!t) return;
    sessionStorage.setItem(TOKEN_KEY, t);
    setToken(t);
  };

  const signOut = () => {
    sessionStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setInput("");
  };

  return (
    <CupLayout>
      <div className="container py-10 md:py-14">
        {token ? (
          <AdminConsole token={token} onSignOut={signOut} />
        ) : (
          <div className="mx-auto max-w-sm rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Lock size={18} className="text-primary" />
              <h1 className="font-section text-lg font-bold">Organiser access</h1>
            </div>
            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                signIn();
              }}
            >
              <div className="space-y-1">
                <Label htmlFor="admin-token">Admin passcode</Label>
                <Input
                  id="admin-token"
                  type="password"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter your passcode"
                  autoFocus
                />
              </div>
              <Button type="submit" className="w-full">
                Unlock
              </Button>
            </form>
            <p className="mt-3 text-xs text-muted-foreground">
              This page is private. Without the passcode, no team or payment details are shown.
            </p>
          </div>
        )}
      </div>
    </CupLayout>
  );
};

export default CupAdmin;
