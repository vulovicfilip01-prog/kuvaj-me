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

async function checkDatabase() {
    const { data: recipe } = await supabase
        .from('recipes')
        .select('title')
        .ilike('title', '%Supa%')
        .limit(1)
        .single();

    if (recipe) {
        console.log('Title from database:', recipe.title);
        console.log('Character codes:');
        for (let i = 0; i < recipe.title.length; i++) {
            const char = recipe.title[i];
            const code = recipe.title.charCodeAt(i);
            if (code > 127) {
                console.log(`  ${char} = U+${code.toString(16).toUpperCase().padStart(4, '0')}`);
            }
        }
    }
}

checkDatabase();
