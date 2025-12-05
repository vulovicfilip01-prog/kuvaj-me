import Navbar from '@/components/Navbar'

export default function Loading() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
            <Navbar />

            <div className="container mx-auto px-6 py-8 animate-pulse">
                {/* Back Button Skeleton */}
                <div className="h-10 w-32 bg-slate-200 rounded-full mb-8" />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left Column - Image & Quick Stats */}
                    <div>
                        {/* Image Skeleton */}
                        <div className="aspect-[4/3] bg-slate-200 rounded-3xl mb-8" />

                        {/* Stats Grid Skeleton */}
                        <div className="grid grid-cols-2 gap-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="h-24 bg-slate-200 rounded-2xl" />
                            ))}
                        </div>
                    </div>

                    {/* Right Column - Details */}
                    <div>
                        {/* Title & Author Skeleton */}
                        <div className="h-12 bg-slate-200 rounded-xl w-3/4 mb-4" />
                        <div className="h-6 bg-slate-200 rounded-xl w-1/2 mb-8" />

                        {/* Description Skeleton */}
                        <div className="space-y-3 mb-8">
                            <div className="h-4 bg-slate-200 rounded w-full" />
                            <div className="h-4 bg-slate-200 rounded w-full" />
                            <div className="h-4 bg-slate-200 rounded w-2/3" />
                        </div>

                        {/* Ingredients Skeleton */}
                        <div className="mb-8">
                            <div className="h-8 bg-slate-200 rounded w-48 mb-4" />
                            <div className="space-y-3">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="h-12 bg-slate-200 rounded-xl" />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
