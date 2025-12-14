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

async function updateServings() {
    console.log('Updating all recipes to have 2 servings...');

    const { data, error, count } = await supabase
        .from('recipes')
        .update({ servings: 2 })
        .neq('id', '00000000-0000-0000-0000-000000000000') // Update logic requires a filter, usually. ID not null is safe.
        .select('id', { count: 'exact' });

    if (error) {
        console.error('Error updating servings:', error);
        return;
    }

    console.log(`\n✓ Successfully updated ${data.length} recipes to 2 servings.`);
}

updateServings().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
