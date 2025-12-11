'use client'

import { useState, useTransition } from 'react'
import { followUser, unfollowUser } from '@/app/profile/user-actions'
import { FiUserPlus, FiUserCheck } from 'react-icons/fi'

interface FollowButtonProps {
    targetUserId: string
    initialIsFollowing: boolean
    className?: string
}

export default function FollowButton({ targetUserId, initialIsFollowing, className = '' }: FollowButtonProps) {
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
    const [isPending, startTransition] = useTransition()

    const handleToggleFollow = () => {
        // Optimistic update
        const newState = !isFollowing
        setIsFollowing(newState)

        startTransition(async () => {
            try {
                const result = newState
                    ? await followUser(targetUserId)
                    : await unfollowUser(targetUserId)

                if (result.error) {
                    // Revert if error
                    setIsFollowing(!newState)
                    console.error(result.error)
                }
            } catch (error) {
                // Revert if exception
                setIsFollowing(!newState)
                console.error(error)
            }
        })
    }

    return (
        <button
            onClick={handleToggleFollow}
            disabled={isPending}
            className={`
                flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all transform hover:-translate-y-0.5
                ${isFollowing
                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                    : 'bg-primary text-white hover:bg-primary-dark shadow-md hover:shadow-lg'
                }
                ${className}
            `}
        >
            {isFollowing ? (
                <>
                    <FiUserCheck className="w-5 h-5" />
                    <span>Pratim</span>
                </>
            ) : (
                <>
                    <FiUserPlus className="w-5 h-5" />
                    <span>Zaprati</span>
                </>
            )}
        </button>
    )
}
