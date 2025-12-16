'use client';

import { useState } from 'react';
import { LuTrash2 } from 'react-icons/lu';
import { deleteRecipe } from '@/app/recipes/actions';

export default function DeleteRecipeButton({ recipeId, compact = false }: { recipeId: string, compact?: boolean }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);

        try {
            const result = await deleteRecipe(recipeId);

            if (result?.error) {
                alert('Greška sa servera: ' + result.error);
                setIsDeleting(false);
                setShowConfirm(false);
            } else {
                // Force redirect immediately on success
                window.location.href = '/';
            }
        } catch (err: any) {
            console.error("Delete client error:", err);
            alert('Klijentska greška: ' + err.message);
            setIsDeleting(false);
            setShowConfirm(false);
        }
    };

    if (showConfirm) {
        return (
            <div className={`flex items-center gap-1 ${compact ? 'text-xs' : 'text-sm'}`}>
                <span className={`font-bold text-slate-600 mr-1 animate-fadeIn ${compact ? 'hidden' : ''}`}>Sigurno?</span>
                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className={`bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-all font-medium shadow-lg z-30 relative ${compact ? 'px-2 py-1 text-xs' : 'px-4 py-2'}`}
                >
                    {isDeleting ? '...' : 'Da'}
                </button>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowConfirm(false);
                    }}
                    disabled={isDeleting}
                    className={`bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-all font-medium z-30 relative ${compact ? 'px-2 py-1 text-xs' : 'px-4 py-2'}`}
                >
                    Ne
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowConfirm(true);
            }}
            className={`${compact
                ? 'p-2 bg-white/90 text-amber-500 hover:bg-amber-50 rounded-full shadow-lg backdrop-blur-sm'
                : 'px-4 py-2 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-all font-medium flex items-center gap-2 shadow-sm'
                }`}
            title="Obriši recept"
        >
            <LuTrash2 className={compact ? "w-4 h-4" : "w-5 h-5"} />
            {!compact && "Obriši recept"}
        </button>
    );
}
