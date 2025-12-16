-- Create meal_plans table
CREATE TABLE IF NOT EXISTS meal_plans (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    recipe_id uuid REFERENCES recipes(id) ON DELETE CASCADE NOT NULL,
    date date NOT NULL,
    meal_type text CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')) NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;

-- Policy: Users can see their own plans
CREATE POLICY "Users can view own meal plans" 
ON meal_plans FOR SELECT 
USING (auth.uid() = user_id);

-- Policy: Users can insert their own plans
CREATE POLICY "Users can create own meal plans" 
ON meal_plans FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own plans
CREATE POLICY "Users can delete own meal plans" 
ON meal_plans FOR DELETE 
USING (auth.uid() = user_id);
