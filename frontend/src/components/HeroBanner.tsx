'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const heroImages = [
    '/hero_food_1.png',
    '/hero_food_2.png',
    '/hero_food_3.png',
];

export default function HeroBanner() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % heroImages.length);
        }, 5000); // Change image every 5 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden rounded-3xl">
            {/* Image Carousel */}
            {heroImages.map((image, index) => (
                <div
                    key={image}
                    className={`absolute inset-0 transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    <Image
                        src={image}
                        alt={`Hero food image ${index + 1}`}
                        fill
                        className="object-cover"
                        priority={index === 0}
                    />
                </div>
            ))}

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/70 via-slate-900/40 to-transparent" />

            {/* Content */}
            <div className="relative h-full flex flex-col justify-center px-8 md:px-16 max-w-2xl">
                <span className="inline-block px-4 py-2 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30 text-white text-sm font-medium mb-6 w-fit animate-slideUp">
                    ✨ Najbolji recepti na Balkanu
                </span>

                <h1 className="text-5xl md:text-7xl font-bold mb-6 heading-font leading-tight text-white animate-slideUp" style={{ animationDelay: '0.1s' }}>
                    Tvoja digitalna <br />
                    <span className="text-primary-light">knjiga recepata</span>
                </h1>

                <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed animate-slideUp" style={{ animationDelay: '0.2s' }}>
                    Otkrij, kreiraj i podeli najukusnije recepte sa zajednicom ljubitelja hrane.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 animate-slideUp" style={{ animationDelay: '0.3s' }}>
                    <Link
                        href="/search"
                        className="px-8 py-4 bg-gradient-to-r from-primary to-primary-dark text-white rounded-full font-bold text-lg hover:shadow-lg hover:shadow-primary/25 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                    >
                        🔍 Šta da kuvam?
                    </Link>
                </div>
            </div>

            {/* Carousel Indicators */}
            <div className="absolute bottom-6 right-6 flex gap-2">
                {heroImages.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${index === currentIndex
                                ? 'bg-white w-8'
                                : 'bg-white/50 hover:bg-white/75'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
