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
import ChefHatIcon from '@/components/ChefHatIcon';
import ForkKnifeIcon from '@/components/ForkKnifeIcon';

// Icons for stats (styled inline to match custom icons)
import { LuClock, LuFlame, LuUsers, LuStar } from "react-icons/lu";

// Force dynamic rendering for authenticated features
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const recipe = await getRecipe(id);
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

export default async function RecipePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const recipe = await getRecipe(id);
    if (!recipe) {
        notFound();
    }

    const { average, count, myRating } = await getRecipeRating(recipe.id);
    const recipeIsFavorite = await isFavorite(recipe.id);
    const { comments } = await getRecipeComments(recipe.id);

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
        prepTime: `PT${recipe.preperation_time || recipe.prep_time}M`,
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

    const stepData = recipe.steps || recipe.recipe_steps || [];
    const steps = [...stepData].sort((a: any, b: any) => (a.step_number || 0) - (b.step_number || 0));
    // Normalize ingredients for the component
    const rawIngredients = recipe.ingredients || recipe.recipe_ingredients || [];
    const normalizedIngredients = rawIngredients.map((ing: any) => ({
        id: ing.id || Math.random().toString(), // Fallback ID if missing
        name: ing.ingredient?.name || ing.name,
        quantity: `${ing.amount || ing.quantity || ''} ${ing.unit || ''}`.trim()
    }));

    const recipeUrl = typeof window !== 'undefined' ? window.location.href : `https://kuvaj.me/recipes/${recipe.id}`;
    const userIsAdmin = user?.user_metadata?.is_admin === true;

    // Helper for styled stats icons
    const StatsIcon = ({ children }: { children: React.ReactNode }) => (
        <div className="w-10 h-10 rounded-full bg-[#6B7E4F] flex items-center justify-center text-white shadow-md mx-auto mb-2">
            {children}
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <Navbar />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(recipeSchema) }}
            />
            <RecipeAnalyticsLogger recipeId={recipe.id} title={recipe.title} />

            <main className="container mx-auto px-4 py-8 max-w-5xl">
                {/* Hero Section */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-8">
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
                        <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 font-serif">
                            {recipe.title}
                        </h1>
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <Link href={`/profile/${recipe.user_id}`} className="flex items-center gap-3 group">
                                <div className="relative">
                                    {recipe.profiles?.avatar_url ? (
                                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#6B7E4F]">
                                            <RecipeImage src={recipe.profiles.avatar_url} alt="Avatar" fill className="object-cover" />
                                        </div>
                                    ) : (
                                        <ChefHatIcon className="w-12 h-12" />
                                    )}
                                </div>
                                <div>
                                    <p className="text-base font-bold text-slate-900 group-hover:text-[#6B7E4F] transition-colors">
                                        {recipe.profiles?.display_name || 'Kuvaj.me Korisnik'}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        {new Date(recipe.created_at).toLocaleDateString('sr-RS')}
                                    </p>
                                </div>
                            </Link>

                            <div className="flex gap-2">
                                <PrintButton recipeId={recipe.id} />
                                <ShareButton
                                    recipeTitle={recipe.title}
                                    recipeDescription={recipe.description || ''}
                                    recipeUrl={recipeUrl}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-[#FDFBF7] rounded-2xl mb-8 border border-amber-100/50">
                        <div className="text-center">
                            <StatsIcon><LuClock size={20} /></StatsIcon>
                            <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">Priprema</span>
                            <p className="font-serif text-lg text-slate-900">{recipe.prep_time || recipe.preparation_time} min</p>
                        </div>
                        <div className="text-center relative after:hidden md:after:block after:absolute after:right-0 after:top-1/4 after:h-1/2 after:w-[1px] after:bg-slate-200">
                            <StatsIcon><LuFlame size={20} /></StatsIcon>
                            <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">Kuvanje</span>
                            <p className="font-serif text-lg text-slate-900">{recipe.cook_time || recipe.cooking_time} min</p>
                        </div>
                        <div className="text-center">
                            <StatsIcon><LuUsers size={20} /></StatsIcon>
                            <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">Porcija</span>
                            <p className="font-serif text-lg text-slate-900">{recipe.servings}</p>
                        </div>
                        <div className="text-center relative before:hidden md:before:block before:absolute before:left-0 before:top-1/4 before:h-1/2 before:w-[1px] before:bg-slate-200">
                            <StatsIcon><LuStar size={20} /></StatsIcon>
                            <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">Ocena</span>
                            <p className="font-serif text-lg text-slate-900">{average} / 5</p>
                        </div>
                    </div>

                    {/* Description */}
                    {recipe.description && (
                        <p className="text-slate-600 leading-relaxed text-lg mb-8 italic border-l-4 border-[#6B7E4F] pl-4">
                            {recipe.description}
                        </p>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3 mb-8">
                        <FavoriteButton
                            recipeId={recipe.id}
                            initialIsFavorite={recipeIsFavorite}
                            isAuthenticated={!!user}
                            className="flex-1 md:flex-none"
                        />
                        <AddToPlanButton recipeId={recipe.id} />
                        <AddToCollectionButton recipeId={recipe.id} />
                    </div>

                    {/* Video */}
                    {recipe.video_url && (
                        <div className="mb-8">
                            <VideoPlayer url={recipe.video_url} />
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[1fr,1.5fr] gap-8">
                    {/* Ingredients Column */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                            <RecipeIngredients
                                ingredients={normalizedIngredients}
                                isAuthenticated={!!user}
                            />
                        </div>

                        {/* Rating Component */}
                        <StarRating
                            recipeId={recipe.id}
                            initialAverage={average}
                            initialCount={count}
                            initialMyRating={myRating}
                            isAuthenticated={!!user}
                        />


                    </div>

                    {/* Instructions Column */}
                    <div className="space-y-8">
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                            <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3 font-serif">
                                <ForkKnifeIcon className="w-10 h-10" />
                                Priprema
                            </h2>
                            <div className="space-y-8">
                                {steps.map((step: any, index: number) => (
                                    <div key={step.id} className="group flex gap-5">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#FDFBF7] border border-amber-100 text-[#6B7E4F] font-bold font-serif text-lg flex items-center justify-center shadow-sm group-hover:bg-[#6B7E4F] group-hover:text-white transition-all duration-300">
                                            {index + 1}
                                        </div>
                                        <p className="text-slate-700 leading-relaxed pt-1.5 text-lg">
                                            {step.instruction.replace(/^\(\d+\)\s*/, '').replace(/^\d+\.\s*/, '')}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Admin/User Actions */}
                        {(user?.id === recipe.user_id || userIsAdmin) && (
                            <div className="flex justify-end mt-4">
                                <DeleteRecipeButton recipeId={recipe.id} />
                            </div>
                        )}

                        {/* Comments */}
                        <RecipeComments recipeId={recipe.id} initialComments={comments} user={user} />
                    </div>
                </div>
            </main>
        </div>
    );
}
