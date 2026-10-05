-- ==============================================================================
-- ENCORB CIRCULAR COMMODITIES PLATFORM — SUPABASE SQL SCHEMA
-- Run this script in your Supabase project's SQL Editor (Dashboard > SQL Editor)
-- ==============================================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. PROFILES TABLE (Linked with Supabase auth.users)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('buyer', 'seller', 'admin')),
  business_name TEXT,
  facility_type TEXT,
  ein TEXT,
  location TEXT,
  phone TEXT,
  bio TEXT,
  active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Index for role and email lookups
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- ==============================================================================
-- 3. LISTINGS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.listings (
  id TEXT PRIMARY KEY DEFAULT ('lst-' || gen_random_uuid()::text),
  seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  seller_name TEXT NOT NULL,
  seller_business TEXT,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  quantity NUMERIC NOT NULL,
  unit TEXT NOT NULL DEFAULT 'lb',
  price NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  location TEXT NOT NULL,
  region TEXT,
  state TEXT,
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'draft', 'sold')),
  is_auction BOOLEAN DEFAULT false,
  auction_end_time TIMESTAMPTZ,
  current_bid NUMERIC,
  bid_count INTEGER DEFAULT 0,
  min_bid_increment NUMERIC DEFAULT 50,
  bids JSONB DEFAULT '[]'::jsonb,
  specs JSONB DEFAULT '{}'::jsonb,
  verified_seller BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_listings_seller ON public.listings(seller_id);
CREATE INDEX IF NOT EXISTS idx_listings_category ON public.listings(category);
CREATE INDEX IF NOT EXISTS idx_listings_status ON public.listings(status);

