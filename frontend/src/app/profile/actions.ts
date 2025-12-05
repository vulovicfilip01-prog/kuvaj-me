'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getProfile(userId: string) {
  const supabase = await createClient()

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }

  return profile
}

export async function getUserRecipes(userId: string, isOwner: boolean = false) {
  const supabase = await createClient()

  let query = supabase
    .from('recipes')
    .select(`
      *,
      profiles (display_name, avatar_url),
      categories (name, slug, icon)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (!isOwner) {
    query = query.eq('is_public', true)
  }

  const { data: recipes, error } = await query

  if (error) {
    console.error('Error fetching user recipes:', error)
    return []
  }

  return recipes
}

export async function getUserStats(userId: string) {
    const supabase = await createClient()

    // Get total recipes count
    const { count: recipesCount, error: recipesError } = await supabase
        .from('recipes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_public', true)

    // Get total collections count
    const { count: collectionsCount, error: collectionsError } = await supabase
        .from('collections')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_public', true)

    if (recipesError || collectionsError) {
        console.error('Error fetching stats:', recipesError || collectionsError)
        return { recipesCount: 0, collectionsCount: 0 }
    }

    return {
        recipesCount: recipesCount || 0,
        collectionsCount: collectionsCount || 0
    }
}

export async function getUserCollections(userId: string, isOwner: boolean = false) {
    const supabase = await createClient()

    let query = supabase
        .from('collections')
        .select(`
            *,
            profiles (display_name, avatar_url),
            collection_recipes (count)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

    if (!isOwner) {
        query = query.eq('is_public', true)
    }

    const { data: collections, error } = await query

    if (error) {
        console.error('Error fetching user collections:', error)
        return []
    }

    return collections || []
}

export async function updateProfile(data: { 
  display_name?: string; 
  bio?: string; 
  avatar_url?: string;
  location?: string;
  social_links?: any;
  dietary_preferences?: string[];
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Morate biti ulogovani' }
  }

  const { error } = await supabase
    .from('profiles')
    .update(data)
    .eq('id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/profile/${user.id}`)
  return { success: true }
}

export async function uploadAvatar(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Morate biti ulogovani' }
  }

  const file = formData.get('avatar') as File
  if (!file) {
    return { error: 'Nema fajla' }
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  if (!allowedTypes.includes(file.type)) {
    return { error: 'Dozvoljen format: JPG, PNG, WebP, GIF' }
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return { error: 'Maksimalna veličina fajla je 5MB' }
  }

  const fileExt = file.name.split('.').pop()
  const fileName = `${user.id}/avatar.${fileExt}`

  // Delete old avatar if exists
  const { data: existingFiles } = await supabase.storage
    .from('avatars')
    .list(user.id)

  if (existingFiles && existingFiles.length > 0) {
    await supabase.storage
      .from('avatars')
      .remove(existingFiles.map(f => `${user.id}/${f.name}`))
  }

  // Upload new avatar
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(fileName, file, {
      upsert: true,
      contentType: file.type
    })

  if (uploadError) {
    return { error: uploadError.message }
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName)

  // Update profile with avatar URL
  const updateResult = await updateProfile({ avatar_url: publicUrl })
  
  if (updateResult.error) {
    return { error: updateResult.error }
  }

  return { success: true, url: publicUrl }
}
