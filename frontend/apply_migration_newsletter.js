const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = 'postgres://postgres:[Vulovic123-]@db.nzabpwljjyuveibvxprc.supabase.co:5432/postgres';

async function applyMigration() {
    const client = new Client({ connectionString });
    try {
        await client.connect();
        const migrationPath = path.resolve(__dirname, '../supabase/migrations/20251220000001_newsletter_campaigns.sql');
        const sql = fs.readFileSync(migrationPath, 'utf8');

        console.log('Applying migration...');
        await client.query(sql);
        console.log('✓ Migration applied successfully.');
    } catch (err) {
        console.error('Error applying migration:', err);
    } finally {
        await client.end();
    }
}

applyMigration();
