'use client';

import { useState } from 'react';
import { deleteRecipe } from '@/app/recipes/actions';

export default function DeleteRecipeButton({ recipeId }: { recipeId: string }) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (confirm('Da li ste sigurni da želite da obrišete ovaj recept? Ova akcija je nepovratna.')) {
            setIsDeleting(true);
            const result = await deleteRecipe(recipeId);
            if (result?.error) {
                alert(result.error);
                setIsDeleting(false);
            }
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition-all border border-red-500/20 font-medium flex items-center gap-2"
        >
            {isDeleting ? 'Brisanje...' : '🗑️ Obriši'}
        </button>
    );
}
