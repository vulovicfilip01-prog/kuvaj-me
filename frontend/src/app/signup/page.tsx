'use client'

import { signup } from '../actions'
import { useState } from 'react'
import Link from 'next/link'

export default function SignupPage() {
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setError(null)
        const result = await signup(formData)

        if (result?.error) {
            setError(result.error)
            setLoading(false)
        } else if (result?.success) {
            setSuccess(true)
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-transparent">
                <div className="w-full max-w-md p-8 bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-slate-200 text-center">
                    <div className="text-6xl mb-6">📧</div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-4">Proverite email</h1>
                    <p className="text-slate-600 mb-8">
                        Poslali smo vam link za potvrdu na vašu email adresu.
                        Molimo vas da kliknete na link kako biste aktivirali nalog.
                    </p>
                    <Link href="/login" className="text-primary font-bold hover:underline">
                        Nazad na prijavu
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-transparent">
            <div className="w-full max-w-md p-8 bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-slate-200">
                <h1 className="text-4xl font-bold text-slate-900 mb-8 text-center">Registruj se</h1>

                <form action={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                            placeholder="tvoj@email.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                            Lozinka
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            minLength={6}
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                            placeholder="••••••••"
                        />
                        <p className="mt-1 text-xs text-slate-500">Minimalno 6 karaktera</p>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-gradient-to-r from-primary to-primary-dark text-white font-semibold rounded-lg hover:from-primary-dark hover:to-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-slate-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Kreiranje naloga...' : 'Kreiraj nalog'}
                    </button>
                </form>

                <p className="mt-6 text-center text-slate-600">
                    Već imaš nalog?{' '}
                    <Link href="/login" className="text-primary hover:text-primary-light font-semibold transition">
                        Prijavi se
                    </Link>
                </p>
            </div>
        </div>
    )
}
