import ChefHatIcon from '@/components/ChefHatIcon'

export default function NavbarSkeleton() {
    return (
        <nav className="relative z-50 container mx-auto px-6 py-6 flex justify-between items-center gap-4 bg-white/80 backdrop-blur-md shadow-sm rounded-b-3xl mb-8">
            {/* Logo */}
            <div className="flex items-center gap-3 flex-shrink-0 opacity-50">
                <ChefHatIcon className="w-10 h-10 text-slate-300" />
                <span className="text-2xl font-bold text-slate-300 heading-font tracking-tight">
                    Krckaj.me
                </span>
            </div>

            {/* Desktop Search Bar Placeholder */}
            <div className="hidden md:flex flex-1 max-w-xl">
                <div className="w-full h-12 bg-slate-100 rounded-2xl animate-pulse" />
            </div>

            {/* Actions Placeholder */}
            <div className="flex items-center gap-4">
                {/* Mobile Search Button Placeholder */}
                <div className="md:hidden w-10 h-10 bg-slate-100 rounded-full animate-pulse" />

                {/* Add Recipe Button Placeholder */}
                <div className="hidden md:block w-40 h-12 bg-slate-100 rounded-full animate-pulse" />

                {/* Desktop Links Placeholders */}
                <div className="hidden md:flex gap-4">
                    <div className="w-24 h-10 bg-slate-100 rounded-lg animate-pulse" />
                    <div className="w-24 h-10 bg-slate-100 rounded-lg animate-pulse" />
                    <div className="w-24 h-10 bg-slate-100 rounded-lg animate-pulse" />
                </div>

                {/* User Avatar Placeholder */}
                <div className="flex items-center gap-2 pl-2 border-l border-slate-200 ml-2">
                    <div className="w-10 h-10 bg-slate-200 rounded-full animate-pulse" />
                    <div className="hidden sm:block w-20 h-4 bg-slate-200 rounded animate-pulse" />
                </div>
            </div>
        </nav>
    )
}
