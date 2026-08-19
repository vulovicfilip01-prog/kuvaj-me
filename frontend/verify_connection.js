const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

async function testConnection() {
    console.log("Starting connection test...");

    // 1. Try to load .env.local
    let envUrl, envKey;
    try {
        const envPath = path.resolve(__dirname, '.env.local');
        if (fs.existsSync(envPath)) {
            const content = fs.readFileSync(envPath, 'utf8');
            content.split('\n').forEach(line => {
                const parts = line.split('=');
                if (parts.length >= 2) {
                    const key = parts[0].trim();
                    const val = parts.slice(1).join('=').trim(); // Handle values with =
                    if (key === 'NEXT_PUBLIC_SUPABASE_URL') envUrl = val;
                    if (key === 'NEXT_PUBLIC_SUPABASE_ANON_KEY') envKey = val;
                }
            });
            console.log("Read .env.local successfully.");
        } else {
            console.log(".env.local not found in " + __dirname);
        }
    } catch (e) {
        console.error("Error reading .env.local:", e.message);
    }

    const supabaseUrl = envUrl || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = envKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error("Missing Supabase credentials!");
        console.log("URL:", supabaseUrl);
        console.log("Key:", supabaseKey ? "Found (masked)" : "Missing");
        return;
    }

    console.log("Using Supabase URL:", supabaseUrl);

    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log("Attempting to fetch recipes...");
    const { data, error } = await supabase.from('recipes').select('count', { count: 'exact', head: true });

    if (error) {
        console.error("Connection failed:", error.message);
        console.error("Full error:", error);
    } else {
        console.log("Connection SUCCESS!");
        console.log("Recipes count:", data ? data.length : 'N/A (head request)');
    }
}

testConnection();
