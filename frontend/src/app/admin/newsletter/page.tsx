import { getNewsletterSubscribers, getNewsletterCampaigns, sendWeeklyDigest } from "../actions";
import { FiMail, FiPlus, FiSend, FiZap, FiClock } from "react-icons/fi";
import Link from "next/link";
import { revalidatePath } from "next/cache";

export default async function AdminNewsletterPage() {
    const [subRes, campRes] = await Promise.all([
        getNewsletterSubscribers(),
        getNewsletterCampaigns()
    ]);

    if (!subRes.success || !campRes.success) {
        return <div className="p-8 text-red-500">Greška pri učitavanju podataka.</div>;
    }

    const { subscribers } = subRes;
    const { campaigns } = campRes;

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Newsletter</h1>
                    <p className="text-slate-500">Upravljanje pretplatnicima i kampanjama</p>
                </div>
                <div className="flex gap-3">
                    <form action={async () => {
                        'use server';
                        await sendWeeklyDigest();
                    }}>
                        <button
                            type="submit"
                            className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-xl hover:bg-amber-100 transition-colors font-medium border border-amber-200"
                        >
                            <FiZap /> Pošalji Weekly Digest
                        </button>
                    </form>
                    <Link
                        href="/admin/newsletter/new"
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors font-medium shadow-md hover:shadow-lg"
                    >
                        <FiPlus /> Nova kampanja
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Subscribers List */}
                <div className="lg:col-span-1 space-y-4">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <FiMail className="text-primary" /> Pretplatnici ({subscribers?.length || 0})
                    </h2>
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden max-h-[600px] overflow-y-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-100 sticky top-0">
                                <tr>
                                    <th className="p-4 font-semibold text-slate-600 text-sm">Email</th>
                                    <th className="p-4 font-semibold text-slate-600 text-sm text-right">Datum</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {subscribers?.map((sub: any) => (
                                    <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4 text-sm text-slate-800 truncate max-w-[150px]">
                                            {sub.email}
                                        </td>
                                        <td className="p-4 text-sm text-slate-500 text-right">
                                            {new Date(sub.created_at).toLocaleDateString('sr-RS')}
                                        </td>
                                    </tr>
                                ))}
                                {(!subscribers || subscribers.length === 0) && (
                                    <tr>
                                        <td colSpan={2} className="p-8 text-center text-slate-500 text-sm">
                                            Nema pretplatnika.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Campaigns History */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <FiSend className="text-blue-500" /> Istorija slanja
                    </h2>
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="p-4 font-semibold text-slate-600">Kampanja</th>
                                        <th className="p-4 font-semibold text-slate-600">Tip</th>
                                        <th className="p-4 font-semibold text-slate-600">Primaoci</th>
                                        <th className="p-4 font-semibold text-slate-600 text-right">Poslato</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {campaigns?.map((camp: any) => (
                                        <tr key={camp.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-4">
                                                <div className="font-medium text-slate-800">{camp.subject}</div>
                                                <div className="text-xs text-slate-500 truncate max-w-[200px]">{camp.content}</div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${camp.type === 'digest' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                                                    }`}>
                                                    {camp.type === 'digest' ? 'Digest' : 'Blast'}
                                                </span>
                                            </td>
                                            <td className="p-4 text-slate-600 font-medium">
                                                {camp.recipient_count}
                                            </td>
                                            <td className="p-4 text-right text-sm text-slate-500">
                                                {new Date(camp.sent_at).toLocaleDateString('sr-RS')}<br />
                                                {new Date(camp.sent_at).toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit' })}
                                            </td>
                                        </tr>
                                    ))}
                                    {(!campaigns || campaigns.length === 0) && (
                                        <tr>
                                            <td colSpan={4} className="p-12 text-center text-slate-500">
                                                <FiClock className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                                <p>Još uvek nema poslatih kampanja.</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
