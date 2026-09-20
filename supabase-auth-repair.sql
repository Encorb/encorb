-- Run this in Supabase SQL Editor when sign-up/login reports:
-- "Database error querying schema"
-- This repairs the Auth -> profiles trigger without disabling RLS.

begin;

-- Remove any broken version before recreating it.
drop trigger if exists on_auth_user_created on auth.users;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, email, role, business_name, active)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data->>'name', ''), split_part(coalesce(new.email, 'user'), '@', 1)),
    coalesce(new.email, ''),
    case
      when new.raw_user_meta_data->>'role' = 'seller' then 'seller'::public.user_role
      else 'buyer'::public.user_role
    end,
    nullif(new.raw_user_meta_data->>'business_name', ''),
    true
  )
  on conflict (id) do update set
    name = excluded.name,
    email = excluded.email,
    business_name = coalesce(excluded.business_name, public.profiles.business_name);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Repair users created before the trigger was installed.
insert into public.profiles (id, name, email, role, active)
select
  u.id,
  coalesce(nullif(u.raw_user_meta_data->>'name', ''), split_part(coalesce(u.email, 'user'), '@', 1)),
  coalesce(u.email, ''),
  case when u.raw_user_meta_data->>'role' = 'seller'
    then 'seller'::public.user_role
    else 'buyer'::public.user_role
  end,
  true
from auth.users u
where not exists (select 1 from public.profiles p where p.id = u.id);

-- Keep the admin account explicitly provisioned, never self-selected at sign-up.
update public.profiles
set role = 'admin'
where email = 'admin@gmail.com';

commit;

-- Confirm the repair. The orphaned count should be 0.
select count(*) as orphaned_auth_users
from auth.users u
where not exists (select 1 from public.profiles p where p.id = u.id);
