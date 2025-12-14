'use client'

import { FiPrinter } from "react-icons/fi";

export default function PrintControl() {
    return (
        <button
            onClick={() => typeof window !== 'undefined' && window.print()}
            className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
        >
            <FiPrinter /> Štampaj
        </button>
    );
}
