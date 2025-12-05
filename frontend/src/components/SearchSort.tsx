'use client';

interface SearchSortProps {
    sortBy: string;
    onSortChange: (sort: string) => void;
}

export default function SearchSort({ sortBy, onSortChange }: SearchSortProps) {
    const sortOptions = [
        { value: 'relevance', label: '🎯 Najrelevantnije', icon: '⭐' },
        { value: 'time-asc', label: '⏱️ Najbrže prvo', icon: '⚡' },
        { value: 'time-desc', label: '⏱️ Najduže prvo', icon: '🐢' },
        { value: 'name-asc', label: '🔤 A-Z', icon: '📝' },
        { value: 'name-desc', label: '🔤 Z-A', icon: '📝' },
    ];

    return (
        <div className="flex flex-wrap gap-3 items-center">
            <span className="text-sm font-medium text-slate-600">Sortiraj po:</span>
            {sortOptions.map((option) => (
                <button
                    key={option.value}
                    onClick={() => onSortChange(option.value)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${sortBy === option.value
                        ? 'bg-primary text-white shadow-lg shadow-primary/30'
                        : 'glass-panel hover:border-primary/50 text-slate-600 hover:text-primary hover:bg-white/50'
                        }`}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
}
