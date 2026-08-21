'use client'

import React from 'react';
import { Badge } from '@/utils/badges';

interface UserBadgesProps {
    badges: Badge[];
    className?: string;
}

export default function UserBadges({ badges, className = '' }: UserBadgesProps) {
    if (!badges || badges.length === 0) return null;

    return (
        <div className={`flex flex-wrap gap-2 ${className}`}>
            {badges.map((badge) => (
                <div
                    key={badge.id}
                    className={`relative group flex items-center gap-1.5 px-3 py-1.5 rounded-full border shadow-sm cursor-help transition-transform hover:scale-105 ${badge.color}`}
                    title={badge.description}
                >
                    <span className="text-base leading-none">{badge.icon}</span>
                    <span className="text-xs font-bold leading-none">{badge.name}</span>

                    {/* Custom Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs px-3 py-2 bg-slate-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-xl">
                        {badge.description}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                    </div>
                </div>
            ))}
        </div>
    );
}
