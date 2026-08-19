'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CookieBanner() {
    const [showBanner, setShowBanner] = useState(false)

    useEffect(() => {
        const consent = localStorage.getItem('cookie-consent')
        if (!consent) {
            setShowBanner(true)
        }
    }, [])

    const handleAccept = () => {
        localStorage.setItem('cookie-consent', 'accepted')
        setShowBanner(false)
        // GA events can proceed now
    }

    const handleDecline = () => {
        localStorage.setItem('cookie-consent', 'declined')
        setShowBanner(false)
    }

    if (!showBanner) return null

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-slideUp">
            <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-md border border-slate-200 shadow-2xl rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6">
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-1">🍪 Kolačići i privatnost</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                        Koristimo kolačiće kako bismo poboljšali tvoje iskustvo na Kuvaj.me i analizirali posete.
                        Nastavkom korišćenja sajta pristaješ na našu
                        <Link href="/privacy" className="text-primary hover:underline ml-1 font-medium">Politiku privatnosti</Link>.
                    </p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button
                        onClick={handleDecline}
                        className="flex-1 md:flex-none px-6 py-2.5 text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors"
                    >
                        Odbijam
                    </button>
                    <button
                        onClick={handleAccept}
                        className="flex-1 md:flex-none px-8 py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
                    >
                        Prihvatam
                    </button>
                </div>
            </div>
        </div>
    )
}
