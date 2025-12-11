import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next/';
import { getRecipe, isFavorite } from '../actions';
import { getRecipeReviews, getUserReview } from '../review-actions';
import { getRecipeComments } from '../comment-actions';
import { createClient } from '@/utils/supabase/server';
import FavoriteButton from '@/components/FavoriteButton';
import RecipePlaceholder from '@/components/RecipePlaceholder';
import RecipeImage from '@/components/RecipeImage';
import DeleteRecipeButton from '@/components/DeleteRecipeButton';
import ReviewsList from '@/components/ReviewsList';
import StarRating from '@/components/StarRating';
import ShareButton from '@/components/ShareButton';
import AddToCollectionButton from '@/components/AddToCollectionButton';
import CommentsSection from '@/components/CommentsSection';
import NutritionDisplay from '@/components/NutritionDisplay';
import PrintRecipeButton from '@/components/PrintRecipeButton';
import RecipeIngredients from '@/components/RecipeIngredients';
import { LuClock, LuFlame, LuNotepadText } from 'react-icons/lu';
import { ImSpoonKnife } from 'react-icons/im';
import VideoPlayer from '@/components/VideoPlayer';


interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const recipe = await getRecipe(id);

    if (!recipe) {
        return {
            title: 'Recept nije pronađen',
        };
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const recipeUrl = `${baseUrl}/recipes/${id}`;

    return {
        title: `${recipe.title} - Kuvaj.me`,
        description: recipe.description || `Otkrijte recept za ${recipe.title} na Kuvaj.me`,
        openGraph: {
            title: recipe.title,
            description: recipe.description || `Otkrijte recept za ${recipe.title}`,
            url: recipeUrl,
            siteName: 'Kuvaj.me',
            images: recipe.image_url ? [
                {
                    url: recipe.image_url,
                    width: 1200,
                    height: 630,
                    alt: recipe.title,
                }
            ] : [],
            locale: 'sr_RS',
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title: recipe.title,
            description: recipe.description || `Otkrijte recept za ${recipe.title}`,
            images: recipe.image_url ? [recipe.image_url] : [],
        },
    };
}

