-- Create favorite_recipes table
CREATE TABLE IF NOT EXISTS favorite_recipes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, recipe_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_favorite_recipes_user_id ON favorite_recipes(user_id);
CREATE INDEX idx_favorite_recipes_recipe_id ON favorite_recipes(recipe_id);
CREATE INDEX idx_favorite_recipes_created_at ON favorite_recipes(created_at DESC);

-- Enable Row Level Security
ALTER TABLE favorite_recipes ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users can view only their own favorites
CREATE POLICY "Users can view their own favorites"
    ON favorite_recipes
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own favorites
CREATE POLICY "Users can add their own favorites"
    ON favorite_recipes
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can delete their own favorites
CREATE POLICY "Users can remove their own favorites"
    ON favorite_recipes
    FOR DELETE
    USING (auth.uid() = user_id);

-- Grant permissions
GRANT ALL ON favorite_recipes TO authenticated;
GRANT ALL ON favorite_recipes TO service_role;
