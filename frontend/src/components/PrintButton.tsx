import Link from "next/link";
import { FiPrinter } from "react-icons/fi";

export default function PrintButton({ recipeId }: { recipeId: string }) {
    return (
        <Link
            href={`/recipes/${recipeId}/print`}
            target="_blank"
            className="p-3 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800 transition-colors"
            title="Štampaj recept"
        >
            <FiPrinter className="w-5 h-5" />
        </Link>
    );
}
