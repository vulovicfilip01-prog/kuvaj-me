'use client'

import { useState } from 'react'
import { FiTrash2, FiLoader, FiCheck, FiX } from 'react-icons/fi'
import { deleteRecipeAsAdmin } from '@/app/admin/actions'

interface AdminDeleteRecipeButtonProps {
    recipeId: string
}

export default function AdminDeleteRecipeButton({ recipeId }: AdminDeleteRecipeButtonProps) {
    const [status, setStatus] = useState<'idle' | 'confirming' | 'deleting'>('idle')

    const handleDelete = async () => {
        setStatus('deleting')
        try {
            const result = await deleteRecipeAsAdmin(recipeId)

            if (!result.success) {
                alert(`Greška prilikom brisanja: ${result.error}`)
                setStatus('idle')
            }
        } catch (error) {
            console.error('Delete error:', error)
            alert('Došlo je do neočekivane greške.')
            setStatus('idle')
        }
    }

    if (status === 'deleting') {
        return (
            <div className="p-2 text-slate-400">
                <FiLoader className="animate-spin w-5 h-5" />
            </div>
        )
    }

    if (status === 'confirming') {
        return (
            <div className="flex items-center gap-1 bg-red-50 rounded-lg p-1 animate-fadeIn">
                <span className="text-xs text-red-600 font-bold px-1">Sigurno?</span>
                <button
                    onClick={handleDelete}
                    className="p-1 text-red-600 hover:bg-red-200 rounded transition-colors"
                    title="Potvrdi brisanje"
                >
                    <FiCheck className="w-4 h-4" />
                </button>
                <button
                    onClick={() => setStatus('idle')}
                    className="p-1 text-slate-500 hover:bg-slate-200 rounded transition-colors"
                    title="Otkaži"
                >
                    <FiX className="w-4 h-4" />
                </button>
            </div>
        )
    }

    return (
        <button
            onClick={() => setStatus('confirming')}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Obriši recept"
        >
            <FiTrash2 className="w-5 h-5" />
        </button>
    )
}
