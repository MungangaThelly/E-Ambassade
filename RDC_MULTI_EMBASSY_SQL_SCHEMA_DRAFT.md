# RDC Multi-Embassy SQL Schema Draft

## Purpose

This document provides a practical SQL draft for migrating the current E-Ambassade database toward a multi-embassy RDC platform.

It is designed for Supabase Postgres and assumes the current project already uses these core tables:

- `profiles`
- `bookings`
- `notifications`

The goal is to preserve the current foundation while introducing proper embassy separation, scoped roles, configurable services, and auditability.

## Design Goals

This draft is built around these rules:

- each embassy is a tenant
- tenant-owned records carry `embassy_id`
- platform roles and embassy roles are separated
- booking activity is auditable
- the schema remains practical for the current codebase

## Migration Strategy

Recommended migration order:

1. create new multi-embassy tables
2. add `embassy_id` to existing operational tables
3. seed the Stockholm embassy as the initial tenant
4. backfill existing bookings and notifications to Stockholm
5. move role management from `profiles.role` toward a dedicated role table
6. add RLS policies after application-side tenant logic is ready

## SQL Draft

```sql
-- =====================================================
-- EXTENSIONS
-- =====================================================

create extension if not exists pgcrypto;


-- =====================================================
-- TENANTS
-- =====================================================

create table if not exists public.embassies (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  official_name text not null,
  country text not null,
  city text not null,
  address text,
  phone text,
  email text,
  timezone text not null default 'Europe/Stockholm',
  primary_locale text not null default 'fr',
  supported_locales jsonb not null default '["fr","sv","en"]'::jsonb,
  logo_url text,
  domain text,
  subdomain text,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint embassies_status_check check (status in ('setup', 'active', 'inactive'))
);

create index if not exists embassies_status_idx
  on public.embassies (status);


-- =====================================================
-- ROLE ASSIGNMENTS
-- =====================================================

create table if not exists public.user_embassy_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  embassy_id uuid references public.embassies(id) on delete cascade,
  role text not null,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_embassy_roles_role_check check (role in ('super_admin', 'embassy_admin', 'embassy_staff', 'citizen_user')),
  constraint user_embassy_roles_status_check check (status in ('active', 'revoked'))
);

create unique index if not exists user_embassy_roles_unique_active_assignment_idx
  on public.user_embassy_roles (user_id, embassy_id, role);

create index if not exists user_embassy_roles_user_idx
  on public.user_embassy_roles (user_id);

create index if not exists user_embassy_roles_embassy_idx
  on public.user_embassy_roles (embassy_id);


-- =====================================================
-- EMBASSY SETTINGS
-- =====================================================

create table if not exists public.embassy_settings (
  embassy_id uuid primary key references public.embassies(id) on delete cascade,
  branding jsonb not null default '{}'::jsonb,
  booking_rules jsonb not null default '{}'::jsonb,
  email_settings jsonb not null default '{}'::jsonb,
  notification_settings jsonb not null default '{}'::jsonb,
  locale_settings jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);


-- =====================================================
-- SERVICES
-- =====================================================

create table if not exists public.embassy_services (
  id uuid primary key default gen_random_uuid(),
  embassy_id uuid not null references public.embassies(id) on delete cascade,
  code text not null,
  name text not null,
  description text,
  duration_minutes integer not null default 30,
  capacity_per_slot integer not null default 1,
  requires_documents boolean not null default false,
  required_documents jsonb not null default '[]'::jsonb,
  fee_reference text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint embassy_services_duration_check check (duration_minutes > 0),
  constraint embassy_services_capacity_check check (capacity_per_slot > 0)
);

create unique index if not exists embassy_services_embassy_code_idx
  on public.embassy_services (embassy_id, code);

create index if not exists embassy_services_embassy_active_idx
  on public.embassy_services (embassy_id, active);


-- =====================================================
-- SCHEDULES
-- =====================================================

create table if not exists public.embassy_schedules (
  id uuid primary key default gen_random_uuid(),
  embassy_id uuid not null references public.embassies(id) on delete cascade,
  weekday integer not null,
  start_time time not null,
  end_time time not null,
  slot_interval_minutes integer not null default 30,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint embassy_schedules_weekday_check check (weekday between 0 and 6),
  constraint embassy_schedules_time_check check (end_time > start_time),
  constraint embassy_schedules_slot_interval_check check (slot_interval_minutes > 0)
);

create index if not exists embassy_schedules_embassy_weekday_idx
  on public.embassy_schedules (embassy_id, weekday, active);


create table if not exists public.embassy_closures (
  id uuid primary key default gen_random_uuid(),
  embassy_id uuid not null references public.embassies(id) on delete cascade,
  start_date date not null,
  end_date date not null,
  reason text,
  created_at timestamptz not null default now(),
  constraint embassy_closures_date_check check (end_date >= start_date)
);

create index if not exists embassy_closures_embassy_dates_idx
  on public.embassy_closures (embassy_id, start_date, end_date);


-- =====================================================
-- EXTEND EXISTING TABLES
-- =====================================================

alter table public.profiles
  add column if not exists preferred_locale text,
  add column if not exists updated_at timestamptz default now();


alter table public.bookings
  add column if not exists embassy_id uuid references public.embassies(id) on delete restrict,
  add column if not exists service_id uuid references public.embassy_services(id) on delete set null,
  add column if not exists reference_number text,
  add column if not exists timezone text,
  add column if not exists status_reason text,
  add column if not exists created_by uuid references auth.users(id) on delete set null,
  add column if not exists updated_by uuid references auth.users(id) on delete set null,
  add column if not exists updated_at timestamptz default now();

create index if not exists bookings_embassy_idx
  on public.bookings (embassy_id);

create index if not exists bookings_embassy_status_idx
  on public.bookings (embassy_id, status);

create index if not exists bookings_embassy_date_idx
  on public.bookings (embassy_id, appointment_date);

create unique index if not exists bookings_reference_number_idx
  on public.bookings (reference_number)
  where reference_number is not null;


alter table public.notifications
  add column if not exists embassy_id uuid references public.embassies(id) on delete restrict,
  add column if not exists type text default 'system',
  add column if not exists updated_at timestamptz default now();

create index if not exists notifications_embassy_user_idx
  on public.notifications (embassy_id, user_id, created_at desc);


-- =====================================================
-- BOOKING HISTORY
-- =====================================================

create table if not exists public.booking_status_history (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  embassy_id uuid not null references public.embassies(id) on delete cascade,
  old_status text,
  new_status text not null,
  reason text,
  changed_by uuid references auth.users(id) on delete set null,
  changed_at timestamptz not null default now()
);

create index if not exists booking_status_history_booking_idx
  on public.booking_status_history (booking_id, changed_at desc);

create index if not exists booking_status_history_embassy_idx
  on public.booking_status_history (embassy_id, changed_at desc);


-- =====================================================
-- PUBLIC CONTENT
-- =====================================================

create table if not exists public.embassy_content_pages (
  id uuid primary key default gen_random_uuid(),
  embassy_id uuid not null references public.embassies(id) on delete cascade,
  slug text not null,
  locale text not null,
  title text not null,
  body jsonb not null default '{}'::jsonb,
  published boolean not null default false,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

create unique index if not exists embassy_content_pages_unique_idx
  on public.embassy_content_pages (embassy_id, slug, locale);


-- =====================================================
-- AUDIT LOGS
-- =====================================================

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  embassy_id uuid references public.embassies(id) on delete set null,
  actor_user_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists audit_logs_embassy_created_idx
  on public.audit_logs (embassy_id, created_at desc);

create index if not exists audit_logs_actor_created_idx
  on public.audit_logs (actor_user_id, created_at desc);


-- =====================================================
-- UPDATED_AT TRIGGER
-- =====================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;


drop trigger if exists embassies_set_updated_at on public.embassies;
create trigger embassies_set_updated_at
before update on public.embassies
for each row
execute function public.set_updated_at();

drop trigger if exists user_embassy_roles_set_updated_at on public.user_embassy_roles;
create trigger user_embassy_roles_set_updated_at
before update on public.user_embassy_roles
for each row
execute function public.set_updated_at();

drop trigger if exists embassy_services_set_updated_at on public.embassy_services;
create trigger embassy_services_set_updated_at
before update on public.embassy_services
for each row
execute function public.set_updated_at();

drop trigger if exists embassy_schedules_set_updated_at on public.embassy_schedules;
create trigger embassy_schedules_set_updated_at
before update on public.embassy_schedules
for each row
execute function public.set_updated_at();

drop trigger if exists bookings_set_updated_at on public.bookings;
create trigger bookings_set_updated_at
before update on public.bookings
for each row
execute function public.set_updated_at();

drop trigger if exists notifications_set_updated_at on public.notifications;
create trigger notifications_set_updated_at
before update on public.notifications
for each row
execute function public.set_updated_at();

drop trigger if exists embassy_content_pages_set_updated_at on public.embassy_content_pages;
create trigger embassy_content_pages_set_updated_at
before update on public.embassy_content_pages
for each row
execute function public.set_updated_at();


-- =====================================================
-- INITIAL TENANT SEED EXAMPLE
-- =====================================================

insert into public.embassies (
  code,
  official_name,
  country,
  city,
  timezone,
  primary_locale,
  supported_locales,
  status
)
values (
  'stockholm',
  'Embassy of the Democratic Republic of the Congo in Stockholm',
  'Sweden',
  'Stockholm',
  'Europe/Stockholm',
  'fr',
  '["fr", "sv", "en"]'::jsonb,
  'active'
)
on conflict (code) do nothing;
```

