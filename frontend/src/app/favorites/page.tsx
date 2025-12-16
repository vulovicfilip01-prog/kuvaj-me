import { createClient } from '@/utils/supabase/server';
import { getFavoriteRecipes } from '../recipes/actions';
import RecipeGrid from '@/components/RecipeGrid';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { FaHeartBroken } from 'react-icons/fa';
import Navbar from '@/components/Navbar';
import HeartIcon from '@/components/HeartIcon';

export default async function FavoritesPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const favorites = await getFavoriteRecipes();

    return (
        <main className="min-h-screen bg-transparent text-slate-900 pb-20">
            <Navbar />

            <div className="container mx-auto px-6">
                {/* Page Title */}
                <div className="mb-12 animate-slideUp">
                    <div className="flex items-center gap-3 mb-4">
                        <HeartIcon className="w-12 h-12" />
                        <h1 className="text-5xl font-bold text-slate-900 heading-font">
                            Moji omiljeni recepti
                        </h1>
                    </div>
                    <p className="text-slate-600 text-lg">
                        Tvoja kolekcija najdražih recepata na jednom mestu
                    </p>
                </div>

                {/* Favorites Grid */}
                {favorites.length > 0 ? (
                    <div className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                        <div className="mb-6 text-slate-600">
                            <span className="font-semibold text-primary">{favorites.length}</span> {favorites.length === 1 ? 'recept' : 'recepata'}
                        </div>
                        <RecipeGrid
                            recipes={favorites}
                            favoriteIds={favorites.map((r: any) => r.id)}
                            isAuthenticated={true}
                        />
                    </div>
                ) : (
                    <div className="text-center py-20 glass-panel rounded-3xl animate-fadeIn">
                        <div className="flex justify-center mb-6">
                            <FaHeartBroken className="w-20 h-20 text-[#6B7E4F]" />
                        </div>
                        <p className="text-slate-600 text-xl font-medium mb-2">Još nemaš omiljene recepte</p>
                        <p className="text-slate-500 mb-6">Počni da istražuješ i dodaj svoje favorite!</p>
                        <Link
                            href="/"
                            className="inline-block px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-full font-bold hover:shadow-lg hover:shadow-primary/25 transition-all"
                        >
                            Istraži recepte
                        </Link>
                    </div>
                )}
            </div>
        </main>
    );
}
