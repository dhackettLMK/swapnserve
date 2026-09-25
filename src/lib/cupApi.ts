// Swap'n'Serve Cup typed wrappers around the backend functions.
import { FunctionsHttpError } from "@supabase/supabase-js";
import { getSupabase } from "./supabase";
import { getStripeEnvironment } from "./stripe";
import type {
  AdminListResponse,
  CreateTeamResponse,
  ManageTeamResponse,
  PublicTeamResponse,
  SoloJoinResponse,
  TournamentPublicResponse,
} from "./cupTypes";

/** Inputs for starting an embedded card checkout for a Cup entry. */
export interface CheckoutInput {
  mode: "full" | "player" | "shares" | "solo";
  /** Individual entry details (solo mode). */
  full_name?: string;
  email?: string;
  phone?: string;
  signup_source?: string;
  /** How many players to pay for at once (shares mode), 1-7. */
  shares?: number;
  manage_token?: string;
  invite_token?: string;
  player_id?: string;
  /** Where Stripe brings the player back to after payment. */
  returnUrl: string;
}

/** Invokes an edge function and surfaces our friendly `{ error }` messages. */
async function invoke<T>(
  fn: string,
  body: unknown,
  headers?: Record<string, string>,
): Promise<T> {
  const { data, error } = await getSupabase().functions.invoke(fn, { body, headers });
  if (error) {
    if (error instanceof FunctionsHttpError) {
      const payload = await error.context.json().catch(() => null);
      if (payload?.error) throw new Error(payload.error);
    }
    throw new Error(error.message || "Something went wrong. Please try again.");
  }
  if (data && typeof data === "object" && "error" in data && data.error) {
    throw new Error(String((data as { error: unknown }).error));
  }
  return data as T;
}

export const cupApi = {
  createTeam: (input: {
    name: string;
    kit_colour: string;
    captain_name: string;
    captain_email: string;
    captain_phone: string;
    signup_source?: string;
  }) => invoke<CreateTeamResponse>("team", { action: "create", ...input }),

  getTeam: (manage_token: string) =>
    invoke<ManageTeamResponse>("team", { action: "get", manage_token }),

  getPublicTeam: (invite_token: string) =>
    invoke<PublicTeamResponse>("team", { action: "public", invite_token }),

  joinTeam: (input: { invite_token: string; full_name: string; email: string; phone: string }) =>
    invoke<{ ok: true; player_id: string }>("team", { action: "join", ...input }),

  ask: (input: { manage_token: string; question: string }) =>
    invoke<{ answer: string }>("cup-assistant", input),

  joinSolo: (input: {
    full_name: string;
    email: string;
    phone: string;
    signup_source?: string;
  }) =>
    invoke<SoloJoinResponse>("team", { action: "solo", ...input }),

  checkout: (input: CheckoutInput) => {
    const { returnUrl, ...rest } = input;
    return invoke<{ clientSecret: string }>("create-checkout", {
      ...rest,
      return_url: returnUrl,
      environment: getStripeEnvironment(),
    });
  },

  confirmPayment: (sessionId: string) =>
    invoke<{ status: "paid" | "pending" | "unknown"; invite_token?: string | null }>("confirm-payment", {
      session_id: sessionId,
      environment: getStripeEnvironment(),
    }),

  tournament: () => invoke<TournamentPublicResponse>("tournament", {}),

  admin: {
    list: (token: string) =>
      invoke<AdminListResponse>("admin", { action: "list" }, { "x-admin-token": token }),
    generateGroups: (
      token: string,
      opts: { group_size: number; qualifiers_per_group: number },
    ) => invoke<{ ok: true }>("admin", { action: "generate-groups", ...opts }, { "x-admin-token": token }),
    generateKnockout: (token: string) =>
      invoke<{ ok: true }>("admin", { action: "generate-knockout" }, { "x-admin-token": token }),
    recordMatch: (
      token: string,
      input: { match_id: string; home_goals: number; away_goals: number },
    ) => invoke<{ ok: true }>("admin", { action: "record-match", ...input }, { "x-admin-token": token }),
    renameTeam: (token: string, input: { team_id: string; name: string }) =>
      invoke<{ ok: true }>("admin", { action: "rename-team", ...input }, { "x-admin-token": token }),
    deleteTeam: (token: string, team_id: string) =>
      invoke<{ ok: true }>("admin", { action: "delete-team", team_id }, { "x-admin-token": token }),
    reset: (token: string) =>
      invoke<{ ok: true }>("admin", { action: "reset" }, { "x-admin-token": token }),
  },
};
