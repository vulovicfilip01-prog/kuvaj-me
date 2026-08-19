const { createClient } = require('@supabase/supabase-js');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const supabaseUrl = 'https://nzabpwljjyuveibvxprc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56YWJwd2xqanl1dmVpYnZ4cHJjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDE3NTEyMSwiZXhwIjoyMDc5NzUxMTIxfQ.BTVcUWvuaRoWflq_Ks3NiLihQ12_QFe2x_HjlElAjZI';
const geminiApiKey = 'AIzaSyBGCBdvZoZ71RsDiuFhsKWgT0NLgPnLaLo';

const supabase = createClient(supabaseUrl, supabaseKey);
const genAI = new GoogleGenerativeAI(geminiApiKey);
const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

async function generateSteps() {
  console.log('Fetching recipes with missing steps...');
  const { data: recipes, error } = await supabase
    .from('recipes')
    .select('id, title, recipe_steps(count), ingredients(name, quantity)');
    
  if (error) {
    console.error('Error fetching recipes:', error);
    return;
  }
  
  const missingStepsRecipes = recipes.filter(r => {
    const count = r.recipe_steps && r.recipe_steps[0] ? r.recipe_steps[0].count : (Array.isArray(r.recipe_steps) ? r.recipe_steps.length : 0);
    return count === 0;
  });
  
  console.log(`Found ${missingStepsRecipes.length} recipes without steps.`);
  
  for (const recipe of missingStepsRecipes) {
    console.log(`\nGenerating steps for: ${recipe.title}...`);
    
    const ingredientsList = recipe.ingredients && recipe.ingredients.length > 0 
      ? recipe.ingredients.map(i => `${i.quantity} ${i.name}`).join(', ')
      : 'Nema specifičnih sastojaka (osnovni recept)';
      
    const prompt = `
    Napiši korake za pripremu jela "${recipe.title}".
    Sastojci koji se koriste: ${ingredientsList}.
    Napiši samo korake, jedan po jedan, na srpskom jeziku, u kratkim i jasnim rečenicama. 
    Svaki korak započni u novom redu. Bez uvoda, bez brojeva na početku, samo tekst koraka.
    `;
    
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const stepsArray = text.split('\n')
        .map(step => step.trim())
        .filter(step => step.length > 5)
        .map(step => step.replace(/^(\d+\.|-|\*)\s*/, '')); // Remove manual bullets/numbers if AI added them
        
      if (stepsArray.length === 0) {
        console.log(`Failed to parse steps for ${recipe.title}`);
        continue;
      }
      
      const stepsToInsert = stepsArray.map((instruction, index) => ({
        recipe_id: recipe.id,
        step_number: index + 1,
        instruction: instruction
      }));
      
      const { error: insertError } = await supabase
        .from('recipe_steps')
        .insert(stepsToInsert);
        
      if (insertError) {
        console.error(`Error saving steps for ${recipe.title}:`, insertError);
      } else {
        console.log(`Successfully added ${stepsArray.length} steps for ${recipe.title}`);
      }
      
      // Delay to avoid rate limit (free tier is ~5-15 requests per minute, so we wait 13 seconds)
      await new Promise(resolve => setTimeout(resolve, 13000));
      
    } catch (err) {
      console.error(`Gemini API error for ${recipe.title}:`, err.message);
      // Wait a bit longer if we hit an error just in case
      await new Promise(resolve => setTimeout(resolve, 13000));
    }
  }
  
  console.log('\nAll missing steps generated!');
}

generateSteps();
