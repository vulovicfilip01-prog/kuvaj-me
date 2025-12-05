'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import StarRating from './StarRating'
import ReviewForm from './ReviewForm'
import { deleteReview } from '@/app/recipes/review-actions'

interface ReviewCardProps {
    review: {
        id: string
        rating: number
        comment: string | null
        created_at: string
        updated_at: string
        profiles: {
            id: string
            display_name: string | null
            avatar_url: string | null
        } | null
    }
    recipeId: string
    isOwnReview: boolean
    onUpdate?: () => void
}

export default function ReviewCard({ review, recipeId, isOwnReview, onUpdate }: ReviewCardProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        if (!confirm('Da li ste sigurni da želite da obrišete ovu recenziju?')) return

        setIsDeleting(true)
        const result = await deleteReview(review.id)

        if (result?.error) {
            alert(result.error)
            setIsDeleting(false)
        } else {
            if (onUpdate) onUpdate()
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('sr-RS', { year: 'numeric', month: 'long', day: 'numeric' })
    }

    if (isEditing) {
        return (
            <ReviewForm
                recipeId={recipeId}
                existingReview={review}
                onSuccess={() => {
                    setIsEditing(false)
                    if (onUpdate) onUpdate()
                }}
                onCancel={() => setIsEditing(false)}
            />
        )
    }

    return (
        <div className="glass-panel rounded-2xl p-6">
            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
                {/* Avatar */}
                <Link
                    href={`/profile/${review.profiles?.id}`}
                    className="flex-shrink-0"
                >
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                        {review.profiles?.avatar_url ? (
                            <Image
                                src={review.profiles.avatar_url}
                                alt={review.profiles.display_name || 'User'}
                                width={48}
                                height={48}
                                className="object-cover"
                            />
                        ) : (
                            <span className="text-white font-bold text-lg">
                                {review.profiles?.display_name?.[0]?.toUpperCase() || '👤'}
                            </span>
                        )}
                    </div>
                </Link>

                {/* User & Rating */}
                <div className="flex-1">
                    <Link
                        href={`/profile/${review.profiles?.id}`}
                        className="font-bold text-slate-900 hover:text-primary transition-colors"
                    >
                        {review.profiles?.display_name || 'Kuvaj.me Chef'}
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                        <StarRating rating={review.rating} readonly size="sm" />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                        {formatDate(review.created_at)}
                        {review.updated_at !== review.created_at && ' (izmenjeno)'}
                    </p>
                </div>

                {/* Actions (if own review) */}
                {isOwnReview && (
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="text-sm px-3 py-1 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        >
                            Izmeni
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="text-sm px-3 py-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        >
                            {isDeleting ? 'Brisanje...' : 'Obriši'}
                        </button>
                    </div>
                )}
            </div>

            {/* Comment */}
            {review.comment && (
                <p className="text-slate-700 leading-relaxed">
                    {review.comment}
                </p>
            )}
        </div>
    )
}
