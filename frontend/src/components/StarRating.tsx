'use client'

import { useState } from 'react'

interface StarRatingProps {
    rating: number
    onChange?: (rating: number) => void
    readonly?: boolean
    size?: 'sm' | 'md' | 'lg'
}

export default function StarRating({ rating, onChange, readonly = false, size = 'md' }: StarRatingProps) {
    const [hoverRating, setHoverRating] = useState(0)

    const sizeClasses = {
        sm: 'text-lg',
        md: 'text-2xl',
        lg: 'text-3xl'
    }

    const displayRating = hoverRating || rating

    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => !readonly && onChange?.(star)}
                    onMouseEnter={() => !readonly && setHoverRating(star)}
                    onMouseLeave={() => !readonly && setHoverRating(0)}
                    disabled={readonly}
                    className={`${sizeClasses[size]} transition-all ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
                        }`}
                >
                    <span className={star <= displayRating ? 'text-yellow-400' : 'text-slate-300'}>
                        {star <= displayRating ? '⭐' : '☆'}
                    </span>
                </button>
            ))}
        </div>
    )
}
