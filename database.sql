-- Table: products
CREATE TABLE products (
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

-- Table: subscribers
CREATE TABLE subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT now()
);

-- Seed Data for products
INSERT INTO products (name, description, price, stock, category, is_featured, image_url) VALUES
('TWS ANC Earbuds', 'Premium Active Noise Cancelling true wireless earbuds with 24hr battery life.', 3200, 10, 'Audio', true, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600&auto=format&fit=crop'),
('4K Mini Dashcam', 'Discreet and powerful 4K resolution dashcam for your daily commute.', 4800, 8, 'Car Accessories', false, 'https://images.unsplash.com/photo-1510511459019-5efa7ae97334?q=80&w=600&auto=format&fit=crop'),
('RGB Smart Bulb', 'Voice-controlled 16-million color RGB smart bulb. Works with Alexa & Google Home.', 1800, 15, 'Smart Home', false, 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=600&auto=format&fit=crop'),
('Magnetic 3-in-1 Wireless Charger', 'Fast charge your phone, watch, and earbuds simultaneously.', 2900, 12, 'Cables', false, 'https://images.unsplash.com/photo-1586953208448-b95a792e8c56?q=80&w=600&auto=format&fit=crop'),
('Portable Tyre Inflator', 'Compact, battery-powered tyre inflator with digital pressure gauge.', 3500, 6, 'Car Accessories', false, 'https://images.unsplash.com/photo-1621259182978-fbf93132e53d?q=80&w=600&auto=format&fit=crop');

-- RLS setup (Example: public read access for products, but secure everything else)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on products" ON products
  FOR SELECT USING (true);

-- Admin policies (requires authenticated user)
CREATE POLICY "Allow authenticated full access on products" ON products
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow public insert on subscribers" ON subscribers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated full access on subscribers" ON subscribers
  FOR ALL TO authenticated USING (true);
