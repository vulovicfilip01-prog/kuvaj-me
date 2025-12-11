'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FiMapPin, FiLink, FiEdit2, FiGrid, FiLayers, FiHeart, FiGlobe, FiInstagram, FiTwitter } from 'react-icons/fi'
import RecipeCard from '@/components/RecipeCard'
import CollectionCard from '@/components/CollectionCard'
import FollowButton from './FollowButton'


interface ProfileViewProps {
    profile: any
    recipes: any[]
    collections: any[]
    stats: {
        recipesCount: number
        collectionsCount: number
    }
    isOwner: boolean
    isFollowing?: boolean
    followCounts?: {
        followers: number
        following: number
    }
}

export default function ProfileView({ profile, recipes, collections, stats, isOwner, isFollowing = false, followCounts }: ProfileViewProps) {
    const [activeTab, setActiveTab] = useState<'recipes' | 'collections'>('recipes')


    const socialLinks = profile.social_links || {}

    return (
        <div className="container mx-auto px-4 py-12">
            {/* Profile Header */}
            <div className="glass-panel rounded-3xl p-8 mb-12 animate-fadeIn">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                    {/* Avatar */}
                    <div className="relative group">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-4xl font-bold text-white">
                            {profile.avatar_url ? (
                                <Image
                                    src={profile.avatar_url}
                                    alt={profile.display_name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <span>{profile.display_name?.[0]?.toUpperCase() || 'U'}</span>
                            )}
                        </div>
                        {isOwner && (
                            <Link
                                href="/profile/edit"
                                className="absolute bottom-2 right-2 p-2 bg-white text-primary rounded-full shadow-lg hover:scale-110 transition-transform"
                                title="Izmeni profil"
                            >
                                <FiEdit2 className="w-5 h-5" />
                            </Link>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                            <h1 className="text-4xl font-bold heading-font text-slate-900">
                                {profile.display_name}
                            </h1>
                            {isOwner ? (
                                <Link
                                    href="/profile/edit"
                                    className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors"
                                >
                                    Uredi profil
                                </Link>
                            ) : (
                                <FollowButton
                                    targetUserId={profile.id}
                                    initialIsFollowing={isFollowing}
                                />
                            )}
                        </div>


                        {profile.bio && (
                            <p className="text-slate-600 text-lg mb-6 max-w-2xl">
                                {profile.bio}
                            </p>
                        )}

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-slate-600 mb-6">
                            {profile.location && (
                                <div className="flex items-center gap-2">
                                    <FiMapPin className="w-5 h-5 text-primary" />
                                    <span>{profile.location}</span>
                                </div>
                            )}

                            {/* Social Links */}
                            {socialLinks.website && (
                                <a href={socialLinks.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
                                    <FiGlobe className="w-5 h-5" />
                                    <span className="hidden md:inline">Website</span>
                                </a>
                            )}
                            {socialLinks.instagram && (
                                <a href={`https://instagram.com/${socialLinks.instagram}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-pink-600 transition-colors">
                                    <FiInstagram className="w-5 h-5" />
                                    <span className="hidden md:inline">{socialLinks.instagram}</span>
                                </a>
                            )}
                            {socialLinks.twitter && (
                                <a href={`https://twitter.com/${socialLinks.twitter}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                                    <FiTwitter className="w-5 h-5" />
                                    <span className="hidden md:inline">{socialLinks.twitter}</span>
                                </a>
                            )}
                        </div>

                        {/* Stats */}
                        <div className="flex items-center justify-center md:justify-start gap-8 border-t border-slate-200 pt-6">
                            <div className="text-center md:text-left">
                                <span className="block text-2xl font-bold text-slate-900">{stats.recipesCount}</span>
                                <span className="text-sm text-slate-500 uppercase tracking-wide">Recepata</span>
                            </div>
                            <div className="text-center md:text-left">
                                <span className="block text-2xl font-bold text-slate-900">{stats.collectionsCount}</span>
                                <span className="text-sm text-slate-500 uppercase tracking-wide">Kolekcija</span>
                            </div>
                            {followCounts && (
                                <>
                                    <div className="text-center md:text-left border-l border-slate-200 pl-8">
                                        <span className="block text-2xl font-bold text-slate-900">{followCounts.followers}</span>
                                        <span className="text-sm text-slate-500 uppercase tracking-wide">Pratilaca</span>
                                    </div>
                                    <div className="text-center md:text-left">
                                        <span className="block text-2xl font-bold text-slate-900">{followCounts.following}</span>
                                        <span className="text-sm text-slate-500 uppercase tracking-wide">Prati</span>
                                    </div>
                                </>
                            )}
                        </div>

                    </div>
                </div>
            </div>

            {/* Content Tabs */}
            <div className="mb-8 border-b border-slate-200">
                <div className="flex gap-8">
                    <button
                        onClick={() => setActiveTab('recipes')}
                        className={`pb-4 text-lg font-bold flex items-center gap-2 transition-all relative ${activeTab === 'recipes'
                            ? 'text-primary'
                            : 'text-slate-500 hover:text-slate-800'
                            }`}
                    >
                        <FiGrid className="w-5 h-5" />
                        Recepti
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs">
                            {recipes.length}
                        </span>
                        {activeTab === 'recipes' && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />
                        )}
                    </button>

                    <button
                        onClick={() => setActiveTab('collections')}
                        className={`pb-4 text-lg font-bold flex items-center gap-2 transition-all relative ${activeTab === 'collections'
                            ? 'text-primary'
                            : 'text-slate-500 hover:text-slate-800'
                            }`}
                    >
                        <FiLayers className="w-5 h-5" />
                        Kolekcije
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs">
                            {collections.length}
                        </span>
                        {activeTab === 'collections' && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />
                        )}
                    </button>
                </div>
            </div>

            {/* Grid Content */}
            <div className="animate-fadeIn">
                {activeTab === 'recipes' ? (
                    recipes.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {recipes.map((recipe) => (
                                <RecipeCard key={recipe.id} recipe={recipe} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-slate-50 rounded-3xl">
                            <div className="text-6xl mb-4">🍳</div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Nema recepata</h3>
                            <p className="text-slate-600">
                                {isOwner
                                    ? 'Još uvek niste objavili nijedan recept.'
                                    : 'Ovaj korisnik još uvek nema objavljenih recepata.'}
                            </p>
                            {isOwner && (
                                <Link
                                    href="/recipes/new"
                                    className="inline-block mt-6 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors"
                                >
                                    Dodaj prvi recept
                                </Link>
                            )}
                        </div>
                    )
                ) : (
                    collections.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {collections.map((collection) => (
                                <CollectionCard
                                    key={collection.id}
                                    collection={collection}
                                    showAuthor={false}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-slate-50 rounded-3xl">
                            <div className="text-6xl mb-4">📚</div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Nema kolekcija</h3>
                            <p className="text-slate-600">
                                {isOwner
                                    ? 'Još uvek niste kreirali nijednu kolekciju.'
                                    : 'Ovaj korisnik još uvek nema javnih kolekcija.'}
                            </p>
                            {isOwner && (
                                <Link
                                    href="/collections"
                                    className="inline-block mt-6 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors"
                                >
                                    Kreiraj kolekciju
                                </Link>
                            )}
                        </div>
                    )
                )}
            </div>
        </div>
    )
}
