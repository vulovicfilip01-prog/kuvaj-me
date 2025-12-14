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

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifyImport() {
    const { data: recipes, error, count } = await supabase
        .from('recipes')
        .select('id, title, categories(name)', { count: 'exact' })
        .order('created_at', { ascending: false })
        .limit(50);

    if (error) {
        console.error('Error fetching recipes:', error);
        return;
    }

    console.log(`Total recipes in database: ${count}`);
    console.log(`\nLast 50 recipes:`);

    recipes.forEach((recipe, idx) => {
        console.log(`${idx + 1}. ${recipe.title} - ${recipe.categories?.name || 'No category'}`);
    });
}

verifyImport();
