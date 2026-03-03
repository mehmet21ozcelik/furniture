import { prisma } from '../db';
import { slugify } from '../utils';

export async function getFeaturedProducts() {
    try {
        return await prisma.product.findMany({
            where: {
                isFeatured: true,
                isActive: true,
            },
            include: {
                category: {
                    select: { name: true },
                },
            },
            take: 4,
        });
    } catch (error) {
        console.warn("getFeaturedProducts error", error);
        return [];
    }
}

export async function getProductBySlug(slug: string) {
    try {
        return await prisma.product.findUnique({
            where: { slug },
            include: { category: true },
        });
    } catch (error) {
        console.warn("getProductBySlug error", error);
        return null;
    }
}

export async function generateUniqueSlug(name: string, ignoreId?: string): Promise<string> {
    let slug = slugify(name);
    let count = 1;
    let exists = true;

    while (exists) {
        const query: any = { slug };
        if (ignoreId) {
            query.id = { not: ignoreId };
        }

        const product = await prisma.product.findFirst({ where: query });
        if (product) {
            slug = `${slugify(name)}-${count}`;
            count++;
        } else {
            exists = false;
        }
    }

    return slug;
}
