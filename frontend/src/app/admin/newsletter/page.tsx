import { getNewsletterSubscribers } from "../actions";
import { FiMail } from "react-icons/fi";

export default async function AdminNewsletterPage() {
    const { success, subscribers } = await getNewsletterSubscribers();

    if (!success || !subscribers) {
        return <div className="p-8 text-red-500">Greška pri učitavanju pretplatnika.</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Newsletter Pretplatnici</h1>
                    <p className="text-slate-500">Ukupno {subscribers.length} email adresa</p>
                </div>
                {/* Future: Export CSV button */}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="p-4 font-semibold text-slate-600">Email</th>
                                <th className="p-4 font-semibold text-slate-600">Datum prijave</th>
                                <th className="p-4 font-semibold text-slate-600 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {subscribers.map((sub: any) => (
                                <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4 font-medium text-slate-800 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                                            <FiMail />
                                        </div>
                                        {sub.email}
                                    </td>
                                    <td className="p-4 text-slate-500">
                                        {new Date(sub.created_at).toLocaleDateString('sr-RS')} {new Date(sub.created_at).toLocaleTimeString('sr-RS')}
                                    </td>
                                    <td className="p-4 text-right">
                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                                            Aktivan
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {subscribers.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="p-8 text-center text-slate-500">
                                        Nema prijavljenih korisnika.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
