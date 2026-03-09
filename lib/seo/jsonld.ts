import { siteConfig } from './metadata'

export function generateOrganizationSchema(settings?: any) {
    const name = settings?.companyName || siteConfig.name;
    const description = settings?.metaDescription || siteConfig.description;
    const address = settings?.address || 'Istanbul, TR';

    return {
        '@context': 'https://schema.org',
        '@type': 'FurnitureStore',
        name: name,
        url: siteConfig.url,
        logo: `${siteConfig.url}/logo.png`,
        description: description,
        address: {
            '@type': 'PostalAddress',
            streetAddress: address,
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
