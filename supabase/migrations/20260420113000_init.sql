create extension if not exists "pgcrypto";

create table if not exists public.trailers (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null,
  name text not null,
  vin text unique,
  barcode text unique,
  identity_locked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint trailer_identity_present check (vin is not null or barcode is not null)
);

create table if not exists public.mileage_events (
  id uuid primary key default gen_random_uuid(),
  trailer_id uuid not null references public.trailers(id) on delete cascade,
  trip_id text not null,
  event_hash text not null,
  distance_miles numeric(12,3) not null check (distance_miles >= 0),
  accuracy_envelope_meters numeric(10,2),
  source_device_id text not null,
  recorded_at timestamptz not null,
  created_at timestamptz not null default now()
);

create unique index if not exists mileage_events_trip_hash_idx
  on public.mileage_events(trip_id, event_hash);

alter table public.trailers enable row level security;
alter table public.mileage_events enable row level security;

-- RLS Policies (recommendation from review - strict owner-based access)
create policy "Users can view own trailers" on public.trailers
  for select using (auth.uid() = owner_id);

create policy "Users can insert own trailers" on public.trailers
  for insert with check (auth.uid() = owner_id);

create policy "Users can update own trailers" on public.trailers
  for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

create policy "Users can view own mileage" on public.mileage_events
  for select using (exists (
    select 1 from public.trailers 
    where id = trailer_id and owner_id = auth.uid()
  ));

create policy "Users can insert own mileage" on public.mileage_events
  for insert with check (exists (
    select 1 from public.trailers 
    where id = trailer_id and owner_id = auth.uid()
  ));

-- Immutable functions and triggers (already strong)
create or replace function public.prevent_identity_mutation()
returns trigger as $$
begin
  if old.identity_locked_at is not null
     and (new.vin is distinct from old.vin or new.barcode is distinct from old.barcode) then
    raise exception 'Trailer identity is immutable once locked';
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists trailers_prevent_identity_mutation on public.trailers;
create trigger trailers_prevent_identity_mutation
before update on public.trailers
for each row execute procedure public.prevent_identity_mutation();

create or replace function public.prevent_mileage_update_delete()
returns trigger as $$
begin
  raise exception 'Mileage events are append-only';
end;
$$ language plpgsql;

drop trigger if exists mileage_events_no_update on public.mileage_events;
create trigger mileage_events_no_update
before update on public.mileage_events
for each row execute procedure public.prevent_mileage_update_delete();

drop trigger if exists mileage_events_no_delete on public.mileage_events;
create trigger mileage_events_no_delete
before delete on public.mileage_events
for each row execute procedure public.prevent_mileage_update_delete();

-- Enable realtime for alerts and status (recommendation)
alter publication supabase_realtime add table trailers, mileage_events;
