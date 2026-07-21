-- Seed the current Stockholm embassy and attach legacy single-embassy data.

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
on conflict (code) do update
set
  official_name = excluded.official_name,
  country = excluded.country,
  city = excluded.city,
  timezone = excluded.timezone,
  primary_locale = excluded.primary_locale,
  supported_locales = excluded.supported_locales,
  status = excluded.status,
  updated_at = now();


insert into public.embassy_settings (
  embassy_id,
  branding,
  booking_rules,
  email_settings,
  notification_settings,
  locale_settings
)
select
  e.id,
  jsonb_build_object(
    'appName', 'E-Ambassade',
    'city', 'Stockholm'
  ),
  '{}'::jsonb,
  '{}'::jsonb,
  '{}'::jsonb,
  jsonb_build_object(
    'defaultLocale', 'fr',
    'supportedLocales', jsonb_build_array('fr', 'sv', 'en')
  )
from public.embassies e
where e.code = 'stockholm'
on conflict (embassy_id) do nothing;


with stockholm as (
  select id
  from public.embassies
  where code = 'stockholm'
)
update public.bookings b
set embassy_id = stockholm.id,
    timezone = coalesce(b.timezone, 'Europe/Stockholm')
from stockholm
where b.embassy_id is null;


with stockholm as (
  select id
  from public.embassies
  where code = 'stockholm'
)
update public.notifications n
set embassy_id = stockholm.id
from stockholm
where n.embassy_id is null;


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
where p.user_id is not null
on conflict (user_id, embassy_id, role) do nothing;


with stockholm as (
  select id
  from public.embassies
  where code = 'stockholm'
)
update public.bookings b
set created_by = coalesce(b.created_by, b.user_id),
    updated_by = coalesce(b.updated_by, b.user_id)
from stockholm
where b.embassy_id = stockholm.id;