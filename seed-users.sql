-- Run this in your Supabase SQL Editor to forcefully create users with confirmed emails!
-- (This uses pgcrypto to hash the passwords just like Supabase does)

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
  buyer_id uuid := uuid_generate_v4();
  seller_id uuid := uuid_generate_v4();
  admin_id uuid := uuid_generate_v4();
BEGIN
  -- 1) Create Buyer
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'buyer@gmail.com') THEN
    INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
    VALUES (
      buyer_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
      'buyer@gmail.com', crypt('123456', gen_salt('bf')), now(), 
      '{"provider":"email","providers":["email"]}', '{"name":"Buyer User","role":"buyer"}', now(), now()
    );
  END IF;

  -- 2) Create Seller
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'encorbweb@gmail.com') THEN
    INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
    VALUES (
      seller_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
      'encorbweb@gmail.com', crypt('123456', gen_salt('bf')), now(), 
      '{"provider":"email","providers":["email"]}', '{"name":"Encorb Seller","role":"seller","business_name":"Encorb Trading"}', now(), now()
    );
  END IF;

  -- 3) Create Admin
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@gmail.com') THEN
    INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
    VALUES (
      admin_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
      'admin@gmail.com', crypt('encorb@@123', gen_salt('bf')), now(), 
      '{"provider":"email","providers":["email"]}', '{"name":"Platform Admin","role":"admin"}', now(), now()
    );
  END IF;

  -- 4) Guarantee confirmation for already created users
  UPDATE auth.users SET email_confirmed_at = now() WHERE email IN ('buyer@gmail.com', 'encorbweb@gmail.com', 'admin@gmail.com') AND email_confirmed_at IS NULL;

  UPDATE public.profiles SET role = 'buyer' WHERE email = 'buyer@gmail.com';
  UPDATE public.profiles SET role = 'seller', business_name = 'Encorb Trading' WHERE email = 'encorbweb@gmail.com';
  UPDATE public.profiles SET role = 'admin' WHERE email = 'admin@gmail.com';

  -- Direct inserts into auth.users also need email identities for password login.
  INSERT INTO auth.identities (provider_id, user_id, identity_data, provider, created_at, updated_at)
  SELECT u.email, u.id, jsonb_build_object('sub', u.id::text, 'email', u.email), 'email', now(), now()
  FROM auth.users u
  WHERE u.email IN ('buyer@gmail.com', 'encorbweb@gmail.com', 'admin@gmail.com')
    AND NOT EXISTS (
      SELECT 1 FROM auth.identities i
      WHERE i.user_id = u.id AND i.provider = 'email'
    );
END $$;
