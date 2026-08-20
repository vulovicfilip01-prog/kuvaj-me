
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_ANON_KEY in .env.local");
  process.exit(1);
}

// Create a client with the anonymous key (no user logged in)
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkRLS() {
  console.log("=== Checking Row Level Security (RLS) as Anonymous User ===\n");

  // Test 1: SELECT (Should be allowed if recipes are public)
  console.log("Test 1: SELECT from 'recipes'");
  const { data: selectData, error: selectError } = await supabase
    .from('recipes')
    .select('id, title')
    .limit(1);

  if (selectError) {
    console.error("❌ SELECT failed (RLS blocked or error):", selectError.message);
  } else {
    console.log("✅ SELECT succeeded. Found recipes:", selectData.length);
  }

  // Test 2: INSERT (Should be BLOCKED)
  console.log("\nTest 2: INSERT into 'recipes'");
  const { error: insertError } = await supabase
    .from('recipes')
    .insert([{ title: 'Hack Recipe', user_id: '11111111-1111-1111-1111-111111111111' }]);

  if (insertError) {
    console.log("✅ INSERT blocked by RLS as expected.");
    // In postgres, RLS block usually returns an error or just doesn't insert and doesn't return data.
    // Sometimes it returns a 401 or 403 or "new row violates row-level security policy".
    console.log("   Message:", insertError.message);
  } else {
    console.error("❌ WARNING: INSERT succeeded! RLS policy might be missing or too permissive.");
  }

  // Find a real recipe ID to test UPDATE and DELETE if SELECT succeeded
  let recipeIdToTest = selectData && selectData.length > 0 ? selectData[0].id : null;

  if (recipeIdToTest) {
    // Test 3: UPDATE (Should be BLOCKED)
    console.log(`\nTest 3: UPDATE 'recipes' for id ${recipeIdToTest}`);
    const { data: updateData, error: updateError } = await supabase
      .from('recipes')
      .update({ title: 'Hacked Title' })
      .eq('id', recipeIdToTest)
      .select();

    if (updateError) {
      console.log("✅ UPDATE blocked by RLS. Message:", updateError.message);
    } else if (!updateData || updateData.length === 0) {
      console.log("✅ UPDATE blocked silently by RLS (0 rows updated).");
    } else {
      console.error("❌ WARNING: UPDATE succeeded! RLS policy is too permissive.");
    }

    // Test 4: DELETE (Should be BLOCKED)
    console.log(`\nTest 4: DELETE 'recipes' for id ${recipeIdToTest}`);
    const { data: deleteData, error: deleteError } = await supabase
      .from('recipes')
      .delete()
      .eq('id', recipeIdToTest)
      .select();

    if (deleteError) {
      console.log("✅ DELETE blocked by RLS. Message:", deleteError.message);
    } else if (!deleteData || deleteData.length === 0) {
      console.log("✅ DELETE blocked silently by RLS (0 rows deleted).");
    } else {
      console.error("❌ WARNING: DELETE succeeded! RLS policy is too permissive.");
    }
  } else {
    console.log("\nSkipping UPDATE and DELETE tests because no recipes were found to target.");
  }
}

checkRLS();
