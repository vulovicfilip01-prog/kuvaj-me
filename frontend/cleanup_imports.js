const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Helper to read env
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
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56YWJwd2xqanl1dmVpYnZ4cHJjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDE3NTEyMSwiZXhwIjoyMDc5NzUxMTIxfQ.BTVcUWvuaRoWflq_Ks3NiLihQ12_QFe2x_HjlElAjZI';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function deleteRecentImports() {
    // Delete recipes created in the last hour (from the import)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    const { data: recipes, error: fetchError } = await supabase
        .from('recipes')
        .select('id, title, created_at')
        .gte('created_at', oneHourAgo);

    if (fetchError) {
        console.error('Error fetching recipes:', fetchError);
        return;
    }

    console.log(`Found ${recipes.length} recipes to delete (created after ${oneHourAgo})`);

    for (const recipe of recipes) {
        console.log(`Deleting: ${recipe.title} (${recipe.id})`);
        const { error } = await supabase
            .from('recipes')
            .delete()
            .eq('id', recipe.id);

        if (error) {
            console.error(`Error deleting ${recipe.title}:`, error);
        }
    }

    console.log('✓ Cleanup complete');
}

deleteRecentImports();
