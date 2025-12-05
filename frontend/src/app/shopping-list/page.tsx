import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import ShoppingList from '@/components/ShoppingList'
import { getShoppingList } from './actions'
import Navbar from '@/components/Navbar'

export default async function ShoppingListPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const items = await getShoppingList()

    return (
        <main className="min-h-screen bg-transparent">
            <Navbar />
            <div className="py-12 px-6">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12 animate-fadeIn">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 heading-font text-gradient">
                            Lista za kupovinu
                        </h1>
                        <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                            Organizujte svoju kupovinu i nikada ne zaboravite sastojke za vaša omiljena jela.
                        </p>
                    </div>

                    <ShoppingList initialItems={items} />
                </div>
            </div>
        </main>
    )
}
