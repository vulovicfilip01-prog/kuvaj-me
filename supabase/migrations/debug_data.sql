-- Check if profile exists for the recipe author
SELECT r.id as recipe_id, r.title, r.user_id, p.id as profile_id, p.display_name
FROM recipes r
LEFT JOIN profiles p ON r.user_id = p.id;

-- Check if category exists for the recipe
SELECT r.id as recipe_id, r.title, r.category_id, c.id as category_id_ref, c.name
FROM recipes r
LEFT JOIN categories c ON r.category_id = c.id;

-- Check all profiles
SELECT * FROM profiles;
