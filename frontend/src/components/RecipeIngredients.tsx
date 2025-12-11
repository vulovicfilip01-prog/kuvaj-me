'use client'

import { useState } from 'react'
import { GiFruitBowl } from "react-icons/gi";
import { addItems } from '@/app/shopping-list/actions'

interface Ingredient {
    id: string
    name: string
    quantity: string
}

export default function RecipeIngredients({ ingredients, isAuthenticated }: { ingredients: Ingredient[], isAuthenticated: boolean }) {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
    const [isAdding, setIsAdding] = useState(false)
    const [added, setAdded] = useState(false)

    // Toggle individual selection
    const toggleSelection = (id: string) => {
        const newSelection = new Set(selectedIds)
        if (newSelection.has(id)) {
            newSelection.delete(id)
        } else {
            newSelection.add(id)
        }
        setSelectedIds(newSelection)
    }

    // Toggle all
    const toggleAll = () => {
        if (selectedIds.size === ingredients.length) {
            setSelectedIds(new Set())
        } else {
            setSelectedIds(new Set(ingredients.map(i => i.id)))
        }
    }

    const handleAdd = async () => {
        if (!isAuthenticated) {
            alert('Morate biti ulogovani da biste koristili listu za kupovinu.')
            return
        }

        if (selectedIds.size === 0) {
            alert('Molimo izaberite sastojke koje želite da dodate.')
            return
        }

        setIsAdding(true)
        const selectedIngredients = ingredients
            .filter(ing => selectedIds.has(ing.id))
            .map(ing => ({
                name: ing.name,
                quantity: ing.quantity
            }))

        const result = await addItems(selectedIngredients)
        setIsAdding(false)

        if (result?.error) {
            alert('Greška: ' + result.error)
        } else {
            setAdded(true)
            setTimeout(() => setAdded(false), 3000)
            // Optional: clear selection after adding
            // setSelectedIds(new Set())
        }
    }

    return (
        <section>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold heading-font flex items-center gap-3">
                    <GiFruitBowl className="text-4xl text-primary" /> Sastojci
                </h2>
                <div className="flex items-center gap-3">
                    <button
                        onClick={toggleAll}
                        className="text-sm font-bold text-primary hover:underline"
                    >
                        {selectedIds.size === ingredients.length ? 'Poništi izbor' : 'Izaberi sve'}
                    </button>
                    <button
                        onClick={handleAdd}
                        disabled={isAdding || added || selectedIds.size === 0}
                        className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 shadow-lg ${added
                            ? 'bg-green-500 text-white'
                            : 'bg-primary text-white hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed'
                            }`}
                    >
                        {isAdding ? 'Dodavanje...' : added ? '✅ Dodato!' : `🛒 Dodaj (${selectedIds.size})`}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ingredients.map((ing) => (
                    <label
                        key={ing.id}
                        className={`glass-panel rounded-2xl p-5 cursor-pointer group flex items-center gap-4 border transition-all ${selectedIds.has(ing.id)
                            ? 'border-primary bg-primary/5'
                            : 'border-slate-200 hover:border-primary/50'
                            }`}
                    >
                        <input
                            type="checkbox"
                            checked={selectedIds.has(ing.id)}
                            onChange={() => toggleSelection(ing.id)}
                            className="w-5 h-5 rounded border-2 border-primary bg-transparent checked:bg-primary focus:ring-2 focus:ring-primary/50 cursor-pointer"
                        />
                        <div className="flex-1 flex justify-between items-center">
                            <span className={`font-medium transition-colors ${selectedIds.has(ing.id) ? 'text-primary font-bold' : 'text-slate-900 group-hover:text-primary'
                                }`}>
                                {ing.name}
                            </span>
                            <span className="text-slate-600 font-bold">{ing.quantity}</span>
                        </div>
                    </label>
                ))}
            </div>
        </section>
    )
}
