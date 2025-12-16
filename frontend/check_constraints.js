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

async function checkConstraints() {
    console.log('Checking "sarma" recipe fetch...');

    // 1. Try fetch with the specific relationship
    const { data, error } = await supabase
        .from('recipes')
        .select(`
            id, 
            profiles:profiles!recipes_user_id_fkey(display_name)
        `)
        .ilike('title', '%sarma%')
        .limit(1);

    if (error) {
        console.error('Explicit join FAILED:', error);
    } else {
        console.log('Explicit join SUCCESS:', data);
    }

    // 2. Try fetch WITHOUT explicit join to see strict error
    const { error: ambigError } = await supabase
        .from('recipes')
        .select(`
            id, 
            profiles(display_name)
        `)
        .ilike('title', '%sarma%')
        .limit(1);

    if (ambigError) {
        console.log('Ambiguous join error (expected if duplicate exists):', ambigError.message);
    } else {
        console.log('Ambiguous join Succeeded? Then why did it fail before?');
    }
}

checkConstraints();
