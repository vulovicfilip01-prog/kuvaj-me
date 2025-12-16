const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

// Helper to read env
function loadEnv(filePath) {
    try {
        if (!fs.existsSync(filePath)) return {};
        console.log(`Loading env from: ${filePath}`);
        const content = fs.readFileSync(filePath, 'utf8');
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
        console.error(`Error loading env from ${filePath}:`, err);
        return {};
    }
}

async function runMigration() {
    const pathsToCheck = [
        path.resolve(__dirname, '.env.local'),
        path.resolve(__dirname, '.env'),
        path.resolve(__dirname, '../.env.local'),
        path.resolve(__dirname, '../.env')
    ];

    let combinedEnv = {};
    for (const p of pathsToCheck) {
        const fileEnv = loadEnv(p);
        combinedEnv = { ...combinedEnv, ...fileEnv };
    }

    let connectionString = combinedEnv.DATABASE_URL || combinedEnv.POSTGRES_URL || combinedEnv.SUPABASE_DB_URL;

    if (!connectionString) {
        console.error('ERROR: No DATABASE_URL found.');
        process.exit(1);
    }

    console.log('Connecting to database...');

    const client = new Client({
        connectionString: connectionString,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        await client.connect();
        console.log('Connected.');

        const sqlPath = path.resolve(__dirname, '../supabase/migrations/20251216000001_restore_recipes.sql');
        console.log('Reading migration file:', sqlPath);
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Executing migration...');
        await client.query(sql);
        console.log('Migration successfully executed.');

    } catch (err) {
        console.error('Error executing migration:', err);
    } finally {
        await client.end();
    }
}

runMigration();
