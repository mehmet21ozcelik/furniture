import { siteConfig } from './metadata'

export function generateOrganizationSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'FurnitureStore',
        name: siteConfig.name,
        url: siteConfig.url,
        logo: `${siteConfig.url}/logo.png`,
        description: siteConfig.description,
        address: {
            '@type': 'PostalAddress',
            addressLocality: 'Istanbul',
            addressCountry: 'TR',
        },
    }
}

export function generateProductSchema(product: {
    name: string
    description: string
    image: string
    price?: number | null
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description,
        image: product.image,
        ...(product.price && {
            offers: {
                '@type': 'Offer',
                price: product.price.toString(),
                priceCurrency: 'TRY',
                availability: 'https://schema.org/InStock',
            },
        }),
    }
}

export function generateBreadcrumbSchema(items: { name: string; item: string }[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: `${siteConfig.url}${item.item}`,
        })),
    }
}
