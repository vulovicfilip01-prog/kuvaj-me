'use client'

import { useState } from 'react'
import StarRating from './StarRating'
import { addReview, updateReview } from '@/app/recipes/review-actions'

interface ReviewFormProps {
    recipeId: string
    existingReview?: {
        id: string
        rating: number
        comment: string | null
    } | null
    onSuccess?: () => void
    onCancel?: () => void
}

export default function ReviewForm({ recipeId, existingReview, onSuccess, onCancel }: ReviewFormProps) {
    const [rating, setRating] = useState(existingReview?.rating || 0)
    const [comment, setComment] = useState(existingReview?.comment || '')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (rating === 0) {
            setError('Molimo odaberite ocenu')
            return
        }

        setIsSubmitting(true)
        setError(null)

        let result
        if (existingReview) {
            result = await updateReview(existingReview.id, rating, comment)
        } else {
            result = await addReview(recipeId, rating, comment)
        }

        setIsSubmitting(false)

        if (result?.error) {
            setError(result.error)
        } else {
            if (onSuccess) onSuccess()
        }
    }

    return (
        <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-4 heading-font">
                {existingReview ? 'Izmeni recenziju' : 'Oceni recept'}
            </h3>

            {/* Star Rating */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    Tvoja ocena
                </label>
                <StarRating
                    rating={rating}
                    onChange={setRating}
                    size="lg"
                />
            </div>

            {/* Comment */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    Komentar (opciono)
                </label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Podeli svoje mišljenje o receptu..."
                    maxLength={1000}
                />
                <p className="text-xs text-slate-500 mt-1">
                    {comment.length}/1000 karaktera
                </p>
            </div>

            {/* Error */}
            {error && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm">
                    {error}
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
                <button
                    type="submit"
                    disabled={isSubmitting || rating === 0}
                    className="flex-1 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50"
                >
                    {isSubmitting ? 'Čuvanje...' : existingReview ? 'Sačuvaj izmene' : 'Objavi recenziju'}
                </button>
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors"
                    >
                        Otkaži
                    </button>
                )}
            </div>
        </form>
    )
}
