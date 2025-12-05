'use client'

import { useState } from 'react'
import { FiTrash2 } from 'react-icons/fi'
import { deleteCollection } from '@/app/collections/actions'
import { useRouter } from 'next/navigation'

export default function DeleteCollectionButton({ collectionId }: { collectionId: string }) {
    const [isConfirming, setIsConfirming] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const router = useRouter()

    const handleDelete = async () => {
        setIsDeleting(true)
        const result = await deleteCollection(collectionId)
        setIsDeleting(false)

        if (!result.error) {
            router.push('/collections')
        }
    }

    return (
        <>
            <button
                onClick={() => setIsConfirming(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
            >
                <FiTrash2 className="w-4 h-4" />
                Obriši
            </button>

            {isConfirming && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">
                            Obriši kolekciju?
                        </h2>
                        <p className="text-slate-600 mb-6">
                            Da li si siguran da želiš da obrišeš ovu kolekciju? Ova akcija se ne može poništiti.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all disabled:opacity-50"
                            >
                                {isDeleting ? 'Brisanje...' : 'Da, obriši'}
                            </button>
                            <button
                                onClick={() => setIsConfirming(false)}
                                className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors"
                            >
                                Otkaži
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
