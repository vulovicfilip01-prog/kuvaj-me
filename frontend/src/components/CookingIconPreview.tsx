'use client';

// Preview različitih cooking ikonica
import { LuCookingPot } from 'react-icons/lu'; // Lucide
import { PiCookingPot } from 'react-icons/pi'; // Phosphor
import { TbToolsKitchen2, TbChefHat } from 'react-icons/tb'; // Tabler
import { GiCookingPot, GiHotMeal, GiFruitBowl, GiFoodChain } from 'react-icons/gi'; // Game Icons
import { MdOutlineRestaurantMenu, MdRestaurant } from 'react-icons/md'; // Material Design
import { IoRestaurantOutline } from 'react-icons/io5'; // Ionicons
import { BiDish } from 'react-icons/bi'; // BoxIcons

export default function CookingIconPreview() {
    const icons = [
        { name: 'Lucide Cooking Pot', Icon: LuCookingPot, set: 'Lucide' },
        { name: 'Phosphor Cooking Pot', Icon: PiCookingPot, set: 'Phosphor' },
        { name: 'Tabler Kitchen', Icon: TbToolsKitchen2, set: 'Tabler' },
        { name: 'Game Icons Cooking Pot', Icon: GiCookingPot, set: 'Game Icons' },
        { name: 'Game Icons Hot Meal', Icon: GiHotMeal, set: 'Game Icons' },
        { name: 'Game Icons Fruit Bowl', Icon: GiFruitBowl, set: 'Game Icons' },
        { name: 'Game Icons Food Chain', Icon: GiFoodChain, set: 'Game Icons' },
        { name: 'Material Restaurant Menu', Icon: MdOutlineRestaurantMenu, set: 'Material' },
        { name: 'Material Restaurant', Icon: MdRestaurant, set: 'Material' },
        { name: 'Ionicons Restaurant', Icon: IoRestaurantOutline, set: 'Ionicons' },
        { name: 'BoxIcons Dish', Icon: BiDish, set: 'BoxIcons' },
    ];

    return (
        <div className="min-h-screen bg-transparent p-8">
            <div className="container mx-auto">
                <h1 className="text-4xl font-bold mb-8 text-center heading-font">Cooking Icons Preview</h1>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {icons.map(({ name, Icon, set }) => (
                        <div key={name} className="glass-panel rounded-2xl p-6 flex flex-col items-center gap-4 hover:shadow-lg transition-shadow">
                            <div className="bg-primary/10 rounded-full p-4">
                                <Icon className="w-12 h-12 text-primary" />
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-semibold text-slate-700">{set}</p>
                                <p className="text-xs text-slate-500 mt-1">{name}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 glass-panel rounded-2xl p-8">
                    <h2 className="text-2xl font-bold mb-6 heading-font">Preview na dugmetu:</h2>
                    <div className="flex flex-wrap gap-4">
                        {icons.slice(0, 6).map(({ name, Icon }) => (
                            <button
                                key={name}
                                className="px-8 py-4 bg-gradient-to-r from-primary to-primary-dark text-white rounded-full font-bold text-lg hover:shadow-lg hover:shadow-primary/25 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                            >
                                <Icon className="w-5 h-5" /> Šta da kuvam?
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
