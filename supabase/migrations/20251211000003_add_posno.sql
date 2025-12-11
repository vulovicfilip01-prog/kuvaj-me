-- Add is_posno column to recipes table
ALTER TABLE recipes
ADD COLUMN IF NOT EXISTS is_posno BOOLEAN DEFAULT FALSE;

COMMENT ON COLUMN recipes.is_posno IS 'Indicates if the recipe is suitable for fasting (Posno)';

-- Auto-update existing recipes based on keywords
UPDATE recipes
SET is_posno = TRUE
WHERE 
    LOWER(title) LIKE '%posn%' OR
    LOWER(title) LIKE '%riba%' OR
    LOWER(title) LIKE '%šaran%' OR
    LOWER(title) LIKE '%som%' OR
    LOWER(title) LIKE '%pastrmk%' OR
    LOWER(title) LIKE '%oslić%' OR
    LOWER(title) LIKE '%lignj%' OR
    LOWER(title) LIKE '%pasulj%' OR
    LOWER(title) LIKE '%prebranac%' OR
    LOWER(title) LIKE '%krompir%' OR -- Nije uvek posno, ali često
    LOWER(description) LIKE '%posn%';

-- Specifically uncheck items that might have been caught but contain meat/dairy/eggs in ingredients (Heuristic safety check not possible easily in SQL without complex joins, so we assume title is strong indicator for now)
-- Manual correction: "Komplet lepinja" is definitely NOT posno (eggs, kajmak, pretop) even if it has no meat in title.
UPDATE recipes SET is_posno = FALSE WHERE title = 'Komplet lepinja';
UPDATE recipes SET is_posno = FALSE WHERE title = 'Bela čorba'; -- Ima pavlaku i jaja
UPDATE recipes SET is_posno = FALSE WHERE title = 'Vasina torta'; -- Jaja
UPDATE recipes SET is_posno = FALSE WHERE title LIKE '%sa sirom%'; -- Sir
