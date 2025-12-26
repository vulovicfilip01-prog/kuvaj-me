import { getAdminStats, getGrowthStats } from "../actions";
import AdminChart from "@/components/AdminChart";
import Link from 'next/link';
import { LuUsers, LuChefHat, LuMessageSquare, LuArrowLeft } from 'react-icons/lu';

export default async function AdminDashboardPage() {
    const [statsResult, growthResult] = await Promise.all([
        getAdminStats(),
        getGrowthStats()
    ]);

    const stats = statsResult.success ? statsResult.stats : null;
    const chartData = growthResult.success ? growthResult.chartData : [];

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="container mx-auto max-w-6xl">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/admin/users" className="p-2 bg-white rounded-lg shadow-sm hover:bg-slate-100 transition-colors text-slate-600">
                        <LuArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                        <div className="p-4 bg-blue-50 text-blue-500 rounded-full">
                            <LuUsers className="w-8 h-8" />
                        </div>
                        <div>
                            <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">Korisnici</div>
                            <div className="text-3xl font-bold text-slate-900">{stats?.totalUsers || 0}</div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                        <div className="p-4 bg-orange-50 text-orange-500 rounded-full">
                            <LuChefHat className="w-8 h-8" />
                        </div>
                        <div>
                            <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">Recepti</div>
                            <div className="text-3xl font-bold text-slate-900">{stats?.totalRecipes || 0}</div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                        <div className="p-4 bg-green-50 text-green-500 rounded-full">
                            <LuMessageSquare className="w-8 h-8" />
                        </div>
                        <div>
                            <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">Komentari</div>
                            <div className="text-3xl font-bold text-slate-900">{stats?.totalComments || 0}</div>
                        </div>
                    </div>
                </div>

                {/* Growth Chart */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 mb-8">
                    <h2 className="text-xl font-bold text-slate-800 mb-6">Rast Platforme (Poslednjih 30 dana)</h2>
                    <AdminChart data={chartData || []} />
                </div>
            </div>
        </div>
    );
}
