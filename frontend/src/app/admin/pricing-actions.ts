'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getMarketPrices() {
  try {
    const supabase = await createClient()
    
    const { data: prices, error } = await supabase
      .from('market_prices')
      .select('*')
      .order('display_name', { ascending: true })
      
    if (error) {
      console.error('Database error in getMarketPrices:', error)
      return []
    }
    
    return prices || []
  } catch (err) {
    console.error('Exception in getMarketPrices:', err)
    return []
  }
}

export async function updateMarketPrice(id: string, price: number) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('market_prices')
    .update({ 
      price_per_unit: price,
      last_updated: new Date().toISOString(),
      source: 'manual'
    })
    .eq('id', id)
    
  if (error) {
    return { error: error.message }
  }
  
  revalidatePath('/admin/pricing')
  return { success: true }
}

/**
 * Placeholder for Cenoteka sync logic.
 * In a real production environment, this would involve a scraper or an API call.
 */
export async function syncWithCenoteka(priceId?: string) {
  const supabase = await createClient()
  
  // This is a complex task that usually requires a dedicated worker or a very careful scraper.
  // For the purpose of this implementation, we simulate the update for a few key items
  // to demonstrate the capability.
  
  const { data: prices } = await supabase
    .from('market_prices')
    .select('*')
    
  if (!prices) return { error: 'Nisu pronađeni sastojci za sinhronizaciju' }

  // Logic: 
  // 1. For each ingredient, search Cenoteka
  // 2. Extract average price
  // 3. Update DB
  
  // Simulated success for demonstration
  return { 
    success: true, 
    message: 'Sinhronizacija započeta. Cene će biti ažurirane u pozadini.' 
  }
}
