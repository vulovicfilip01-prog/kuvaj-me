'use client'

import { useState } from 'react'
import Image from 'next/image'
import { uploadAvatar } from '@/app/profile/actions'

export default function AvatarUpload({ currentAvatarUrl, onUploadSuccess }: {
    currentAvatarUrl?: string | null
    onUploadSuccess?: (url: string) => void
}) {
    const [preview, setPreview] = useState<string | null>(currentAvatarUrl || null)
    const [isUploading, setIsUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Show preview
        const reader = new FileReader()
        reader.onloadend = () => {
            setPreview(reader.result as string)
        }
        reader.readAsDataURL(file)

        // Upload
        setIsUploading(true)
        setError(null)

        const formData = new FormData()
        formData.append('avatar', file)

        const result = await uploadAvatar(formData)

        if (result?.error) {
            setError(result.error)
            setPreview(currentAvatarUrl || null)
        } else if (result?.url) {
            if (onUploadSuccess) {
                onUploadSuccess(result.url)
            }
        }

        setIsUploading(false)
    }

    return (
        <div className="flex flex-col items-center gap-4">
            {/* Avatar Preview */}
            <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg">
                {preview ? (
                    <Image
                        src={preview}
                        alt="Avatar"
                        fill
                        className="object-cover"
                    />
                ) : (
                    <span className="text-4xl text-white font-bold">👤</span>
                )}
            </div>

            {/* Upload Button */}
            <label className="cursor-pointer px-4 py-2 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-all border border-primary/20 font-medium">
                {isUploading ? 'Otpremanje...' : 'Promeni avatar'}
                <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleFileChange}
                    disabled={isUploading}
                    className="hidden"
                />
            </label>

            {/* Error Message */}
            {error && (
                <p className="text-red-500 text-sm">{error}</p>
            )}

            {/* Info */}
            <p className="text-xs text-slate-500 text-center">
                JPG, PNG, WebP ili GIF. Max 5MB.
            </p>
        </div>
    )
}
