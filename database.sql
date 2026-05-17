-- ==============================================================================
-- TRIVO KENYA - PRODUCTION-GRADE DATABASE SETUP
-- ==============================================================================
-- This script configures the relational database schema, auto-sync triggers,
-- Row Level Security (RLS) policies, and seed products for Trivo Kenya.
-- Run this entire script inside the Supabase SQL Editor.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. CLEANUP & INITIALIZATION (Safe for re-running)
-- ------------------------------------------------------------------------------
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- ------------------------------------------------------------------------------
-- 2. SCHEMA TABLES
-- ------------------------------------------------------------------------------

-- Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL, 
  description TEXT,
  price INTEGER NOT NULL, -- Price in KES (Kenyan Shillings)
  stock INTEGER DEFAULT 0,
  category TEXT NOT NULL,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Safely enforce uniqueness on products name for existing tables
DELETE FROM public.products a USING public.products b 
WHERE a.id < b.id AND a.name = b.name;

ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_name_key;
ALTER TABLE public.products ADD CONSTRAINT products_name_key UNIQUE (name);

-- Public Subscribers Table (Newsletter Signups)
CREATE TABLE IF NOT EXISTS public.subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT now()
);

-- Public Customers Table (User Profiles linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  items JSONB NOT NULL DEFAULT '[]', -- Cart items snapshot
  total INTEGER NOT NULL, -- Total amount in KES
  status TEXT DEFAULT 'pending', -- pending, processing, shipped, completed, cancelled
  whatsapp_message TEXT, -- Auto-generated checkout link text
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Web Push Notification Subscriptions Table
CREATE TABLE IF NOT EXISTS public.notification_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  subscription JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- 3. AUTOMATION TRIGGERS (Automates profile generation)
-- ------------------------------------------------------------------------------

-- Automatically create customer profile when a new user registers in Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.customers (user_id, email, full_name, phone)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', '')
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; -- Runs with high privileges to bypass client restrictions

-- Trigger to execute on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ------------------------------------------------------------------------------
-- 4. SECURITY & ROW LEVEL SECURITY (RLS)
-- ------------------------------------------------------------------------------
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_subscriptions ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 5. POLICIES
-- ------------------------------------------------------------------------------

-- Products Policies
DROP POLICY IF EXISTS "Allow public read access on products" ON public.products;
CREATE POLICY "Allow public read access on products" ON public.products
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated full access on products" ON public.products;
CREATE POLICY "Allow authenticated full access on products" ON public.products
  FOR ALL TO authenticated USING (true);

-- Subscribers Policies
DROP POLICY IF EXISTS "Allow public insert on subscribers" ON public.subscribers;
CREATE POLICY "Allow public insert on subscribers" ON public.subscribers
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated full access on subscribers" ON public.subscribers;
CREATE POLICY "Allow authenticated full access on subscribers" ON public.subscribers
  FOR ALL TO authenticated USING (true);

-- Customers Policies
DROP POLICY IF EXISTS "Allow customers to manage their own profile" ON public.customers;
CREATE POLICY "Allow customers to manage their own profile" ON public.customers
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Orders Policies
DROP POLICY IF EXISTS "Allow customers to manage their own orders" ON public.orders;
CREATE POLICY "Allow customers to manage their own orders" ON public.orders
  FOR ALL TO authenticated
  USING (customer_id IN (SELECT id FROM public.customers WHERE user_id = auth.uid()))
  WITH CHECK (customer_id IN (SELECT id FROM public.customers WHERE user_id = auth.uid()));

-- Notification Subscriptions Policies
DROP POLICY IF EXISTS "Allow customers to manage their own subscriptions" ON public.notification_subscriptions;
CREATE POLICY "Allow customers to manage their own subscriptions" ON public.notification_subscriptions
  FOR ALL TO authenticated
  USING (customer_id IN (SELECT id FROM public.customers WHERE user_id = auth.uid()))
  WITH CHECK (customer_id IN (SELECT id FROM public.customers WHERE user_id = auth.uid()));

-- ------------------------------------------------------------------------------
-- 6. SEED DATA (Clean, conflict-safe upserts)
-- ------------------------------------------------------------------------------
INSERT INTO public.products (name, description, price, stock, category, is_featured, image_url)
VALUES 
  (
    'TWS ANC Earbuds', 
    'Premium Active Noise Cancelling true wireless earbuds with 24hr battery life.', 
    3200, 10, 'Audio', true, 
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600&auto=format&fit=crop'
  ),
  (
    '4K Mini Dashcam', 
    'Discreet and powerful 4K resolution dashcam for your daily commute.', 
    4800, 8, 'Car Accessories', false, 
    'https://images.unsplash.com/photo-1510511459019-5efa7ae97334?q=80&w=600&auto=format&fit=crop'
  ),
  (
    'RGB Smart Bulb', 
    'Voice-controlled 16-million color RGB smart bulb. Works with Alexa & Google Home.', 
    1800, 15, 'Smart Home', false, 
    'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=600&auto=format&fit=crop'
  ),
  (
    'Magnetic 3-in-1 Wireless Charger', 
    'Fast charge your phone, watch, and earbuds simultaneously.', 
    2900, 12, 'Cables', false, 
    'https://images.unsplash.com/photo-1586953208448-b95a792e8c56?q=80&w=600&auto=format&fit=crop'
  ),
  (
    'Portable Tyre Inflator', 
    'Compact, battery-powered tyre inflator with digital pressure gauge.', 
    3500, 6, 'Car Accessories', false, 
    'https://images.unsplash.com/photo-1621259182978-fbf93132e53d?q=80&w=600&auto=format&fit=crop'
  )
ON CONFLICT (name) DO NOTHING;

