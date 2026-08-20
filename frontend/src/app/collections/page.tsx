import { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import CollectionsView from '@/components/CollectionsView'

export const metadata: Metadata = {
    title: 'Moje Kolekcije - Krckaj.me',
    description: 'Organizujte i delite svoje omiljene recepte u kolekcije.',
    openGraph: {
        title: 'Moje Kolekcije - Krckaj.me',
        description: 'Organizujte i delite svoje omiljene recepte u kolekcije.',
        type: 'website',
        locale: 'sr_RS',
        siteName: 'Krckaj.me',
    }
}

export default function CollectionsPage() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
            <Navbar />
            <CollectionsView />
        </main>
    )
}
