export default function RecipeCardSkeleton() {
    return (
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 h-full flex flex-col animate-pulse">
            {/* Image Placeholder */}
            <div className="relative aspect-[4/3] bg-slate-200" />

            {/* Content */}
            <div className="p-5 flex flex-col flex-1">
                {/* Title */}
                <div className="h-7 bg-slate-200 rounded-md w-3/4 mb-2" />

                {/* Description */}
                <div className="h-4 bg-slate-200 rounded-md w-full mb-2" />
                <div className="h-4 bg-slate-200 rounded-md w-2/3 mb-4" />

                {/* Meta Info (Time, Difficulty) */}
                <div className="flex gap-4 mt-auto">
                    <div className="h-4 bg-slate-200 rounded-md w-16" />
                    <div className="h-4 bg-slate-200 rounded-md w-16" />
                </div>
            </div>
        </div>
    )
}
