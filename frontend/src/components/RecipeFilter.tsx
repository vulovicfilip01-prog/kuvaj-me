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
    const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest')

    // Update state when URL params change
    useEffect(() => {
        setSelectedCategory(searchParams.get('category') || '')
        setSelectedDifficulty(searchParams.get('difficulty') || '')
        setSelectedTime(searchParams.get('time') || '')
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
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 h-fit sticky top-24">
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

                {/* Categories */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                        <FiGrid className="w-4 h-4" /> Kategorija
                    </label>
                    <div className="space-y-2">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="radio"
                                name="category"
                                value=""
                                checked={selectedCategory === ''}
                                onChange={() => updateFilters('category', '')}
                                className="w-4 h-4 text-primary border-slate-300 focus:ring-primary"
                            />
                            <span className={`text-sm group-hover:text-primary transition-colors ${selectedCategory === '' ? 'font-bold text-slate-900' : 'text-slate-600'}`}>
                                Sve kategorije
                            </span>
                        </label>
                        {categories.map((cat) => (
                            <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="radio"
                                    name="category"
                                    value={cat.id}
                                    checked={selectedCategory === cat.id}
                                    onChange={() => updateFilters('category', cat.id)}
                                    className="w-4 h-4 text-primary border-slate-300 focus:ring-primary"
                                />
                                <span className={`text-sm group-hover:text-primary transition-colors ${selectedCategory === cat.id ? 'font-bold text-slate-900' : 'text-slate-600'}`}>
                                    {cat.name}
                                </span>
                            </label>
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
