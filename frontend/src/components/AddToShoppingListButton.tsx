'use client'

import { useState } from 'react'
import { addItems } from '@/app/shopping-list/actions'

interface Ingredient {
    name: string
    quantity: string
}

export default function AddToShoppingListButton({ ingredients, isAuthenticated }: { ingredients: Ingredient[], isAuthenticated: boolean }) {
    const [isLoading, setIsLoading] = useState(false)
    const [added, setAdded] = useState(false)

    const handleAdd = async () => {
        if (!isAuthenticated) {
            alert('Morate biti ulogovani da biste koristili listu za kupovinu.')
            return
        }

        setIsLoading(true)
        const result = await addItems(ingredients)
        setIsLoading(false)

        if (result?.error) {
            alert('Greška: ' + result.error)
        } else {
            setAdded(true)
            setTimeout(() => setAdded(false), 3000)
        }
    }

    return (
        <button
            onClick={handleAdd}
            disabled={isLoading || added}
            className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 shadow-lg backdrop-blur-md ${added
                ? 'bg-green-500 text-white'
                : 'bg-primary/90 text-white hover:bg-primary border border-primary/50'
                }`}
        >
            {isLoading ? 'Dodavanje...' : added ? '✅ Dodato!' : '🛒 Dodaj u listu'}
        </button>
    )
}
