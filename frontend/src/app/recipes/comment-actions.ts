'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getRecipeComments(recipeId: string) {
    const supabase = await createClient()

    const { data: comments, error } = await supabase
        .from('recipe_comments')
        .select(`
            *,
            profiles (display_name, avatar_url)
        `)
        .eq('recipe_id', recipeId)
        .eq('is_deleted', false)
        .order('created_at', { ascending: true })

    if (error) {
        console.error('Error fetching comments:', error)
        return { comments: [] }
    }

    return { comments: comments || [] }
}

export async function createComment(recipeId: string, content: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'Morate biti prijavljeni da biste komentarisali' }
    }

    if (!content.trim()) {
        return { error: 'Komentar ne može biti prazan' }
    }

    if (content.length > 1000) {
        return { error: 'Komentar ne može biti duži od 1000 karaktera' }
    }

    const { data: comment, error } = await supabase
        .from('recipe_comments')
        .insert({
            recipe_id: recipeId,
            user_id: user.id,
            content: content.trim()
        })
        .select(`
            *,
            profiles (display_name, avatar_url)
        `)
        .single()

    if (error) {
        console.error('Error creating comment:', error)
        return { error: 'Greška pri kreiranju komentara' }
    }

    revalidatePath(`/recipes/${recipeId}`)
    return { success: true, comment }
}

export async function updateComment(commentId: string, content: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'Morate biti prijavljeni' }
    }

    if (!content.trim()) {
        return { error: 'Komentar ne može biti prazan' }
    }

    if (content.length > 1000) {
        return { error: 'Komentar ne može biti duži od 1000 karaktera' }
    }

    // Verify ownership
    const { data: existingComment } = await supabase
        .from('recipe_comments')
        .select('user_id, recipe_id')
        .eq('id', commentId)
        .single()

    if (!existingComment || existingComment.user_id !== user.id) {
        return { error: 'Nemate dozvolu da izmenite ovaj komentar' }
    }

    const { error } = await supabase
        .from('recipe_comments')
        .update({ content: content.trim() })
        .eq('id', commentId)
        .eq('user_id', user.id)

    if (error) {
        console.error('Error updating comment:', error)
        return { error: 'Greška pri ažuriranju komentara' }
    }

    revalidatePath(`/recipes/${existingComment.recipe_id}`)
    return { success: true }
}

export async function deleteComment(commentId: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'Morate biti prijavljeni' }
    }

    // Verify ownership
    const { data: existingComment } = await supabase
        .from('recipe_comments')
        .select('user_id, recipe_id')
        .eq('id', commentId)
        .single()

    if (!existingComment || existingComment.user_id !== user.id) {
        return { error: 'Nemate dozvolu da obrišete ovaj komentar' }
    }

    // Soft delete
    const { error } = await supabase
        .from('recipe_comments')
        .update({ is_deleted: true })
        .eq('id', commentId)
        .eq('user_id', user.id)

    if (error) {
        console.error('Error deleting comment:', error)
        return { error: 'Greška pri brisanju komentara' }
    }

    revalidatePath(`/recipes/${existingComment.recipe_id}`)
    return { success: true }
}

export async function getCommentsCount(recipeId: string) {
    const supabase = await createClient()

    const { count, error } = await supabase
        .from('recipe_comments')
        .select('*', { count: 'exact', head: true })
        .eq('recipe_id', recipeId)
        .eq('is_deleted', false)

    if (error) {
        console.error('Error counting comments:', error)
        return { count: 0 }
    }

    return { count: count || 0 }
}
