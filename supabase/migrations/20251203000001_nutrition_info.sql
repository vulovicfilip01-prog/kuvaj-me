-- Add nutrition columns to recipes table
ALTER TABLE recipes
ADD COLUMN IF NOT EXISTS calories integer,
ADD COLUMN IF NOT EXISTS protein decimal(5,1),
ADD COLUMN IF NOT EXISTS carbohydrates decimal(5,1),
ADD COLUMN IF NOT EXISTS fat decimal(5,1),
ADD COLUMN IF NOT EXISTS fiber decimal(5,1);

-- Add comments for documentation
COMMENT ON COLUMN recipes.calories IS 'Calories per serving';
COMMENT ON COLUMN recipes.protein IS 'Protein in grams per serving';
COMMENT ON COLUMN recipes.carbohydrates IS 'Carbohydrates in grams per serving';
COMMENT ON COLUMN recipes.fat IS 'Fat in grams per serving';
COMMENT ON COLUMN recipes.fiber IS 'Fiber in grams per serving';
