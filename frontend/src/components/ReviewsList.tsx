'use client'

import { useState, useEffect } from 'react'
import ReviewCard from './ReviewCard'
import ReviewForm from './ReviewForm'
import { getRecipeReviews, getUserReview } from '@/app/recipes/review-actions'

interface ReviewsListProps {
    recipeId: string
    currentUserId: string | null
    initialReviews?: any[]
    initialUserReview?: any
}

export default function ReviewsList({ recipeId, currentUserId, initialReviews = [], initialUserReview = null }: ReviewsListProps) {
    const [reviews, setReviews] = useState(initialReviews)
    const [userReview, setUserReview] = useState(initialUserReview)
    const [showForm, setShowForm] = useState(false)

    const refreshReviews = async () => {
        const newReviews = await getRecipeReviews(recipeId)
        setReviews(newReviews)

        if (currentUserId) {
            const newUserReview = await getUserReview(recipeId)
            setUserReview(newUserReview)
        }
    }

    // Filter out user's own review from the list if they have one
    const otherReviews = reviews.filter(r => r.user_id !== currentUserId)

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-slate-900 heading-font flex items-center gap-3">
                    <span className="text-primary">⭐</span> Recenzije ({reviews.length})
                </h2>
            </div>

            {/* User's Review Form or Card */}
            {currentUserId && (
                <div>
                    {userReview ? (
                        <ReviewCard
                            review={userReview}
                            recipeId={recipeId}
                            isOwnReview={true}
                            onUpdate={refreshReviews}
                        />
                    ) : (
                        <>
                            {!showForm ? (
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="w-full py-4 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-all border border-primary/20 font-bold"
                                >
                                    + Dodaj svoju recenziju
                                </button>
                            ) : (
                                <ReviewForm
                                    recipeId={recipeId}
                                    onSuccess={() => {
                                        setShowForm(false)
                                        refreshReviews()
                                    }}
                                    onCancel={() => setShowForm(false)}
                                />
                            )}
                        </>
                    )}
                </div>
            )}

            {/* Other Reviews */}
            {otherReviews.length > 0 ? (
                <div className="space-y-4">
                    {otherReviews.map((review) => (
                        <ReviewCard
                            key={review.id}
                            review={review}
                            recipeId={recipeId}
                            isOwnReview={false}
                        />
                    ))}
                </div>
            ) : (
                !currentUserId && reviews.length === 0 && (
                    <div className="text-center py-12 glass-panel rounded-2xl">
                        <span className="text-6xl mb-4 block">💬</span>
                        <p className="text-slate-600 text-lg">
                            Još nema recenzija. Budi prvi koji će oceniti ovaj recept!
                        </p>
                    </div>
                )
            )}
        </div>
    )
}
