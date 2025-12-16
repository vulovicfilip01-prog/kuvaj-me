const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const fs = require('fs');

// Load environment variables from .env.local
const envPath = path.resolve(__dirname, 'src', '.env.local');
// Try finding .env.local in root if not in src
const rootEnvPath = path.resolve(__dirname, '.env.local');

let envFile;
if (fs.existsSync(rootEnvPath)) {
    envFile = fs.readFileSync(rootEnvPath, 'utf8');
} else if (fs.existsSync(envPath)) {
    envFile = fs.readFileSync(envPath, 'utf8');
} else {
    console.error('Could not find .env.local file');
    process.exit(1);
}

const envVars = {};
envFile.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
        envVars[key.trim()] = value.trim();
    }
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nzabpwljjyuveibvxprc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56YWJwd2xqanl1dmVpYnZ4cHJjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDE3NTEyMSwiZXhwIjoyMDc5NzUxMTIxfQ.BTVcUWvuaRoWflq_Ks3NiLihQ12_QFe2x_HjlElAjZI';
// Use explicit service key found in project

const supabase = createClient(supabaseUrl, supabaseKey);

async function deleteCategory() {
    console.log('Searching for "Supte i čorbe"...');

    // First find the ID
    const { data: categories, error: findError } = await supabase
        .from('categories')
        .select('*')
        .eq('name', 'Supte i čorbe');

    if (findError) {
        console.error('Error finding category:', findError);
        return;
    }

    if (!categories || categories.length === 0) {
        console.log('Category "Supte i čorbe" not found.');
        return;
    }

    console.log(`Found ${categories.length} category(ies). Deleting...`);

    for (const cat of categories) {
        // Delete recipes association if any? (might have foreign key constraint)
        // Usually Supabase/Postgres throws foreign key violation if there are recipes.
        // Let's try to delete directly. If it fails, we might need to update recipes to correct category first.

        // Check for recipes
        const { count, error: countError } = await supabase
            .from('recipes')
            .select('*', { count: 'exact', head: true })
            .eq('category_id', cat.id);

        if (count > 0) {
            console.log(`Category ${cat.id} has ${count} recipes. Moving them to "Supe i čorbe" first.`);

            // Find "Supe i čorbe" id
            const { data: validCat } = await supabase.from('categories').select('id').eq('name', 'Supe i čorbe').single();
            if (validCat) {
                console.log(`Moving recipes to category ${validCat.id}...`);
                await supabase.from('recipes').update({ category_id: validCat.id }).eq('category_id', cat.id);
            } else {
                console.warn('Could not find valid "Supe i čorbe" category. Cannot move recipes safely.');
                // Proceeding might be dangerous if we just delete category and cascade/set null happens
            }
        }

        const { error: deleteError, count: deleteCount } = await supabase
            .from('categories')
            .delete({ count: 'exact' })
            .eq('id', cat.id);

        if (deleteError) {
            console.error(`Error deleting category ${cat.id}:`, deleteError);
        } else {
            console.log(`Successfully deleted category ${cat.id}. Rows affected: ${deleteCount}`);
        }
    }
}

console.log("Using SERVICE key for clean execution.");

deleteCategory();
