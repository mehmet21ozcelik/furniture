import { prisma } from '../db';
import { slugify } from '../utils';

type SlugModel = 'product' | 'category';

export async function generateUniqueSlug(name: string, model: SlugModel, ignoreId?: string): Promise<string> {
    let slug = slugify(name);
    let count = 1;
    let exists = true;

    while (exists) {
        const query: any = { slug };
        if (ignoreId) {
            query.id = { not: ignoreId };
        }

        let record;

        if (model === 'product') {
            record = await prisma.product.findFirst({ where: query });
        } else if (model === 'category') {
            record = await prisma.category.findFirst({ where: query });
        }

        if (record) {
            slug = `${slugify(name)}-${count}`;
            count++;
        } else {
            exists = false;
        }
    }

    return slug;
}
