'use client'

import { useState } from 'react'
import { updateProfile } from '@/app/profile/actions'
import AvatarUpload from './AvatarUpload'

export default function EditProfileDialog({
    profile,
    onClose,
    onSuccess
}: {
    profile: any
    onClose: () => void
    onSuccess?: () => void
}) {
    const [displayName, setDisplayName] = useState(profile?.display_name || '')
    const [bio, setBio] = useState(profile?.bio || '')
    const [location, setLocation] = useState(profile?.location || '')
    const [website, setWebsite] = useState(profile?.social_links?.website || '')
    const [instagram, setInstagram] = useState(profile?.social_links?.instagram || '')
    const [dietaryPreferences, setDietaryPreferences] = useState<string[]>(profile?.dietary_preferences || [])
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)
        setError(null)

        const result = await updateProfile({
            display_name: displayName,
            bio: bio,
            location: location,
            social_links: { website, instagram },
            dietary_preferences: dietaryPreferences
        })

        setIsSaving(false)

        if (result?.error) {
            setError(result.error)
        } else {
            if (onSuccess) onSuccess()
            onClose()
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold heading-font text-slate-900">
                        Izmeni profil
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 text-2xl leading-none"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Avatar Upload */}
                    <AvatarUpload
                        currentAvatarUrl={profile?.avatar_url}
                        onUploadSuccess={() => {
                            // Refresh handled by server action
                        }}
                    />

                    {/* Display Name */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Ime za prikaz
                        </label>
                        <input
                            type="text"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                            placeholder="Tvoje ime"
                        />
                    </div>

                    {/* Bio */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            O meni
                        </label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                            placeholder="Kratko o sebi..."
                            maxLength={500}
                        />
                        <p className="text-xs text-slate-500 mt-1">
                            {bio.length}/500 karaktera
                        </p>
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Lokacija
                        </label>
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                            placeholder="npr. Beograd, Srbija"
                        />
                    </div>

                    {/* Social Links */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Website
                            </label>
                            <input
                                type="url"
                                value={website}
                                onChange={(e) => setWebsite(e.target.value)}
                                className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                                placeholder="https://..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Instagram
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-3.5 text-slate-400">@</span>
                                <input
                                    type="text"
                                    value={instagram}
                                    onChange={(e) => setInstagram(e.target.value)}
                                    className="w-full pl-8 pr-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    placeholder="korisnicko_ime"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Dietary Preferences */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Način ishrane
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {['Vegetarijanac', 'Vegan', 'Bez glutena', 'Bez laktoze', 'Keto', 'Paleo', 'Halal', 'Posno'].map((pref) => (
                                <button
                                    key={pref}
                                    type="button"
                                    onClick={() => {
                                        if (dietaryPreferences.includes(pref)) {
                                            setDietaryPreferences(dietaryPreferences.filter(p => p !== pref))
                                        } else {
                                            setDietaryPreferences([...dietaryPreferences, pref])
                                        }
                                    }}
                                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${dietaryPreferences.includes(pref)
                                            ? 'bg-primary/10 border-primary text-primary'
                                            : 'bg-white border-slate-200 text-slate-600 hover:border-primary/50'
                                        }`}
                                >
                                    {pref}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="flex-1 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50"
                        >
                            {isSaving ? 'Čuvanje...' : 'Sačuvaj'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors"
                        >
                            Otkaži
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
