import { getCategories } from '../actions'
import RecipeForm from './RecipeForm'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export default async function NewRecipePage() {
    // Check if user is logged in
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login?redirect=/recipes/new')
    }

    // Fetch categories
    const { data: categories } = await getCategories()

    return <RecipeForm categories={categories || []} />
}
