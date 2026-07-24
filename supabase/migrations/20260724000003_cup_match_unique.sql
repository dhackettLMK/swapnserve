-- Swap'n'Serve Cup — allow upserting knockout matches by their bracket slot id.
-- The admin function keeps the `matches` rows in sync with the engine's bracket
-- (src/lib/tournament.ts) by upserting on (tournament_id, bracket_match_id).
create unique index if not exists matches_bracket_slot_uidx
  on public.matches (tournament_id, bracket_match_id)
  where bracket_match_id is not null;
