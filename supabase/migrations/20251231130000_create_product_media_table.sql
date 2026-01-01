-- Create product_media table to store multiple images and videos for products
CREATE TABLE IF NOT EXISTS product_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('image', 'video')),
  position INTEGER NOT NULL DEFAULT 0,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  alt_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_product_media_product_id ON product_media(product_id);
CREATE INDEX IF NOT EXISTS idx_product_media_position ON product_media(product_id, position);

-- Enable RLS
ALTER TABLE product_media ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Anyone can view product media
CREATE POLICY "Public read access for product media"
  ON product_media FOR SELECT
  USING (true);

-- Product owner can insert media
CREATE POLICY "Product owner can insert media"
  ON product_media FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM products 
      WHERE products.id = product_media.product_id 
      AND products.created_by = auth.uid()
    )
  );

-- Product owner can update media
CREATE POLICY "Product owner can update media"
  ON product_media FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM products 
      WHERE products.id = product_media.product_id 
      AND products.created_by = auth.uid()
    )
  );

-- Product owner can delete media
CREATE POLICY "Product owner can delete media"
  ON product_media FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM products 
      WHERE products.id = product_media.product_id 
      AND products.created_by = auth.uid()
    )
  );

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_product_media_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_product_media_updated_at
  BEFORE UPDATE ON product_media
  FOR EACH ROW
  EXECUTE FUNCTION update_product_media_updated_at();

-- Ensure only one primary media per product
CREATE OR REPLACE FUNCTION ensure_single_primary_media()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_primary = true THEN
    UPDATE product_media 
    SET is_primary = false 
    WHERE product_id = NEW.product_id 
    AND id != NEW.id 
    AND is_primary = true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_ensure_single_primary_media
  BEFORE INSERT OR UPDATE ON product_media
  FOR EACH ROW
  EXECUTE FUNCTION ensure_single_primary_media();
