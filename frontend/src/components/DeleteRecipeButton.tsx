'use client';

import { useState } from 'react';
import { LuTrash2 } from 'react-icons/lu';
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
            className="px-4 py-2 bg-primary/90 text-white rounded-xl hover:bg-primary transition-all border border-primary/50 font-medium flex items-center gap-2 shadow-lg backdrop-blur-md"
        >
            {isDeleting ? (
                'Brisanje...'
            ) : (
                <>
                    <LuTrash2 className="w-5 h-5" />
                    Obriši
                </>
            )}
        </button>
    );
}
