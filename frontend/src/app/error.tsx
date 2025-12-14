'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import ChefHatIcon from '@/components/ChefHatIcon'

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
            {/* Static Navbar for Error Page */}
            <nav className="container mx-auto px-6 py-6 flex justify-between items-center bg-white/80 backdrop-blur-md shadow-sm rounded-b-3xl mb-8">
                <Link href="/" className="flex items-center gap-3 group">
                    <ChefHatIcon className="w-10 h-10 transform group-hover:rotate-12 transition-transform duration-300" />
                    <span className="text-2xl font-bold text-gradient heading-font tracking-tight">Kuvaj.me</span>
                </Link>
                <Link href="/" className="px-5 py-2.5 text-slate-600 hover:text-slate-900 transition-colors font-medium">
                    Početna
                </Link>
            </nav>

            <div className="container mx-auto px-6 py-20 text-center">
                <div className="max-w-2xl mx-auto glass-panel rounded-3xl p-12 border-red-100 bg-red-50/50">
                    <div className="text-8xl mb-6">🔥</div>
                    <h2 className="text-4xl font-bold text-slate-900 mb-4 heading-font">
                        Nešto je pošlo po zlu!
                    </h2>
                    <div className="bg-red-100 p-4 rounded-lg mb-8 text-left overflow-auto max-h-40">
                        <p className="font-bold text-red-800 text-sm">Technical Details (Screenshot this):</p>
                        <p className="font-mono text-xs text-red-700 mt-2">{error.message}</p>
                        {error.digest && <p className="font-mono text-xs text-red-700 mt-1">Digest: {error.digest}</p>}
                    </div>

                    <div className="flex gap-4 justify-center flex-col sm:flex-row">
                        <button
                            onClick={reset}
                            className="px-8 py-3 bg-primary text-white rounded-full font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
                        >
                            Pokušaj ponovo
                        </button>
                        <Link
                            href="/"
                            className="px-8 py-3 bg-white border border-slate-200 text-slate-700 rounded-full font-bold hover:border-primary/30 hover:text-primary transition-all"
                        >
                            Idi na početnu
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    )
}
