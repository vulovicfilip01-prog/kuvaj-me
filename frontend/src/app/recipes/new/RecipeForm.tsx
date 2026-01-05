'use client'

import { useState } from 'react'
import { createRecipe, updateRecipe, getCategories } from '../actions'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ImageUpload from '@/components/ImageUpload'
import UserRoundPenIcon from '@/components/UserRoundPenIcon'
import DifficultyBadge from '@/components/DifficultyBadge'
import AIRecipeModal from '@/components/AIRecipeModal'
import { FiZap } from 'react-icons/fi'
import VegetableIcon from '@/components/VegetableIcon'
import ForkKnifeIcon from '@/components/ForkKnifeIcon'
import SettingsIcon from '@/components/SettingsIcon'
import NutritionIcon from '@/components/NutritionIcon'

interface Category {
    id: string
    name: string
    slug: string
    icon: string
}

interface Ingredient {
    name: string
    quantity: string
}

interface Step {
    instruction: string
}

export default function RecipeForm({ categories, initialData }: { categories: Category[], initialData?: any }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isAIModalOpen, setIsAIModalOpen] = useState(false)

    // Basic info
    const [title, setTitle] = useState(initialData?.title || '')
    const [description, setDescription] = useState(initialData?.description || '')
    const [categoryId, setCategoryId] = useState(initialData?.category_id || '')

    // Details
    const [prepTime, setPrepTime] = useState(initialData?.prep_time?.toString() || '')
    const [cookTime, setCookTime] = useState(initialData?.cook_time?.toString() || '')
    const [servings, setServings] = useState(initialData?.servings?.toString() || '')
    const [difficulty, setDifficulty] = useState<'lako' | 'srednje' | 'teško'>(initialData?.difficulty || 'srednje')
    const [isPublic, setIsPublic] = useState(initialData?.is_public ?? true)
    const [isPosno, setIsPosno] = useState(initialData?.is_posno ?? false)

    // Ingredients
    const [ingredients, setIngredients] = useState<Ingredient[]>(
        initialData?.ingredients?.map((i: any) => ({ name: i.name, quantity: i.quantity })) || [{ name: '', quantity: '' }]
    )

    // Steps
    const [steps, setSteps] = useState<Step[]>(
        initialData?.steps?.map((s: any) => ({ instruction: s.instruction })) || [{ instruction: '' }]
    )

    // Image URL
    const [imageUrl, setImageUrl] = useState<string | null>(initialData?.image_url || null)
    const [videoUrl, setVideoUrl] = useState<string>(initialData?.video_url || '')


    // Nutrition (optional)
    const [calories, setCalories] = useState(initialData?.calories?.toString() || '')
    const [protein, setProtein] = useState(initialData?.protein?.toString() || '')
    const [carbohydrates, setCarbohydrates] = useState(initialData?.carbohydrates?.toString() || '')
    const [fat, setFat] = useState(initialData?.fat?.toString() || '')
    const [fiber, setFiber] = useState(initialData?.fiber?.toString() || '')

    const addIngredient = () => {
        setIngredients([...ingredients, { name: '', quantity: '' }])
    }

    const removeIngredient = (index: number) => {
        if (ingredients.length > 1) {
            setIngredients(ingredients.filter((_, i) => i !== index))
        }
    }

    const updateIngredient = (index: number, field: 'name' | 'quantity', value: string) => {
        const updated = [...ingredients]
        updated[index][field] = value
        setIngredients(updated)
    }

    const addStep = () => {
        setSteps([...steps, { instruction: '' }])
    }

    const removeStep = (index: number) => {
        if (steps.length > 1) {
            setSteps(steps.filter((_, i) => i !== index))
        }
    }

    const updateStep = (index: number, value: string) => {
        const updated = [...steps]
        updated[index].instruction = value
        setSteps(updated)
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError(null)

        // Validation
        if (!title.trim()) {
            setError('Naslov je obavezan')
            setLoading(false)
            return
        }

        if (title.length > 100) {
            setError('Naslov ne može biti duži od 100 karaktera')
            setLoading(false)
            return
        }

        if (description.length > 1000) {
            setError('Opis ne može biti duži od 1000 karaktera')
            setLoading(false)
            return
        }

        if (!categoryId) {
            setError('Izaberite kategoriju')
            setLoading(false)
            return
        }

        // Time and servings validation
        if (prepTime && parseInt(prepTime) < 0) {
            setError('Vreme pripreme ne može biti negativno')
            setLoading(false)
            return
        }

        if (cookTime && parseInt(cookTime) < 0) {
            setError('Vreme kuvanja ne može biti negativno')
            setLoading(false)
            return
        }

        if (servings && parseInt(servings) < 1) {
            setError('Broj porcija mora biti bar 1')
            setLoading(false)
            return
        }

        // Filter out empty ingredients
        const validIngredients = ingredients.filter(ing => ing.name.trim())
        if (validIngredients.length === 0) {
            setError('Dodajte bar jedan sastojak')
            setLoading(false)
            return
        }

        // Filter out empty steps
        const validSteps = steps.filter(step => step.instruction.trim())
        if (validSteps.length === 0) {
            setError('Dodajte bar jedan korak pripreme')
            setLoading(false)
            return
        }

        const recipeData = {
            title,
            description,
            category_id: categoryId,
            prep_time: prepTime ? parseInt(prepTime) : 0,
            cook_time: cookTime ? parseInt(cookTime) : 0,
            servings: servings ? parseInt(servings) : 1,
            difficulty,
            is_public: isPublic,
            image_url: imageUrl,
            video_url: videoUrl ? videoUrl : null,
            is_posno: isPosno,
            ingredients: validIngredients,

            steps: validSteps,
            // Nutrition (optional)
            calories: calories ? parseInt(calories) : null,
            protein: protein ? parseFloat(protein) : null,
            carbohydrates: carbohydrates ? parseFloat(carbohydrates) : null,
            fat: fat ? parseFloat(fat) : null,
            fiber: fiber ? parseFloat(fiber) : null,
        }

        let result
        if (initialData) {
            result = await updateRecipe(initialData.id, recipeData)
        } else {
            result = await createRecipe(recipeData)
        }

        if (result?.error) {
            setError(result.error)
            setLoading(false)
        }
        // If successful, createRecipe will redirect
    }

    const handleAIApply = (aiRecipe: any) => {
        setTitle(aiRecipe.title || '')
        setDescription(aiRecipe.description || '')
        setPrepTime(aiRecipe.prep_time?.toString() || '')
        setCookTime(aiRecipe.cook_time?.toString() || '')
        setServings(aiRecipe.servings?.toString() || '')
        setDifficulty(aiRecipe.difficulty || 'srednje')
        setIsPosno(aiRecipe.is_posno || false)

        if (aiRecipe.ingredients) {
            setIngredients(aiRecipe.ingredients.map((i: any) => ({ name: i.name, quantity: i.quantity })))
        }

        if (aiRecipe.steps) {
            setSteps(aiRecipe.steps.map((s: any) => ({ instruction: s.instruction })))
        }

        if (aiRecipe.nutrition) {
            setCalories(aiRecipe.nutrition.calories?.toString() || '')
            setProtein(aiRecipe.nutrition.protein?.toString() || '')
            setCarbohydrates(aiRecipe.nutrition.carbohydrates?.toString() || '')
            setFat(aiRecipe.nutrition.fat?.toString() || '')
            setFiber(aiRecipe.nutrition.fiber?.toString() || '')
        }

        // Try to match category
        if (aiRecipe.category_suggestion) {
            const suggestion = aiRecipe.category_suggestion.toLowerCase()
            const mapping: { [key: string]: string } = {
                'glavno-jelo': 'Glavna jela',
                'desert': 'Deserti',
                'predjelo': 'Predjela',
                'salata': 'Salate',
                'supa': 'Supe i čorbe',
                'pice': 'Pića',
                'pecivo': 'Peciva',
                'ostalo': 'Ostalo'
            }

            const targetName = mapping[suggestion]
            const matchedCat = categories.find(c => c.name.includes(targetName) || targetName?.includes(c.name))
            if (matchedCat) {
                setCategoryId(matchedCat.id)
            }
        }
    }

    return (
        <div className="min-h-screen bg-transparent py-12">
            <div className="max-w-4xl mx-auto px-6">
                {/* Header */}
                <div className="mb-10 animate-fadeIn">
                    <Link
                        href={initialData ? `/recipes/${initialData.id}` : "/"}
                        className="px-6 py-2.5 bg-gradient-to-r from-primary to-primary-dark text-white rounded-full font-medium hover:shadow-lg hover:shadow-primary/25 transition-all inline-flex items-center gap-2 mb-6"
                    >
                        Nazad
                    </Link>
                    <h1 className="text-5xl font-bold mb-3 heading-font pb-2">
                        <span className="text-amber-gold pb-1">{initialData ? 'Izmeni' : 'Dodaj novi'}</span> <span className="text-primary">recept</span>
                    </h1>
                    <p className="text-slate-600 text-lg">
                        {initialData ? 'Ažuriraj svoj recept' : 'Podeli svoju kulinarsku magiju sa svetom ✨'}
                    </p>

                    {!initialData && (
                        <div className="mt-8">
                            <button
                                type="button"
                                onClick={() => setIsAIModalOpen(true)}
                                className="group relative flex items-center gap-3 px-8 py-4 bg-white border-2 border-primary/20 hover:border-primary text-primary rounded-2xl font-bold transition-all shadow-sm hover:shadow-xl hover:shadow-primary/10 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                                <FiZap className="w-6 h-6 animate-pulse" />
                                <div className="flex flex-col items-start translate-y-[1px]">
                                    <span className="text-sm leading-none opacity-60 font-medium mb-1">Nemaš vremena?</span>
                                    <span className="text-lg leading-none">✨ AI Generiši Recept</span>
                                </div>
                            </button>
                        </div>
                    )}
                </div>

                <AIRecipeModal
                    isOpen={isAIModalOpen}
                    onClose={() => setIsAIModalOpen(false)}
                    onApply={handleAIApply}
                />

                <form onSubmit={handleSubmit} className="space-y-8 animate-slideUp">
                    {/* Basic Info Section */}
                    <div className="glass-panel rounded-3xl p-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6 heading-font flex items-center gap-2">
                            <div className="bg-[#6B7E4F] p-2 rounded-full inline-flex items-center justify-center shadow-sm">
                                <UserRoundPenIcon className="w-5 h-5 text-white" strokeWidth="1.5" />
                            </div>
                            Osnovne informacije
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Naziv recepta *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    maxLength={100}
                                    className="w-full px-5 py-4 bg-white/50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-lg"
                                    placeholder="npr. Pečena piletina sa povrćem"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Opis
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    maxLength={1000}
                                    rows={3}
                                    className="w-full px-5 py-4 bg-white/50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                                    placeholder="Kratak opis recepta..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Kategorija *
                                </label>
                                <select
                                    required
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                    className="w-full px-5 py-4 bg-white/50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all appearance-none cursor-pointer"
                                >
                                    <option value="" className="bg-white text-slate-400">Izaberi kategoriju</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id} className="bg-white text-slate-900">
                                            {cat.icon} {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <ImageUpload onImageUploaded={setImageUrl} currentImageUrl={imageUrl} />

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Video Recept (YouTube / TikTok URL)
                                </label>
                                <input
                                    type="url"
                                    value={videoUrl}
                                    onChange={(e) => setVideoUrl(e.target.value)}
                                    className="w-full px-5 py-4 bg-white/50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-lg"
                                    placeholder="https://www.youtube.com/watch?v=... ili Instagram/TikTok link"
                                />
                                <p className="text-xs text-slate-500 mt-2">
                                    Nalepite link do videa. Podržani: YouTube, TikTok, Instagram, Vimeo.
                                </p>
                            </div>
                        </div>
                    </div>


                    {/* Details Section */}
                    <div className="glass-panel rounded-3xl p-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6 heading-font flex items-center gap-2">
                            <SettingsIcon className="w-6 h-6" /> Detalji
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Vreme pripreme (min)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={prepTime}
                                    onChange={(e) => setPrepTime(e.target.value)}
                                    className="w-full px-5 py-4 bg-white/50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                                    placeholder="30"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Vreme kuvanja (min)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={cookTime}
                                    onChange={(e) => setCookTime(e.target.value)}
                                    className="w-full px-5 py-4 bg-white/50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                                    placeholder="45"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Broj porcija
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={servings}
                                    onChange={(e) => setServings(e.target.value)}
                                    className="w-full px-5 py-4 bg-white/50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                                    placeholder="4"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Težina
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {(['lako', 'srednje', 'teško'] as const).map((diff) => (
                                        <button
                                            key={diff}
                                            type="button"
                                            onClick={() => setDifficulty(diff)}
                                            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${difficulty === diff
                                                ? 'border-primary bg-primary/5 shadow-md'
                                                : 'border-slate-100 bg-white/50 hover:border-primary/30'
                                                }`}
                                        >
                                            <DifficultyBadge difficulty={diff} showText={false} className="bg-transparent border-none p-0 scale-125 mb-1" />
                                            <span className={`text-sm font-bold uppercase tracking-wider ${difficulty === diff ? 'text-primary' : 'text-slate-500'}`}>
                                                {diff}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>



                        <div className="mt-6 flex flex-wrap gap-6">
                            <label className="flex items-center gap-3 text-slate-700 cursor-pointer group select-none">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        checked={isPublic}
                                        onChange={(e) => setIsPublic(e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </div>
                                <span className="font-medium group-hover:text-slate-900 transition-colors">Javno vidljiv recept</span>
                            </label>

                            <label className="flex items-center gap-3 text-slate-700 cursor-pointer group select-none">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        checked={isPosno}
                                        onChange={(e) => setIsPosno(e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </div>
                                <span className="font-medium group-hover:text-slate-900 transition-colors flex items-center gap-2">
                                    <span>🍃</span> Posno (Vegansko/Riba)
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* Ingredients Section */}
                    <div className="glass-panel rounded-3xl p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-slate-900 heading-font flex items-center gap-2">
                                <VegetableIcon className="w-6 h-6" /> Sastojci <span className="text-red-500">*</span>
                            </h2>
                            <button
                                type="button"
                                onClick={addIngredient}
                                className="px-5 py-2.5 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition border border-primary/20 text-sm font-bold flex items-center gap-2"
                            >
                                + Dodaj sastojak
                            </button>
                        </div>

                        <div className="space-y-3">
                            {ingredients.map((ing, index) => (
                                <div key={index} className="flex gap-3 animate-fadeIn">
                                    <input
                                        type="text"
                                        value={ing.name}
                                        onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                                        placeholder="Sastojak"
                                        className="flex-1 px-5 py-3 bg-white/50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                                    />
                                    <input
                                        type="text"
                                        value={ing.quantity}
                                        onChange={(e) => updateIngredient(index, 'quantity', e.target.value)}
                                        placeholder="Količina"
                                        className="w-32 md:w-48 px-5 py-3 bg-white/50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                                    />
                                    {ingredients.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeIngredient(index)}
                                            className="px-4 py-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition border border-red-500/20"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Steps Section */}
                    <div className="glass-panel rounded-3xl p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-slate-900 heading-font flex items-center gap-2">
                                <ForkKnifeIcon className="w-6 h-6" /> Koraci pripreme <span className="text-red-500">*</span>
                            </h2>
                            <button
                                type="button"
                                onClick={addStep}
                                className="px-5 py-2.5 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition border border-primary/20 text-sm font-bold flex items-center gap-2"
                            >
                                + Dodaj korak
                            </button>
                        </div>

                        <div className="space-y-4">
                            {steps.map((step, index) => (
                                <div key={index} className="flex gap-4 animate-fadeIn">
                                    <div className="flex items-center justify-center w-12 h-12 bg-white text-primary rounded-xl font-bold border border-slate-200 flex-shrink-0 text-lg shadow-inner">
                                        {index + 1}
                                    </div>
                                    <textarea
                                        value={step.instruction}
                                        onChange={(e) => updateStep(index, e.target.value)}
                                        placeholder={`Opiši ${index + 1}. korak pripreme...`}
                                        rows={2}
                                        className="flex-1 px-5 py-3 bg-white/50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                                    />
                                    {steps.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeStep(index)}
                                            className="px-4 py-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition border border-red-500/20 h-fit"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Nutrition Section (Optional) */}
                    <div className="glass-panel rounded-3xl p-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-2 heading-font flex items-center gap-2">
                            <NutritionIcon className="w-6 h-6" /> Nutritivne vrednosti
                        </h2>
                        <p className="text-sm text-slate-600 mb-6">Opciono - dodaj nutritivne vrednosti po porciji</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Kalorije
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={calories}
                                    onChange={(e) => setCalories(e.target.value)}
                                    className="w-full px-5 py-4 bg-white/50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                                    placeholder="350"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Proteini (g)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.1"
                                    value={protein}
                                    onChange={(e) => setProtein(e.target.value)}
                                    className="w-full px-5 py-4 bg-white/50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                                    placeholder="25.0"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Ugljeni hidrati (g)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.1"
                                    value={carbohydrates}
                                    onChange={(e) => setCarbohydrates(e.target.value)}
                                    className="w-full px-5 py-4 bg-white/50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                                    placeholder="45.0"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Masti (g)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.1"
                                    value={fat}
                                    onChange={(e) => setFat(e.target.value)}
                                    className="w-full px-5 py-4 bg-white/50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                                    placeholder="12.0"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Vlakna (g)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.1"
                                    value={fiber}
                                    onChange={(e) => setFiber(e.target.value)}
                                    className="w-full px-5 py-4 bg-white/50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                                    placeholder="5.0"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 animate-fadeIn flex items-center gap-3">
                            <span>⚠️</span> {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-5 bg-gradient-to-r from-primary to-primary-dark text-white font-bold text-xl rounded-2xl hover:from-primary-dark hover:to-primary-dark focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all shadow-xl shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1"
                        >
                            {loading ? 'Čuvanje...' : (initialData ? '💾 Sačuvaj izmene' : '✨ Objavi recept')}
                        </button>
                        <Link
                            href="/"
                            className="px-8 py-5 bg-white text-slate-600 rounded-2xl hover:bg-slate-50 hover:text-slate-900 transition border border-slate-200 text-center font-medium"
                        >
                            Otkaži
                        </Link>
                    </div>
                </form>
            </div >
        </div >
    )
}
