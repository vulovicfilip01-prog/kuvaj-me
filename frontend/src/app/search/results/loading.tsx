import Navbar from '@/components/Navbar'
import RecipeCardSkeleton from '@/components/skeletons/RecipeCardSkeleton'

export default function Loading() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
            <Navbar />
            <div className="container mx-auto px-6 py-12">
                <div className="mb-8">
                    {/* Title Skeleton */}
                    <div className="h-10 bg-slate-200 rounded-lg w-64 mb-4 animate-pulse" />
                    {/* Subtitle Skeleton */}
                    <div className="h-6 bg-slate-200 rounded-lg w-96 animate-pulse" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...Array(6)].map((_, i) => (
                        <RecipeCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        </main>
    )
}
