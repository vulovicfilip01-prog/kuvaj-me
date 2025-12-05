'use client'

import { useState } from 'react'
import { FiSearch } from 'react-icons/fi'
import MobileSearchModal from '@/components/MobileSearchModal'

export default function MobileSearchButton() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="md:hidden p-2 text-slate-600 hover:text-slate-900 transition-colors"
                aria-label="Otvori pretragu"
            >
                <FiSearch className="w-6 h-6" />
            </button>

            <MobileSearchModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
        </>
    )
}
