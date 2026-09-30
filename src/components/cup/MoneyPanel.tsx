import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { cupApi } from "@/lib/cupApi";
import { formatEuros } from "@/lib/teamStatus";

const date = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IE", { day: "numeric", month: "short" });

/** Organiser view of where the money is: fees, what we keep, payout state. */
export default function MoneyPanel({ token }: { token: string }) {
  const q = useQuery({ queryKey: ["cup-money"], queryFn: () => cupApi.admin.money(token) });

  if (q.isLoading) {
    return (
      <div className="flex items-center gap-2 rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading money breakdown
      </div>
    );
  }
  if (q.error || !q.data) {
    return (
      <div className="rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground">
        Could not load the money breakdown. {(q.error as Error)?.message}
      </div>
    );
  }

  const { transactions, pending, available, paid_out, in_transit } = q.data;
  const gross = transactions.reduce((s, t) => s + t.amount, 0);
  const fees = transactions.reduce((s, t) => s + t.fee, 0);
  const net = transactions.reduce((s, t) => s + t.net, 0);

  const tiles = [
    { label: "Taken in", value: gross },
    { label: "Fees", value: fees },
    { label: "You keep", value: net },
    { label: "In your bank", value: paid_out },
    { label: "On its way to bank", value: in_transit },
    { label: "Waiting (pending)", value: pending },
    { label: "Ready to pay out", value: available },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h2 className="mb-1 font-section text-lg font-bold">Money breakdown</h2>
      <p className="mb-4 text-sm text-muted-foreground">
        Every payment with its fee, what you keep and whether it has reached your bank yet.
      </p>
      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {tiles.map((t) => (
          <div key={t.label} className="rounded-xl bg-muted/50 p-3">
            <div className="text-xs text-muted-foreground">{t.label}</div>
            <div className="font-section text-lg font-bold">{formatEuros(t.value)}</div>
          </div>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-muted-foreground">
            <tr>
              <th className="py-2 pr-3">Date</th>
              <th className="py-2 pr-3">Payment</th>
              <th className="py-2 pr-3 text-right">Paid</th>
              <th className="py-2 pr-3 text-right">Fee</th>
              <th className="py-2 pr-3 text-right">You keep</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id} className="border-t border-border">
                <td className="py-2 pr-3 whitespace-nowrap">{date(t.created)}</td>
                <td className="py-2 pr-3 min-w-[12rem]">{t.description ?? "Payment"}</td>
                <td className="py-2 pr-3 text-right">{formatEuros(t.amount)}</td>
                <td className="py-2 pr-3 text-right text-muted-foreground">{formatEuros(t.fee)}</td>
                <td className="py-2 pr-3 text-right font-semibold">{formatEuros(t.net)}</td>
                <td className="py-2 whitespace-nowrap text-xs">
                  {t.status === "available" ? "Cleared" : `Pending until ${date(t.available_on)}`}
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr><td colSpan={6} className="py-3 text-muted-foreground">No payments yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
