'use client'

import { useState } from 'react'
import RecipeCarousel from './RecipeCarousel'
import RecipeGrid from './RecipeGrid'
import { LuFlame, LuUsers, LuClock } from 'react-icons/lu'
import Link from 'next/link'
import ChefHatIcon from './ChefHatIcon'

interface HomeFeedTabsProps {
    trendingRecipes: any[]
    feedRecipes: any[]
    newestRecipes: any[]
    isAuthenticated: boolean
    favoriteIds: string[]
}

export default function HomeFeedTabs({
    trendingRecipes,
    feedRecipes,
    newestRecipes,
    isAuthenticated,
    favoriteIds
}: HomeFeedTabsProps) {
    // If user is authenticated and follows people (feedRecipes > 0), default to 'feed', else 'trending'
    const [activeTab, setActiveTab] = useState<'trending' | 'feed' | 'newest'>(
        isAuthenticated && feedRecipes.length > 0 ? 'feed' : 'trending'
    )

    return (
        <section className="py-12 md:py-20 bg-gradient-to-b from-white to-orange-50/30">
            <div className="container mx-auto px-6">

                {/* Tabs Header */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
                    <div className="glass-panel p-1.5 rounded-full flex gap-1 shadow-md">
                        <button
                            onClick={() => setActiveTab('trending')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all cursor-pointer ${activeTab === 'trending'
                                ? 'bg-gradient-to-r from-[#d4a373] to-[#bc8a5f] text-white shadow-lg'
                                : 'text-slate-600 hover:text-[#bc8a5f] hover:bg-[#d4a373]/5'
                                }`}
                        >
                            <LuFlame className={activeTab === 'trending' ? 'text-white' : 'text-[#d4a373]'} />
                            Popularno
                        </button>

                        {isAuthenticated && (
                            <button
                                onClick={() => setActiveTab('feed')}
                                className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all cursor-pointer ${activeTab === 'feed'
                                    ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg'
                                    : 'text-slate-600 hover:text-primary hover:bg-green-50'
                                    }`}
                            >
                                <LuUsers className={activeTab === 'feed' ? 'text-white' : 'text-primary'} />
                                Omiljeni kuvari
                            </button>
                        )}

                        <button
                            onClick={() => setActiveTab('newest')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all cursor-pointer ${activeTab === 'newest'
                                ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg'
                                : 'text-slate-600 hover:text-primary hover:bg-green-50'
                                }`}
                        >
                            <LuClock className={activeTab === 'newest' ? 'text-white' : 'text-primary'} />
                            Najnovije
                        </button>
                    </div>

                    {/* Context Title/Description based on active tab */}
                    <div className="text-center md:text-right animate-fadeIn">
                        {activeTab === 'trending' && (
                            <>
                                <h2 className="text-2xl font-bold text-slate-900 heading-font">Šta se kuva danas?</h2>
                                <p className="text-slate-500">Recepti koje naša zajednica obožava</p>
                            </>
                        )}
                        {activeTab === 'feed' && (
                            <>
                                <h2 className="text-2xl font-bold text-slate-900 heading-font">Sveže od tvojih omiljenih autora</h2>
                                <p className="text-slate-500">Pogledaj šta su novo spremili ljudi koje pratiš</p>
                            </>
                        )}
                        {activeTab === 'newest' && (
                            <>
                                <h2 className="text-2xl font-bold text-slate-900 heading-font">Upravo dodato</h2>
                                <p className="text-slate-500">Budi prvi koji će isprobati ove recepte</p>
                            </>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="min-h-[400px] animate-slideUp">
                    {activeTab === 'trending' && (
                        <div>
                            {trendingRecipes.length > 0 ? (
                                <RecipeCarousel recipes={trendingRecipes} />
                            ) : (
                                <div className="text-center py-20 text-slate-500">Nema popularnih recepata trenutno.</div>
                            )}
                            <div className="mt-8 text-center">
                                <Link
                                    href="/explore?sort=popular"
                                    className="inline-block px-8 py-3 bg-gradient-to-r from-[#d4a373] to-[#bc8a5f] text-white rounded-full font-bold hover:from-[#bc8a5f] hover:to-[#a4714b] transition-all shadow-md hover:shadow-lg"
                                >
                                    Pogledaj sve popularne
                                </Link>
                            </div>
                        </div>
                    )}

                    {activeTab === 'feed' && (
                        <div>
                            {feedRecipes.length > 0 ? (
                                <RecipeGrid
                                    recipes={feedRecipes}
                                    favoriteIds={favoriteIds}
                                    isAuthenticated={isAuthenticated}
                                />
                            ) : (
                                <div className="text-center py-16 glass-panel rounded-3xl">
                                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                                        <ChefHatIcon className="w-12 h-12" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">Tvoj feed je prazan</h3>
                                    <p className="text-slate-600 mb-6 max-w-md mx-auto">
                                        Zaprati druge kuvare da bi video njihove najnovije recepte ovde.
                                    </p>
                                    <Link
                                        href="/explore"
                                        className="px-6 py-3 bg-primary text-white rounded-full font-bold hover:bg-primary-dark transition-colors"
                                    >
                                        Istraži kuvare
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'newest' && (
                        <div>
                            <RecipeGrid
                                recipes={newestRecipes}
                                favoriteIds={favoriteIds}
                                isAuthenticated={isAuthenticated}
                            />
                            <div className="mt-8 text-center">
                                <Link
                                    href="/explore?sort=newest"
                                    className="inline-block px-8 py-3 bg-primary text-white rounded-full font-bold hover:bg-primary-dark transition-all shadow-md hover:shadow-lg"
                                >
                                    Pogledaj sve najnovije
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </section>
    )
}
