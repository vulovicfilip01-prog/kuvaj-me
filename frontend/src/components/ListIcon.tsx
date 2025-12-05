import { PiShoppingCart } from 'react-icons/pi';

export default function ListIcon({ className = "w-10 h-10" }: { className?: string }) {
    return (
        <div className={`${className} bg-[#6B7E4F] rounded-full flex items-center justify-center shadow-md`}>
            <PiShoppingCart className="text-white w-[60%] h-[60%]" />
        </div>
    );
}
