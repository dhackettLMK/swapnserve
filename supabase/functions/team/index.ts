// Swap'n'Serve Cup — team endpoint.
// One function, four actions, all brokered with the service role after token
// checks so the anon key never touches the tables directly:
//   create  — captain creates a team (returns invite + manage links)
//   join    — a teammate joins via the invite token
//   get     — captain dashboard via the (secret) manage token
//   public  — limited info for the join page via the invite token
import { json, preflight } from "../_shared/cors.ts";
import { supabaseAdmin } from "../_shared/supabaseAdmin.ts";
import { generateToken } from "../_shared/tokens.ts";
import { recomputeTeamStatus } from "../_shared/recompute.ts";
import { summariseTeam } from "../_shared/teamStatus.ts";

const KIT_COLOURS = ["Blue", "Red", "Green", "Black", "White", "Yellow"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

async function loadTeamContext(supabase: ReturnType<typeof supabaseAdmin>, teamId: string) {
  const [{ data: players }, { data: payments }] = await Promise.all([
    supabase.from("players").select("*").eq("team_id", teamId).order("created_at"),
    supabase.from("payments").select("*").eq("team_id", teamId).order("created_at"),
  ]);
  return { players: players ?? [], payments: payments ?? [] };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return preflight();
  try {
    const body = await req.json().catch(() => ({}));
    const action = clean(body.action);
    const supabase = supabaseAdmin();

    if (action === "create") {
      const name = clean(body.name);
      const kitColour = clean(body.kit_colour);
      const captainName = clean(body.captain_name);
      const captainEmail = clean(body.captain_email);
      const captainPhone = clean(body.captain_phone);

      if (name.length < 2) return json({ error: "Team name is too short." }, 400);
      if (!KIT_COLOURS.includes(kitColour)) return json({ error: "Pick a valid kit colour." }, 400);
      if (captainName.length < 2) return json({ error: "Enter the captain's name." }, 400);
      if (!EMAIL_RE.test(captainEmail)) return json({ error: "Enter a valid email." }, 400);
      if (captainPhone.length < 5) return json({ error: "Enter a valid phone number." }, 400);

      const invite_token = generateToken();
      const manage_token = generateToken();

      const { data: team, error } = await supabase
        .from("teams")
        .insert({
          name,
          kit_colour: kitColour,
          captain_name: captainName,
          captain_email: captainEmail,
          captain_phone: captainPhone,
          invite_token,
          manage_token,
          status: "draft",
        })
        .select()
        .single();

      if (error) {
        if (error.code === "23505") return json({ error: "That team name is already taken." }, 409);
        throw error;
      }

      // The captain is player #1.
      await supabase.from("players").insert({
        team_id: team.id,
        full_name: captainName,
        email: captainEmail,
        phone: captainPhone,
        is_captain: true,
      });

      return json({ team_id: team.id, invite_token, manage_token });
    }

    if (action === "public") {
      const inviteToken = clean(body.invite_token);
      const { data: team } = await supabase
        .from("teams")
        .select("id, name, kit_colour, status")
        .eq("invite_token", inviteToken)
        .maybeSingle();
      if (!team) return json({ error: "This invite link is not valid." }, 404);

      const { players, payments } = await loadTeamContext(supabase, team.id);
      const summary = summariseTeam(team, players, payments);
      return json({
        team: { name: team.name, kit_colour: team.kit_colour, status: team.status },
        rosterCount: summary.rosterCount,
        rosterNeeded: summary.rosterNeeded,
        rosterComplete: summary.rosterComplete,
        paidCents: summary.paidCents,
        outstandingCents: summary.outstandingCents,
        fullyPaid: summary.fullyPaid,
      });
    }

    if (action === "join") {
      const inviteToken = clean(body.invite_token);
      const fullName = clean(body.full_name);
      const email = clean(body.email);
      const phone = clean(body.phone);

      if (fullName.length < 2) return json({ error: "Enter your full name." }, 400);
      if (!EMAIL_RE.test(email)) return json({ error: "Enter a valid email." }, 400);
      if (phone.length < 5) return json({ error: "Enter a valid phone number." }, 400);

      const { data: team } = await supabase
        .from("teams")
        .select("id, status")
        .eq("invite_token", inviteToken)
        .maybeSingle();
      if (!team) return json({ error: "This invite link is not valid." }, 404);

      const { data: inserted, error } = await supabase
        .from("players")
        .insert({
          team_id: team.id,
          full_name: fullName,
          email,
          phone,
          is_captain: false,
        })
        .select("id")
        .single();
      if (error) {
        if (error.code === "23505") return json({ error: "You're already on this team." }, 409);
        // Roster-full trigger raises a plain exception.
        if (String(error.message).includes("Roster is full")) {
          return json({ error: "This team already has 7 players." }, 409);
        }
        throw error;
      }

      await recomputeTeamStatus(supabase, team.id);
      return json({ ok: true, player_id: inserted.id });
    }

    if (action === "get") {
      const manageToken = clean(body.manage_token);
      const { data: team } = await supabase
        .from("teams")
        .select("*")
        .eq("manage_token", manageToken)
        .maybeSingle();
      if (!team) return json({ error: "This management link is not valid." }, 404);

      const { players, payments } = await loadTeamContext(supabase, team.id);
      const summary = summariseTeam(team, players, payments);
      // Captain viewing their own team — contact details are fine to return.
      return json({
        team: {
          id: team.id,
          name: team.name,
          kit_colour: team.kit_colour,
          status: team.status,
          captain_name: team.captain_name,
          captain_email: team.captain_email,
          invite_token: team.invite_token,
        },
        players,
        payments,
        summary,
      });
    }

    return json({ error: "Unknown action." }, 400);
  } catch (err) {
    console.error("team function error", err);
    return json({ error: "Something went wrong. Please try again." }, 500);
  }
});
