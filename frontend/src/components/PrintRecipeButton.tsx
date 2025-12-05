'use client'

import { FiPrinter } from 'react-icons/fi'

export default function PrintRecipeButton() {
    return (
        <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors print:hidden"
        >
            <FiPrinter className="w-5 h-5" />
            <span className="hidden sm:inline">Štampaj</span>
        </button>
    )
}
