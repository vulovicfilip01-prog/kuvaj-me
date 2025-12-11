const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Helper to parse ENV
function getEnv() {
    const envPath = path.resolve('.env.local');
    if (!fs.existsSync(envPath)) return {};
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envVars = {};
    envContent.split('\n').forEach(line => {
        const parts = line.split('=');
        if (parts.length >= 2) {
            let key = parts[0].trim();
            let val = parts.slice(1).join('=').trim().replace(/^["']|["']$/g, '');
            envVars[key] = val;
        }
    });
    return envVars;
}

const envVars = getEnv();
const supabase = createClient(envVars['NEXT_PUBLIC_SUPABASE_URL'], envVars['NEXT_PUBLIC_SUPABASE_ANON_KEY']);

// Helper: Normalize strings for comparison
const normalize = (str) => str ? str.toLowerCase().trim() : '';

async function run() {
    // 1. Load Categories
    const categoriesRaw = fs.readFileSync('categories.json', 'utf8');
    const categories = JSON.parse(categoriesRaw);

    const catMap = {};
    categories.forEach(c => catMap[normalize(c.name)] = c.id);

    // Manual mapping for some specific inputs
    const mapCategory = (inputCat) => {
        const norm = normalize(inputCat);
        if (catMap[norm]) return catMap[norm];

        // Fuzzy / Keyword matching
        if (norm.includes('glavno')) return catMap['glavna jela'];
        if (norm.includes('tradicionalno') || norm.includes('specijalitet')) return catMap['glavna jela'];
        if (norm.includes('testenina') || norm.includes('pasta') || norm.includes('rižoto')) return catMap['testenine i rižoto'];
        if (norm.includes('salata')) return catMap['salate'];
        if (norm.includes('desert') || norm.includes('kolač') || norm.includes('torta')) return catMap['deserti'];
        if (norm.includes('pecivo') || norm.includes('hleb') || norm.includes('proja')) return catMap['peciva'];
        if (norm.includes('supa') || norm.includes('čorba') || norm.includes('potaž')) return catMap['supe i čorbe'];
        if (norm.includes('pića')) return catMap['pića'];
        if (norm.includes('predjelo') || norm.includes('prilog')) return catMap['predjela'];
        if (norm.includes('doručak')) return catMap['predjela']; // Map breakfast to appetizers or baking? Let's use Predjela or Peciva. Let's default to Ostalo if unsure.

        return catMap['ostalo'];
    };

    // 2. Read Raw Data
    const rawData = fs.readFileSync('raw_recipes_import.txt', 'utf8');
    const lines = rawData.split('\n');

    // Get headers
    // Assuming format: ID	Ime Recepta	Kategorija	Sastojci (Lista za kupovinu)	Koraci Pripreme (Instrukcije)
    // It seems tab-separated

    let successCount = 0;

    // Get a user ID to assign recipes to. Using the first user found or a specific admin ID if improved later.
    const { data: { users }, error: userError } = await supabase.auth.admin.listUsers();
    // Since we are using anon key here (client side key), we can't use admin.listUsers() likely.
    // However, recipes require a user_id. We can try to sign in or just insert if RLS allows (it won't).
    // Actually, for seeding, we usually use the SERVICE_ROLE_KEY or we need a real user.
    // But wait, the previous `delete_all_recipes.sql` worked because it was SQL executed directly on DB (or via user if user had permissions).

    // WORKAROUND: We will pick a random User ID if we can find one, or hardcode one if we know it.
    // If we can't list users, we are stuck.
    // But! We have `.env.local`. Does it have `SUPABASE_SERVICE_ROLE_KEY`? No, usually only public key.
    // The user has `c:\Users\Filip\Desktop\COOKING\frontend\.env.local`. I saw it earlier.
    // It likely only has ANON key.

    // Let's try to Sign In as existing user "test@kuvaj.me" / "kuvajme123" (from history)
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: 'test@kuvaj.me',
        password: 'kuvajme123'
    });

    if (loginError || !loginData.user) {
        console.error('Failed to log in as test user. Cannot insert recipes.', loginError);
        process.exit(1);
    }

    const userId = loginData.user.id;
    console.log('Logged in as:', userId);

    for (let i = 1; i < lines.length; i++) { // Skip header
        const line = lines[i].trim();
        if (!line) continue;

        const cols = line.split('\t');
        if (cols.length < 5) continue;

        const id = cols[0]; // Not used, we generate UUID
        const title = cols[1];
        const categoryRaw = cols[2];
        const ingredientsRaw = cols[3];
        const stepsRaw = cols[4];

        const catId = mapCategory(categoryRaw);
        const description = `Ukusan recept za ${title}. ${categoryRaw}.`; // Synthesized description

        // Calculate prep/cook time roughly
        let prepTime = 20;
        let cookTime = 30;

        // Heuristic time based on keywords
        if (title.toLowerCase().includes('brz')) { prepTime = 10; cookTime = 15; }
        if (categoryRaw.toLowerCase().includes('kuvanje')) { cookTime = 60; }
        if (title.toLowerCase().includes('sarma') || title.toLowerCase().includes('gulaš')) { cookTime = 120; }

        // Parse Ingredients
        // Format: "Mleveno meso (1 kg), listovi kiselog kupusa (25), ..."
        const ingredients = ingredientsRaw.split(/[,.]/).map(s => s.trim()).filter(s => s.length > 0).map(s => {
            // Try to extract quantity if in parens e.g. "Mleveno meso (1 kg)"
            const match = s.match(/(.*?)\s*\((.*?)\)/);
            if (match) {
                return { name: match[1].trim(), quantity: match[2].trim() };
            }
            return { name: s, quantity: 'po ukusu' };
        });

        // Parse Steps
        // Format: "(1) Na ulju... (2) Umešati..."
        // Split by "(N)"
        const steps = stepsRaw.split(/\(\d+\)/).map(s => s.trim()).filter(s => s.length > 0);

        // Check "Posno"
        const isPosno = categoryRaw.toLowerCase().includes('posno') ||
            title.toLowerCase().includes('posn') ||
            categoryRaw.toLowerCase().includes('vegansko') ||
            categoryRaw.toLowerCase().includes('riba') ||
            title.toLowerCase().includes('riba') ||
            title.toLowerCase().includes('skuša') ||
            title.toLowerCase().includes('šampinjon') ||
            title.toLowerCase().includes('prebranac') ||
            title.toLowerCase().includes('krompir') ||
            (categoryRaw.toLowerCase().includes('salata') && !ingredientsRaw.toLowerCase().includes('meso') && !ingredientsRaw.toLowerCase().includes('jaja') && !ingredientsRaw.toLowerCase().includes('sir')) // Rough guess
            ;

        const recipePayload = {
            user_id: userId,
            title: title,
            description: description,
            category_id: catId,
            prep_time: prepTime,
            cook_time: cookTime,
            difficulty: cookTime > 60 ? 'teško' : (cookTime > 30 ? 'srednje' : 'lako'),
            servings: 4,
            is_public: true,
            is_posno: isPosno
        };

        // Insert Recipe
        const { data: recipe, error: rError } = await supabase.from('recipes').insert(recipePayload).select().single();

        if (rError) {
            console.error('Failed to insert recipe:', title, rError.message);
            continue;
        }

        // Insert Ingredients
        if (ingredients.length) {
            const ingRows = ingredients.map((ing, idx) => ({
                recipe_id: recipe.id,
                name: ing.name,
                quantity: ing.quantity,
                order_index: idx
            }));
            await supabase.from('ingredients').insert(ingRows);
        }

        // Insert Steps
        if (steps.length) {
            const stepRows = steps.map((txt, idx) => ({
                recipe_id: recipe.id,
                step_number: idx + 1,
                instruction: txt
            }));
            await supabase.from('recipe_steps').insert(stepRows);
        }

        successCount++;
        // console.log(`Imported: ${title}`);
    }

    console.log(`Successfully imported ${successCount} recipes.`);
}

run();
