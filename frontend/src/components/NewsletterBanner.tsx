import NewsletterForm from './NewsletterForm';
import { FiMail } from 'react-icons/fi';

export default function NewsletterBanner() {
    return (
        <section className="container mx-auto px-4 py-16 max-w-5xl">
            <div className="relative rounded-3xl overflow-hidden bg-[#FDFBF7] border border-amber-100/50 shadow-sm p-8 md:p-12">
                {/* Decorative background shapes */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-amber-500/5 blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-primary/5 blur-3xl pointer-events-none"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-16">
                    {/* Left: Text */}
                    <div className="flex-1 text-center md:text-left">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-r from-[#d4a373] to-[#bc8a5f] text-white mb-6 shadow-md">
                            <FiMail className="w-7 h-7" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-serif leading-tight">
                            Nikad više pitanje: <br /> <span className="text-[#6B7E4F]">"Šta za ručak?"</span>
                        </h2>
                        <p className="text-slate-600 text-lg mb-6 leading-relaxed max-w-md mx-auto md:mx-0">
                            Prijavi se na naš besplatni newsletter i svakog petka dobijaj 3 najbolja recepta i ideju za nedeljni jelovnik pravo u inbox.
                        </p>
                    </div>

                    {/* Right: Form Component */}
                    <div className="w-full md:w-auto flex-1 max-w-md bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <h3 className="font-bold text-slate-800 mb-4">Unesi email za prijavu:</h3>
                        <NewsletterForm />
                        <p className="text-xs text-slate-400 mt-4 text-center">
                            Bez spama, samo najukusniji recepti. Možeš se odjaviti bilo kada.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
