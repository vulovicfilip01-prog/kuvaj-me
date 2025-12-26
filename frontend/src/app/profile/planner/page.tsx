import { getMyMealPlan, removeFromMealPlan } from "@/app/planner/actions";
import { FiCalendar, FiTrash2, FiClock, FiChevronLeft, FiChevronRight, FiPlus, FiGrid } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";

// Helper to get dates for a specific week
function getWeekDays(offset = 0) {
    const today = new Date();
    const current = new Date(today);

    // Adjust to start of current week (Monday)
    const day = current.getDay();
    const diff = current.getDate() - day + (day === 0 ? -6 : 1);
    current.setDate(diff + (offset * 7));

    const week = [];
    for (let i = 0; i < 7; i++) {
        week.push(new Date(current));
        current.setDate(current.getDate() + 1);
    }
    return week;
}

export default async function PlannerPage({ searchParams }: { searchParams: Promise<{ week?: string }> }) {
    const { week } = await searchParams;
    const weekOffset = parseInt(week || '0', 10);
    const today = new Date();
    const weekDays = getWeekDays(weekOffset);

    // Formatting for DB query (YYYY-MM-DD)
    const startDate = weekDays[0].toISOString().split('T')[0];
    const endDate = weekDays[6].toISOString().split('T')[0];

    const { success, plans } = await getMyMealPlan(startDate, endDate);

    if (!success || !plans) {
        return (
            <div className="min-h-screen bg-slate-50">
                <Navbar />
                <div className="container mx-auto p-8 text-center">
                    <div className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 inline-block">
                        Greška pri učitavanju planera. Molimo pokušajte ponovo.
                    </div>
                </div>
            </div>
        );
    }

    const mealCategories = ['breakfast', 'lunch', 'dinner', 'snack'] as const;
    const categoryLabels: Record<string, string> = {
        'breakfast': 'Doručak',
        'lunch': 'Ručak',
        'dinner': 'Večera',
        'snack': 'Užina'
    };

    const formatDateRange = () => {
        const start = weekDays[0];
        const end = weekDays[6];
        if (start.getMonth() === end.getMonth()) {
            return `${start.getDate()}. - ${end.getDate()}. ${start.toLocaleDateString('sr-RS', { month: 'long' })}`;
        }
        return `${start.getDate()}. ${start.toLocaleDateString('sr-RS', { month: 'short' })} - ${end.getDate()}. ${end.toLocaleDateString('sr-RS', { month: 'short' })}`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50/50 via-white to-amber-50/50">
            <Navbar />

            <div className="container mx-auto py-8 px-4">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6 animate-fadeIn">
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl font-bold text-slate-900 heading-font mb-2">Nedeljni Planer</h1>
                        <p className="text-slate-500 font-medium flex items-center justify-center md:justify-start gap-2">
                            <FiCalendar className="text-primary" />
                            {formatDateRange()}
                        </p>
                    </div>

                    <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100">
                        <Link
                            href={`/profile/planner?week=${weekOffset - 1}`}
                            className="p-3 hover:bg-slate-50 rounded-xl text-slate-600 transition-colors"
                            title="Prethodna nedelja"
                        >
                            <FiChevronLeft className="w-6 h-6" />
                        </Link>

                        <Link
                            href="/profile/planner"
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${weekOffset === 0 ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                            Trenutna
                        </Link>

                        <Link
                            href={`/profile/planner?week=${weekOffset + 1}`}
                            className="p-3 hover:bg-slate-50 rounded-xl text-slate-600 transition-colors"
                            title="Sledeća nedelja"
                        >
                            <FiChevronRight className="w-6 h-6" />
                        </Link>
                    </div>
                </div>

                {/* Grid - Desktop */}
                <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
                    {weekDays.map((day) => {
                        const dateStr = day.toISOString().split('T')[0];
                        const dayPlans = plans.filter((p: any) => p.date === dateStr);
                        const isToday = day.toDateString() === today.toDateString();

                        return (
                            <div key={dateStr} className={`flex flex-col gap-4 animate-slideUp`}>
                                {/* Day Header */}
                                <div className={`text-center p-3 rounded-2xl transition-all ${isToday ? 'bg-primary text-white shadow-lg shadow-primary/20 ring-4 ring-primary/10' : 'bg-white border border-slate-100 text-slate-800 shadow-sm'}`}>
                                    <div className="font-bold text-lg uppercase tracking-tight">{day.toLocaleDateString('sr-RS', { weekday: 'short' })}</div>
                                    <div className={`text-sm ${isToday ? 'text-white/90' : 'text-slate-400 font-medium'}`}>{day.getDate()}. {day.toLocaleDateString('sr-RS', { month: 'short' })}</div>
                                </div>

                                {/* Meal Slots */}
                                <div className="space-y-4 flex-grow">
                                    {mealCategories.map((type) => {
                                        const meal = dayPlans.find((p: any) => p.meal_type === type);
                                        const recipeData = meal?.recipe;
                                        const recipe = Array.isArray(recipeData) ? recipeData[0] : recipeData;

                                        return (
                                            <div
                                                key={type}
                                                className={`min-h-[120px] rounded-2xl border p-3 flex flex-col transition-all relative group overflow-hidden ${meal ? 'bg-white border-primary/10 shadow-sm hover:shadow-md' : 'bg-slate-50/50 border-slate-100 hover:border-primary/30 hover:bg-white dashed-border'
                                                    }`}
                                            >
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${meal ? 'bg-primary/10 text-primary' : 'bg-slate-200 text-slate-500'
                                                        }`}>
                                                        {categoryLabels[type]}
                                                    </span>

                                                    {meal && (
                                                        <form action={async () => {
                                                            'use server';
                                                            await removeFromMealPlan(meal.id);
                                                        }}>
                                                            <button className="text-slate-300 hover:text-red-500 transition-colors p-1 text-xs">
                                                                <FiTrash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </form>
                                                    )}
                                                </div>

                                                {meal && recipe ? (
                                                    <div className="flex flex-col h-full">
                                                        <Link href={`/recipes/${recipe.id}`} className="hover:opacity-80 transition-opacity flex-grow">
                                                            {recipe.image_url && (
                                                                <div className="relative w-full h-16 rounded-lg overflow-hidden mb-2">
                                                                    <Image
                                                                        src={recipe.image_url}
                                                                        alt={recipe.title || 'Recept'}
                                                                        fill
                                                                        className="object-cover"
                                                                        sizes="(max-width: 768px) 100vw, 15vw"
                                                                    />
                                                                </div>
                                                            )}
                                                            <h4 className="font-bold text-slate-800 text-xs leading-tight line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                                                                {recipe.title}
                                                            </h4>
                                                        </Link>
                                                        <div className="mt-auto pt-2 flex items-center gap-1.5 text-[9px] text-slate-400 font-medium">
                                                            <FiClock className="w-3 h-3 text-primary/60" />
                                                            <span>Pregledaj recept</span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <Link
                                                        href="/"
                                                        className="flex-grow flex flex-col items-center justify-center gap-2 opacity-50 group-hover:opacity-100 transition-all text-slate-400 hover:text-primary"
                                                    >
                                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                                                            <FiPlus className="w-4 h-4" />
                                                        </div>
                                                        <span className="text-[10px] font-bold">DODAJ</span>
                                                    </Link>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom Sugestije/Empty State */}
                {plans.length === 0 && (
                    <div className="mt-12 bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm animate-fadeIn">
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FiGrid className="w-10 h-10 text-primary" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-3">Vaš plan je prazan</h3>
                        <p className="text-slate-500 mb-8 max-w-md mx-auto">
                            Započnite planiranje obroka tako što ćete dodati recepte direktno sa stranice bilo kog recepta.
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-full font-bold hover:bg-primary-dark transition-all transform hover:-translate-y-1 shadow-lg shadow-primary/20"
                        >
                            Pronađi recept
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