export default async function RecipeDetailPage({ params }: PageProps) {
    const { id } = await params;
    const recipe = await getRecipe(id);

    if (!recipe) {
        notFound();
    }

    // Check auth and favorite status
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const recipeIsFavorite = user ? await isFavorite(id) : false;

    // Fetch reviews
    const reviews = await getRecipeReviews(id);
    const userReview = user ? await getUserReview(id) : null;

    // Fetch comments
    const { comments } = await getRecipeComments(id);

    // Recipe URL for sharing
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const recipeUrl = `${baseUrl}/recipes/${id}`;

    // Recipe Schema for SEO
    const recipeSchema = {
        '@context': 'https://schema.org',
        '@type': 'Recipe',
        name: recipe.title,
        description: recipe.description,
        image: recipe.image_url || `${baseUrl}/og-image.png`,
        author: {
            '@type': 'Person',
            name: recipe.profiles?.display_name || 'Kuvaj.me User'
        },
        datePublished: recipe.created_at,
        prepTime: `PT${recipe.prep_time || 0}M`,
        cookTime: `PT${recipe.cook_time || 0}M`,
        totalTime: `PT${(recipe.prep_time || 0) + (recipe.cook_time || 0)}M`,
        recipeYield: `${recipe.servings || 1} ${recipe.servings === 1 ? 'porcija' : 'porcije'}`,
        recipeCategory: recipe.categories?.name,
        recipeCuisine: 'Srpska',
        keywords: recipe.categories?.name,
        recipeIngredient: recipe.ingredients?.map((i: any) => `${i.quantity} ${i.name}`) || [],
        recipeInstructions: recipe.steps?.map((s: any, idx: number) => ({
            '@type': 'HowToStep',
            position: idx + 1,
            text: s.instruction
        })) || [],
        ...(recipe.avg_rating && {
            aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: recipe.avg_rating,
                reviewCount: recipe.review_count || 0
            }
        }),
        ...(recipe.calories && {
            nutrition: {
                '@type': 'NutritionInformation',
                calories: `${recipe.calories} cal`,
                ...(recipe.protein && { proteinContent: `${recipe.protein}g` }),
                ...(recipe.carbohydrates && { carbohydrateContent: `${recipe.carbohydrates}g` }),
                ...(recipe.fat && { fatContent: `${recipe.fat}g` }),
                ...(recipe.fiber && { fiberContent: `${recipe.fiber}g` })
            }
        })
    };

    return (
        <main className="min-h-screen bg-transparent text-slate-900">
            {/* Recipe Schema JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(recipeSchema) }}
            />
            {/* Hero Section with Image */}
            <div className="relative h-[60vh] w-full overflow-hidden">
                {recipe.image_url ? (
                    <RecipeImage
                        src={recipe.image_url}
                        alt={recipe.title}
                        fill
                        className="object-cover"
                        priority
                    >
                        {/* Gradient Overlays */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-transparent to-slate-900/80"></div>
                    </RecipeImage>
                ) : (
                    <RecipePlaceholder iconSize="w-32 h-32" />
                )}

                {/* Navigation */}
                <div className="absolute top-0 left-0 right-0 p-6">
                    <div className="container mx-auto flex justify-between items-center">
                        <Link href="/" className="px-4 py-2 bg-primary/90 text-white rounded-xl inline-flex items-center gap-2 hover:bg-primary transition-all border border-primary/50 shadow-lg backdrop-blur-md">
                            ← Nazad
                        </Link>

                        <div className="flex items-center gap-3 z-20">
                            {/* Owner Actions */}
                            {user && user.id === recipe.user_id && (
                                <>
                                    <Link
                                        href={`/recipes/${recipe.id}/edit`}
                                        className="px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all border border-white/20 font-medium backdrop-blur-md"
                                    >
                                        ✏️ Izmeni
                                    </Link>
                                    <DeleteRecipeButton recipeId={recipe.id} />
                                </>
                            )}

                            {/* Favorite Button */}
                            <FavoriteButton
                                recipeId={recipe.id}
                                initialIsFavorite={recipeIsFavorite}
                                isAuthenticated={!!user}
                                size="lg"
                            />

                            {/* Add to Collection Button */}
                            {user && (
                                <AddToCollectionButton recipeId={recipe.id} />
                            )}

                            {/* Share Button */}
                            <ShareButton
                                recipeTitle={recipe.title}
                                recipeDescription={recipe.description || ''}
                                recipeUrl={recipeUrl}
                            />

                            {/* Print Button */}
                            <PrintRecipeButton />
                        </div>
                    </div>
                </div>

                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="container mx-auto">
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                            <span className="px-4 py-2 bg-primary/90 text-white rounded-full text-sm font-bold shadow-lg backdrop-blur-md border border-primary/50">
                                {recipe.categories?.name}
                            </span>
                            <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg backdrop-blur-md border ${recipe.difficulty === 'lako' ? 'bg-green-500/90 border-green-400/50 text-white' :
                                recipe.difficulty === 'srednje' ? 'bg-yellow-500/90 border-yellow-400/50 text-black' :
                                    'bg-red-500/90 border-red-400/50 text-white'
                                }`}>
                                {recipe.difficulty === 'lako' ? '🟢 Lako' : recipe.difficulty === 'srednje' ? '🟡 Srednje' : '🔴 Teško'}
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold mb-3 heading-font text-gradient">{recipe.title}</h1>
                        <p className="text-slate-200 text-xl max-w-3xl">{recipe.description}</p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-10">

                        {/* Stats Bar */}
                        <div className="grid grid-cols-3 gap-6 glass-panel rounded-3xl p-8 animate-fadeIn">
                            <div className="flex flex-col items-center justify-center text-center group hover:scale-105 transition-transform duration-300">
                                <div className="p-4 bg-primary/10 text-primary rounded-full mb-3 shadow-sm group-hover:shadow-md transition-all">
                                    <LuClock className="w-8 h-8" />
                                </div>
                                <span className="block text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Priprema</span>
                                <span className="text-xl md:text-2xl font-black text-slate-900 heading-font">{recipe.prep_time} min</span>
                            </div>
                            <div className="flex flex-col items-center justify-center text-center border-x border-slate-200/60 group hover:scale-105 transition-transform duration-300">
                                <div className="p-4 bg-primary/10 text-primary rounded-full mb-3 shadow-sm group-hover:shadow-md transition-all">
                                    <LuFlame className="w-8 h-8" />
                                </div>
                                <span className="block text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Kuvanje</span>
                                <span className="text-xl md:text-2xl font-black text-slate-900 heading-font">{recipe.cook_time} min</span>
                            </div>
                            <div className="flex flex-col items-center justify-center text-center group hover:scale-105 transition-transform duration-300">
                                <div className="p-4 bg-primary/10 text-primary rounded-full mb-3 shadow-sm group-hover:shadow-md transition-all">
                                    <ImSpoonKnife className="w-8 h-8" />
                                </div>
                                <span className="block text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Porcije</span>
                                <span className="text-xl md:text-2xl font-black text-slate-900 heading-font">{recipe.servings}</span>
                            </div>
                        </div>

                        {/* Video Player */}
                        {recipe.video_url && (
                            <section className="animate-fadeIn">
                                <h2 className="text-2xl font-bold mb-6 heading-font flex items-center gap-2">
                                    <span className="text-primary">🎬</span> Video Recept
                                </h2>
                                <VideoPlayer url={recipe.video_url} />
                            </section>
                        )}

                        {/* Ingredients - Grid with Checkboxes */}

                        <RecipeIngredients
                            ingredients={recipe.ingredients}
                            isAuthenticated={!!user}
                        />

                        {/* Steps - Large Numbered */}
                        <section>
                            <h2 className="text-3xl font-bold mb-8 heading-font flex items-center gap-3">
                                <span className="p-3 bg-primary/10 text-primary rounded-full shadow-sm">
                                    <LuNotepadText className="w-8 h-8" />
                                </span>
                                Priprema
                            </h2>
                            <div className="space-y-8">
                                {recipe.steps?.map((step: any, index: number) => (
                                    <div key={step.id} className="flex gap-6 group">
                                        <div className="flex-shrink-0">
                                            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
                                                {index + 1}
                                            </div>
                                        </div>
                                        <div className="flex-1 glass-panel rounded-2xl p-6 group-hover:border-primary/50 transition-all">
                                            <p className="text-slate-700 text-lg leading-relaxed">{step.instruction}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="glass-panel rounded-3xl p-8 sticky top-6 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                            <h3 className="text-xl font-bold mb-6 heading-font">O Autoru</h3>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                                    {recipe.profiles?.display_name?.[0]?.toUpperCase() || 'C'}
                                </div>
                                <div>
                                    <p className="font-bold text-lg">{recipe.profiles?.display_name || 'Kuvaj.me Chef'}</p>
                                    <p className="text-sm text-slate-600">Majstor kuhinje 👨‍🍳</p>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-200">
                                <p className="text-sm text-slate-600 mb-4">Ukupno vreme:</p>
                                <p className="text-3xl font-bold text-primary">
                                    {recipe.prep_time + recipe.cook_time} <span className="text-lg text-slate-600">minuta</span>
                                </p>
                            </div>
                        </div>

                        {/* Nutrition Display */}
                        <NutritionDisplay
                            calories={recipe.calories}
                            protein={recipe.protein}
                            carbohydrates={recipe.carbohydrates}
                            fat={recipe.fat}
                            fiber={recipe.fiber}
                        />
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="container mx-auto px-6 pb-12 mt-16">
                    <ReviewsList
                        recipeId={recipe.id}
                        currentUserId={user?.id || null}
                        initialReviews={reviews}
                        initialUserReview={userReview}
                    />

                    {/* Comments Section */}
                    <div className="mt-16">
                        <CommentsSection
                            recipeId={recipe.id}
                            currentUserId={user?.id || null}
                            initialComments={comments}
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}
