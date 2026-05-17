-- ============================================================
-- TRIVO KENYA - Complete Database Setup
-- Run this entire script in Supabase SQL Editor
-- ============================================================

-- 1. TABLES (using IF NOT EXISTS - safe to run multiple times)
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  stock INTEGER DEFAULT 0,
  category TEXT,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  items JSONB NOT NULL DEFAULT '[]',
  total INTEGER NOT NULL,
  status TEXT DEFAULT 'pending',
  whatsapp_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notification_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  subscription JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. ROW LEVEL SECURITY (safe to run multiple times)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_subscriptions ENABLE ROW LEVEL SECURITY;

-- 3. POLICIES (drop & recreate - cleanest approach)
DROP POLICY IF EXISTS "Allow public read access on products" ON products;
CREATE POLICY "Allow public read access on products" ON products
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated full access on products" ON products;
CREATE POLICY "Allow authenticated full access on products" ON products
  FOR ALL TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow public insert on subscribers" ON subscribers;
CREATE POLICY "Allow public insert on subscribers" ON subscribers
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated full access on subscribers" ON subscribers;
CREATE POLICY "Allow authenticated full access on subscribers" ON subscribers
  FOR ALL TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow customers to manage their own profile" ON customers;
CREATE POLICY "Allow customers to manage their own profile" ON customers
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow customers to manage their own orders" ON orders;
CREATE POLICY "Allow customers to manage their own orders" ON orders
  FOR ALL TO authenticated
  USING (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()))
  WITH CHECK (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Allow customers to manage their own subscriptions" ON notification_subscriptions;
CREATE POLICY "Allow customers to manage their own subscriptions" ON notification_subscriptions
  FOR ALL TO authenticated
  USING (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()))
  WITH CHECK (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()));

-- 4. SEED DATA (only if products table is empty)
INSERT INTO products (name, description, price, stock, category, is_featured, image_url)
SELECT 'TWS ANC Earbuds', 'Premium Active Noise Cancelling true wireless earbuds with 24hr battery life.', 3200, 10, 'Audio', true, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600&auto=format&fit=crop'
WHERE NOT EXISTS (SELECT 1 FROM products);

INSERT INTO products (name, description, price, stock, category, is_featured, image_url)
SELECT '4K Mini Dashcam', 'Discreet and powerful 4K resolution dashcam for your daily commute.', 4800, 8, 'Car Accessories', false, 'https://images.unsplash.com/photo-1510511459019-5efa7ae97334?q=80&w=600&auto=format&fit=crop'
WHERE (SELECT COUNT(*) FROM products) = 1;

INSERT INTO products (name, description, price, stock, category, is_featured, image_url)
SELECT 'RGB Smart Bulb', 'Voice-controlled 16-million color RGB smart bulb. Works with Alexa & Google Home.', 1800, 15, 'Smart Home', false, 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=600&auto=format&fit=crop'
WHERE (SELECT COUNT(*) FROM products) = 2;

INSERT INTO products (name, description, price, stock, category, is_featured, image_url)
SELECT 'Magnetic 3-in-1 Wireless Charger', 'Fast charge your phone, watch, and earbuds simultaneously.', 2900, 12, 'Cables', false, 'https://images.unsplash.com/photo-1586953208448-b95a792e8c56?q=80&w=600&auto=format&fit=crop'
WHERE (SELECT COUNT(*) FROM products) = 3;

INSERT INTO products (name, description, price, stock, category, is_featured, image_url)
SELECT 'Portable Tyre Inflator', 'Compact, battery-powered tyre inflator with digital pressure gauge.', 3500, 6, 'Car Accessories', false, 'https://images.unsplash.com/photo-1621259182978-fbf93132e53d?q=80&w=600&auto=format&fit=crop'
WHERE (SELECT COUNT(*) FROM products) = 4;
