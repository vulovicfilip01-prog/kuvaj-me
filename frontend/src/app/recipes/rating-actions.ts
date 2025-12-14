'use server'

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function rateRecipe(recipeId: string, rating: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: 'Morate biti prijavljeni.' };
    if (rating < 1 || rating > 5) return { success: false, error: 'Ocena mora biti između 1 i 5.' };

    const { error } = await supabase
        .from('recipe_ratings')
        .upsert({
            user_id: user.id,
            recipe_id: recipeId,
            rating
        });

    if (error) return { success: false, error: error.message };
    
    revalidatePath(`/recipes/${recipeId}`);
    return { success: true };
}

export async function getRecipeRating(recipeId: string) {
    const supabase = await createClient();
    
    // Get average and count
    const { data: ratings, error } = await supabase
        .from('recipe_ratings')
        .select('rating');

    if (error || !ratings) return { average: 0, count: 0, myRating: null };

    const count = ratings.length;
    const total = ratings.reduce((acc, curr) => acc + curr.rating, 0);
    const average = count > 0 ? Number((total / count).toFixed(1)) : 0;

    // Check if current user has rated
    const { data: { user } } = await supabase.auth.getUser();
    let myRating = null;
    if (user) {
        const { data: userRating } = await supabase
            .from('recipe_ratings')
            .select('rating')
            .eq('recipe_id', recipeId)
            .eq('user_id', user.id)
            .single(); // Use maybeSingle() usually better but single() is ok if we catch error or expect 0/1
        if (userRating) myRating = userRating.rating;
    }

    return { average, count, myRating };
}
