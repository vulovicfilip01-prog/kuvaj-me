'use client'

import { useState } from 'react'

interface CommentFormProps {
    onSubmit: (content: string) => Promise<void>
    initialContent?: string
    onCancel?: () => void
    submitLabel?: string
    placeholder?: string
}

export default function CommentForm({
    onSubmit,
    initialContent = '',
    onCancel,
    submitLabel = 'Objavi komentar',
    placeholder = 'Napiši svoj komentar...'
}: CommentFormProps) {
    const [content, setContent] = useState(initialContent)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!content.trim()) {
            setError('Komentar ne može biti prazan')
            return
        }

        if (content.length > 1000) {
            setError('Komentar ne može biti duži od 1000 karaktera')
            return
        }

        setIsSubmitting(true)
        setError(null)

        try {
            await onSubmit(content)
            setContent('')
        } catch (err: any) {
            setError(err.message || 'Greška pri čuvanju komentara')
        } finally {
            setIsSubmitting(false)
        }
    }

    const charCount = content.length
    const isOverLimit = charCount > 1000

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <div>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={placeholder}
                    rows={4}
                    className={`w-full px-4 py-3 bg-white/50 border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none ${isOverLimit ? 'border-red-500' : 'border-slate-200'
                        }`}
                    disabled={isSubmitting}
                />
                <div className="flex justify-between items-center mt-1">
                    <span className={`text-xs ${isOverLimit ? 'text-red-500' : 'text-slate-500'}`}>
                        {charCount}/1000 karaktera
                    </span>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm">
                    {error}
                </div>
            )}

            <div className="flex gap-3">
                <button
                    type="submit"
                    disabled={isSubmitting || !content.trim() || isOverLimit}
                    className="px-6 py-2.5 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Čuvanje...' : submitLabel}
                </button>
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors"
                    >
                        Otkaži
                    </button>
                )}
            </div>
        </form>
    )
}
