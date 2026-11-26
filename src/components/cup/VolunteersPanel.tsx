import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { cupApi } from "@/lib/cupApi";

const when = (iso: string) =>
  new Date(iso).toLocaleString("en-IE", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

const Row = ({ label, value }: { label: string; value: string }) => (
  <p className="text-sm"><span className="text-muted-foreground">{label}: </span>{value || "Not given"}</p>
);

export default function VolunteersPanel({ token }: { token: string }) {
  const q = useQuery({ queryKey: ["admin-volunteers", token], queryFn: () => cupApi.admin.volunteers(token) });
  const apps = q.data?.applications ?? [];
  const props = q.data?.proposals ?? [];

  return (
    <div className="border-t border-border py-6">
      <h2 className="mb-1 font-section text-lg font-bold">Volunteers</h2>
      <p className="mb-4 text-sm text-muted-foreground">
        {apps.length} volunteer sign-up{apps.length === 1 ? "" : "s"} and {props.length} idea{props.length === 1 ? "" : "s"}, newest first. Contact details are private: please only use them to arrange volunteering.
      </p>
      {q.isLoading && <Loader2 className="animate-spin text-muted-foreground" size={18} />}
      {q.error && <p className="text-sm text-destructive">Could not load volunteers.</p>}
      <div className="grid gap-4 md:grid-cols-2">
        {apps.map((v) => (
          <div key={v.id} className="space-y-1 rounded-xl border border-border bg-card p-4">
            <div className="flex items-baseline justify-between gap-2">
              <p className="font-semibold">{v.full_name}</p>
              <span className="text-xs text-muted-foreground">{when(v.created_at)}</span>
            </div>
            {v.age_group !== "18+" && (
              <p className="text-xs font-semibold text-destructive">Under 18: contact a parent or guardian too</p>
            )}
            <p className="text-sm">
              <a className="text-primary underline" href={`mailto:${v.email}`}>{v.email}</a>
              {" · "}
              <a className="text-primary underline" href={`tel:${v.phone.replace(/\s/g, "")}`}>{v.phone}</a>
            </p>
            <Row label="Wants to help with" value={v.roles.join(", ")} />
            <Row label="Available" value={v.availability.join(", ")} />
            <Row label="Age group" value={v.age_group} />
            <Row label="Garda vetted" value={v.garda_vetting} />
            <Row label="Heard about us" value={v.referral} />
            <Row label="Skills" value={v.skills} />
          </div>
        ))}
      </div>
      {props.length > 0 && (
        <>
          <h3 className="mb-3 mt-6 font-section font-bold">Think we missed something?</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {props.map((p) => (
              <div key={p.id} className="space-y-1 rounded-xl border border-border bg-card p-4">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="font-semibold">{p.full_name}</p>
                  <span className="text-xs text-muted-foreground">{when(p.created_at)}</span>
                </div>
                <p className="text-sm">
                  <a className="text-primary underline" href={`mailto:${p.email}`}>{p.email}</a>
                  {" · "}
                  <a className="text-primary underline" href={`tel:${p.phone.replace(/\s/g, "")}`}>{p.phone}</a>
                </p>
                <Row label="Age group" value={p.age_group} />
                <Row label="Skills" value={p.skills} />
                <Row label="Idea" value={p.proposal} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