-- ==============================================================================
-- 4. BUYER REQUESTS (RFQs & Bids)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.buyer_requests (
  id TEXT PRIMARY KEY DEFAULT ('req-' || gen_random_uuid()::text),
  listing_id TEXT REFERENCES public.listings(id) ON DELETE SET NULL,
  listing_title TEXT NOT NULL,
  buyer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  buyer_name TEXT NOT NULL,
  seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  seller_name TEXT NOT NULL,
  quantity NUMERIC NOT NULL,
  unit TEXT DEFAULT 'units',
  offered_price NUMERIC,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_requests_buyer ON public.buyer_requests(buyer_id);
CREATE INDEX IF NOT EXISTS idx_requests_seller ON public.buyer_requests(seller_id);

-- ==============================================================================
-- 5. TRANSACTIONS & ESCROW LOGISTICS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.transactions (
  id TEXT PRIMARY KEY DEFAULT ('tx-us-' || floor(1000 + random() * 9000)::text),
  request_id TEXT REFERENCES public.buyer_requests(id) ON DELETE SET NULL,
  listing_id TEXT REFERENCES public.listings(id) ON DELETE SET NULL,
  listing_title TEXT NOT NULL,
  buyer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  buyer_name TEXT NOT NULL,
  seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  seller_name TEXT NOT NULL,
  category TEXT NOT NULL,
  quantity NUMERIC NOT NULL,
  unit TEXT NOT NULL DEFAULT 'lb',
  price NUMERIC NOT NULL,
  total NUMERIC NOT NULL,
  currency TEXT DEFAULT 'USD',
  location TEXT,
  bol_number TEXT,
  carrier_name TEXT,
  tracking_step INTEGER DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'pickup_scheduled', 'in_transit', 'delivered', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tx_buyer ON public.transactions(buyer_id);
CREATE INDEX IF NOT EXISTS idx_tx_seller ON public.transactions(seller_id);

-- ==============================================================================
-- 6. NOTIFICATIONS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id TEXT PRIMARY KEY DEFAULT ('notif-' || gen_random_uuid()::text),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT DEFAULT 'platform',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_notif_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notif_read ON public.notifications(user_id, read);

-- ==============================================================================
-- 7. ORDER CHAT & LOGISTICS MESSAGING
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.order_messages (
  id TEXT PRIMARY KEY DEFAULT ('msg-' || gen_random_uuid()::text),
  order_id TEXT NOT NULL,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  sender_name TEXT NOT NULL,
  sender_role TEXT NOT NULL CHECK (sender_role IN ('buyer', 'seller', 'system')),
  text TEXT NOT NULL,
  attachment_name TEXT,
  attachment_type TEXT,
  attachment_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_chat_order ON public.order_messages(order_id);

-- ==============================================================================
-- 8. AUTOMATIC PROFILE CREATION TRIGGER ON AUTH SIGN UP
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    name,
    email,
    role,
    business_name,
    facility_type,
    ein,
    location,
    phone,
    active
  )
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    COALESCE(new.raw_user_meta_data->>'role', 'buyer'),
    COALESCE(new.raw_user_meta_data->>'business_name', new.raw_user_meta_data->>'businessName', NULL),
    COALESCE(new.raw_user_meta_data->>'facility_type', new.raw_user_meta_data->>'facilityType', NULL),
    new.raw_user_meta_data->>'ein',
    new.raw_user_meta_data->>'location',
    new.raw_user_meta_data->>'phone',
    true
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    business_name = COALESCE(EXCLUDED.business_name, public.profiles.business_name),
    facility_type = COALESCE(EXCLUDED.facility_type, public.profiles.facility_type),
    ein = COALESCE(EXCLUDED.ein, public.profiles.ein),
    location = COALESCE(EXCLUDED.location, public.profiles.location),
    phone = COALESCE(EXCLUDED.phone, public.profiles.phone);

  -- Send welcome notification
  INSERT INTO public.notifications (user_id, type, title, message)
  VALUES (
    new.id,
    'platform',
    'Welcome to Encorb Platform',
    'Your commercial account is ready. Explore live auctions, request quotes, or trade verified circular commodities.'
  );

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger execution on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==============================================================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buyer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_messages ENABLE ROW LEVEL SECURITY;

-- Profiles: Public read, self update
CREATE POLICY "Profiles are viewable by authenticated users" ON public.profiles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Listings: Anyone can view active listings, sellers manage their own
CREATE POLICY "Active listings are viewable by everyone" ON public.listings
  FOR SELECT USING (status = 'active' OR auth.uid() = seller_id);

CREATE POLICY "Sellers can create listings" ON public.listings
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Sellers can update their own listings" ON public.listings
  FOR UPDATE TO authenticated USING (auth.uid() = seller_id);

CREATE POLICY "Sellers can delete their own listings" ON public.listings
  FOR DELETE TO authenticated USING (auth.uid() = seller_id);

-- Buyer requests: Participants can read/update
CREATE POLICY "Requests visible to participants" ON public.buyer_requests
  FOR SELECT TO authenticated USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "Buyers can create requests" ON public.buyer_requests
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Participants can update requests" ON public.buyer_requests
  FOR UPDATE TO authenticated USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- Transactions: Participants can read/update
CREATE POLICY "Transactions visible to buyer and seller" ON public.transactions
  FOR SELECT TO authenticated USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "Transactions can be created by authenticated participants" ON public.transactions
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "Participants can update transactions" ON public.transactions
  FOR UPDATE TO authenticated USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- Notifications: Only recipient can view/update
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Allow system/users to insert notifications" ON public.notifications
  FOR INSERT TO authenticated WITH CHECK (true);

-- Order messages: Only order participants can read/send
CREATE POLICY "Order messages viewable by authenticated users" ON public.order_messages
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can post order messages" ON public.order_messages
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = sender_id);

-- ==============================================================================
-- 10. REALTIME CONFIGURATION
-- ==============================================================================
DO $$
BEGIN
  -- Add tables to realtime publication if not already added
  ALTER PUBLICATION supabase_realtime ADD TABLE public.buyer_requests;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.order_messages;
EXCEPTION
  WHEN duplicate_object THEN NULL;
  WHEN undefined_object THEN NULL;
END $$;
