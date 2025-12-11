-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL, -- Who receives it
    actor_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL, -- Who caused it
    type TEXT NOT NULL CHECK (type IN ('follow', 'comment', 'like', 'review')),
    resource_id UUID, -- Optional link to recipe/comment
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policies

-- Users can read their own notifications
CREATE POLICY "Users can read own notifications"
ON notifications FOR SELECT
USING (auth.uid() = user_id);

-- Users can update (mark as read) their own notifications
CREATE POLICY "Users can update own notifications"
ON notifications FOR UPDATE
USING (auth.uid() = user_id);

-- Users can insert notifications (where they are the actor)
-- This allows User A to create a notification for User B saying "User A followed you"
CREATE POLICY "Users can create notifications"
ON notifications FOR INSERT
WITH CHECK (auth.uid() = actor_id);
