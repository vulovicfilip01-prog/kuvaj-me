'use client'

import { useEffect } from 'react'
import { registerServiceWorker } from '@/lib/sw-register'

export default function ServiceWorkerRegistration() {
    useEffect(() => {
        if (process.env.NODE_ENV === 'production') {
            registerServiceWorker()
        }
    }, [])

    return null
}
