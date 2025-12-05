-- Create recipe_reviews table
CREATE TABLE IF NOT EXISTS recipe_reviews (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  recipe_id uuid REFERENCES recipes(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(recipe_id, user_id)
);

-- Add average_rating and review_count to recipes table
ALTER TABLE recipes 
ADD COLUMN IF NOT EXISTS average_rating numeric(3,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS review_count integer DEFAULT 0;

-- Enable RLS
ALTER TABLE recipe_reviews ENABLE ROW LEVEL SECURITY;

-- Policies for recipe_reviews
CREATE POLICY "Anyone can view reviews"
  ON recipe_reviews FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create reviews"
  ON recipe_reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
  ON recipe_reviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
  ON recipe_reviews FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to update recipe average rating
CREATE OR REPLACE FUNCTION update_recipe_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE recipes
  SET 
    average_rating = (
      SELECT ROUND(AVG(rating)::numeric, 2)
      FROM recipe_reviews
      WHERE recipe_id = COALESCE(NEW.recipe_id, OLD.recipe_id)
    ),
    review_count = (
      SELECT COUNT(*)
      FROM recipe_reviews
      WHERE recipe_id = COALESCE(NEW.recipe_id, OLD.recipe_id)
    )
  WHERE id = COALESCE(NEW.recipe_id, OLD.recipe_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update recipe rating
CREATE TRIGGER update_recipe_rating_trigger
AFTER INSERT OR UPDATE OR DELETE ON recipe_reviews
FOR EACH ROW
EXECUTE FUNCTION update_recipe_rating();
