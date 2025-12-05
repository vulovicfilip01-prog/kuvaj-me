import { notFound, redirect } from 'next/navigation';
import { getRecipe, getCategories } from '../../actions';
import { createClient } from '@/utils/supabase/server';
import RecipeForm from '../../new/RecipeForm';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditRecipePage({ params }: PageProps) {
    const { id } = await params;
    const recipe = await getRecipe(id);

    if (!recipe) {
        notFound();
    }

    // Check ownership
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || user.id !== recipe.user_id) {
        redirect('/');
    }

    const { data: categories } = await getCategories();

    return (
        <RecipeForm
            categories={categories || []}
            initialData={recipe}
        />
    );
}
