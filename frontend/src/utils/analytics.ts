import { sendGAEvent } from '@next/third-parties/google'

export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  // Log events in development for debugging
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics] ${action} - ${category} - ${label}`)
  }
  
  // Send to GA4
  sendGAEvent('event', action, {
    category,
    label,
    value
  })
}

export const Analytics = {
  // Discovery
  search: (query: string) => trackEvent('search', 'Discovery', query),
  viewRecipe: (recipeId: string, title: string) => trackEvent('view_item', 'Recipe', title),
  
  // Engagement
  addToFavorite: (recipeId: string) => trackEvent('add_to_wishlist', 'Recipe', recipeId),
  addToCollection: (collectionName: string) => trackEvent('add_to_collection', 'Collection', collectionName),
  share: (method: string, recipeId: string) => trackEvent('share', 'Recipe', `${method}:${recipeId}`),
  
  // Auth
  signup: (method: string) => trackEvent('sign_up', 'Auth', method),
  login: (method: string) => trackEvent('login', 'Auth', method),
  
  // Commerce (Shopping List)
  addToShoppingList: (itemCount: number) => trackEvent('add_to_cart', 'Shopping List', 'Ingredients', itemCount),
}
