import { prisma } from '../db';
import { unstable_cache } from 'next/cache';
import { CACHE_TAGS } from '../cache/tags';

export const getCategories = unstable_cache(
    async () => {
        try {
            return await prisma.category.findMany({
                orderBy: { order: "asc" },
            });
        } catch (error) {
            console.warn("Database connection skipped during build / getCategories error", error);
            return [];
        }
    },
    ['categories-list'],
    { tags: [CACHE_TAGS.categories], revalidate: 3600 }
);

export const getCategoryBySlug = unstable_cache(
    async (slug: string) => {
        try {
            return await prisma.category.findUnique({
                where: { slug },
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
        } catch (error) {
            console.warn("getCategoryBySlug error", error);
            return null;
        }
    },
    ['category-detail'],
    { tags: [CACHE_TAGS.categories, CACHE_TAGS.products], revalidate: 3600 }
);
