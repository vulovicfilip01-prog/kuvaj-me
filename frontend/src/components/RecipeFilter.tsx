'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { FiFilter, FiClock, FiBarChart2, FiGrid } from 'react-icons/fi'

interface Category {
    id: string
    name: string
}

interface RecipeFilterProps {
    categories: Category[]
}

export default function RecipeFilter({ categories }: RecipeFilterProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
    const [selectedDifficulty, setSelectedDifficulty] = useState(searchParams.get('difficulty') || '')
    const [selectedTime, setSelectedTime] = useState(searchParams.get('time') || '')
    const [isPosno, setIsPosno] = useState(searchParams.get('posno') === 'true')
    const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest')

    // Update state when URL params change
    useEffect(() => {
        setSelectedCategory(searchParams.get('category') || '')
        setSelectedDifficulty(searchParams.get('difficulty') || '')
        setSelectedTime(searchParams.get('time') || '')
        setIsPosno(searchParams.get('posno') === 'true')
        setSortBy(searchParams.get('sort') || 'newest')
    }, [searchParams])

    const updateFilters = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (value) {
            params.set(key, value)
        } else {
            params.delete(key)
        }
        router.push(`/explore?${params.toString()}`)
    }

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
                <FiFilter className="text-primary w-5 h-5" />
                <h3 className="font-bold text-lg text-slate-900">Filteri</h3>
            </div>

            <div className="space-y-8">
                {/* Sort By */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">Sortiraj po</label>
                    <select
                        value={sortBy}
                        onChange={(e) => updateFilters('sort', e.target.value)}
                        className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none cursor-pointer"
                    >
                        <option value="newest">Najnovije</option>
                        <option value="popular">Popularno</option>
                        <option value="fastest">Najbrže</option>
                    </select>
                </div>

                {/* Posno Toggle */}
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-100">
                    <span className="font-bold text-green-800 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-leaf-icon lucide-leaf"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" /></svg>
                        Samo posno
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={isPosno}
                            onChange={(e) => updateFilters('posno', e.target.checked ? 'true' : '')}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                </div>

                {/* Categories */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                        <FiGrid className="w-4 h-4" /> Kategorija
                    </label>
                    <div className="space-y-2">
                        <button
                            onClick={() => updateFilters('category', '')}
                            className={`w-full text-left px-4 py-2 rounded-xl text-sm transition-all flex items-center justify-between group ${selectedCategory === ''
                                ? 'bg-primary text-white shadow-md shadow-primary/20 font-medium'
                                : 'hover:bg-slate-50 text-slate-600'
                                }`}
                        >
                            <span>Sve kategorije</span>
                            {selectedCategory === '' && <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">✓</span>}
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => updateFilters('category', cat.id)}
                                className={`w-full text-left px-4 py-2 rounded-xl text-sm transition-all flex items-center justify-between group ${selectedCategory === cat.id
                                    ? 'bg-primary text-white shadow-md shadow-primary/20 font-medium'
                                    : 'hover:bg-slate-50 text-slate-600'
                                    }`}
                            >
                                <span>{cat.name}</span>
                                {selectedCategory === cat.id && <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">✓</span>}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Difficulty */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                        <FiBarChart2 className="w-4 h-4" /> Težina
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {['lako', 'srednje', 'teško'].map((diff) => (
                            <button
                                key={diff}
                                onClick={() => updateFilters('difficulty', selectedDifficulty === diff ? '' : diff)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${selectedDifficulty === diff
                                    ? 'bg-primary text-white border-primary'
                                    : 'bg-white text-slate-600 border-slate-200 hover:border-primary/50'
                                    }`}
                            >
                                {diff.charAt(0).toUpperCase() + diff.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Prep Time */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                        <FiClock className="w-4 h-4" /> Vreme pripreme
                    </label>
                    <div className="space-y-2">
                        {[
                            { label: 'Sve', value: '' },
                            { label: '< 30 min', value: '30' },
                            { label: '< 60 min', value: '60' },
                            { label: '> 60 min', value: '60+' },
                        ].map((time) => (
                            <label key={time.value} className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="radio"
                                    name="time"
                                    value={time.value}
                                    checked={selectedTime === time.value}
                                    onChange={() => updateFilters('time', time.value)}
                                    className="w-4 h-4 text-primary border-slate-300 focus:ring-primary"
                                />
                                <span className={`text-sm group-hover:text-primary transition-colors ${selectedTime === time.value ? 'font-bold text-slate-900' : 'text-slate-600'}`}>
                                    {time.label}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Reset Button */}
                {(selectedCategory || selectedDifficulty || selectedTime || sortBy !== 'newest') && (
                    <button
                        onClick={() => router.push('/explore')}
                        className="w-full py-2 text-sm text-slate-500 hover:text-red-500 font-medium transition-colors border-t border-slate-100 pt-4"
                    >
                        Poništi sve filtere
                    </button>
                )}
            </div>
        </div>
    )
}
