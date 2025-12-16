
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Manual env parsing
const envPath = path.resolve(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envvars = {};
envContent.split('\n').forEach(line => {
    // Skip comments and empty lines
    if (!line || line.startsWith('#') || !line.includes('=')) return;

    const match = line.match(/^\s*([\w_]+)\s*=(.*)$/);
    if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["']|["']$/g, ''); // Remove quotes
        envvars[key] = value;
    }
});

console.log('Parsed keys:', Object.keys(envvars));

const supabaseUrl = envvars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = envvars.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function updateStep() {
    // Search for the step
    const searchTerms = ['%133%', '%recept 133%'];
    let foundStep = null;

    for (const term of searchTerms) {
        const { data, error } = await supabase
            .from('recipe_steps')
            .select('*')
            .ilike('instruction', term);

        if (error) {
            console.error('Error searching:', error);
            continue;
        }

        if (data && data.length > 0) {
            foundStep = data[0];
            break;
        }
    }

    if (!foundStep) {
        console.log('No step found containing 133');
        return;
    }

    console.log('Found step:', foundStep);

    // Update it
    const { data: updateData, error: updateError } = await supabase
        .from('recipe_steps')
        .update({ instruction: 'Zamesite smesu od brašna, jajeta, jogurta i P.P' })
        .eq('id', foundStep.id)
        .select();

    if (updateError) {
        console.error('Error updating:', updateError);
    } else {
        console.log('Successfully updated step:', updateData);
    }
}

updateStep();
