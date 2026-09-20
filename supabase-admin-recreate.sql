-- One-time reset for the broken test admin account.
-- This removes ONLY admin@gmail.com. Run as the project owner.
-- After running this script, create the account again from the app's Register page.

begin;

delete from auth.users
where email = 'admin@gmail.com';

commit;

-- Next:
-- 1. Open /register in the app.
-- 2. Register admin@gmail.com with password: encorb@@123.
-- 3. Confirm the email if Supabase asks you to.
-- 4. Run the promotion query below.

-- After signup succeeds, run this separately:
-- update public.profiles
-- set role = 'admin', active = true
-- where email = 'admin@gmail.com';
--
-- select id, email, role, active
-- from public.profiles
-- where email = 'admin@gmail.com';
