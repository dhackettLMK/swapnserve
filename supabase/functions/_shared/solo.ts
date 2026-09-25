// Swap'n'Serve Cup — pay-first entries.
// Nobody is saved (no team, no player) until their €10 has been paid.
// Checkout carries their details in the session metadata; fulfilment runs
// from both the webhook and confirm-payment, idempotently (the unique
// payments.stripe_session_id decides the winner of any race).
//   solo     — individual, placed in the lowest-numbered open Free Agents squad
//   new_team — captain; the team is created with the captain as player #1
//   join     — teammate joining via the invite link
import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
import { generateToken } from "./tokens.ts";
import { recomputeTeamStatus } from "./recompute.ts";

export const ENTRY_KINDS = ["solo", "new_team", "join"];

interface EntrySession {
  id: string;
  amount_total?: number | null;
  metadata?: Record<string, string> | null;
}

export interface EntryResult {
  invite_token: string | null;
  manage_token: string | null;
}

export function isEntrySession(session: EntrySession): boolean {
  return ENTRY_KINDS.includes(session.metadata?.kind ?? "");
}
/** Kept for older imports. */
export const isSoloSession = isEntrySession;

export async function fulfilEntrySession(
  supabase: SupabaseClient,
  session: EntrySession,
): Promise<EntryResult> {
  const existing = await findExisting(supabase, session.id);
  if (existing) return existing;

  const meta = session.metadata ?? {};
  const amount = session.amount_total ?? 1000;
  const details = {
    full_name: meta.full_name ?? "",
    email: meta.email ?? "",
    phone: meta.phone ?? "",
    signup_source: meta.signup_source || null,
    is_captain: meta.kind === "new_team",
    is_solo: meta.kind === "solo",
    paid: true,
    amount_paid_cents: amount,
    stripe_session_id: session.id,
  };

  let placed: { team_id: string; player_id: string } | null = null;
  if (meta.kind === "solo") placed = await placeInSquad(supabase, details);
  else if (meta.kind === "new_team") placed = await createTeam(supabase, meta.team_name ?? "", details);
  else if (meta.kind === "join") placed = await joinTeam(supabase, meta.invite_token ?? "", details);
  if (!placed) throw new Error(`Could not fulfil paid entry ${session.id}`);

  const { error } = await supabase.from("payments").insert({
    team_id: placed.team_id,
    player_id: placed.player_id,
    stripe_session_id: session.id,
    amount_cents: amount,
    covers_player_ids: [placed.player_id],
    status: "paid",
  });
  if (error) {
    // Another fulfilment won the race; undo ours.
    await supabase.from("players").delete().eq("id", placed.player_id);
    if (meta.kind === "new_team") await supabase.from("teams").delete().eq("id", placed.team_id);
    else await recomputeTeamStatus(supabase, placed.team_id);
    return (await findExisting(supabase, session.id)) ?? { invite_token: null, manage_token: null };
  }

  await recomputeTeamStatus(supabase, placed.team_id);
  return await tokensFor(supabase, placed.team_id, meta.kind === "new_team");
}

/** @deprecated use fulfilEntrySession */
export async function fulfilSoloSession(supabase: SupabaseClient, session: EntrySession) {
  return (await fulfilEntrySession(supabase, session)).invite_token;
}

async function tokensFor(supabase: SupabaseClient, teamId: string, withManage: boolean): Promise<EntryResult> {
  const { data: team } = await supabase
    .from("teams")
    .select("invite_token, manage_token")
    .eq("id", teamId)
    .maybeSingle();
  return {
    invite_token: team?.invite_token ?? null,
    manage_token: withManage ? team?.manage_token ?? null : null,
  };
}

async function findExisting(supabase: SupabaseClient, sessionId: string): Promise<EntryResult | null> {
  const { data } = await supabase
    .from("payments")
    .select("team_id, player_id")
    .eq("stripe_session_id", sessionId)
    .maybeSingle();
  if (!data) return null;
  let isCaptain = false;
  if (data.player_id) {
    const { data: p } = await supabase.from("players").select("is_captain").eq("id", data.player_id).maybeSingle();
    isCaptain = Boolean(p?.is_captain);
  }
  return tokensFor(supabase, data.team_id, isCaptain);
}

async function createTeam(supabase: SupabaseClient, teamName: string, details: Record<string, unknown>) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const name = attempt === 0 ? teamName : `${teamName} (${attempt + 1})`;
    const { data: team, error } = await supabase
      .from("teams")
      .insert({
        name,
        kit_colour: "Green",
        captain_name: details.full_name,
        captain_email: details.email,
        captain_phone: details.phone,
        invite_token: generateToken(),
        manage_token: generateToken(),
        status: "collecting",
      })
      .select("id")
      .single();
    if (error) {
      if (error.code === "23505") continue; // name taken since checkout started
      throw error;
    }
    const { data: player, error: pErr } = await supabase
      .from("players")
      .insert({ team_id: team.id, ...details })
      .select("id")
      .single();
    if (pErr) throw pErr;
    return { team_id: team.id as string, player_id: player.id as string };
  }
  return null;
}

async function joinTeam(supabase: SupabaseClient, inviteToken: string, details: Record<string, unknown>) {
  const { data: team } = await supabase.from("teams").select("id").eq("invite_token", inviteToken).maybeSingle();
  if (!team) return null;
  const { data, error } = await supabase
    .from("players")
    .insert({ team_id: team.id, ...details })
    .select("id")
    .single();
  if (error) {
    // Team filled up or duplicate email while they were paying: keep the money
    // visible to organisers by parking them in a Free Agents squad instead.
    console.error("join after payment failed, placing as free agent", error);
    return await placeInSquad(supabase, { ...details, is_solo: true });
  }
  return { team_id: team.id as string, player_id: data.id as string };
}

function squadNumber(name: string): number {
  const m = /(\d+)\s*$/.exec(name);
  return m ? Number(m[1]) : 0;
}

/** Fills Free Agents 1 up to 7, then 2, then 3, and so on. */
async function placeInSquad(supabase: SupabaseClient, details: Record<string, unknown>) {
  const { data: poolTeams } = await supabase.from("teams").select("id, name").eq("is_pool", true);
  const pool = (poolTeams ?? []).sort((a, b) => squadNumber(a.name) - squadNumber(b.name));

  const counts = new Map<string, number>();
  if (pool.length) {
    const { data: poolPlayers } = await supabase
      .from("players")
      .select("team_id")
      .in("team_id", pool.map((t) => t.id));
    for (const p of poolPlayers ?? []) counts.set(p.team_id, (counts.get(p.team_id) ?? 0) + 1);
  }

  for (const team of pool.filter((t) => (counts.get(t.id) ?? 0) < 7)) {
    const { data, error } = await supabase
      .from("players")
      .insert({ team_id: team.id, ...details })
      .select("id")
      .single();
    if (!error) return { team_id: team.id as string, player_id: data.id as string };
    // Full squad or same email already in it: try the next one.
  }

  const nextNumber = pool.reduce((max, t) => Math.max(max, squadNumber(t.name)), 0) + 1;
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const { data: team, error } = await supabase
      .from("teams")
      .insert({
        name: `Free Agents ${nextNumber + attempt}`,
        kit_colour: "Green",
        captain_name: "Swap'n'Serve organisers",
        captain_email: "swapnserve@gmail.com",
        captain_phone: "swapnserve@gmail.com",
        invite_token: generateToken(),
        manage_token: generateToken(),
        status: "collecting",
        is_pool: true,
      })
      .select("id")
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
    return { team_id: team.id as string, player_id: data.id as string };
  }
  return null;
}
