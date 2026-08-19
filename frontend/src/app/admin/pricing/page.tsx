'use client'

import { useState, useEffect } from 'react'
import { getMarketPrices, updateMarketPrice } from '../pricing-actions'
import { LuWallet, LuSave, LuExternalLink, LuSearch } from 'react-icons/lu'
import { FiAlertTriangle } from 'react-icons/fi'

export default function AdminPricingPage() {
    const [prices, setPrices] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        loadPrices()
    }, [])

    const loadPrices = async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await getMarketPrices()
            if (Array.isArray(data)) {
                setPrices(data)
            } else {
                setError('Neispravan format podataka sa servera.')
            }
        } catch (err) {
            console.error('Error in loadPrices:', err)
            setError('Došlo je do greške pri učitavanju cena.')
        } finally {
            setLoading(false)
        }
    }

    const handleUpdatePrice = async (id: string, newPrice: number) => {
        try {
            const result = await updateMarketPrice(id, newPrice)
            if (result.success) {
                setPrices(prev => prev.map(p => p.id === id ? { ...p, price_per_unit: newPrice, source: 'manual', last_updated: new Date().toISOString() } : p))
            } else {
                alert('Greška pri čuvanju: ' + result.error)
            }
        } catch (err) {
            alert('Greška na serveru pri čuvanju cene.')
        }
    }

    const filteredPrices = prices.filter(p =>
        (p.display_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (p.name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    )

    return (
        <main className="min-h-screen bg-slate-50 py-8">
            <div className="container mx-auto px-6 max-w-5xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-900 heading-font flex items-center gap-3">
                            <LuWallet className="text-primary" /> Upravljanje cenama
                        </h1>
                        <p className="text-slate-500 mt-2">Pratite i ažurirajte cene sastojaka na srpskom tržištu.</p>
                    </div>
                </div>

                {error && (
                    <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-700">
                        <FiAlertTriangle className="flex-shrink-0" />
                        <p>{error}</p>
                        <button onClick={loadPrices} className="ml-auto underline font-bold">Pokušaj ponovo</button>
                    </div>
                )}

                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                        <div className="relative">
                            <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Pretraži sastojke..."
                                className="w-full pl-12 pr-6 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 font-bold">Sastojak</th>
                                    <th className="px-6 py-4 font-bold">Cena (RSD)</th>
                                    <th className="px-6 py-4 font-bold">Jedinica</th>
                                    <th className="px-6 py-4 font-bold">Izvor</th>
                                    <th className="px-6 py-4 font-bold">Poslednje ažuriranje</th>
                                    <th className="px-6 py-4 font-bold text-right">Akcije</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading && prices.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-slate-400">Učitavanje cena...</td>
                                    </tr>
                                ) : filteredPrices.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-slate-400">Nema rezultata.</td>
                                    </tr>
                                ) : filteredPrices.map((price) => (
                                    <tr key={price.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-900">{price.display_name}</div>
                                            <div className="text-xs text-slate-500">{price.name}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <input
                                                type="number"
                                                className="w-24 px-3 py-1.5 rounded-lg border border-slate-200 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                defaultValue={price.price_per_unit}
                                                onBlur={(e) => {
                                                    const val = parseFloat(e.target.value)
                                                    if (!isNaN(val) && val !== price.price_per_unit) handleUpdatePrice(price.id, val)
                                                }}
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-slate-100 rounded-md text-slate-600 text-xs font-medium uppercase">{price.unit}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-md text-xs font-bold ${price.source === 'cenoteka' ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'
                                                }`}>
                                                {price.source === 'cenoteka' ? 'Cenoteka' : 'Manual'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">
                                            {price.last_updated ? new Date(price.last_updated).toLocaleDateString('sr-RS') : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {price.keywords && price.keywords[0] && (
                                                <a
                                                    href={`https://www.cenoteka.rs/pretraga?q=${encodeURIComponent(price.keywords[0])}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-bold"
                                                >
                                                    Vidi na Cenoteci <LuExternalLink size={12} />
                                                </a>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-8 bg-amber-50 rounded-2xl p-6 border border-amber-100">
                    <h3 className="font-bold text-amber-900 flex items-center gap-2 mb-2 italic">
                        <LuWallet /> Savet za ažuriranje
                    </h3>
                    <p className="text-amber-800 text-sm leading-relaxed">
                        Preporučujemo da cene ažurirate jednom mesečno kako bi procene troškova recepata ostale relevantne.
                        Podatke možete uporediti na portalima poput Cenoteka.rs i ručno ih uneti ovde.
                    </p>
                </div>
            </div>
        </main>
    )
}
