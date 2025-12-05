'use client'

import { useState } from 'react'
import { addItem, toggleItem, removeItem, clearChecked } from '@/app/shopping-list/actions'

interface ShoppingItem {
    id: string
    name: string
    quantity: string
    is_checked: boolean
}

export default function ShoppingList({ initialItems }: { initialItems: ShoppingItem[] }) {
    const [items, setItems] = useState<ShoppingItem[]>(initialItems)
    const [newItemName, setNewItemName] = useState('')
    const [newItemQuantity, setNewItemQuantity] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newItemName.trim() || isLoading) return

        setIsLoading(true)
        const result = await addItem(newItemName, newItemQuantity)

        if (result?.error) {
            alert('Greška prilikom dodavanja: ' + result.error)
        } else if (result?.items) {
            setItems(result.items)
            setNewItemName('')
            setNewItemQuantity('')
        }
        setIsLoading(false)
    }

    const handleToggle = async (id: string, checked: boolean) => {
        setIsLoading(true)
        const result = await toggleItem(id, checked)

        if (result?.error) {
            alert('Greška: ' + result.error)
        } else if (result?.items) {
            setItems(result.items)
        }
        setIsLoading(false)
    }

    const handleRemove = async (id: string) => {
        setIsLoading(true)
        const result = await removeItem(id)

        if (result?.error) {
            alert('Greška: ' + result.error)
        } else if (result?.items) {
            setItems(result.items)
        }
        setIsLoading(false)
    }

    const handleClearChecked = async () => {
        setIsLoading(true)
        const result = await clearChecked()

        if (result?.error) {
            alert('Greška: ' + result.error)
        } else if (result?.items) {
            setItems(result.items)
        }
        setIsLoading(false)
    }

    return (
        <div className="max-w-2xl mx-auto">
            {/* Add Item Form */}
            <form onSubmit={handleAdd} className="glass-panel rounded-2xl p-6 mb-8 animate-fadeIn">
                <div className="flex gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            value={newItemName}
                            onChange={(e) => setNewItemName(e.target.value)}
                            placeholder="Šta treba kupiti?"
                            disabled={isLoading}
                            className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
                        />
                    </div>
                    <div className="w-24">
                        <input
                            type="text"
                            value={newItemQuantity}
                            onChange={(e) => setNewItemQuantity(e.target.value)}
                            placeholder="Kol."
                            disabled={isLoading}
                            className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading || !newItemName.trim()}
                        className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors disabled:opacity-50"
                    >
                        {isLoading ? '...' : '+'}
                    </button>
                </div>
            </form>

            {/* List */}
            <div className="space-y-3">
                {items.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                        <div className="text-4xl mb-4">📝</div>
                        <p>Vaša lista za kupovinu je prazna.</p>
                    </div>
                ) : (
                    items.map(item => (
                        <div
                            key={item.id}
                            className={`glass-panel rounded-xl p-4 flex items-center gap-4 transition-all ${item.is_checked ? 'opacity-60 bg-slate-50' : 'bg-white'
                                }`}
                        >
                            <input
                                type="checkbox"
                                checked={item.is_checked}
                                onChange={(e) => handleToggle(item.id, e.target.checked)}
                                disabled={isLoading}
                                className="w-6 h-6 rounded border-2 border-primary text-primary focus:ring-primary/50 cursor-pointer disabled:opacity-50"
                            />
                            <div className="flex-1">
                                <span className={`font-medium text-lg ${item.is_checked ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                                    {item.name}
                                </span>
                            </div>
                            {item.quantity && (
                                <span className="px-3 py-1 bg-slate-100 rounded-lg text-sm font-bold text-slate-600">
                                    {item.quantity}
                                </span>
                            )}
                            <button
                                onClick={() => handleRemove(item.id)}
                                disabled={isLoading}
                                className="p-2 text-slate-400 hover:text-red-500 transition-colors disabled:opacity-50"
                            >
                                ✕
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Clear Button */}
            {items.some(i => i.is_checked) && (
                <div className="mt-8 text-center">
                    <button
                        onClick={handleClearChecked}
                        disabled={isLoading}
                        className="text-red-500 hover:text-red-600 text-sm font-medium hover:underline disabled:opacity-50"
                    >
                        Obriši kupljene stavke
                    </button>
                </div>
            )}
        </div>
    )
}
