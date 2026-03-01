import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatPrice(price: number | null | undefined): string | null {
    if (price == null) return null;
    return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
    }).format(price);
}

export function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ç/g, 'c')
        .replace(/ğ/g, 'g')
        .replace(/ö/g, 'o')
        .replace(/ü/g, 'u')
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}
