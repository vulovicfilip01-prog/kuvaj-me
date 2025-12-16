const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const fs = require('fs');

const envPath = path.resolve(__dirname, 'src', '.env.local');
const rootEnvPath = path.resolve(__dirname, '.env.local');
let envFile;
if (fs.existsSync(rootEnvPath)) envFile = fs.readFileSync(rootEnvPath, 'utf8');
else if (fs.existsSync(envPath)) envFile = fs.readFileSync(envPath, 'utf8');

const envVars = {};
if (envFile) {
    envFile.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) envVars[key.trim()] = value.trim();
    });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nzabpwljjyuveibvxprc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56YWJwd2xqanl1dmVpYnZ4cHJjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDE3NTEyMSwiZXhwIjoyMDc5NzUxMTIxfQ.BTVcUWvuaRoWflq_Ks3NiLihQ12_QFe2x_HjlElAjZI';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
    console.log('Checking tables...');

    // We can't easily query information_schema via JS client directly due to permissions usually, 
    // unless we use rpc or if it's exposed. 
    // Instead we can try to select from known tables to see if they exist.

    const candidates = ['recipe_ratings', 'recipe_reviews', 'favorite_recipes', 'favorites', 'recipe_analytics'];

    for (const table of candidates) {
        const { data, error } = await supabase.from(table).select('count', { count: 'exact', head: true });
        if (error) {
            console.log(`Table '${table}' status: Error/Not Found (${error.message})`);
        } else {
            console.log(`Table '${table}' status: Exists (Count: ${data?.length ?? 'unknown'})`);
        }
    }
}

checkTables();
