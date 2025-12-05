-- Create collections table
CREATE TABLE collections (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    name text NOT NULL,
    description text,
    is_public boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create collection_recipes junction table
CREATE TABLE collection_recipes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    collection_id uuid REFERENCES collections(id) ON DELETE CASCADE NOT NULL,
    recipe_id uuid REFERENCES recipes(id) ON DELETE CASCADE NOT NULL,
    added_at timestamp with time zone DEFAULT now(),
    UNIQUE(collection_id, recipe_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_collections_user_id ON collections(user_id);
CREATE INDEX idx_collections_is_public ON collections(is_public);
CREATE INDEX idx_collection_recipes_collection_id ON collection_recipes(collection_id);
CREATE INDEX idx_collection_recipes_recipe_id ON collection_recipes(recipe_id);

-- Enable RLS
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_recipes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for collections
-- Users can view their own collections
CREATE POLICY "Users can view their own collections"
ON collections FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Anyone can view public collections
CREATE POLICY "Anyone can view public collections"
ON collections FOR SELECT
USING (is_public = true);

-- Users can create their own collections
CREATE POLICY "Users can create collections"
ON collections FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Users can update their own collections
CREATE POLICY "Users can update their own collections"
ON collections FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Users can delete their own collections
CREATE POLICY "Users can delete their own collections"
ON collections FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- RLS Policies for collection_recipes
-- Users can view recipes in their own collections or public collections
CREATE POLICY "Users can view collection recipes"
ON collection_recipes FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM collections
        WHERE collections.id = collection_recipes.collection_id
        AND (collections.user_id = auth.uid() OR collections.is_public = true)
    )
);

-- Anyone can view recipes in public collections
CREATE POLICY "Anyone can view public collection recipes"
ON collection_recipes FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM collections
        WHERE collections.id = collection_recipes.collection_id
        AND collections.is_public = true
    )
);

-- Users can add recipes to their own collections
CREATE POLICY "Users can add recipes to their collections"
ON collection_recipes FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM collections
        WHERE collections.id = collection_recipes.collection_id
        AND collections.user_id = auth.uid()
    )
);

-- Users can remove recipes from their own collections
CREATE POLICY "Users can remove recipes from their collections"
ON collection_recipes FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM collections
        WHERE collections.id = collection_recipes.collection_id
        AND collections.user_id = auth.uid()
    )
);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_collections_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER collections_updated_at
    BEFORE UPDATE ON collections
    FOR EACH ROW
    EXECUTE FUNCTION update_collections_updated_at();
