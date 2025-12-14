const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nzabpwljjyuveibvxprc.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56YWJwd2xqanl1dmVpYnZ4cHJjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDE3NTEyMSwiZXhwIjoyMDc5NzUxMTIxfQ.BTVcUWvuaRoWflq_Ks3NiLihQ12_QFe2x_HjlElAjZI';

const supabase = createClient(supabaseUrl, serviceRoleKey);

const TARGET_USER_ID = '1522a6e3-2ce2-481d-bf13-8430858d5160'; // The user we saw in imports

async function makeAdmin() {
    console.log(`Making user ${TARGET_USER_ID} an admin...`);

    // First, check if column exists by trying to update
    const { data, error } = await supabase
        .from('profiles')
        .update({ is_admin: true })
        .eq('id', TARGET_USER_ID)
        .select();

    if (error) {
        console.error('Error updating profile:', error);
        console.log('HINT: Did you apply the migration to add "is_admin" column?');
    } else {
        console.log('Success!', data);
    }
}

makeAdmin();
