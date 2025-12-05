import { searchRecipes } from '@/app/recipes/actions'
import RecipeGrid from '@/components/RecipeGrid'
import { createClient } from '@/utils/supabase/server'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { Metadata } from 'next'

interface SearchParams {
    q?: string
}

export async function generateMetadata({
    searchParams
}: {
    searchParams: Promise<SearchParams>
}): Promise<Metadata> {
    const params = await searchParams
    const query = params.q || ''

    return {
        title: query ? `Rezultati za "${query}"` : 'Pretraga recepata',
        description: query
            ? `Pronađeni recepti za "${query}". Pretražite našu kolekciju recepata.`
            : 'Pretražite recepte po nazivu, sastojcima ili opisu.',
        robots: {
            index: false,
            follow: true
        }
    }
}

export default async function SearchResultsPage({
    searchParams
}: {
    searchParams: Promise<SearchParams>
}) {
    const params = await searchParams
    const query = params.q || ''
    const recipes = query ? await searchRecipes(query) : []

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let favoriteIds: string[] = []
    if (user) {
        const { data } = await supabase
            .from('favorite_recipes')
            .select('recipe_id')
            .eq('user_id', user.id)
        favoriteIds = data?.map((f: any) => f.recipe_id) || []
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
            <Navbar />

            <div className="container mx-auto px-6 py-12">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-slate-900 mb-2 heading-font">
                        Rezultati pretrage
                    </h1>
                    <p className="text-slate-600 text-lg">
                        {query && (
                            <>
                                Pronađeno <strong className="text-primary">{recipes.length}</strong> {recipes.length === 1 ? 'recept' : 'recepata'} za "<strong>{query}</strong>"
                            </>
                        )}
                        {!query && 'Unesite pojam za pretragu'}
                    </p>
                </div>

                {recipes.length > 0 ? (
                    <RecipeGrid
                        recipes={recipes}
                        favoriteIds={favoriteIds}
                        isAuthenticated={!!user}
                    />
                ) : query ? (
                    <div className="text-center py-20 glass-panel rounded-3xl">
                        <span className="text-6xl mb-4 block">🔍</span>
                        <p className="text-slate-600 text-xl font-medium mb-2">
                            Nema rezultata za "{query}"
                        </p>
                        <p className="text-slate-500 mb-6">
                            Pokušajte sa drugim pojmom ili pretražite recepte po sastojcima
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Link
                                href="/search"
                                className="px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary-dark transition-colors"
                            >
                                Pretraga po sastojcima
                            </Link>
                            <Link
                                href="/explore"
                                className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-full font-medium hover:border-primary/30 hover:text-primary transition-colors"
                            >
                                Istraži recepte
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20 glass-panel rounded-3xl">
                        <span className="text-6xl mb-4 block">👨‍🍳</span>
                        <p className="text-slate-600 text-xl font-medium mb-2">
                            Započnite pretragu
                        </p>
                        <p className="text-slate-500">
                            Koristite polje za pretragu iznad da pronađete svoje omiljene recepte
                        </p>
                    </div>
                )}
            </div>
        </main>
    )
}
