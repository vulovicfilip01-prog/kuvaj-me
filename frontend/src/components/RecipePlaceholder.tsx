import { LuCookingPot } from 'react-icons/lu';

interface RecipePlaceholderProps {
    className?: string;
    iconSize?: string;
}

export default function RecipePlaceholder({ className = "h-full w-full", iconSize = "w-1/3 h-1/3" }: RecipePlaceholderProps) {
    return (
        <div className={`${className} bg-[#E8DCC4] flex flex-col items-center justify-center relative overflow-hidden`}>
            {/* Icon */}
            <div className={`${iconSize} text-[#6B7E4F] transition-all duration-500 transform group-hover:scale-105 z-10`}>
                <LuCookingPot className="w-full h-full" />
            </div>

            {/* Optional Text */}
            <span className="mt-4 text-[#6B7E4F]/60 font-bold text-[10px] uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
                Krckaj.me
            </span>
        </div>
    );
}
