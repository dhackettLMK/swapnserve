// Swap'n'Serve Cup — registration and payment helper for captains.
// The captain asks a question from their private team page; we answer it with
// Lovable AI, grounded in that team's real deposit, balance and status.
import { json, preflight } from "../_shared/cors.ts";
import { supabaseAdmin } from "../_shared/supabaseAdmin.ts";
import { summariseTeam, formatEuros, TEAM_PRICE_CENTS, PRICE_PER_PLAYER_CENTS } from "../_shared/teamStatus.ts";

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/responses";
const MODEL = "openai/gpt-6-astra";

function clean(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return preflight();
  try {
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) return json({ error: "The assistant is not configured yet." }, 500);

    const body = await req.json().catch(() => ({}));
    const manageToken = clean(body.manage_token);
    const question = clean(body.question);

    if (manageToken.length < 8) return json({ error: "This management link is not valid." }, 400);
    if (question.length < 3) return json({ error: "Type your question first." }, 400);
    if (question.length > 500) return json({ error: "Please keep your question shorter." }, 400);

    const supabase = supabaseAdmin();
    const { data: team } = await supabase
      .from("teams")
      .select("*")
      .eq("manage_token", manageToken)
      .maybeSingle();
    if (!team) return json({ error: "This management link is not valid." }, 404);

    const [{ data: players }, { data: payments }] = await Promise.all([
      supabase.from("players").select("*").eq("team_id", team.id).order("created_at"),
      supabase.from("payments").select("*").eq("team_id", team.id).order("created_at"),
    ]);
    const roster = players ?? [];
    const summary = summariseTeam(team, roster, payments ?? []);
    const captain = roster.find((p) => p.is_captain);

    const context = [
      `Team name: ${team.name}`,
      `Captain: ${team.captain_name}`,
      `Players on the roster: ${summary.rosterCount} of 7 (${summary.rosterNeeded} still to invite)`,
      `Players who have paid: ${roster.filter((p) => p.paid).length}`,
      `Captain deposit of ${formatEuros(PRICE_PER_PLAYER_CENTS)}: ${captain?.paid ? "paid" : "not paid yet"}`,
      `Paid so far: ${formatEuros(summary.paidCents)} of ${formatEuros(TEAM_PRICE_CENTS)}`,
      `Balance left: ${formatEuros(summary.outstandingCents)}`,
      `Officially registered: ${summary.fullyPaid ? "yes" : "no, not until the full fee is paid"}`,
    ].join("\n");

    const instructions = [
      "You help captains of the Swap'n'Serve Cup, a community 5-a-side tournament in Limerick on 5 December at Summerville Rovers FC Astro.",
      "Facts: entry is €70 per team, made up of €10 per player for a squad of 7. The captain pays their own €10 as a deposit when they create the team. The rest can be paid in one go by the captain or €10 each by the players through the invite link. A team is only officially registered once the full €70 is paid. The prize for winning is €1,000. Every team is guaranteed at least two games.",
      "Answer only using the team details provided. If something is not covered, say so and tell them to email swapnserve@gmail.com.",
      "Write in British and Irish English, warm and plain. No emojis, no em dashes. Two to four short sentences.",
    ].join(" ");

    const res = await fetch(GATEWAY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
        "X-Lovable-AIG-SDK": "fetch",
      },
      body: JSON.stringify({
        model: MODEL,
        instructions,
        input: `This captain's team details:\n${context}\n\nTheir question: ${question}`,
        stream: true,
        reasoning: { effort: "low", summary: "auto" },
      }),
    });

    if (!res.ok || !res.body) {
      const detail = await res.text().catch(() => "");
      console.error("ai gateway error", res.status, detail);
      if (res.status === 429) {
        return json({ error: "The assistant is busy right now. Please try again shortly." }, 429);
      }
      if (res.status === 402) {
        return json({ error: "The assistant is out of credit. Please email swapnserve@gmail.com." }, 402);
      }
      return json({ error: "The assistant could not answer just now." }, 502);
    }

    // Responses API calls always stream; we collect the text server-side.
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let answer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.startsWith("data:")) continue;
        const payload = line.slice(5).trim();
        if (!payload || payload === "[DONE]") continue;
        try {
          const event = JSON.parse(payload);
          if (event.type === "response.output_text.delta" && typeof event.delta === "string") {
            answer += event.delta;
          }
        } catch {
          // Partial frame; the next chunk completes it.
        }
      }
    }

    if (!answer.trim()) {
      return json({
        error: "The assistant could not answer that one. Please email swapnserve@gmail.com.",
      }, 502);
    }

    return json({ answer: answer.trim() });
  } catch (err) {
    console.error("cup-assistant error", err);
    return json({ error: "Something went wrong. Please try again." }, 500);
  }
});
