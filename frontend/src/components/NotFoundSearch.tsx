'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FiSearch } from 'react-icons/fi'

export default function NotFoundSearch() {
    const [query, setQuery] = useState('')
    const router = useRouter()

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (query.trim()) {
            router.push(`/search/results?q=${encodeURIComponent(query.trim())}`)
        }
    }

    return (
        <form onSubmit={handleSearch} className="max-w-md mx-auto mb-8 relative">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Pretraži recepte..."
                className="w-full pl-6 pr-12 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-sm"
            />
            <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-100 rounded-xl transition-colors text-primary"
            >
                <FiSearch className="w-6 h-6" />
            </button>
        </form>
    )
}
