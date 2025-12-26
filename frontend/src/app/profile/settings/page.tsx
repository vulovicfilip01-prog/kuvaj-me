import Navbar from '@/components/Navbar'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { FiArrowLeft, FiShield, FiBell, FiAlertCircle } from 'react-icons/fi'
import ChangePasswordForm from './ChangePasswordForm'
import DeleteAccountButton from './DeleteAccountButton'

export default async function SettingsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <div className="container mx-auto px-4 py-8 max-w-2xl">
                <div className="mb-8">
                    <Link
                        href={`/profile/${user.id}`}
                        className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-4"
                    >
                        <FiArrowLeft /> Nazad na profil
                    </Link>
                    <h1 className="text-3xl font-bold text-slate-900">Podešavanja</h1>
                    <p className="text-slate-500">Upravljajte svojim nalogom i preferencijama</p>
                </div>

                <div className="space-y-8">
                    {/* Security Section */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                <FiShield className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">Sigurnost</h2>
                        </div>
                        <ChangePasswordForm />
                    </div>

                    {/* Notifications Section (Mock UI) */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 opacity-75">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg">
                                <FiBell className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">Obaveštenja</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                <div>
                                    <div className="font-bold text-slate-700">Email obaveštenja</div>
                                    <div className="text-sm text-slate-500">Primajte novosti o receptima</div>
                                </div>
                                <div className="w-11 h-6 bg-slate-200 rounded-full relative cursor-not-allowed">
                                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                                </div>
                            </div>
                            <p className="text-xs text-center text-slate-400">Uskeoro dostupno</p>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="bg-red-50/50 rounded-2xl p-6 border border-red-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                                <FiAlertCircle className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-bold text-red-800">Opasna zona</h2>
                        </div>

                        <div className="bg-white rounded-xl p-4 border border-red-100">
                            <h3 className="font-bold text-slate-800 mb-1">Trajno brisanje naloga</h3>
                            <p className="text-sm text-slate-500 mb-4">
                                Kada obrišete nalog, svi vaši podaci (recepti, kolekcije, komentari) biće trajno uklonjeni.
                                Ovu akciju nije moguće poništiti.
                            </p>
                            <DeleteAccountButton />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
