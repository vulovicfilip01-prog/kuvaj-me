const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const envContent = fs.readFileSync('.env.local', 'utf-8');
const dbUrlMatch = envContent.match(/DATABASE_URL=(.+)/);
const dbUrl = dbUrlMatch ? dbUrlMatch[1].trim().replace('[', '').replace(']', '') : null;

const client = new Client({
  connectionString: dbUrl,
});

async function main() {
  await client.connect();
  const sql = fs.readFileSync(path.join(__dirname, '..', 'fix_google_avatars.sql'), 'utf-8');
  try {
    const res = await client.query(sql);
    console.log('Success:', res);
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await client.end();
  }
}

main();
