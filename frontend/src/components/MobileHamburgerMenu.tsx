'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { FiMenu, FiX, FiUser, FiLayers, FiCalendar, FiSettings, FiLogOut, FiHome } from 'react-icons/fi'
import { signOut } from '@/app/actions'

interface MobileHamburgerMenuProps {
    userId?: string
    isAdmin?: boolean
}

export default function MobileHamburgerMenu({ userId, isAdmin }: MobileHamburgerMenuProps) {
    const [isOpen, setIsOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className="md:hidden relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-slate-700 hover:text-primary transition-colors focus:outline-none"
                aria-label="Otvori meni"
            >
                {isOpen ? <FiX className="w-7 h-7" /> : <FiMenu className="w-7 h-7" />}
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-fadeIn">
                    <div className="py-2">
                        {userId ? (
                            <>
                                <Link
                                    href="/"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 px-5 py-3 text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors border-b border-slate-100"
                                >
                                    <FiHome className="w-5 h-5" />
                                    <span className="font-medium">Početna</span>
                                </Link>
                                <Link
                                    href={`/profile/${userId}`}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 px-5 py-3 text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors"
                                >
                                    <FiUser className="w-5 h-5" />
                                    <span className="font-medium">Moj Profil</span>
                                </Link>
                                <Link
                                    href="/collections"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 px-5 py-3 text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors"
                                >
                                    <FiLayers className="w-5 h-5" />
                                    <span className="font-medium">Kolekcije</span>
                                </Link>
                                <Link
                                    href="/profile/planner"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 px-5 py-3 text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors"
                                >
                                    <FiCalendar className="w-5 h-5" />
                                    <span className="font-medium">Planer</span>
                                </Link>
                                <Link
                                    href="/profile/edit"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 px-5 py-3 text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors"
                                >
                                    <FiSettings className="w-5 h-5" />
                                    <span className="font-medium">Podešavanja</span>
                                </Link>
                                
                                {isAdmin && (
                                    <Link
                                        href="/admin"
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-3 px-5 py-3 text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors border-t border-slate-100"
                                    >
                                        <FiSettings className="w-5 h-5" />
                                        <span className="font-medium text-primary">Admin Panel</span>
                                    </Link>
                                )}

                                <div className="border-t border-slate-100 mt-2 pt-2">
                                    <form action={signOut} className="w-full">
                                        <button
                                            type="submit"
                                            className="w-full flex items-center gap-3 px-5 py-3 text-red-500 hover:bg-red-50 transition-colors"
                                        >
                                            <FiLogOut className="w-5 h-5" />
                                            <span className="font-medium">Odjavi se</span>
                                        </button>
                                    </form>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 px-5 py-3 text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors font-medium"
                                >
                                    Prijavi se
                                </Link>
                                <Link
                                    href="/signup"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 px-5 py-3 text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors font-medium"
                                >
                                    Registruj se
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
