'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

interface RecipeData {
  title: string
  description: string
  category_id: string
  prep_time: number
  cook_time: number
  servings: number
  difficulty: 'lako' | 'srednje' | 'teško'
  is_public: boolean
  image_url: string | null
  video_url?: string | null
  is_posno: boolean
  ingredients: Array<{ name: string; quantity: string }>
  steps: Array<{ instruction: string }>
}


export async function createRecipe(data: RecipeData) {
  const supabase = await createClient()
  
  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: 'You must be logged in to create a recipe' }
  }

  // Insert recipe
  const { data: recipe, error: recipeError } = await supabase
    .from('recipes')
    .insert({
      user_id: user.id,
      title: data.title,
      description: data.description,
      category_id: data.category_id,
      prep_time: data.prep_time,
      cook_time: data.cook_time,
      servings: data.servings,
      difficulty: data.difficulty,
      is_public: data.is_public,
      image_url: data.image_url,
      video_url: data.video_url,
      is_posno: data.is_posno,
    })


    .select()
    .single()

  if (recipeError) {
    return { error: recipeError.message }
  }

  // Insert ingredients
  if (data.ingredients.length > 0) {
    const ingredientsToInsert = data.ingredients.map((ing, index) => ({
      recipe_id: recipe.id,
      name: ing.name,
      quantity: ing.quantity,
      order_index: index,
    }))

    const { error: ingredientsError } = await supabase
      .from('ingredients')
      .insert(ingredientsToInsert)

    if (ingredientsError) {
      // Rollback: delete the recipe
      await supabase.from('recipes').delete().eq('id', recipe.id)
      return { error: 'Failed to add ingredients' }
    }
  }

  // Insert steps
  if (data.steps.length > 0) {
    const stepsToInsert = data.steps.map((step, index) => ({
      recipe_id: recipe.id,
      step_number: index + 1,
      instruction: step.instruction,
    }))

    const { error: stepsError } = await supabase
      .from('recipe_steps')
      .insert(stepsToInsert)

    if (stepsError) {
      // Rollback: delete the recipe (ingredients will cascade)
      await supabase.from('recipes').delete().eq('id', recipe.id)
      return { error: 'Failed to add cooking steps' }
    }
  }

  revalidatePath('/recipes')
  redirect(`/recipes/${recipe.id}`)
}

export async function getCategories() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  if (error) {
    return { data: [], error: error.message }
  }

  return { data, error: null }
}

export async function getRecipes() {
  const supabase = await createClient();
  
  const { data: recipes, error } = await supabase
    .from("recipes")
    .select(`
      *,
      profiles (
        display_name
      ),
      categories (
        name
      )
    `)
    .eq("is_public", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching recipes:", error);
    return [];
  }

  return recipes;
}

