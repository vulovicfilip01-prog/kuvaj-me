import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { getProfile } from '../actions'
import ProfileEditForm from '@/components/ProfileEditForm'
import Navbar from '@/components/Navbar'

export const metadata = {
    title: 'Uredi Profil - Kuvaj.me',
    description: 'Izmenite informacije svog profila na Kuvaj.me',
}

export default async function EditProfilePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const profile = await getProfile(user.id)

    return (
        <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
            <Navbar />
            <div className="py-12 px-4">
                <ProfileEditForm user={user} profile={profile} />
            </div>
        </main>
    )
}
