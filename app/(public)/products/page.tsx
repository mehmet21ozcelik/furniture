import { Metadata } from 'next';
import { prisma } from '@/lib/db';
import { ProductCard } from '@/components/ui/ProductCard';
import { constructMetadata } from '@/lib/seo/metadata';

export const revalidate = 300; // 5 minutes ISR

export const metadata: Metadata = constructMetadata({
    title: 'Tüm Ürünler | Mobilya Vitrin',
    description: 'Geniş ürün yelpazemizdeki tüm mobilya koleksiyonlarını keşfedin.',
});

export default async function ProductsPage({
    searchParams,
}: {
    searchParams: { page?: string };
}) {
    const page = Number(searchParams.page) || 1;
    const limit = 12;
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
        prisma.product.findMany({
            where: { isActive: true },
            include: {
                category: {
                    select: { name: true },
                },
            },
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
        }),
        prisma.product.count({ where: { isActive: true } }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="mb-10 text-center">
                <h1 className="font-serif text-4xl md:text-5xl font-bold text-furniture-dark">Tüm Ürünler</h1>
                <div className="w-16 h-1 bg-furniture-bronze mx-auto mt-4"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product as any} />
                ))}
            </div>

            {totalPages > 1 && (
                <div className="mt-16 flex justify-center space-x-2">
                    {Array.from({ length: totalPages }).map((_, i) => (
                        <a
                            key={i}
                            href={`/products?page=${i + 1}`}
                            className={`px-4 py-2 rounded-md ${page === i + 1
                                    ? 'bg-furniture-bronze text-white'
                                    : 'bg-muted text-furniture-dark hover:bg-gray-200'
                                }`}
                        >
                            {i + 1}
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}
