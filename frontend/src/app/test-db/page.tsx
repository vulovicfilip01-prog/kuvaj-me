export const dynamic = 'force-dynamic';
import { createClient } from '@/utils/supabase/server';

export default async function TestDB() {
    const supabase = await createClient();

    // Results holder - initialized with safe strings
    const results = {
        totalCount: 'Pending',
        publicCount: 'Pending',
        firstRecipe: 'Pending',
        error: ''
    };

    try {
        // 1. Total Count (Head only)
        const total = await supabase.from('recipes').select('*', { count: 'exact', head: true });
        results.totalCount = total.error
            ? `Error: ${total.error.message}`
            : (total.count !== null ? String(total.count) : '0');

        // 2. Public Count (Head only)
        const publicData = await supabase.from('recipes').select('*', { count: 'exact', head: true }).eq('is_public', true);
        results.publicCount = publicData.error
            ? `Error: ${publicData.error.message}`
            : (publicData.count !== null ? String(publicData.count) : '0');

        // 3. Fetch Actual Data (First row)
        const first = await supabase.from('recipes').select('id, title, is_public').limit(1).single();
        if (first.error) {
            results.firstRecipe = `Error: ${first.error.message}`;
        } else if (first.data) {
            results.firstRecipe = JSON.stringify(first.data, null, 2);
        } else {
            results.firstRecipe = 'No Data Found';
        }

    } catch (e: any) {
        results.error = typeof e === 'string' ? e : (typeof e.message === 'string' ? e.message : 'Unknown Error');
    }

    return (
        <div className="p-10 font-mono text-sm space-y-6">
            <h1 className="text-xl font-bold border-b pb-2">Deep Diagnostic</h1>

            <div className="grid gap-2">
                <div className="bg-slate-100 p-4 rounded">
                    <h2 className="font-bold mb-2">Environment</h2>
                    <pre>{JSON.stringify({
                        URL_PREFIX: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 15) || 'Missing',
                        KEY_PREFIX: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 10) || 'Missing'
                    }, null, 2)}</pre>
                </div>

                <div className="bg-blue-50 p-4 rounded">
                    <h2 className="font-bold mb-2">Database Queries</h2>
                    <div className="space-y-2">
                        <p><strong>Total Recipes (No Filter):</strong> {results.totalCount}</p>
                        <p><strong>Public Recipes (is_public=true):</strong> {results.publicCount}</p>
                        <div className="mt-2">
                            <strong>First Recipe Data:</strong>
                            <pre className="mt-1 text-xs bg-white p-2 border rounded overflow-auto whitespace-pre-wrap">
                                {results.firstRecipe}
                            </pre>
                        </div>
                    </div>
                </div>

                {results.error && (
                    <div className="bg-red-100 p-4 rounded text-red-800">
                        <h2 className="font-bold">Execution Error</h2>
                        <p>{results.error}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
