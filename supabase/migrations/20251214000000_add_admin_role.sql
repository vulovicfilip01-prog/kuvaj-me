-- Add is_admin column to profiles if it doesn't exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;

-- Create a secure policy (optional, but good practice)
-- Allow admins to update any profile? Usually requires more complex RLS.
-- For now, we just rely on application logic + RLS service role bypass for admin actions.
