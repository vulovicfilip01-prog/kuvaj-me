-- Add new categories if they don't exist
INSERT INTO categories (name) 
VALUES ('Tradicionalna jela'), ('Veganska jela')
ON CONFLICT (name) DO NOTHING;

-- Clear all recipes to ensure clean state for re-import
TRUNCATE TABLE recipes CASCADE;
