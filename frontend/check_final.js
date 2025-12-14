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

async function checkSteps() {
    console.log('Checking for ? in steps...\n');

    const { data: steps } = await supabase
        .from('recipe_steps')
        .select('instruction')
        .like('instruction', '%?%')
        .limit(10);

    if (steps && steps.length > 0) {
        console.log(`Found ${steps.length} steps with ? character:`);
        steps.forEach((step, idx) => {
            console.log(`${idx + 1}. ${step.instruction.substring(0, 100)}...`);
        });
    } else {
        console.log('✅ No steps with ? found!');
    }

    // Check ingredients too
    const { data: ingredients } = await supabase
        .from('ingredients')
        .select('name')
        .like('name', '%?%')
        .limit(10);

    if (ingredients && ingredients.length > 0) {
        console.log(`\nFound ${ingredients.length} ingredients with ?:`);
        ingredients.forEach((ing, idx) => {
            console.log(`${idx + 1}. ${ing.name}`);
        });
    } else {
        console.log('\n✅ No ingredients with ? found!');
    }
}

checkSteps();
