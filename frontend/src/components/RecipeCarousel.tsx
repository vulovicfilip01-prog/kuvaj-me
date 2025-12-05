'use client'

import { useRef } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import RecipeCard from './RecipeCard'

interface RecipeCarouselProps {
    recipes: any[]
}

export default function RecipeCarousel({ recipes }: RecipeCarouselProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const { current } = scrollContainerRef
            const scrollAmount = 350 // Approximate card width + gap
            if (direction === 'left') {
                current.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
            } else {
                current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
            }
        }
    }

    if (!recipes || recipes.length === 0) {
        return null
    }

    return (
        <div className="relative group">
            {/* Scroll Buttons */}
            <button
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 p-3 bg-white rounded-full shadow-lg text-slate-600 hover:text-primary hover:scale-110 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0"
                aria-label="Scroll left"
            >
                <FiChevronLeft className="w-6 h-6" />
            </button>
            <button
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 p-3 bg-white rounded-full shadow-lg text-slate-600 hover:text-primary hover:scale-110 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0"
                aria-label="Scroll right"
            >
                <FiChevronRight className="w-6 h-6" />
            </button>

            {/* Scroll Container */}
            <div
                ref={scrollContainerRef}
                className="flex gap-6 overflow-x-auto pb-8 pt-4 px-4 -mx-4 scrollbar-hide snap-x snap-mandatory"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {recipes.map((recipe) => (
                    <div key={recipe.id} className="min-w-[300px] md:min-w-[350px] snap-center h-full">
                        <RecipeCard recipe={recipe} />
                    </div>
                ))}
            </div>
        </div>
    )
}
