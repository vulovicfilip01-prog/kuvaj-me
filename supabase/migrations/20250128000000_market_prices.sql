-- Create market_prices table for recipe cost estimation
CREATE TABLE market_prices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL, -- e.g., 'mleveno_meso'
  display_name TEXT NOT NULL, -- e.g., 'Mleveno meso'
  price_per_unit NUMERIC NOT NULL,
  unit TEXT NOT NULL CHECK (unit IN ('kg', 'L', 'kom', 'g', 'ml', 'pakovanje')),
  keywords TEXT[] NOT NULL,
  default_quantity NUMERIC DEFAULT 0.1,
  source TEXT DEFAULT 'manual', -- 'manual' or 'cenoteka'
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE market_prices ENABLE ROW LEVEL SECURITY;

-- Everyone can view market prices (needed for recipe cost calculation)
CREATE POLICY "Market prices are viewable by everyone"
  ON market_prices FOR SELECT
  USING (true);

-- Only admins can insert/update market prices
-- Note: Assuming admin status is handled via a separate mechanism or a specific role/flag in profiles
-- For now, we allow update if the user is authenticated and has a hypothetical is_admin flag
-- Or better, we define it clearly if we have an admin system. Let's use a simple policy for now.
CREATE POLICY "Admins can manage market prices"
  ON market_prices FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- Insert initial data from the static dictionary
INSERT INTO market_prices (name, display_name, price_per_unit, unit, keywords, default_quantity, source) VALUES
  ('mleveno_meso', 'Mleveno meso', 1100, 'kg', ARRAY['mleveno', 'meso'], 0.5, 'manual'),
  ('junetina', 'Junetina', 1300, 'kg', ARRAY['junetina', 'juneće', 'govedina'], 0.5, 'manual'),
  ('svinjetina', 'Svinjetina', 850, 'kg', ARRAY['svinjetina', 'svinjsko'], 0.5, 'manual'),
  ('piletina', 'Piletina', 700, 'kg', ARRAY['piletina', 'pileće', 'batak', 'karabatak', 'belo meso'], 0.6, 'manual'),
  ('ulje', 'Ulje', 170, 'L', ARRAY['ulje', 'suncokretovo'], 0.1, 'manual'),
  ('maslinovo_ulje', 'Maslinovo ulje', 1200, 'L', ARRAY['maslinovo'], 0.05, 'manual'),
  ('mleko', 'Mleko', 150, 'L', ARRAY['mleko'], 0.5, 'manual'),
  ('jaja', 'Jaja', 20, 'kom', ARRAY['jaja', 'jaje'], 3, 'manual'),
  ('brasno', 'Brašno', 80, 'kg', ARRAY['brašno', 'meko', 'oštro'], 0.5, 'manual'),
  ('secer', 'Šećer', 110, 'kg', ARRAY['šećer'], 0.1, 'manual'),
  ('testenina', 'Testenina / Pasta', 400, 'kg', ARRAY['testenina', 'makarone', 'špagete', 'kore', 'pasta'], 0.5, 'manual'),
  ('parmezan', 'Parmezan', 3500, 'kg', ARRAY['parmezan', 'grana padano'], 0.05, 'manual'),
  ('pesto', 'Pesto sos', 400, 'pakovanje', ARRAY['pesto'], 1, 'manual'),
  ('suseni_paradajz', 'Sušeni paradajz', 2500, 'kg', ARRAY['sušeni paradajz'], 0.1, 'manual');
