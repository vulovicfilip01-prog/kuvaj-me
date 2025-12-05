import { GiForkKnifeSpoon } from 'react-icons/gi';

export default function ForkKnifeIcon({ className = "w-10 h-10" }: { className?: string }) {
    return (
        <div className={`${className} bg-[#6B7E4F] rounded-full flex items-center justify-center shadow-md`}>
            <GiForkKnifeSpoon className="text-white w-[60%] h-[60%]" />
        </div>
    );
}
