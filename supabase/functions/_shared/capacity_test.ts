import { assertEquals } from "jsr:@std/assert@1";
import { evaluateCapacity } from "./capacity.ts";

Deno.test("31 teams: one team can still register", () => {
  assertEquals(evaluateCapacity(31, []).teams_full, false);
});
Deno.test("32 teams: no new team can register", () => {
  assertEquals(evaluateCapacity(32, []).teams_full, true);
});
Deno.test("32 teams with a free-agent squad of 6: one free agent can still join", () => {
  assertEquals(evaluateCapacity(32, [6]).free_agents_full, false);
});
Deno.test("32 teams with a full free-agent squad: free agents are closed", () => {
  assertEquals(evaluateCapacity(32, [7]).free_agents_full, true);
});
