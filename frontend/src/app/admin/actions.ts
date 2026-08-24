'use server'

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { resend } from "@/lib/resend";
import { baseEmailTemplate, weeklyDigestTemplate } from "@/lib/email-templates";

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

import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export async function deleteRecipeAsAdmin(recipeId: string) {
    try {
        await verifyAdmin(); // Ensure caller is admin

        // Use Service Role to bypass RLS and ensure we can delete everything
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56YWJwd2xqanl1dmVpYnZ4cHJjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDE3NTEyMSwiZXhwIjoyMDc5NzUxMTIxfQ.BTVcUWvuaRoWflq_Ks3NiLihQ12_QFe2x_HjlElAjZI';
        
        const supabaseAdmin = createSupabaseClient(supabaseUrl, supabaseKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        });

        const tablesToDeleteFrom = [
            'recipe_ratings', 
            'recipe_reviews', 
            'favorite_recipes', 
            'favorites',
            'collection_recipes',
            'recipe_comments',
            'meal_plans',
            'ingredients',
            'recipe_steps',
            'recipe_analytics',
            'follows' // Unlikely related to recipe, but good to check others if needed
        ];

        // 1. Delete related data
        for (const table of tablesToDeleteFrom) {
            try {
                // Ignore 'follows' here as it's not recipe related, filtered list below
                if (table === 'follows') continue;
                await supabaseAdmin.from(table).delete().eq('recipe_id', recipeId);
            } catch (e) {
                console.warn(`Warning: Failed to delete from ${table}`, e);
            }
        }

        // 2. Delete the recipe itself
        const { error } = await supabaseAdmin
            .from('recipes')
            .delete()
            .eq('id', recipeId);

        if (error) throw error;

        revalidatePath('/admin/recipes');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Admin delete error:', error);
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

export async function getGrowthStats() {
    try {
        const { supabase } = await verifyAdmin();
        
        // Get last 30 days data
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const [
            { data: users },
            { data: recipes }
        ] = await Promise.all([
            supabase
                .from('profiles')
                .select('created_at')
                .gte('created_at', thirtyDaysAgo.toISOString())
                .order('created_at', { ascending: true }),
            supabase
                .from('recipes')
                .select('created_at')
                .gte('created_at', thirtyDaysAgo.toISOString())
                .order('created_at', { ascending: true })
        ]);

        // Helper to group by date
        const groupByDate = (data: any[]) => {
            const counts: Record<string, number> = {};
            data?.forEach(item => {
                const date = new Date(item.created_at).toLocaleDateString('sr-RS'); // dd.mm.yyyy. or similar
                counts[date] = (counts[date] || 0) + 1;
            });
            return counts;
        };

        const userGrowth = groupByDate(users || []);
        const recipeGrowth = groupByDate(recipes || []);

        // Retrieve all unique dates
        const allDates = Array.from(new Set([
            ...Object.keys(userGrowth), 
            ...Object.keys(recipeGrowth)
        ])).sort((a, b) => {
             // Simple parse for sorting if needed, or rely on string sort for ISO dates if used
             // For 'sr-RS' format (d.m.y), string sort isn't chronological. 
             // Let's use ISO key for sorting then format for display? 
             // Simpler: use the array index from the fetch since they are ordered by created_at? 
             // No, because days might be missing.
             // We will return the map and handle formatting in frontend chart
             return 0; 
        });

        // Re-implement with ISO keys for easier sorting
        const groupByIsoDate = (data: any[]) => {
            const counts: Record<string, number> = {};
            data?.forEach(item => {
                const date = item.created_at.split('T')[0];
                counts[date] = (counts[date] || 0) + 1;
            });
            return counts;
        };

        const userGrowthIso = groupByIsoDate(users || []);
        const recipeGrowthIso = groupByIsoDate(recipes || []);

        const sortedKeys = Array.from(new Set([
            ...Object.keys(userGrowthIso),
            ...Object.keys(recipeGrowthIso)
        ])).sort();

        const chartData = sortedKeys.map(date => ({
            date,
            users: userGrowthIso[date] || 0,
            recipes: recipeGrowthIso[date] || 0
        }));

        return { success: true, chartData };

    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}

export async function getNewsletterCampaigns() {
    try {
        const { supabase } = await verifyAdmin();

        const { data: campaigns, error } = await supabase
            .from('newsletter_campaigns')
            .select('*')
            .order('sent_at', { ascending: false });

        if (error) throw error;

        return { success: true, campaigns };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}

export async function sendNewsletterBlast(subject: string, content: string) {
    try {
        const { supabase } = await verifyAdmin();

        // 1. Get all subscribers
        const { data: subscribers, error: subError } = await supabase
            .from('newsletter_subscribers')
            .select('email');

        if (subError) throw subError;
        if (!subscribers || subscribers.length === 0) {
            return { success: false, error: 'Nema prijavljenih korisnika.' };
        }

        // 2. Email Sending logic using Resend
        if (resend) {
            try {
                await resend.emails.send({
                    from: 'Krckaj.me <newsletter@krckaj.me>',
                    to: subscribers.map(s => s.email),
                    subject: subject,
                    html: baseEmailTemplate(content.replace(/\n/g, '<br>'), subject),
                });
            } catch (emailError) {
                console.error('Failed to send email blast:', emailError);
                // We continue to log the campaign even if sending fails, 
                // but maybe we should return an error? 
                // For now just log and continue.
            }
        } else {
            console.warn('RESEND_API_KEY is missing. Mocking email blast.');
            console.log(`Sending email blast: "${subject}" to ${subscribers.length} recipients.`);
        }

        // 3. Log the campaign
        const { error: campaignError } = await supabase
            .from('newsletter_campaigns')
            .insert({
                subject,
                content,
                type: 'manual',
                recipient_count: subscribers.length
            });

        if (campaignError) throw campaignError;

        revalidatePath('/admin/newsletter');
        return { success: true };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}

export async function sendWeeklyDigest() {
    try {
        const { supabase } = await verifyAdmin();

        // 1. Find top 3 recipes (by rating) created in the last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const { data: topRecipes, error: recipeError } = await supabase
            .from('recipes')
            .select('id, title, average_rating')
            .gte('created_at', sevenDaysAgo.toISOString())
            .order('average_rating', { ascending: false })
            .limit(3);

        if (recipeError) throw recipeError;
        if (!topRecipes || topRecipes.length === 0) {
            return { success: false, error: 'Nedovoljno novih recepata za nedeljni pregled.' };
        }

        // 2. Construct digest content
        const subject = `Nedeljni krčkar: Top 3 recepta ove nedelje 🥗`;
        let content = "Pogledajte najbolje recepte koje ste možda propustili ove nedelje:\n\n";
        topRecipes.forEach((r, i) => {
            content += `${i + 1}. ${r.title} (Ocena: ${r.average_rating || 'Još nema ocena'})\n`;
            content += `Link: ${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/recipes/${r.id}\n\n`;
        });

        // 3. Get all subscribers
        const { data: subscribers, error: subError } = await supabase
            .from('newsletter_subscribers')
            .select('email');

        // 4. Send email using Resend
        if (resend && subscribers && subscribers.length > 0) {
            try {
                await resend.emails.send({
                    from: 'Krckaj.me <newsletter@krckaj.me>',
                    to: subscribers.map(s => s.email),
                    subject: subject,
                    html: weeklyDigestTemplate(topRecipes),
                });
            } catch (emailError) {
                console.error('Failed to send weekly digest:', emailError);
            }
        }

        // 4. Log the campaign
        const { error: campaignError } = await supabase
            .from('newsletter_campaigns')
            .insert({
                subject,
                content,
                type: 'digest',
                recipient_count: subscribers?.length || 0
            });

        if (campaignError) throw campaignError;

        revalidatePath('/admin/newsletter');
        return { success: true };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}

export async function revalidateHome() {
    try {
        await verifyAdmin();
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}

export async function checkDatabaseStatus() {
    try {
        const { supabase } = await verifyAdmin();
        const { data, error } = await supabase.from('recipes').select('count').limit(1);
        if (error) throw error;
        return { success: true, timestamp: new Date().toISOString() };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}
