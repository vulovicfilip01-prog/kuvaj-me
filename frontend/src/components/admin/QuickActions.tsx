'use client'

import { useState } from 'react'
import { FiRefreshCw, FiMail, FiZap, FiDatabase, FiExternalLink } from 'react-icons/fi'
import { revalidateHome, checkDatabaseStatus, sendWeeklyDigest } from '@/app/admin/actions'
import Link from 'next/link'

export default function QuickActions() {
    const [loading, setLoading] = useState<string | null>(null)
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null)

    const handleAction = async (name: string, fn: () => Promise<any>) => {
        setLoading(name)
        setStatus(null)
        try {
            const result = await fn()
            if (result.success) {
                setStatus({ type: 'success', message: `${name} uspešno izvršeno!` })
            } else {
                setStatus({ type: 'error', message: result.error || 'Došlo je do greške.' })
            }
        } catch (e: any) {
            setStatus({ type: 'error', message: e.message })
        } finally {
            setLoading(null)
        }
    }

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <FiZap className="text-amber-500" />
                Brze Akcije
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                    onClick={() => handleAction('Osvežavanje početne', revalidateHome)}
                    disabled={!!loading}
                    className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 hover:border-primary/30 hover:bg-primary/5 transition-all group disabled:opacity-50"
                >
                    <FiRefreshCw className={`w-6 h-6 mb-2 text-slate-600 group-hover:text-primary ${loading === 'Osvežavanje početne' ? 'animate-spin' : ''}`} />
                    <span className="text-sm font-medium text-slate-700">Osveži početnu</span>
                </button>

                <button
                    onClick={() => handleAction('Nedeljni digest', sendWeeklyDigest)}
                    disabled={!!loading}
                    className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 hover:border-primary/30 hover:bg-primary/5 transition-all group disabled:opacity-50"
                >
                    <FiMail className={`w-6 h-6 mb-2 text-slate-600 group-hover:text-primary ${loading === 'Nedeljni digest' ? 'animate-bounce' : ''}`} />
                    <span className="text-sm font-medium text-slate-700">Nedeljni digest</span>
                </button>

                <button
                    onClick={() => handleAction('Status baze', checkDatabaseStatus)}
                    disabled={!!loading}
                    className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 hover:border-primary/30 hover:bg-primary/5 transition-all group disabled:opacity-50"
                >
                    <FiDatabase className="w-6 h-6 mb-2 text-slate-600 group-hover:text-primary" />
                    <span className="text-sm font-medium text-slate-700">Status baze</span>
                </button>

                <Link
                    href="/admin/newsletter"
                    className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 hover:border-primary/30 hover:bg-primary/5 transition-all group"
                >
                    <FiExternalLink className="w-6 h-6 mb-2 text-slate-600 group-hover:text-primary" />
                    <span className="text-sm font-medium text-slate-700">Newsletter</span>
                </Link>
            </div>

            {status && (
                <div className={`mt-6 p-3 rounded-lg text-sm font-medium text-center ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}>
                    {status.message}
                </div>
            )}
        </div>
    )
}
