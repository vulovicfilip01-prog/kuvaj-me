'use client'

import { useState, useTransition } from 'react'
import { addToFavorites, removeFromFavorites } from '@/app/recipes/actions'
import { HiOutlineHeart, HiHeart } from 'react-icons/hi'

interface FavoriteButtonProps {
    recipeId: string
    initialIsFavorite: boolean
    isAuthenticated: boolean
    size?: 'sm' | 'md' | 'lg'
}

export default function FavoriteButton({
    recipeId,
    initialIsFavorite,
    isAuthenticated,
    size = 'md'
}: FavoriteButtonProps) {
    const [isFavorite, setIsFavorite] = useState(initialIsFavorite)
    const [isPending, startTransition] = useTransition()
    const [showTooltip, setShowTooltip] = useState(false)

    const handleClick = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (!isAuthenticated) {
            setShowTooltip(true)
            setTimeout(() => setShowTooltip(false), 2000)
            return
        }

        // Optimistic update
        setIsFavorite(!isFavorite)

        startTransition(async () => {
            const result = isFavorite
                ? await removeFromFavorites(recipeId)
                : await addToFavorites(recipeId)

            if (result.error) {
                // Revert on error
                setIsFavorite(isFavorite)
                console.error(result.error)
            }
        })
    }

    const sizeClasses = {
        sm: 'w-8 h-8 text-lg',
        md: 'w-10 h-10 text-xl',
        lg: 'w-12 h-12 text-2xl'
    }

    return (
        <div className="relative">
            <button
                onClick={handleClick}
                disabled={isPending}
                className={`${sizeClasses[size]} flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm border border-slate-200 hover:bg-white hover:scale-110 active:scale-95 transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed group`}
                aria-label={isFavorite ? 'Ukloni iz favorita' : 'Dodaj u favorite'}
            >
                {isFavorite ? (
                    <HiHeart className="w-5 h-5 text-red-500 animate-heart-pop" />
                ) : (
                    <HiOutlineHeart className="w-5 h-5 text-slate-400 group-hover:text-red-400 transition-colors" />
                )}
            </button>

            {/* Tooltip for unauthenticated users */}
            {showTooltip && !isAuthenticated && (
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 whitespace-nowrap">
                    <div className="bg-slate-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg animate-fadeIn">
                        Prijavi se da dodaš u favorite
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
                    </div>
                </div>
            )}
        </div>
    )
}
