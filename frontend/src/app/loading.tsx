import Navbar from '@/components/Navbar'
import RecipeCardSkeleton from '@/components/skeletons/RecipeCardSkeleton'

export default function Loading() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
            <Navbar />
            <div className="container mx-auto px-6 py-12">
                {/* Hero Skeleton */}
                <div className="h-64 md:h-96 bg-slate-200/50 rounded-3xl mb-12 animate-pulse" />

                {/* Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...Array(6)].map((_, i) => (
                        <RecipeCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        </main>
    )
}
