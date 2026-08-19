const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) env[key.trim()] = value.trim().replace(/^['"]|['"]$/g, '');
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function diagnose() {
    console.log('--- Database Diagnosis ---');

    // Check market_prices
    const { count: priceCount, error: priceError } = await supabase
        .from('market_prices')
        .select('*', { count: 'exact', head: true });

    if (priceError) {
        console.error('[FAIL] market_prices table:', priceError.message);
    } else {
        console.log('[OK] market_prices table exists with', priceCount, 'rows.');
    }

    // Check profiles
    const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .limit(1);

    if (profileError) {
        console.error('[FAIL] profiles table:', profileError.message);
    } else {
        console.log('[OK] profiles table exists.');
    }

    // Check if is_admin column exists
    const { data: adminCheck, error: adminError } = await supabase
        .from('profiles')
        .select('is_admin')
        .limit(1);

    if (adminError) {
        console.error('[FAIL] is_admin column:', adminError.message);
    } else {
        console.log('[OK] is_admin column exists.');
    }
}

diagnose();
