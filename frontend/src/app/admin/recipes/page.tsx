import { getRecipesForAdmin } from "../actions";
import { FiTrash2, FiExternalLink, FiSearch } from "react-icons/fi";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import AdminDeleteRecipeButton from "@/components/AdminDeleteRecipeButton";

export default async function AdminRecipesPage() {
    const { success, recipes } = await getRecipesForAdmin();

    if (!success || !recipes) {
        return <div className="p-8 text-red-500">Greška pri učitavanju recepata.</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Upravljanje Receptima</h1>
                    <p className="text-slate-500">Ukupno {recipes.length} recepata</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="p-4 font-semibold text-slate-600">Recept</th>
                                <th className="p-4 font-semibold text-slate-600">Autor</th>
                                <th className="p-4 font-semibold text-slate-600">Datum</th>
                                <th className="p-4 font-semibold text-slate-600 text-right">Akcije</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {recipes.map((recipe: any) => (
                                <tr key={recipe.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4 font-medium text-slate-800">{recipe.title}</td>
                                    <td className="p-4 text-slate-600">
                                        {recipe.profiles?.display_name || 'Nepoznat'}
                                    </td>
                                    <td className="p-4 text-slate-500">
                                        {new Date(recipe.created_at).toLocaleDateString('sr-RS')}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link
                                                href={`/recipes/${recipe.id}`}
                                                target="_blank"
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Pogledaj"
                                            >
                                                <FiExternalLink />
                                            </Link>

                                            <AdminDeleteRecipeButton recipeId={recipe.id} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
