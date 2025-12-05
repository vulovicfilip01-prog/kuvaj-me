'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createCollection(data: {
    name: string
    description?: string
    isPublic: boolean
}) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'Morate biti prijavljeni' }
    }

    const { data: collection, error } = await supabase
        .from('collections')
        .insert({
            user_id: user.id,
            name: data.name,
            description: data.description || null,
            is_public: data.isPublic
        })
        .select()
        .single()

    if (error) {
        console.error('Error creating collection:', error)
        return { error: 'Greška pri kreiranju kolekcije' }
    }

    revalidatePath('/collections')
    return { success: true, collection }
}

export async function updateCollection(
    id: string,
    data: {
        name?: string
        description?: string
        isPublic?: boolean
    }
) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'Morate biti prijavljeni' }
    }

    const updateData: any = {}
    if (data.name !== undefined) updateData.name = data.name
    if (data.description !== undefined) updateData.description = data.description
    if (data.isPublic !== undefined) updateData.is_public = data.isPublic

    const { error } = await supabase
        .from('collections')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        console.error('Error updating collection:', error)
        return { error: 'Greška pri ažuriranju kolekcije' }
    }

    revalidatePath('/collections')
    revalidatePath(`/collections/${id}`)
    return { success: true }
}

export async function deleteCollection(id: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'Morate biti prijavljeni' }
    }

    const { error } = await supabase
        .from('collections')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        console.error('Error deleting collection:', error)
        return { error: 'Greška pri brisanju kolekcije' }
    }

    revalidatePath('/collections')
    return { success: true }
}

export async function addRecipeToCollection(collectionId: string, recipeId: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'Morate biti prijavljeni' }
    }

    // Verify user owns the collection
    const { data: collection } = await supabase
        .from('collections')
        .select('user_id')
        .eq('id', collectionId)
        .single()

    if (!collection || collection.user_id !== user.id) {
        return { error: 'Nemate pristup ovoj kolekciji' }
    }

    const { error } = await supabase
        .from('collection_recipes')
        .insert({
            collection_id: collectionId,
            recipe_id: recipeId
        })

    if (error) {
        if (error.code === '23505') { // Unique constraint violation
            return { error: 'Recept je već u kolekciji' }
        }
        console.error('Error adding recipe to collection:', error)
        return { error: 'Greška pri dodavanju recepta' }
    }

    revalidatePath(`/collections/${collectionId}`)
    return { success: true }
}

export async function removeRecipeFromCollection(collectionId: string, recipeId: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'Morate biti prijavljeni' }
    }

    const { error } = await supabase
        .from('collection_recipes')
        .delete()
        .eq('collection_id', collectionId)
        .eq('recipe_id', recipeId)

    if (error) {
        console.error('Error removing recipe from collection:', error)
        return { error: 'Greška pri uklanjanju recepta' }
    }

    revalidatePath(`/collections/${collectionId}`)
    return { success: true }
}

export async function getUserCollections(userId?: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    
    const targetUserId = userId || user?.id
    if (!targetUserId) {
        return { collections: [] }
    }

    const query = supabase
        .from('collections')
        .select(`
            *,
            collection_recipes (count)
        `)
        .eq('user_id', targetUserId)
        .order('created_at', { ascending: false })

    // If viewing another user's collections, only show public ones
    if (userId && userId !== user?.id) {
        query.eq('is_public', true)
    }

    const { data: collections, error } = await query

    if (error) {
        console.error('Error fetching collections:', error)
        return { collections: [] }
    }

    return { collections: collections || [] }
}

export async function getPublicCollections() {
    const supabase = await createClient()

    const { data: collections, error } = await supabase
        .from('collections')
        .select(`
            *,
            profiles (display_name, avatar_url),
            collection_recipes (count)
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching public collections:', error)
        return { collections: [] }
    }

    return { collections: collections || [] }
}

export async function getCollectionWithRecipes(collectionId: string) {
    const supabase = await createClient()

    const { data: collection, error: collectionError } = await supabase
        .from('collections')
        .select(`
            *,
            profiles (display_name, avatar_url)
        `)
        .eq('id', collectionId)
        .single()

    if (collectionError || !collection) {
        console.error('Error fetching collection:', collectionError)
        return { collection: null, recipes: [] }
    }

    // Check if user has access
    const { data: { user } } = await supabase.auth.getUser()
    const isOwner = user?.id === collection.user_id
    const isPublic = collection.is_public

    if (!isOwner && !isPublic) {
        return { collection: null, recipes: [], error: 'Nemate pristup ovoj kolekciji' }
    }

    const { data: collectionRecipes, error: recipesError } = await supabase
        .from('collection_recipes')
        .select(`
            added_at,
            recipes (
                id,
                title,
                description,
                image_url,
                prep_time,
                cook_time,
                servings,
                created_at,
                profiles (display_name)
            )
        `)
        .eq('collection_id', collectionId)
        .order('added_at', { ascending: false })

    if (recipesError) {
        console.error('Error fetching collection recipes:', recipesError)
        return { collection, recipes: [] }
    }

    const recipes = (collectionRecipes || []).map(cr => cr.recipes).filter(Boolean)

    return { collection, recipes }
}
