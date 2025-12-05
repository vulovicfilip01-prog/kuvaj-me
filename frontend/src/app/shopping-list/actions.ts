'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getShoppingList() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data, error } = await supabase
    .from('shopping_list_items')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching shopping list:', error)
    return []
  }

  return data
}

export async function addItem(name: string, quantity: string = '') {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Morate biti ulogovani' }
  }

  const { error } = await supabase
    .from('shopping_list_items')
    .insert({
      user_id: user.id,
      name,
      quantity,
    })

  if (error) {
    return { error: error.message }
  }

  // Fetch updated list
  const { data: items } = await supabase
    .from('shopping_list_items')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  revalidatePath('/shopping-list')
  return { success: true, items: items || [] }
}

export async function addItems(items: { name: string; quantity: string }[]) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Morate biti ulogovani' }
  }

  const itemsToInsert = items.map(item => ({
    user_id: user.id,
    name: item.name,
    quantity: item.quantity,
  }))

  const { error } = await supabase
    .from('shopping_list_items')
    .insert(itemsToInsert)

  if (error) {
    return { error: error.message }
  }

  // Fetch updated list
  const { data: updatedItems } = await supabase
    .from('shopping_list_items')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  revalidatePath('/shopping-list')
  return { success: true, items: updatedItems || [] }
}

export async function toggleItem(id: string, is_checked: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Morate biti ulogovani' }
  }

  const { error } = await supabase
    .from('shopping_list_items')
    .update({ is_checked })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  // Fetch updated list
  const { data: items } = await supabase
    .from('shopping_list_items')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  revalidatePath('/shopping-list')
  return { success: true, items: items || [] }
}

export async function removeItem(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Morate biti ulogovani' }
  }

  const { error } = await supabase
    .from('shopping_list_items')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  // Fetch updated list
  const { data: items } = await supabase
    .from('shopping_list_items')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  revalidatePath('/shopping-list')
  return { success: true, items: items || [] }
}

export async function clearChecked() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Morate biti ulogovani' }
  }

  const { error } = await supabase
    .from('shopping_list_items')
    .delete()
    .eq('user_id', user.id)
    .eq('is_checked', true)

  if (error) {
    return { error: error.message }
  }

  // Fetch updated list
  const { data: items } = await supabase
    .from('shopping_list_items')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  revalidatePath('/shopping-list')
  return { success: true, items: items || [] }
}
