import Link from 'next/link'
import Navbar from '@/components/Navbar'
import NotFoundSearch from '@/components/NotFoundSearch'

export default function NotFound() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
            <Navbar />

            <div className="container mx-auto px-6 py-20 text-center">
                <div className="max-w-2xl mx-auto glass-panel rounded-3xl p-12">
                    <div className="text-8xl mb-6">🍳</div>
                    <h1 className="text-4xl font-bold text-slate-900 mb-4 heading-font">
                        Ups! Stranica nije pronađena
                    </h1>
                    <p className="text-slate-600 text-lg mb-8">
                        Izgleda da smo zagubili ovaj recept. Možda je obrisan ili nikada nije ni postojao.
                    </p>

                    {/* Search Form (Client Component) */}
                    <NotFoundSearch />

                    <div className="flex gap-4 justify-center flex-col sm:flex-row">
                        <Link
                            href="/"
                            className="px-8 py-3 bg-primary text-white rounded-full font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
                        >
                            Vrati se na početnu
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    )
}
