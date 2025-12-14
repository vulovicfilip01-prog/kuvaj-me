'use client'

import { useState } from 'react'
import { rateRecipe } from '@/app/recipes/rating-actions'
import { FiStar } from 'react-icons/fi'

interface StarRatingProps {
    recipeId: string;
    initialAverage: number;
    initialCount: number;
    initialMyRating?: number | null;
    isAuthenticated: boolean;
}

export default function StarRating({
    recipeId,
    initialAverage,
    initialCount,
    initialMyRating,
    isAuthenticated
}: StarRatingProps) {
    const [average, setAverage] = useState(initialAverage);
    const [count, setCount] = useState(initialCount);
    const [myRating, setMyRating] = useState(initialMyRating);
    const [hoverRating, setHoverRating] = useState(0);
    const [loading, setLoading] = useState(false);

    const handleRate = async (rating: number) => {
        if (!isAuthenticated) return;
        if (loading) return;

        setLoading(true);
        // Optimistic update
        const oldMyRating = myRating;
        setMyRating(rating);

        const result = await rateRecipe(recipeId, rating);

        if (!result.success) {
            // Revert
            setMyRating(oldMyRating);
        } else {
            // Approx update logic could go here, but revalidatePath handles the "real" update on reload
            // For now, client feels instant feedback on "My Rating"
        }
        setLoading(false);
    };

    return (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center gap-3">
            <h3 className="font-bold text-slate-900">Oceni recept</h3>
            <div className="flex flex-col items-center">
                <span className="text-4xl font-black text-slate-800 tracking-tight">{average}</span>
                <div className="flex gap-1 text-yellow-400 text-lg my-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <FiStar
                            key={star}
                            fill={star <= Math.round(average) ? "currentColor" : "none"}
                            className={star <= Math.round(average) ? "stroke-yellow-400" : "stroke-slate-200 text-slate-200"}
                        />
                    ))}
                </div>
                <span className="text-sm text-slate-400 font-medium">{count} glasova</span>
            </div>

            {isAuthenticated ? (
                <div className="border-t border-slate-50 pt-4 w-full flex flex-col items-center mt-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Tvoja ocena</span>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                disabled={loading}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => handleRate(star)}
                                className="transition-all hover:scale-110 focus:outline-none p-1"
                            >
                                <FiStar
                                    size={28}
                                    className={`transition-colors duration-200 ${star <= (hoverRating || myRating || 0)
                                            ? "text-yellow-400 fill-yellow-400 drop-shadow-sm"
                                            : "text-slate-200 hover:text-yellow-400"
                                        }`}
                                />
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="border-t border-slate-50 pt-4 w-full text-center mt-2">
                    <span className="text-xs text-slate-400">Prijavi se da bi ocenio</span>
                </div>
            )}
        </div>
    );
}
