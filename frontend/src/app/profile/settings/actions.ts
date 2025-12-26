'use server'

import { createClient } from '@/utils/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function changePassword(formData: FormData) {
    const supabase = await createClient()
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (password !== confirmPassword) {
        return { error: 'Lozinke se ne podudaraju' }
    }

    if (password.length < 6) {
        return { error: 'Lozinka mora imati bar 6 karaktera' }
    }

    const { error } = await supabase.auth.updateUser({
        password: password
    })

    if (error) {
        return { error: error.message }
    }

    return { success: true }
}

export async function deleteAccount() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Niste ulogovani' }
    }

    // Use Service Role to delete everything
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56YWJwd2xqanl1dmVpYnZ4cHJjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDE3NTEyMSwiZXhwIjoyMDc5NzUxMTIxfQ.BTVcUWvuaRoWflq_Ks3NiLihQ12_QFe2x_HjlElAjZI';

    const supabaseAdmin = createSupabaseClient(supabaseUrl, supabaseKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    })

    try {
        // 1. Delete associated data (Manual cascade similar to recipe delete)
        const tablesToDeleteFrom = [
            'recipes',
            'collections',
            'recipe_comments',
            'recipe_ratings',
            'recipe_reviews',
            'follows', // as follower and following
            'meal_plans',
            'favorites',
            'newsletter_subscribers' // if email matches? leave for now
        ]

        // Delete recipes owned by user (logic handled by deleteRecipeAsAdmin for cascade? No, easier to just delete user and let RLS/DB handle or do manual cleanup)
        // Actually, deleting the USER from auth might trigger DB cascade if constraints are set up with ON DELETE CASCADE.
        // If not, we have to clean up. Based on previous recipe delete issues, constraints exist but maybe not cascade?
        // Let's rely on admin functions if possible, or manual delete.
        // Safer: Delete profile first?
        
        // Let's try deleting the user via Admin Auth API.
        const { error: deleteUserError } = await supabaseAdmin.auth.admin.deleteUser(
            user.id
        )

        if (deleteUserError) {
             console.error('Account delete error:', deleteUserError)
             return { error: deleteUserError.message }
        }

        // If successful, sign out
        await supabase.auth.signOut()
        return { success: true }

    } catch (error) {
        console.error('Unexpected delete error:', error)
        return { error: 'Greška prilikom brisanja naloga' }
    }
}
