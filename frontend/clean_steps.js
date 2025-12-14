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

if (!supabaseUrl) {
    console.error('Missing Supabase URL');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function cleanSteps() {
    console.log('Fetching all recipe steps...');

    // Fetch all steps
    // Since we might have many, we should paginate, but for 450 recipes * ~5 steps = 2250 rows, it's fine to fetch all at once for now or in chunks.
    const { data: steps, error } = await supabase
        .from('recipe_steps')
        .select('id, instruction');

    if (error) {
        console.error('Error fetching steps:', error);
        return;
    }

    console.log(`Found ${steps.length} steps. Checking for cleanup patterns...`);

    let updateCount = 0;

    for (const step of steps) {
        let newInstruction = step.instruction;
        let changed = false;

        // Pattern 1: (1) Text...
        if (newInstruction.match(/^\(\d+\)\s*/)) {
            newInstruction = newInstruction.replace(/^\(\d+\)\s*/, '');
            changed = true;
        }
        // Pattern 2: 1. Text... (just in case)
        else if (newInstruction.match(/^\d+\.\s*/)) {
            newInstruction = newInstruction.replace(/^\d+\.\s*/, '');
            changed = true;
        }

        if (changed) {
            const { error: updateError } = await supabase
                .from('recipe_steps')
                .update({ instruction: newInstruction })
                .eq('id', step.id);

            if (updateError) {
                console.error(`Failed to update step ${step.id}:`, updateError);
            } else {
                updateCount++;
                if (updateCount % 10 === 0) process.stdout.write('.');
            }
        }
    }

    console.log(`\n\nDone! Cleaned up ${updateCount} steps.`);
}

cleanSteps().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
