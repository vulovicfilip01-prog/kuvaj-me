import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FiHome, FiGrid, FiUsers, FiLogOut, FiPieChart, FiMail, FiAlertTriangle } from "react-icons/fi";
import { LuWallet } from "react-icons/lu";
export const dynamic = 'force-dynamic';

async function AdminSidebar() {
    return (
        <aside className="w-64 bg-slate-900 text-white min-h-screen p-6 fixed left-0 top-0 hidden md:block">
            <div className="mb-8">
                <Link href="/" className="text-2xl font-bold text-primary flex items-center gap-2">
                    <FiGrid className="w-8 h-8" />
                    Kuvaj.me <span className="text-xs bg-primary/20 px-2 py-1 rounded text-primary">ADMIN</span>
                </Link>
            </div>

            <nav className="flex flex-col gap-2">
                <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-colors">
                    <FiPieChart /> Dashboard
                </Link>
                <Link href="/admin/recipes" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-colors">
                    <FiGrid /> Recepti
                </Link>
                <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-colors">
                    <FiUsers /> Korisnici
                </Link>
                <Link href="/admin/newsletter" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-colors">
                    <FiMail /> Newsletter
                </Link>
                <Link href="/admin/pricing" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-colors">
                    <LuWallet /> Cene sastojaka
                </Link>
            </nav>

            <div className="absolute bottom-6 left-6">
                <Link href="/" className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors">
                    <FiLogOut /> Nazad na sajt
                </Link>
            </div>
        </aside>
    );
}

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    try {
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            redirect('/login');
        }

        const { data: profile, error } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', user.id)
            .single();

        if (error || !profile?.is_admin) {
            redirect('/');
        }
        return (
            <div className="min-h-screen bg-slate-50">
                <AdminSidebar />
                <main className="md:ml-64 p-8">
                    {children}
                </main>
            </div>
        );
    } catch (err) {
        // If it's a redirect error, re-throw it so Next.js handles it
        if ((err as any).digest?.startsWith('NEXT_REDIRECT')) {
            throw err;
        }

        console.error('Admin layout error:', err);
        return (
            <div className="p-8 text-center bg-white min-h-screen flex flex-col items-center justify-center">
                <FiAlertTriangle className="text-red-500 w-12 h-12 mb-4" />
                <h1 className="text-2xl font-bold mb-2">Greška na serveru</h1>
                <p className="text-slate-500 mb-4">Došlo je do problema pri proveri vašeg pristupa. Proverite bazu podataka.</p>
                <Link href="/" className="text-primary hover:underline font-bold">Nazad na početnu</Link>
            </div>
        );
    }
}
