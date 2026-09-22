ALTER TABLE public.players ADD COLUMN IF NOT EXISTS is_solo boolean NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS players_is_solo_idx ON public.players (is_solo) WHERE is_solo;