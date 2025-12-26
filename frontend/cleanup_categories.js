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

async function cleanupCategories() {
    // 1. Find the categories
    const { data: categories, error: fetchError } = await supabase
        .from('categories')
        .select('*')
        .or('name.eq.Supe i čorbe,name.eq.Supte i čorbe');

    if (fetchError) {
        console.error('Error fetching categories:', fetchError);
        return;
    }

    console.log('Found categories:', categories);

    const correctCat = categories.find(c => c.name === 'Supe i čorbe');
    const wrongCat = categories.find(c => c.name === 'Supte i čorbe');

    if (!correctCat || !wrongCat) {
        console.error('Could not find both categories. Check names.');
        return;
    }

    console.log(`Migrating recipes from ${wrongCat.id} to ${correctCat.id}...`);

    // 2. Update recipes to point to the correct category
    const { data: updatedRecipes, error: updateError } = await supabase
        .from('recipes')
        .update({ category_id: correctCat.id })
        .eq('category_id', wrongCat.id);

    if (updateError) {
        console.error('Error updating recipes:', updateError);
        // We shouldn't proceed if update failed
        return;
    }

    console.log('✓ Recipes migrated.');

    // 3. Delete the wrong category
    const { error: deleteError } = await supabase
        .from('categories')
        .delete()
        .eq('id', wrongCat.id);

    if (deleteError) {
        console.error('Error deleting category:', deleteError);
    } else {
        console.log('✓ Misspelled category "Supte i čorbe" deleted successfully.');
    }
}

cleanupCategories();
