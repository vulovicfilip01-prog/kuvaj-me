-- Add Foreign Key from recipes.user_id to profiles.id
-- This allows Supabase to join recipes with profiles

ALTER TABLE recipes
DROP CONSTRAINT IF EXISTS recipes_user_id_fkey;

-- We need to ensure user_id references profiles(id) for the join to work automatically
-- Note: profiles.id is already a FK to auth.users, and recipes.user_id was likely FK to auth.users
-- Changing it to reference profiles(id) makes the relationship explicit for PostgREST

ALTER TABLE recipes
ADD CONSTRAINT recipes_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES profiles(id)
ON DELETE CASCADE;
