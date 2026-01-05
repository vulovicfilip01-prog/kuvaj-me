'use client'

import { useState } from 'react'
import { generateRecipeAction } from '@/app/recipes/ai-actions'
import { FiX, FiZap, FiLoader, FiCheck } from 'react-icons/fi'

interface AIRecipeModalProps {
    isOpen: boolean
    onClose: () => void
    onApply: (recipeData: any) => void
}

export default function AIRecipeModal({ isOpen, onClose, onApply }: AIRecipeModalProps) {
    const [prompt, setPrompt] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [preview, setPreview] = useState<any>(null)

    if (!isOpen) return null

    const handleGenerate = async () => {
        if (!prompt.trim()) return

        setLoading(true)
        setError(null)
        setPreview(null)

        const result = await generateRecipeAction(prompt)

        if (result.success) {
            setPreview(result.recipe)
        } else {
            setError(result.error || "Greška pri generisanju")
        }
        setLoading(false)
    }

    const handleApply = () => {
        if (preview) {
            onApply(preview)
            onClose()
        }
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-slideUp border border-slate-100">
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-primary/5 to-transparent">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                            <FiZap className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 heading-font">AI Recept Kreator</h3>
                            <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">Generiši magiju u sekundi</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                        <FiX className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-8">
                    {!preview ? (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">
                                    Šta ti se danas jede? 🍲
                                </label>
                                <textarea
                                    autoFocus
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="Npr. Pasta sa piletinom i spanaćem u belom sosu, za dvoje, spremno za 20 min..."
                                    rows={4}
                                    className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 focus:bg-white transition-all text-lg resize-none"
                                />
                                <p className="mt-3 text-xs text-slate-500 italic ml-1">
                                    Možete uneti sastojke, naziv jela ili čak samo priliku (npr. "Brzi doručak za decu").
                                </p>
                            </div>

                            {error && (
                                <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-center gap-2 animate-shake">
                                    <span className="text-lg">⚠️</span> {error}
                                </div>
                            )}

                            <button
                                onClick={handleGenerate}
                                disabled={loading || !prompt.trim()}
                                className="w-full py-5 bg-gradient-to-r from-primary to-primary-dark text-white font-bold text-xl rounded-2xl hover:shadow-xl hover:shadow-primary/30 transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                            >
                                {loading ? (
                                    <>
                                        <FiLoader className="w-6 h-6 animate-spin" />
                                        <span>Generisanje...</span>
                                    </>
                                ) : (
                                    <>
                                        <FiZap className="w-6 h-6" />
                                        <span>Napravi Recept</span>
                                    </>
                                )}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
                                <h4 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                                    <FiCheck className="text-primary w-5 h-5" />
                                    {preview.title}
                                </h4>
                                <p className="text-sm text-slate-600 mb-4 line-clamp-2">{preview.description}</p>

                                <div className="flex flex-wrap gap-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg border border-slate-100">
                                        ⏱️ {preview.prep_time + preview.cook_time} min
                                    </span>
                                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg border border-slate-100">
                                        🍴 {preview.servings} porcije
                                    </span>
                                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg border border-slate-100">
                                        📊 {preview.difficulty}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setPreview(null)}
                                    className="py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all"
                                >
                                    Pokušaj ponovo
                                </button>
                                <button
                                    onClick={handleApply}
                                    className="py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary-dark hover:shadow-lg transition-all"
                                >
                                    Ubaci u formu
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
