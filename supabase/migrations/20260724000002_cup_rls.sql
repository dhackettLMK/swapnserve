-- Swap'n'Serve Cup — row-level security
--
-- Security model: there are no user accounts. Captains are identified by an
-- unguessable `manage_token` and teammates by an `invite_token`. Enforcing
-- "captain sees only their own team" purely in SQL policies against the anon
-- role is brittle, so instead ALL access goes through Supabase Edge Functions
-- that use the service_role key (which bypasses RLS) and:
--   * validate the caller's token before returning or mutating anything, and
--   * project only public-safe columns on public endpoints (no emails/phones).
--
-- We therefore enable RLS on every table and add NO policies for the anon or
-- authenticated roles. With RLS enabled and no permissive policy, those roles
-- are denied by default — belt-and-braces so a leaked anon key cannot read
-- captains' contact details or write to the tournament directly.

alter table public.teams        enable row level security;
alter table public.players      enable row level security;
alter table public.payments     enable row level security;
alter table public.tournament   enable row level security;
alter table public.groups       enable row level security;
alter table public.group_teams  enable row level security;
alter table public.matches      enable row level security;

-- Force RLS even for the table owner, so nothing accidentally bypasses it in
-- the SQL editor session. (service_role still bypasses RLS by design.)
alter table public.teams        force row level security;
alter table public.players      force row level security;
alter table public.payments     force row level security;
alter table public.tournament   force row level security;
alter table public.groups       force row level security;
alter table public.group_teams  force row level security;
alter table public.matches      force row level security;

-- No policies are defined on purpose: anon/authenticated are denied all access.
-- All reads and writes flow through the edge functions in supabase/functions/.
