'use client';

// Preview različitih heart ikonica
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'; // Ant Design
import { FaHeart, FaRegHeart } from 'react-icons/fa'; // Font Awesome
import { FiHeart } from 'react-icons/fi'; // Feather
import { IoHeartOutline, IoHeart } from 'react-icons/io5'; // Ionicons
import { BsHeart, BsHeartFill } from 'react-icons/bs'; // Bootstrap
import { HiOutlineHeart, HiHeart } from 'react-icons/hi'; // Heroicons
import { RiHeart3Line, RiHeart3Fill } from 'react-icons/ri'; // Remix
import { MdFavoriteBorder, MdFavorite } from 'react-icons/md'; // Material
import { PiHeartLight, PiHeartFill, PiHeartStraightLight, PiHeartStraightFill } from 'react-icons/pi'; // Phosphor

export default function HeartIconPreview() {
    const icons = [
        { name: 'Ant Design', OutlineIcon: AiOutlineHeart, FillIcon: AiFillHeart, set: 'Ant Design' },
        { name: 'Font Awesome', OutlineIcon: FaRegHeart, FillIcon: FaHeart, set: 'Font Awesome' },
        { name: 'Feather', OutlineIcon: FiHeart, FillIcon: FiHeart, set: 'Feather' },
        { name: 'Ionicons', OutlineIcon: IoHeartOutline, FillIcon: IoHeart, set: 'Ionicons' },
        { name: 'Bootstrap', OutlineIcon: BsHeart, FillIcon: BsHeartFill, set: 'Bootstrap' },
        { name: 'Heroicons', OutlineIcon: HiOutlineHeart, FillIcon: HiHeart, set: 'Heroicons' },
        { name: 'Remix', OutlineIcon: RiHeart3Line, FillIcon: RiHeart3Fill, set: 'Remix' },
        { name: 'Material', OutlineIcon: MdFavoriteBorder, FillIcon: MdFavorite, set: 'Material' },
        { name: 'Phosphor', OutlineIcon: PiHeartLight, FillIcon: PiHeartFill, set: 'Phosphor' },
        { name: 'Phosphor Straight', OutlineIcon: PiHeartStraightLight, FillIcon: PiHeartStraightFill, set: 'Phosphor' },
    ];

    return (
        <div className="min-h-screen bg-transparent p-8">
            <div className="container mx-auto">
                <h1 className="text-4xl font-bold mb-8 text-center heading-font">Heart Icons Preview</h1>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {icons.map(({ name, OutlineIcon, FillIcon, set }) => (
                        <div key={name} className="glass-panel rounded-2xl p-6 flex flex-col items-center gap-4 hover:shadow-lg transition-shadow">
                            <div className="flex gap-4">
                                <div className="bg-slate-100 rounded-full p-4">
                                    <OutlineIcon className="w-12 h-12 text-slate-600" />
                                </div>
                                <div className="bg-red-50 rounded-full p-4">
                                    <FillIcon className="w-12 h-12 text-red-500" />
                                </div>
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-semibold text-slate-700">{set}</p>
                                <p className="text-xs text-slate-500 mt-1">{name}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 glass-panel rounded-2xl p-8">
                    <h2 className="text-2xl font-bold mb-6 heading-font">Preview na dugmetu (Favoriti):</h2>
                    <div className="flex flex-wrap gap-4">
                        {icons.slice(0, 8).map(({ name, OutlineIcon, FillIcon }) => (
                            <div key={name} className="flex items-center gap-4">
                                {/* Outline version (not favorite) */}
                                <button
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm border border-slate-200 hover:bg-white hover:scale-110 active:scale-95 transition-all duration-200 shadow-md group"
                                    aria-label="Not favorite"
                                >
                                    <OutlineIcon className="w-5 h-5 text-slate-400 group-hover:text-red-400 transition-colors" />
                                </button>
                                {/* Filled version (favorite) */}
                                <button
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm border border-slate-200 hover:bg-white hover:scale-110 active:scale-95 transition-all duration-200 shadow-md"
                                    aria-label="Favorite"
                                >
                                    <FillIcon className="w-5 h-5 text-red-500" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
