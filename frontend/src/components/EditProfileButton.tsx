'use client'

import { useState } from 'react'
import EditProfileDialog from './EditProfileDialog'

export default function EditProfileButton({ profile }: { profile: any }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="px-6 py-2.5 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-all border border-primary/20 font-medium flex items-center gap-2"
            >
                ✏️ Izmeni profil
            </button>

            {isOpen && (
                <EditProfileDialog
                    profile={profile}
                    onClose={() => setIsOpen(false)}
                    onSuccess={() => {
                        // Refresh handled by server action revalidatePath
                        window.location.reload()
                    }}
                />
            )}
        </>
    )
}
