const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables manually
function loadEnv() {
    try {
        const envPath = path.resolve(__dirname, '.env.local');
        if (!fs.existsSync(envPath)) {
            console.error('.env.local file not found!');
            return {};
        }
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

async function verify() {
    const env = loadEnv();
    const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Hardcoded Service Role Key (from import script - useful for absolute truth check)
    // Note: In production code we wouldn't hardcode this, but this is a temporary debug script
    const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56YWJwd2xqanl1dmVpYnZ4cHJjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDE3NTEyMSwiZXhwIjoyMDc5NzUxMTIxfQ.BTVcUWvuaRoWflq_Ks3NiLihQ12_QFe2x_HjlElAjZI';

    console.log('--- Configuration ---');
    console.log(`URL Present: ${!!supabaseUrl}`);
    console.log(`Anon Key Present: ${!!anonKey}`);
    console.log(`Service Key Present: ${!!serviceRoleKey}`);
    console.log('---------------------\n');

    if (!supabaseUrl) {
        console.error('CRITICAL: Missing NEXT_PUBLIC_SUPABASE_URL');
        return;
    }

    // 1. Check with Service Role (Admin)
    console.log('Checking with SERVICE ROLE (Admin)...');
    const adminClient = createClient(supabaseUrl, serviceRoleKey);
    const { count: adminCount, error: adminError } = await adminClient
        .from('recipes')
        .select('*', { count: 'exact', head: true });

    if (adminError) {
        console.error('Admin Check Failed:', adminError.message);
    } else {
        console.log(`✅ Admin visible recipes: ${adminCount}`);
    }

    // 2. Check with Anon Key (Public/Website)
    if (anonKey) {
        console.log('\nChecking with ANON KEY (Public/Website)...');
        const publicClient = createClient(supabaseUrl, anonKey);
        const { count: publicCount, error: publicError } = await publicClient
            .from('recipes')
            .select('*', { count: 'exact', head: true })
            .eq('is_public', true); // Mimic the website filter

        if (publicError) {
            console.error('Public Check Failed:', publicError.message);
            console.log('Possible RLS Issue?');
        } else {
            console.log(`✅ Public visible recipes: ${publicCount}`);

            if (adminCount > 0 && publicCount === 0) {
                console.log('⚠️ WARNING: Data exists but is hidden from public!');
                console.log('Possible causes: is_public=false or RLS Policies.');
            } else if (adminCount === 0) {
                console.log('⚠️ WARNING: Database is empty!');
            } else {
                console.log('✅ Access looks correct.');
            }
        }
    } else {
        console.log('Skipping Anon/Public check (Key missing)');
    }
}

verify().catch(console.error);
