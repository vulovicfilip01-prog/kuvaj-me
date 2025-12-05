'use client';

interface SearchFiltersProps {
    categories: string[];
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
    difficulty: string;
    onDifficultyChange: (difficulty: string) => void;
    maxTime: number;
    onMaxTimeChange: (time: number) => void;
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
    onClearFilters
}: SearchFiltersProps) {
    const hasActiveFilters = selectedCategory !== 'sve' || difficulty !== 'sve' || maxTime < 300;

    return (
        <div className="glass-panel rounded-3xl p-6 space-y-6 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold heading-font flex items-center gap-2 text-slate-900">
                    🎯 Filteri
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
