const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://nzabpwljjyuveibvxprc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56YWJwd2xqanl1dmVpYnZ4cHJjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDE3NTEyMSwiZXhwIjoyMDc5NzUxMTIxfQ.BTVcUWvuaRoWflq_Ks3NiLihQ12_QFe2x_HjlElAjZI'
);

async function check() {
  const { data, error } = await supabase.from('recipes').select('id, title, recipe_steps(count)');
  if (error) {
    console.error(error);
    return;
  }
  
  let missing = 0;
  const sample = [];
  
  for (const r of data) {
    // recipe_steps is an array, we get the count from the first element usually if using select('..., recipe_steps(count)')
    // actually count comes as an array of objects like [{count: 0}]
    const count = r.recipe_steps && r.recipe_steps[0] ? r.recipe_steps[0].count : (Array.isArray(r.recipe_steps) ? r.recipe_steps.length : 0);
    if (count === 0) {
      missing++;
      if (sample.length < 5) sample.push(r.title);
    }
  }
  
  console.log(`Total recipes: ${data.length}`);
  console.log(`Recipes missing steps: ${missing}`);
  if (missing > 0) console.log('Sample missing:', sample);
}

check();
