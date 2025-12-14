import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Uslovi korišćenja | Kuvaj.me',
    description: 'Uslovi korišćenja Kuvaj.me aplikacije. Pravila za objavljivanje recepata i korišćenje servisa.',
}

export default function TermsPage() {
    return (
        <main className="container mx-auto px-6 py-12 max-w-4xl">
            <h1 className="text-4xl font-bold mb-8 text-slate-900">Uslovi korišćenja</h1>

            <div className="prose prose-slate max-w-none space-y-8 text-slate-700">
                <section>
                    <h2 className="text-2xl font-bold mb-4 text-slate-900">1. Prihvatanje uslova</h2>
                    <p>
                        Pristupanjem i korišćenjem Kuvaj.me aplikacije, prihvatate ove Uslove korišćenja u celosti.
                        Ako se ne slažete sa bilo kojim delom ovih uslova, molimo vas da ne koristite aplikaciju.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4 text-slate-900">2. Korisnički nalozi</h2>
                    <p>
                        Za određene funkcionalnosti (dodavanje recepata, čuvanje omiljenih) potrebna je registracija.
                        Odgovorni ste za čuvanje tajnosti vaše lozinke i za sve aktivnosti koje se dese na vašem nalogu.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4 text-slate-900">3. Sadržaj korisnika (Recepti)</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>
                            Zadržavate autorska prava na recepte i fotografije koje postavite.
                        </li>
                        <li>
                            Objavljivanjem sadržaja na Kuvaj.me, dajete nam neekskluzivnu, besplatnu licencu da taj sadržaj
                            prikazujemo, distribuiramo i promovišemo u okviru aplikacije i povezanih kanala.
                        </li>
                        <li>
                            Garantujete da imate pravo da objavite sadržaj i da time ne kršite prava trećih lica.
                        </li>
                        <li>
                            Zadržavamo pravo da uklonimo bilo koji sadržaj koji smatramo neprikladnim ili koji krši ove uslove.
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4 text-slate-900">4. Odricanje od odgovornosti</h2>
                    <p>
                        Kuvaj.me je platforma za deljenje recepata. Ne garantujemo tačnost, potpunost ili uspeh recepata
                        koje postavljaju korisnici. Recepti se koriste na sopstvenu odgovornost. Molimo vas da obratite pažnju
                        na alergene i bezbednost pri pripremi hrane.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4 text-slate-900">5. Izmene uslova</h2>
                    <p>
                        Zadržavamo pravo da izmenimo ove uslove u bilo kom trenutku. Nastavkom korišćenja aplikacije nakon izmena,
                        prihvatate nove uslove.
                    </p>
                </section>

                <p className="text-sm text-slate-500 mt-8">
                    Poslednje ažuriranje: Decembar 2025.
                </p>
            </div>
        </main>
    )
}
