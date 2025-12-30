-- Add enabled_modules column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS enabled_modules TEXT[] DEFAULT '{}';

-- Add comment to the column
COMMENT ON COLUMN profiles.enabled_modules IS 'Array of enabled module IDs: shop, class, work, social';

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_profiles_enabled_modules ON profiles USING GIN (enabled_modules);
