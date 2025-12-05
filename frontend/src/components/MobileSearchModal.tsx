'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FiSearch, FiX } from 'react-icons/fi'

interface MobileSearchModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function MobileSearchModal({ isOpen, onClose }: MobileSearchModalProps) {
    const [query, setQuery] = useState('')
    const router = useRouter()

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (query.trim()) {
            router.push(`/search/results?q=${encodeURIComponent(query.trim())}`)
            onClose()
            setQuery('')
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden">
            {/* Overlay */}
            <div className="absolute inset-0" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-white rounded-t-3xl mt-20 p-6 animate-slideUp">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-slate-900 heading-font">Pretraži recepte</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                        aria-label="Zatvori"
                    >
                        <FiX className="w-6 h-6 text-slate-600" />
                    </button>
                </div>

                {/* Search Form */}
                <form onSubmit={handleSearch}>
                    <div className="relative">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Pretraži po nazivu, opisu ili sastojku..."
                            autoFocus
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-lg"
                        />
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6" />
                    </div>
                    <button
                        type="submit"
                        disabled={!query.trim()}
                        className="w-full mt-4 py-4 bg-gradient-to-r from-primary to-primary-dark text-white rounded-2xl font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Pretraži
                    </button>
                </form>
            </div>
        </div>
    )
}
