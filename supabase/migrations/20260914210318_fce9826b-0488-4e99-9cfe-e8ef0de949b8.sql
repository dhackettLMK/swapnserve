-- Swap'n'Serve Cup — core schema
-- Registration, roster, payments, and the generated tournament.
--
-- Amounts are always in cents (EUR). €10 = 1000, €70 = 7000.
-- gen_random_uuid() comes from pgcrypto, which is enabled by default on Supabase.

-- ---------------------------------------------------------------------------
-- teams
-- ---------------------------------------------------------------------------
create table if not exists public.teams (
  id               uuid primary key default gen_random_uuid(),
  name             text not null unique,
  kit_colour       text not null check (kit_colour in ('Blue','Red','Green','Black','White','Yellow')),
  captain_name     text not null,
  captain_email    text not null,
  captain_phone    text not null,
  status           text not null default 'draft' check (status in ('draft','collecting','registered')),
  -- Shareable link for teammates to join. Not secret, but unguessable.
  invite_token     text not null unique,
  -- Private captain link to manage the team. Treat as a secret.
  manage_token     text not null unique,
  amount_paid_cents integer not null default 0 check (amount_paid_cents >= 0 and amount_paid_cents <= 7000),
  created_at       timestamptz not null default now()
);

comment on column public.teams.invite_token is 'Unguessable token used in the shareable teammate join link.';
comment on column public.teams.manage_token is 'Secret token that authenticates the captain to manage the team.';

-- ---------------------------------------------------------------------------
-- players (max 7 per team, enforced by trigger below)
-- ---------------------------------------------------------------------------
create table if not exists public.players (
  id                uuid primary key default gen_random_uuid(),
  team_id           uuid not null references public.teams(id) on delete cascade,
  full_name         text not null,
  email             text not null,
  phone             text not null,
  is_captain        boolean not null default false,
  paid              boolean not null default false,
  amount_paid_cents integer not null default 0 check (amount_paid_cents >= 0),
  stripe_session_id text,
  created_at        timestamptz not null default now(),
  -- A given email can only be on a team once.
  unique (team_id, email)
);

create index if not exists players_team_id_idx on public.players(team_id);

-- ---------------------------------------------------------------------------
-- payments
-- ---------------------------------------------------------------------------
create table if not exists public.payments (
  id                uuid primary key default gen_random_uuid(),
  team_id           uuid not null references public.teams(id) on delete cascade,
  -- Null when the captain pays for several players at once (see covers_player_ids).
  player_id         uuid references public.players(id) on delete set null,
  stripe_session_id text unique,
  amount_cents      integer not null check (amount_cents > 0),
  covers_player_ids uuid[] not null default '{}',
  status            text not null default 'pending' check (status in ('pending','paid','failed','expired')),
  created_at        timestamptz not null default now()
);

create index if not exists payments_team_id_idx on public.payments(team_id);
create index if not exists payments_session_idx on public.payments(stripe_session_id);

-- ---------------------------------------------------------------------------
-- tournament / groups / group_teams / matches
-- ---------------------------------------------------------------------------
create table if not exists public.tournament (
  id                   uuid primary key default gen_random_uuid(),
  name                 text not null default 'Swap''n''Serve Cup',
  group_size           integer not null default 4 check (group_size >= 2),
  qualifiers_per_group integer not null default 2 check (qualifiers_per_group >= 1),
  seed                 integer not null default 1,
  status               text not null default 'draft' check (status in ('draft','group_stage','knockout','complete')),
  -- The generated knockout bracket (see src/lib/tournament.ts Bracket type).
  bracket              jsonb,
  created_at           timestamptz not null default now()
);

create table if not exists public.groups (
  id            uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references public.tournament(id) on delete cascade,
  name          text not null,
  unique (tournament_id, name)
);

create table if not exists public.group_teams (
  id       uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id) on delete cascade,
  team_id  uuid not null references public.teams(id) on delete cascade,
  unique (group_id, team_id)
);

create table if not exists public.matches (
  id               uuid primary key default gen_random_uuid(),
  tournament_id    uuid not null references public.tournament(id) on delete cascade,
  stage            text not null check (stage in ('group','knockout')),
  group_id         uuid references public.groups(id) on delete cascade,
  -- For knockout matches, the bracket slot id from the engine, e.g. 'R1-M1'.
  bracket_match_id text,
  round            integer,
  home_team_id     uuid references public.teams(id) on delete set null,
  away_team_id     uuid references public.teams(id) on delete set null,
  home_goals       integer check (home_goals is null or home_goals >= 0),
  away_goals       integer check (away_goals is null or away_goals >= 0),
  played           boolean not null default false,
  created_at       timestamptz not null default now()
);

create index if not exists matches_tournament_idx on public.matches(tournament_id);
create index if not exists matches_group_idx on public.matches(group_id);

-- ---------------------------------------------------------------------------
-- Enforce a maximum of 7 players per team.
-- ---------------------------------------------------------------------------
create or replace function public.enforce_roster_limit()
returns trigger
language plpgsql
as $$
begin
  if (select count(*) from public.players where team_id = new.team_id) >= 7 then
    raise exception 'Roster is full (max 7 players per team)';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_roster_limit on public.players;
create trigger trg_roster_limit
  before insert on public.players
  for each row execute function public.enforce_roster_limit();

GRANT ALL ON public.teams TO service_role;
GRANT ALL ON public.players TO service_role;
GRANT ALL ON public.payments TO service_role;
GRANT ALL ON public.tournament TO service_role;
GRANT ALL ON public.groups TO service_role;
GRANT ALL ON public.group_teams TO service_role;
GRANT ALL ON public.matches TO service_role;