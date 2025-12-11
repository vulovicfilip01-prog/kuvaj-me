'use client';

import { FiFilter } from 'react-icons/fi';

interface SearchFiltersProps {
    categories: string[];
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
    difficulty: string;
    onDifficultyChange: (difficulty: string) => void;
    maxTime: number;
    onMaxTimeChange: (time: number) => void;
    isPosno: boolean;
    onPosnoChange: (isPosno: boolean) => void;
    onClearFilters: () => void;
}

export default function SearchFilters({
    categories,
    selectedCategory,
    onCategoryChange,
    difficulty,
    onDifficultyChange,
    maxTime,
    onMaxTimeChange,
    isPosno,
    onPosnoChange,
    onClearFilters
}: SearchFiltersProps) {
    const hasActiveFilters = selectedCategory !== 'sve' || difficulty !== 'sve' || maxTime < 300 || isPosno;

    return (
        <div className="glass-panel rounded-3xl p-6 space-y-6 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold heading-font flex items-center gap-2 text-slate-900">
                    <FiFilter className="text-primary w-6 h-6" /> Filteri
                </h3>
                {hasActiveFilters && (
                    <button
                        onClick={onClearFilters}
                        className="text-sm text-slate-600 hover:text-primary transition-colors"
                    >
                        Obriši sve
                    </button>
                )}
            </div>

            {/* Posno Filter */}
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-100">
                <span className="font-bold text-green-800 flex items-center gap-2 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-leaf-icon lucide-leaf"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" /></svg>
                    Samo posno
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={isPosno}
                        onChange={(e) => onPosnoChange(e.target.checked)}
                        className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"></div>
                </label>
            </div>

            {/* Category Filter */}
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">Kategorija</label>
                <select
                    value={selectedCategory}
                    onChange={(e) => onCategoryChange(e.target.value)}
                    className="w-full bg-white/50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                >
                    <option value="sve">Sve kategorije</option>
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            {/* Difficulty Filter */}
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">Težina</label>
                <div className="grid grid-cols-4 gap-2">
                    {['sve', 'lako', 'srednje', 'teško'].map((diff) => (
                        <button
                            key={diff}
                            onClick={() => onDifficultyChange(diff)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${difficulty === diff
                                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                : 'bg-white/50 text-slate-600 hover:bg-white border border-slate-200'
                                }`}
                        >
                            {diff === 'sve' ? 'Sve' : diff.charAt(0).toUpperCase() + diff.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Max Time Filter */}
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                    Maksimalno vreme: <span className="text-primary font-bold">{maxTime === 300 ? '∞' : `${maxTime} min`}</span>
                </label>
                <input
                    type="range"
                    min="15"
                    max="300"
                    step="15"
                    value={maxTime}
                    onChange={(e) => onMaxTimeChange(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>15 min</span>
                    <span>300+ min</span>
                </div>
            </div>
        </div>
    );
}
