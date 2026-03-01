import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
            <h2 className="font-serif text-6xl md:text-8xl font-bold text-furniture-bronze mb-4">404</h2>
            <h3 className="font-serif text-2xl md:text-3xl font-semibold text-furniture-dark mb-6">
                Sayfa Bulunamadı
            </h3>
            <p className="text-muted-foreground max-w-md mb-8">
                Aradığınız sayfa silinmiş, adı değiştirilmiş veya geçici olarak kullanılamıyor olabilir.
            </p>
            <Link href="/">
                <Button size="lg">Ana Sayfaya Dön</Button>
            </Link>
        </div>
    )
}
