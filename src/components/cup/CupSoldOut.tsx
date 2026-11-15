import { CUP_SPECTATOR_INVITATION } from "@/content/cup";

export function CupSoldOut({ compact = false }: { compact?: boolean }) {
  return <span className={`inline-block rounded-none bg-destructive font-display font-bold uppercase text-destructive-foreground ${compact ? "px-2 py-1 text-xs" : "px-6 py-3 text-3xl sm:px-8 sm:py-4 sm:text-4xl"}`}>SOLD OUT</span>;
}

export function CupSpectatorInvitation() {
  return <div className="space-y-5"><CupSoldOut /><h2 className="font-display text-3xl font-bold leading-tight">Come down and watch!</h2><p className="max-w-xl text-base leading-relaxed">{CUP_SPECTATOR_INVITATION}</p></div>;
}