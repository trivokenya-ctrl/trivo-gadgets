-- Products table
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

-- Subscribers table
CREATE TABLE IF NOT EXISTS subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT now()
);

-- Customers table (links to Supabase Auth)
CREATE TABLE IF NOT EXISTS customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Orders table (WhatsApp orders linked to customers)
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

-- Notification subscriptions table
CREATE TABLE IF NOT EXISTS notification_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  subscription JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_subscriptions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY IF NOT EXISTS "Allow public read access on products" ON products
  FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Allow authenticated full access on products" ON products
  FOR ALL TO authenticated USING (true);

CREATE POLICY IF NOT EXISTS "Allow public insert on subscribers" ON subscribers
  FOR INSERT WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Allow authenticated full access on subscribers" ON subscribers
  FOR ALL TO authenticated USING (true);

CREATE POLICY IF NOT EXISTS "Allow customers to manage their own profile" ON customers
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Allow customers to manage their own orders" ON orders
  FOR ALL TO authenticated
  USING (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()))
  WITH CHECK (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()));

CREATE POLICY IF NOT EXISTS "Allow customers to manage their own subscriptions" ON notification_subscriptions
  FOR ALL TO authenticated
  USING (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()))
  WITH CHECK (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()));

-- Seed data (skip if products already exist)
INSERT INTO products (name, description, price, stock, category, is_featured, image_url)
SELECT 'TWS ANC Earbuds', 'Premium Active Noise Cancelling true wireless earbuds with 24hr battery life.', 3200, 10, 'Audio', true, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600&auto=format&fit=crop'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'TWS ANC Earbuds');

INSERT INTO products (name, description, price, stock, category, is_featured, image_url)
SELECT '4K Mini Dashcam', 'Discreet and powerful 4K resolution dashcam for your daily commute.', 4800, 8, 'Car Accessories', false, 'https://images.unsplash.com/photo-1510511459019-5efa7ae97334?q=80&w=600&auto=format&fit=crop'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = '4K Mini Dashcam');

INSERT INTO products (name, description, price, stock, category, is_featured, image_url)
SELECT 'RGB Smart Bulb', 'Voice-controlled 16-million color RGB smart bulb. Works with Alexa & Google Home.', 1800, 15, 'Smart Home', false, 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=600&auto=format&fit=crop'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'RGB Smart Bulb');

INSERT INTO products (name, description, price, stock, category, is_featured, image_url)
SELECT 'Magnetic 3-in-1 Wireless Charger', 'Fast charge your phone, watch, and earbuds simultaneously.', 2900, 12, 'Cables', false, 'https://images.unsplash.com/photo-1586953208448-b95a792e8c56?q=80&w=600&auto=format&fit=crop'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Magnetic 3-in-1 Wireless Charger');

INSERT INTO products (name, description, price, stock, category, is_featured, image_url)
SELECT 'Portable Tyre Inflator', 'Compact, battery-powered tyre inflator with digital pressure gauge.', 3500, 6, 'Car Accessories', false, 'https://images.unsplash.com/photo-1621259182978-fbf93132e53d?q=80&w=600&auto=format&fit=crop'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Portable Tyre Inflator');
