create table if not exists public.workshop_snapshots (
  id text primary key,
  state jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.workshop_snapshots enable row level security;

drop policy if exists "workshop_snapshots_select_anon" on public.workshop_snapshots;
drop policy if exists "workshop_snapshots_insert_anon" on public.workshop_snapshots;
drop policy if exists "workshop_snapshots_update_anon" on public.workshop_snapshots;

create policy "workshop_snapshots_select_anon"
  on public.workshop_snapshots
  for select
  to anon
  using (true);

create policy "workshop_snapshots_insert_anon"
  on public.workshop_snapshots
  for insert
  to anon
  with check (true);

create policy "workshop_snapshots_update_anon"
  on public.workshop_snapshots
  for update
  to anon
  using (true)
  with check (true);
