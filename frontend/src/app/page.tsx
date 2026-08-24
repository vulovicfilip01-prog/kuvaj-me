import Link from 'next/link';
import { Metadata } from 'next';
import { createClient } from '@/utils/supabase/server';
import { getRecipes, getTrendingRecipes, getNewestRecipes, getFeedRecipes } from './recipes/actions';
import RecipeGrid from '@/components/RecipeGrid';
import NewsletterBanner from '@/components/NewsletterBanner';

import RecipeCarousel from '@/components/RecipeCarousel';
import HomeFeedTabs from '@/components/HomeFeedTabs';
import ChefHatIcon from '@/components/ChefHatIcon';
import SearchIcon from '@/components/SearchIcon';
import { LuCookingPot, LuFlame, LuClock } from 'react-icons/lu';
import { HiHeart } from 'react-icons/hi';
import HeroImages from '@/components/HeroImages';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Krckaj.me - Otkrijte najbolje recepte',
  description: 'Pretražite hiljade recepata, sačuvajte svoje favorite i podelite kulinarske kreacije. Recepti za svako jelo i svaku priliku.',
};

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let trendingRecipes: any[] = [];
  let newestRecipes: any[] = [];
  let feedRecipes: any[] = [];
  let favoriteIds: string[] = [];
  let fetchError = '';

  // Diagnostic counts
  let codeDebug = { total: -1, public: -1, firstId: 'none' };

  try {
    // Fetch data in parallel
    const [trending, newest, feed, totalCount, publicCount, firstRecipe] = await Promise.all([
      getTrendingRecipes(6).catch(err => { console.error('Trending Error:', err); return []; }),
      getNewestRecipes(8).catch(err => { console.error('Newest Error:', err); return []; }),
      user ? getFeedRecipes(8).catch(err => { console.error('Feed Error:', err); return []; }) : Promise.resolve([]),
      // Diagnostics
      supabase.from('recipes').select('*', { count: 'exact', head: true }).then(res => res.count),
      supabase.from('recipes').select('*', { count: 'exact', head: true }).eq('is_public', true).then(res => res.count),
      supabase.from('recipes').select('id').limit(1).single().then(res => res.data)
    ]);

    trendingRecipes = Array.isArray(trending) ? trending : [];
    newestRecipes = Array.isArray(newest) ? newest : [];
    feedRecipes = Array.isArray(feed) ? feed : [];

    codeDebug.total = totalCount === null ? -99 : totalCount;
    codeDebug.public = publicCount === null ? -99 : publicCount;
    codeDebug.firstId = firstRecipe?.id || 'none';

    // Get favorite IDs for the current user
    if (user) {
      const { data: favorites } = await supabase
        .from('favorite_recipes')
        .select('recipe_id')
        .eq('user_id', user.id);

      favoriteIds = favorites?.map(f => f.recipe_id) || [];
    }
  } catch (e: any) {
    console.error('Home Page Fetch Error:', e);
    fetchError = typeof e === 'string' ? e : (e.message || JSON.stringify(e));
  }

  return (
    <main className="min-h-screen bg-transparent text-slate-900">
      <Navbar />
      
      {/* Hero Section - Updated Deployment Trigger */}
      <div className="relative min-h-[80vh] flex flex-col -mt-[76px] md:-mt-[88px]">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[url('/hero-bg-beige.png')] bg-cover bg-center opacity-90"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#F2E6D9]"></div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-6 flex-grow flex flex-col md:flex-row items-center gap-12 pt-10 pb-20">

          {/* Left Side - Text */}
          <div className="flex-1 text-center md:text-left">

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight heading-font animate-slideUp" style={{ animationDelay: '0.2s' }}>
              <span className="text-amber-gold">Tvoja digitalna</span> <br />
              <span className="text-gradient">knjiga recepata</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto md:mx-0 leading-relaxed animate-slideUp" style={{ animationDelay: '0.3s' }}>
              Otkrij, kreiraj i podeli najukusnije recepte sa zajednicom ljubitelja hrane.
              Pridruži se hiljadama krčkara koji već dele svoje tajne.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start animate-slideUp" style={{ animationDelay: '0.4s' }}>
              <Link
                href="/explore/fridge"
                className="px-8 py-4 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary-dark text-white rounded-full font-bold text-lg shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all transform hover:-translate-y-1 w-full sm:w-auto flex items-center justify-center gap-2"
              >
                <LuCookingPot className="w-6 h-6" />
                Šta imaš u frižideru?
              </Link>
              <Link
                href="/explore"
                className="px-8 py-4 bg-[#E8DCC4] text-slate-800 hover:bg-[#D4C5A9] hover:text-slate-900 border border-[#D4C5A9] hover:border-[#B8A88A] rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 w-full sm:w-auto flex items-center justify-center gap-3"
              >
                <SearchIcon className="w-8 h-8" />
                Istraži recepte
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

      {/* Unified Feed Section with Tabs */}
      <HomeFeedTabs
        trendingRecipes={trendingRecipes}
        feedRecipes={feedRecipes}
        newestRecipes={newestRecipes}
        isAuthenticated={!!user}
        favoriteIds={favoriteIds}
      />

      {/* Newsletter Banner */}
      <NewsletterBanner />
    </main>
  );
}
