import { notFound } from 'next/navigation';
import Image from 'next/image';
import { prisma } from '@/lib/db';
import { formatPrice } from '@/lib/utils';
import { constructMetadata } from '@/lib/seo/metadata';
import { generateProductSchema, generateBreadcrumbSchema } from '@/lib/seo/jsonld';
import sanitizeHtml from 'sanitize-html';

export const revalidate = 3600;

export async function generateStaticParams() {
    try {
        const products = await prisma.product.findMany({
            select: { slug: true },
            where: { isActive: true },
        });
        return products.map((p) => ({ slug: p.slug }));
    } catch (e) {
        return [];
    }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const product = await prisma.product.findUnique({
        where: { slug: params.slug },
        include: { category: true },
    });

    if (!product) return {};

    return constructMetadata({
        title: product.metaTitle || `${product.name} | Mobilya Vitrin`,
        description: product.metaDescription || product.shortDescription || product.name,
        image: product.images[0],
        canonicalUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/products/${product.slug}`,
    });
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
    const product = await prisma.product.findUnique({
        where: { slug: params.slug },
        include: { category: true },
    });

    if (!product || !product.isActive) {
        notFound();
    }

    const jsonLd = generateProductSchema({
        name: product.name,
        description: product.shortDescription || product.name,
        image: product.images[0],
        price: product.price ? Number(product.price) : undefined,
    });

    const breadcrumb = generateBreadcrumbSchema([
        { name: 'Ana Sayfa', item: '' },
        { name: 'Ürünler', item: '/products' },
        { name: product.category.name, item: `/categories/${product.category.slug}` },
        { name: product.name, item: `/products/${product.slug}` },
    ]);

    const whatsappMessage = encodeURIComponent(`Merhaba, "${product.name}" ürünü hakkında bilgi almak istiyorum. (${process.env.NEXT_PUBLIC_BASE_URL}/products/${product.slug})`);
    const whatsappUrl = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP}?text=${whatsappMessage}`;

    return (
        <div className="container mx-auto px-4 py-12">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify([jsonLd, breadcrumb]) }}
            />

            {/* Breadcrumb Visual */}
            <nav className="text-sm font-medium mb-8 text-muted-foreground">
                <ol className="list-none p-0 inline-flex">
                    <li className="flex items-center">
                        <a href="/" className="hover:text-furniture-bronze">Ana Sayfa</a>
                        <span className="mx-2">/</span>
                    </li>
                    <li className="flex items-center">
                        <a href="/products" className="hover:text-furniture-bronze">Ürünler</a>
                        <span className="mx-2">/</span>
                    </li>
                    <li className="flex items-center">
                        <a href={`/categories/${product.category.slug}`} className="hover:text-furniture-bronze">
                            {product.category.name}
                        </a>
                        <span className="mx-2">/</span>
                    </li>
                    <li className="text-furniture-dark">{product.name}</li>
                </ol>
            </nav>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Gallery */}
                <div className="space-y-4">
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-gray-100">
                        <Image
                            src={product.images[0] || '/placeholder.jpg'}
                            alt={product.name}
                            fill
                            className="object-cover"
                            priority
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    </div>
                    {product.images.length > 1 && (
                        <div className="grid grid-cols-4 gap-4">
                            {product.images.slice(1).map((img, i) => (
                                <div key={i} className="relative aspect-square overflow-hidden rounded-md bg-gray-100">
                                    <Image src={img} alt="" fill className="object-cover" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex flex-col">
                    <h1 className="font-serif text-4xl font-bold text-furniture-dark mb-2">{product.name}</h1>
                    {product.price && (
                        <p className="text-2xl font-medium text-furniture-bronze mb-6">
                            {formatPrice(Number(product.price))}
                        </p>
                    )}

                    <div className="prose prose-sm sm:prose-base text-gray-600 mb-8" dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.description) }} />

                    <div className="mt-auto pt-6 border-t">
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex w-full items-center justify-center rounded-md bg-green-600 px-8 py-4 text-base font-semibold text-white hover:bg-green-700 transition-colors shadow-sm"
                        >
                            WhatsApp'tan Bilgi Al
                        </a>
                        <p className="text-sm text-center text-muted-foreground mt-4">
                            Ürün hakkında detaylı bilgi, stok durumu ve sipariş için bize ulaşın.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
