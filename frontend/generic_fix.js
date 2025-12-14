const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

function loadEnv() {
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
}

const env = loadEnv();
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56YWJwd2xqanl1dmVpYnZ4cHJjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDE3NTEyMSwiZXhwIjoyMDc5NzUxMTIxfQ.BTVcUWvuaRoWflq_Ks3NiLihQ12_QFe2x_HjlElAjZI';

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, serviceRoleKey);

async function fixAll() {
    console.log('Finding all ? characters and replacing with generic fix...\n');

    const { data: steps } = await supabase
        .from('recipe_steps')
        .select('id, instruction')
        .like('instruction', '%?%');

    console.log(`Found ${steps.length} steps with ?`);

    for (const step of steps) {
        // Generic fix: replace ? with č (most common)
        let fixed = step.instruction
            .replace(/\?/g, 'č'); // Most common replacement

        // Manual overrides for specific patterns we know
        fixed = fixed.replace(/чC/g, '°C');
        fixed = fixed.replace(/изгњећити/g, 'izgnjećiti');

        await supabase
            .from('recipe_steps')
            .update({ instruction: fixed })
            .eq('id', step.id);

        console.log(`Fixed: ${step.instruction.substring(0, 50)}...`);
    }

    console.log('\n✓ Done');
}

fixAll();