export async function getRecipe(id: string) {
  const supabase = await createClient();

  const { data: recipe, error } = await supabase
    .from("recipes")
    .select(`
      *,
      profiles (
        display_name
      ),
      categories (
        name
      ),
      ingredients:ingredients(*),
      steps:recipe_steps(*)
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching recipe:", error);
    return null;
  }

  // Sort steps by order_index just in case
  if (recipe.steps) {
    recipe.steps.sort((a: any, b: any) => a.order_index - b.order_index);
  }

  return recipe;
}

export async function searchRecipesByIngredients(searchIngredients: string[]) {
  const supabase = await createClient();

  if (!searchIngredients || searchIngredients.length === 0) {
    return [];
  }

  // Normalize search ingredients: split by spaces, lowercase, remove empty
  const searchKeywords = searchIngredients
    .flatMap(ing => ing.toLowerCase().split(/\s+/))
    .filter(k => k.length > 2); // Only match words longer than 2 chars to avoid noise

  if (searchKeywords.length === 0) {
    return [];
  }

  // 1. Find recipe IDs that contain at least one of the keywords
  const orQuery = searchKeywords.map(k => `name.ilike.%${k}%`).join(',');
  
  const { data: matchingIngredients, error: matchError } = await supabase
    .from('ingredients')
    .select('recipe_id')
    .or(orQuery);

  if (matchError) {
    console.error("Error searching ingredients:", matchError);
    return [];
  }

  if (!matchingIngredients || matchingIngredients.length === 0) {
    return [];
  }

  // Get unique recipe IDs
  const recipeIds = Array.from(new Set(matchingIngredients.map(i => i.recipe_id)));

  // 2. Fetch full recipe details for these IDs
  const { data: recipes, error: recipeError } = await supabase
    .from('recipes')
    .select(`
      *,
      profiles (display_name),
      categories (name),
      ingredients (*)
    `)
    .in('id', recipeIds)
    .eq('is_public', true);

  if (recipeError) {
    console.error("Error fetching recipes:", recipeError);
    return [];
  }

  // 3. Rank recipes in memory
  const rankedRecipes = recipes.map(recipe => {
    const recipeIngredients = recipe.ingredients || [];
    
    // Count matches: A recipe ingredient matches if ANY of its words match ANY search keyword
    const matches = recipeIngredients.filter((ri: any) => {
      const riWords = ri.name.toLowerCase().split(/\s+/);
      return riWords.some((w: string) => searchKeywords.some(sk => w.includes(sk) || sk.includes(w)));
    });

    const matchCount = matches.length;
    const totalCount = recipeIngredients.length;
    const missingCount = Math.max(0, totalCount - matchCount);

    return {
      ...recipe,
      matchInfo: {
        matchCount,
        totalCount,
        missingCount
      }
    };
  });

  // Sort: Ascending missing count, then descending match count
  rankedRecipes.sort((a, b) => {
    if (a.matchInfo.missingCount !== b.matchInfo.missingCount) {
      return a.matchInfo.missingCount - b.matchInfo.missingCount;
    }
    return b.matchInfo.matchCount - a.matchInfo.matchCount;
  });

  return rankedRecipes;
}

// Favorite Recipes Actions

export async function addToFavorites(recipeId: string) {
  const supabase = await createClient();
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return { error: 'You must be logged in to add favorites' };
  }

  const { error } = await supabase
    .from('favorite_recipes')
    .insert({ user_id: user.id, recipe_id: recipeId });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/');
  revalidatePath('/favorites');
  revalidatePath(`/recipes/${recipeId}`);
  return { success: true };
}

export async function removeFromFavorites(recipeId: string) {
  const supabase = await createClient();
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return { error: 'You must be logged in to remove favorites' };
  }

  const { error } = await supabase
    .from('favorite_recipes')
    .delete()
    .eq('user_id', user.id)
    .eq('recipe_id', recipeId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/');
  revalidatePath('/favorites');
  revalidatePath(`/recipes/${recipeId}`);
  return { success: true };
}

export async function getFavoriteRecipes() {
  const supabase = await createClient();
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return [];
  }

  const { data: favorites, error } = await supabase
    .from('favorite_recipes')
    .select(`
      recipe_id,
      recipes (
        *,
        profiles (display_name),
        categories (name)
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching favorites:', error);
    return [];
  }

  // Extract recipes from the join
  return favorites.map(f => f.recipes).filter(r => r !== null);
}

export async function isFavorite(recipeId: string) {
  const supabase = await createClient();
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return false;
  }

  const { data, error } = await supabase
    .from('favorite_recipes')
    .select('id')
    .eq('user_id', user.id)
    .eq('recipe_id', recipeId)
    .maybeSingle();

  if (error) {
    console.error('Error checking favorite:', error);
    return false;
  }

  return data !== null;
}

export async function updateRecipe(id: string, data: RecipeData) {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: 'You must be logged in to update a recipe' }
  }

  // Check ownership
  const { data: existingRecipe, error: fetchError } = await supabase
    .from('recipes')
    .select('user_id')
    .eq('id', id)
    .single()

  if (fetchError || !existingRecipe) {
    return { error: 'Recipe not found' }
  }

  if (existingRecipe.user_id !== user.id) {
    return { error: 'You can only update your own recipes' }
  }

  // Update recipe
  const { error: recipeError } = await supabase
    .from('recipes')
    .update({
      title: data.title,
      description: data.description,
      category_id: data.category_id,
      prep_time: data.prep_time,
      cook_time: data.cook_time,
      servings: data.servings,
      difficulty: data.difficulty,
      is_public: data.is_public,
      image_url: data.image_url,
      video_url: data.video_url,
      is_posno: data.is_posno,
      updated_at: new Date().toISOString(),
    })

    .eq('id', id)

  if (recipeError) {
    return { error: recipeError.message }
  }

  // Update ingredients (delete all and re-insert for simplicity)
  // Note: In a production app, you might want to be smarter about this to preserve IDs
  const { error: deleteIngError } = await supabase
    .from('ingredients')
    .delete()
    .eq('recipe_id', id)

  if (deleteIngError) {
    return { error: 'Failed to update ingredients' }
  }

  if (data.ingredients.length > 0) {
    const ingredientsToInsert = data.ingredients.map((ing, index) => ({
      recipe_id: id,
      name: ing.name,
      quantity: ing.quantity,
      order_index: index,
    }))

    const { error: ingredientsError } = await supabase
      .from('ingredients')
      .insert(ingredientsToInsert)

    if (ingredientsError) {
      return { error: 'Failed to add ingredients' }
    }
  }

  // Update steps (delete all and re-insert)
  const { error: deleteStepsError } = await supabase
    .from('recipe_steps')
    .delete()
    .eq('recipe_id', id)

  if (deleteStepsError) {
    return { error: 'Failed to update steps' }
  }

  if (data.steps.length > 0) {
    const stepsToInsert = data.steps.map((step, index) => ({
      recipe_id: id,
      step_number: index + 1,
      instruction: step.instruction,
    }))

    const { error: stepsError } = await supabase
      .from('recipe_steps')
      .insert(stepsToInsert)

    if (stepsError) {
      return { error: 'Failed to add cooking steps' }
    }
  }

  revalidatePath('/recipes')
  revalidatePath(`/recipes/${id}`)
  redirect(`/recipes/${id}`)
}

