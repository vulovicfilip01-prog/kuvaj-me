-- Check if recipes exist and their visibility
SELECT count(*) as total_recipes FROM recipes;
SELECT count(*) as public_recipes FROM recipes WHERE is_public = true;
SELECT id, title, is_public, user_id FROM recipes ORDER BY created_at DESC LIMIT 5;
