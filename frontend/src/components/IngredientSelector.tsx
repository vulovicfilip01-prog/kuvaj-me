'use client';

import { useState } from 'react';
import VegetableIcon from '@/components/VegetableIcon';
import MilkIcon from '@/components/MilkIcon';
import CheeseIcon from '@/components/CheeseIcon';

interface IngredientSelectorProps {
    selectedIngredients: string[];
    onAdd: (ingredient: string) => void;
    onRemove: (ingredient: string) => void;
    onSearch: () => void;
    loading: boolean;
}

export default function IngredientSelector({
    selectedIngredients,
    onAdd,
    onRemove,
    onSearch,
    loading
}: IngredientSelectorProps) {
    const [input, setInput] = useState('');

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAdd();
        }
    };

    const handleAdd = () => {
        if (input.trim()) {
            onAdd(input.trim());
            setInput('');
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto glass-panel rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary-dark"></div>

            <h2 className="text-3xl font-bold text-slate-900 mb-4 text-center heading-font">
                Šta imaš u frižideru?
                <div className="flex items-center gap-2 ml-3">
                    <VegetableIcon className="w-8 h-8" />
                    <MilkIcon className="w-8 h-8" />
                    <CheeseIcon className="w-8 h-8" />
                </div>
            </h2>
            <p className="text-slate-600 text-center mb-8 text-lg">
                Unesi sastojke koje imaš, a mi ćemo ti naći <span className="text-primary font-medium">savršen recept</span>!
            </p>

            <div className="flex gap-3 mb-8">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="npr. piletina, jaja, brašno..."
                    className="flex-1 px-6 py-4 bg-white/50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-lg"
                />
                <button
                    onClick={handleAdd}
                    disabled={!input.trim()}
                    className="px-8 py-4 bg-primary text-white rounded-2xl hover:bg-primary-dark transition-all font-bold shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                >
                    Dodaj
                </button>
            </div>

            {/* Selected Ingredients Chips */}
            <div className="min-h-[60px] mb-8">
                {selectedIngredients.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                        {selectedIngredients.map((ing) => (
                            <span
                                key={ing}
                                className="pl-4 pr-2 py-2 bg-white border border-slate-200 text-slate-700 rounded-full text-sm font-medium flex items-center gap-2 animate-fadeIn hover:bg-slate-50 transition-colors group"
                            >
                                {ing}
                                <button
                                    onClick={() => onRemove(ing)}
                                    className="w-6 h-6 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-red-500 hover:text-white transition-all"
                                >
                                    ✕
                                </button>
                            </span>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-slate-600 italic py-2">
                        Još nisi dodao nijedan sastojak...
                    </div>
                )}
            </div>

            {/* Search Button */}
            <button
                onClick={onSearch}
                disabled={selectedIngredients.length === 0 || loading}
                className="w-full py-5 bg-gradient-to-r from-primary to-primary-dark text-white font-bold text-xl rounded-2xl hover:from-primary-dark hover:to-primary-dark transition-all shadow-xl shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1 active:translate-y-0 disabled:hover:translate-y-0"
            >
                {loading ? (
                    <span className="flex items-center justify-center gap-2">
                        <span className="animate-spin">⏳</span> Tražim recepte...
                    </span>
                ) : (
                    '🔍 Pronađi recepte'
                )}
            </button>
        </div>
    );
}
