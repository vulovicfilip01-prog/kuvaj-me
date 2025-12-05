'use client';

import Link from 'next/link';
import FavoriteButton from './FavoriteButton';
import RecipePlaceholder from './RecipePlaceholder';
import RecipeImage from './RecipeImage';
import StarRating from './StarRating';

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
}

export default function RecipeCard({ recipe, isFavorite = false, isAuthenticated = false }: RecipeCardProps) {
    return (
        <Link href={`/recipes/${recipe.id}`} className="group block h-full">
            <div className="glass-panel rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 relative h-full flex flex-col">

                {/* Match Badge (if available) */}
                {recipe.matchInfo && (
                    <div className={`absolute top-3 right-3 z-10 px-3 py-1 rounded-full text-xs font-bold shadow-lg backdrop-blur-md border border-white/10 ${recipe.matchInfo.missingCount === 0
                        ? 'bg-green-500/90 text-white'
                        : 'bg-yellow-500/90 text-black'
                        }`}>
                        {recipe.matchInfo.missingCount === 0
                            ? '✨ Imaš sve!'
                            : `Fali ${recipe.matchInfo.missingCount}`}
                    </div>
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
                <div className="h-48 relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-700">
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

                <div className="p-5 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-bold text-primary uppercase tracking-wider bg-primary/10 px-2 py-1 rounded-md border border-primary/20">
                            {recipe.categories?.name || 'Opšte'}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full border font-medium ${recipe.difficulty === 'lako' ? 'border-green-500/30 text-green-400 bg-green-500/10' :
                            recipe.difficulty === 'srednje' ? 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10' :
                                'border-red-500/30 text-red-400 bg-red-500/10'
                            }`}>
                            {recipe.difficulty}
                        </span>
                    </div>

                    {/* Average Rating */}
                    {recipe.average_rating && recipe.average_rating > 0 && (
                        <div className="flex items-center gap-2 mb-3">
                            <StarRating rating={Math.round(recipe.average_rating)} readonly size="sm" />
                            <span className="text-sm text-slate-600">({recipe.review_count})</span>
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
                            className="text-slate-500 text-xs hover:text-primary transition-colors"
                            onClick={(e) => e.stopPropagation()}
                        >
                            by <span className="text-slate-700 font-medium hover:text-primary transition-colors">{recipe.profiles?.display_name || 'Chef'}</span>
                        </Link>
                    </div>
                </div>
            </div>
        </Link>
    );
}
