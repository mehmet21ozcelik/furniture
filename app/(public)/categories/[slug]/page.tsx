import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { ProductCard } from '@/components/ui/ProductCard';
import { constructMetadata } from '@/lib/seo/metadata';

export const revalidate = 300;

export async function generateStaticParams() {
    try {
        const categories = await prisma.category.findMany({ select: { slug: true } });
        return categories.map((c) => ({ slug: c.slug }));
    } catch (e) {
        return [];
    }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const category = await prisma.category.findUnique({
        where: { slug: params.slug },
    });

    if (!category) return {};

    return constructMetadata({
        title: `${category.name} | Mobilya Vitrin`,
        description: category.description || `${category.name} kategorisindeki ürünler`,
        image: category.image || undefined,
    });
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
    const category = await prisma.category.findUnique({
        where: { slug: params.slug },
        include: {
            products: {
                where: { isActive: true },
                orderBy: { createdAt: 'desc' },
                include: {
                    category: { select: { name: true } },
                }
            },
        },
    });

    if (!category) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="mb-12 text-center">
                <h1 className="font-serif text-4xl md:text-5xl font-bold text-furniture-dark">{category.name}</h1>
                {category.description && (
                    <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">{category.description}</p>
                )}
                <div className="w-16 h-1 bg-furniture-bronze mx-auto mt-6"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                {category.products.length > 0 ? (
                    category.products.map((product) => (
                        <ProductCard key={product.id} product={product as any} />
                    ))
                ) : (
                    <p className="col-span-full text-center py-12 text-muted-foreground">Bu kategoride henüz ürün bulunmamaktadır.</p>
                )}
            </div>
        </div>
    );
}
