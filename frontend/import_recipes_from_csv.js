const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const iconv = require('iconv-lite');

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
// Use service role key to bypass RLS
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56YWJwd2xqanl1dmVpYnZ4cHJjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDE3NTEyMSwiZXhwIjoyMDc5NzUxMTIxfQ.BTVcUWvuaRoWflq_Ks3NiLihQ12_QFe2x_HjlElAjZI';

if (!supabaseUrl) {
    console.error('Missing Supabase URL in .env.local');
    process.exit(1);
}

console.log('Using service role key for import (bypasses RLS)...');
const supabase = createClient(supabaseUrl, serviceRoleKey);

// Category mapping - map CSV categories to DB category IDs
const CATEGORY_MAP = {
    "Ostalo": "bc5d44aa-1841-456e-9666-acfff702592e",
    "Glavna jela": "dffd98bf-eb45-4d02-bb35-5ac884100be0",
    "Pića": "27b44f6b-422e-4257-b5cf-cd6150e83df2",
    "Predjela": "4a95fb77-8af3-4fb3-b9d8-4c85c2e9c653"
};

// Map CSV category names to our category map
function mapCategory(csvCategory) {
    // Normalize the category name
    const normalized = csvCategory.trim();

    // Direct match
    if (CATEGORY_MAP[normalized]) return CATEGORY_MAP[normalized];

    // Try to match partial strings - map everything to the 4 existing categories
    if (normalized.includes('Glavno Jelo') || normalized.includes('Svinjetina') ||
        normalized.includes('Piletina') || normalized.includes('Riba') ||
        normalized.includes('Tradicionalno')) {
        return CATEGORY_MAP["Glavna jela"];
    }
    if (normalized.includes('Supa') || normalized.includes('čorba') ||
        normalized.includes('Corba') || normalized.includes('Juha')) {
        return CATEGORY_MAP["Ostalo"]; // No Supe category yet
    }
    if (normalized.includes('Desert') || normalized.includes('Kolač') ||
        normalized.includes('Slatkiš')) {
        return CATEGORY_MAP["Ostalo"]; // No Deserti category yet
    }
    if (normalized.includes('Salata')) {
        return CATEGORY_MAP["Ostalo"]; // No Salate category yet
    }
    if (normalized.includes('Predjelo')) {
        return CATEGORY_MAP["Predjela"];
    }
    if (normalized.includes('Piće')) {
        return CATEGORY_MAP["Pića"];
    }

    // Default to Ostalo
    return CATEGORY_MAP["Ostalo"];
}

// Parse CSV with proper handling of quoted fields and UTF-8 encoding
function parseCSV(filePath) {
    // Read as buffer first, then decode from Windows-1250 (Serbian encoding)
    const buffer = fs.readFileSync(filePath);
    const content = iconv.decode(buffer, 'win1250');
    const lines = content.split(/\r?\n/);

    // Parse header
    const headers = parseCSVLine(lines[0]);
    console.log('Headers:', headers);

    const recipes = [];
    let currentLine = '';
    let inQuote = false;

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];

        // Track quotes to handle multi-line fields
        for (let char of line) {
            if (char === '"') inQuote = !inQuote;
        }

        currentLine += (currentLine ? '\n' : '') + line;

        // If we're not in a quote, we've completed a record
        if (!inQuote && currentLine.trim()) {
            const fields = parseCSVLine(currentLine);
            if (fields.length >= 5) {
                recipes.push({
                    id: fields[0],
                    title: fields[1],
                    category: fields[2],
                    ingredients: fields[3],
                    steps: fields[4]
                });
            }
            currentLine = '';
        }
    }

    return recipes;
}

function parseCSVLine(line) {
    const fields = [];
    let current = '';
    let inQuote = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            inQuote = !inQuote;
        } else if (char === ',' && !inQuote) {
            fields.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }

    // Don't forget the last field
    fields.push(current.trim());

    return fields;
}

