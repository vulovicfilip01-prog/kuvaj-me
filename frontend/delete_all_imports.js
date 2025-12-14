const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

function loadEnv() {
    try {
        const envPath = path.resolve(__dirname, '.env.local');
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
        console.error('Error loading env:', err);
        return {};
    }
}

const env = loadEnv();
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56YWJwd2xqanl1dmVpYnZ4cHJjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDE3NTEyMSwiZXhwIjoyMDc5NzUxMTIxfQ.BTVcUWvuaRoWflq_Ks3NiLihQ12_QFe2x_HjlElAjZI';

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, serviceRoleKey);

async function deleteAllImportedRecipes() {
    console.log('Fetching all imported recipes (last 60)...\n');

    // Get recipes created today (all the imported ones)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data: recipes, error } = await supabase
        .from('recipes')
        .select('id, title, created_at')
        .gte('created_at', today.toISOString())
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching recipes:', error);
        return;
    }

    console.log(`Found ${recipes.length} recipes created today.\n`);

    if (recipes.length === 0) {
        console.log('No recipes to delete.');
        return;
    }

    // Show first 5 for confirmation
    console.log('Sample recipes to be deleted:');
    recipes.slice(0, 5).forEach((r, idx) => {
        console.log(`${idx + 1}. ${r.title}`);
    });

    if (recipes.length > 5) {
        console.log(`... and ${recipes.length - 5} more\n`);
    }

    console.log('\nDeleting all...');

    for (const recipe of recipes) {
        const { error: deleteError } = await supabase
            .from('recipes')
            .delete()
            .eq('id', recipe.id);

        if (deleteError) {
            console.error(`Error deleting ${recipe.title}:`, deleteError);
        }
    }

    console.log(`\n✓ Deleted ${recipes.length} recipes`);
    console.log('Ready for new import!');
}

deleteAllImportedRecipes();
