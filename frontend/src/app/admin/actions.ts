'use server'

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function verifyAdmin() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('Unauthorized');
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();

    if (!profile?.is_admin) {
        throw new Error('Forbidden: Admin access only');
    }

    return { supabase, user };
}

export async function getAdminStats() {
    try {
        const { supabase } = await verifyAdmin();

        const [
            { count: totalRecipes },
            { count: totalUsers },
            { count: totalComments }
        ] = await Promise.all([
            supabase.from('recipes').select('*', { count: 'exact', head: true }),
            supabase.from('profiles').select('*', { count: 'exact', head: true }),
            supabase.from('recipe_comments').select('*', { count: 'exact', head: true })
        ]);

        return {
            success: true,
            stats: {
                totalRecipes: totalRecipes || 0,
                totalUsers: totalUsers || 0,
                totalComments: totalComments || 0
            }
        };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}

export async function deleteRecipeAsAdmin(recipeId: string) {
    try {
        const { supabase } = await verifyAdmin();

        // Admin can delete any recipe
        const { error } = await supabase
            .from('recipes')
            .delete()
            .eq('id', recipeId);

        if (error) throw error;

        revalidatePath('/admin/recipes');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}

export async function getRecipesForAdmin() {
    try {
        const { supabase } = await verifyAdmin();

        const { data: recipes, error } = await supabase
            .from('recipes')
            .select(`
                id,
                title,
                created_at,
                category_id,
                profiles:user_id (display_name)
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return { success: true, recipes };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}

export async function getUsersForAdmin() {
    try {
        const { supabase } = await verifyAdmin();

        const { data: users, error } = await supabase
            .from('profiles')
            .select('*')
            .order('display_name', { ascending: true });

        if (error) throw error;

        return { success: true, users };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}

export async function getNewsletterSubscribers() {
    try {
        const { supabase } = await verifyAdmin();

        const { data: subscribers, error } = await supabase
            .from('newsletter_subscribers')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return { success: true, subscribers };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}
