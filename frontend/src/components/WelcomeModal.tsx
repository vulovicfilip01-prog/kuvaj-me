'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { FiX, FiChevronRight, FiCheck } from 'react-icons/fi'

const STEPS = [
    {
        title: "Dobrodošli na Krckaj.me! 🍳",
        description: "Vaša nova digitalna knjiga recepata. Otkrijte, sačuvajte i podelite omiljene recepte sa svetom.",
        icon: "👋"
    },
    {
        title: "Pronađite inspiraciju 🔍",
        description: "Pretražite recepte po sastojcima koje već imate u frižideru ili istražite najnovije trendove.",
        icon: "🥦"
    },
    {
        title: "Kreirajte kolekcije 📚",
        description: "Organizujte recepte u personalizovane kolekcije - 'Ručak za posao', 'Slava', 'Brzi doručak'...",
        icon: "bookmark"
    },
    {
        title: "Spremni za kuvanje? 👨‍🍳",
        description: "Pridružite se našoj zajednici i započnite svoju kulinarsku avanturu danas!",
        icon: "rocket"
    }
]

export default function WelcomeModal() {
    const [isOpen, setIsOpen] = useState(false)
    const [currentStep, setCurrentStep] = useState(0)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        const hasSeenOnboarding = localStorage.getItem('has_seen_onboarding')
        if (!hasSeenOnboarding) {
            // Small delay for better UX
            const timer = setTimeout(() => setIsOpen(true), 1000)
            return () => clearTimeout(timer)
        }
    }, [])

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(prev => prev + 1)
        } else {
            handleClose()
        }
    }

    const handleClose = () => {
        setIsOpen(false)
        localStorage.setItem('has_seen_onboarding', 'true')
    }

    if (!mounted || !isOpen) return null

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative animate-slideUp">
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 transition-colors z-10"
                >
                    <FiX className="w-6 h-6" />
                </button>

                {/* Progress Bar */}
                <div className="h-1 bg-slate-100 w-full">
                    <div
                        className="h-full bg-primary transition-all duration-300 ease-out"
                        style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
                    />
                </div>

                <div className="p-8 text-center">
                    <div className="text-6xl mb-6 animate-bounce-slow">
                        {STEPS[currentStep].icon === 'bookmark' ? '📚' :
                            STEPS[currentStep].icon === 'rocket' ? '🚀' :
                                STEPS[currentStep].icon}
                    </div>

                    <h2 className="text-2xl font-bold text-slate-900 mb-4 heading-font">
                        {STEPS[currentStep].title}
                    </h2>

                    <p className="text-slate-600 mb-8 text-lg leading-relaxed">
                        {STEPS[currentStep].description}
                    </p>

                    <button
                        onClick={handleNext}
                        className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group"
                    >
                        {currentStep === STEPS.length - 1 ? (
                            <>Započni <FiCheck className="w-5 h-5" /></>
                        ) : (
                            <>Dalje <FiChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                        )}
                    </button>

                    {/* Dots Indicator */}
                    <div className="flex justify-center gap-2 mt-6">
                        {STEPS.map((_, idx) => (
                            <div
                                key={idx}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentStep ? 'bg-primary w-6' : 'bg-slate-200'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>,
        document.body
    )
}
