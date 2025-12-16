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
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Connecting to:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testExplicitJoin() {
    console.log('Testing explicit join with recipes_user_id_fkey...');

    // Test for Sarma ID
    const id = '768ab388-b1a0-476f-b690-f36619cd3cad';

    const { data: recipe, error } = await supabase
        .from("recipes")
        .select(`
          *,
          profiles:profiles!recipes_user_id_fkey (
            display_name
          ),
          categories (
            name
          ),
          ingredients:ingredients(*),
          steps:recipe_steps(*)
        `)
        .eq("id", id)
        .single();

    if (error) {
        console.error('Error with recipes_user_id_fkey:', error);

        // Try guessing another one if that fails?
        // But let's see.
    } else {
        console.log('Success!');
        console.log('Recipe Title:', recipe.title);
        console.log('Profile Name:', recipe.profiles?.display_name);
    }
}

testExplicitJoin();
