interface NutritionDisplayProps {
    calories?: number | null
    protein?: number | null
    carbohydrates?: number | null
    fat?: number | null
    fiber?: number | null
}

export default function NutritionDisplay({
    calories,
    protein,
    carbohydrates,
    fat,
    fiber
}: NutritionDisplayProps) {
    // Don't render if no nutrition data
    const hasData = calories || protein || carbohydrates || fat || fiber

    if (!hasData) return null

    return (
        <div className="glass-panel rounded-3xl p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-4 heading-font flex items-center gap-2">
                <span className="text-2xl">🥗</span> Nutritivne vrednosti
            </h3>

            <div className="bg-white/70 border-2 border-slate-300 rounded-xl p-4">
                <p className="text-sm font-bold text-slate-900 mb-3 pb-2 border-b-4 border-slate-900">
                    Po porciji
                </p>

                {calories && (
                    <div className="mb-3 pb-2 border-b border-slate-200">
                        <div className="flex justify-between items-baseline">
                            <span className="font-bold text-slate-900 text-lg">Kalorije</span>
                            <span className="font-bold text-2xl text-primary">{calories}</span>
                        </div>
                    </div>
                )}

                <div className="space-y-2 text-sm">
                    {protein !== null && protein !== undefined && (
                        <div className="flex justify-between items-center py-1">
                            <span className="text-slate-900 font-medium">Proteini</span>
                            <span className="font-bold text-slate-900">{protein}g</span>
                        </div>
                    )}

                    {carbohydrates !== null && carbohydrates !== undefined && (
                        <div className="flex justify-between items-center py-1 border-t border-slate-200">
                            <span className="text-slate-900 font-medium">Ugljeni hidrati</span>
                            <span className="font-bold text-slate-900">{carbohydrates}g</span>
                        </div>
                    )}

                    {fat !== null && fat !== undefined && (
                        <div className="flex justify-between items-center py-1 border-t border-slate-200">
                            <span className="text-slate-900 font-medium">Masti</span>
                            <span className="font-bold text-slate-900">{fat}g</span>
                        </div>
                    )}

                    {fiber !== null && fiber !== undefined && (
                        <div className="flex justify-between items-center py-1 border-t border-slate-200">
                            <span className="text-slate-900 font-medium">Vlakna</span>
                            <span className="font-bold text-slate-900">{fiber}g</span>
                        </div>
                    )}
                </div>

                <p className="text-xs text-slate-500 mt-3 italic">
                    * Nutritivne vrednosti su približne i mogu da variraju
                </p>
            </div>
        </div>
    )
}
