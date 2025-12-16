const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSarma() {
    console.log('Checking for Sarma recipe...');
    const { data, error } = await supabase
        .from('recipes')
        .select('id, title')
        .ilike('title', '%Sarma%');

    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Found recipes:', data);
    }
}

checkSarma();
