'use client'

import { useState, useTransition } from 'react'
import { addToFavorites, removeFromFavorites } from '@/app/recipes/actions'
import { HiOutlineHeart, HiHeart } from 'react-icons/hi'
import { Analytics } from '@/utils/analytics'

interface FavoriteButtonProps {
    recipeId: string
    initialIsFavorite: boolean
    isAuthenticated: boolean
    size?: 'sm' | 'md' | 'lg'
    className?: string
}

export default function FavoriteButton({
    recipeId,
    initialIsFavorite,
    isAuthenticated,
    size = 'md',
    className
}: FavoriteButtonProps) {
    const [isFavorite, setIsFavorite] = useState(initialIsFavorite)
    const [isPending, startTransition] = useTransition()
    const [showTooltip, setShowTooltip] = useState(false)

    const handleToggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (!isAuthenticated) {
            setShowTooltip(true)
            setTimeout(() => setShowTooltip(false), 3000)
            return
        }

        startTransition(async () => {
            // Optimistic update
            const newIsFavorite = !isFavorite
            setIsFavorite(newIsFavorite)

            try {
                if (newIsFavorite) {
                    await addToFavorites(recipeId)
                    Analytics.addToFavorite(recipeId)
                } else {
                    await removeFromFavorites(recipeId)
                }
            } catch (error) {
                // Revert on error
                setIsFavorite(!newIsFavorite)
                console.error('Failed to toggle favorite:', error)
            }
        })
    }

    const sizeClasses = {
        sm: 'w-8 h-8 text-lg',
        md: 'w-10 h-10 text-xl',
        lg: 'w-12 h-12 text-2xl'
    }

    return (
        <button
            onClick={handleToggleFavorite}
            disabled={isPending}
            className={`
                group relative flex items-center justify-center gap-2 rounded-xl transition-all duration-200 border
                ${sizeClasses[size]}
                ${isFavorite
                    ? 'bg-red-50 text-red-500 border-red-200 hover:bg-red-100'
                    : 'bg-white text-slate-400 border-slate-200 hover:border-red-200 hover:text-red-400'
                }
                ${className}
            `}
            title={isFavorite ? 'Ukloni iz omiljenih' : 'Dodaj u omiljene'}
        >
            {isFavorite ? (
                <HiHeart className="w-5 h-5 text-red-500 animate-heart-pop" />
            ) : (
                <HiOutlineHeart className="w-5 h-5 text-slate-400 group-hover:text-red-400 transition-colors" />
            )}

            {/* Tooltip for unauthenticated users */}
            {showTooltip && !isAuthenticated && (
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 whitespace-nowrap">
                    <div className="bg-slate-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg animate-fadeIn">
                        Prijavi se da dodaš u favorite
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
                    </div>
                </div>
            )}
        </button>
    )
}
