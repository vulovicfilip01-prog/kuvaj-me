'use client';

import { PiChefHat } from 'react-icons/pi';

interface DifficultyBadgeProps {
    difficulty: string;
    showText?: boolean;
    className?: string;
}

export default function DifficultyBadge({ difficulty, showText = false, className = "" }: DifficultyBadgeProps) {
    const diff = (difficulty || 'lako').toLowerCase();

    const config = {
        lako: {
            count: 1,
            color: '#6B7E4F', // Olive Green (matches design)
            label: 'Lako',
            bg: 'bg-green-50',
            borderColor: 'border-green-100'
        },
        srednje: {
            count: 2,
            color: '#D97706', // Amber
            label: 'Srednje',
            bg: 'bg-amber-50',
            borderColor: 'border-amber-100'
        },
        teško: {
            count: 3,
            color: '#DC2626', // Red/Orange
            label: 'Teško',
            bg: 'bg-red-50',
            borderColor: 'border-red-100'
        }
    }[diff] || {
        count: 1,
        color: '#64748b',
        label: difficulty,
        bg: 'bg-slate-50',
        borderColor: 'border-slate-100'
    };

    return (
        <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full border ${config.bg} ${config.borderColor} ${className}`}>
            <div className="flex -space-x-1">
                {[...Array(3)].map((_, i) => (
                    <PiChefHat
                        key={i}
                        size={16}
                        style={{ color: i < config.count ? config.color : '#e2e8f0' }}
                        className="transition-colors duration-300"
                    />
                ))}
            </div>
            {showText && (
                <span
                    className="text-[11px] font-bold uppercase tracking-wider"
                    style={{ color: config.color }}
                >
                    {config.label}
                </span>
            )}
        </div>
    );
}
