'use client'

interface ChartData {
    date: string
    users: number
    recipes: number
}

interface AdminChartProps {
    data: ChartData[]
}

export default function AdminChart({ data }: AdminChartProps) {
    if (!data || data.length === 0) return <div className="text-center text-slate-500 py-10">Nema podataka za prikaz</div>

    const maxVal = Math.max(
        ...data.map(d => Math.max(d.users, d.recipes)),
        5 // Minimum scale
    )

    return (
        <div className="w-full overflow-x-auto">
            <div className="min-w-[600px] h-[300px] flex items-end gap-4 p-4 border-b border-l border-slate-200 relative">
                {/* Y-axis labels (rough) */}
                <div className="absolute left-0 top-0 bottom-0 -translate-x-[100%] flex flex-col justify-between text-xs text-slate-400 py-4 pr-2 h-full">
                    <span>{maxVal}</span>
                    <span>{Math.round(maxVal / 2)}</span>
                    <span>0</span>
                </div>

                {data.map((item) => {
                    const userHeight = (item.users / maxVal) * 100
                    const recipeHeight = (item.recipes / maxVal) * 100

                    return (
                        <div key={item.date} className="flex-1 flex flex-col justify-end gap-1 group relative h-full">
                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-slate-800 text-white text-xs rounded p-2 z-10 whitespace-nowrap shadow-lg">
                                <div className="font-bold">{new Date(item.date).toLocaleDateString('sr-RS')}</div>
                                <div>Korisnici: {item.users}</div>
                                <div>Recepti: {item.recipes}</div>
                            </div>

                            {/* Bars */}
                            <div className="flex gap-1 items-end justify-center h-full">
                                <div
                                    style={{ height: `${userHeight}%` }}
                                    className="w-3 bg-blue-500 rounded-t-sm hover:bg-blue-600 transition-all relative"
                                />
                                <div
                                    style={{ height: `${recipeHeight}%` }}
                                    className="w-3 bg-orange-500 rounded-t-sm hover:bg-orange-600 transition-all relative"
                                />
                            </div>

                            {/* X-axis label */}
                            <div className="mt-2 text-[10px] text-slate-500 text-center -rotate-45 origin-top-left translate-x-2 truncate w-full">
                                {new Date(item.date).toLocaleDateString('sr-RS', { day: 'numeric', month: 'numeric' })}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Legend */}
            <div className="flex gap-4 justify-center mt-8 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
                    <span>Novi korisnici</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-sm"></div>
                    <span>Novi recepti</span>
                </div>
            </div>
        </div>
    )
}
