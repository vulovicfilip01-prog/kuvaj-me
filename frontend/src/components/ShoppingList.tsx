'use client'

import { useState, useEffect } from 'react'
import { addItem as serverAddItem, toggleItem as serverToggleItem, removeItem as serverRemoveItem, clearChecked as serverClearChecked } from '@/app/shopping-list/actions'
import * as offlineStorage from '@/lib/offline-storage'
import WheatOffIcon from './WheatOffIcon'
import { FiWifiOff, FiWifi, FiRefreshCw } from 'react-icons/fi'

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
    const [isOnline, setIsOnline] = useState(true)
    const [isSyncing, setIsSyncing] = useState(false)
    const [pendingSyncCount, setPendingSyncCount] = useState(0)

    // Initialize online status and listeners
    useEffect(() => {
        setIsOnline(navigator.onLine)

        const handleOnline = async () => {
            console.log('[ShoppingList] Back online...')
            setIsOnline(true)
            await performSync()
        }

        const handleOffline = () => {
            console.log('[ShoppingList] Gone offline...')
            setIsOnline(false)
        }

        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        // Initialize IndexedDB and load pending sync count
        offlineStorage.initDB().then(async () => {
            const pending = await offlineStorage.getPendingSync()
            setPendingSyncCount(pending.length)
        })

        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [])

    // Sync with server
    const performSync = async () => {
        setIsSyncing(true)
        try {
            const result = await offlineStorage.syncWithServer({
                add: serverAddItem,
                toggle: serverToggleItem,
                remove: serverRemoveItem,
                clearChecked: serverClearChecked
            })

            if (result.success) {
                console.log('[ShoppingList] Sync successful')
                setPendingSyncCount(0)
                // Refresh items from server
                const serverResult = await serverAddItem('', '') // This will return current items
                if (serverResult?.items) {
                    setItems(serverResult.items)
                }
            } else {
                console.error('[ShoppingList] Sync errors:', result.errors)
            }
        } catch (error) {
            console.error('[ShoppingList] Sync failed:', error)
        } finally {
            setIsSyncing(false)
        }
    }

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newItemName.trim() || isLoading) return

        setIsLoading(true)

        try {
            if (isOnline) {
                // Online: use server action
                const result = await serverAddItem(newItemName, newItemQuantity)

                if (result?.error) {
                    alert('Greška prilikom dodavanja: ' + result.error)
                } else if (result?.items) {
                    setItems(result.items)
                    setNewItemName('')
                    setNewItemQuantity('')
                }
            } else {
                // Offline: add to IndexedDB and sync queue
                const newItem: offlineStorage.ShoppingItem = {
                    id: `offline-${Date.now()}`,
                    name: newItemName,
                    quantity: newItemQuantity,
                    is_checked: false,
                    synced: false,
                    created_at: new Date().toISOString()
                }

                await offlineStorage.addItem(newItem)
                await offlineStorage.addToSyncQueue('add', { name: newItemName, quantity: newItemQuantity })

                const updatedItems = await offlineStorage.getItems()
                setItems(updatedItems)
                setPendingSyncCount(prev => prev + 1)

                setNewItemName('')
                setNewItemQuantity('')
            }
        } catch (error) {
            console.error('[ShoppingList] handleAdd error:', error)
            alert('Greška prilikom dodavanja stavke')
        } finally {
            setIsLoading(false)
        }
    }


    const handleToggle = async (id: string, checked: boolean) => {
        setIsLoading(true)

        try {
            if (isOnline) {
                const result = await serverToggleItem(id, checked)

                if (result?.error) {
                    alert('Greška: ' + result.error)
                } else if (result?.items) {
                    setItems(result.items)
                }
            } else {
                await offlineStorage.updateItem(id, { is_checked: checked })
                await offlineStorage.addToSyncQueue('toggle', { id, checked })

                const updatedItems = await offlineStorage.getItems()
                setItems(updatedItems)
                setPendingSyncCount(prev => prev + 1)
            }
        } catch (error) {
            console.error('[ShoppingList] handleToggle error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleRemove = async (id: string) => {
        setIsLoading(true)

        try {
            if (isOnline) {
                const result = await serverRemoveItem(id)

                if (result?.error) {
                    alert('Greška: ' + result.error)
                } else if (result?.items) {
                    setItems(result.items)
                }
            } else {
                await offlineStorage.deleteItem(id)
                await offlineStorage.addToSyncQueue('delete', { id })

                const updatedItems = await offlineStorage.getItems()
                setItems(updatedItems)
                setPendingSyncCount(prev => prev + 1)
            }
        } catch (error) {
            console.error('[ShoppingList] handleRemove error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleClearChecked = async () => {
        setIsLoading(true)

        try {
            if (isOnline) {
                const result = await serverClearChecked()

                if (result?.error) {
                    alert('Greška: ' + result.error)
                } else if (result?.items) {
                    setItems(result.items)
                }
            } else {
                await offlineStorage.deleteCheckedItems()
                await offlineStorage.addToSyncQueue('clear-checked', {})

                const updatedItems = await offlineStorage.getItems()
                setItems(updatedItems)
                setPendingSyncCount(prev => prev + 1)
            }
        } catch (error) {
            console.error('[ShoppingList] handleClearChecked error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            {/* Online/Offline Status Banner */}
            {!isOnline && (
                <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3">
                    <FiWifiOff className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    <div className="flex-1">
                        <p className="text-sm font-bold text-amber-900">Offline režim</p>
                        <p className="text-xs text-amber-700">Promene će biti sačuvane i sinhronizovane kada se vratite online.</p>
                    </div>
                    {pendingSyncCount > 0 && (
                        <span className="px-3 py-1 bg-amber-200 rounded-full text-xs font-bold text-amber-900">
                            {pendingSyncCount} nesinhronizovano
                        </span>
                    )}
                </div>
            )}

            {isOnline && isSyncing && (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-center gap-3">
                    <FiRefreshCw className="w-5 h-5 text-blue-600 animate-spin flex-shrink-0" />
                    <p className="text-sm font-bold text-blue-900">Sinhronizacija sa serverom...</p>
                </div>
            )}

            {isOnline && !isSyncing && pendingSyncCount === 0 && initialItems.length !== items.length && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-3">
                    <FiWifi className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <p className="text-sm font-bold text-green-900">Sve promene su sinhronizovane</p>
                </div>
            )}

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
                        <div className="flex justify-center mb-4">
                            <WheatOffIcon className="w-16 h-16" />
                        </div>
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
