
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getRecipe, isFavorite } from '../actions';
import { getRecipeRating } from '../rating-actions';
import { getRecipeComments } from '../comment-actions';
import { createClient } from '@/utils/supabase/server';
import FavoriteButton from '@/components/FavoriteButton';
import AddToPlanButton from "@/components/AddToPlanButton";
import StarRating from "@/components/StarRating";
import RecipePlaceholder from '@/components/RecipePlaceholder';
import RecipeImage from '@/components/RecipeImage';
import DeleteRecipeButton from '@/components/DeleteRecipeButton';
import ShareButton from '@/components/ShareButton';
import AddToCollectionButton from '@/components/AddToCollectionButton';
import VideoPlayer from '@/components/VideoPlayer';
import RecipeIngredients from '@/components/RecipeIngredients';
import RecipeComments from '@/components/RecipeComments';
import Navbar from '@/components/Navbar';
import PrintButton from '@/components/PrintButton';
import RecipeAnalyticsLogger from '@/components/RecipeAnalyticsLogger';

// Icons
import { LuClock, LuFlame, LuUsers, LuChefHat, LuPlay, LuNotepadText } from "react-icons/lu";
import { ImSpoonKnife } from "react-icons/im";

// Force dynamic rendering for authenticated features
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const recipe = await getRecipe(params.id);
    if (!recipe) return { title: 'Recept nije pronađen' };

    return {
        title: `${recipe.title} - Kuvaj.me`,
        description: recipe.description?.substring(0, 160) || `Recept za ${recipe.title}`,
        openGraph: {
            title: recipe.title,
            description: recipe.description || `Pogledajte recept za ${recipe.title}`,
            images: recipe.image_url ? [recipe.image_url] : [],
        }
    };
}

