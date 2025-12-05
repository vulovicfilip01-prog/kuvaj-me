'use client'

import { useState, useEffect } from 'react'
import { getRecipeComments, createComment, updateComment, deleteComment } from '@/app/recipes/comment-actions'
import CommentForm from './CommentForm'
import { FiEdit2, FiTrash2, FiMessageCircle } from 'react-icons/fi'
import Link from 'next/link'

interface Comment {
    id: string
    content: string
    user_id: string
    created_at: string
    updated_at: string
    profiles: {
        display_name: string
        avatar_url?: string
    }
}

interface CommentsSectionProps {
    recipeId: string
    currentUserId: string | null
    initialComments?: Comment[]
}

export default function CommentsSection({ recipeId, currentUserId, initialComments = [] }: CommentsSectionProps) {
    const [comments, setComments] = useState<Comment[]>(initialComments)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const loadComments = async () => {
        setLoading(true)
        const { comments: fetchedComments } = await getRecipeComments(recipeId)
        setComments(fetchedComments)
        setLoading(false)
    }

    useEffect(() => {
        if (initialComments.length === 0) {
            loadComments()
        }
    }, [recipeId])

    const handleCreateComment = async (content: string) => {
        const result = await createComment(recipeId, content)
        if (result.error) {
            throw new Error(result.error)
        }
        await loadComments()
    }

    const handleUpdateComment = async (commentId: string, content: string) => {
        const result = await updateComment(commentId, content)
        if (result.error) {
            throw new Error(result.error)
        }
        setEditingId(null)
        await loadComments()
    }

    const handleDeleteComment = async (commentId: string) => {
        if (!confirm('Da li ste sigurni da želite da obrišete ovaj komentar?')) {
            return
        }

        const result = await deleteComment(commentId)
        if (result.error) {
            alert(result.error)
            return
        }
        await loadComments()
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMs / 3600000)
        const diffDays = Math.floor(diffMs / 86400000)

        if (diffMins < 1) return 'Upravo sada'
        if (diffMins < 60) return `Pre ${diffMins} min`
        if (diffHours < 24) return `Pre ${diffHours}h`
        if (diffDays < 7) return `Pre ${diffDays} dana`

        return date.toLocaleDateString('sr-RS', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <FiMessageCircle className="w-6 h-6 text-primary" />
                <h2 className="text-3xl font-bold text-slate-900 heading-font">
                    Komentari ({comments.length})
                </h2>
            </div>

            {/* Add Comment Form */}
            {currentUserId ? (
                <div className="glass-panel rounded-2xl p-6">
                    <CommentForm onSubmit={handleCreateComment} />
                </div>
            ) : (
                <div className="glass-panel rounded-2xl p-6 text-center">
                    <p className="text-slate-600 mb-4">Prijavite se da biste ostavili komentar</p>
                    <Link
                        href="/login"
                        className="inline-block px-6 py-2.5 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-medium hover:shadow-lg transition-all"
                    >
                        Prijavi se
                    </Link>
                </div>
            )}

            {/* Comments List */}
            {loading && comments.length === 0 ? (
                <div className="text-center py-8">
                    <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-500 mt-4">Učitavanje komentara...</p>
                </div>
            ) : comments.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">💬</div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                        Još nema komentara
                    </h3>
                    <p className="text-slate-600">
                        Budite prvi koji će ostaviti komentar!
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {comments.map((comment) => (
                        <div key={comment.id} className="glass-panel rounded-2xl p-6">
                            {editingId === comment.id ? (
                                <CommentForm
                                    initialContent={comment.content}
                                    onSubmit={(content) => handleUpdateComment(comment.id, content)}
                                    onCancel={() => setEditingId(null)}
                                    submitLabel="Sačuvaj"
                                />
                            ) : (
                                <>
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white font-bold">
                                                {comment.profiles.display_name?.[0]?.toUpperCase() || 'U'}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900">
                                                    {comment.profiles.display_name || 'Korisnik'}
                                                </p>
                                                <p className="text-sm text-slate-500">
                                                    {formatDate(comment.created_at)}
                                                    {comment.created_at !== comment.updated_at && (
                                                        <span className="ml-1">(izmenjeno)</span>
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        {currentUserId === comment.user_id && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setEditingId(comment.id)}
                                                    className="p-2 text-slate-600 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors"
                                                    title="Izmeni"
                                                >
                                                    <FiEdit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteComment(comment.id)}
                                                    className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Obriši"
                                                >
                                                    <FiTrash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <p className="text-slate-700 whitespace-pre-wrap">
                                        {comment.content}
                                    </p>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
