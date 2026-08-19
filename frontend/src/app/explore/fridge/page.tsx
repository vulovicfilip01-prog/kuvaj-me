import { searchRecipesByIngredients } from '@/app/recipes/actions';
import RecipeGrid from '@/components/RecipeGrid';
import FridgeSearch from '@/components/FridgeSearch';
import Navbar from '@/components/Navbar';
import { FiAlertCircle, FiChevronRight } from 'react-icons/fi';
import Link from 'next/link';
import { Suspense } from 'react';

interface PageProps {
    searchParams: Promise<{ ingredients?: string }>;
}

export default async function FridgeSearchPage({ searchParams }: PageProps) {
    const { ingredients } = await searchParams;
    const ingredientList = ingredients ? ingredients.split(',') : [];

    let recipes = [];
    if (ingredientList.length > 0) {
        recipes = await searchRecipesByIngredients(ingredientList);
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#F2E6D9] to-[#E8DCC4]">
            <Navbar transparent />

            <main className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto mb-16 text-center">

                    <h1 className="text-4xl md:text-5xl font-black text-amber-gold mb-6 heading-font leading-tight">
                        Šta imaš u frižideru?
                    </h1>
                    <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                        Unesi sastojke iz svog frižidera i mi ćemo ti predložiti najbolje kombinacije,
                        od najjednostavnijih do najkreativnijih.
                    </p>
                </div>

                <Suspense fallback={<div className="h-64 animate-pulse bg-white/20 rounded-3xl" />}>
                    <FridgeSearch />
                </Suspense>

                {ingredientList.length > 0 && (
                    <div id="results" className="mt-20 space-y-10 animate-fadeIn">
                        <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-slate-200 pb-6">
                            <div>
                                <h2 className="text-3xl font-bold text-slate-900 heading-font mb-2">Rezultati pretrage</h2>
                                <p className="text-slate-500 font-medium">
                                    Pronašli smo <span className="text-primary font-bold">{recipes.length}</span> recepata koji odgovaraju tvom izboru.
                                </p>
                            </div>
                            <div className="flex gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
                                <span>Poređano po:</span>
                                <span className="text-primary">Najboljem podudaranju</span>
                            </div>
                        </div>

                        {recipes.length > 0 ? (
                            <RecipeGrid recipes={recipes} />
                        ) : (
                            <div className="bg-white rounded-3xl p-16 text-center border border-slate-100 shadow-sm max-w-2xl mx-auto">
                                <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-600">
                                    <FiAlertCircle className="w-10 h-10" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-3">Nismo pronašli tačna podudaranja</h3>
                                <p className="text-slate-500 mb-8">
                                    Pokušaj da uneseš opštije sastojke (npr. samo "sir" umesto "feta sir")
                                    ili dodaj više različitih namirnica.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link href="/" className="px-8 py-3 bg-slate-100 text-slate-700 rounded-full font-bold hover:bg-slate-200 transition-colors">
                                        Vrati se na početnu
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