## Backfill Example

Once the first embassy exists, backfill legacy records to it.

```sql
with stockholm as (
  select id
  from public.embassies
  where code = 'stockholm'
)
update public.bookings
set embassy_id = stockholm.id,
    timezone = coalesce(timezone, 'Europe/Stockholm')
from stockholm
where public.bookings.embassy_id is null;


with stockholm as (
  select id
  from public.embassies
  where code = 'stockholm'
)
update public.notifications
set embassy_id = stockholm.id
from stockholm
where public.notifications.embassy_id is null;
```

## Role Migration Example

The current system appears to store a simple `role` in `profiles`. That should become an assignment in `user_embassy_roles`.

Example migration:

```sql
with stockholm as (
  select id
  from public.embassies
  where code = 'stockholm'
)
insert into public.user_embassy_roles (
  user_id,
  embassy_id,
  role,
  status
)
select
  p.user_id,
  stockholm.id,
  case
    when p.role = 'admin' then 'embassy_admin'
    else 'citizen_user'
  end,
  'active'
from public.profiles p
cross join stockholm
on conflict do nothing;
```

## RLS Direction

This repo currently uses the Supabase service role heavily on the server side, so RLS can be introduced progressively.

Recommended approach:

1. first refactor application queries to consistently include `embassy_id`
2. then add RLS for user-facing access
3. finally tighten admin access with role-aware policies

Example policy direction for citizen bookings:

```sql
alter table public.bookings enable row level security;

create policy bookings_select_own
on public.bookings
for select
to authenticated
using (user_id = auth.uid());

create policy bookings_insert_own
on public.bookings
for insert
to authenticated
with check (user_id = auth.uid());
```

For embassy staff and platform admins, policy design should depend on how role claims are exposed to Postgres. In many cases, a controlled server-side admin layer remains simpler at first.

## Notes On Existing Columns

Practical recommendations for current fields:

- keep `bookings.service_type` temporarily during migration for backward compatibility
- later move fully toward `service_id`
- keep `profiles.role` temporarily if the app still reads it
- later deprecate `profiles.role` after all authorization logic is migrated
- review whether `passport_number` should remain plain text or move to stronger protection

## Suggested Next Implementation Step

After adopting this schema draft, the next engineering step should be:

1. create the SQL migration files
2. seed the first embassy
3. refactor booking queries to require `embassy_id`
4. move admin authorization to scoped role lookups
5. replace hardcoded branding and e-mail identity with embassy settings