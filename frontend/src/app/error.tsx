'use client'

import { useEffect } from 'react'
import Navbar from '@/components/Navbar'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
            <div className="container mx-auto px-6 py-20 text-center">
                <div className="max-w-2xl mx-auto glass-panel rounded-3xl p-12 border-red-100 bg-red-50/50">
                    <div className="text-8xl mb-6">🔥</div>
                    <h2 className="text-4xl font-bold text-slate-900 mb-4 heading-font">
                        Nešto je pošlo po zlu!
                    </h2>
                    <p className="text-slate-600 text-lg mb-8">
                        Izvinjavamo se, došlo je do greške prilikom učitavanja stranice.
                        Naš tim je obavešten o ovom problemu.
                    </p>

                    <div className="flex gap-4 justify-center flex-col sm:flex-row">
                        <button
                            onClick={reset}
                            className="px-8 py-3 bg-primary text-white rounded-full font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
                        >
                            Pokušaj ponovo
                        </button>
                        <a
                            href="/"
                            className="px-8 py-3 bg-white border border-slate-200 text-slate-700 rounded-full font-bold hover:border-primary/30 hover:text-primary transition-all"
                        >
                            Idi na početnu
                        </a>
                    </div>
                </div>
            </div>
        </main>
    )
}
