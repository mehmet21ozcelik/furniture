'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/Button'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
            <h2 className="font-serif text-4xl font-bold text-red-600 mb-4">Bir Hata Oluştu</h2>
            <p className="text-muted-foreground max-w-md mb-8">
                Beklenmeyen bir hata meydana geldi. Sorunu çözmek için çalışıyoruz.
            </p>
            <Button onClick={() => reset()} variant="outline">Tekrar Dene</Button>
        </div>
    )
}
