import { getAdminStats } from "./actions";
import { FiGrid, FiUsers, FiMessageSquare, FiTrendingUp } from "react-icons/fi";
import QuickActions from "@/components/admin/QuickActions";

function StatCard({ title, value, icon: Icon, color }: any) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className={`p-4 rounded-xl ${color} bg-opacity-10`}>
                <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
            </div>
            <div>
                <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
                <p className="text-2xl font-bold text-slate-800">{value}</p>
            </div>
        </div>
    );
}

export default async function AdminPage() {
    const { success, stats } = await getAdminStats();

    if (!success || !stats) {
        return <div className="p-8 text-red-500">Greška pri učitavanju statistike.</div>;
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-800">Pregled</h1>
                <p className="text-slate-500">Dobrodošao nazad, Chef.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Ukupno Recepata"
                    value={stats.totalRecipes}
                    icon={FiGrid}
                    color="bg-orange-500"
                />
                <StatCard
                    title="Registrovanih Korisnika"
                    value={stats.totalUsers}
                    icon={FiUsers}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Komentara"
                    value={stats.totalComments}
                    icon={FiMessageSquare}
                    color="bg-green-500"
                />
            </div>

            {/* Quick Actions */}
            <QuickActions />
        </div>
    );
}
