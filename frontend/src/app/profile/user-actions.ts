'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { createNotification } from '../notifications/actions';

export async function followUser(targetUserId: string) {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: 'Morate biti prijavljeni' }
  }

  if (user.id === targetUserId) {
    return { error: 'Ne možete pratiti sami sebe' }
  }

  const { error } = await supabase
    .from('follows')
    .insert({
      follower_id: user.id,
      following_id: targetUserId
    })

  if (error) {
    console.error('Error following user:', error)
    return { error: 'Došlo je do greške prilikom praćenja korisnika' }
  }

  // Create notification
  await createNotification(targetUserId, 'follow');

  revalidatePath(`/profile/${targetUserId}`)
  return { success: true }
}

export async function unfollowUser(targetUserId: string) {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: 'Morate biti prijavljeni' }
  }

  const { error } = await supabase
    .from('follows')
    .delete()
    .eq('follower_id', user.id)
    .eq('following_id', targetUserId)

  if (error) {
    console.error('Error unfollowing user:', error)
    return { error: 'Došlo je do greške prilikom prestanka praćenja korisnika' }
  }

  revalidatePath(`/profile/${targetUserId}`)
  return { success: true }
}

export async function getFollowStatus(targetUserId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return false
  }

  const { data, error } = await supabase
    .from('follows')
    .select('created_at')
    .eq('follower_id', user.id)
    .eq('following_id', targetUserId)
    .single()

  if (error && error.code !== 'PGRST116') { // PGRST116 is "Row not found"
     console.error('Error checking follow status:', error)
  }

  return !!data
}

export async function getFollowCounts(userId: string) {
  const supabase = await createClient()

  // Get followers count
  const { count: followersCount, error: followersError } = await supabase
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .eq('following_id', userId)

  // Get following count
  const { count: followingCount, error: followingError } = await supabase
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .eq('follower_id', userId)

  if (followersError || followingError) {
    console.error('Error fetching follow counts')
  }

  return {
    followers: followersCount || 0,
    following: followingCount || 0
  }
}
