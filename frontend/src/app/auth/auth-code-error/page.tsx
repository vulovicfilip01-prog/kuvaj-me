export default function AuthErrorPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-transparent">
            <div className="w-full max-w-md p-8 bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-slate-200 text-center">
                <div className="text-6xl mb-4">⚠️</div>
                <h1 className="text-3xl font-bold text-slate-900 mb-4">Greška u autentifikaciji</h1>
                <p className="text-slate-600 mb-8">
                    Došlo je do problema sa vašom autentifikacijom. Link možda nije validan ili je istekao.
                </p>
                <div className="flex flex-col gap-3">
                    <a
                        href="/login"
                        className="px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg hover:from-primary-dark hover:to-primary-dark transition"
                    >
                        Povratak na prijavu
                    </a>
                    <a
                        href="/forgot-password"
                        className="px-6 py-3 bg-white text-slate-600 rounded-lg hover:bg-slate-50 transition border border-slate-200"
                    >
                        Zatraži novi link
                    </a>
                </div>
            </div>
        </div>
    )
}
