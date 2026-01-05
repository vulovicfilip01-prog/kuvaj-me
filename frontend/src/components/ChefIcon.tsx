interface ChefIconProps {
    className?: string;
}

export default function ChefIcon({ className = "w-6 h-6" }: ChefIconProps) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Chef Hat */}
            <path
                d="M4 18h16M4 18v2h16v-2M4 18c0-3 1-5 4-6M20 18c0-3-1-5-4-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M8 12c0-1.5 1-3 2-4 0-2 2-4 4-4s4 2 4 4c1 1 2 2.5 2 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
