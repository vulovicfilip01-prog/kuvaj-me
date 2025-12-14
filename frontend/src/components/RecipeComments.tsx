'use client'

import { useState } from 'react'
import { addComment, deleteComment } from '@/app/recipes/comment-actions'
import { FiTrash2, FiUser } from 'react-icons/fi'
import Image from 'next/image'
import Link from 'next/link'

interface Comment {
    id: string
    content: string
    created_at: string
    user_id: string
    profiles: {
        display_name: string | null
        avatar_url: string | null
    } | null
}

interface RecipeCommentsProps {
    recipeId: string
    initialComments: Comment[]
    user: any // Supabase user
}

export default function RecipeComments({ recipeId, initialComments, user }: RecipeCommentsProps) {
    const [comments, setComments] = useState<Comment[]>(initialComments)
    const [newComment, setNewComment] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!user) return
        if (!newComment.trim()) return

        setLoading(true)
        setError(null)

        const result = await addComment(recipeId, newComment)

        if (result.error) {
            setError(result.error)
        } else if (result.data) {
            setComments([result.data, ...comments])
            setNewComment('')
        }

        setLoading(false)
    }

    async function handleDelete(commentId: string) {
        if (!confirm('Da li ste sigurni da želite da obrišete komentar?')) return

        const result = await deleteComment(commentId)
        if (result.success) {
            setComments(comments.filter(c => c.id !== commentId))
        } else {
            alert('Greška prilikom brisanja')
        }
    }

    return (
        <div className="mt-12 bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
            <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl">💬</span>
                Komentari ({comments.length})
            </h3>

            {/* Comment Form */}
            {user ? (
                <form onSubmit={handleSubmit} className="mb-10">
                    <div className="flex gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                            <FiUser />
                        </div>
                        <div className="flex-grow">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Napišite komentar..."
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none transition-all placeholder:text-slate-400 min-h-[100px]"
                            />
                            {error && (
                                <p className="text-red-500 text-sm mt-2">{error}</p>
                            )}
                            <div className="flex justify-end mt-3">
                                <button
                                    type="submit"
                                    disabled={loading || !newComment.trim()}
                                    className="px-6 py-2 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-primary/20"
                                >
                                    {loading ? 'Slanje...' : 'Pošalji'}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="bg-slate-50 rounded-2xl p-6 text-center mb-10 border border-slate-100">
                    <p className="text-slate-600 mb-3">Morate biti prijavljeni da biste ostavili komentar.</p>
                    <Link href="/login" className="text-primary font-bold hover:underline">
                        Prijavite se
                    </Link>
                </div>
            )}

            {/* Comments List */}
            <div className="space-y-8">
                {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4 group">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 overflow-hidden relative border border-slate-200">
                            {comment.profiles?.avatar_url ? (
                                <Image src={comment.profiles.avatar_url} alt="Avatar" fill className="object-cover" />
                            ) : (
                                <span className="font-bold">{comment.profiles?.display_name?.[0]?.toUpperCase() || 'K'}</span>
                            )}
                        </div>
                        <div className="flex-grow">
                            <div className="bg-slate-50 rounded-2xl rounded-tl-none p-4 relative group-hover:bg-slate-100 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-bold text-slate-900">
                                        {comment.profiles?.display_name || 'Kuvaj.me Korisnik'}
                                    </span>
                                    <span className="text-xs text-slate-400">
                                        {new Date(comment.created_at).toLocaleDateString('sr-RS')}
                                    </span>
                                </div>
                                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                            </div>

                            {/* Actions */}
                            {user && user.id === comment.user_id && (
                                <button
                                    onClick={() => handleDelete(comment.id)}
                                    className="text-xs text-red-400 hover:text-red-600 font-medium mt-2 ml-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <FiTrash2 /> Obriši
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
