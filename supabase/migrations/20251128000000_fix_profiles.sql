-- Check columns in profiles table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles';

-- Add display_name if it doesn't exist (run this part if the column is missing)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS display_name text;

-- Update existing profiles to have a display_name (fallback to 'Chef')
UPDATE profiles 
SET display_name = 'Chef' 
WHERE display_name IS NULL;
