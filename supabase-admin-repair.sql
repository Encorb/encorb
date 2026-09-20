-- Repair an admin account created through Supabase Auth when login fails.
-- Run in Supabase SQL Editor as the project owner.

begin;

create extension if not exists pgcrypto;

do $$
declare
  admin_user_id uuid;
  admin_email text := 'admin@gmail.com';
begin
  select id into admin_user_id
  from auth.users
  where email = admin_email;

  if admin_user_id is null then
    raise exception 'Create % through the app Register page first, then run this repair.', admin_email;
  end if;

  update auth.users
  set encrypted_password = crypt('encorb@@123', gen_salt('bf')),
      email_confirmed_at = coalesce(email_confirmed_at, now()),
      raw_app_meta_data = coalesce(raw_app_meta_data, '{"provider":"email","providers":["email"]}'::jsonb),
      raw_user_meta_data = jsonb_build_object('name', 'Platform Admin', 'role', 'admin'),
      updated_at = now()
  where id = admin_user_id;

  insert into auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
  values (
    admin_email,
    admin_user_id,
    jsonb_build_object('sub', admin_user_id::text, 'email', admin_email),
    'email',
    null,
    now(),
    now()
  )
  on conflict (provider_id, provider) do update set
    user_id = excluded.user_id,
    identity_data = excluded.identity_data,
    updated_at = now();

  insert into public.profiles (id, name, email, role, active)
  values (admin_user_id, 'Platform Admin', admin_email, 'admin', true)
  on conflict (id) do update set
    name = excluded.name,
    email = excluded.email,
    role = 'admin',
    active = true;
end $$;

commit;

select
  u.email,
  u.email_confirmed_at is not null as email_confirmed,
  exists (select 1 from auth.identities i where i.user_id = u.id and i.provider = 'email') as has_email_identity,
  p.role,
  p.active
from auth.users u
left join public.profiles p on p.id = u.id
where u.email = 'admin@gmail.com';
