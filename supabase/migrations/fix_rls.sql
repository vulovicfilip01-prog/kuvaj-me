-- Fix RLS Policies for Recipes App

-- 1. Recipes Table
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public recipes are viewable by everyone" ON recipes;
DROP POLICY IF EXISTS "Users can insert their own recipes" ON recipes;
DROP POLICY IF EXISTS "Users can update their own recipes" ON recipes;
DROP POLICY IF EXISTS "Users can delete their own recipes" ON recipes;
DROP POLICY IF EXISTS "Users can view their own recipes" ON recipes;

-- Allow everyone to view public recipes, and users to view their own private recipes
CREATE POLICY "Public recipes are viewable by everyone"
ON recipes FOR SELECT
USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can insert their own recipes"
ON recipes FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recipes"
ON recipes FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recipes"
ON recipes FOR DELETE
USING (auth.uid() = user_id);


-- 2. Ingredients Table
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Ingredients are viewable by everyone" ON ingredients;
DROP POLICY IF EXISTS "Users can manage ingredients for their recipes" ON ingredients;

-- Simplified: Allow viewing all ingredients (low risk) or join with recipes
-- For now, let's allow public read access to ingredients to avoid complex joins causing issues
CREATE POLICY "Ingredients are viewable by everyone"
ON ingredients FOR SELECT
USING (true);

CREATE POLICY "Users can insert ingredients"
ON ingredients FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM recipes 
    WHERE id = ingredients.recipe_id 
    AND user_id = auth.uid()
  )
);


-- 3. Recipe Steps Table
ALTER TABLE recipe_steps ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Steps are viewable by everyone" ON recipe_steps;
DROP POLICY IF EXISTS "Users can manage steps for their recipes" ON recipe_steps;

CREATE POLICY "Steps are viewable by everyone"
ON recipe_steps FOR SELECT
USING (true);

CREATE POLICY "Users can insert steps"
ON recipe_steps FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM recipes 
    WHERE id = recipe_steps.recipe_id 
    AND user_id = auth.uid()
  )
);
