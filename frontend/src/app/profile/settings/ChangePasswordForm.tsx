'use client'

import { useState } from 'react'
import { FiLock, FiCheck, FiX, FiLoader } from 'react-icons/fi'
import { changePassword } from './actions'

export default function ChangePasswordForm() {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const handleSubmit = async (formData: FormData) => {
        setLoading(true)
        setMessage(null)

        const result = await changePassword(formData)

        if (result.error) {
            setMessage({ type: 'error', text: result.error })
        } else {
            setMessage({ type: 'success', text: 'Lozinka uspešno promenjena!' })
            // Reset form
            const form = document.getElementById('password-form') as HTMLFormElement
            form.reset()
        }
        setLoading(false)
    }

    return (
        <form id="password-form" action={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nova lozinka</label>
                <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="password"
                        name="password"
                        required
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="••••••••"
                        minLength={6}
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Potvrdite lozinku</label>
                <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="password"
                        name="confirmPassword"
                        required
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="••••••••"
                        minLength={6}
                    />
                </div>
            </div>

            {message && (
                <div className={`p-3 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}>
                    {message.type === 'success' ? <FiCheck /> : <FiX />}
                    <span className="text-sm">{message.text}</span>
                </div>
            )}

            <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
            >
                {loading ? <FiLoader className="animate-spin" /> : 'Promeni lozinku'}
            </button>
        </form>
    )
}
