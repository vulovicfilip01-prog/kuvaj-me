'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { FcGoogle } from 'react-icons/fc'

export default function GoogleSignInButton({ text = 'Nastavi preko Google-a' }: { text?: string }) {
    const [isLoading, setIsLoading] = useState(false)
    const supabase = createClient()

    const handleGoogleSignIn = async () => {
        setIsLoading(true)
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`
            }
        })

        if (error) {
            console.error('Google Sign In Error:', error.message)
            setIsLoading(false)
        }
    }

    return (
        <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            type="button"
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isLoading ? (
                <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
            ) : (
                <FcGoogle className="w-5 h-5" />
            )}
            <span>{isLoading ? 'Povezivanje...' : text}</span>
        </button>
    )
}
