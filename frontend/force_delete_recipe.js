const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nzabpwljjyuveibvxprc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56YWJwd2xqanl1dmVpYnZ4cHJjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDE3NTEyMSwiZXhwIjoyMDc5NzUxMTIxfQ.BTVcUWvuaRoWflq_Ks3NiLihQ12_QFe2x_HjlElAjZI';

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

const recipeId = '03f8c8a7-1436-43c6-be4b-00af659b538e';

async function forceDelete() {
    console.log(`Attempting to delete recipe ${recipeId}...`);

    // 1. Try generic delete to catch error
    const { error } = await supabase.from('recipes').delete().eq('id', recipeId);

    if (error) {
        console.error('Initial delete failed with error:', error);
        console.log('Error details:', JSON.stringify(error, null, 2));
    } else {
        console.log('Success! Recipe deleted.');
        return;
    }

    // 2. If failed, try to manually clean references one by one and see which one works/fails
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
        'notifications' // Try deleting notifications referencing this ID just in case
    ];

    for (const table of tables) {
        console.log(`Cleaning ${table}...`);
        try {
            // For notifications, resource_id is the key
            const key = table === 'notifications' ? 'resource_id' : 'recipe_id';
            const { error: cleanError } = await supabase.from(table).delete().eq(key, recipeId);
            if (cleanError) {
                console.log(`Failed to clean ${table}:`, cleanError.message);
            } else {
                console.log(`Cleaned ${table}.`);
            }
        } catch (e) {
            console.log(`Error processing ${table}:`, e.message);
        }
    }

    // 3. Try again
    console.log('Retrying delete...');
    const { error: retryError } = await supabase.from('recipes').delete().eq('id', recipeId);
    if (retryError) {
        console.error('Retry delete failed:', retryError);
        // Ensure we see the message
        console.log('Retry Error Message:', retryError.message);
        console.log('Retry Error Details:', retryError.details);
        console.log('Retry Error Hint:', retryError.hint);
    } else {
        console.log('Success on retry!');
    }
}

forceDelete();
