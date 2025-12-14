import { getMyMealPlan, removeFromMealPlan } from "@/app/planner/actions";
import { FiCalendar, FiTrash2, FiClock, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";

// Helper to get dates for the current week (or selected week)
function getWeekDays(startDate: Date = new Date()) {
    const current = new Date(startDate);
    const week = [];
    // Adjust to start on Monday
    const day = current.getDay();
    const diff = current.getDate() - day + (day === 0 ? -6 : 1);
    current.setDate(diff);

    for (let i = 0; i < 7; i++) {
        week.push(new Date(current));
        current.setDate(current.getDate() + 1);
    }
    return week;
}

export default async function PlannerPage({ searchParams }: { searchParams: { week?: string } }) {
    // Basic date handling logic
    const today = new Date();
    // Use searchParams for navigation later (TODO)
    const weekDays = getWeekDays(today);
    const startDate = weekDays[0].toISOString().split('T')[0];
    const endDate = weekDays[6].toISOString().split('T')[0];

    const { success, plans } = await getMyMealPlan(startDate, endDate);

    if (!success || !plans) {
        return <div className="p-8 text-red-500">Greška pri učitavanju planera.</div>;
    }

    const mealCategories = ['breakfast', 'lunch', 'dinner', 'snack'];
    const categoryLabels: Record<string, string> = {
        'breakfast': 'Doručak',
        'lunch': 'Ručak',
        'dinner': 'Večera',
        'snack': 'Užina'
    };

    return (
        <div className="max-w-5xl mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Nedeljni Planer</h1>
                    <p className="text-slate-500">
                        {weekDays[0].toLocaleDateString('sr-RS')} - {weekDays[6].toLocaleDateString('sr-RS')}
                    </p>
                </div>
                {/* Navigation placeholder */}
                <div className="flex gap-2">
                    <button disabled className="p-2 border border-slate-200 rounded-lg text-slate-400 cursor-not-allowed">
                        <FiChevronLeft />
                    </button>
                    <button disabled className="p-2 border border-slate-200 rounded-lg text-slate-400 cursor-not-allowed">
                        <FiChevronRight />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                {weekDays.map((day) => {
                    const dateStr = day.toISOString().split('T')[0];
                    const dayPlans = plans.filter((p: any) => p.date === dateStr);
                    const isToday = day.getDate() === today.getDate() && day.getMonth() === today.getMonth();

                    return (
                        <div key={dateStr} className={`flex flex-col gap-3 min-h-[400px] ${isToday ? 'bg-orange-50/50' : ''} rounded-xl p-2`}>
                            <div className={`text-center p-2 rounded-lg ${isToday ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600'}`}>
                                <div className="font-bold">{day.toLocaleDateString('sr-RS', { weekday: 'short' })}</div>
                                <div className="text-sm">{day.getDate()}.</div>
                            </div>

                            <div className="flex-1 space-y-3">
                                {mealCategories.map((type) => {
                                    const meal = dayPlans.find((p: any) => p.meal_type === type);
                                    const recipe = meal ? (Array.isArray(meal.recipe) ? meal.recipe[0] : meal.recipe) : null;

                                    return (
                                        <div key={type} className="min-h-[80px] border border-slate-100 rounded-lg p-2 bg-white relative group">
                                            <div className="text-xs text-slate-400 font-medium mb-1 uppercase tracking-wider">
                                                {categoryLabels[type]}
                                            </div>

                                            {meal && recipe ? (
                                                <div className="relative">
                                                    <Link href={`/recipes/${recipe.id}`} className="block group-hover:opacity-90 transition-opacity">
                                                        <div className="font-medium text-slate-800 text-sm line-clamp-2">
                                                            {recipe.title}
                                                        </div>
                                                    </Link>
                                                    <form action={async () => {
                                                        'use server';
                                                        await removeFromMealPlan(meal.id);
                                                    }} className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button className="bg-white text-red-500 p-1 rounded-full shadow-sm hover:bg-red-50 border border-slate-100">
                                                            <FiTrash2 className="w-3 h-3" />
                                                        </button>
                                                    </form>
                                                </div>
                                            ) : (
                                                <Link href="/" className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <FiPlus className="text-slate-300 w-5 h-5 hover:text-primary transition-colors" />
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
        </div>
    );
}

function FiPlus({ className }: { className?: string }) {
    return <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className={className} xmlns="http://www.w3.org/2000/svg"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
}
