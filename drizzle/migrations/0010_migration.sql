CREATE TABLE public.cup_waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL CHECK (char_length(full_name) BETWEEN 2 AND 100),
  email text NOT NULL CHECK (char_length(email) BETWEEN 3 AND 200),
  phone text NOT NULL CHECK (char_length(phone) BETWEEN 5 AND 40),
  team_name text NOT NULL DEFAULT '' CHECK (char_length(team_name) <= 60),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.cup_waitlist TO service_role;
ALTER TABLE public.cup_waitlist ENABLE ROW LEVEL SECURITY;
CREATE UNIQUE INDEX cup_waitlist_email_key ON public.cup_waitlist (lower(email));