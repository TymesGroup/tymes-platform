-- Migration: Update favorites table to support courses and services
-- This migration adds item_type column and renames product_id to item_id

-- Step 1: Add item_type column
ALTER TABLE favorites ADD COLUMN IF NOT EXISTS item_type text DEFAULT 'product';

-- Step 2: Rename product_id to item_id (keeping the data)
ALTER TABLE favorites RENAME COLUMN product_id TO item_id;

-- Step 3: Drop the foreign key constraint to products table
ALTER TABLE favorites DROP CONSTRAINT IF EXISTS favorites_product_id_fkey;

-- Step 4: Update the unique constraint
ALTER TABLE favorites DROP CONSTRAINT IF EXISTS favorites_user_id_product_id_key;
ALTER TABLE favorites ADD CONSTRAINT favorites_user_item_unique UNIQUE(user_id, item_id, item_type);

-- Step 5: Add check constraint for item_type
ALTER TABLE favorites ADD CONSTRAINT favorites_item_type_check 
  CHECK (item_type IN ('product', 'course', 'service'));

-- Step 6: Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_favorites_user_item ON favorites(user_id, item_type);
CREATE INDEX IF NOT EXISTS idx_favorites_item_id ON favorites(item_id);

-- Step 7: Update RLS policies
DROP POLICY IF EXISTS "Users can view own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can insert own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can delete own favorites" ON favorites;

CREATE POLICY "Users can view own favorites" ON favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites" ON favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites" ON favorites
  FOR DELETE USING (auth.uid() = user_id);

-- Enable RLS
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
