const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '.env.local') });

async function test() {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    console.log('Testing market_prices fetch...');
    const { data, error } = await supabase
        .from('market_prices')
        .select('*');

    if (error) {
        console.error('Error fetching market_prices:', error);
    } else {
        console.log('Success! Found', data.length, 'records.');
        console.log('First record:', data[0]);
    }
}

test();
