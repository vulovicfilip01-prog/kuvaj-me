import { LuCookingPot } from 'react-icons/lu';

interface RecipePlaceholderProps {
    className?: string;
    iconSize?: string;
}

export default function RecipePlaceholder({ className = "h-full w-full", iconSize = "w-1/3 h-1/3" }: RecipePlaceholderProps) {
    return (
        <div className={`${className} bg-slate-800 flex flex-col items-center justify-center relative overflow-hidden group`}>
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary to-transparent" />
            </div>

            {/* Icon */}
            <div className={`${iconSize} text-primary/60 group-hover:text-primary transition-colors duration-500 transform group-hover:scale-110 group-hover:rotate-6`}>
                <LuCookingPot className="w-full h-full" />
            </div>

            {/* Optional Text */}
            <span className="mt-4 text-primary/40 font-medium text-sm uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Kuvaj.me
            </span>
        </div>
    );
}
