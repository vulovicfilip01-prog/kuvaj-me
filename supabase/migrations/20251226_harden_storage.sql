-- Harden Storage Policies for recipe-images
-- This ensures users can only manage their own files in the recipe-images bucket

-- 1. Remove old loose policy
DROP POLICY IF EXISTS "Authenticated users can upload recipe images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own recipe images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own recipe images" ON storage.objects;

-- 2. Create folder-based upload policy
-- Allows users to upload only to a folder named with their auth.uid()
CREATE POLICY "Users can upload recipe images to their own folder"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'recipe-images' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 3. Create folder-based update policy
CREATE POLICY "Users can update their own recipe images in their folder"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'recipe-images' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 4. Create folder-based delete policy
CREATE POLICY "Users can delete their own recipe images in their folder"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'recipe-images' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);
