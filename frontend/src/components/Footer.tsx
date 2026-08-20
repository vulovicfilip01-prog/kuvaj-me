import Link from 'next/link'
import NewsletterForm from './NewsletterForm'

import { FiSearch } from 'react-icons/fi'

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-white border-t border-slate-100 mt-auto">
            <div className="container mx-auto px-6 py-12">
                <div className="flex flex-col md:flex-row justify-between items-start gap-12">

                    {/* Brand & Links */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <img src="/logo.png" alt="Krckaj.me logo" className="w-14 h-14 object-contain drop-shadow-sm" />
                            <div className="text-slate-900 font-bold text-2xl">Krckaj.me</div>
                        </div>
                        <p className="text-slate-600 max-w-xs transition-colors">
                            Najveća baza domaćih recepata. Kuvajmo zajedno svakog dana.
                        </p>
                        <div className="flex items-center gap-6 text-sm font-medium text-slate-500">
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
                        <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                            Budi u toku <FiSearch className="text-slate-400" />
                        </h3>
                        <p className="text-slate-600 text-sm mb-4">
                            Prijavi se za nedeljni meni i nove recepte.
                        </p>
                        <NewsletterForm />
                    </div>
                </div>

                <div className="border-t border-slate-100 mt-12 pt-8 text-center text-slate-400 text-sm">
                    © {currentYear} Krckaj.me. Sva prava zadržana.
                </div>
            </div>
        </footer>
    )
}
