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

const testNames = [
    "Final Test Pizza",
    "Public Pizza",
    "test",
    "proba",
    "provera"
];

async function cleanup() {
    for (const name of testNames) {
        console.log(`Cleaning up recipes matching: "${name}"...`);
        const { data: recipes } = await supabase.from('recipes').select('id').ilike('title', name);

        if (!recipes || recipes.length === 0) continue;

        for (const recipe of recipes) {
            console.log(`Deleting recipe ${recipe.id}...`);
            const tables = [
                'recipe_ratings', 'recipe_reviews', 'favorite_recipes',
                'favorites', 'collection_recipes', 'recipe_comments',
                'meal_plans', 'ingredients', 'recipe_steps', 'recipe_analytics'
            ];

            for (const table of tables) {
                await supabase.from(table).delete().eq('recipe_id', recipe.id);
            }
            await supabase.from('recipes').delete().eq('id', recipe.id);
        }
    }
    console.log('Cleanup complete.');
}

cleanup();
