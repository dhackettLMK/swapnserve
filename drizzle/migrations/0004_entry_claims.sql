CREATE TABLE public.entry_claims (session_id text PRIMARY KEY, created_at timestamptz NOT NULL DEFAULT now());
GRANT ALL ON public.entry_claims TO service_role;
ALTER TABLE public.entry_claims ENABLE ROW LEVEL SECURITY;