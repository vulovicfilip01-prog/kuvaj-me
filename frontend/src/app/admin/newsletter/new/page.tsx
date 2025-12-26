'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiSend, FiArrowLeft, FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import Link from "next/link";
import { sendNewsletterBlast } from "../../actions";

export default function NewNewsletterPage() {
    const [subject, setSubject] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!subject || !content) return;

        setLoading(true);
        setStatus('idle');

        try {
            const result = await sendNewsletterBlast(subject, content);
            if (result.success) {
                setStatus('success');
                setTimeout(() => {
                    router.push("/admin/newsletter");
                }, 2000);
            } else {
                setStatus('error');
                setError(result.error || "Došlo je do greške.");
            }
        } catch (err) {
            setStatus('error');
            setError("Sistemska greška pri slanju.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/newsletter"
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
                >
                    <FiArrowLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-3xl font-bold text-slate-800">Nova kampanja</h1>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Naslov poruke (Subject)</label>
                        <input
                            type="text"
                            required
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="npr. Novi zimski recepti su stigli! 🍲"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Sadržaj poruke</label>
                        <textarea
                            required
                            rows={10}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Napišite sadržaj newsletter-a ovde..."
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800 resize-none"
                        />
                    </div>

                    <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                        <div className="text-sm text-slate-500 flex items-center gap-2">
                            <FiAlertCircle /> Poruka će biti poslata svim aktivnim pretplatnicima.
                        </div>
                        <button
                            type="submit"
                            disabled={loading || status === 'success'}
                            className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-all font-bold shadow-md hover:shadow-lg disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <><FiSend /> Pošalji svima</>
                            )}
                        </button>
                    </div>

                    {status === 'success' && (
                        <div className="flex items-center gap-2 text-green-600 bg-green-50 p-4 rounded-xl animate-fadeIn">
                            <FiCheckCircle />
                            <span>Kampanja je uspešno poslata! Vraćam vas na listu...</span>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-xl animate-fadeIn">
                            <FiAlertCircle />
                            <span>{error}</span>
                        </div>
                    )}
                </form>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-dashed border-slate-200">
                <h3 className="text-sm font-bold text-slate-800 mb-2 uppercase tracking-wider">Savet za pisanje</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                    Koristite emotikone u naslovu da povećate open-rate. Budite koncizni i uvek dodajte direktan link ka receptima na koje se pozivate.
                    Trenutno se šalje običan tekst (Plain Text), uskoro stiže podrška za formatiran HTML.
                </p>
            </div>
        </div>
    );
}
