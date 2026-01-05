interface ClockIconProps {
    className?: string;
}

export default function ClockIcon({ className = "w-6 h-6" }: ClockIconProps) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <path
                d="M12 7V12L15 15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
