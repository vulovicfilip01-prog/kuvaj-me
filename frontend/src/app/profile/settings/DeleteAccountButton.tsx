'use client'

import { useState } from 'react'
import { FiTrash2, FiLoader, FiAlertTriangle } from 'react-icons/fi'
import { deleteAccount } from './actions'
import { useRouter } from 'next/navigation'

export default function DeleteAccountButton() {
    const [status, setStatus] = useState<'idle' | 'confirming' | 'deleting'>('idle')
    const router = useRouter()

    const handleDelete = async () => {
        setStatus('deleting')
        try {
            const result = await deleteAccount()

            if (result.error) {
                alert(`Greška: ${result.error}`)
                setStatus('idle')
            } else {
                // Redirect to home
                window.location.href = '/'
            }
        } catch (error) {
            console.error('Delete error:', error)
            alert('Neočekivana greška.')
            setStatus('idle')
        }
    }

    if (status === 'deleting') {
        return (
            <button disabled className="mt-4 px-6 py-3 bg-red-100 text-red-400 rounded-xl font-bold flex items-center gap-2 cursor-not-allowed w-full justify-center">
                <FiLoader className="animate-spin" /> Brišem nalog...
            </button>
        )
    }

    if (status === 'confirming') {
        return (
            <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl animate-fadeIn">
                <h4 className="text-red-700 font-bold mb-2 flex items-center gap-2">
                    <FiAlertTriangle /> Da li ste sigurni?
                </h4>
                <p className="text-red-600 text-sm mb-4">
                    Ova akcija je trajna. Svi vaši recepti, kolekcije i podaci biće obrisani.
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={handleDelete}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors"
                    >
                        Da, obriši sve
                    </button>
                    <button
                        onClick={() => setStatus('idle')}
                        className="flex-1 px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-lg font-bold hover:bg-slate-50 transition-colors"
                    >
                        Otkaži
                    </button>
                </div>
            </div>
        )
    }

    return (
        <button
            onClick={() => setStatus('confirming')}
            className="mt-4 px-6 py-3 bg-red-50 text-red-600 border border-red-100 rounded-xl font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-2 w-full"
        >
            <FiTrash2 /> Obriši moj nalog
        </button>
    )
}
