import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/utils/supabase/server'
import ChefHatIcon from '@/components/ChefHatIcon'
import HeartIcon from '@/components/HeartIcon'
import SearchBar from '@/components/SearchBar'
import MobileSearchButton from '@/components/MobileSearchButton'
import { FiUser, FiSettings, FiLogOut, FiGrid } from 'react-icons/fi'

interface NavbarProps {
    transparent?: boolean
}

export default async function Navbar({ transparent = false }: NavbarProps) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Fetch profile if user is logged in to get avatar/name
    let profile = null
    if (user) {
        const { data } = await supabase
            .from('profiles')
            .select('display_name, avatar_url')
            .eq('id', user.id)
            .single()
        profile = data
    }

    return (
        <nav className={`relative z-50 container mx-auto px-6 py-6 flex justify-between items-center gap-4 ${!transparent ? 'bg-white/80 backdrop-blur-md shadow-sm rounded-b-3xl mb-8' : ''}`}>
            <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
                <ChefHatIcon className="w-10 h-10 transform group-hover:rotate-12 transition-transform duration-300" />
                <span className="text-2xl font-bold text-gradient heading-font tracking-tight">
                    Kuvaj.me
                </span>
            </Link>

            {/* Desktop Search Bar */}
            <div className="hidden md:flex flex-1 max-w-xl">
                <SearchBar />
            </div>

            <div className="flex items-center gap-4">
                {/* Mobile Search Button */}
                <MobileSearchButton />
                <Link
                    href="/recipes/new"
                    className="hidden md:flex px-5 py-2.5 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary-dark text-white rounded-full transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 items-center gap-2 font-medium"
                >
                    <span className="text-xl leading-none">+</span> Dodaj recept
                </Link>

                {user ? (
                    <>
                        <Link
                            href="/favorites"
                            className="hidden md:flex px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors font-medium items-center gap-2"
                        >
                            <HeartIcon className="w-8 h-8" />
                            <span className="hidden lg:inline">Favoriti</span>
                        </Link>
                        <Link
                            href="/collections"
                            className="hidden md:flex px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors font-medium items-center gap-2"
                        >
                            <span className="text-xl">📚</span>
                            <span className="hidden lg:inline">Kolekcije</span>
                        </Link>
                        <Link
                            href="/shopping-list"
                            className="hidden md:flex px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors font-medium items-center gap-2"
                        >
                            <span className="text-xl">🛒</span>
                            <span className="hidden lg:inline">Lista</span>
                        </Link>

                        {/* User Dropdown / Menu */}
                        <div className="flex items-center gap-3 pl-2 border-l border-slate-200 ml-2">
                            <Link
                                href={`/profile/${user.id}`}
                                className="flex items-center gap-2 hover:bg-slate-100 rounded-full pr-4 pl-1 py-1 transition-all"
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold text-sm overflow-hidden relative">
                                    {profile?.avatar_url ? (
                                        <Image
                                            src={profile.avatar_url}
                                            alt="Avatar"
                                            fill
                                            className="object-cover"
                                            sizes="32px"
                                        />
                                    ) : (
                                        <span>{profile?.display_name?.[0]?.toUpperCase() || 'U'}</span>
                                    )}
                                </div>
                                <span className="font-bold text-slate-700 max-w-[100px] truncate hidden sm:block">
                                    {profile?.display_name || 'Korisnik'}
                                </span>
                            </Link>

                            <Link
                                href="/profile/edit"
                                className="p-2 text-slate-500 hover:text-primary transition-colors"
                                title="Podešavanja"
                            >
                                <FiSettings className="w-5 h-5" />
                            </Link>

                            <form action="/auth/signout" method="post">
                                <button
                                    className="p-2 text-slate-500 hover:text-red-500 transition-colors"
                                    title="Odjavi se"
                                >
                                    <FiLogOut className="w-5 h-5" />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <>
                        <Link href="/login" className="px-5 py-2.5 text-slate-600 hover:text-slate-900 transition-colors font-medium">
                            Prijavi se
                        </Link>
                        <Link href="/signup" className="px-6 py-2.5 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary-dark text-white rounded-full font-medium shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all transform hover:-translate-y-0.5">
                            Registruj se
                        </Link>
                    </>
                )}
            </div>
        </nav>
    )
}
