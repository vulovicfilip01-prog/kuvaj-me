import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { getProfile, getUserRecipes, getUserStats, getUserCollections } from '../actions'
import { getFollowStatus, getFollowCounts } from '../user-actions'
import ProfileView from '@/components/ProfileView'

import Navbar from '@/components/Navbar'

interface PageProps {
    params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params
    const profile = await getProfile(id)

    if (!profile) {
        return {
            title: 'Korisnik nije pronađen',
        }
    }

    return {
        title: `${profile.display_name} - Profil | Kuvaj.me`,
        description: profile.bio || `Pogledajte recepte i kolekcije korisnika ${profile.display_name} na Kuvaj.me`,
        openGraph: {
            title: `${profile.display_name} - Profil`,
            description: profile.bio || `Pogledajte recepte i kolekcije korisnika ${profile.display_name}`,
            images: profile.avatar_url ? [profile.avatar_url] : [],
            type: 'profile',
            locale: 'sr_RS',
            siteName: 'Kuvaj.me',
        }
    }
}

export default async function ProfilePage({ params }: PageProps) {
    const { id } = await params
    const profile = await getProfile(id)

    if (!profile) {
        notFound()
    }

    // Check if viewing own profile
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const isOwner = user?.id === id

    // Fetch data in parallel
    const [recipes, collections, stats, isFollowing, followCounts] = await Promise.all([
        getUserRecipes(id, isOwner),
        getUserCollections(id, isOwner),
        getUserStats(id),
        user ? getFollowStatus(id) : Promise.resolve(false),
        getFollowCounts(id)
    ])

    return (
        <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
            <Navbar />
            <ProfileView
                profile={profile}
                recipes={recipes}
                collections={collections}
                stats={stats}
                isOwner={isOwner}
                isFollowing={isFollowing}
                followCounts={followCounts}
            />
        </main>
    )

}
