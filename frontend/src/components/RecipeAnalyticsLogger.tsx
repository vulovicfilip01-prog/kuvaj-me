'use client'

import { useEffect } from 'react'
import { Analytics } from '@/utils/analytics'

interface RecipeAnalyticsLoggerProps {
    recipeId: string
    title: string
}

export default function RecipeAnalyticsLogger({ recipeId, title }: RecipeAnalyticsLoggerProps) {
    useEffect(() => {
        Analytics.viewRecipe(recipeId, title)
    }, [recipeId, title])

    return null
}
