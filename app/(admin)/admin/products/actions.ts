'use server';

import { prisma } from "@/lib/db";
import { generateUniqueSlug } from "@/lib/services/slug.service";
import { revalidatePath } from "next/cache";

import { actionClient } from "@/lib/safe-action";
import { productSchema } from "@/lib/validations/product";
import { z } from "zod";

export const createProductAction = actionClient
    .schema(productSchema)
    .action(async ({ parsedInput }) => {
        try {
            const { name, shortDescription, description, categoryId, price, isActive, isFeatured, images } = parsedInput;

            const slug = await generateUniqueSlug(name, 'product');

            await prisma.product.create({
                data: {
                    name,
                    slug,
                    shortDescription: shortDescription || null,
                    description,
                    categoryId,
                    price: price === '' ? null : Number(price),
                    isActive,
                    isFeatured,
                    images
                }
            });

            revalidatePath('/admin/products');
            revalidatePath('/products');

            return { success: true };
        } catch (e: any) {
            return { success: false, error: e.message || "Bir hata oluştu" };
        }
    });

const updateProductSchema = productSchema.extend({
    id: z.string().cuid(),
});

export const updateProductAction = actionClient
    .schema(updateProductSchema)
    .action(async ({ parsedInput }) => {
        try {
            const { id, name, shortDescription, description, categoryId, price, isActive, isFeatured, images } = parsedInput;

            const existingProduct = await prisma.product.findUnique({ where: { id } });
            if (!existingProduct) return { success: false, error: "Ürün bulunamadı." };

            let slug = existingProduct.slug;
            if (existingProduct.name !== name) {
                slug = await generateUniqueSlug(name, 'product', id);
            }

            await prisma.product.update({
                where: { id },
                data: {
                    name,
                    slug,
                    shortDescription: shortDescription || null,
                    description,
                    categoryId,
                    price: price === '' ? null : Number(price),
                    isActive,
                    isFeatured,
                    images
                }
            });

            revalidatePath('/admin/products');
            revalidatePath(`/products/${slug}`);
            revalidatePath('/products');

            return { success: true };
        } catch (e: any) {
            return { success: false, error: e.message || "Güncelleme sırasında bir hata oluştu" };
        }
    });

const deleteProductSchema = z.object({
    id: z.string().cuid(),
});

export const deleteProductAction = actionClient
    .schema(deleteProductSchema)
    .action(async ({ parsedInput }) => {
        try {
            await prisma.product.delete({ where: { id: parsedInput.id } });
            revalidatePath('/admin/products');
            revalidatePath('/products');
            return { success: true };
        } catch (e) {
            return { success: false, error: "Silme işlemi başarısız" };
        }
    });
