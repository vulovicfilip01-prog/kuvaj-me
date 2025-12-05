'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getRecipeReviews(recipeId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('recipe_reviews')
    .select(`
      *,
      profiles (
        id,
        display_name,
        avatar_url
      )
    `)
    .eq('recipe_id', recipeId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching reviews:', error)
    return []
  }

  return data
}

export async function getUserReview(recipeId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data, error } = await supabase
    .from('recipe_reviews')
    .select('*')
    .eq('recipe_id', recipeId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (error) {
    console.error('Error fetching user review:', error)
    return null
  }

  return data
}

export async function addReview(recipeId: string, rating: number, comment: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Morate biti ulogovani' }
  }

  if (rating < 1 || rating > 5) {
    return { error: 'Ocena mora biti između 1 i 5' }
  }

  const { error } = await supabase
    .from('recipe_reviews')
    .insert({
      recipe_id: recipeId,
      user_id: user.id,
      rating,
      comment: comment.trim() || null
    })

  if (error) {
    if (error.code === '23505') {
      return { error: 'Već ste ocenili ovaj recept. Možete izmeniti svoju ocenu.' }
    }
    return { error: error.message }
  }

  revalidatePath(`/recipes/${recipeId}`)
  return { success: true }
}

export async function updateReview(reviewId: string, rating: number, comment: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Morate biti ulogovani' }
  }

  if (rating < 1 || rating > 5) {
    return { error: 'Ocena mora biti između 1 i 5' }
  }

  const { data: review, error: fetchError } = await supabase
    .from('recipe_reviews')
    .select('recipe_id')
    .eq('id', reviewId)
    .single()

  if (fetchError || !review) {
    return { error: 'Recenzija nije pronađena' }
  }

  const { error } = await supabase
    .from('recipe_reviews')
    .update({
      rating,
      comment: comment.trim() || null,
      updated_at: new Date().toISOString()
    })
    .eq('id', reviewId)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/recipes/${review.recipe_id}`)
  return { success: true }
}

export async function deleteReview(reviewId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Morate biti ulogovani' }
  }

  const { data: review, error: fetchError } = await supabase
    .from('recipe_reviews')
    .select('recipe_id')
    .eq('id', reviewId)
    .single()

  if (fetchError || !review) {
    return { error: 'Recenzija nije pronađena' }
  }

  const { error } = await supabase
    .from('recipe_reviews')
    .delete()
    .eq('id', reviewId)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/recipes/${review.recipe_id}`)
  return { success: true }
}
