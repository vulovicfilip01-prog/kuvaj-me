import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import PrintControl from "./PrintControl";

export default async function PrintRecipePage({ params }: { params: { id: string } }) {
    const supabase = await createClient();

    const { data: recipe } = await supabase
        .from('recipes')
        .select(`
    *,
    recipe_ingredients(
        id,
        amount,
        unit,
        ingredient: ingredients(name)
    ),
    recipe_steps(
        id,
        step_number,
        instruction
    ),
    profiles(display_name)
        `)
        .eq('id', params.id)
        .single();

    if (!recipe) {
        notFound();
    }

    // Sort steps
    recipe.recipe_steps.sort((a: any, b: any) => a.step_number - b.step_number);

    return (
        <div className="max-w-3xl mx-auto bg-white min-h-screen p-8 print:p-0 text-black">
            {/* Control Bar (Hidden when printing) */}
            <div className="mb-8 flex justify-between items-center print:hidden border-b border-slate-100 pb-4">
                <div className="text-sm text-slate-500">
                    Pregled za štampu
                </div>
                <PrintControl />
            </div>

            {/* Print Header */}
            <div className="mb-8 text-center">
                <h1 className="text-4xl font-serif font-bold mb-2">{recipe.title}</h1>
                <p className="text-slate-600">
                    Autor: {recipe.profiles?.display_name || 'Kuvaj.me'}
                </p>
                <div className="flex justify-center gap-6 mt-4 text-sm text-slate-500 border-t border-b border-slate-100 py-3">
                    <span>⏳ {recipe.preparation_time} min priprema</span>
                    <span>🔥 {recipe.cooking_time} min kuvanje</span>
                    <span>👥 {recipe.servings} porcija</span>
                </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-[1fr,2fr] gap-8">
                {/* Ingredients */}
                <div>
                    <h2 className="text-lg font-bold border-b-2 border-slate-800 pb-1 mb-4 uppercase tracking-wider">
                        Sastojci
                    </h2>
                    <ul className="space-y-2 text-sm">
                        {recipe.recipe_ingredients.map((ri: any) => (
                            <li key={ri.id} className="flex justify-between border-b border-slate-100 pb-1">
                                <span>{ri.ingredient.name}</span>
                                <span className="font-semibold text-slate-700">
                                    {ri.amount} {ri.unit}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Steps */}
                <div>
                    <h2 className="text-lg font-bold border-b-2 border-slate-800 pb-1 mb-4 uppercase tracking-wider">
                        Priprema
                    </h2>
                    <div className="space-y-6">
                        {recipe.recipe_steps.map((step: any) => (
                            <div key={step.id}>
                                <div className="flex gap-4">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                                        {step.step_number}
                                    </span>
                                    <p className="text-slate-800 text-justify leading-relaxed">
                                        {step.instruction}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-12 pt-6 border-t border-slate-200 text-center text-xs text-slate-400">
                <p>Recept preuzet sa Kuvaj.me - Tvoja digitalna knjiga recepata</p>
                <p>{new Date().toLocaleDateString('sr-RS')}</p>
            </div>
        </div>
    );
}

// Inline Client Component removed in favor of separate file


// Note: In Next.js App Router, we can't mix Server/Client in one file easily like this if we export default Server Component.
// The `PrintControl` needs to be defined but used where? We have to extract it or make the whole page client?
// Actually, making the whole page server is better for SEO/Speed, but we need interaction.
// Let's refine: I will split PrintControl into a separate file.
