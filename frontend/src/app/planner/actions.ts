'use server'

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function addToMealPlan(recipeId: string, date: string, mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack') {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: 'Morate biti prijavljeni.' };
    }

    const { error } = await supabase
        .from('meal_plans')
        .insert({
            user_id: user.id,
            recipe_id: recipeId,
            date,
            meal_type: mealType
        });

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath('/profile/planner');
    return { success: true };
}

export async function removeFromMealPlan(planId: string) {
    const supabase = await createClient();
    
    const { error } = await supabase
        .from('meal_plans')
        .delete()
        .eq('id', planId);

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath('/profile/planner');
    return { success: true };
}

export async function getMyMealPlan(startDate: string, endDate: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: 'Unauthorized' };

    const { data: plans, error } = await supabase
        .from('meal_plans')
        .select(`
            id,
            date,
            meal_type,
            recipe:recipes (
                id,
                title,
                image_url
            )
        `)
        .eq('user_id', user.id)
        .gte('date', startDate)
        .lte('date', endDate);

    if (error) return { success: false, error: error.message };

    // Group by date for easier frontend consumption? 
    // Or just return flat list and let frontend handle it. Flat list is more flexible.
    return { success: true, plans };
}