export default async function RecipePage({ params }: { params: { id: string } }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const recipe = await getRecipe(params.id);
    if (!recipe) {
        notFound();
    }

    const { average, count, myRating } = await getRecipeRating(recipe.id);
    const recipeIsFavorite = await isFavorite(recipe.id);
    const comments = await getRecipeComments(recipe.id);

    // Schema.org Structured Data
    const recipeSchema = {
        '@context': 'https://schema.org',
        '@type': 'Recipe',
        name: recipe.title,
        image: recipe.image_url ? [recipe.image_url] : [],
        author: {
            '@type': 'Person',
            name: recipe.profiles?.display_name || 'Kuvaj.me Korisnik'
        },
        datePublished: recipe.created_at,
        description: recipe.description,
        prepTime: `PT${recipe.preperation_time || recipe.prep_time}M`, // Handle legacy/new column names if any
        cookTime: `PT${recipe.cooking_time || recipe.cook_time}M`,
        recipeYield: `${recipe.servings} porcija`,
        recipeIngredient: recipe.recipe_ingredients?.map((i: any) => `${i.amount} ${i.unit} ${i.ingredient.name}`) || recipe.ingredients?.map((i: any) => `${i.quantity} ${i.name}`),
        recipeInstructions: recipe.recipe_steps?.map((s: any) => ({
            '@type': 'HowToStep',
            text: s.instruction,
            position: s.step_number
        })) || recipe.steps?.map((s: any) => ({
            '@type': 'HowToStep',
            text: s.instruction,
            position: s.step_number || s.id
        })),
        ...(recipe.calories && {
            nutrition: {
                '@type': 'NutritionInformation',
                calories: `${recipe.calories} cal`,
            }
        }),
        aggregateRating: count > 0 ? {
            '@type': 'AggregateRating',
            ratingValue: average,
            reviewCount: count,
            bestRating: "5",
            worstRating: "1"
        } : undefined
    };

    // Check if we are using the new 'recipe_steps' or old 'steps' structure from getRecipe
    // The previous getRecipe version seemed to join 'steps:recipe_steps(*)'
    const steps = recipe.steps || recipe.recipe_steps || [];
    const ingredients = recipe.ingredients || recipe.recipe_ingredients || [];

    // Helper to get ingredient display
    const getIngredientText = (ing: any) => {
        if (ing.ingredient?.name) {
            return `${ing.amount} ${ing.unit} ${ing.ingredient.name}`;
        }
        return `${ing.quantity} ${ing.name}`;
    };

    const recipeUrl = typeof window !== 'undefined' ? window.location.href : `https://kuvaj.me/recipes/${recipe.id}`;

    const userIsAdmin = user?.user_metadata?.is_admin === true;

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <Navbar />

            {/* Recipe Schema JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(recipeSchema) }}
            />
            <RecipeAnalyticsLogger recipeId={recipe.id} title={recipe.title} />

            <main className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Hero Section */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                            <div className="relative aspect-video rounded-2xl overflow-hidden mb-6 bg-slate-100">
                                {recipe.image_url ? (
                                    <RecipeImage
                                        src={recipe.image_url}
                                        alt={recipe.title}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                ) : (
                                    <RecipePlaceholder className="w-full h-full" />
                                )}

                                {recipe.is_posno && (
                                    <div className="absolute top-4 right-4 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg">
                                        Posno
                                    </div>
                                )}
                            </div>

                            {/* Title & Author */}
                            <div className="mb-6">
                                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                                    {recipe.title}
                                </h1>
                                <div className="flex items-center justify-between flex-wrap gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden relative">
                                            {recipe.profiles?.avatar_url ? (
                                                <RecipeImage src={recipe.profiles.avatar_url} alt="Avatar" fill className="object-cover" />
                                            ) : (
                                                <span>{recipe.profiles?.display_name?.[0]?.toUpperCase() || 'K'}</span>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">
                                                {recipe.profiles?.display_name || 'Kuvaj.me Korisnik'}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {new Date(recipe.created_at).toLocaleDateString('sr-RS')}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <PrintButton recipeId={recipe.id} />
                                        <ShareButton
                                            title={recipe.title}
                                            text={`Pogledaj ovaj recept za ${recipe.title} na Kuvaj.me!`}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl mb-6">
                                <div className="text-center p-2">
                                    <span className="block text-2xl mb-1">⏱️</span>
                                    <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">Priprema</span>
                                    <p className="font-semibold text-slate-900">{recipe.prep_time || recipe.preparation_time} min</p>
                                </div>
                                <div className="text-center p-2 border-l border-slate-200">
                                    <span className="block text-2xl mb-1">🔥</span>
                                    <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">Kuvanje</span>
                                    <p className="font-semibold text-slate-900">{recipe.cook_time || recipe.cooking_time} min</p>
                                </div>
                                <div className="text-center p-2 border-l border-slate-200">
                                    <span className="block text-2xl mb-1">👥</span>
                                    <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">Porcija</span>
                                    <p className="font-semibold text-slate-900">{recipe.servings}</p>
                                </div>
                                <div className="text-center p-2 border-l border-slate-200">
                                    <span className="block text-2xl mb-1">⭐</span>
                                    <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">Ocena</span>
                                    <p className="font-semibold text-slate-900">{average} / 5</p>
                                </div>
                            </div>

                            {/* Description */}
                            {recipe.description && (
                                <p className="text-slate-600 leading-relaxed mb-6">
                                    {recipe.description}
                                </p>
                            )}

                            {/* Video */}
                            {recipe.video_url && (
                                <div className="mb-6">
                                    <VideoPlayer url={recipe.video_url} />
                                </div>
                            )}

                            {/* Interaction Bar */}
                            <div className="flex flex-wrap gap-3">
                                <FavoriteButton
                                    recipeId={recipe.id}
                                    initialIsFavorite={recipeIsFavorite}
                                    isAuthenticated={!!user}
                                    className="flex-1"
                                />
                                <AddToPlanButton recipeId={recipe.id} />
                                <AddToCollectionButton recipeId={recipe.id} />
                            </div>
                        </div>

                        {/* Instructions */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center text-lg">👩‍🍳</span>
                                Priprema
                            </h2>
                            <div className="space-y-6">
                                {steps.map((step: any, index: number) => (
                                    <div key={step.id} className="group flex gap-4">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                            {step.step_number || index + 1}
                                        </div>
                                        <p className="text-slate-600 leading-relaxed pt-1">
                                            {step.instruction}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Comments System */}
                        <RecipeComments recipeId={recipe.id} initialComments={comments} user={user} />
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Ingredients Card */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 sticky top-24">
                            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center text-lg">🥦</span>
                                Sastojci
                            </h2>
                            <ul className="space-y-3">
                                {ingredients.map((ing: any) => (
                                    <li key={ing.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0 hover:bg-slate-50 px-2 rounded-lg transition-colors">
                                        <span className="text-slate-700">{ing.ingredient?.name || ing.name}</span>
                                        <span className="font-semibold text-slate-900 bg-slate-100 px-2 py-1 rounded-md text-sm">
                                            {ing.amount || ing.quantity} {ing.unit || ''}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Rating Card */}
                        <StarRating
                            recipeId={recipe.id}
                            initialAverage={average}
                            initialCount={count}
                            initialMyRating={myRating}
                            isAuthenticated={!!user}
                        />

                        {/* Admin Action */}
                        {user && user.id === recipe.user_id && (
                            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                                <h3 className="font-bold text-slate-900 mb-4">Upravljanje</h3>
                                <div className="space-y-2">
                                    <DeleteRecipeButton recipeId={recipe.id} />
                                </div>
                            </div>
                        )}
                        {user && userIsAdmin && (
                            <div className="bg-red-50 rounded-3xl p-6 shadow-sm border border-red-100">
                                <h3 className="font-bold text-red-900 mb-4">Admin Zona</h3>
                                <div className="space-y-2">
                                    <DeleteRecipeButton recipeId={recipe.id} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
