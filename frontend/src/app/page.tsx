import Link from 'next/link';
import { Metadata } from 'next';
import { createClient } from '@/utils/supabase/server';
import { getRecipes, getTrendingRecipes, getNewestRecipes } from './recipes/actions';
import RecipeGrid from '@/components/RecipeGrid';
import RecipeCarousel from '@/components/RecipeCarousel';
import ChefHatIcon from '@/components/ChefHatIcon';
import { LuCookingPot, LuFlame, LuClock } from 'react-icons/lu';
import { HiHeart } from 'react-icons/hi';
import HeroImages from '@/components/HeroImages';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Kuvaj.me - Otkrijte najbolje recepte',
  description: 'Pretražite hiljade recepata, sačuvajte svoje favorite i podelite kulinarske kreacije. Recepti za svako jelo i svaku priliku.',
};

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch data in parallel
  const [trendingRecipes, newestRecipes] = await Promise.all([
    getTrendingRecipes(6),
    getNewestRecipes(8)
  ]);

  // Get favorite IDs for the current user
  let favoriteIds: string[] = [];
  if (user) {
    const { data: favorites } = await supabase
      .from('favorite_recipes')
      .select('recipe_id')
      .eq('user_id', user.id);

    favoriteIds = favorites?.map(f => f.recipe_id) || [];
  }

  return (
    <main className="min-h-screen bg-transparent text-slate-900 overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative min-h-[80vh] flex flex-col">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556910103-1c02745a30bf?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-transparent"></div>

        {/* Navbar */}
        <Navbar transparent />

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-6 flex-grow flex flex-col md:flex-row items-center gap-12 pt-10 pb-20">

          {/* Left Side - Text */}
          <div className="flex-1 text-center md:text-left">
            <div className="animate-slideUp" style={{ animationDelay: '0.1s' }}>
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6 backdrop-blur-sm">
                ✨ Najbolji recepti na Balkanu
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight heading-font animate-slideUp" style={{ animationDelay: '0.2s' }}>
              Tvoja digitalna <br />
              <span className="text-gradient">knjiga recepata</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto md:mx-0 leading-relaxed animate-slideUp" style={{ animationDelay: '0.3s' }}>
              Otkrij, kreiraj i podeli najukusnije recepte sa zajednicom ljubitelja hrane.
              Pridruži se hiljadama kuvara koji već dele svoje tajne.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start animate-slideUp" style={{ animationDelay: '0.4s' }}>
              <Link
                href="/search"
                className="px-8 py-4 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary-dark text-white rounded-full font-bold text-lg shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all transform hover:-translate-y-1 w-full sm:w-auto flex items-center justify-center gap-2"
              >
                <LuCookingPot className="w-6 h-6" />
                Istraži recepte
              </Link>
              <Link
                href="/recipes/new"
                className="px-8 py-4 bg-white text-slate-700 hover:text-primary border border-slate-200 hover:border-primary/30 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 w-full sm:w-auto flex items-center justify-center gap-2"
              >
                <span>+</span> Dodaj svoj recept
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-12 flex items-center justify-center md:justify-start gap-8 md:gap-12 animate-slideUp" style={{ animationDelay: '0.5s' }}>
              <div className="text-center md:text-left">
                <div className="text-3xl font-bold text-slate-900">500+</div>
                <div className="text-sm text-slate-500 font-medium">Recepata</div>
              </div>
              <div className="text-center md:text-left">
                <div className="text-3xl font-bold text-slate-900">10k+</div>
                <div className="text-sm text-slate-500 font-medium">Korisnika</div>
              </div>
              <div className="text-center md:text-left">
                <div className="text-3xl font-bold text-slate-900">4.9</div>
                <div className="text-sm text-slate-500 font-medium">Ocena</div>
              </div>
            </div>
          </div>

          {/* Right Side - Images */}
          <HeroImages />
        </div>
      </div>

      {/* Trending Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-4 heading-font flex items-center gap-3">
                <LuFlame className="text-orange-500" /> Popularno sada
              </h2>
              <p className="text-slate-600 text-lg">Recepti koje naša zajednica obožava ove nedelje</p>
            </div>
            <Link href="/explore?sort=popular" className="hidden md:flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
              Pogledaj sve <span className="text-xl">→</span>
            </Link>
          </div>

          <RecipeCarousel recipes={trendingRecipes} />
        </div>
      </section>

      {/* Newest Recipes Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-4 heading-font flex items-center gap-3">
                <LuClock className="text-primary" /> Sveže iz kuhinje
              </h2>
              <p className="text-slate-600 text-lg">Najnoviji recepti dodati od strane naših kuvara</p>
            </div>
            <Link href="/explore?sort=newest" className="hidden md:flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
              Pogledaj sve <span className="text-xl">→</span>
            </Link>
          </div>

          <RecipeGrid
            recipes={newestRecipes}
            favoriteIds={favoriteIds}
            isAuthenticated={!!user}
          />

          <div className="mt-12 text-center">
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-full font-bold hover:bg-slate-50 hover:border-primary/30 hover:text-primary transition-all shadow-sm hover:shadow-md"
            >
              Istraži još recepata
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
