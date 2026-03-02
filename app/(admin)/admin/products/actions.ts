'use server';

import { prisma } from "@/lib/db";
import { slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProductAction(formData: FormData) {
    try {
        const name = formData.get('name') as string;
        const shortDescription = formData.get('shortDescription') as string | null;
        const description = formData.get('description') as string;
        const categoryId = formData.get('categoryId') as string;
        const priceStr = formData.get('price') as string;
        const price = priceStr ? parseFloat(priceStr) : null;
        const isActive = formData.get('isActive') === 'on';
        const isFeatured = formData.get('isFeatured') === 'on';
        const imagesStr = formData.get('images') as string;
        const images = imagesStr
            ? imagesStr.split(',')
                .map(s => s.trim())
                .filter(s => s.startsWith('/') || s.startsWith('http'))
            : [];

        if (!name || !description || !categoryId) {
            throw new Error("Gerekli alanları doldurun.");
        }

        let slug = slugify(name);
        // check unique slug
        let count = 1;
        while (await prisma.product.findUnique({ where: { slug } })) {
            slug = `${slugify(name)}-${count}`;
            count++;
        }

        const product = await prisma.product.create({
            data: {
                name,
                slug,
                shortDescription,
                description,
                categoryId,
                price,
                isActive,
                isFeatured,
                images
            }
        });

        revalidatePath('/admin/products');
        revalidatePath('/products');

    } catch (e: any) {
        throw new Error(e.message || "Bir hata oluştu");
    }

    redirect('/admin/products');
}

export async function updateProductAction(id: string, formData: FormData) {
    try {
        const name = formData.get('name') as string;
        const shortDescription = formData.get('shortDescription') as string | null;
        const description = formData.get('description') as string;
        const categoryId = formData.get('categoryId') as string;
        const priceStr = formData.get('price') as string;
        const price = priceStr ? parseFloat(priceStr) : null;
        const isActive = formData.get('isActive') === 'on';
        const isFeatured = formData.get('isFeatured') === 'on';
        const imagesStr = formData.get('images') as string;
        const images = imagesStr
            ? imagesStr.split(',')
                .map(s => s.trim())
                .filter(s => s.startsWith('/') || s.startsWith('http'))
            : [];

        if (!name || !description || !categoryId) {
            throw new Error("Gerekli alanları doldurun.");
        }

        const existingProduct = await prisma.product.findUnique({ where: { id } });
        if (!existingProduct) throw new Error("Ürün bulunamadı.");

        let slug = existingProduct.slug;
        if (existingProduct.name !== name) {
            slug = slugify(name);
            let count = 1;
            while (await prisma.product.findFirst({ where: { slug, id: { not: id } } })) {
                slug = `${slugify(name)}-${count}`;
                count++;
            }
        }

        await prisma.product.update({
            where: { id },
            data: {
                name,
                slug,
                shortDescription,
                description,
                categoryId,
                price,
                isActive,
                isFeatured,
                images
            }
        });

        revalidatePath('/admin/products');
        revalidatePath(`/products/${slug}`);
        revalidatePath('/products');

    } catch (e: any) {
        throw new Error(e.message || "Güncelleme sırasında bir hata oluştu");
    }

    redirect('/admin/products');
}

export async function deleteProductAction(id: string) {
    try {
        await prisma.product.delete({ where: { id } });
        revalidatePath('/admin/products');
        revalidatePath('/products');
        return { success: true };
    } catch (e) {
        return { success: false, error: "Silme işlemi başarısız" };
    }
}
