const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const XLSX = require('xlsx');

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

// Category mapping - map Excel categories to DB category IDs
const CATEGORY_MAP = {
    "Ostalo": "bc5d44aa-1841-456e-9666-acfff702592e",
    "Glavna jela": "dffd98bf-eb45-4d02-bb35-5ac884100be0",
    "Pića": "27b44f6b-422e-4257-b5cf-cd6150e83df2",
    "Predjela": "4a95fb77-8af3-4fb3-b9d8-4c85c2e9c653"
};

// Map Excel category names to our category map
function mapCategory(excelCategory) {
    if (!excelCategory) return CATEGORY_MAP["Ostalo"];

    const normalized = excelCategory.toString().trim();

    if (CATEGORY_MAP[normalized]) return CATEGORY_MAP[normalized];

    // Fuzzy matching
    if (normalized.match(/glavno|svinjetina|piletina|riba|tradicionalno/i)) {
        return CATEGORY_MAP["Glavna jela"];
    }
    if (normalized.match(/supa|čorba|corba|juha|salad/i)) {
        return CATEGORY_MAP["Ostalo"];
    }
    if (normalized.match(/desert|kolač|slatkiš/i)) {
        return CATEGORY_MAP["Ostalo"];
    }
    if (normalized.match(/predjelo/i)) {
        return CATEGORY_MAP["Predjela"];
    }
    if (normalized.match(/piće/i)) {
        return CATEGORY_MAP["Pića"];
    }

    return CATEGORY_MAP["Ostalo"];
}

// Parse Excel File
function parseExcel(filePath) {
    const workbook = XLSX.readFile(filePath);
    console.log('Sheet Names:', workbook.SheetNames);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convert to JSON
    const rawData = XLSX.utils.sheet_to_json(sheet);
    console.log('Raw Data Rows:', rawData.length);
    if (rawData.length > 0) {
        console.log('Sample Row Keys:', Object.keys(rawData[0]));
        console.log('Sample Row Data:', rawData[0]);
    }

    // Map to normalized structure
    return rawData.map(row => {
        // Handle different possible header names using inclusive matching
        const getField = (targets) => {
            const keys = Object.keys(row);
            for (const target of targets) {
                const foundKey = keys.find(k => k.toLowerCase().includes(target.toLowerCase()));
                if (foundKey) return row[foundKey];
            }
            return '';
        };

        return {
            id: row['ID'] || row['id'],
            title: getField(['Naziv', 'Title', 'Ime Recepta']),
            category: getField(['Kategorija', 'Category']),
            ingredients: getField(['Sastojci', 'Ingredients', 'Namirnice']),
            steps: getField(['Koraci', 'Priprema', 'Steps', 'Uputstvo'])
        };
    }).filter(r => r.title); // Filter out empty rows
}

// Parse ingredients
function parseIngredients(ingredientsText) {
    if (!ingredientsText) return [];

    // Handle newline separated or comma separated
    // Excel cells often use Alt+Enter for newlines
    const separator = ingredientsText.includes('\n') ? '\n' : ',';

    const parts = ingredientsText
        .split(separator)
        .map(s => s.trim())
        .filter(s => s.length > 2);

    return parts.map(part => {
        // Same logic as CSV parser for quantity extraction
        const match = part.match(/^([\d\/\.,\s]+(g|kg|ml|l|šolja|šolje|kašika|kašičica|čaša|kom|komada)?[a-zčćžšđ]*)\s+(.+)$/i);
        if (match) {
            return {
                quantity: match[1].trim(),
                name: match[3].trim()
            };
        }
        return {
            quantity: '',
            name: part.trim()
        };
    });
}

// Parse steps
function parseSteps(stepsText) {
    if (!stepsText) return [];

    // Handle numbered lists (1. 2. 3.) or newlines
    let parts = [];

    if (stepsText.match(/(?:\(\d+\)|\d+\.)/m)) {
        // Spilt by "1. ", "(1) " etc
        parts = stepsText.split(/(?:\(\d+\)|\d+\.)\s*/).filter(s => s.trim().length > 5);
    } else {
        // Split by newline or common delimiters
        const separator = stepsText.includes('\n') ? '\n' : '. ';
        parts = stepsText.split(separator).filter(s => s.trim().length > 5);
    }

    return parts.map(instruction => ({ instruction: instruction.trim() }));
}

async function getUserId() {
    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, display_name')
        .limit(1);

    if (error || !profiles || profiles.length === 0) {
        console.error('No profiles found.');
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
            servings: 2,
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
            return false;
        }
    }

    console.log(`✓ Successfully imported: ${recipe.title}`);
    return true;
}

async function main() {
    console.log('Starting recipe import from Excel...\n');

    // Look for files in ./recepti
    const recipesDir = path.join(__dirname, 'recepti');

    if (!fs.existsSync(recipesDir)) {
        console.error('Directory ./recepti not found!');
        process.exit(1);
    }

    const files = fs.readdirSync(recipesDir);
    const excelFiles = files.filter(f => f.endsWith('.xlsx') && !f.startsWith('~$'));

    // EXCLUDE previously imported files
    const filesToImport = excelFiles.filter(f => f !== '50.xlsx' && f !== '50-100.xlsx');

    if (filesToImport.length === 0) {
        console.error('No new .xlsx files found in frontend/recepti!');
        console.log('Available files:', excelFiles);
        process.exit(0);
    }

    console.log(`Found ${filesToImport.length} files to import:`, filesToImport);

    const userId = await getUserId();
    console.log(`Using user ID: ${userId}\n`);

    let totalSuccess = 0;
    let totalFail = 0;

    for (const file of filesToImport) {
        const filePath = path.join(recipesDir, file);
        console.log(`\n\n=== Processing: ${file} ===`);

        const recipes = parseExcel(filePath);
        console.log(`Found ${recipes.length} recipes in ${file}`);

        let fileSuccess = 0;
        let fileFail = 0;

        for (const recipe of recipes) {
            const success = await importRecipe(recipe, userId);
            if (success) {
                fileSuccess++;
            } else {
                fileFail++;
            }
            // Small delay
            await new Promise(resolve => setTimeout(resolve, 50));
        }

        console.log(`Finished ${file}: ${fileSuccess} OK, ${fileFail} Failed`);
        totalSuccess += fileSuccess;
        totalFail += fileFail;
    }

    console.log(`\n=== ALL IMPORTS COMPLETE ===`);
    console.log(`✓ Total Successful: ${totalSuccess}`);
    console.log(`✗ Total Failed: ${totalFail}`);
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
