'use client'

import { FiStar } from 'react-icons/fi'
import { useState } from 'react'

interface StarInputProps {
    rating: number
    onChange: (rating: number) => void
    size?: 'sm' | 'md' | 'lg'
    readonly?: boolean
}

export default function StarInput({ rating, onChange, size = 'md', readonly = false }: StarInputProps) {
    const [hoverRating, setHoverRating] = useState(0)

    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8'
    }

    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={readonly}
                    onClick={() => !readonly && onChange(star)}
                    onMouseEnter={() => !readonly && setHoverRating(star)}
                    onMouseLeave={() => !readonly && setHoverRating(0)}
                    className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform`}
                >
                    <FiStar
                        className={`transition-colors duration-200 ${sizeClasses[size]} ${star <= (hoverRating || rating)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-slate-200"
                            }`}
                    />
                </button>
            ))}
        </div>
    )
}
