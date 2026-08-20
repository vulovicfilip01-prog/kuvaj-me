import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Politika privatnosti | Krckaj.me',
    description: 'Politika privatnosti za Krckaj.me aplikaciju. Saznajte kako prikupljamo i koristimo vaše podatke.',
}

export default function PrivacyPage() {
    return (
        <main className="container mx-auto px-6 py-12 max-w-4xl">
            <h1 className="text-4xl font-bold mb-8 text-slate-900">Politika privatnosti</h1>

            <div className="prose prose-slate max-w-none space-y-8 text-slate-700">
                <section>
                    <h2 className="text-2xl font-bold mb-4 text-slate-900">1. Uvod</h2>
                    <p>
                        Dobrodošli na Krckaj.me. Vaša privatnost nam je važna. Ova Politika privatnosti objašnjava kako prikupljamo,
                        koristimo i štitimo vaše podatke kada koristite našu web aplikaciju.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4 text-slate-900">2. Podaci koje prikupljamo</h2>
                    <p className="mb-4">Prikupljamo sledeće vrste podataka:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>
                            <strong>Podaci o nalogu:</strong> Kada kreirate nalog, prikupljamo vašu email adresu i lozinku (koja je enkriptovana).
                            Ako se prijavite putem Google-a, prikupljamo vaše ime i email.
                        </li>
                        <li>
                            <strong>Podaci o korišćenju:</strong> Koristimo Google Analytics za praćenje kako korisnici koriste aplikaciju
                            (npr. koje recepte pregledaju, koliko vremena provode na stranicama). Ovi podaci su anonimizovani.
                        </li>
                        <li>
                            <strong>Korisnički sadržaj:</strong> Recepti, slike i komentari koje postavite su javno dostupni.
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4 text-slate-900">3. Korišćenje kolačića (Cookies)</h2>
                    <p>
                        Koristimo kolačiće za:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Održavanje vaše prijave (sesije).</li>
                        <li>Analitiku (Google Analytics) kako bismo razumeli posećenost i poboljšali aplikaciju.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4 text-slate-900">4. Kako koristimo vaše podatke</h2>
                    <p>
                        Vaše podatke koristimo isključivo za pružanje i poboljšanje usluge:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Da vam omogućimo kreiranje i čuvanje recepata.</li>
                        <li>Za personalizaciju sadržaja (npr. omiljeni recepti).</li>
                        <li>Za analizu performansi aplikacije.</li>
                    </ul>
                    <p className="mt-4">
                        Nikada nećemo prodati vaše lične podatke trećim licima.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4 text-slate-900">5. Vaša prava</h2>
                    <p>
                        Imate pravo da:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Zatražite uvid u podatke koje imamo o vama.</li>
                        <li>Izmenite svoje podatke putem podešavanja profila.</li>
                        <li>Zatražite brisanje vašeg naloga i svih povezanih podataka slanjem zahteva na kontakt email.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4 text-slate-900">6. Kontakt</h2>
                    <p>
                        Za sva pitanja u vezi sa privatnošću, možete nas kontaktirati na:
                        <a href="mailto:podrska@Krckaj.me" className="text-primary hover:underline ml-1">podrska@Krckaj.me</a>
                    </p>
                </section>

                <p className="text-sm text-slate-500 mt-8">
                    Poslednje ažuriranje: Decembar 2025.
                </p>
            </div>
        </main>
    )
}
