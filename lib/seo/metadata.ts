import type { Metadata } from 'next'

export const siteConfig = {
    name: 'Mobilya Vitrin',
    description: 'Modern mobilya ürün kataloğu ve tanıtım sitesi.',
    url: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
    ogImage: '/images/og-image.jpg',
}

export function constructMetadata({
    title = siteConfig.name,
    description = siteConfig.description,
    image = siteConfig.ogImage,
    icons = '/favicon.ico',
    noIndex = false,
    canonicalUrl,
}: {
    title?: string
    description?: string
    image?: string
    icons?: string
    noIndex?: boolean
    canonicalUrl?: string
} = {}): Metadata {
    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: [{ url: image }],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [image],
            creator: '@mobilyavitrin',
        },
        icons,
        metadataBase: new URL(siteConfig.url),
        alternates: {
            canonical: canonicalUrl,
        },
        ...(noIndex && {
            robots: {
                index: false,
                follow: false,
            },
        }),
    }
}
