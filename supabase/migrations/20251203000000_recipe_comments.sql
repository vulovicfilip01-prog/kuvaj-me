-- Create recipe_comments table
CREATE TABLE recipe_comments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    recipe_id uuid REFERENCES recipes(id) ON DELETE CASCADE NOT NULL,
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    content text NOT NULL,
    parent_id uuid REFERENCES recipe_comments(id) ON DELETE CASCADE,
    is_deleted boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX idx_recipe_comments_recipe_id ON recipe_comments(recipe_id);
CREATE INDEX idx_recipe_comments_user_id ON recipe_comments(user_id);
CREATE INDEX idx_recipe_comments_parent_id ON recipe_comments(parent_id);
CREATE INDEX idx_recipe_comments_created_at ON recipe_comments(created_at DESC);

-- Enable RLS
ALTER TABLE recipe_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for recipe_comments

-- Anyone can view non-deleted comments
CREATE POLICY "Anyone can view non-deleted comments"
ON recipe_comments FOR SELECT
USING (is_deleted = false);

-- Authenticated users can create comments
CREATE POLICY "Authenticated users can create comments"
ON recipe_comments FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Users can update their own comments
CREATE POLICY "Users can update their own comments"
ON recipe_comments FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Users can soft delete their own comments
CREATE POLICY "Users can delete their own comments"
ON recipe_comments FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid() AND is_deleted = true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_recipe_comments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER recipe_comments_updated_at
    BEFORE UPDATE ON recipe_comments
    FOR EACH ROW
    EXECUTE FUNCTION update_recipe_comments_updated_at();
