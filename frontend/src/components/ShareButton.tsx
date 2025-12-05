'use client'

import { useState } from 'react'

interface ShareButtonProps {
    recipeTitle: string
    recipeDescription: string
    recipeUrl: string
}

export default function ShareButton({ recipeTitle, recipeDescription, recipeUrl }: ShareButtonProps) {
    const [showMenu, setShowMenu] = useState(false)
    const [copied, setCopied] = useState(false)

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: recipeTitle,
                    text: recipeDescription,
                    url: recipeUrl
                })
                setShowMenu(false)
            } catch (err) {
                console.log('Share cancelled')
            }
        } else {
            setShowMenu(!showMenu)
        }
    }

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(recipeUrl)
            setCopied(true)
            setTimeout(() => {
                setCopied(false)
                setShowMenu(false)
            }, 2000)
        } catch (err) {
            console.error('Failed to copy:', err)
        }
    }

    const shareLinks = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(recipeUrl)}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(recipeUrl)}&text=${encodeURIComponent(recipeTitle)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(`${recipeTitle} - ${recipeUrl}`)}`
    }

    return (
        <div className="relative">
            <button
                onClick={handleNativeShare}
                className="px-4 py-2 bg-primary/90 text-white rounded-xl hover:bg-primary transition-all border border-primary/50 font-medium flex items-center gap-2 shadow-lg backdrop-blur-md"
            >
                🔗 Podeli
            </button>

            {/* Dropdown Menu for non-native share */}
            {showMenu && !navigator.share && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowMenu(false)}
                    />

                    {/* Menu */}
                    <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 min-w-[200px] z-50 animate-fadeIn">
                        <button
                            onClick={() => window.open(shareLinks.facebook, '_blank')}
                            className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors flex items-center gap-3"
                        >
                            <span className="text-xl">📘</span>
                            <span className="font-medium text-slate-700">Facebook</span>
                        </button>

                        <button
                            onClick={() => window.open(shareLinks.twitter, '_blank')}
                            className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors flex items-center gap-3"
                        >
                            <span className="text-xl">🐦</span>
                            <span className="font-medium text-slate-700">Twitter</span>
                        </button>

                        <button
                            onClick={() => window.open(shareLinks.whatsapp, '_blank')}
                            className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors flex items-center gap-3"
                        >
                            <span className="text-xl">💬</span>
                            <span className="font-medium text-slate-700">WhatsApp</span>
                        </button>

                        <div className="border-t border-slate-200 my-2"></div>

                        <button
                            onClick={handleCopyLink}
                            className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors flex items-center gap-3"
                        >
                            <span className="text-xl">{copied ? '✅' : '📋'}</span>
                            <span className="font-medium text-slate-700">
                                {copied ? 'Kopirano!' : 'Kopiraj link'}
                            </span>
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}
