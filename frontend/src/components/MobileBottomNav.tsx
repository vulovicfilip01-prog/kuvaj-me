'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FiSearch, FiPlus, FiUser, FiShoppingCart } from 'react-icons/fi'
import { LuRefrigerator } from 'react-icons/lu'
import { HiOutlineHeart, HiHeart } from 'react-icons/hi'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function MobileBottomNav() {
    const pathname = usePathname()
    const [userId, setUserId] = useState<string | null>(null)
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUserId(user?.id || null)
        }
        checkUser()

        // Handle keyboard opening on mobile devices to hide the bottom nav
        const handleResize = () => {
            if (window.innerHeight < 500) {
                setIsKeyboardOpen(true)
            } else {
                setIsKeyboardOpen(false)
            }
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    if (isKeyboardOpen) return null

    const navItems = [
        {
            name: 'Pretraga',
            href: '/explore',
            icon: FiSearch,
            active: pathname === '/explore' || pathname === '/search',
        },
        {
            name: 'Frižider',
            href: '/explore/fridge',
            icon: LuRefrigerator,
            active: pathname === '/explore/fridge',
        },
        {
            name: 'Dodaj',
            href: '/recipes/new',
            icon: FiPlus,
            active: pathname === '/recipes/new',
            isSpecial: true
        },
        {
            name: 'Favoriti',
            href: '/favorites',
            icon: pathname === '/favorites' ? HiHeart : HiOutlineHeart,
            active: pathname === '/favorites',
        },
        {
            name: 'Lista',
            href: '/shopping-list',
            icon: FiShoppingCart,
            active: pathname === '/shopping-list',
        }
    ]

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-slate-200 pb-safe">
            <nav className="flex justify-around items-center px-2 py-2">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = item.active
                    const isSpecial = item.isSpecial

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="flex flex-col items-center justify-center w-16 py-1 group"
                        >
                            <div className={`flex items-center justify-center rounded-full bg-gradient-to-r from-primary to-primary-dark text-white shadow-md transition-transform active:scale-95 ${
                                isSpecial ? 'w-14 h-14 -mt-6 shadow-primary/40' : 'w-10 h-10 shadow-primary/20'
                            } ${isActive && !isSpecial ? 'ring-2 ring-offset-2 ring-primary' : ''}`}>
                                <Icon className={isSpecial ? "w-7 h-7" : "w-5 h-5"} />
                            </div>
                            <span className={`text-[10px] font-medium mt-1 transition-colors ${
                                isActive ? 'text-primary' : 'text-slate-500 group-hover:text-slate-700'
                            }`}>
                                {item.name}
                            </span>
                        </Link>
                    )
                })}
            </nav>
        </div>
    )
}
