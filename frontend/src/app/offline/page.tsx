import Link from 'next/link'
import { FiWifiOff } from 'react-icons/fi'

export const metadata = {
    title: 'Offline - Kuvaj.me',
    description: 'Niste povezani na internet'
}

export default function OfflinePage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
            <div className="text-center max-w-md">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-slate-200 mb-8">
                    <FiWifiOff className="w-12 h-12 text-slate-600" />
                </div>

                <h1 className="text-4xl font-bold text-slate-900 mb-4 heading-font">
                    Offline režim
                </h1>

                <p className="text-lg text-slate-600 mb-8">
                    Trenutno niste povezani na internet. Neki delovi aplikacije možda neće biti dostupni.
                </p>

                <div className="space-y-4">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                        <h2 className="font-bold text-slate-900 mb-2">✅ Dostupno offline:</h2>
                        <ul className="text-left text-slate-600 space-y-1">
                            <li>• Lista za kupovinu</li>
                            <li>• Vaši sačuvani recepti</li>
                            <li>• Favorites i kolekcije</li>
                        </ul>
                    </div>

                    <Link
                        href="/"
                        className="inline-block px-8 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary-dark transition-colors"
                    >
                        Nazad na početnu
                    </Link>
                </div>

                <p className="text-sm text-slate-500 mt-8">
                    Aplikacija će automatski raditi kada se vratite online.
                </p>
            </div>
        </div>
    )
}
