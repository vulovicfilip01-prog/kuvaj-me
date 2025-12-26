const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nzabpwljjyuveibvxprc.supabase.co';
// Reusing key from make_admin.js
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56YWJwd2xqanl1dmVpYnZ4cHJjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDE3NTEyMSwiZXhwIjoyMDc5NzUxMTIxfQ.BTVcUWvuaRoWflq_Ks3NiLihQ12_QFe2x_HjlElAjZI';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function promoteTestUser() {
    console.log('Searching for test@kuvaj.me...');

    // 1. Get User ID from auth (admin api) or profiles if email is there?
    // Profiles table might not have email. 
    // But we can try to update based on some known ID if we knew it.
    // However, I can list users with admin client.

    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
        console.error('Error listing users:', listError);
        return;
    }

    const testUser = users.find(u => u.email === 'test@kuvaj.me');

    if (!testUser) {
        console.error('User test@kuvaj.me not found!');
        return;
    }

    console.log(`Found user ${testUser.id}. Promoting to admin...`);

    const { error: updateError } = await supabase
        .from('profiles')
        .update({ is_admin: true })
        .eq('id', testUser.id);

    if (updateError) {
        console.error('Error promoting user:', updateError);
    } else {
        console.log('Successfully promoted test@kuvaj.me to admin.');
    }
}

promoteTestUser();
