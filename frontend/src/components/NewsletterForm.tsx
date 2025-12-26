'use client'

import { useState } from 'react'
import { subscribeToNewsletter } from '@/app/actions'
import { FiMail, FiCheck, FiSend } from 'react-icons/fi'

export default function NewsletterForm() {
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [message, setMessage] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setStatus('loading')

        const result = await subscribeToNewsletter(email)

        if (result.success) {
            setStatus('success')
            setEmail('')
        } else {
            setStatus('error')
            setMessage(result.error || 'Greška')
        }
    }

    if (status === 'success') {
        return (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-xl">
                <FiCheck />
                <span>Uspešno ste prijavljeni!</span>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
            <div className="flex flex-col gap-2">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <FiMail />
                    </div>
                    <input
                        type="email"
                        placeholder="Tvoja email adresa"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-12 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800 placeholder:text-slate-400"
                    />
                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="absolute inset-y-1 right-1 bg-gradient-to-r from-[#d4a373] to-[#bc8a5f] text-white p-2 rounded-lg hover:from-[#bc8a5f] hover:to-[#a4714b] transition-all shadow-sm hover:shadow-md disabled:opacity-50 flex items-center justify-center min-w-[36px]"
                    >
                        {status === 'loading' ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <FiSend className="w-4 h-4" />
                        )}
                    </button>
                </div>
                {status === 'error' && (
                    <p className="text-red-500 text-sm pl-2">{message}</p>
                )}
            </div>
        </form>
    )
}
