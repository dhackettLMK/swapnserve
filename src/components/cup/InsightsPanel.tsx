import { Download, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatEuros, TEAM_PRICE_CENTS } from "@/lib/teamStatus";
import type { AdminListResponse } from "@/lib/cupTypes";

const MAX_TEAMS = 32;
const PRIZE_CENTS = 100000;
const FEE_CENTS = 49; // per €10 payment
const card = "rounded-2xl border border-border bg-card p-5 shadow-sm";

function Bars({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className="flex h-28 items-end gap-1">
      {data.map((d) => (
        <div key={d.label} className="flex flex-1 flex-col items-center gap-1" title={`${d.label}: ${d.value}`}>
          <div className="text-[10px] text-muted-foreground">{d.value || ""}</div>
          <div className="w-full rounded-t-md bg-primary" style={{ height: `${(d.value / max) * 80}px` }} />
          <div className="text-[9px] text-muted-foreground">{d.label}</div>
        </div>
      ))}
    </div>
  );
}

const shortDay = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IE", { day: "numeric", month: "short" });

function lastDays(n: number) {
  return Array.from({ length: n }, (_, i) =>
    new Date(Date.now() - (n - 1 - i) * 86400000).toISOString().slice(0, 10),
  );
}

export default function InsightsPanel({ data }: { data: AdminListResponse }) {
  const { teams, visitors, paidPayments = [] } = data;
  const real = teams.filter((t) => !t.team.is_pool);
  const registered = teams.filter((t) => t.summary.status === "registered").length;
  const started = teams.length - registered;
  const left = Math.max(0, MAX_TEAMS - teams.length);

  // Sign-ups per day (last 14 days), from paid payments.
  const days = lastDays(14);
  const perDay = days.map((d) => ({
    label: shortDay(d).split(" ")[0],
    value: paidPayments.filter((p) => p.created_at.slice(0, 10) === d).length,
  }));

  // Busiest hour of the day for payments.
  const hours = Array(24).fill(0) as number[];
  paidPayments.forEach((p) => {
    hours[new Date(p.created_at).getHours()] += 1;
  });
  const busiest = hours.indexOf(Math.max(...hours));

  // Nearly there: unregistered teams, most paid first.
  const nearly = teams
    .filter((t) => t.summary.status !== "registered" && t.summary.paidCents > 0)
    .sort((a, b) => b.summary.paidCents - a.summary.paidCents);
  const lastPayment = (teamId: string) =>
    paidPayments.filter((p) => p.team_id === teamId).map((p) => p.created_at).sort().pop();

  // Money forecast.
  const takenCents = paidPayments.reduce((s, p) => s + p.amount_cents, 0);
  const ifStartedPay = teams.length * TEAM_PRICE_CENTS;
  const ifFull = MAX_TEAMS * TEAM_PRICE_CENTS;
  const net = (gross: number) => gross - (gross / 1000) * FEE_CENTS;

  // Conversion: paying people vs unique visitors.
  const payers = teams.reduce((s, t) => s + t.players.filter((p) => p.paid).length, 0);
  const conversion = visitors && visitors.uniqueVisitors > 0 ? (payers / visitors.uniqueVisitors) * 100 : null;
  const visitorDays = lastDays(14).map((d) => ({
    label: shortDay(d).split(" ")[0],
    value: visitors?.daily.find((x) => x.day === d)?.visitors ?? 0,
  }));

  const exportCsv = () => {
    const rows = [["Team", "Name", "Email", "Phone", "Captain", "Individual", "Paid", "Joined"]];
    teams.forEach((t) =>
      t.players.forEach((p) =>
        rows.push([
          t.team.name, p.full_name, p.email, p.phone,
          p.is_captain ? "Yes" : "", p.is_solo ? "Yes" : "", p.paid ? "Yes" : "No",
          new Date(p.created_at).toLocaleDateString("en-IE"),
        ]),
      ),
    );
    const csv = rows.map((r) => r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "swapnserve-cup-players.csv";
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Road to 32 */}
      <div className={card}>
        <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-section text-lg font-bold">Road to 32 teams</h2>
          <Button size="sm" variant="outline" onClick={exportCsv}>
            <Download className="mr-1 h-4 w-4" /> Download player list
          </Button>
        </div>
        <p className="mb-4 text-sm text-muted-foreground">
          {registered} registered, {started} part-paid, {left} places left.
        </p>
        <div className="relative mb-2 h-4 overflow-hidden rounded-full bg-muted">
          <div className="absolute inset-y-0 left-0 bg-accent/60" style={{ width: `${(teams.length / MAX_TEAMS) * 100}%` }} />
          <div className="absolute inset-y-0 left-0 bg-primary" style={{ width: `${(registered / MAX_TEAMS) * 100}%` }} />
        </div>
        <div className="mb-5 flex gap-4 text-xs text-muted-foreground">
          <span><span className="mr-1 inline-block h-2 w-2 rounded-full bg-primary" />Registered</span>
          <span><span className="mr-1 inline-block h-2 w-2 rounded-full bg-accent" />Part-paid</span>
          <span>{real.length} teams, {teams.length - real.length} free agent squads</span>
        </div>
        <div className="mb-2 text-sm font-semibold">Payments per day (last 14 days)</div>
        <Bars data={perDay} />
        {paidPayments.length > 0 && (
          <p className="mt-3 text-sm text-muted-foreground">
            Busiest time for sign-ups: {busiest}:00 to {busiest + 1}:00. A good time to post on social media.
          </p>
        )}
      </div>

      {/* Nearly there */}
      <div className={card}>
        <h2 className="mb-1 font-section text-lg font-bold">Nearly there</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Teams that have started paying but are not registered yet, closest first. Give them a nudge.
        </p>
        <div className="space-y-3">
          {nearly.map((t) => {
            const last = lastPayment(t.team.id);
            const quiet = last ? (Date.now() - new Date(last).getTime()) / 86400000 : 0;
            const subject = encodeURIComponent(`${t.team.name}: ${formatEuros(t.summary.outstandingCents)} left to register`);
            const bodyText = encodeURIComponent(
              `Hi ${t.team.captain_name},\n\n${t.team.name} has paid ${formatEuros(t.summary.paidCents)} of ${formatEuros(TEAM_PRICE_CENTS)}. Just ${formatEuros(t.summary.outstandingCents)} to go and you're officially in the Swap'N'Serve Cup.\n\nYour team link: ${window.location.origin}/cup?manage=${t.team.manage_token}\n\nSwap'N'Serve`,
            );
            return (
              <div key={t.team.id} className="rounded-xl bg-muted/40 p-3">
                <div className="mb-1 flex flex-wrap items-center justify-between gap-2 text-sm">
                  <span className="font-semibold">{t.team.name}</span>
                  <span>
                    {formatEuros(t.summary.paidCents)} / {formatEuros(TEAM_PRICE_CENTS)}
                    <span className="ml-2 text-muted-foreground">{t.summary.rosterCount}/7 players</span>
                  </span>
                </div>
                <Progress value={(t.summary.paidCents / TEAM_PRICE_CENTS) * 100} className="mb-2 h-2" />
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                  <span>{quiet >= 3 ? `No payment for ${Math.floor(quiet)} days` : "Recently active"}</span>
                  {!t.team.is_pool && (
                    <a className="inline-flex items-center gap-1 font-semibold text-primary" href={`mailto:${t.team.captain_email}?subject=${subject}&body=${bodyText}`}>
                      <Mail className="h-3 w-3" /> Nudge captain
                    </a>
                  )}
                </div>
              </div>
            );
          })}
          {nearly.length === 0 && <p className="text-sm text-muted-foreground">No part-paid teams right now.</p>}
        </div>
      </div>

      {/* Visitors */}
      <div className={card}>
        <h2 className="mb-1 font-section text-lg font-bold">Site visitors (last 30 days)</h2>
        <p className="mb-4 text-sm text-muted-foreground">Counted anonymously from today onwards.</p>
        <div className="mb-5 grid grid-cols-3 gap-3">
          {[
            ["Visitors", String(visitors?.uniqueVisitors ?? 0)],
            ["Page views", String(visitors?.pageViews ?? 0)],
            ["Visitors who paid", conversion === null ? "-" : `${conversion.toFixed(1)}%`],
          ].map(([l, v]) => (
            <div key={l} className="rounded-xl bg-muted/50 p-3">
              <div className="text-xs text-muted-foreground">{l}</div>
              <div className="font-section text-lg font-bold">{v}</div>
            </div>
          ))}
        </div>
        <div className="mb-2 text-sm font-semibold">Visitors per day</div>
        <Bars data={visitorDays} />
        {visitors && visitors.topPages.length > 0 && (
          <div className="mt-4 text-sm">
            <div className="mb-1 font-semibold">Most visited pages</div>
            {visitors.topPages.map((p) => (
              <div key={p.path} className="flex justify-between border-t border-border py-1">
                <span>{p.path === "/" ? "Homepage" : p.path}</span>
                <span className="text-muted-foreground">{p.count}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Forecast */}
      <div className={card}>
        <h2 className="mb-1 font-section text-lg font-bold">Money forecast</h2>
        <p className="mb-4 text-sm text-muted-foreground">After card fees, compared with the {formatEuros(PRIZE_CENTS)} prize.</p>
        <div className="space-y-2 text-sm">
          {[
            ["Taken so far", takenCents],
            [`If all ${teams.length} started teams pay in full`, ifStartedPay],
            ["If all 32 places fill", ifFull],
          ].map(([label, gross]) => {
            const n = net(gross as number);
            return (
              <div key={label as string} className="flex flex-wrap justify-between gap-2 border-t border-border py-2">
                <span>{label}</span>
                <span className="font-semibold">
                  {formatEuros(n)}
                  <span className="ml-2 font-normal text-muted-foreground">
                    {n >= PRIZE_CENTS ? `${formatEuros(n - PRIZE_CENTS)} after prize` : `${formatEuros(PRIZE_CENTS - n)} short of prize`}
                  </span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
