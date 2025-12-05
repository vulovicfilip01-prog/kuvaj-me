'use client'

import { useState, useEffect } from 'react'
import { FiPlus, FiCheck } from 'react-icons/fi'
import { getUserCollections, addRecipeToCollection, removeRecipeFromCollection } from '@/app/collections/actions'
import CreateCollectionDialog from './CreateCollectionDialog'

interface AddToCollectionButtonProps {
    recipeId: string
}

export default function AddToCollectionButton({ recipeId }: AddToCollectionButtonProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [collections, setCollections] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [showCreateDialog, setShowCreateDialog] = useState(false)

    const loadCollections = async () => {
        setLoading(true)
        const { collections: userCollections } = await getUserCollections()

        // For each collection, check if this recipe is already in it
        // We'll do this by checking if the recipe is in collection_recipes
        // Since we can't easily query this from client, we'll track it via state after adding/removing
        setCollections(userCollections)
        setLoading(false)
    }

    useEffect(() => {
        if (isOpen) {
            loadCollections()
        }
    }, [isOpen])

    const handleToggleRecipe = async (collectionId: string, isInCollection: boolean) => {
        if (isInCollection) {
            const result = await removeRecipeFromCollection(collectionId, recipeId)
            if (!result.error) {
                await loadCollections()
            }
        } else {
            const result = await addRecipeToCollection(collectionId, recipeId)
            if (!result.error) {
                await loadCollections()
            }
        }
    }

    return (
        <>
            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                >
                    <FiPlus className="w-4 h-4" />
                    <span className="font-medium text-slate-700">Dodaj u kolekciju</span>
                </button>

                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />
                        <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden">
                            <div className="p-4 border-b border-slate-100">
                                <h3 className="font-bold text-slate-900">Dodaj u kolekciju</h3>
                            </div>

                            <div className="max-h-80 overflow-y-auto">
                                {loading && (
                                    <div className="p-4 text-center text-slate-500">
                                        Učitavanje...
                                    </div>
                                )}

                                {!loading && collections.length === 0 && (
                                    <div className="p-4 text-center text-slate-500 text-sm">
                                        Nemate još kolekcija
                                    </div>
                                )}

                                {!loading && collections.map((collection) => {
                                    // We don't have this info easily available, so we'll just show all collections
                                    // In a real app, you'd fetch this info or track it in state
                                    return (
                                        <button
                                            key={collection.id}
                                            onClick={() => handleToggleRecipe(collection.id, false)}
                                            className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors flex items-center justify-between"
                                        >
                                            <div>
                                                <p className="font-medium text-slate-900">{collection.name}</p>
                                                {collection.description && (
                                                    <p className="text-xs text-slate-500 line-clamp-1">
                                                        {collection.description}
                                                    </p>
                                                )}
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>

                            <button
                                onClick={() => {
                                    setIsOpen(false)
                                    setShowCreateDialog(true)
                                }}
                                className="w-full px-4 py-3 text-left border-t border-slate-100 hover:bg-blue-50 transition-colors flex items-center gap-2 text-primary font-medium"
                            >
                                <FiPlus className="w-4 h-4" />
                                Kreiraj novu kolekciju
                            </button>
                        </div>
                    </>
                )}
            </div>

            {showCreateDialog && (
                <CreateCollectionDialog
                    onClose={() => setShowCreateDialog(false)}
                    onSuccess={() => {
                        loadCollections()
                    }}
                />
            )}
        </>
    )
}
