import { getCollectionWithRecipes } from '../actions'
import { notFound, redirect } from 'next/navigation'
import RecipeGrid from '@/components/RecipeGrid'
import { FiLock, FiGlobe, FiEdit2, FiTrash2, FiShare2 } from 'react-icons/fi'
import EditCollectionButton from '@/components/EditCollectionButton'
import DeleteCollectionButton from '@/components/DeleteCollectionButton'
import { createClient } from '@/utils/supabase/server'

export default async function CollectionDetailPage({ params }: { params: { id: string } }) {
    const { collection, recipes, error } = await getCollectionWithRecipes(params.id)

    if (error || !collection) {
        notFound()
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const isOwner = user?.id === collection.user_id

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
            <div className="container mx-auto px-4 py-12">
                {/* Header */}
                <div className="bg-white rounded-3xl p-8 shadow-lg mb-8">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-4xl font-bold heading-font text-slate-900">
                                    {collection.name}
                                </h1>
                                <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${collection.is_public
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-slate-100 text-slate-600'
                                    }`}>
                                    {collection.is_public ? (
                                        <>
                                            <FiGlobe className="w-4 h-4" />
                                            Javna
                                        </>
                                    ) : (
                                        <>
                                            <FiLock className="w-4 h-4" />
                                            Privatna
                                        </>
                                    )}
                                </div>
                            </div>

                            {collection.description && (
                                <p className="text-slate-600 text-lg mb-4">
                                    {collection.description}
                                </p>
                            )}

                            <div className="flex items-center gap-4 text-sm text-slate-500">
                                {collection.profiles?.display_name && (
                                    <div>
                                        Autor: <span className="font-medium text-slate-900">
                                            {collection.profiles.display_name}
                                        </span>
                                    </div>
                                )}
                                <div>
                                    <span className="font-medium text-slate-900">{recipes.length}</span>{' '}
                                    {recipes.length === 1 ? 'recept' : recipes.length < 5 ? 'recepta' : 'recepata'}
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        {isOwner && (
                            <div className="flex items-center gap-2">
                                <EditCollectionButton collection={collection} />
                                <DeleteCollectionButton collectionId={collection.id} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Recipes Grid */}
                {recipes.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🍽️</div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">
                            Nema još recepata u kolekciji
                        </h3>
                        <p className="text-slate-600">
                            {isOwner
                                ? 'Dodaj recepte u ovu kolekciju sa stranica recepata'
                                : 'Vlasnik još nije dodao recepte'}
                        </p>
                    </div>
                ) : (
                    <RecipeGrid recipes={recipes} />
                )}
            </div>
        </div>
    )
}
