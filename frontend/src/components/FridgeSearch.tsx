'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FiPlus, FiX, FiSearch, FiTruck, FiCloudLightning, FiCpu } from 'react-icons/fi';
import { getPopularIngredients } from '@/app/recipes/actions';
import { normalizeSerbianText } from '@/utils/text';

export default function FridgeSearch() {
    const [ingredients, setIngredients] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [popular, setPopular] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        async function loadPopular() {
            const data = await getPopularIngredients(12);
            setPopular(data);
        }
        loadPopular();
    }, []);

    useEffect(() => {
        if (inputValue.length > 1) {
            const normalizedInput = normalizeSerbianText(inputValue);
            const filtered = popular.filter(
                p => normalizeSerbianText(p).includes(normalizedInput) &&
                    !ingredients.some(ing => normalizeSerbianText(ing) === normalizeSerbianText(p))
            );
            setSuggestions(filtered);
            setShowSuggestions(filtered.length > 0);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }, [inputValue, popular, ingredients]);

    const addIngredient = (ing: string) => {
        const raw = ing.trim();
        const normalized = normalizeSerbianText(raw);

        if (raw && !ingredients.some(i => normalizeSerbianText(i) === normalized)) {
            setIngredients([...ingredients, raw]);
        }
        setInputValue('');
        setSuggestions([]);
        setShowSuggestions(false);
        inputRef.current?.focus();
    };

    const removeIngredient = (ing: string) => {
        setIngredients(ingredients.filter(i => i !== ing));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (inputValue.trim()) {
                addIngredient(inputValue.trim());
            } else if (ingredients.length > 0) {
                handleSearch();
            }
        }
    };

    const handleSearch = () => {
        if (ingredients.length > 0) {
            const query = ingredients.join(',');
            router.push(`/explore/fridge?ingredients=${encodeURIComponent(query)}`);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 relative overflow-hidden">
                {/* Background Accent */}
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-amber-500/5 rounded-full blur-3xl"></div>

                <div className="relative z-10">
                    <h2 className="text-2xl font-bold text-slate-900 heading-font mb-6 flex items-center gap-3">
                        <span className="p-2 bg-primary/10 rounded-xl text-primary">
                            <FiSearch className="w-6 h-6" />
                        </span>
                        Šta imaš u frižideru?
                    </h2>

                    <div className="space-y-6">
                        {/* Input & Tags Area */}
                        <div className="relative">
                            <div className="flex flex-wrap gap-2 p-3 bg-slate-50 border border-slate-200 rounded-2xl min-h-[64px] transition-all focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/5 focus-within:bg-white">
                                {ingredients.map(ing => (
                                    <span
                                        key={ing}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white font-bold text-sm rounded-xl animate-scaleIn shadow-md shadow-primary/20"
                                    >
                                        {ing}
                                        <button
                                            onClick={() => removeIngredient(ing)}
                                            className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                                        >
                                            <FiX className="w-3.5 h-3.5" />
                                        </button>
                                    </span>
                                ))}

                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                    onFocus={() => inputValue.length > 1 && setShowSuggestions(true)}
                                    placeholder={ingredients.length === 0 ? "Npr. piletina, sir, paradajz..." : "Dodaj još..."}
                                    className="flex-1 min-w-[150px] bg-transparent border-none outline-none text-slate-800 font-medium placeholder:text-slate-400 py-1.5 px-2"
                                />
                            </div>

                            {/* Suggestions Dropdown */}
                            {showSuggestions && (
                                <div className="absolute z-50 left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-fadeIn">
                                    {suggestions.map(sug => (
                                        <button
                                            key={sug}
                                            onClick={() => addIngredient(sug)}
                                            className="w-full text-left px-5 py-3 hover:bg-slate-50 transition-colors flex items-center justify-between group"
                                        >
                                            <span className="font-medium text-slate-700">{sug}</span>
                                            <FiPlus className="text-slate-300 group-hover:text-primary transition-colors" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Popular Ingredients Chips */}
                        {popular.length > 0 && (
                            <div className="space-y-3">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">
                                    Popularni sastojci
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {popular.filter(p => !ingredients.includes(p)).map(ing => (
                                        <button
                                            key={ing}
                                            onClick={() => addIngredient(ing)}
                                            className="px-4 py-2 bg-white border border-slate-100 hover:border-primary/30 hover:bg-primary/5 text-slate-600 hover:text-primary rounded-xl text-sm font-bold transition-all"
                                        >
                                            + {ing}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Search Button */}
                        <div className="pt-4 flex justify-center">
                            <button
                                onClick={handleSearch}
                                disabled={ingredients.length === 0}
                                className={`flex items-center gap-3 px-10 py-4 rounded-full font-bold transition-all transform hover:-translate-y-1 shadow-lg ${ingredients.length > 0
                                    ? 'bg-primary text-white shadow-primary/20 hover:shadow-primary/40'
                                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                    }`}
                            >
                                <FiSearch className="w-5 h-5" />
                                PRONAĐI RECEPTE
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative Empty State Info */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 animate-slideUp">
                <div className="bg-white/50 backdrop-blur-sm p-6 rounded-3xl border border-white/50 text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
                        <FiCpu className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-slate-800 mb-2">Pametno rangiranje</h4>
                    <p className="text-xs text-slate-500">Prvo prikazujemo recepte za koje imaš sve ili većinu sastojaka.</p>
                </div>
                <div className="bg-white/50 backdrop-blur-sm p-6 rounded-3xl border border-white/50 text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
                        <FiCloudLightning className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-slate-800 mb-2">Ušteda vremena</h4>
                    <p className="text-xs text-slate-500">Zaboravi na dugu pretragu - kuvaj ono što već imaš.</p>
                </div>
                <div className="bg-white/50 backdrop-blur-sm p-6 rounded-3xl border border-white/50 text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
                        <FiTruck className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-slate-800 mb-2">Manje otpada</h4>
                    <p className="text-xs text-slate-500">Iskoristi namirnice pre nego što im istekne rok.</p>
                </div>
            </div>
        </div>
    );
}
