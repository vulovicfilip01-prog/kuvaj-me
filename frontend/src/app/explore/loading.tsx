export default function ExploreLoading() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
            <div className="container mx-auto px-6 py-12">
                <div className="flex flex-col md:flex-row gap-12">
                    {/* Sidebar Skeleton */}
                    <aside className="w-full md:w-64 flex-shrink-0">
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 h-[600px] animate-pulse" />
                    </aside>

                    {/* Main Content Skeleton */}
                    <div className="flex-1">
                        <div className="mb-8 space-y-4">
                            <div className="h-10 w-64 bg-slate-200 rounded-lg animate-pulse" />
                            <div className="h-4 w-48 bg-slate-100 rounded-lg animate-pulse" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="bg-white rounded-2xl h-80 shadow-sm border border-slate-100 animate-pulse" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
