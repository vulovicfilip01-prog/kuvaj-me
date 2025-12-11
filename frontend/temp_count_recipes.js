const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

try {
    const envPath = path.resolve('.env.local');
    if (!fs.existsSync(envPath)) {
        console.log('No .env.local found');
        process.exit(1);
    }
    const envContent = fs.readFileSync(envPath, 'utf8');

    const envVars = {};

    // Robust parsing
    envContent.split('\n').forEach(line => {
        // Check for URL
        if (line.includes('NEXT_PUBLIC_SUPABASE_URL')) {
            const parts = line.split('=');
            if (parts.length >= 2) {
                // Rejoin in case value has =
                let val = parts.slice(1).join('=').trim();
                // Remove quotes
                val = val.replace(/^["']|["']$/g, '');
                envVars['NEXT_PUBLIC_SUPABASE_URL'] = val;
            }
        }
        // Check for KEY
        if (line.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY')) {
            const parts = line.split('=');
            if (parts.length >= 2) {
                let val = parts.slice(1).join('=').trim();
                val = val.replace(/^["']|["']$/g, '');
                envVars['NEXT_PUBLIC_SUPABASE_ANON_KEY'] = val;
            }
        }
    });

    const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL'];
    const supabaseKey = envVars['NEXT_PUBLIC_SUPABASE_ANON_KEY'];

    if (!supabaseUrl || !supabaseKey) {
        console.log('Could not find keys. Found:', Object.keys(envVars));
        process.exit(1);
    }

    // console.log('Connecting to:', supabaseUrl);

    const supabase = createClient(supabaseUrl, supabaseKey);

    async function count() {
        const { count, error } = await supabase
            .from('recipes')
            .select('*', { count: 'exact', head: true });

        if (error) {
            console.error('Error fetching count:', error.message);
        } else {
            console.log('Total recipes:', count);
        }
    }

    count();
} catch (err) {
    console.error('Script error:', err);
}
