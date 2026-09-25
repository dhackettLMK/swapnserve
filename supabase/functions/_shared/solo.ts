// Swap'n'Serve Cup — individual (solo) entries.
// An individual is only placed into a Free Agents squad once their €10 has
// been paid. Checkout carries their details in the session metadata; this
// fulfilment runs from both the webhook and confirm-payment, idempotently.
import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
import { generateToken } from "./tokens.ts";
import { recomputeTeamStatus } from "./recompute.ts";

interface SoloSession {
  id: string;
  amount_total?: number | null;
  metadata?: Record<string, string> | null;
}

export function isSoloSession(session: SoloSession): boolean {
  return session.metadata?.kind === "solo";
}

/** Returns the squad invite token the paid individual was placed in. */
export async function fulfilSoloSession(
  supabase: SupabaseClient,
  session: SoloSession,
): Promise<string | null> {
  const existing = await findExisting(supabase, session.id);
  if (existing) return existing;

  const meta = session.metadata ?? {};
  const details = {
    full_name: meta.full_name ?? "",
    email: meta.email ?? "",
    phone: meta.phone ?? "",
    signup_source: meta.signup_source || null,
    is_captain: false,
    is_solo: true,
    paid: true,
    amount_paid_cents: session.amount_total ?? 1000,
    stripe_session_id: session.id,
  };

  const placed = await placeInSquad(supabase, details);
  if (!placed) throw new Error("Could not place paid individual in a squad");

  const { error } = await supabase.from("payments").insert({
    team_id: placed.team_id,
    player_id: placed.player_id,
    stripe_session_id: session.id,
    amount_cents: session.amount_total ?? 1000,
    covers_player_ids: [placed.player_id],
    status: "paid",
  });
  if (error) {
    // Another fulfilment (webhook vs return page) won the race; undo ours.
    await supabase.from("players").delete().eq("id", placed.player_id);
    await recomputeTeamStatus(supabase, placed.team_id);
    return await findExisting(supabase, session.id);
  }

  await recomputeTeamStatus(supabase, placed.team_id);
  return placed.invite_token;
}

async function findExisting(supabase: SupabaseClient, sessionId: string) {
  const { data } = await supabase
    .from("payments")
    .select("team_id")
    .eq("stripe_session_id", sessionId)
    .maybeSingle();
  if (!data) return null;
  const { data: team } = await supabase
    .from("teams")
    .select("invite_token")
    .eq("id", data.team_id)
    .maybeSingle();
  return team?.invite_token ?? null;
}

async function placeInSquad(supabase: SupabaseClient, details: Record<string, unknown>) {
  const { data: poolTeams } = await supabase
    .from("teams")
    .select("id, name, invite_token")
    .eq("is_pool", true);
  const pool = poolTeams ?? [];

  const counts = new Map<string, number>();
  if (pool.length) {
    const { data: poolPlayers } = await supabase
      .from("players")
      .select("team_id")
      .in("team_id", pool.map((t) => t.id));
    for (const p of poolPlayers ?? []) counts.set(p.team_id, (counts.get(p.team_id) ?? 0) + 1);
  }

  const open = pool
    .filter((t) => (counts.get(t.id) ?? 0) < 7)
    .sort(() => Math.random() - 0.5);

  for (const team of open) {
    const { data, error } = await supabase
      .from("players")
      .insert({ team_id: team.id, ...details })
      .select("id")
      .single();
    if (!error) return { team_id: team.id, player_id: data.id as string, invite_token: team.invite_token as string };
    // Full squad or same email already in it: try the next one.
  }

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const { data: team, error } = await supabase
      .from("teams")
      .insert({
        name: `Free Agents ${pool.length + 1 + attempt}`,
        kit_colour: "Green",
        captain_name: "Swap'n'Serve organisers",
        captain_email: "swapnserve@gmail.com",
        captain_phone: "swapnserve@gmail.com",
        invite_token: generateToken(),
        manage_token: generateToken(),
        status: "draft",
        is_pool: true,
      })
      .select("id, invite_token")
      .single();
    if (error) {
      if (error.code === "23505") continue;
      throw error;
    }
    const { data, error: playerError } = await supabase
      .from("players")
      .insert({ team_id: team.id, ...details })
      .select("id")
      .single();
    if (playerError) throw playerError;
    return { team_id: team.id, player_id: data.id as string, invite_token: team.invite_token as string };
  }
  return null;
}
