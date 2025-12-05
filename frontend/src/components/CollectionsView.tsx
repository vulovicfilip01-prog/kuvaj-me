'use client'

import { useState, useEffect } from 'react'
import { getUserCollections, getPublicCollections } from '@/app/collections/actions'
import CollectionCard from '@/components/CollectionCard'
import CreateCollectionDialog from '@/components/CreateCollectionDialog'
import { FiPlus } from 'react-icons/fi'

export default function CollectionsView() {
    const [activeTab, setActiveTab] = useState<'my' | 'public'>('my')
    const [myCollections, setMyCollections] = useState<any[]>([])
    const [publicCollections, setPublicCollections] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [showCreateDialog, setShowCreateDialog] = useState(false)

    const loadCollections = async () => {
        setLoading(true)

        if (activeTab === 'my') {
            const { collections } = await getUserCollections()
            setMyCollections(collections || [])
        } else {
            const { collections } = await getPublicCollections()
            setPublicCollections(collections || [])
        }

        setLoading(false)
    }

    useEffect(() => {
        loadCollections()
    }, [activeTab])

    const currentCollections = activeTab === 'my' ? myCollections : publicCollections

    return (
        <div className="container mx-auto px-4 py-12">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold heading-font text-slate-900 mb-2">
                    📚 Kolekcije
                </h1>
                <p className="text-slate-600">
                    Organizuj recepte u kolekcije koje možeš podeliti sa drugima
                </p>
            </div>

            {/* Tabs + Create Button */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex gap-2 bg-white p-1 rounded-xl shadow-sm">
                    <button
                        onClick={() => setActiveTab('my')}
                        className={`px-6 py-2 rounded-lg font-medium transition-all ${activeTab === 'my'
                            ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-md'
                            : 'text-slate-600 hover:text-slate-900'
                            }`}
                    >
                        Moje kolekcije
                    </button>
                    <button
                        onClick={() => setActiveTab('public')}
                        className={` px-6 py-2 rounded-lg font-medium transition-all ${activeTab === 'public'
                            ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-md'
                            : 'text-slate-600 hover:text-slate-900'
                            }`}
                    >
                        Javne kolekcije
                    </button>
                </div>

                {activeTab === 'my' && (
                    <button
                        onClick={() => setShowCreateDialog(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-bold hover:shadow-lg transition-all"
                    >
                        <FiPlus className="w-5 h-5" />
                        Nova kolekcija
                    </button>
                )}
            </div>

            {/* Collections Grid */}
            {loading ? (
                <div className="text-center py-20">
                    <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-500 mt-4">Učitavanje kolekcija...</p>
                </div>
            ) : currentCollections.length === 0 ? (
                <div className="text-center py-20">
                    <div className="text-6xl mb-4">📚</div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                        {activeTab === 'my' ? 'Nemaš još kolekcija' : 'Nema javnih kolekcija'}
                    </h3>
                    <p className="text-slate-600 mb-6">
                        {activeTab === 'my'
                            ? 'Kreiraj svoju prvu kolekciju da organizuješ recepte'
                            : 'Budi prvi koji će podeliti svoju kolekciju!'}
                    </p>
                    {activeTab === 'my' && (
                        <button
                            onClick={() => setShowCreateDialog(true)}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-bold hover:shadow-lg transition-all"
                        >
                            <FiPlus className="w-5 h-5" />
                            Kreiraj kolekciju
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentCollections.map((collection) => (
                        <CollectionCard
                            key={collection.id}
                            collection={collection}
                            showAuthor={activeTab === 'public'}
                        />
                    ))}
                </div>
            )}

            {showCreateDialog && (
                <CreateCollectionDialog
                    onClose={() => setShowCreateDialog(false)}
                    onSuccess={() => {
                        loadCollections()
                    }}
                />
            )}
        </div>
    )
}
