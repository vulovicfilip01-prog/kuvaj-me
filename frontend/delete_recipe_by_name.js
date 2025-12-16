const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nzabpwljjyuveibvxprc.supabase.co';
// Use the service role key AGAIN to be sure
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56YWJwd2xqanl1dmVpYnZ4cHJjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDE3NTEyMSwiZXhwIjoyMDc5NzUxMTIxfQ.BTVcUWvuaRoWflq_Ks3NiLihQ12_QFe2x_HjlElAjZI';

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

const recipeTitle = "test";

async function deleteByName() {
    console.log(`Searching for recipe with title: "${recipeTitle}"...`);

    const { data: recipes, error: findError } = await supabase
        .from('recipes')
        .select('*')
        .ilike('title', recipeTitle);

    if (findError) {
        console.error('Error finding recipe:', findError);
        return;
    }

    if (!recipes || recipes.length === 0) {
        console.log('No recipe found with that title.');
        return;
    }

    console.log(`Found ${recipes.length} recipe(s).`);

    for (const recipe of recipes) {
        console.log(`Attempting to delete recipe ID: ${recipe.id}`);

        // Manual cleanup (Scorched Earth)
        const tables = [
            'recipe_ratings',
            'recipe_reviews',
            'favorite_recipes',
            'favorites',
            'collection_recipes',
            'recipe_comments',
            'meal_plans',
            'ingredients',
            'recipe_steps',
            'recipe_analytics'
        ];

        for (const table of tables) {
            try {
                const { error } = await supabase.from(table).delete().eq(table === 'notifications' ? 'resource_id' : 'recipe_id', recipe.id);
                if (error) console.log(`Error cleaning ${table}:`, error.message);
            } catch (e) {
                // ignore
            }
        }

        // Final delete
        const { error: deleteError } = await supabase.from('recipes').delete().eq('id', recipe.id);

        if (deleteError) {
            console.error('DELETE FAILED:', deleteError.message);
            console.error('Details:', deleteError.details);
            console.error('Hint:', deleteError.hint);
        } else {
            console.log('Recipe deleted successfully!');
        }
    }
}

deleteByName();
