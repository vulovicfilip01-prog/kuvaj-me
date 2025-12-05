-- Add advanced profile fields
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS social_links jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS dietary_preferences text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS location text;

-- Add check constraint for dietary preferences (optional, but good for data integrity)
-- We won't enforce strict enum here to allow flexibility, but we could.
