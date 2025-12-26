const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Helper to read env
function loadEnv() {
    try {
        const envPath = path.resolve(__dirname, '.env.local');
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

const env = loadEnv();
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56YWJwd2xqanl1dmVpYnZ4cHJjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDE3NTEyMSwiZXhwIjoyMDc5NzUxMTIxfQ.BTVcUWvuaRoWflq_Ks3NiLihQ12_QFe2x_HjlElAjZI';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function cleanIngredients() {
    // Fetch a sample of potentially messy ingredients
    const { data: ingredients, error: fetchError } = await supabase
        .from('ingredients')
        .select('id, name')
        .or('name.ilike.%1/%,name.ilike.%(%)%,name.ilike.%0%,name.ilike.%1%,name.ilike.%2%,name.ilike.%3%,name.ilike.%4%,name.ilike.%5%,name.ilike.%6%,name.ilike.%7%,name.ilike.%8%,name.ilike.%9%');

    if (fetchError) {
        console.error('Error fetching ingredients:', fetchError);
        return;
    }

    console.log(`Found ${ingredients.length} ingredients to potentially clean`);

    let updatedCount = 0;
    for (const ing of ingredients) {
        // Cleaning logic:
        // 1. Remove parentheses and content: jaje (1) -> jaje
        // 2. Remove fractions and following numbers: luk 1/2 -> luk
        // 3. Remove trailing numbers: brasno 500 -> brasno

        let newName = ing.name
            .replace(/\(.*\)/g, '') // Remove everything in parentheses
            .replace(/\d+\/\d+/g, '') // Remove fractions like 1/2
            .replace(/\d+/g, '')      // Remove any other numbers
            .trim();

        if (newName !== ing.name && newName.length > 2) {
            console.log(`Cleaning: "${ing.name}" -> "${newName}"`);
            const { error } = await supabase
                .from('ingredients')
                .update({ name: newName })
                .eq('id', ing.id);

            if (error) {
                console.error(`Error updating ${ing.name}:`, error.message);
            } else {
                updatedCount++;
            }
        } else if (newName.length <= 2 && newName !== ing.name) {
            console.log(`Skipping update for "${ing.name}" as cleaned name "${newName}" is too short.`);
        }
    }

    console.log(`✓ Cleanup complete. Updated ${updatedCount} ingredients.`);
}

cleanIngredients();
