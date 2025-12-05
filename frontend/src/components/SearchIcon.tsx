export default function SearchIcon({ className = "w-10 h-10" }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Circle background */}
            <circle cx="20" cy="20" r="20" fill="#6B7E4F" />

            {/* Search icon */}
            <circle
                cx="17"
                cy="17"
                r="6"
                stroke="white"
                strokeWidth="2.5"
                fill="none"
            />
            <line
                x1="21.5"
                y1="21.5"
                x2="26"
                y2="26"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
            />
        </svg>
    );
}
