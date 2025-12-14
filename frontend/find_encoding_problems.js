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
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56YWJwd2xqanl1dmVpYnZ4cHJjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDE3NTEyMSwiZXhwIjoyMDc5NzUxMTIxfQ.BTVcUWvuaRoWflq_Ks3NiLihQ12_QFe2x_HjlElAjZI';

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, serviceRoleKey);

async function findProblems() {
    const { data: recipes } = await supabase
        .from('recipes')
        .select('id, title')
        .order('created_at', { ascending: false })
        .limit(60);

    console.log('Checking for encoding problems...\n');

    const problems = recipes.filter(r => r.title.includes('?'));

    if (problems.length > 0) {
        console.log(`Found ${problems.length} recipes with ? character:`);
        problems.forEach((r, idx) => {
            console.log(`${idx + 1}. ${r.title}`);
        });
    } else {
        console.log('✓ No recipes with ? found! All seem OK.');
    }

    // Check for proper Unicode
    const goodOnes = recipes.filter(r => /[čćžšđ]/.test(r.title));
    console.log(`\n✓ Found ${goodOnes.length} recipes with proper Serbian characters`);
    if (goodOnes.length > 0) {
        console.log('Examples:');
        goodOnes.slice(0, 5).forEach((r, idx) => {
            console.log(`${idx + 1}. ${r.title}`);
        });
    }
}

findProblems();
