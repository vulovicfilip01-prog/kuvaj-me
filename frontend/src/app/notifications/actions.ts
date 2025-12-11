'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export interface Notification {
    id: string;
    user_id: string;
    actor_id: string;
    type: 'follow' | 'comment' | 'like' | 'review';
    resource_id?: string;
    is_read: boolean;
    created_at: string;
    profiles?: {
        display_name: string;
        avatar_url: string;
    }
}

export async function getNotifications() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data } = await supabase
        .from('notifications')
        .select(`
            *,
            profiles:actor_id (
                display_name,
                avatar_url
            )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

    return (data as Notification[]) || [];
}

export async function getUnreadCount() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return 0;

    const { count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

    return count || 0;
}

export async function markAsRead(notificationId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Not authenticated' };

    const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .eq('user_id', user.id); // Security check

    if (error) {
        console.error('Error marking notification as read:', error);
        return { error: error.message };
    }

    revalidatePath('/', 'layout');
    return { success: true };
}

export async function createNotification(
    targetUserId: string,
    type: 'follow' | 'comment' | 'like' | 'review',
    resourceId?: string
) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Not authenticated' };
    if (user.id === targetUserId) return; // Don't notify self

    const { error } = await supabase
        .from('notifications')
        .insert({
            user_id: targetUserId,
            actor_id: user.id,
            type,
            resource_id: resourceId,
        });

    if (error) {
        console.error('Error creating notification:', error);
        return { error: error.message };
    }
}
