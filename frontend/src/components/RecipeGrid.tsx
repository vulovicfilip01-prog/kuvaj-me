import RecipeCard from './RecipeCard';

interface RecipeGridProps {
    recipes: any[];
    favoriteIds?: string[];
    isAuthenticated?: boolean;
}

export default function RecipeGrid({ recipes, favoriteIds = [], isAuthenticated = false }: RecipeGridProps) {
    if (!recipes || recipes.length === 0) {
        return (
            <div className="text-center py-20 px-6 glass-panel rounded-3xl">
                <span className="text-6xl mb-4 block">👨‍🍳</span>
                <p className="text-slate-600 text-xl font-medium mb-2">Još uvek nema recepata.</p>
                <p className="text-slate-500">Budi prvi koji će podeliti svoj recept sa zajednicom!</p>
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
