'use client';

import { useState, useEffect } from 'react';
import { searchRecipesByIngredients, getCategories } from '../recipes/actions';
import IngredientSelector from '@/components/IngredientSelector';
import SearchFilters from '@/components/SearchFilters';
import SearchSort from '@/components/SearchSort';
import RecipeGrid from '@/components/RecipeGrid';
import ChefHatIcon from '@/components/ChefHatIcon';
import ForkKnifeIcon from '@/components/ForkKnifeIcon';
import Link from 'next/link';

export default function SearchPage() {
    const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
    const [recipes, setRecipes] = useState<any[]>([]);
    const [filteredRecipes, setFilteredRecipes] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    // Filter states
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('sve');
    const [difficulty, setDifficulty] = useState('sve');
    const [maxTime, setMaxTime] = useState(300); // 300 = "neograničeno"
    const [isPosno, setIsPosno] = useState(false);

    // Sort state
    const [sortBy, setSortBy] = useState('relevance');

    // Load categories on mount
    useEffect(() => {
        const loadCategories = async () => {
            const result = await getCategories();
            if (result.data) {
                setCategories(result.data.map((c: any) => c.name));
            }
        };
        loadCategories();
    }, []);


    // Apply filters and sort whenever recipes or filter/sort params change
    useEffect(() => {
        let filtered = [...recipes];

        // Apply category filter
        if (selectedCategory !== 'sve') {
            filtered = filtered.filter(r => r.categories?.name === selectedCategory);
        }

        // Apply difficulty filter
        if (difficulty !== 'sve') {
            filtered = filtered.filter(r => r.difficulty === difficulty);
        }

        // Apply max time filter
        if (maxTime < 300) {
            filtered = filtered.filter(r => (r.prep_time + r.cook_time) <= maxTime);
        }

        // Apply posno filter
        if (isPosno) {
            filtered = filtered.filter(r => r.is_posno);
        }

        // Apply sorting
        switch (sortBy) {
            case 'time-asc':
                filtered.sort((a, b) => (a.prep_time + a.cook_time) - (b.prep_time + b.cook_time));
                break;
            case 'time-desc':
                filtered.sort((a, b) => (b.prep_time + b.cook_time) - (a.prep_time + a.cook_time));
                break;
            case 'name-asc':
                filtered.sort((a, b) => a.title.localeCompare(b.title, 'sr'));
                break;
            case 'name-desc':
                filtered.sort((a, b) => b.title.localeCompare(a.title, 'sr'));
                break;
            case 'relevance':
            default:
                // Keep existing order (by match relevance)
                break;
        }

        setFilteredRecipes(filtered);
    }, [recipes, selectedCategory, difficulty, maxTime, isPosno, sortBy]);

    const handleAddIngredient = (ingredient: string) => {
        if (!selectedIngredients.includes(ingredient)) {
            setSelectedIngredients([...selectedIngredients, ingredient]);
        }
    };

    const handleRemoveIngredient = (ingredient: string) => {
        setSelectedIngredients(selectedIngredients.filter(i => i !== ingredient));
    };

    const handleSearch = async () => {
        setLoading(true);
        setSearched(true);
        try {
            const results = await searchRecipesByIngredients(selectedIngredients);
            setRecipes(results);
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClearFilters = () => {
        setSelectedCategory('sve');
        setDifficulty('sve');
        setMaxTime(300);
        setIsPosno(false);
        setSortBy('relevance');
    };

    return (
        <main className="min-h-screen bg-transparent text-slate-900 pb-20">
            {/* Header */}
            <nav className="container mx-auto px-6 py-6 flex justify-between items-center mb-8 animate-fadeIn">
                <Link href="/" className="flex items-center gap-3 group">
                    <ChefHatIcon className="w-10 h-10 transform group-hover:rotate-12 transition-transform duration-300" />
                    <span className="text-2xl font-bold text-gradient heading-font">Kuvaj.me</span>
                </Link>
                <Link href="/" className="px-6 py-2.5 bg-gradient-to-r from-primary to-primary-dark text-white rounded-full font-medium hover:shadow-lg hover:shadow-primary/25 transition-all flex items-center gap-2">
                    ← Nazad na početnu
                </Link>
            </nav>

            <div className="container mx-auto px-6">
                {/* Search Section */}
                <div className="mb-12 animate-slideUp">
                    <IngredientSelector
                        selectedIngredients={selectedIngredients}
                        onAdd={handleAddIngredient}
                        onRemove={handleRemoveIngredient}
                        onSearch={handleSearch}
                        loading={loading}
                    />
                </div>

                {/* Filters and Sort */}
                {searched && recipes.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
                        <div className="lg:col-span-1">
                            <SearchFilters
                                categories={categories}
                                selectedCategory={selectedCategory}
                                onCategoryChange={setSelectedCategory}
                                difficulty={difficulty}
                                onDifficultyChange={setDifficulty}
                                maxTime={maxTime}
                                onMaxTimeChange={setMaxTime}
                                isPosno={isPosno}
                                onPosnoChange={setIsPosno}
                                onClearFilters={handleClearFilters}
                            />
                        </div>
                        <div className="lg:col-span-2">
                            <div className="glass-panel rounded-3xl p-6">
                                <SearchSort sortBy={sortBy} onSortChange={setSortBy} />
                                <div className="mt-4 text-sm text-slate-600">
                                    Pronađeno: <span className="font-bold text-primary">{filteredRecipes.length}</span> {filteredRecipes.length === 1 ? 'recept' : 'recepata'}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Results Section */}
                {searched && (
                    <div className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                        <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3 heading-font">
                            {filteredRecipes.length > 0 ? <><ForkKnifeIcon className="w-10 h-10" /> Recepti koje možeš da napraviš</> : '😕 Nema rezultata'}
                        </h2>

                        {filteredRecipes.length > 0 ? (
                            <RecipeGrid recipes={filteredRecipes} />
                        ) : (
                            <div className="text-center py-16 glass-panel rounded-3xl">
                                <span className="text-6xl mb-4 block opacity-50">🥬</span>
                                <p className="text-xl text-slate-600 mb-2 font-medium">Nismo našli recepte sa ovim kriterijumima.</p>
                                <p className="text-slate-500">Probaj da promeniš filtere ili dodaš još neki sastojak.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}
