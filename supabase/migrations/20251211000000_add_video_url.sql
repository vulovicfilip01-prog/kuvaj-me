-- Add video_url to recipes table
ALTER TABLE recipes
ADD COLUMN IF NOT EXISTS video_url text;

-- Add a comment to describe the column
COMMENT ON COLUMN recipes.video_url IS 'URL to a video of the recipe (YouTube, TikTok, etc.)';
