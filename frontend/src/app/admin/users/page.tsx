import { getUsersForAdmin } from "../actions";
import { FiShield, FiUser } from "react-icons/fi";

export default async function AdminUsersPage() {
    const { success, users } = await getUsersForAdmin();

    if (!success || !users) {
        return <div className="p-8 text-red-500">Greška pri učitavanju korisnika.</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Korisnici</h1>
                    <p className="text-slate-500">Ukupno {users.length} registrovanih korisnika</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="p-4 font-semibold text-slate-600">Korisnik</th>
                                <th className="p-4 font-semibold text-slate-600">Email</th>
                                <th className="p-4 font-semibold text-slate-600">Uloga</th>
                                <th className="p-4 font-semibold text-slate-600 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users.map((user: any) => (
                                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                                {user.is_admin ? <FiShield className="text-orange-500" /> : <FiUser />}
                                            </div>
                                            <div>
                                                <div className="font-medium text-slate-800">{user.display_name || 'Bez imena'}</div>
                                                <div className="text-xs text-slate-400 font-mono">{user.id.substring(0, 8)}...</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-slate-600">
                                        {user.email || '-'}
                                    </td>
                                    <td className="p-4">
                                        {user.is_admin ? (
                                            <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                                                Admin
                                            </span>
                                        ) : (
                                            <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm">
                                                Korisnik
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4 text-right">
                                        <span className="text-green-600 text-sm font-medium">Aktivan</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
