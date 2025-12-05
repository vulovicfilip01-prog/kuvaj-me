import Link from 'next/link'
import { FiLock, FiGlobe } from 'react-icons/fi'

interface CollectionCardProps {
    collection: {
        id: string
        name: string
        description: string | null
        is_public: boolean
        user_id: string
        collection_recipes?: { count: number }[] | any
        profiles?: {
            display_name: string | null
            avatar_url: string | null
        }
    }
    recipeCount?: number
    showAuthor?: boolean
}

export default function CollectionCard({ collection, recipeCount, showAuthor = false }: CollectionCardProps) {
    // Calculate recipe count from collection_recipes if available
    const count = recipeCount ?? (Array.isArray(collection.collection_recipes)
        ? collection.collection_recipes.length
        : collection.collection_recipes?.[0]?.count ?? 0)

    return (
        <Link href={`/collections/${collection.id}`}>
            <div className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-primary/30">
                <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-2">
                        {collection.name}
                    </h3>
                    <div className={`flex-shrink-0 ml-2 ${collection.is_public ? 'text-green-600' : 'text-slate-400'}`}>
                        {collection.is_public ? (
                            <FiGlobe className="w-5 h-5" title="Javna kolekcija" />
                        ) : (
                            <FiLock className="w-5 h-5" title="Privatna kolekcija" />
                        )}
                    </div>
                </div>

                {collection.description && (
                    <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                        {collection.description}
                    </p>
                )}

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                    <div className="text-sm text-slate-500">
                        <span className="font-semibold text-slate-900">{count}</span>{' '}
                        {count === 1 ? 'recept' : count < 5 ? 'recepta' : 'recepata'}
                    </div>

                    {showAuthor && collection.profiles?.display_name && (
                        <div className="text-sm text-slate-500">
                            {collection.profiles.display_name}
                        </div>
                    )}
                </div>
            </div>
        </Link>
    )
}
