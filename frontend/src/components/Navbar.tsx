import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/utils/supabase/server'
import { signOut } from '@/app/actions'
import ChefHatIcon from '@/components/ChefHatIcon'
import HeartIcon from '@/components/HeartIcon'
import CollectionIcon from '@/components/CollectionIcon'
import ListIcon from '@/components/ListIcon'
import PlannerIcon from '@/components/PlannerIcon'
import SearchBar from '@/components/SearchBar'
import MobileSearchButton from '@/components/MobileSearchButton'
import { FiUser, FiSettings, FiLogOut, FiGrid } from 'react-icons/fi'
import { LuRefrigerator } from 'react-icons/lu'
import NotificationBell from '@/components/NotificationBell'
import MobileHamburgerMenu from '@/components/MobileHamburgerMenu'
import { getUnreadCount } from '@/app/notifications/actions'

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
            .select('display_name, avatar_url, is_admin')
            .eq('id', user.id)
            .single()
        profile = data
    }

    const unreadCount = user ? await getUnreadCount() : 0

    return (
        <>
            {!transparent && <div className="h-[60px] md:h-[90px] w-full shrink-0"></div>}
            <nav className={`fixed top-0 left-0 right-0 w-full z-50 mx-auto px-4 py-2 md:px-6 md:py-4 flex justify-between items-center gap-4 ${!transparent ? 'bg-white/50 backdrop-blur-md shadow-sm border-b border-slate-100' : ''}`}>
            <div className="container mx-auto flex justify-between items-center w-full">
            <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
                <div className="relative w-[180px] h-[60px] min-[400px]:w-[240px] min-[400px]:h-[80px] md:w-[320px] md:h-[105px] transform group-hover:scale-105 transition-transform duration-300">
                    <Image src="/logo.png" alt="Krckaj.me logo" fill className="object-contain object-left drop-shadow-md" sizes="(max-width: 400px) 180px, (max-width: 768px) 240px, 320px" />
                </div>
            </Link>

            {/* Desktop Search Bar */}
            <div className="hidden md:flex flex-1 max-w-xl">
                <SearchBar />
            </div>

            <div className="flex items-center gap-4">
                {/* Mobile Search Button */}
                <Link
                    href="/explore/fridge"
                    className="hidden lg:flex px-5 py-2.5 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary-dark text-white rounded-full transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 items-center gap-2 font-medium group cursor-pointer"
                    title="Pretraga po sastojcima"
                >
                    <LuRefrigerator className="w-5 h-5 transition-transform group-hover:scale-110" />
                    <span>Frižider</span>
                </Link>

                <Link
                    href="/recipes/new"
                    className="hidden md:flex px-5 py-2.5 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary-dark text-white rounded-full transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 items-center gap-2 font-medium cursor-pointer"
                >
                    <span className="text-xl leading-none">+</span> Dodaj recept
                </Link>

                {user ? (
                    <>
                        <Link
                            href="/favorites"
                            className="hidden md:flex px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors font-medium items-center gap-2 cursor-pointer"
                        >
                            <HeartIcon className="w-8 h-8" />
                            <span className="hidden lg:inline">Favoriti</span>
                        </Link>
                        <Link
                            href="/collections"
                            className="hidden md:flex px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors font-medium items-center gap-2 cursor-pointer"
                        >
                            <CollectionIcon className="w-8 h-8" />
                            <span className="hidden lg:inline">Kolekcije</span>
                        </Link>
                        <Link
                            href="/profile/planner"
                            className="hidden md:flex px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors font-medium items-center gap-2 cursor-pointer"
                        >
                            <PlannerIcon className="w-8 h-8" />
                            <span className="hidden lg:inline">Planer</span>
                        </Link>
                        <Link
                            href="/shopping-list"
                            className="hidden md:flex px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors font-medium items-center gap-2 cursor-pointer"
                        >
                            <ListIcon className="w-8 h-8" />
                            <span className="hidden lg:inline">Lista</span>
                        </Link>


                        {/* User Dropdown / Menu */}
                        <div className="flex items-center gap-2 md:pl-2 md:border-l md:border-slate-200 md:ml-2">
                            <NotificationBell initialUnreadCount={unreadCount} />
                            
                            <MobileHamburgerMenu userId={user.id} isAdmin={profile?.is_admin} />

                            <div className="hidden md:flex items-center gap-2">

                            <Link
                                href={`/profile/${user.id}`}
                                className="flex items-center gap-2 hover:bg-slate-100 rounded-full pr-4 pl-1 py-1 transition-all cursor-pointer"
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
                                className="p-2 text-slate-500 hover:text-primary transition-colors cursor-pointer"
                                title="Podešavanja"
                            >
                                <FiSettings className="w-5 h-5" />
                            </Link>

                            {profile?.is_admin && (
                                <Link
                                    href="/admin"
                                    className="p-2 text-slate-500 hover:text-primary transition-colors cursor-pointer bg-slate-100 rounded-lg ml-1"
                                    title="Admin Panel"
                                >
                                    <FiGrid className="w-5 h-5" />
                                </Link>
                            )}

                            <form action={signOut}>
                                <button
                                    className="p-2 text-slate-500 hover:text-red-500 transition-colors cursor-pointer"
                                    title="Odjavi se"
                                >
                                    <FiLogOut className="w-5 h-5" />
                                </button>
                            </form>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <Link href="/login" className="hidden md:flex px-5 py-2.5 text-slate-600 hover:text-slate-900 transition-colors font-medium">
                            Prijavi se
                        </Link>
                        <Link href="/signup" className="hidden md:flex px-6 py-2.5 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary-dark text-white rounded-full font-medium shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all transform hover:-translate-y-0.5">
                            Registruj se
                        </Link>
                        
                        <MobileHamburgerMenu />
                    </>
                )}
            </div>
            </div>
        </nav>
        </>
    )
}
