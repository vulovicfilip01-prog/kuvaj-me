const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

try {
    const envPath = path.resolve('.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envVars = {};
    envContent.split('\n').forEach(line => {
        const parts = line.split('=');
        if (parts.length >= 2) {
            let key = parts[0].trim();
            let val = parts.slice(1).join('=').trim().replace(/^["']|["']$/g, '');
            envVars[key] = val;
        }
    });

    const supabase = createClient(envVars['NEXT_PUBLIC_SUPABASE_URL'], envVars['NEXT_PUBLIC_SUPABASE_ANON_KEY']);

    async function listCategories() {
        const { data, error } = await supabase.from('categories').select('id, name');
        if (error) console.error(error);
        else console.log(JSON.stringify(data));
    }
    listCategories();
} catch (e) { console.error(e) }
