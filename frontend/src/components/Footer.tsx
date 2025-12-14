import Link from 'next/link'
import NewsletterForm from './NewsletterForm'

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-white border-t border-slate-200 mt-auto">
            <div className="container mx-auto px-6 py-12">
                <div className="flex flex-col md:flex-row justify-between items-start gap-12">

                    {/* Brand & Links */}
                    <div className="space-y-4">
                        <div className="text-slate-900 font-bold text-xl">Kuvaj.me</div>
                        <p className="text-slate-500 max-w-xs">
                            Najveća baza domaćih recepata. Kuvajmo zajedno svakog dana.
                        </p>
                        <div className="flex items-center gap-6 text-sm font-medium text-slate-600">
                            <Link href="/privacy" className="hover:text-primary transition-colors">
                                Politika privatnosti
                            </Link>
                            <Link href="/terms" className="hover:text-primary transition-colors">
                                Uslovi korišćenja
                            </Link>
                        </div>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="font-bold text-slate-900 mb-2">Budi u toku 📧</h3>
                        <p className="text-slate-500 text-sm mb-4">
                            Prijavi se za nedeljni meni i nove recepte.
                        </p>
                        <NewsletterForm />
                    </div>
                </div>

                <div className="border-t border-slate-100 mt-12 pt-8 text-center text-slate-400 text-sm">
                    © {currentYear} Kuvaj.me. Sva prava zadržana.
                </div>
            </div>
        </footer>
    )
}
