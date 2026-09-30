create table public.page_views (
  id uuid primary key default gen_random_uuid(),
  path text not null check (char_length(path) <= 200),
  visitor_id text not null check (char_length(visitor_id) <= 64),
  created_at timestamptz not null default now()
);
grant insert on public.page_views to anon, authenticated;
grant all on public.page_views to service_role;
alter table public.page_views enable row level security;
create policy "Anyone can record a page view" on public.page_views
  for insert to anon, authenticated with check (true);
create index idx_page_views_created on public.page_views(created_at);