// Parse ingredients from CSV format
function parseIngredients(ingredientsText) {
    if (!ingredientsText) return [];

    // Ingredients are separated by commas in the CSV
    // But we need to be careful about commas in quantities like "1,5 kg"
    const parts = ingredientsText
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 3); // Ignore very short fragments

    return parts.map(part => {
        // Try to extract quantity from the beginning
        // Match patterns like: "500g", "2 kg", "1/2 šolje", "200 ml"
        const match = part.match(/^([\d\/\.,\s]+(g|kg|ml|l|šolja|šolje|kašika|kašičica|čaša|kom|komada)?[a-zčćžšđ]*)\s+(.+)$/i);
        if (match) {
            return {
                quantity: match[1].trim(),
                name: match[3].trim()
            };
        }
        // If no quantity pattern, put it all in name
        return {
            quantity: '',
            name: part.trim()
        };
    });
}

// Parse steps from CSV format
function parseSteps(stepsText) {
    if (!stepsText) return [];

    // Steps are separated by numbered markers like (1), (2), (3)
    const parts = stepsText
        .split(/\(\d+\)/)
        .map(s => s.trim())
        .filter(s => s.length > 5); // Ignore very short fragments

    return parts.map(instruction => ({ instruction: instruction.trim() }));
}

async function getUserId() {
    // Get a user from profiles table (anon key doesn't have admin access)
    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, display_name')
        .limit(1);

    if (error || !profiles || profiles.length === 0) {
        console.error('No profiles found. Error:', error);
        console.error('Please ensure you have at least one user profile in the database.');
        process.exit(1);
    }

    console.log(`Found profile: ${profiles[0].display_name || profiles[0].id}`);
    return profiles[0].id;
}

async function importRecipe(recipe, userId) {
    const categoryId = mapCategory(recipe.category);
    const ingredients = parseIngredients(recipe.ingredients);
    const steps = parseSteps(recipe.steps);

    console.log(`\nImporting: ${recipe.title}`);
    console.log(`Category: ${recipe.category} -> ${categoryId}`);
    console.log(`Ingredients: ${ingredients.length}`);
    console.log(`Steps: ${steps.length}`);

    // Insert recipe
    const { data: insertedRecipe, error: recipeError } = await supabase
        .from('recipes')
        .insert({
            user_id: userId,
            title: recipe.title,
            description: `Ukusan recept za ${recipe.title}`,
            category_id: categoryId,
            prep_time: 15,
            cook_time: 30,
            servings: 4,
            difficulty: 'srednje',
            is_public: true,
            image_url: null,
            is_posno: false,
        })
        .select()
        .single();

    if (recipeError) {
        console.error('Error inserting recipe:', recipeError);
        return false;
    }

    // Insert ingredients
    if (ingredients.length > 0) {
        const ingredientsToInsert = ingredients.map((ing, index) => ({
            recipe_id: insertedRecipe.id,
            name: ing.name,
            quantity: ing.quantity || '',
            order_index: index,
        }));

        const { error: ingredientsError } = await supabase
            .from('ingredients')
            .insert(ingredientsToInsert);

        if (ingredientsError) {
            console.error('Error inserting ingredients:', ingredientsError);
            // Rollback
            await supabase.from('recipes').delete().eq('id', insertedRecipe.id);
            return false;
        }
    }

    // Insert steps
    if (steps.length > 0) {
        const stepsToInsert = steps.map((step, index) => ({
            recipe_id: insertedRecipe.id,
            step_number: index + 1,
            instruction: step.instruction,
        }));

        const { error: stepsError } = await supabase
            .from('recipe_steps')
            .insert(stepsToInsert);

        if (stepsError) {
            console.error('Error inserting steps:', stepsError);
            // Rollback
            await supabase.from('recipes').delete().eq('id', insertedRecipe.id);
            return false;
        }
    }

    console.log(`✓ Successfully imported: ${recipe.title} (ID: ${insertedRecipe.id})`);
    return true;
}

async function main() {
    console.log('Starting recipe import from CSV...\n');

    const csvPath = path.join(__dirname, '0-50.csv');
    const recipes = parseCSV(csvPath);

    console.log(`Found ${recipes.length} recipes in CSV\n`);

    const userId = await getUserId();
    console.log(`Using user ID: ${userId}\n`);

    let successCount = 0;
    let failCount = 0;

    for (const recipe of recipes) {
        const success = await importRecipe(recipe, userId);
        if (success) {
            successCount++;
        } else {
            failCount++;
        }

        // Small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`\n=== Import Complete ===`);
    console.log(`✓ Successful: ${successCount}`);
    console.log(`✗ Failed: ${failCount}`);
    console.log(`Total: ${recipes.length}`);
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
