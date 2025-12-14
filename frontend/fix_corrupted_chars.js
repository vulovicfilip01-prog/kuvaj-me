const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

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
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56YWJwd2xqanl1dmVpYnZ4cHJjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDE3NTEyMSwiZXhwIjoyMDc5NzUxMTIxfQ.BTVcUWvuaRoWflq_Ks3NiLihQ12_QFe2x_HjlElAjZI';

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, serviceRoleKey);

// Manual mapping of common corrupted patterns
const fixes = {
    'Povr?a': 'Povrća',
    'povr?a': 'povrća',
    'Povr?e': 'Povrće',
    'povr?e': 'povrće',
    '?orba': 'Čorba',
    '?orb': 'čorb',
    'Pe?uraka': 'Pečuraka',
    'pe?uraka': 'pečuraka',
    'Pe?en': 'Pečen',
    'pe?en': 'pečen',
    'Ka?kavalj': 'Kačkavalj',
    '?aši': 'čaši',
    '?ašu': 'čašu',
    '?okoladni': 'Čokoladni',
    '?okoladn': 'čokoladn',
    'Ameri?ke': 'Američke',
    'Pala?inke': 'Palačinke',
    'pala?inke': 'palačinke',
    'Zape?ene': 'Zapečene',
    'zape?en': 'zapečen',
    'Potaž': 'Potaž',
    'Miro?ije': 'Mirođije',
    'miro?ij': 'mirođij',
    '?ia': 'Čia',
    'Vo?em': 'Voćem',
    'vo?': 'voć',
    'Krompiri?i': 'Krompirići',
    'krompiri?': 'krompirić',
    'Ba?ka': 'Bačka',
    'Prazni?ni': 'Praznični',
    'prazni?n': 'prazničn',
    '?ufte': 'Ćufte',
    '?uft': 'ćuft',
    'Gulaš': 'Gulaš',
    'Gr?ka': 'Grčka',
    'gr?k': 'grčk',
    'Kola?': 'Kolač',
    'kola?': 'kolač',
    'Skuša': 'Skuša',
    'Tele?eg': 'Telećeg',
    'tele?': 'teleć',
    'Klasi?na': 'Klasična',
    'klasi?n': 'klasičn',
    // Additional patterns from steps
    'ise?eno': 'isečeno',
    'ise?en': 'isečen',
    'Kr?kati': 'Krcati',
    'kr?kati': 'krcati',
    'kr?ka': 'krca',
    'po?ne': 'počne',
    'zapo?ne': 'započne',
    'prime?uje': 'primećuje',
    'se?eno': 'sečeno',
    'se?en': 'sečen',
    'ume?ati': 'umešati',
    'me?ati': 'mešati',
    'me?a': 'meša',
    'pe?i': 'peći',
    'ispe?i': 'ispeći',
    'ispe?en': 'ispečen',
    'proklju?a': 'proključa',
    'zaklju?a': 'zaključa',
    'še?er': 'šećer',
    'Še?er': 'Šećer',
    'pirina?': 'pirinač',
    'Pirina?': 'Pirinač',
    'Pile?i': 'Pileći',
    'pile?i': 'pileći',
    '?en': 'čen',
    'Gr?ki': 'Grčki',
    'gr?ki': 'grčki',
    'maj?ina': 'majčina',
    'višnje': 'višnje',
    'za?in': 'začin',
    'Za?in': 'Začin',
    '?okolada': 'čokolada',
    '?okolad': 'čokolad',
    'ka?kavalj': 'kačkavalj',
    'sir?e': 'sirće',
    'obi?no': 'obično',
    'kaši?ica': 'kašičica',
    'pšeni?no': 'pšenično',
    'Tele?e': 'Teleće',
    'tele?e': 'teleće',
    '?C': '°C',
    'seckane': 'seckane', // already correct 
    'pe?urke': 'pečurke',
    'Pe?urke': 'Pečurke',
    'ise?i': 'iseći',
    'Re?ati': 'Ређati',
    're?ati': 'ređati',
    'Pe?i': 'Peći',
    'premazuju?i': 'premazujući',
    'umo?iti': 'umočiti',
    'ja?oj': 'jačoj',
    'sti?e': 'stisće',
    'izgnje?iti': 'izgnjećiti',
    'Razvu?i': 'Razvući',
    'razvu?i': 'razvući',
    'se?i': 'seći',
    '?ips': 'čips',
    'štapi?e': 'štapiće',
    'Naizmeni?no': 'Naizmenično',
    'naizmeni?no': 'naizmenično',
    'o?istiti': 'očistiti',
    '?aše': 'čaše',
    'Vru?u': 'Vruću',
    'vru?': 'vruć'
};

async function fixRecipes() {
    // Get all recipes with ? character
    const { data: recipes } = await supabase
        .from('recipes')
        .select('id, title, description')
        .or('title.like.%?%,description.like.%?%');

    console.log(`Found ${recipes.length} recipes to fix\n`);

    let fixed = 0;

    for (const recipe of recipes) {
        let newTitle = recipe.title;
        let newDescription = recipe.description;
        let changed = false;

        // Apply fixes
        for (const [wrong, correct] of Object.entries(fixes)) {
            if (newTitle.includes(wrong)) {
                newTitle = newTitle.replaceAll(wrong, correct);
                changed = true;
            }
            if (newDescription && newDescription.includes(wrong)) {
                newDescription = newDescription.replaceAll(wrong, correct);
                changed = true;
            }
        }

        if (changed) {
            console.log(`Fixing: ${recipe.title} → ${newTitle}`);

            const { error } = await supabase
                .from('recipes')
                .update({
                    title: newTitle,
                    description: newDescription
                })
                .eq('id', recipe.id);

            if (error) {
                console.error(`  Error:`, error);
            } else {
                fixed++;
            }
        }
    }

    console.log(`\n✓ Fixed ${fixed} recipes`);

    // Also fix ingredients
    console.log('\nFixing ingredients...');
    const { data: ingredients } = await supabase
        .from('ingredients')
        .select('id, name')
        .like('name', '%?%');

    let ingredientsFixed = 0;
    for (const ing of ingredients || []) {
        let newName = ing.name;
        for (const [wrong, correct] of Object.entries(fixes)) {
            newName = newName.replaceAll(wrong, correct);
        }

        if (newName !== ing.name) {
            await supabase
                .from('ingredients')
                .update({ name: newName })
                .eq('id', ing.id);
            ingredientsFixed++;
        }
    }

    console.log(`✓ Fixed ${ingredientsFixed} ingredients`);

    // Fix steps
    console.log('\nFixing steps...');
    const { data: steps } = await supabase
        .from('recipe_steps')
        .select('id, instruction')
        .like('instruction', '%?%');

    let stepsFixed = 0;
    for (const step of steps || []) {
        let newInstruction = step.instruction;
        for (const [wrong, correct] of Object.entries(fixes)) {
            newInstruction = newInstruction.replaceAll(wrong, correct);
        }

        if (newInstruction !== step.instruction) {
            await supabase
                .from('recipe_steps')
                .update({ instruction: newInstruction })
                .eq('id', step.id);
            stepsFixed++;
        }
    }

    console.log(`✓ Fixed ${stepsFixed} steps`);
}

fixRecipes();
