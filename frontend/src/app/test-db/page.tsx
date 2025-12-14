import { createClient } from '@/utils/supabase/server';

export default async function TestDB() {
    const supabase = await createClient();

    let recipeCount = null;
    let recipeError = null;
    let singleRecipe = null;

    try {
        // Test 1: Count
        const countResult = await supabase
            .from('recipes')
            .select('*', { count: 'exact', head: true });

        recipeCount = countResult.count;
        if (countResult.error) recipeError = countResult.error;

        // Test 2: Fetch One
        if (!recipeError) {
            const fetchResult = await supabase
                .from('recipes')
                .select('id, title, is_public')
                .limit(1);
            singleRecipe = fetchResult.data;
            if (fetchResult.error) recipeError = fetchResult.error;
        }

    } catch (e: any) {
        recipeError = { message: e.message, details: e };
    }

    return (
        <div className="p-10 font-mono text-sm">
            <h1 className="text-xl font-bold mb-4">Database Diagnostic</h1>

            <div className="mb-6">
                <h2 className="font-bold">Environment:</h2>
                <p>URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 20) + '...' : 'MISSING'}</p>
                <p>Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 10) + '...' : 'MISSING'}</p>
            </div>

            <div className="mb-6">
                <h2 className="font-bold">Results:</h2>
                <p>Count: {recipeCount !== null ? recipeCount : 'N/A'}</p>
                <p>Single Recipe: {singleRecipe ? JSON.stringify(singleRecipe, null, 2) : 'None'}</p>
            </div>

            <div className="mb-6 bg-red-100 p-4 rounded text-red-900">
                <h2 className="font-bold">Errors:</h2>
                <pre>{recipeError ? JSON.stringify(recipeError, null, 2) : 'No Errors'}</pre>
            </div>
        </div>
    );
}
