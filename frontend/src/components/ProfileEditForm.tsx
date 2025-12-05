'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { FiSave, FiLoader, FiCamera, FiMapPin, FiGlobe, FiInstagram, FiTwitter } from 'react-icons/fi'
import { updateProfile } from '@/app/profile/actions'

interface ProfileEditFormProps {
    user: any
    profile: any
}

export default function ProfileEditForm({ user, profile }: ProfileEditFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    // Form state
    const [formData, setFormData] = useState({
        display_name: profile?.display_name || '',
        bio: profile?.bio || '',
        location: profile?.location || '',
        avatar_url: profile?.avatar_url || '',
        website: profile?.social_links?.website || '',
        instagram: profile?.social_links?.instagram || '',
        twitter: profile?.social_links?.twitter || ''
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(false)

        try {
            const social_links = {
                website: formData.website,
                instagram: formData.instagram,
                twitter: formData.twitter
            }

            const result = await updateProfile({
                display_name: formData.display_name,
                bio: formData.bio,
                location: formData.location,
                avatar_url: formData.avatar_url,
                social_links
            })

            if (result.error) {
                setError(result.error as string)
            } else {
                setSuccess(true)
                router.refresh()
                // Optional: redirect to profile
                // router.push(`/profile/${user.id}`)
            }
        } catch (err) {
            setError('Došlo je do greške. Pokušajte ponovo.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="glass-panel rounded-3xl p-8 animate-fadeIn">
                <h1 className="text-3xl font-bold heading-font mb-8 text-slate-900">Uredi Profil</h1>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Avatar Section */}
                    <div className="flex flex-col items-center gap-4 pb-8 border-b border-slate-200">
                        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-slate-100">
                            {formData.avatar_url ? (
                                <Image
                                    src={formData.avatar_url}
                                    alt="Avatar preview"
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-slate-300">
                                    {formData.display_name?.[0]?.toUpperCase() || 'U'}
                                </div>
                            )}
                        </div>
                        <div className="w-full max-w-md">
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                URL Avatara (Slika)
                            </label>
                            <div className="relative">
                                <FiCamera className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="url"
                                    name="avatar_url"
                                    value={formData.avatar_url}
                                    onChange={handleChange}
                                    placeholder="https://example.com/slika.jpg"
                                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                            </div>
                            <p className="text-xs text-slate-500 mt-1">
                                Unesite direktan link do slike (npr. sa Imgur-a ili Google Photos).
                            </p>
                        </div>
                    </div>

                    {/* Basic Info */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Ime za prikaz
                            </label>
                            <input
                                type="text"
                                name="display_name"
                                value={formData.display_name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Kratka biografija (Bio)
                            </label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                                placeholder="Napišite nešto o sebi..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Lokacija
                            </label>
                            <div className="relative">
                                <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="npr. Beograd, Srbija"
                                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="space-y-4 pt-4 border-t border-slate-200">
                        <h3 className="font-bold text-lg text-slate-900">Društvene mreže</h3>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Website
                            </label>
                            <div className="relative">
                                <FiGlobe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="url"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleChange}
                                    placeholder="https://tvoj-sajt.com"
                                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    Instagram (username)
                                </label>
                                <div className="relative">
                                    <FiInstagram className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        name="instagram"
                                        value={formData.instagram}
                                        onChange={handleChange}
                                        placeholder="username"
                                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    Twitter / X (username)
                                </label>
                                <div className="relative">
                                    <FiTwitter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        name="twitter"
                                        value={formData.twitter}
                                        onChange={handleChange}
                                        placeholder="username"
                                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Messages */}
                    {error && (
                        <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="p-4 bg-green-50 text-green-600 rounded-xl text-sm font-medium">
                            Profil je uspešno ažuriran!
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-6 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors"
                        >
                            Otkaži
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <FiLoader className="w-5 h-5 animate-spin" />
                                    Čuvanje...
                                </>
                            ) : (
                                <>
                                    <FiSave className="w-5 h-5" />
                                    Sačuvaj izmene
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
