'use client'

import { useState } from 'react'
import { addToMealPlan } from '@/app/planner/actions'
import { FiCalendar, FiPlus, FiX } from 'react-icons/fi'

interface AddToPlanButtonProps {
    recipeId: string;
}

export default function AddToPlanButton({ recipeId }: AddToPlanButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [date, setDate] = useState('');
    const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const result = await addToMealPlan(recipeId, date, mealType);

        setLoading(false);
        if (result.success) {
            setMessage('Uspešno dodato!');
            setTimeout(() => {
                setIsOpen(false);
                setMessage('');
                setDate('');
            }, 1000);
        } else {
            setMessage(result.error || 'Greška');
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 bg-white text-slate-700 border border-slate-200 px-4 py-2 rounded-xl hover:bg-slate-50 transition-colors font-medium shadow-sm"
            >
                <FiCalendar className="w-5 h-5" />
                <span>Dodaj u Planer</span>
            </button>
        );
    }

    // Simple modal/popover
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <FiCalendar /> Planiraj Obrok
                    </h3>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-slate-400 hover:text-slate-600"
                    >
                        <FiX className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Datum</label>
                        <input
                            type="date"
                            required
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Obrok</label>
                        <select
                            value={mealType}
                            onChange={(e) => setMealType(e.target.value as any)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white"
                        >
                            <option value="breakfast">Doručak</option>
                            <option value="lunch">Ručak</option>
                            <option value="dinner">Večera</option>
                            <option value="snack">Užina</option>
                        </select>
                    </div>

                    {message && (
                        <div className={`p-3 rounded-lg text-sm ${message.includes('Greška') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                            {message}
                        </div>
                    )}

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="flex-1 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg border border-transparent"
                        >
                            Odustani
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark shadow-sm shadow-primary/30"
                        >
                            {loading ? 'Dodavanje...' : 'Sačuvaj'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
