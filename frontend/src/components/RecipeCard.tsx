'use client';

import Link from 'next/link';
import FavoriteButton from './FavoriteButton';
import DeleteRecipeButton from './DeleteRecipeButton';
import RecipePlaceholder from './RecipePlaceholder';
import RecipeImage from './RecipeImage';
import DifficultyBadge from './DifficultyBadge';
;

interface RecipeCardProps {
    recipe: {
        id: string;
        title: string;
        description: string;
        prep_time: number;
        cook_time: number;
        difficulty: string;
        image_url: string | null;
        user_id: string;
        average_rating?: number | null;
        review_count?: number | null;
        is_posno?: boolean;
        categories: {
            name: string;
        } | null;
        profiles: {
            display_name: string | null;
        } | null;
        matchInfo?: {
            matchCount: number;
            totalCount: number;
            missingCount: number;
        };
    };
    isFavorite?: boolean;
    isAuthenticated?: boolean;
    isOwner?: boolean;
}

export default function RecipeCard({ recipe, isFavorite = false, isAuthenticated = false, isOwner = false }: RecipeCardProps) {
    return (
        <div className="group block h-full">
            <div className="glass-panel rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 relative h-full flex flex-col">

                {/* Main Link Overlay */}
                <Link href={`/recipes/${recipe.id}`} className="absolute inset-0 z-0" aria-label={`Pogledaj recept ${recipe.title}`} />

                {/* Owner Actions (Delete) OR Match Badge */}
                {isOwner ? (
                    <div className="absolute top-3 right-3 z-20 pointer-events-auto">
                        {/* Compact Delete Button */}
                        <DeleteRecipeButton recipeId={recipe.id} compact={true} />
                    </div>
                ) : (
                    recipe.matchInfo && (
                        <div className={`absolute top-3 right-3 z-10 px-3 py-1 rounded-full text-xs font-bold shadow-lg backdrop-blur-md border border-white/10 ${recipe.matchInfo.missingCount === 0
                            ? 'bg-green-500/90 text-white'
                            : 'bg-yellow-500/90 text-black'
                            }`}>
                            {recipe.matchInfo.missingCount === 0
                                ? '✨ Imaš sve!'
                                : `Fali ${recipe.matchInfo.missingCount}`}
                        </div>
                    )
                )}

                {/* Favorite Button */}
                <div className="absolute top-3 left-3 z-20 pointer-events-auto">
                    <FavoriteButton
                        recipeId={recipe.id}
                        initialIsFavorite={isFavorite}
                        isAuthenticated={isAuthenticated}
                        size="sm"
                    />
                </div>

                {/* Recipe Image */}
                <div className="h-48 relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-700 pointer-events-none">
                    {recipe.image_url ? (
                        <RecipeImage
                            src={recipe.image_url}
                            alt={recipe.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent z-10"></div>
                        </RecipeImage>
                    ) : (
                        <RecipePlaceholder />
                    )}
                </div>

                <div className="p-5 flex flex-col flex-grow pointer-events-none">
                    <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-bold text-primary uppercase tracking-wider bg-primary/10 px-2 py-1 rounded-md border border-primary/20">
                            {recipe.categories?.name || 'Opšte'}
                        </span>
                        <DifficultyBadge difficulty={recipe.difficulty} />
                        {recipe.is_posno && (
                            <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-md border border-green-200 flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-leaf-icon lucide-leaf"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" /></svg>
                                Posno
                            </span>
                        )}
                    </div>

                    {/* Average Rating */}
                    {recipe.average_rating && recipe.average_rating > 0 && (
                        <div className="flex items-center gap-1 mb-3">
                            <span className="text-yellow-400 flex">
                                {[...Array(5)].map((_, i) => (
                                    <svg
                                        key={i}
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill={i < Math.round(recipe.average_rating || 0) ? "currentColor" : "none"}
                                        stroke="currentColor"
                                        className={`w-4 h-4 ${i < Math.round(recipe.average_rating || 0) ? "" : "text-slate-300"}`}
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                    </svg>
                                ))}
                            </span>
                            <span className="text-xs text-slate-500 font-medium">({recipe.review_count || 0})</span>
                        </div>
                    )}

                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors heading-font leading-tight">
                        {recipe.title}
                    </h3>

                    <p className="text-slate-600 text-sm line-clamp-2 mb-4 flex-grow">
                        {recipe.description}
                    </p>

                    <div className="flex items-center justify-between text-sm text-slate-500 border-t border-white/5 pt-4 mt-auto">
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1.5 text-slate-600">
                                <span className="text-primary">⏱️</span> {recipe.prep_time + recipe.cook_time} min
                            </span>
                        </div>
                        <Link
                            href={`/profile/${recipe.user_id}`}
                            className="text-slate-500 text-xs hover:text-primary transition-colors z-20 relative pointer-events-auto"
                        >
                            by <span className="text-slate-700 font-medium hover:text-primary transition-colors">{recipe.profiles?.display_name || 'Chef'}</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
