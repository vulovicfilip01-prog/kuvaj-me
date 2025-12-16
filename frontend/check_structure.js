const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

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
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function checkStructure() {
    console.log('Checking Sarma structure...');

    const { data: recipe, error } = await supabase
        .from('recipes')
        .select(`
            title,
            profiles:profiles!recipes_user_id_fkey (
                display_name,
                avatar_url
            )
        `)
        .ilike('title', '%sarma%')
        .limit(1)
        .single(); // Mimic the single() call in actions.ts logic (although actions.ts queries by ID)

    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Recipe:', recipe);
        console.log('Profiles type:', Array.isArray(recipe.profiles) ? 'Array' : typeof recipe.profiles);

        if (Array.isArray(recipe.profiles)) {
            console.log('WARNING: Profiles is an array! Layout expects object.');
        } else if (recipe.profiles === null) {
            console.log('WARNING: Profiles is null!');
        } else {
            console.log('Profiles is object (Correct).');
        }
    }
}

checkStructure();
