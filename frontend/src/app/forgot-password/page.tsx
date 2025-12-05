'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        const supabase = createClient()
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/reset-password`,
        })

        if (error) {
            setMessage({ type: 'error', text: error.message })
        } else {
            setMessage({
                type: 'success',
                text: 'Proverite email za link za resetovanje lozinke'
            })
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-transparent">
            <div className="w-full max-w-md p-8 bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-slate-200">
                <h1 className="text-4xl font-bold text-slate-900 mb-4 text-center">Zaboravljena lozinka</h1>
                <p className="text-slate-600 text-center mb-8">
                    Unesite email adresu i poslaćemo vam link za resetovanje
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                            placeholder="tvoj@email.com"
                        />
                    </div>

                    {message && (
                        <div className={`p-3 border rounded-lg text-sm ${message.type === 'success'
                            ? 'bg-green-50 border-green-200 text-green-700'
                            : 'bg-red-50 border-red-200 text-red-700'
                            }`}>
                            {message.text}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-gradient-to-r from-primary to-primary-dark text-white font-semibold rounded-lg hover:from-primary-dark hover:to-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-slate-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Slanje...' : 'Pošalji link'}
                    </button>
                </form>

                <p className="mt-6 text-center text-slate-600">
                    Setili ste se lozinke?{' '}
                    <Link href="/login" className="text-primary hover:text-primary-light font-semibold transition">
                        Prijavi se
                    </Link>
                </p>
            </div>
        </div>
    )
}