export async function deleteRecipe(id: string) {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: 'You must be logged in to delete a recipe' }
  }

  // Check ownership
  const { data: existingRecipe, error: fetchError } = await supabase
    .from('recipes')
    .select('user_id')
    .eq('id', id)
    .single()

  if (fetchError || !existingRecipe) {
    return { error: 'Recipe not found' }
  }

  if (existingRecipe.user_id !== user.id) {
    return { error: 'You can only delete your own recipes' }
  }

  const { error } = await supabase
    .from('recipes')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/recipes')
  redirect('/')
}

export async function getTrendingRecipes(limit: number = 6) {
  const supabase = await createClient()

  // Fetch recipes with their favorite count
  // Note: Sorting by foreign key count is tricky in Supabase JS client without a view or RPC.
  // For MVP, we'll fetch a larger batch of recent recipes and sort in memory, 
  // or just fetch all if the dataset is small.
  const { data: recipes, error } = await supabase
    .from('recipes')
    .select(`
      *,
      profiles (display_name),
      categories (name),
      favorite_recipes (count)
    `)
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .limit(50) // Analyze last 50 recipes for trends

  if (error) {
    console.error('Error fetching trending recipes:', error)
    return []
  }

  // Sort by favorites count
  const trending = recipes
    .map((recipe: any) => ({
      ...recipe,
      favorites_count: recipe.favorite_recipes?.[0]?.count || 0
    }))
    .sort((a: any, b: any) => b.favorites_count - a.favorites_count)
    .slice(0, limit)

  return trending
}

export async function getNewestRecipes(limit: number = 8) {
  const supabase = await createClient()

  const { data: recipes, error } = await supabase
    .from('recipes')
    .select(`
      *,
      profiles (display_name),
      categories (name)
    `)
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching newest recipes:', error)
    return []
  }

  return recipes
}

export async function searchRecipes(query: string) {
  const supabase = await createClient()
  
  if (!query || query.trim().length < 2) {
    return []
  }
  
  const searchTerm = query.trim()
  
  // Search in title and description
  const { data: recipes, error } = await supabase
    .from('recipes')
    .select(`
      *,
      profiles (display_name),
      categories (name),
      ingredients (*)
    `)
    .eq('is_public', true)
    .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error searching recipes:', error)
    return []
  }
  
  // Also search ingredients
  const { data: ingredientData } = await supabase
    .from('ingredients')
    .select('recipe_id')
    .ilike('name', `%${searchTerm}%`)
  
  const ingredientRecipeIds = ingredientData?.map(i => i.recipe_id) || []
  
  if (ingredientRecipeIds.length > 0) {
    // Fetch recipes found via ingredients
    const { data: ingredientRecipes } = await supabase
      .from('recipes')
      .select(`
        *,
        profiles (display_name),
        categories (name),
        ingredients (*)
      `)
      .in('id', ingredientRecipeIds)
      .eq('is_public', true)
    
    // Combine and deduplicate results
    const allRecipes = [...recipes, ...(ingredientRecipes || [])]
    const uniqueRecipes = Array.from(
      new Map(allRecipes.map(r => [r.id, r])).values()
    )
    
    return uniqueRecipes
  }
  
  return recipes
}

export async function getFeedRecipes(limit: number = 10) {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return []
  }

  // 1. Get list of followed user IDs
  const { data: follows, error: followsError } = await supabase
    .from('follows')
    .select('following_id')
    .eq('follower_id', user.id)

  if (followsError || !follows || follows.length === 0) {
    return []
  }

  const followingIds = follows.map(f => f.following_id)

  // 2. Fetch recipes from these users
  const { data: recipes, error: recipesError } = await supabase
    .from('recipes')
    .select(`
      *,
      profiles (display_name),
      categories (name)
    `)
    .in('user_id', followingIds)
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (recipesError) {
    console.error('Error fetching feed recipes:', recipesError)
    return []
  }

  return recipes
}

