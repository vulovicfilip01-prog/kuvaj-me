const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

function loadEnv() {
    try {
        const envPath = path.resolve(__dirname, '.env.local');
        if (!fs.existsSync(envPath)) return {};
        const content = fs.readFileSync(envPath, 'utf8');
        const env = {};
        content.split('\n').forEach(line => {
            const parts = line.split('=');
            if (parts.length >= 2) {
                const key = parts[0].trim();
                const val = parts.slice(1).join('=').trim().replace(/^"|"$/g, '');
                if (key && !key.startsWith('#')) env[key] = val;
            }
        });
        return env;
    } catch (err) {
        return {};
    }
}

const env = loadEnv();
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56YWJwd2xqanl1dmVpYnZ4cHJjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDE3NTEyMSwiZXhwIjoyMDc5NzUxMTIxfQ.BTVcUWvuaRoWflq_Ks3NiLihQ12_QFe2x_HjlElAjZI';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function deduplicate() {
    console.log('Fetching all recipes...');
    const { data: recipes, error } = await supabase
        .from('recipes')
        .select('id, title, average_rating, image_url, created_at')
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error fetching recipes:', error);
        return;
    }

    console.log(`Found ${recipes.length} recipes.`);

    const groups = {};
    recipes.forEach(r => {
        const title = r.title.trim().toLowerCase();
        if (!groups[title]) {
            groups[title] = [];
        }
        groups[title].push(r);
    });

    let totalDeleted = 0;
    const titlesWithDuplicates = Object.keys(groups).filter(title => groups[title].length > 1);

    console.log(`Analyzing ${titlesWithDuplicates.length} duplicate groups...`);

    for (const title of titlesWithDuplicates) {
        const duplicates = groups[title];

        // Sort: Preferred first (has image, higher rating, older)
        duplicates.sort((a, b) => {
            // Rule 1: Has image URL
            const aHasImage = !!a.image_url && !a.image_url.includes('placeholder');
            const bHasImage = !!b.image_url && !b.image_url.includes('placeholder');
            if (aHasImage && !bHasImage) return -1;
            if (!aHasImage && bHasImage) return 1;

            // Rule 2: Higher rating
            if ((a.average_rating || 0) > (b.average_rating || 0)) return -1;
            if ((a.average_rating || 0) < (b.average_rating || 0)) return 1;

            // Rule 3: Older first
            return new Date(a.created_at) - new Date(b.created_at);
        });

        const kept = duplicates[0];
        const toDelete = duplicates.slice(1);

        console.log(`Keeping: "${kept.title}" (${kept.id})`);
        console.log(`Deleting ${toDelete.length} duplicates...`);

        for (const recipe of toDelete) {
            const tables = [
                'recipe_ratings', 'recipe_reviews', 'favorite_recipes',
                'favorites', 'collection_recipes', 'recipe_comments',
                'meal_plans', 'ingredients', 'recipe_steps', 'recipe_analytics'
            ];

            for (const table of tables) {
                await supabase.from(table).delete().eq('recipe_id', recipe.id);
            }
            const { error: delError } = await supabase.from('recipes').delete().eq('id', recipe.id);
            if (delError) {
                console.error(`Failed to delete ${recipe.id}:`, delError.message);
            } else {
                totalDeleted++;
            }
        }
    }

    console.log('\n--- DEDUPLICATION COMPLETE ---');
    console.log(`Total recipes deleted: ${totalDeleted}`);
}

deduplicate();
