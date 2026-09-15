import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { kitHex } from "@/lib/cupTypes";
import type { TeamStatus } from "@/lib/cupTypes";

/** Small coloured dot showing a team's kit colour. */
export const KitDot = ({ colour, size = 12 }: { colour: string; size?: number }) => (
  <span
    aria-hidden
    className="inline-block rounded-full border border-border align-middle"
    style={{ width: size, height: size, backgroundColor: kitHex(colour) }}
  />
);

const STATUS_LABEL: Record<TeamStatus, string> = {
  draft: "Draft",
  collecting: "Collecting",
  registered: "Registered",
};

/** Colour-coded registration status pill. */
export const StatusBadge = ({ status }: { status: TeamStatus }) => {
  const cls =
    status === "registered"
      ? "bg-success text-success-foreground"
      : status === "collecting"
        ? "bg-accent text-accent-foreground"
        : "bg-muted text-muted-foreground";
  return <Badge className={`${cls} border-transparent`}>{STATUS_LABEL[status]}</Badge>;
};

/** Friendly notice shown when the Supabase env vars aren't set yet. */
export const ConfigNotice = () => (
  <div className="container py-16">
    <div className="mx-auto max-w-lg rounded-2xl border border-accent/40 bg-accent/10 p-6 text-center">
      <AlertTriangle className="mx-auto mb-3 text-accent" />
      <h2 className="text-lg font-section font-bold mb-2">Cup registration isn't live yet</h2>
      <p className="text-sm text-muted-foreground">
        The organiser still needs to connect the payment and database keys. Please check back soon.
        The team registration will open here shortly.
      </p>
    </div>
  </div>
);
