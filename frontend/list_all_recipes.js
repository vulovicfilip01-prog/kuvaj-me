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

async function listRecipes() {
    const env = loadEnv();
    const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !anonKey) {
        console.log('Missing env vars');
        return;
    }

    const supabase = createClient(supabaseUrl, anonKey);
    const { data, error } = await supabase
        .from('recipes')
        .select('id, title, is_public')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error:', error);
    } else {
        console.log(`Total recipes: ${data.length}`);
        data.forEach(r => {
            console.log(`- [${r.is_public ? 'PUBLIC' : 'PRIVATE'}] ${r.title} (${r.id})`);
        });
    }
}

listRecipes();
