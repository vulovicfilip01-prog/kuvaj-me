import { createClient } from '@/utils/supabase/server'
import RecipeGrid from '@/components/RecipeGrid'
import RecipeFilter from '@/components/RecipeFilter'
import Navbar from '@/components/Navbar'
import { getCategories } from '../recipes/actions'
import { LuCookingPot } from 'react-icons/lu'

import { Metadata } from 'next'

interface ExplorePageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ searchParams }: ExplorePageProps): Promise<Metadata> {
    const params = await searchParams
    const category = params.category as string
    const difficulty = params.difficulty as string

    let title = 'Istraži recepte'
    let description = 'Pronađite savršen recept za svaku priliku.'

    if (category) {
        // We would ideally fetch category name here, but for now using ID is better than nothing
        // or we can map common IDs if we had them. 
        // Since we don't have easy access to category name without fetching, 
        // we'll keep it generic or try to format the ID if it's readable.
        title = `Recepti u kategoriji ${category}`
        description = `Najbolji recepti u kategoriji ${category} na Kuvaj.me.`
    }

    if (difficulty) {
        const difficultyMap: Record<string, string> = {
            'easy': 'Lako',
            'medium': 'Srednje',
            'hard': 'Teško'
        }
        const diffName = difficultyMap[difficulty] || difficulty
        title = `${title} - ${diffName}`
        description = `${description} Težina pripreme: ${diffName}.`
    }

    return {
        title: `${title} | Kuvaj.me`,
        description,
        openGraph: {
            title: `${title} | Kuvaj.me`,
            description,
            type: 'website',
        }
    }
}

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const { data: categories } = await getCategories()

    const params = await searchParams
    const category = params.category as string
    const difficulty = params.difficulty as string
    const time = params.time as string
    const sort = params.sort as string || 'newest'

    // Build query
    let query = supabase
        .from('recipes')
        .select(`
            *,
            profiles (display_name),
            categories (name),
            favorite_recipes (count)
        `)
        .eq('is_public', true)

    if (category) {
        query = query.eq('category_id', category)
    }

    if (difficulty) {
        query = query.eq('difficulty', difficulty)
    }

    if (time) {
        if (time === '30') {
            // < 30 min (prep + cook)
            // Note: This is complex in simple query, for MVP we might filter in memory or use a simpler approximation
            // For now, let's just filter by prep_time + cook_time < 30 if possible, but Supabase doesn't support computed columns in filter easily without view.
            // We'll fetch and filter in memory for time to avoid complex SQL for MVP.
        }
    }

    // Sorting
    if (sort === 'newest') {
        query = query.order('created_at', { ascending: false })
    } else if (sort === 'fastest') {
        query = query.order('cook_time', { ascending: true })
    }
    // For 'popular', we need to sort by favorite count, which we'll do in memory

    const { data: rawRecipes, error } = await query

    if (error) {
        console.error('Error fetching explore recipes:', error)
    }

    let recipes = rawRecipes || []

    // In-memory filtering/sorting for complex cases
    if (time) {
        recipes = recipes.filter((r: any) => {
            const totalTime = (r.prep_time || 0) + (r.cook_time || 0)
            if (time === '30') return totalTime <= 30
            if (time === '60') return totalTime <= 60
            if (time === '60+') return totalTime > 60
            return true
        })
    }

    if (sort === 'popular') {
        recipes = recipes.map((r: any) => ({
            ...r,
            favorites_count: r.favorite_recipes?.[0]?.count || 0
        })).sort((a: any, b: any) => b.favorites_count - a.favorites_count)
    }

    // Get user favorites
    let favoriteIds: string[] = []
    if (user) {
        const { data: favorites } = await supabase
            .from('favorite_recipes')
            .select('recipe_id')
            .eq('user_id', user.id)
        favoriteIds = favorites?.map(f => f.recipe_id) || []
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
            <Navbar />

            <div className="container mx-auto px-6 py-12">
                <div className="flex flex-col md:flex-row gap-12">
                    {/* Sidebar Filters */}
                    <aside className="w-full md:w-64 flex-shrink-0">
                        <RecipeFilter categories={categories || []} />
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        <div className="mb-8">
                            <h1 className="text-4xl font-bold heading-font text-slate-900 mb-2 flex items-center gap-3">
                                <LuCookingPot className="text-primary" /> Istraži recepte
                            </h1>
                            <p className="text-slate-600">
                                Pronađeno {recipes.length} recepata prema vašim kriterijumima
                            </p>
                        </div>

                        <RecipeGrid
                            recipes={recipes}
                            favoriteIds={favoriteIds}
                            isAuthenticated={!!user}
                        />
                    </div>
                </div>
            </div>
        </main>
    )
}
