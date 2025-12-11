import RecipeCard from './RecipeCard';

interface RecipeGridProps {
    recipes: any[];
    favoriteIds?: string[];
    isAuthenticated?: boolean;
}

export default function RecipeGrid({ recipes, favoriteIds = [], isAuthenticated = false }: RecipeGridProps) {
    if (!recipes || recipes.length === 0) {
        return (
            <div className="text-center py-16 px-6 glass-panel rounded-3xl border border-dashed border-slate-300">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl shadow-sm">
                    👨‍🍳
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Još uvek nema recepata</h3>
                <p className="text-slate-600 max-w-md mx-auto">
                    Trenutno nema recepata u ovoj kategoriji. Budi prvi koji će podeliti svoju kulinarsku magiju!
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
                <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    isFavorite={favoriteIds.includes(recipe.id)}
                    isAuthenticated={isAuthenticated}
                />
            ))}
        </div>
    );
}
