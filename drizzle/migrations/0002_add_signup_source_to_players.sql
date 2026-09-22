ALTER TABLE public.players ADD COLUMN IF NOT EXISTS signup_source text;
CREATE INDEX IF NOT EXISTS players_signup_source_idx ON public.players (signup_source);